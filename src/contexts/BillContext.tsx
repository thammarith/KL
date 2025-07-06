import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { CrudMode } from '@/constants/crudMode';

export type BillMode = typeof CrudMode[keyof typeof CrudMode];

interface BillContextType {
	mode: BillMode;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider = ({ children, id }: { children: ReactNode; id?: string }) => {
	const mode: BillMode = id ? CrudMode.View : CrudMode.Create;

	return (
		<BillContext.Provider value={{ mode }}>
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
