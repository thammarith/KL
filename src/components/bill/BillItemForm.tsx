import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CheckIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';
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

interface BillItemFormProps {
	item?: { name: string; amount: string };
	onSave: (item: { name: string; amount: string }) => void;
	onCancel?: () => void;
	onDelete?: () => void;
}

interface DeleteAlertDialogProps {
	onDelete: () => void;
	trigger: React.ReactNode;
	t: (key: string) => string;
}

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

const BillItemForm: React.FC<BillItemFormProps> = ({ item, onSave, onCancel, onDelete }) => {
	const { t } = useTranslation();
	const [name, setName] = useState(item?.name || '');
	const [amount, setAmount] = useState(item?.amount || '');

	useEffect(() => {
		setName(item?.name || '');
		setAmount(item?.amount || '');
	}, [item]);

	const handleSave = () => {
		onSave({ name, amount });
		if (!item) {
			setName('');
			setAmount('');
		}
	};

	const isEditing = !!item;
	const isDisabled = !name || !amount;

	return (
		<div className="grid grid-cols-[2fr_1fr] grid-rows-2 items-end gap-x-2 gap-y-1">
			<Input
				id="item-name"
				className="w-full"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder={t('itemName')}
				required
			/>
			<Input
				id="item-amount"
				type="text"
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				placeholder={t('price')}
				required
			/>
			<div />
			<div className="col-start-2 row-start-2 flex justify-end">
				<Button
					type="button"
					variant={isEditing || isDisabled ? 'ghost' : 'default'}
					disabled={isDisabled}
					onClick={handleSave}
					aria-label={isEditing ? t('save') : t('add')}
					className={isEditing ? 'font-semibold' : ''}
				>
					{isEditing ? (
						<>
							<CheckIcon className="h-4 w-4 stroke-3" />
							{t('save')}
						</>
					) : (
						<>
							<PlusIcon className="h-4 w-4" /> {t('add')}
						</>
					)}
				</Button>
				{onCancel ? (
					<Button type="button" variant="ghost" onClick={onCancel} aria-label={t('cancel')}>
						<XIcon className="h-4 w-4" />
					</Button>
				) : (
					<div />
				)}
				{isEditing && onDelete && (
					<DeleteAlertDialog
						onDelete={onDelete}
						trigger={
							<Button
								type="button"
								variant="ghost"
								aria-label={t('delete')}
								className="text-red-500 hover:bg-red-100 hover:text-red-500"
							>
								<Trash2Icon className="h-4 w-4" />
							</Button>
						}
						t={t}
					/>
				)}
			</div>
		</div>
	);
};

export default BillItemForm;
