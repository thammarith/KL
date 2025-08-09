import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useBillContext } from '@/contexts/BillContext';
import { capturePhoto, compressImageForStorage } from '@/utils/imageUtils';
import { processBillImage, type ProcessedBillData } from '@/services/billProcessingService';
import { nanoid } from 'nanoid';
import type { Bill } from '@/interfaces/Bill';

const ScanReceiptButton = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { upsertBill } = useBillContext();
	const [isProcessing, setIsProcessing] = useState(false);

	const handleScanReceipt = async () => {
		if (isProcessing) return;

		try {
			setIsProcessing(true);

			const file = await capturePhoto();
			const result = await processBillImage(file);
			const compressedImageBlob = await compressImageForStorage(file);

			if (!result.success) {
				throw new Error(result.error || 'Processing failed');
			}

			if (!result.data) {
				throw new Error('No data received from processing');
			}

			const billData: ProcessedBillData = result.data;

			const newBill: Bill = {
				id: nanoid(),
				name: billData.merchantName,
				date: billData.date,
				time: billData.time,
				currency: { original: billData.currency },
				items: billData.items.map((item) => ({
					id: nanoid(),
					name: item.name,
					amount: item.amount,
					selectedPeople: [],
				})),
				adjustments: billData.adjustments.map((adj) => ({
					id: nanoid(),
					name: adj.name,
					amount: adj.amount,
					ref: nanoid(),
				})),
				totals: billData.totals,
				receiptImage: compressedImageBlob,
			};

			await upsertBill(newBill);
			navigate({ to: '/bill', search: { id: newBill.id } });
		} catch (error) {
			console.error('Scan receipt error:', error);
			alert(
				`Failed to scan receipt: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<Button
			onClick={handleScanReceipt}
			disabled={isProcessing}
			className="flex items-center gap-2"
		>
			<Camera className="h-4 w-4" />
			{isProcessing ? t('processing') : t('scanReceipt')}
		</Button>
	);
};

export default ScanReceiptButton;
