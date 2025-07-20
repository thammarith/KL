import type { Currency } from '@/interfaces/Bill';
import { formatCurrency } from '@/utils/currency';

type GrandTotalProps = {
	currency: Currency;
	grandTotal: number;
};

const GrandTotal = ({ currency, grandTotal }: GrandTotalProps) => {
	return (
		<>
			<div className="mt-6 place-self-start text-lg font-bold">Grand total</div>
			<div className="mt-6 flex flex-col items-end justify-self-end text-lg">
				<div className="font-bold">{formatCurrency(grandTotal, currency.original)}</div>
				{currency.target && (
					<div className="text-muted-foreground text-sm">
						{formatCurrency(grandTotal, currency.target, 'narrowSymbol')}
					</div>
				)}
			</div>
		</>
	);
};

export default GrandTotal;
