export type PersonId = string;
export type ItemId = string;

export interface Name {
	original: string;
	english?: string;
}

export interface Currency {
	original: string;
	target?: string;
}

export interface Bill {
	id: string;
	name: Name;
	date?: string;
	time?: string;
	items: BillItem[];
	currency: Currency;
	adjustments: Adjustment[];
	totals: Totals;
}

export interface Adjustment {
	id: string;
	name: Name;
	amount: number;
	ref: string;
}

export interface BillItem {
	id: string;
	name: Name;
	amount: number;
	selectedPeople: Person[]; // People who should pay for this item
}

export interface Totals {
	subTotal: number;
	grandTotal: number;
}
