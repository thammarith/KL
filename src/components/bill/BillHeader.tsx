import { useBillContext } from '@/contexts/BillContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { MouseEventHandler } from 'react';
import { CrudMode } from '@/constants/crudMode';
import DeleteAlertDialog from './DeleteAlertDialog';

interface BillHeaderProps {
	onDelete: () => void;
}

const BillHeader = ({ onDelete }: BillHeaderProps) => {
	const { mode, currentBill } = useBillContext();
	const { t } = useTranslation();

	const handleBack: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault();
		window.history.back();
	};

	return (
		<header className="bg-background font-heading -mx-4 flex items-center justify-between gap-2 py-2">
			<Button
				variant="ghost"
				onClick={handleBack}
				aria-label={t('back')}
				className="flex items-center gap-2"
			>
				<ArrowLeft />
				<span>{t('back')}</span>
			</Button>
			{mode === CrudMode.View && (
				<DeleteAlertDialog
					onDelete={onDelete}
					t={t}
					itemName={currentBill?.name.original}
					titleKey="deleteBillConfirmTitle"
					descriptionKey="deleteBillConfirmDescription"
					trigger={
						<Button
							variant="ghost"
							aria-label={t('deleteBill')}
							className="text-destructive hover:bg-destructive flex items-center gap-2 hover:text-white"
						>
							<Trash2 />
							<span>{t('deleteBill')}</span>
						</Button>
					}
				/>
			)}
		</header>
	);
};

export default BillHeader;
