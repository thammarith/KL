import { Button } from '@/components/ui/button';
import type { Adjustment, Currency } from '@/interfaces/Bill';
import { Pencil } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '@/utils/currency';
import { cn } from '@/utils/shadcn';

type AdjustmentsProps = {
	adjustments: Adjustment[];
	currency: Currency;
	openAdjustmentsSheet: (open: boolean) => void;
};

const Adjustments = ({ adjustments, openAdjustmentsSheet, currency }: AdjustmentsProps) => {
	return (
		<>
			<h3 className="col-span-2 mb-1 text-sm font-semibold">
				Adjustments
				<Button variant="ghost" size="sm" onClick={() => openAdjustmentsSheet(true)}>
					<Pencil />
				</Button>
			</h3>

			{adjustments.map((adj) => (
				<Fragment key={adj.id}>
					<div className="flex items-center gap-1 text-sm">{adj.name.original} </div>
					<div
						className={cn(
							'justify-self-end text-sm tabular-nums',
							adj.amount < 0 && 'mr-16 text-red-500'
						)}
					>
						{formatCurrency(adj.amount, currency.original, 'narrowSymbol')}
					</div>
				</Fragment>
			))}
		</>
	);
};

export default Adjustments;
