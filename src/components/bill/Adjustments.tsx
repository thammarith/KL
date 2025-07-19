import { Button } from '@/components/ui/button';
import type { Adjustment, Currency } from '@/interfaces/Bill';
import { Pencil } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { formatCurrency } from '@/utils/currency';

type AdjustmentsProps = {
	adjustments: Adjustment[];
	currency: Currency;
	openAdjustmentsSheet: (open: boolean) => void;
};

const Adjustments = ({ adjustments, openAdjustmentsSheet, currency }: AdjustmentsProps) => {
	return (
		<>
			{adjustments.map((adj) => (
				<Fragment key={adj.id}>
					<div className="text-sm flex items-center gap-1">
						{adj.name.original}{' '}
						<Button variant="ghost" size="sm" onClick={() => openAdjustmentsSheet(true)}>
							<Pencil />
						</Button>
					</div>
					<div className="text-sm tabular-nums justify-self-end">{formatCurrency(adj.amount, currency.original, 'narrowSymbol')}</div>
				</Fragment>
			))}
		</>
	);
};

export default Adjustments;
