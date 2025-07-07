export const formatCurrency = (
	amount: number,
	currency: string,
	currencyDisplay: Intl.NumberFormatOptions['currencyDisplay'] = 'symbol'
): string => {
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
