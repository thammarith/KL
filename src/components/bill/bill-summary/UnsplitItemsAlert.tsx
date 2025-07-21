import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { formatCurrency } from '@/utils/currency';
import type { BillItem } from '@/interfaces/Bill';
import { useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown, TriangleAlert } from 'lucide-react';

interface UnsplitItemsAlertProps {
	unsplitItems: BillItem[];
	amount: number;
	displayCurrency: string;
}

export const UnsplitItemsAlert = ({
	unsplitItems,
	amount,
	displayCurrency,
}: UnsplitItemsAlertProps) => {
	const [isOpen, setIsOpen] = useState(false);

	if (unsplitItems.length === 0) return null;

	return (
		<Collapsible
			open={isOpen}
			onOpenChange={setIsOpen}
			className="mt-4 w-full overflow-hidden rounded-md border border-amber-300 bg-amber-100 p-3 text-sm text-gray-900"
		>
			<CollapsibleTrigger className="w-full">
				<div className="flex items-center justify-between overflow-hidden font-medium">
					{/* prettier-ignore */}
					<div className="flex shrink-0 grow-0 items-center gap-2">
						<TriangleAlert className="h-3.5 w-3.5" />
						{/* TODO: handle plural */}
						{unsplitItems.length} items are not split
						{' '}
						({formatCurrency(amount, displayCurrency, 'narrowSymbol')})
					</div>
					<div className="flex shrink-0 grow-0 items-center gap-1">
						<div className="text-muted-foreground hidden overflow-hidden text-xs 2xs:block">
							See details
						</div>
						{isOpen ? (
							<ChevronsDownUp className="text-muted-foreground h-3.5 w-3.5" />
						) : (
							<ChevronsUpDown className="text-muted-foreground h-3.5 w-3.5" />
						)}
					</div>
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="mt-2">
					<div className="text-sm">
						<div>Unsplit items:</div>
						<ul className="mt-2 list-disc pl-4">
							{unsplitItems.map((item) => (
								<li key={item.id}>
									{item.name.original} (
									{formatCurrency(item.amount, displayCurrency, 'narrowSymbol')})
								</li>
							))}
						</ul>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
};
