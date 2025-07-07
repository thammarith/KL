import React from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';

interface BillItemProps {
	item: BillItemType;
}

const BillItem: React.FC<BillItemProps> = ({ item }) => {
	return (
		<div className="font-content tabular-nums">
			<div className="flex justify-between">
				<div className="flex items-baseline gap-1">
					<span className="text-base">{item.name.original}</span>
					<span className="text-muted-foreground text-sm">{item.name.english}</span>
				</div>
				<div className="font-medium">{formatCurrency(item.amount.amount, item.amount.currency)}</div>
			</div>
			<div className="flex justify-between">
				<div className="flex flex-1"></div>
				<div className="text-muted-foreground text-sm">
					{formatCurrency(item.amount.amount, item.amount.currency)}
				</div>
			</div>
		</div>
	);
};

export default BillItem;
