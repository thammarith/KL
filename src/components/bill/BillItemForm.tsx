import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CheckIcon, XIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import DeleteAlertDialog from './DeleteAlertDialog';
import { BillItemMode, type BillItemMode as BillItemModeType } from './BillItem';

interface BillItemFormProps {
	mode: BillItemModeType;
	name: string;
	amount: string;
	onNameChange: (value: string) => void;
	onAmountChange: (value: string) => void;
	onSave?: () => void;
	onCancel?: () => void;
	onDelete?: () => void;
	onAdd?: () => void;
	isDisabled?: boolean;
}

const BillItemForm: React.FC<BillItemFormProps> = ({
	mode,
	name,
	amount,
	onNameChange,
	onAmountChange,
	onSave,
	onCancel,
	onDelete,
	onAdd,
	isDisabled,
}) => {
	const { t } = useTranslation();

	const renderBottomRightActions = () => {
		switch (mode) {
			case BillItemMode.EDIT:
				return (
					<div className="flex w-full justify-end">
						<DeleteAlertDialog
							onDelete={onDelete || (() => {})}
							trigger={
								<Button
									type="button"
									variant="ghost"
									aria-label={t('delete')}
									className="text-red-500 hover:bg-red-100 hover:text-red-500"
									onClick={(e) => e.stopPropagation()}
								>
									<Trash2Icon className="h-4 w-4" />
								</Button>
							}
							t={t}
						/>

						<Button
							type="button"
							variant="ghost"
							onClick={(e) => {
								e.stopPropagation();
								onCancel?.();
							}}
							aria-label={t('cancel')}
						>
							<XIcon className="h-4 w-4" />
						</Button>

						<Button
							type="button"
							variant={isDisabled ? 'ghost' : 'default'}
							disabled={isDisabled}
							onClick={(e) => {
								e.stopPropagation();
								onSave?.();
							}}
							aria-label={t('save')}
							className="font-semibold"
						>
							<CheckIcon className="h-4 w-4 stroke-3" />
						</Button>
					</div>
				);
			case BillItemMode.ADD:
				return (
					<div className="flex justify-end">
						<Button
							type="button"
							variant={isDisabled ? 'ghost' : 'default'}
							disabled={isDisabled}
							onClick={(e) => {
								e.stopPropagation();
								onAdd?.();
							}}
							aria-label={t('add')}
							className="font-semibold"
						>
							<PlusIcon className="h-4 w-4" />
							{t('add')}
						</Button>
					</div>
				);
			default:
				return <div />;
		}
	};

	return (
		<>
			{/* Top Left - Name Input */}
			<Input
				id="item-name"
				className="w-full"
				value={name}
				onChange={(e) => onNameChange(e.target.value)}
				placeholder={t('itemName')}
				required
				onClick={(e) => e.stopPropagation()}
			/>

			{/* Top Right - Amount Input */}
			<Input
				id="item-amount"
				type="text"
				value={amount}
				onChange={(e) => onAmountChange(e.target.value)}
				placeholder={t('price')}
				required
				onClick={(e) => e.stopPropagation()}
			/>

			{/* Bottom Left - Empty */}
			<div />

			{/* Bottom Right - Actions */}
			{renderBottomRightActions()}
		</>
	);
};

export default BillItemForm;
