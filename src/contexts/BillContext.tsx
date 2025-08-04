import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CrudMode } from '@/constants/crudMode';
import type { Bill } from '@/interfaces/Bill';
import { billRepository } from '@/repositories/billRepository';

export type BillMode = (typeof CrudMode)[keyof typeof CrudMode];

interface BillContextType {
	mode: BillMode;
	bills: Bill[];
	upsertBill: (bill: Bill) => Promise<void>;
	deleteBill: (id: string) => Promise<void>;
	getBillById: (id: string) => Bill | undefined;
	currentId?: string;
	currentBill?: Bill;
	syncWithDB: () => Promise<void>;
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
	{
		id: 'cZetOWxJ',
		date: '2025-06-03',
		time: '15:00',
		name: { original: 'ร้านอาหาร C', english: 'Restaurant C' },
		currency: { original: 'THB' },
		items: [
			{
				id: 'i8a',
				name: { original: 'item A' },
				amount: 100,
				selectedPeople: [],
			},
			{
				id: 'i8ab',
				name: { original: 'item AB' },
				amount: 100,
				selectedPeople: [],
			},
		],
		adjustments: [
			{
				id: 'adj3',
				name: { original: 'SC' },
				amount: 10,
				ref: 'adjj11',
			},
		],
		totals: {
			subTotal: 0,
			grandTotal: 0,
		},
	},
];

export const BillProvider = ({ children, id }: { children: ReactNode; id?: string }) => {
	const [bills, setBills] = useState<Bill[]>([]);
	const mode: BillMode = id ? CrudMode.View : CrudMode.Create;
	const currentId = id;

	const sortBills = useCallback(
		(bills: Bill[]) =>
			[...bills].sort(
				(a, b) =>
					(a.date ?? '').localeCompare(b.date ?? '')
					|| (a.time ?? '').localeCompare(b.time ?? '')
					|| a.name.original.localeCompare(b.name.original)
			),
		[]
	);

	const loadBills = useCallback(async () => {
		const storedBills = (await billRepository.get()) as Bill[];

		// If no bills in DB, initialise with sample data
		if (storedBills.length === 0) {
			await billRepository.save(sampleBills);
			setBills(sampleBills);
		} else {
			setBills(storedBills);
		}
	}, []);

	useEffect(() => {
		loadBills();
	}, [loadBills]);

	const syncWithDB = useCallback(async () => {
		await loadBills();
	}, [loadBills]);

	const upsertBill = useCallback(
		async (bill: Bill) => {
			await billRepository.save([bill]);
			setBills((prev) => {
				const existingIndex = prev.findIndex((b) => b.id === bill.id);
				const updatedBills =
					existingIndex >= 0
						? prev.map((b) => (b.id === bill.id ? bill : b)) // Update existing
						: [...prev, bill]; // Add new
				return sortBills(updatedBills);
			});
		},
		[sortBills]
	);

	const deleteBill = useCallback(async (billId: string) => {
		await billRepository.delete(billId);
		setBills((prev) => prev.filter((b) => b.id !== billId));
	}, []);

	const getBillById = useCallback(
		(billId: string) => bills.find((b) => b.id === billId),
		[bills]
	);

	const currentBill = useMemo(
		() => (currentId ? getBillById(currentId) : undefined),
		[currentId, getBillById]
	);

	return (
		<BillContext.Provider
			value={{
				mode,
				bills,
				upsertBill,
				deleteBill,
				getBillById,
				currentId,
				currentBill,
				syncWithDB,
			}}
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
