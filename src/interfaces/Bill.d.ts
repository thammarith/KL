export interface Name {
	original: string;
	english?: string;
}

export interface Bill {
	id: string;
	date?: string;
	time?: string;
	items: BillItem[];
	currency: string;
	name: Name;
}

export interface BillItem {
	id: string;
	name: Name;
	amount: number;
}
