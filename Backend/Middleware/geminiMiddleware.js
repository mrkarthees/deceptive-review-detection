import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export async function moderateReview(review) {
	try {
		const prompt = `
You are an ecommerce review moderator.

Check this review.

Reject if it contains

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

Return ONLY JSON.

{
"safe":true,
"reason":""
}

Review:
${review}
`;

		const response = await ai.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: prompt,

			config: {
				responseMimeType: 'application/json',
			},
		});

		return JSON.parse(response.text);
	} catch (err) {
		console.log(err);

		return {
			safe: false,
			reason: 'Gemini Error',
		};
	}
}
