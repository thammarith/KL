import { formatCurrency } from '@/utils/currency';
import type { Currency } from '@/interfaces/Bill';

type SubTotalProps = {
	currency: Currency;
	subTotal: number;
};

const SubTotal = ({ currency, subTotal }: SubTotalProps) => (
	<>
		<div className="mb-4">Sub total</div>
		<div className="mb-4 justify-self-end">{formatCurrency(subTotal, currency.original, 'narrowSymbol')}</div>
	</>
);

export default SubTotal;
