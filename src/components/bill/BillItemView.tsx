import React, { useMemo } from 'react';
import type { BillItem as BillItemType } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/shadcn';
import BillItemPeopleManager from './BillItemPeopleManager';
import type { Person } from '@/interfaces/Person';

interface BillItemViewProps {
	item: BillItemType;
	currency: {
		original: string;
		target?: string;
	};
	onPeopleChange: (people: Person[]) => void;
}

const BillItemView: React.FC<BillItemViewProps> = ({ item, currency, onPeopleChange }) => {
	const isConverted = currency.target && currency.target !== currency.original;

	// Memoize selectedPeople to prevent unnecessary re-renders
	const selectedPeople = useMemo(() => item.selectedPeople || [], [item.selectedPeople]);

	return (
		<>
			{/* Top Left - Item Name */}
			<div className="flex items-baseline gap-1">
				<span className="text-base">{item.name.original}</span>
				<span className="text-muted-foreground text-sm">{item.name.english}</span>
			</div>

			{/* Top Right - Amount */}
			<div
				className={cn(
					'flex justify-end whitespace-nowrap',
					item.amount <= 0 && 'mr-16 text-red-700'
				)}
			>
				{formatCurrency(item.amount, isConverted ? currency.original : '', 'narrowSymbol')}
			</div>

			{/* Bottom Left - Empty */}
			<BillItemPeopleManager
				className="col-start-1 row-start-2"
				onPeopleChange={onPeopleChange}
				selectedPeople={selectedPeople}
			/>

			{/* Bottom Right - Converted Amount */}
			{isConverted ? (
				<div
					className={cn(
						'text-muted-foreground flex justify-end self-center text-sm whitespace-nowrap',
						item.amount <= 0 && 'mr-16 text-red-400'
					)}
				>
					{formatCurrency(item.amount, currency.target ?? '', 'narrowSymbol')}
				</div>
			) : (
				<div />
			)}
		</>
	);
};

export default BillItemView;
