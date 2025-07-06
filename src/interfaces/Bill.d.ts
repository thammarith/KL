interface Bill {
	id: string;
	date: Date;
	items: BillItem[];
	merchant: Merchant;
}

interface BillItem {
	id: string;
	name: {
		local: string;
		english: string;
	};
	quantity: number;
	amount: Price;
}

interface Merchant {
	id: string;
	name: {
		local: string;
		english: string;
	};
}

interface Price {
	amount: number;
	currency: string;
}
