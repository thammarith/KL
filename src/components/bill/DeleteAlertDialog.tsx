export interface DeleteAlertDialogProps {
	onDelete: () => void;
	trigger: React.ReactNode;
	t: (key: string) => string;
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

const DeleteAlertDialog = ({ onDelete, trigger, t }: DeleteAlertDialogProps) => (
	<AlertDialog>
		<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
				<AlertDialogDescription>{t('deleteConfirmDescription')}</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
				<AlertDialogAction onClick={onDelete} className="bg-red-500 text-white hover:bg-red-600">
					{t('delete')}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);

export default DeleteAlertDialog;
