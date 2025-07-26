import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { formatCurrency, getNakedCurrency } from '@/utils/currency';
import type { ItemId } from '@/interfaces/Bill';
import type { Person } from '@/interfaces/Person';
import { Separator } from '@/components/ui/separator';
import { type PersonItemData, type PersonSummary } from '@/utils/personCalculation';

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
	displayCurrency: string;
	personItemData: Map<ItemId, PersonItemData>;
	summary: PersonSummary;
}

export const PersonAmountItem = ({
	person,
	personItemData,
	displayCurrency,
	summary,
}: PersonAmountItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

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
						{formatCurrency(summary.adjustedTotal, displayCurrency, 'narrowSymbol')}
					</span>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="mt-1 ml-6 space-y-1 text-sm">
					{Array.from(personItemData.values()).map(({ item, shares, amount }) => (
						<ItemRow
							key={item.id}
							label={item.name.english || item.name.original}
							amount={amount}
							displayCurrency={displayCurrency}
							count={shares}
						/>
					))}

					<Separator className="my-2" />

					{summary.adjustmentAmount !== 0 && (
						<ItemRow
							label="Adjustments"
							amount={summary.adjustmentAmount}
							displayCurrency={displayCurrency}
						/>
					)}

					<div className="mt-4" />
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
