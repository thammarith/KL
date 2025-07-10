import React from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/shadcn';

interface BillItemViewProps {
	item: BillItemType;
	currency: {
		original: string;
		target?: string;
	};
}

const BillItemView: React.FC<BillItemViewProps> = ({ item, currency }) => {
	const isConverted = currency.target && currency.target !== currency.original;

	return (
		<>
			{/* Top Left - Item Name */}
			<div className="flex items-baseline gap-1">
				<span className="text-base">{item.name.original}</span>
				<span className="text-muted-foreground text-sm">{item.name.english}</span>
			</div>

			{/* Top Right - Amount */}
			<div className={cn("flex justify-end", item.amount <= 0 && 'mr-16')}>
				{formatCurrency(item.amount, isConverted ? currency.original : '', 'narrowSymbol')}
			</div>

			{/* Bottom Left - Empty */}
			<div />

			{/* Bottom Right - Converted Amount */}
			{isConverted ? (
				<div className={cn("flex justify-end", item.amount <= 0 && 'mr-16')}>
					<div className="text-muted-foreground text-sm">
						{formatCurrency(item.amount, currency.target ?? '', 'narrowSymbol')}
					</div>
				</div>
			) : (
				<div />
			)}
		</>
	);
};

export default BillItemView;
