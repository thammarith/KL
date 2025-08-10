import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFile } from '@/contexts/FileContext';
import { compressImageForStorage } from '@/utils/imageUtils';
import { processBillImage } from '@/services/billProcessingService';
import { generateUniqueId } from '@/utils/nanoId';
import type { Bill } from '@/interfaces/Bill';
import { useTranslation } from 'react-i18next';
import type { ProcessedBillData } from '@/mappers/billMapper';
import { useBillContext } from '@/contexts/BillContext';

const Processing = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { upsertBill } = useBillContext();
	const { currentFile, setCurrentFile } = useFile();
	const [billData, setBillData] = useState<Bill | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		if (!currentFile) {
			navigate({ to: '/' });
			return;
		}

		const url = URL.createObjectURL(currentFile);
		setImageUrl(url);

		// Start processing automatically
		processImage(currentFile);

		return () => {
			URL.revokeObjectURL(url);
		};
	}, [currentFile]);

	const processImage = async (file: File) => {
		if (isProcessing) return;

		try {
			setIsProcessing(true);
			setError(null);

			// Process image
			const result = await processBillImage(file);

			if (!result.success) {
				throw new Error(result.error || 'Processing failed');
			}

			if (!result.data) {
				throw new Error('No data received from processing');
			}

			// Compress image for storage
			const compressedImageBlob = await compressImageForStorage(file);

			const billData: ProcessedBillData = result.data;

			// Create bill
			const newBill: Bill = {
				id: generateUniqueId(),
				name: billData.merchantName,
				date: billData.date,
				time: billData.time,
				currency: { original: billData.currency },
				items: billData.items.map((item) => ({
					id: generateUniqueId(),
					name: item.name,
					amount: item.amount,
					selectedPeople: [],
				})),
				adjustments: billData.adjustments.map((adj) => ({
					id: generateUniqueId(),
					name: adj.name,
					amount: adj.amount,
					ref: generateUniqueId(),
				})),
				totals: billData.totals,
				receiptImage: compressedImageBlob,
			};

			console.log('newBill', newBill);
			setBillData(newBill);

			await upsertBill(newBill);

			navigate({ to: '/bill', search: { id: newBill.id } }).then(() => {
				setCurrentFile(null);
			});
		} catch (error) {
			console.error('Scan receipt error:', error);
			setError(error instanceof Error ? error.message : t('processingFailed'));
		} finally {
			setIsProcessing(false);
		}
	};

	const handleRetry = () => {
		if (currentFile) {
			setError(null);
			processImage(currentFile);
		}
	};

	if (!currentFile) {
		return null;
	}

	return (
		<div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardContent className="p-6">
					<div className="space-y-4">
						<h2 className="text-center text-lg font-semibold">
							{isProcessing ? t('processingReceipt') : t('receiptProcessing')}
						</h2>

						{imageUrl && (
							<div className="space-y-2">
								<img
									src={imageUrl}
									alt="Uploaded receipt"
									className="w-full rounded-lg border"
								/>
							</div>
						)}

						{isProcessing && (
							<div className="space-y-2 text-center">
								<div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
								<p className="text-muted-foreground text-sm">
									{t('analyzingReceipt')}
								</p>
							</div>
						)}

						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{error && (
							<Button
								onClick={handleRetry}
								className="w-full"
								disabled={isProcessing}
							>
								{t('retry')}
							</Button>
						)}

						{currentFile && !isProcessing && !error && (
							<div className="text-muted-foreground space-y-2 text-sm">
								<p>
									<strong>{t('fileName')}:</strong> {currentFile.name}
								</p>
								<p>
									<strong>{t('fileSize')}:</strong>{' '}
									{(currentFile.size / 1024 / 1024).toFixed(2)} MB
								</p>

								<strong>Bill content:</strong>
								<pre>{JSON.stringify(billData, null, 2)}</pre>
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
