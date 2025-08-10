import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { GoogleGenAI, Type } from '@google/genai';
import { defineString } from 'firebase-functions/params';

setGlobalOptions({
	region: 'asia-southeast1',
	maxInstances: 10,
});

const geminiApiKey = defineString('GEMINI_API_KEY', {
	description: 'API key for Google Gemini',
});

const createGenAI = (): GoogleGenAI => {
	const apiKey = geminiApiKey.value();

	if (!apiKey) {
		throw new Error('GEMINI_API_KEY environment variable is required');
	}

	if (!apiKey.startsWith('AIza')) {
		throw new Error('GEMINI_API_KEY appears to be invalid format');
	}

	console.debug('[createGenAI] Gemini API key passed simple validation');

	return new GoogleGenAI({ apiKey });
};

const billExtractionSchema = {
	type: Type.OBJECT,
	properties: {
		restaurant: {
			type: Type.STRING,
			description:
				'Restaurant name with transliteration in parentheses, e.g., "สุกี้ยากี้ (Suki Yaki)"',
		},
		items: {
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				properties: {
					name: {
						type: Type.STRING,
						description:
							'Item name with translation in parentheses, e.g., "ข้าวผัด (Fried Rice)"',
					},
					amount: {
						type: Type.NUMBER,
						description: 'Total price for the line item (quantity × unit price)',
					},
				},
				required: ['name', 'amount'],
				propertyOrdering: ['name', 'amount'],
			},
		},
		adjustments: {
			type: Type.ARRAY,
			items: {
				type: Type.OBJECT,
				properties: {
					name: {
						type: Type.STRING,
						description:
							'Adjustment name with translation, e.g., "ภาษี (Tax)", "ค่าบริการ (Service Charge)"',
					},
					amount: {
						type: Type.NUMBER,
						description: 'Adjustment amount (positive or negative)',
					},
				},
				required: ['name', 'amount'],
				propertyOrdering: ['name', 'amount'],
			},
		},
		subTotal: {
			type: Type.NUMBER,
			description: 'Subtotal before adjustments',
		},
		grandTotal: {
			type: Type.NUMBER,
			description: 'Final total amount',
		},
		currency: {
			type: Type.STRING,
			description: 'Currency code (THB, USD, etc.)',
		},
		date: {
			type: Type.STRING,
			description: 'Date in YYYY-MM-DD format or null',
			nullable: true,
		},
		time: {
			type: Type.STRING,
			description: 'Time in HH:MM format or null',
			nullable: true,
		},
	},
	required: ['restaurant', 'items', 'subTotal', 'grandTotal', 'currency'],
	propertyOrdering: [
		'restaurant',
		'items',
		'adjustments',
		'subTotal',
		'grandTotal',
		'currency',
		'date',
		'time',
	],
};

const BILL_EXTRACTION_PROMPT = `Always think before giving the answer.

Extract structured data from this bill/receipt image:

1. Restaurant name: Include original text followed by phonetic transliteration (NOT translation) in parentheses
   Example: "สุกี้ยากี้ (Suki Yaki)"

2. Menu items: Include original name followed by English translation in parentheses
   Example: "ข้าวผัด (Fried Rice)"
   - Extract the total price for each line item (already includes quantity × unit price)
   - Some items in the list might be a promotion, discount, etc. Make sure to include as negative amount.

3. Adjustments (tax, service charge, discounts):
   Example: "ภาษี (Tax)", "ค่าบริการ (Service Charge)"
   - Include both positive and negative adjustments

4. Extract subtotal (before adjustments) and grand total (final amount)

5. Identify ISO 4217 currency code (THB, USD, etc.)
    - Make sure it's uppercase, e.g., THB, USD, EUR, etc.
	- Make sure it's the ISO 4217 currency code
	- If it's not in ISO 4217, use XXX as the currency code
	- Sometimes a bill might use BAHT, it must be converted to THB

6. Extract date and time if visible.
    - Make sure the date format is YYYY-MM-DD. Convert to this format if it's not in this format.
    - Make sure the time format is HH:MM (24-hour). Convert to this format if it's not in this format.

IMPORTANT:
- For restaurant names: Use TRANSLITERATION (how it sounds), not translation
- For menu items and adjustments: Use TRANSLATION (what it means)
- Always format as: 'Original Text (English)' for items that are not in English
- Verify spelling of the items and adjustments. Make sure your output is as accurate as possible.`;

/**
 * Process bill images using Google Gemini API
 * Extracts structured data from receipt images
 */
export const processBillv1 = onCall(
	{
		cors: true,
		memory: '1GiB',
		timeoutSeconds: 300,
	},
	async (request) => {
		console.log('[processBillv1] processBill created');

		try {
			const { imageData, mimeType } = request.data;
			if (!imageData || !mimeType) {
				throw new HttpsError('invalid-argument', 'imageData and mimeType are required');
			}

			const allowedTypes = [
				'image/jpeg',
				'image/png',
				'image/webp',
				'image/heic',
				'image/heif',
			];

			if (!allowedTypes.includes(mimeType)) {
				throw new HttpsError(
					'invalid-argument',
					`Unsupported image type: ${mimeType}. Allowed: ${allowedTypes.join(', ')}`
				);
			}

			console.log(`[processBillv1] [debugMe] Processing image of type: ${mimeType}`);

			const genAI = createGenAI();

			const imagePart = {
				inlineData: {
					data: imageData,
					mimeType: mimeType,
				},
			};

			console.debug('[processBillv1] [debugMe]image data: ', imageData);
			console.log('[processBillv1] Calling Gemini API for bill extraction...');

			const result = await genAI.models.generateContent({
				model: 'gemini-2.5-flash-lite',
				contents: [BILL_EXTRACTION_PROMPT, imagePart],
				config: {
					responseMimeType: 'application/json',
					responseSchema: billExtractionSchema,
				},
			});

			const extractedData = JSON.parse(result.text || '{}');
			console.log('Successfully extracted bill data:', extractedData);

			if (!extractedData.restaurant || !extractedData.items || !extractedData.grandTotal) {
				console.error('[processBillv1] [debugMe] Cannot extract data: ', imageData);
				console.error('[processBillv1] [debugMe] Get the following results: ', result);
				console.error('[processBillv1] [debugMe] Extracted data: ', extractedData);
				throw new HttpsError('internal', 'Extracted data missing required fields');
			}

			return {
				success: true,
				message: 'Bill processed successfully',
				timestamp: new Date().toISOString(),
				extractedData,
			};
		} catch (error) {
			const sanitizedError =
				error instanceof Error
					? error.message.replace(/AIza[a-zA-Z0-9_-]{35}/g, '[API_KEY_REDACTED]')
					: 'Unknown error';

			console.error('[processBillv1] [debugMe] Error processing bill:', sanitizedError);

			if (error instanceof HttpsError) {
				throw error;
			}

			if (error instanceof Error) {
				if (error.message.includes('quota')) {
					throw new HttpsError('resource-exhausted', 'API quota exceeded');
				}
				if (error.message.includes('safety')) {
					throw new HttpsError(
						'invalid-argument',
						'Image content rejected by safety filters'
					);
				}
				if (error.message.includes('API_KEY') || error.message.includes('authentication')) {
					throw new HttpsError('failed-precondition', 'Invalid API key');
				}
			}

			throw new HttpsError('internal', 'Failed to process bill image');
		}
	}
);
