import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface ReceiptImageViewerProps {
	imageBlob?: Blob;
}

const ReceiptImageViewer = ({ imageBlob }: ReceiptImageViewerProps) => {
	const { t } = useTranslation();
	const [imageUrl, setImageUrl] = useState<string>();

	useEffect(() => {
		if (!imageBlob) return;

		const url = URL.createObjectURL(imageBlob);
		setImageUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [imageBlob]);

	if (!imageBlob) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" className="gap-2">
					<Image className="h-4 w-4" />
					{t('viewReceipt')}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t('receiptImage')}</DialogTitle>
				</DialogHeader>
				<div className="flex justify-center">
					<img
						src={imageUrl}
						alt={t('receiptImage')}
						className="max-h-96 max-w-full rounded-lg object-contain"
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ReceiptImageViewer;
