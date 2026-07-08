import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function moderateReview(review) {
	try {
		// Check API Key
		if (!process.env.GEMINI_API_KEY) {
			throw new Error('GEMINI_API_KEY is missing in .env');
		}

		const prompt = `
You are an ecommerce review moderator.

Your job is to decide whether a product review is safe.

Reject reviews containing:
- Bad words
- Profanity
- Hate speech
- Violence
- Threats
- Racism
- Sexual content
- Fake promotion
- Scam
- Terrorism
- Personal attacks

Return ONLY valid JSON.

Example:

{
  "safe": true,
  "reason": ""
}

or

{
  "safe": false,
  "reason": "Violence"
}

Review:
"${review}"
`;

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt,
			config: {
				responseMimeType: 'application/json',
			},
		});

		console.log('========== GEMINI RESPONSE ==========');
		console.dir(response, { depth: null });

		let text;

		if (typeof response.text === 'function') {
			text = await response.text();
		} else {
			text = response.text;
		}

		console.log('========== GEMINI TEXT ==========');
		console.log(text);

		if (!text) {
			throw new Error('Gemini returned empty response.');
		}

		try {
			return JSON.parse(text);
		} catch (parseError) {
			console.error('JSON Parse Error:', parseError);

			return {
				safe: false,
				reason: 'Invalid JSON returned by Gemini',
			};
		}
	} catch (err) {
		console.error('========== GEMINI ERROR ==========');
		console.error(err);

		if (err.stack) {
			console.error(err.stack);
		}

		return {
			safe: false,
			reason: err.message || 'Gemini Error',
		};
	}
}
