import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { CrudMode } from '@/constants/crudMode';
import type { Bill } from '@/interfaces/Bill';

export type BillMode = (typeof CrudMode)[keyof typeof CrudMode];

interface BillContextType {
	mode: BillMode;
	bills: Bill[];
	addBill: (bill: Bill) => void;
	updateBill: (bill: Bill) => void;
	deleteBill: (id: string) => void;
	getBillById: (id: string) => Bill | undefined;
	currentId?: string;
	currentBill?: Bill;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

const sampleBills: Bill[] = [
	{
		id: 'zQNOD0QU',
		date: '2024-06-01',
		time: '23:56',
		name: { original: 'ร้านอาหาร A', english: 'Restaurant A' },
		currency: { original: 'HKD', target: 'THB' },
		items: [
			{
				id: 'i1',
				name: { original: 'ข้าวผัด', english: 'Fried Rice' },
				amount: 50,
				selectedPeople: [],
			},
			{
				id: 'i2',
				name: { original: 'น้ำเปล่า', english: 'Water' },
				amount: 10,
				selectedPeople: [],
			},
			{
				id: 'i5',
				name: { original: 'โปร #1', english: 'Promotion #1' },
				amount: -5,
				selectedPeople: [],
			},
			{
				id: 'i6',
				name: { original: 'น้ำแข็ง', english: 'Ice Water' },
				amount: 20,
				selectedPeople: [],
			},
			{
				id: 'i7',
				name: { original: 'โปร #2', english: 'Promotion #1' },
				amount: -7,
				selectedPeople: [],
			},
		],
		adjustments: [
			{
				id: 'adj1',
				name: { original: 'S.C.', english: 'Service Fee' },
				amount: 10,
				ref: 'ad1',
			},
			{
				id: 'adj2',
				name: { original: 'Discount', english: 'Discount' },
				amount: -5,
				ref: 'ad1',
			},
		],
		totals: {
			subTotal: 68,
			grandTotal: 68,
		},
	},
	{
		id: 'cZetOWzJ',
		date: '2024-06-02',
		time: '10:00',
		name: { original: 'Cafe B', english: 'Cafe B' },
		currency: { original: 'THB' },
		items: [
			{
				id: 'i3',
				name: { original: 'กาแฟ', english: 'Coffee' },
				amount: 60,
				selectedPeople: [],
			},
			{
				id: 'i4',
				name: { original: 'โปร #1', english: 'Promotion #1' },
				amount: -5,
				selectedPeople: [],
			},
		],
		adjustments: [],
		totals: {
			subTotal: 55,
			grandTotal: 55,
		},
	},
];

export const BillProvider = ({ children, id }: { children: ReactNode; id?: string }) => {
	const [bills, setBills] = useState<Bill[]>(sampleBills);
	const mode: BillMode = id ? CrudMode.View : CrudMode.Create;
	const currentId = id;

	const addBill = useCallback((bill: Bill) => {
		setBills((prev) => [...prev, bill]);
	}, []);

	const updateBill = useCallback((bill: Bill) => {
		setBills((prev) => prev.map((b) => (b.id === bill.id ? bill : b)));
	}, []);

	const deleteBill = useCallback((billId: string) => {
		setBills((prev) => prev.filter((b) => b.id !== billId));
	}, []);

	const getBillById = useCallback((billId: string) => bills.find((b) => b.id === billId), [bills]);

	const currentBill = useMemo(() => (currentId ? getBillById(currentId) : undefined), [currentId, getBillById]);

	return (
		<BillContext.Provider
			value={{ mode, bills, addBill, updateBill, deleteBill, getBillById, currentId, currentBill }}
		>
			{children}
		</BillContext.Provider>
	);
};

export const useBillContext = () => {
	const context = useContext(BillContext);
	if (!context) {
		throw new Error('useBillContext must be used within a BillProvider');
	}
	return context;
};
