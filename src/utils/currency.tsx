export const formatCurrency = (amount: number, currency: string): string => {
	try {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currencyDisplay: 'symbol',
			currency,
		}).format(amount);
	} catch {
		return `${amount}`;
	}
};
