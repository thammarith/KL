export interface DeleteAlertDialogProps {
	onDelete: () => void;
	trigger: React.ReactNode;
	t: (key: string, options?: { name?: string }) => string;
	itemName?: string;
	titleKey?: string;
	descriptionKey?: string;
}

import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from '@/components/ui/alert-dialog';

const DeleteAlertDialog = ({
	onDelete,
	trigger,
	t,
	itemName,
	titleKey = 'deleteConfirmTitle',
	descriptionKey = 'deleteConfirmDescription',
}: DeleteAlertDialogProps) => (
	<AlertDialog>
		<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					{itemName ? t(titleKey, { name: itemName }) : t(titleKey)}
				</AlertDialogTitle>
				<AlertDialogDescription>{t(descriptionKey)}</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
				<AlertDialogAction
					onClick={onDelete}
					className="bg-red-500 text-white hover:bg-red-600"
				>
					{t('delete')}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);

export default DeleteAlertDialog;
