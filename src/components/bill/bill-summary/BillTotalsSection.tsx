import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import type { Currency } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface TotalRowProps {
	label: string;
	amount: number;
	currency: Currency;
}

const TotalRow = ({ label, amount, currency }: TotalRowProps) => (
	<div className="text-muted-foreground flex items-center justify-between text-sm">
		<span>{label}</span>
		<span className="tabular-nums">
			{formatCurrency(amount, currency.target ?? currency.original, 'narrowSymbol')}
		</span>
	</div>
);

interface BillTotalsSectionProps {
	totalSplit: number;
	unsplitAmount: number;
	grandTotal: number;
	currency: Currency;
}

export const BillTotalsSection = ({
	totalSplit,
	unsplitAmount,
	grandTotal,
	currency,
}: BillTotalsSectionProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="space-y-1">
			<Separator className="my-4" />

			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleContent className="mb-4">
					<TotalRow label="Split total" amount={totalSplit} currency={currency} />
					<TotalRow label="Unsplit total" amount={unsplitAmount} currency={currency} />
				</CollapsibleContent>
				<CollapsibleTrigger className="w-full overflow-hidden">
					<div className="flex flex-wrap items-center justify-between tabular-nums">
						<span className="font-medium inline-flex items-center gap-1">
							{isOpen ? (
								<ChevronsDownUp className="h-3.5 w-3.5" />
							) : (
								<ChevronsUpDown className="h-3.5 w-3.5" />
							)}
							Total
						</span>
						<span className="inline-flex gap-1 font-semibold">
							{currency.target && (
								<span className="text-muted-foreground font-normal">
									({formatCurrency(grandTotal, currency.original)})
								</span>
							)}
							{formatCurrency(grandTotal, currency.target ?? currency.original)}
						</span>
					</div>
				</CollapsibleTrigger>
			</Collapsible>
		</div>
	);
};
