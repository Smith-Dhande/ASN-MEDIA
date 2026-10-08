const assert = require('assert');
const {
  generateInputBasedReview,
  extractSubjectFromQuestion,
  transformEnglishClause,
  transformHindiClause,
  transformMarathiClause
} = require('./utils/reviewGenerator');

console.log('====================================');
console.log('RUNNING REVIEW GENERATOR TEST SUITE');
console.log('====================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] Test ${totalTests}: ${name}`);
    console.error(err);
  }
}

// 1. Arbitrary question + answer
runTest('Arbitrary question + answer (e.g. "How was the packaging?" -> "Eco-friendly")', () => {
  const result = generateInputBasedReview({
    businessName: 'GreenEarth Co.',
    rating: 5,
    language: 'English',
    answers: [{ question: 'How was the packaging?', answer: 'Eco-friendly' }]
  });
  assert(result.length > 10, 'Review should not be empty');
  assert(/eco-friendly/i.test(result), 'Review must mention eco-friendly');
  console.log('   Result:', result);
});

// 2. Multiple arbitrary questions
runTest('Multiple arbitrary questions (gym / fitness context)', () => {
  const result = generateInputBasedReview({
    businessName: 'Apex Fitness',
    rating: 5,
    language: 'English',
    answers: [
      { question: 'How was the gym equipment?', answer: 'Well maintained and modern' },
      { question: 'What did you think of the trainers?', answer: 'Very encouraging and knowledgeable' },
      { question: 'How was the overall vibe?', answer: 'Energetic and clean' }
    ]
  });
  assert(/well maintained/i.test(result), 'Must mention well maintained equipment');
  assert(/trainers|encouraging/i.test(result), 'Must mention trainers/encouraging');
  assert(/energetic/i.test(result), 'Must mention vibe/energetic');
  console.log('   Result:', result);
});

// 3. Only one answer
runTest('Only one answer provided', () => {
  const result = generateInputBasedReview({
    businessName: 'QuickFix Auto',
    rating: 4,
    language: 'English',
    answers: [{ question: 'What impressed you the most?', answer: 'Quick service' }]
  });
  assert(/quick service/i.test(result), 'Must communicate quick service');
  console.log('   Result:', result);
});

// 4. Multiple answers
runTest('Multiple answers across different business dimensions', () => {
  const result = generateInputBasedReview({
    businessName: 'Saffron Bistro',
    rating: 5,
    language: 'English',
    answers: [
      { question: 'What did you like about the food?', answer: 'Very fresh and flavorful' },
      { question: 'How was the seating area?', answer: 'Comfortable and spacious' }
    ]
  });
  assert(/fresh/i.test(result) && /comfortable/i.test(result), 'Must include both food and seating feedback');
  console.log('   Result:', result);
});

// 5. Empty answer handling
runTest('Empty answers (filtered gracefully, no crashes or blank gaps)', () => {
  const result = generateInputBasedReview({
    businessName: 'Apex Law',
    rating: 5,
    language: 'English',
    answers: [
      { question: 'How was consultation?', answer: '' },
      { question: 'What did you think of timing?', answer: '  ' },
      { question: 'How was communication?', answer: 'Clear and responsive' }
    ]
  });
  assert(/clear and responsive/i.test(result), 'Must retain valid answers');
  assert(!result.includes('undefined') && !result.includes('null'), 'Must not contain undefined or null');
  console.log('   Result:', result);
});

// 6. Free-text answer
runTest('Free-text answer preservation without distortion', () => {
  const freeText = 'The team explained every detail thoroughly before starting';
  const result = generateInputBasedReview({
    businessName: 'Dental Care Plus',
    rating: 5,
    language: 'English',
    answers: [{ question: 'Any additional comments?', answer: freeText }]
  });
  assert(result.includes(freeText), 'Must preserve customer free-text verbatim or properly formatted');
  console.log('   Result:', result);
});

// 7. 5-star review (enthusiastic tone)
runTest('5-star review tone calibration', () => {
  const result = generateInputBasedReview({
    businessName: 'Urban Cafe',
    rating: 5,
    language: 'English',
    answers: [{ question: 'How was the coffee?', answer: 'Rich and smooth' }]
  });
  assert(/wonderful|great|positive|exceptional|delighted|pleasure|happy|5-star/i.test(result), '5-star tone should be enthusiastic/positive');
  console.log('   Result:', result);
});

// 8. 3-star review (moderate/balanced tone)
runTest('3-star review tone calibration', () => {
  const result = generateInputBasedReview({
    businessName: 'City Motors',
    rating: 3,
    language: 'English',
    answers: [{ question: 'How was the experience?', answer: 'Decent overall' }]
  });
  assert(!/outstanding|flawless|exceptional/i.test(result), '3-star tone must not be excessively enthusiastic');
  assert(/decent|fair|reasonable|alright/i.test(result), '3-star tone must be balanced');
  console.log('   Result:', result);
});

// 9. 1-2 star review (constructive/honest tone)
runTest('1-2 star review tone calibration', () => {
  const result = generateInputBasedReview({
    businessName: 'Express Parcel',
    rating: 1,
    language: 'English',
    answers: [{ question: 'What was the delivery experience?', answer: 'Significantly delayed' }]
  });
  assert(/delayed/i.test(result), 'Must communicate customer issue');
  assert(!/delighted|positive experience|great experience|wonderful/i.test(result), 'Must not use positive phrases for 1-star');
  console.log('   Result:', result);
});

// 10. English language generation
runTest('English language generation', () => {
  const result = generateInputBasedReview({
    businessName: 'Metro Cleaners',
    rating: 4,
    language: 'English',
    answers: [{ question: 'How was the laundry quality?', answer: 'Neat and crisp' }]
  });
  assert(/neat and crisp/i.test(result), 'English output must have proper content');
  console.log('   Result:', result);
});

// 11. Hindi language generation
runTest('Hindi language generation with native phrasing', () => {
  const result = generateInputBasedReview({
    businessName: 'सूर्य क्लिनिक',
    rating: 5,
    language: 'हिंदी',
    answers: [
      { question: 'स्टाफ का व्यवहार कैसा था?', answer: 'बहुत विनम्र और मददगार' },
      { question: 'सुविधाएं कैसी थीं?', answer: 'साफ-सुथरी और व्यवस्थित' }
    ]
  });
  assert(result.includes('बहुत विनम्र') || result.includes('विनम्र'), 'Hindi output must retain answers');
  assert(/अनुभव|व्यवहार|सुविधाएं|रहा|था/u.test(result), 'Hindi output must use native Hindi words');
  console.log('   Result:', result);
});

// 12. Marathi language generation
runTest('Marathi language generation with native phrasing', () => {
  const result = generateInputBasedReview({
    businessName: 'सह्याद्री हॉस्पिटल',
    rating: 5,
    language: 'मराठी',
    answers: [
      { question: 'डॉक्टरांचे मार्गदर्शन कसे होते?', answer: 'अतिशय उत्तम आणि स्पष्ट' },
      { question: 'कर्मचाऱ्यांचे सहकार्य कसे होते?', answer: 'खूप नम्र आणि तत्पर' }
    ]
  });
  assert(result.includes('अतिशय उत्तम') || result.includes('नम्र'), 'Marathi output must retain answers');
  assert(/अनुभव|होता|होते|छान|उत्तम/u.test(result), 'Marathi output must use native Marathi phrasing');
  console.log('   Result:', result);
});

// 13. Regenerate functionality
runTest('Regenerate functionality (variationIndex progression)', () => {
  const answers = [
    { question: 'How was the service?', answer: 'Fast and responsive' },
    { question: 'How was the staff?', answer: 'Polite' }
  ];
  const v1 = generateInputBasedReview({ businessName: 'TechStore', rating: 5, language: 'English', answers, variationIndex: 0 });
  const v2 = generateInputBasedReview({ businessName: 'TechStore', rating: 5, language: 'English', answers, variationIndex: 1 });
  const v3 = generateInputBasedReview({ businessName: 'TechStore', rating: 5, language: 'English', answers, variationIndex: 2 });

  console.log('   v1:', v1);
  console.log('   v2:', v2);
  console.log('   v3:', v3);

  assert.notStrictEqual(v1, v2, 'Regeneration variation 1 and 2 must not be identical');
  assert.notStrictEqual(v2, v3, 'Regeneration variation 2 and 3 must not be identical');
});

// 14. Same answers producing different valid structures
runTest('Same answers producing different valid sentence structures', () => {
  const answers = [{ question: 'What stood out during your visit?', answer: 'Friendly staff and prompt service' }];
  const run1 = generateInputBasedReview({ rating: 4, language: 'English', answers, variationIndex: 0 });
  const run2 = generateInputBasedReview({ rating: 4, language: 'English', answers, variationIndex: 1 });
  assert.notStrictEqual(run1, run2, 'Different variationIndex should generate varied wording/openings');
});

// 15. Verify no unsupported facts are introduced (Zero Hallucination)
runTest('Verify NO unsupported facts are introduced (Fact Preservation)', () => {
  const question = 'What impressed you the most?';
  const answer = 'Quick service';
  const result = generateInputBasedReview({
    businessName: 'AutoCare',
    rating: 5,
    language: 'English',
    answers: [{ question, answer }]
  });

  console.log('   Result:', result);
  // Must NOT include things the user never mentioned:
  const forbiddenFacts = [
    'friendly staff',
    'delicious food',
    'clean room',
    'affordable price',
    'painless surgery',
    'tasty',
    'discount',
    'cleanliness',
    'luxurious'
  ];

  for (const forbidden of forbiddenFacts) {
    assert(!result.toLowerCase().includes(forbidden), `Hallucinated fact detected: "${forbidden}"`);
  }
  assert(/quick service/i.test(result), 'Must preserve original customer fact');
});

console.log('\n====================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Passed`);
console.log('====================================');
