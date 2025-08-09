export interface ProcessedBillData {
	merchantName: { original: string };
	date?: string;
	time?: string;
	currency: string;
	items: Array<{ name: { original: string }; amount: number }>;
	adjustments: Array<{ name: { original: string }; amount: number }>;
	totals: { subTotal: number; grandTotal: number };
}

export interface ProcessBillResponse {
	success: boolean;
	data?: ProcessedBillData;
	error?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (!reader.result) {
				reject(new Error('Failed to read file'));
				return;
			}

			resolve(reader.result as string);
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export const processBillImage = async (imageFile: File): Promise<ProcessBillResponse> => {
	if (!imageFile) {
		return {
			success: false,
			error: 'No image file provided',
		};
	}

	try {
		const functionUrl = process.env.VITE_FIREBASE_FUNCTION_URL || 'YOUR_FIREBASE_FUNCTION_URL';

		if (functionUrl === 'YOUR_FIREBASE_FUNCTION_URL') {
			return {
				success: false,
				error: 'Firebase function URL not configured',
			};
		}

		const base64Data = await fileToBase64(imageFile);
		const base64WithoutPrefix = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

		const response = await fetch(`${functionUrl}/processBillImage`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				imageData: base64WithoutPrefix,
				mimeType: imageFile.type || 'image/jpeg',
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Bill processing error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Network error',
		};
	}
};
