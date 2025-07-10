import React, { useState, useEffect } from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { cn } from '@/utils/shadcn';
import type { BillFormValues } from '@/types/billForm';
import { useFormContext } from 'react-hook-form';
import BillItemView from './BillItemView';
import BillItemForm from './BillItemForm';

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

	return (
		<div
			className={cn(
				'font-content grid grid-cols-[2fr_1fr] grid-rows-2 items-end gap-x-2 gap-y-1 tabular-nums',
				mode === BillItemMode.VIEW && 'cursor-pointer'
			)}
			onClick={handleContainerClick}
		>
			{mode === BillItemMode.VIEW && item && <BillItemView item={item} currency={currency} />}
			{(mode === BillItemMode.ADD || mode === BillItemMode.EDIT) && (
				<BillItemForm
					mode={mode}
					name={name}
					amount={amount}
					onNameChange={setName}
					onAmountChange={setAmount}
					onSave={handleSave}
					onCancel={handleCancel}
					onDelete={onDelete}
					onAdd={handleAdd}
					isDisabled={isDisabled}
				/>
			)}
		</div>
	);
};

export default BillItem;
