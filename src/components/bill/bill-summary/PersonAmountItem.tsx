import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { formatCurrency, getNakedCurrency } from '@/utils/currency';
import Currency from 'currency.js';
import type { Bill, BillItem } from '@/interfaces/Bill';
import type { Person } from '@/interfaces/Person';
import { Separator } from '@/components/ui/separator';

interface ItemRowProps {
	label: string;
	amount: number;
	displayCurrency: string;
	count?: number;
}

const ItemRow = ({ label, amount, displayCurrency, count }: ItemRowProps) => (
	<div className="text-muted-foreground flex items-center justify-between">
		<span>
			{count && count > 1 && <span className="text-xs">{count}× </span>}
			{label}
		</span>
		<span className="tabular-nums">{getNakedCurrency(amount, displayCurrency)}</span>
	</div>
);

interface PersonAmountItemProps {
	person: Person;
	amount: number;
	items: Map<string, { item: BillItem; totalShare: number; count: number }>;
	displayCurrency: string;
	adjustments: Bill['adjustments'];
}

export const PersonAmountItem = ({
	person,
	amount,
	items,
	displayCurrency,
	adjustments,
}: PersonAmountItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const itemsSubtotal = Array.from(items.values()).reduce(
		(sum, { totalShare }) => sum + totalShare,
		0
	);
	const adjustmentAmount = Currency(amount).subtract(itemsSubtotal).value;

	return (
		<Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
			<CollapsibleTrigger className="w-full">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<ChevronRight
							className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
						/>
						<span className="font-medium">{person.name}</span>
					</div>
					<span className="tabular-nums">
						{formatCurrency(amount, displayCurrency, 'narrowSymbol')}
					</span>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="mt-1 ml-6 space-y-1 text-sm">
					{Array.from(items.values()).map(({ item, totalShare, count }) => (
						<ItemRow
							key={item.id}
							label={item.name.english || item.name.original}
							amount={totalShare}
							displayCurrency={displayCurrency}
							count={count}
						/>
					))}

					<Separator className="my-2" />

					{adjustments.length > 0 && (
						<ItemRow
							label="Adjustments"
							amount={adjustmentAmount}
							displayCurrency={displayCurrency}
						/>
					)}

					<div className="mt-4" />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
