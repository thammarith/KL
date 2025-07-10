import React, { useState, useEffect } from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { CheckIcon, XIcon, Trash2Icon, PlusIcon } from 'lucide-react';
import DeleteAlertDialog from './DeleteAlertDialog';
import { cn } from '@/utils/shadcn';
import type { BillFormValues } from '@/types/billForm';
import { useFormContext } from 'react-hook-form';

export const BillItemMode = {
	ADD: 'add',
	EDIT: 'edit',
	VIEW: 'view',
} as const;

export type BillItemMode = (typeof BillItemMode)[keyof typeof BillItemMode];

interface BillItemProps {
	item?: BillItemType;
	mode?: BillItemMode;
	onEdit: (updated: { name: string; amount: string }) => void;
	onDelete: () => void;
	onAdd: (item: { name: string; amount: string }) => void;
}

interface GridCellProps {
	mode: BillItemMode;
	item?: BillItemType;
	currency: {
		original: string;
		target?: string;
	};
	name?: string;
	amount?: string;
	onNameChange?: (value: string) => void;
	onAmountChange?: (value: string) => void;
	onSave?: () => void;
	onCancel?: () => void;
	onDelete?: () => void;
	onAdd?: () => void;
	isDisabled?: boolean;
}

const TopLeftCell: React.FC<GridCellProps> = ({ mode, item, name, onNameChange }) => {
	const { t } = useTranslation();

	switch (mode) {
		case BillItemMode.EDIT:
		case BillItemMode.ADD:
			return (
				<Input
					id="item-name"
					className="w-full"
					value={name || ''}
					onChange={(e) => onNameChange?.(e.target.value)}
					placeholder={t('itemName')}
					required
					onClick={(e) => e.stopPropagation()}
				/>
			);
		case BillItemMode.VIEW:
			if (!item) return <div />;
			return (
				<div className="flex items-baseline gap-1">
					<span className="text-base">{item.name.original}</span>
					<span className="text-muted-foreground text-sm">{item.name.english}</span>
				</div>
			);
		default:
			return <div />;
	}
};

const TopRightCell: React.FC<GridCellProps> = ({ mode, item, currency, amount, onAmountChange }) => {
	const { t } = useTranslation();
	const isConverted = currency.target && currency.target !== currency.original;

	switch (mode) {
		case BillItemMode.EDIT:
		case BillItemMode.ADD:
			return (
				<Input
					id="item-amount"
					type="text"
					value={amount || ''}
					onChange={(e) => onAmountChange?.(e.target.value)}
					placeholder={t('price')}
					required
					onClick={(e) => e.stopPropagation()}
				/>
			);
		case BillItemMode.VIEW:
			if (item) {
				return (
					<div className="flex justify-end">
						{formatCurrency(item.amount, isConverted ? currency.original : '', 'narrowSymbol')}
					</div>
				);
			}
			return <div />;
		default:
			return <div />;
	}
};

const BottomLeftCell: React.FC<GridCellProps> = () => {
	return <div />;
};

const BottomRightCell: React.FC<GridCellProps> = ({
	mode,
	item,
	currency,
	onSave,
	onCancel,
	onDelete,
	onAdd,
	isDisabled,
}) => {
	const { t } = useTranslation();
	const isConverted = currency.target && currency.target !== currency.original;

	switch (mode) {
		case BillItemMode.EDIT:
			return (
				<div className="flex justify-end">
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
						{/* {t('save')} */}
					</Button>

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
				</div>
			);
		case BillItemMode.ADD:
			return (
				<>
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
				</>
			);
		case BillItemMode.VIEW:
			if (item && isConverted) {
				return (
					<div className="flex justify-end">
						<div className="text-muted-foreground text-sm">
							{formatCurrency(item.amount, currency.target ?? '', 'narrowSymbol')}
						</div>
					</div>
				);
			}
			return <div />;
		default:
			return <div />;
	}
};

const BillItem: React.FC<BillItemProps> = ({ item, onEdit, onDelete, onAdd, mode: modeProp }) => {
	const form = useFormContext<BillFormValues>();

	const [mode, setMode] = useState<BillItemMode>(modeProp ?? BillItemMode.VIEW);
	const [name, setName] = useState(item?.name.original || '');
	const [amount, setAmount] = useState(item ? String(item.amount) : '');

	const currency = form.getValues('currency');

	useEffect(() => {
		if (item) {
			setName(item.name.original);
			setAmount(String(item.amount));
		} else if (mode === BillItemMode.ADD) {
			setName('');
			setAmount('');
		}
	}, [item, mode]);

	const handleSave = () => {
		onEdit?.({ name, amount });
		setMode(BillItemMode.VIEW);
	};

	const handleCancel = () => {
		if (item) {
			setName(item.name.original);
			setAmount(String(item.amount));
		}
		setMode(BillItemMode.VIEW);
	};

	const handleAdd = () => {
		onAdd?.({ name, amount });
		setName('');
		setAmount('');
	};

	const isDisabled = !name || !amount;

	const handleContainerClick = () => {
		if (mode === BillItemMode.VIEW && item) {
			setMode(BillItemMode.EDIT);
		}
	};

	const cellProps: GridCellProps = {
		mode,
		item,
		currency,
		name,
		amount,
		onNameChange: setName,
		onAmountChange: setAmount,
		onSave: handleSave,
		onCancel: handleCancel,
		onDelete,
		onAdd: handleAdd,
		isDisabled,
	};

	return (
		<div
			className={cn(
				'font-content grid grid-cols-[2fr_1fr] grid-rows-2 items-end gap-x-2 gap-y-1 tabular-nums',
				mode === BillItemMode.VIEW && 'cursor-pointer'
			)}
			onClick={handleContainerClick}
		>
			<TopLeftCell {...cellProps} />
			<TopRightCell {...cellProps} />
			<BottomLeftCell {...cellProps} />
			<BottomRightCell {...cellProps} />
		</div>
	);
};

export default BillItem;
