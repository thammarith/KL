export interface Bill {
	id: string;
	date: Date;
	items: BillItem[];
	merchant: Merchant;
}

export interface BillItem {
	id: string;
	name: {
		original: string;
		english?: string;
	};
	quantity: number;
	amount: Price;
}

export interface Merchant {
	id: string;
	name: {
		original: string;
		english?: string;
	};
}

export interface Price {
	amount: number;
	currency: string;
}
