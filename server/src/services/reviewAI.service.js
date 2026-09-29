import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate AI review based strictly on customer selections
 * @param {Object} params
 * @param {string} params.clientName
 * @param {number} params.rating
 * @param {Array<{question: string, answer: string}>} params.answers
 * @param {string} [params.length='Medium']
 * @param {string} [params.tone='Friendly & Professional']
 * @returns {Promise<string>}
 */
export const generateReviewText = async ({ clientName, rating, answers, length = 'Medium', tone = 'Friendly & Professional' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const formattedAnswers = answers
    .filter((a) => a.answer && a.answer.trim() !== '')
    .map((a) => `- ${a.question}: ${a.answer}`)
    .join('\n');

  if (apiKey && apiKey.trim() !== '') {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a review writing assistant for a customer who visited "${clientName}".
Generate a genuine, human-sounding customer review for Google Reviews.

CRITICAL RULES:
1. Write the review in first person ("I had...", "The...").
2. Use ONLY the facts provided in the customer's selections below.
3. DO NOT INVENT any unmentioned facts, specific dish names, prices, staff names, discounts, or events not listed.
4. Match the ${rating}-star rating atmosphere (${rating}/5 stars).
5. Review length requested: ${length}. Tone: ${tone}.
6. Do NOT use buzzwords, corporate marketing jargon, or fake enthusiasm.
7. NEVER mention AI, prompts, or automated generation.
8. Output ONLY the final review text without quotes, introductory text, or markdown tags.

CLIENT NAME: ${clientName}
STAR RATING: ${rating} / 5
CUSTOMER SELECTIONS:
${formattedAnswers || '- Customer had a overall pleasant visit.'}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      if (text) {
        text = text.trim().replace(/^["']|["']$/g, '');
        return text;
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent fallback generator:', err.message);
    }
  }

  // Fallback intelligent review builder (No API Key or API error)
  return fallbackGenerateReview({ clientName, rating, answers, length });
};

/**
 * Fallback generator synthesizing user choices cleanly
 */
function fallbackGenerateReview({ clientName, rating, answers, length }) {
  const answerMap = {};
  answers.forEach((item) => {
    if (item.answer) {
      answerMap[item.question] = item.answer;
    }
  });

  const selectionsList = Object.values(answerMap).filter(Boolean);

  let result = `Had a ${rating >= 4 ? 'great' : rating === 3 ? 'decent' : 'disappointing'} experience at ${clientName}. `;

  if (selectionsList.length > 0) {
    if (selectionsList.length === 1) {
      result += `What stood out to me most was the ${selectionsList[0].toLowerCase()}. `;
    } else if (selectionsList.length === 2) {
      result += `I particularly appreciated the ${selectionsList[0].toLowerCase()} and ${selectionsList[1].toLowerCase()}. `;
    } else {
      const mainFeatures = selectionsList.slice(0, selectionsList.length - 1).join(', ').toLowerCase();
      const lastFeature = selectionsList[selectionsList.length - 1].toLowerCase();
      result += `I really liked the ${mainFeatures} as well as the ${lastFeature}. `;
    }
  }

  if (rating >= 4) {
    result += `Overall, it was a fantastic visit and I would definitely recommend ${clientName}!`;
  } else if (rating === 3) {
    result += `Overall, it was a fair experience.`;
  } else {
    result += `Hopefully my next visit will be better.`;
  }

  if (length === 'Short') {
    return result.split('. ').slice(0, 2).join('. ') + '.';
  }

  if (length === 'Detailed' && selectionsList.length > 0) {
    result += ` The level of quality really matched expectations and made the overall visit memorable.`;
  }

  return result;
}
