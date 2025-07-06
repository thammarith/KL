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

export const BillProvider = ({ children, id }: { children: ReactNode; id?: string }) => {
	const [bills, setBills] = useState<Bill[]>([]);
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

	const getBillById = useCallback(
		(billId: string) => {
			return bills.find((b) => b.id === billId);
		},
		[bills]
	);

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
