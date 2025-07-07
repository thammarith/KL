export interface Name {
	original: string;
	english?: string;
}

export interface Bill {
	id: string;
	name: Name;
	date?: string;
	time?: string;
	items: BillItem[];
	currency: {
		original: string;
		target?: string;
	};
}

export interface BillItem {
	id: string;
	name: Name;
	amount: number;
}
