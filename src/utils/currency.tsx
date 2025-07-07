// NOTE: currency param should be a string (currency code), callers must pass currency.original or currency.target as needed.
export const formatCurrency = (
	amount: number,
	currency: string,
	currencyDisplay: Intl.NumberFormatOptions['currencyDisplay'] = 'symbol'
): string => {
	if (!currency) return `${amount}`;

	try {
		return new Intl.NumberFormat(undefined, {
			currencyDisplay,
			currency,
			style: 'currency',
		}).format(amount);
	} catch {
		return `${amount}`;
	}
};
