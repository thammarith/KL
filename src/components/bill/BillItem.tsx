import React, { useState } from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import BillItemForm from './BillItemForm';

interface BillItemProps {
	item: BillItemType;
	currency: {
		original: string;
		target: string;
	};
	onEdit: (updated: { name: string; amount: string }) => void;
}

const BillItem: React.FC<BillItemProps> = ({ item, onEdit, currency }) => {
	const [isEditing, setIsEditing] = useState(false);

	if (isEditing) {
		return (
			<BillItemForm
				item={{ name: item.name.original, amount: String(item.amount) }}
				onSave={(updated) => {
					onEdit(updated);
					setIsEditing(false);
				}}
				onCancel={() => setIsEditing(false)}
			/>
		);
	}

	return (
		<div className="font-content cursor-pointer tabular-nums" onClick={() => setIsEditing(true)}>
			<div className="flex justify-between">
				<div className="flex items-baseline gap-1">
					<span className="text-base">{item.name.original}</span>
					<span className="text-muted-foreground text-sm">{item.name.english}</span>
				</div>
				<div className="font-medium">
					{/* TODO: show currency only if converted */}
					{formatCurrency(item.amount, currency.original, 'narrowSymbol')}
				</div>
			</div>
			<div className="flex justify-between">
				<div className="flex flex-1"></div>
				<div className="text-muted-foreground text-sm">
					{/* TODO: show currency only if converted */}
					{formatCurrency(item.amount, currency.target, 'narrowSymbol')}
				</div>
			</div>
		</div>
	);
};

export default BillItem;
