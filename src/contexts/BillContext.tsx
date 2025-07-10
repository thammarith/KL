import { createContext, useContext, useState, useCallback } from 'react';
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
			},
			{
				id: 'i2',
				name: { original: 'น้ำเปล่า', english: 'Water' },
				amount: 10,
			},
			{
				id: 'i5',
				name: { original: 'โปร #1', english: 'Promotion #1' },
				amount: -5,
			},
		],
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
			},
			{
				id: 'i4',
				name: { original: 'โปร #1', english: 'Promotion #1' },
				amount: -5,
			},
		],
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

	return (
		<BillContext.Provider value={{ mode, bills, addBill, updateBill, deleteBill, getBillById, currentId }}>
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
