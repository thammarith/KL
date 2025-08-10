import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';

// Set global options for all functions
setGlobalOptions({
	region: 'asia-southeast1', // Singapore
	maxInstances: 10,
});

/**
 * Simple function to process bill images
 * Will be enhanced in Phase 2 with Google Gemini API
 */
export const processBill = onCall(
	{
		cors: true,
		memory: '1GiB',
		timeoutSeconds: 300,
	},
	async (request) => {
		console.log('processBill called with data:', request.data);

		// Basic validation - just check we have some data
		if (!request.data) {
			throw new HttpsError('invalid-argument', 'No data provided');
		}

		// Return success for now - Phase 2 will add actual processing
		return {
			success: true,
			message: 'Function is ready! Phase 2 will add image processing.',
			timestamp: new Date().toISOString(),
			receivedData: request.data,
		};
	}
);
