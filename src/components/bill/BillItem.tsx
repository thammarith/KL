import React, { useState } from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import BillItemForm from './BillItemForm';

interface BillItemProps {
	item: BillItemType;
	currency: {
		original: string;
		target?: string;
	};
	onEdit: (updated: { name: string; amount: string }) => void;
	onDelete?: () => void;
}

const BillItem: React.FC<BillItemProps> = ({ item, onEdit, onDelete, currency }) => {
	const [isEditing, setIsEditing] = useState(false);
	const isConverted = currency.target && currency.target !== currency.original;

	if (isEditing) {
		return (
			<BillItemForm
				item={{ name: item.name.original, amount: String(item.amount) }}
				onSave={(updated) => {
					onEdit(updated);
					setIsEditing(false);
				}}
				onCancel={() => setIsEditing(false)}
				onDelete={onDelete}
			/>
		);
	}

	return (
		<div className="font-content cursor-pointer tabular-nums" onClick={() => setIsEditing(true)}>
			<div className="flex items-baseline justify-between">
				<div className="flex items-baseline gap-1">
					<span className="text-base">{item.name.original}</span>
					<span className="text-muted-foreground text-sm">{item.name.english}</span>
				</div>
				<div>{formatCurrency(item.amount, isConverted ? currency.original : '', 'narrowSymbol')}</div>
			</div>
			{isConverted && (
				<div className="flex justify-end">
					<div className="text-muted-foreground text-sm">
						{formatCurrency(item.amount, currency.target ?? '', 'narrowSymbol')}
					</div>
				</div>
			)}
		</div>
	);
};

export default BillItem;
