/**
 * Generic Input-Based Review Generation Engine
 * Transforms arbitrary dynamic customer answers into fluent, natural reviews.
 * 
 * Rules:
 * 1. Truthful / Fact Preservation: Never invent facts, prices, treatments, or details not supplied.
 * 2. Composable Sentences: Generic question context + answer -> grammatically complete clauses.
 * 3. Rating-Aware: Tone adapts to 1, 2, 3, 4, or 5 stars.
 * 4. Multi-Language: Fluent English, Hindi, and Marathi without literal translation.
 * 5. Repetition Control: Uses variationIndex to produce different valid sentence structures on Regenerate.
 */

// Safe text cleaning
function cleanText(str) {
  if (!str) return '';
  return String(str).trim().replace(/^[,\s;:\-\.]+/, '').replace(/[,\s;:\-\.]+$/, '');
}

// Capitalize first character
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Lowercase first character
function lowercaseFirst(str) {
  if (!str) return '';
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// Extract subject noun phrase from arbitrary question
function extractSubjectFromQuestion(questionStr) {
  if (!questionStr) return '';
  const q = questionStr.trim().replace(/[?!.]+$/, '');

  // 1. "How was/were the/your X"
  let match = q.match(/how\s+(?:was|were|is|are)\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 2. "What did you like (most/best) about the/your X"
  match = q.match(/what\s+did\s+you\s+like\s*(?:most|best)?\s*about\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 3. "What stood out (to you) (about / during / in) X"
  match = q.match(/what\s+stood\s+out\s*(?:to\s+you)?\s*(?:about|during|in)?\s*(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 4. "How would you rate the/your X"
  match = q.match(/how\s+would\s+you\s+rate\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 5. "What do/did you think of/about X"
  match = q.match(/what\s+(?:do|did)\s+you\s+think\s+(?:of|about)\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 6. "Any feedback/thoughts on X"
  match = q.match(/(?:any\s+feedback|thoughts)\s+on\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 7. "Tell us about X"
  match = q.match(/tell\s+us\s+about\s+(?:the|your|our)?\s*([^?]+)/i);
  if (match) return normalizeSubject(match[1]);

  // 8. Hindi question patterns
  match = q.match(/^(.*?)\s+(?:कैसा था|कैसी थी|कैसी रहीं|कैसा रहा|कैसी थीं|कैसा लगा)/u);
  if (match && match[1]) return match[1].trim();
  match = q.match(/^(?:आपको|यहाँ)\s+(.*?)\s+(?:कैसा लगा|कैसी लगी)/u);
  if (match && match[1]) return match[1].trim();

  // 9. Marathi question patterns
  match = q.match(/^(.*?)\s+(?:कसे होते|कसा होता|कशी होती|कसे वाटले|कशी वाटली)/u);
  if (match && match[1]) return match[1].trim();
  match = q.match(/^(?:तुम्हाला)\s+(.*?)\s+(?:कसे वाटले|काय आवडले)/u);
  if (match && match[1]) return match[1].trim();

  // 10. If short label question: "Food & Quality", "Staff Attention", "Cleanliness"
  if (q.split(/\s+/).length <= 3 && !questionStr.includes('?')) {
    return normalizeSubject(q);
  }

  return '';
}

function normalizeSubject(str) {
  let s = str.trim().toLowerCase();
  s = s.replace(/\s+(during|on|at|in)\s+(your|our|the)\s+.*$/i, '');
  s = s.replace(/\s+(most|best|overall)$/i, '');
  s = s.replace(/^(the|your|our)\s+/i, '');
  return s.trim();
}

// Normalize incoming answers from various shapes into Array<{ question: string, answer: string }>
function normalizeAnswers(rawAnswers) {
  if (!rawAnswers) return [];
  if (Array.isArray(rawAnswers)) {
    return rawAnswers
      .map(item => {
        if (!item) return null;
        if (typeof item === 'string') return { question: '', answer: cleanText(item) };
        if (typeof item === 'object') {
          const q = item.question || item.q || '';
          const a = item.answer || item.value || item.a || item.label || '';
          return { question: cleanText(q), answer: cleanText(a) };
        }
        return null;
      })
      .filter(item => item && item.answer);
  }
  if (typeof rawAnswers === 'object') {
    return Object.entries(rawAnswers)
      .map(([k, v]) => ({ question: cleanText(k), answer: cleanText(v) }))
      .filter(item => item.answer);
  }
  return [];
}

// English Clause Transformer
function transformEnglishClause({ subject, answer, doctorName, variationIndex = 0 }) {
  const ans = cleanText(answer);
  if (!ans) return '';
  const lowerAns = ans.toLowerCase();

  // A. Check if answer is ALREADY a complete clause/sentence
  // e.g. "The doctor explained everything clearly", "Everything was great", "I loved the food", "Waiting time was low"
  const hasSubjectAndVerb =
    /^(i|we|they|the|my|everyone|everything|dr\.?)\s+/i.test(ans) &&
    /\b(was|were|is|are|had|explained|helped|did|listened|took|made|offered|served|treated)\b/i.test(ans);
  if (hasSubjectAndVerb) {
    return capitalizeFirst(ans);
  }

  if (/^waiting\s+time\s+(?:was|is)/i.test(ans)) {
    return 'The ' + lowercaseFirst(ans);
  }

  // B. Answer starts with past-tense verb: "Explained clearly", "Helped with admission", "Listened patiently"
  const pastVerbMatch = ans.match(/^(explained|listened|helped|took|handled|treated|answered|guided|provided|cared|offered)\b(.*)/i);
  if (pastVerbMatch) {
    const verbPhrase = lowercaseFirst(ans);
    let subj = 'they';
    if (subject === 'doctor' && doctorName) {
      subj = doctorName;
    } else if (subject) {
      subj = 'the ' + subject;
    }
    const capSubj = capitalizeFirst(subj);

    const patterns = [
      () => `${capSubj} ${verbPhrase}`,
      () => `I really appreciated that ${subj} ${verbPhrase}`,
      () => `${capSubj} took great care and ${verbPhrase}`,
      () => `Throughout the visit, ${subj} ${verbPhrase}`
    ];
    return patterns[variationIndex % patterns.length]();
  }

  // C. Answer is an adjective or descriptive phrase: "Very polite", "Quick and smooth", "Clean and hygienic", "Very fresh"
  if (subject) {
    const isPlural = /s$/.test(subject) && !['staff', 'business', 'process', 'fitness'].includes(subject);
    const wasVerb = isPlural ? 'were' : 'was';
    const subjName = (subject === 'doctor' && doctorName) ? doctorName : ('the ' + subject);
    const capSubj = capitalizeFirst(subjName);

    // If answer is noun phrase matching the subject, e.g. answer "quick service" and subject "service"
    const nounAdjMatch = lowerAns.match(/^([a-z]+)\s+([a-z]+)$/);
    if (nounAdjMatch && (nounAdjMatch[2] === subject || subject.includes(nounAdjMatch[2]))) {
      const adj = nounAdjMatch[1];
      return `${capSubj} ${wasVerb} ${adj}`;
    }

    const patterns = [
      () => `${capSubj} ${wasVerb} ${lowerAns}`,
      () => `I found ${subjName} to be ${lowerAns}`,
      () => `${capSubj} ${wasVerb} genuinely ${lowerAns}`,
      () => `Everything regarding ${subjName} ${wasVerb} ${lowerAns}`
    ];
    return patterns[variationIndex % patterns.length]();
  }

  // D. Answer is a noun phrase without question subject: "Friendly staff", "Quick service", "Clean environment"
  if (/^(quick|friendly|clean|great|good|excellent|polite|minimal|reasonable|fast)\s+[a-z]+/i.test(ans)) {
    const patterns = [
      () => `I was very pleased with the ${lowerAns}`,
      () => `The ${lowerAns} stood out to me`,
      () => `I really appreciated the ${lowerAns}`,
      () => `The ${lowerAns} made a very positive impression`
    ];
    return patterns[variationIndex % patterns.length]();
  }

  // E. Standalone adjective: "Excellent", "Very good", "Great", "Smooth"
  if (/^(excellent|very good|good|satisfactory|great|smooth|fast|prompt|fair)$/i.test(ans)) {
    const patterns = [
      () => `The overall experience was ${lowerAns}`,
      () => `Everything was ${lowerAns}`,
      () => `I found the service to be ${lowerAns}`
    ];
    return patterns[variationIndex % patterns.length]();
  }

  // Fallback: preserve answer with proper capitalization
  return capitalizeFirst(ans);
}

// Hindi Clause Transformer
function transformHindiClause({ question, answer, doctorName, variationIndex = 0 }) {
  let ans = cleanText(answer);
  if (!ans) return '';
  if (ans.endsWith('।') || ans.endsWith('.')) ans = ans.slice(0, -1).trim();

  const q = (question || '').toLowerCase();
  const subj = extractSubjectFromQuestion(question);

  // Check doctor
  if (q.includes('doctor') || q.includes('डॉक्टर')) {
    const doc = doctorName || 'डॉक्टर';
    if (!ans.includes(doc)) {
      if (/समझाया|बताया|देखा|कहा|मार्गदर्शन/i.test(ans)) {
        return `${doc} ने ${ans}`;
      }
      const intensifier = /बहुत|काफी|अत्यंत|खूब/u.test(ans) ? '' : 'काफी ';
      return `${doc} ${intensifier}${ans} थे`;
    }
  }

  // Check staff
  if (q.includes('staff') || q.includes('स्टाफ') || q.includes('कर्मचारी')) {
    if (!ans.includes('स्टाफ') && !ans.includes('कर्मचारी')) {
      return `यहाँ का स्टाफ ${ans} था`;
    }
  }

  // Generic subject for Hindi if extracted
  if (subj && !ans.includes(subj)) {
    const isPlural = /एं$|एँ$|सुविधाएं|सेवाएं/u.test(subj);
    const verb = isPlural ? 'थीं' : 'था';
    return `${subj} ${ans} ${verb}`;
  }

  return ans;
}

// Marathi Clause Transformer
function transformMarathiClause({ question, answer, doctorName, variationIndex = 0 }) {
  let ans = cleanText(answer);
  if (!ans) return '';
  if (ans.endsWith('.')) ans = ans.slice(0, -1).trim();

  const q = (question || '').toLowerCase();
  const subj = extractSubjectFromQuestion(question);

  // Check doctor
  if (q.includes('doctor') || q.includes('डॉक्टर')) {
    const doc = doctorName || 'डॉक्टर';
    if (!ans.includes(doc)) {
      if (/सांगितले|तपासले|केले|समजावून/i.test(ans)) {
        return `${doc} यांनी ${ans}`;
      }
      const intensifier = /अतिशय|खूप|फार/u.test(ans) ? '' : 'अतिशय ';
      return `${doc} ${intensifier}${ans} होते`;
    }
  }

  // Check staff
  if (q.includes('staff') || q.includes('स्टाफ') || q.includes('कर्मचारी')) {
    if (!ans.includes('स्टाफ') && !ans.includes('कर्मचारी')) {
      return `येथील स्टाफ ${ans} होता`;
    }
  }

  // Generic subject for Marathi if extracted
  if (subj && !ans.includes(subj)) {
    const isPlural = /सहकार्य|सेवा|सुविधा/u.test(subj);
    const verb = isPlural ? 'होते' : 'होता';
    return `${subj} ${ans} ${verb}`;
  }

  return ans;
}

// Base phrasing components library
const DEFAULT_COMPONENTS = {
  openings: {
    english: {
      5: [
        'I had a truly wonderful experience at {businessName}.',
        'Visiting {businessName} was a very positive experience.',
        'I had an exceptional experience at {businessName}.',
        'My visit to {businessName} went extremely well.',
        'I am very happy with my visit to {businessName}.'
      ],
      4: [
        'I had a very good experience at {businessName}.',
        'My visit to {businessName} went smoothly.',
        'I recently visited {businessName} and was quite pleased overall.',
        'Good experience at {businessName} today.'
      ],
      3: [
        'I recently visited {businessName}.',
        'Sharing my honest feedback regarding {businessName}.',
        'My visit to {businessName} was decent overall.'
      ],
      1_2: [
        'Sharing my feedback regarding my visit to {businessName}.',
        'I visited {businessName} recently.'
      ]
    },
    hindi: {
      5: [
        '{businessName} में मेरा अनुभव बहुत ही शानदार रहा।',
        '{businessName} की व्यवस्था और सेवाएं मुझे बहुत पसंद आईं।',
        '{businessName} में जाना हमारे लिए एक बेहतरीन अनुभव रहा।'
      ],
      4: [
        '{businessName} में मेरा अनुभव काफी अच्छा रहा।',
        '{businessName} की सेवाएं काफी संतोषजनक रहीं।'
      ],
      3: [
        '{businessName} में मेरा अनुभव सामान्य रहा।',
        '{businessName} की व्यवस्था ठीक-ठाक रही।'
      ],
      1_2: [
        '{businessName} के संबंध में मैं अपना अनुभव साझा कर रहा हूँ।'
      ]
    },
    marathi: {
      5: [
        '{businessName} मधील माझा अनुभव अत्यंत उत्तम आणि समाधानकारक राहिला.',
        '{businessName} ची व्यवस्था आणि सेवा मला मनापासून आवडली.',
        '{businessName} ला भेट दिल्यानंतर अतिशय आनंद झाला.'
      ],
      4: [
        '{businessName} मधील माझा अनुभव खूप चांगला राहिला.',
        '{businessName} ची सेवा समाधानकारक होती.'
      ],
      3: [
        '{businessName} मधील माझा अनुभव सर्वसाधारण राहिला.',
        '{businessName} ची व्यवस्था ठीक-ठाक होती.'
      ],
      1_2: [
        '{businessName} संदर्भात मी माझा अनुभव मांडत आहे.'
      ]
    }
  },
  closings: {
    english: {
      5: [
        'Overall, I am thoroughly satisfied with the experience.',
        'Truly a 5-star experience all around.',
        'I am extremely pleased with the service and would gladly recommend them.',
        'Everything was handled with utmost professionalism.'
      ],
      4: [
        'Overall, a very positive and satisfying experience.',
        'I am happy with how everything went.',
        'Overall, good service and a pleasant visit.'
      ],
      3: [
        'Overall, the experience was satisfactory.',
        'A decent visit overall.',
        'Reasonable experience with room for a few improvements.'
      ],
      1_2: [
        'Hoping management takes note of this feedback for future improvements.',
        'There is noticeable scope for improvement.'
      ]
    },
    hindi: {
      5: [
        'कुल मिलाकर यहाँ की सेवाएं बहुत ही बेहतरीन रहीं, बहुत धन्यवाद!',
        'समग्र अनुभव बहुत ही सुखद और संतोषजनक था।',
        'मैं यहाँ की सुविधाओं से पूरी तरह संतुष्ट हूँ।'
      ],
      4: [
        'कुल मिलाकर एक अच्छा और संतोषजनक अनुभव रहा।',
        'सेवाएं काफी अच्छी रहीं।'
      ],
      3: [
        'कुल मिलाकर अनुभव ठीक-ठाक रहा।'
      ],
      1_2: [
        'उम्मीद है कि भविष्य में सेवाओं में सुधार किया जाएगा।'
      ]
    },
    marathi: {
      5: [
        'एकंदरीत येथील सर्व सेवा उत्कृष्ट आणि प्रशंसनीय आहे, धन्यवाद!',
        'संपूर्ण अनुभव अतिशय समाधानकारक आणि सुखद राहिला.',
        'मी इथल्या सेवेबद्दल पूर्णपणे समाधानी आहे.'
      ],
      4: [
        'एकंदरीत एक चांगला आणि सुखद अनुभव आला.',
        'सेवा बरीच चांगली होती.'
      ],
      3: [
        'एकंदरीत अनुभव बरा राहिला.'
      ],
      1_2: [
        'भविष्यात या त्रुटींमध्ये सुधारणा व्हावी ही अपेक्षा.'
      ]
    }
  }
};

/**
 * Main review generator function
 */
function generateInputBasedReview({
  rating = 5,
  language = 'English',
  businessName = 'this business',
  doctorName = '',
  serviceName = '',
  answers = [],
  variationIndex = 0
}) {
  const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
  const rawLang = String(language || 'English').toLowerCase();
  let langKey = 'english';
  if (rawLang === 'मराठी' || rawLang === 'mr' || rawLang === 'marathi') {
    langKey = 'marathi';
  } else if (rawLang === 'हिंदी' || rawLang === 'hi' || rawLang === 'hindi') {
    langKey = 'hindi';
  }

  const normalizedAnswers = normalizeAnswers(answers);
  const vIndex = Math.abs(Number(variationIndex) || 0);

  // 1. Get rating tier for openings/closings
  const ratingTier = numRating >= 5 ? 5 : numRating === 4 ? 4 : numRating === 3 ? 3 : 1_2;

  // 2. Select Opening & Closing
  const openPool = DEFAULT_COMPONENTS.openings[langKey]?.[ratingTier] || DEFAULT_COMPONENTS.openings.english[5];
  const closePool = DEFAULT_COMPONENTS.closings[langKey]?.[ratingTier] || DEFAULT_COMPONENTS.closings.english[5];

  let rawOpening = openPool[vIndex % openPool.length];
  let rawClosing = closePool[(vIndex + 1) % closePool.length];

  const finalBusiness = cleanText(businessName) || (langKey === 'marathi' ? 'येथे' : langKey === 'hindi' ? 'यहाँ' : 'this business');
  const opening = rawOpening.replace(/{businessName}/g, finalBusiness);
  const closing = rawClosing.replace(/{businessName}/g, finalBusiness);

  // 3. Transform each answer into a factual grammatical clause
  const clauses = [];
  normalizedAnswers.forEach((item, idx) => {
    const subject = extractSubjectFromQuestion(item.question);
    let clause = '';

    if (langKey === 'marathi') {
      clause = transformMarathiClause({
        question: item.question,
        answer: item.answer,
        doctorName,
        variationIndex: vIndex + idx
      });
    } else if (langKey === 'hindi') {
      clause = transformHindiClause({
        question: item.question,
        answer: item.answer,
        doctorName,
        variationIndex: vIndex + idx
      });
    } else {
      clause = transformEnglishClause({
        subject,
        answer: item.answer,
        doctorName,
        variationIndex: vIndex + idx
      });
    }

    if (clause) {
      clauses.push(cleanText(clause));
    }
  });

  // 4. Assemble into natural complete review based on clause count and language
  if (clauses.length === 0) {
    // If no answers provided, return rating-calibrated opening + closing without hallucinated facts
    if (doctorName && langKey === 'english') {
      return `I had a very good consultation with ${doctorName} at ${finalBusiness}. ${closing}`;
    }
    return `${opening} ${closing}`;
  }

  // ENGLISH ASSEMBLY
  if (langKey === 'english') {
    let body = '';
    const styleChoice = vIndex % 3;

    if (clauses.length === 1) {
      body = `${clauses[0]}.`;
    } else if (clauses.length === 2) {
      if (styleChoice === 0) {
        body = `${clauses[0]}, and ${lowercaseFirst(clauses[1])}.`;
      } else if (styleChoice === 1) {
        body = `${clauses[0]}. In addition, ${lowercaseFirst(clauses[1])}.`;
      } else {
        body = `${clauses[0]}. Along with that, ${lowercaseFirst(clauses[1])}.`;
      }
    } else if (clauses.length === 3) {
      if (styleChoice === 0) {
        body = `${clauses[0]}, and ${lowercaseFirst(clauses[1])}. Furthermore, ${lowercaseFirst(clauses[2])}.`;
      } else if (styleChoice === 1) {
        body = `${clauses[0]}. What also stood out was that ${lowercaseFirst(clauses[1])}, and ${lowercaseFirst(clauses[2])}.`;
      } else {
        body = `${clauses[0]}. Along with that, ${lowercaseFirst(clauses[1])}. In addition, ${lowercaseFirst(clauses[2])}.`;
      }
    } else {
      // 4 or more clauses
      const firstTwo = `${clauses[0]}, and ${lowercaseFirst(clauses[1])}.`;
      const remaining = clauses.slice(2).map((c, i) => {
        const conn = i % 2 === 0 ? 'In addition, ' : 'Along with that, ';
        return `${conn}${lowercaseFirst(c)}.`;
      }).join(' ');
      body = `${firstTwo} ${remaining}`;
    }

    // Structure variation: occasionally start directly with the first experience clause for natural variety
    if (styleChoice === 2 && clauses.length >= 2 && numRating >= 4) {
      return `${clauses[0]}. ${clauses.slice(1).map(c => `Along with that, ${lowercaseFirst(c)}.`).join(' ')} ${closing}`;
    }

    return `${opening} ${body} ${closing}`;
  }

  // HINDI ASSEMBLY
  if (langKey === 'hindi') {
    const connectors = ['साथ ही, ', 'इसके अलावा, ', 'विशेष रूप से '];
    let body = '';
    if (clauses.length === 1) {
      body = `${clauses[0]}।`;
    } else if (clauses.length === 2) {
      body = `${clauses[0]}, और ${clauses[1]}।`;
    } else {
      const conn = connectors[vIndex % connectors.length];
      body = `${clauses[0]}। ${conn}${clauses[1]}, तथा ${clauses[2]}।`;
    }
    return `${opening} ${body} ${closing}`;
  }

  // MARATHI ASSEMBLY
  if (langKey === 'marathi') {
    const connectors = ['तसेच, ', 'यासोबतच, ', 'विशेषतः म्हणजे, '];
    let body = '';
    if (clauses.length === 1) {
      body = `${clauses[0]}.`;
    } else if (clauses.length === 2) {
      body = `${clauses[0]}, आणि ${clauses[1]}.`;
    } else {
      const conn = connectors[vIndex % connectors.length];
      body = `${clauses[0]}. ${conn}${clauses[1]}, आणि ${clauses[2]}.`;
    }
    return `${opening} ${body} ${closing}`;
  }

  return `${opening} ${clauses.join('. ')}. ${closing}`;
}

module.exports = {
  generateInputBasedReview,
  normalizeAnswers,
  extractSubjectFromQuestion,
  DEFAULT_COMPONENTS
};
