// TODO: Update this to be more robust
const tryParseDate = (dateString?: string | null): string | undefined => {
	if (!dateString) return undefined;

	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) return undefined;

	const date = new Date(dateString + 'T00:00:00');
	if (isNaN(date.getTime())) return undefined;

	const [year, month, day] = dateString.split('-').map(Number);
	if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
		return undefined;
	}

	return dateString;
};

// TODO: Update this to be more robust
const tryParseTime = (timeString?: string | null): string | undefined => {
	if (!timeString) return undefined;

	const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
	if (!timeRegex.test(timeString)) return undefined;

	const [hours, minutes] = timeString.split(':').map(Number);
	if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
		return undefined;
	}

	return timeString.padStart(5, '0');
};

export interface GeminiExtractedData {
	restaurant: string;
	items: Array<{ name: string; amount: number }>;
	adjustments: Array<{ name: string; amount: number }>;
	subTotal: number;
	grandTotal: number;
	currency: string;
	date?: string | null;
	time?: string | null;
}

export interface ProcessedBillData {
	merchantName: { original: string };
	date?: string;
	time?: string;
	currency: string;
	items: Array<{ name: { original: string }; amount: number }>;
	adjustments: Array<{ name: { original: string }; amount: number }>;
	totals: { subTotal: number; grandTotal: number };
}

export const mapGeminiDataToBillData = (extractedData: GeminiExtractedData): ProcessedBillData => ({
	merchantName: { original: extractedData.restaurant },
	date: tryParseDate(extractedData.date),
	time: tryParseTime(extractedData.time),
	currency: extractedData.currency,
	items: extractedData.items.map((item) => ({
		name: { original: item.name },
		amount: item.amount,
	})),
	adjustments: extractedData.adjustments.map((adj) => ({
		name: { original: adj.name },
		amount: adj.amount,
	})),
	totals: {
		subTotal: extractedData.subTotal,
		grandTotal: extractedData.grandTotal,
	},
});
