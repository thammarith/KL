import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

// import { Alert, AlertDescription } from '@/components/ui/alert';

import { Card, CardContent } from '@/components/ui/card';
// import { useBillContext } from '@/contexts/BillContext';
import { useFile } from '@/contexts/FileContext';
// import { compressImageForStorage } from '@/utils/imageUtils';
// import { processBillImage, type ProcessedBillData } from '@/services/billProcessingService';
// import { nanoid } from 'nanoid';
// import type { Bill } from '@/interfaces/Bill';

const Processing = () => {
	const navigate = useNavigate();
	// const { upsertBill } = useBillContext();
	const { currentFile } = useFile();

	// const [error, setError] = useState<string | null>(null);
	// const [isProcessing, setIsProcessing] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!currentFile) {
			navigate({ to: '/' });
			return;
		}

		const url = URL.createObjectURL(currentFile);
		setImageUrl(url);

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [currentFile]);

	// TODO: Uncomment when ready to process
	// const processImage = async (file: File) => {
	// 	if (isProcessing) return;

	// 	try {
	// 		setIsProcessing(true);

	// 		// Process image
	// 		const result = await processBillImage(file);

	// 		if (!result.success) {
	// 			throw new Error(result.error || 'Processing failed');
	// 		}

	// 		if (!result.data) {
	// 			throw new Error('No data received from processing');
	// 		}

	// 		// Compress image for storage
	// 		const compressedImageBlob = await compressImageForStorage(file);

	// 		const billData: ProcessedBillData = result.data;

	// 		// Create bill
	// 		const newBill: Bill = {
	// 			id: nanoid(),
	// 			name: billData.merchantName,
	// 			date: billData.date,
	// 			time: billData.time,
	// 			currency: { original: billData.currency },
	// 			items: billData.items.map((item) => ({
	// 				id: nanoid(),
	// 				name: item.name,
	// 				amount: item.amount,
	// 				selectedPeople: [],
	// 			})),
	// 			adjustments: billData.adjustments.map((adj) => ({
	// 				id: nanoid(),
	// 				name: adj.name,
	// 				amount: adj.amount,
	// 				ref: nanoid(),
	// 			})),
	// 			totals: billData.totals,
	// 			receiptImage: compressedImageBlob,
	// 		};

	// 		await upsertBill(newBill);

	// 		// Clear file from context and navigate to the bill page
	// 		setCurrentFile(null);
	// 		navigate({ to: '/bill', search: { id: newBill.id } });
	// 	} catch (error) {
	// 		console.error('Scan receipt error:', error);
	// 		setError(error instanceof Error ? error.message : t('processingFailed'));
	// 	} finally {
	// 		setIsProcessing(false);
	// 	}
	// };

	// const handleRetry = () => {
	// 	if (currentFile) {
	// 		setError(null);
	// 		processImage(currentFile);
	// 	}
	// };

	if (!currentFile) {
		return null;
	}

	return (
		<div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardContent className="p-6">
					<div className="space-y-4">
						<h2 className="text-center text-lg font-semibold">File Context Test</h2>

						{currentFile && (
							<div className="space-y-2 text-sm">
								<p>
									<strong>Name:</strong> {currentFile.name}
								</p>
								<p>
									<strong>Size:</strong>{' '}
									{(currentFile.size / 1024 / 1024).toFixed(2)} MB
								</p>
								<p>
									<strong>Type:</strong> {currentFile.type}
								</p>
								<p>
									<strong>Last Modified:</strong>{' '}
									{new Date(currentFile.lastModified).toLocaleString()}
								</p>
							</div>
						)}

						{imageUrl && (
							<div className="space-y-2">
								<p className="text-sm font-medium">Uploaded Image:</p>
								<img
									src={imageUrl}
									alt="Uploaded receipt"
									className="w-full rounded-lg border"
								/>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export const Route = createFileRoute('/processing')({
	component: Processing,
});
