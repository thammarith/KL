import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useFile } from '@/contexts/FileContext';

const ScanReceiptButton = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { setCurrentFile } = useFile();

	const [error, setError] = useState<string | null>(null);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			setError(t('invalidFileType'));
			return;
		}

		if (file.size > 10 * 1024 * 1024) {
			setError(t('fileTooLarge'));
			return;
		}

		setCurrentFile(file);
		navigate({ to: '/processing' });
	};

	return (
		<>
			<div>
				<Button onClick={handleButtonClick} className="flex items-center gap-2">
					<Camera className="h-4 w-4" />
					{t('scanReceipt')}
				</Button>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>
			</div>
			{error && (
				<div className="mt-2">
					<p className="text-sm text-red-500">{error}</p>
				</div>
			)}
		</>
	);
};

export default ScanReceiptButton;
