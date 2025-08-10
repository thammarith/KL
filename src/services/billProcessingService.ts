import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import { fileToBase64 } from '@/utils/imageUtils';
import {
	mapGeminiDataToBillData,
	type GeminiExtractedData,
	type ProcessedBillData,
} from '@/mappers/billMapper';

export interface ProcessBillResponse {
	success: boolean;
	data?: ProcessedBillData;
	error?: string;
}

interface FirebaseFunctionResponse {
	success: boolean;
	message: string;
	timestamp: string;
	extractedData: GeminiExtractedData;
}

export const processBillImage = async (imageFile: File): Promise<ProcessBillResponse> => {
	if (!imageFile) {
		return {
			success: false,
			error: 'No image file provided',
		};
	}

	try {
		const base64Data = await fileToBase64(imageFile);
		const base64WithoutPrefix = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

		const processBillFunction = httpsCallable<
			{ imageData: string; mimeType: string },
			FirebaseFunctionResponse
		>(functions, 'processBillv2');

		const result = await processBillFunction({
			imageData: base64WithoutPrefix,
			mimeType: imageFile.type || 'image/jpeg',
		});

		const response = result.data;

		if (!response.success) {
			return {
				success: false,
				error: response.message || 'Processing failed',
			};
		}

		const processedData = mapGeminiDataToBillData(response.extractedData);

		return {
			success: true,
			data: processedData,
		};
	} catch (error) {
		console.error('Bill processing error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Processing failed',
		};
	}
};
