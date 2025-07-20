import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Person } from '@/interfaces/Person';
import { Trash2, Edit } from 'lucide-react';

interface PeopleViewProps {
	person: Person;
	onEdit: () => void;
	onDelete: () => void;
}

const PeopleView = ({ person, onEdit, onDelete }: PeopleViewProps) => {
	const { t } = useTranslation();

	return (
		<>
			<div className="flex-1">
				<h3 className="font-medium">{person.name}</h3>
			</div>

			<div className="flex">
				<Button onClick={onEdit} variant="ghost" size="sm">
					<Edit className="size-4" />
				</Button>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-destructive hover:text-destructive"
						>
							<Trash2 className="size-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t('deletePerson', 'Delete Person')}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t(
									'deletePersonConfirm',
									'Are you sure you want to delete {{name}}? This action cannot be undone.',
									{ name: person.name }
								)}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t('cancel', 'Cancel')}</AlertDialogCancel>
							<AlertDialogAction
								onClick={onDelete}
								className="bg-destructive hover:bg-destructive/90 text-white"
							>
								{t('delete', 'Delete')}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</>
	);
};

export default PeopleView;
