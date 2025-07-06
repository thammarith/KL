import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import BillDebugBox from '@/components/bill/BillDebugBox';
import BillItems from '@/components/bill/BillItems';
import type { Bill, BillItem } from '@/interfaces/Bill';
import { useTranslation } from 'react-i18next';
import BillHeader from '@/components/bill/BillHeader';
import { generateUniqueId, generateUniqueBillItemId } from '@/utils/bill';

// Search params validation
const billSearchSchema = z.object({
	id: z.string().optional(),
});

export const billsMemory: Bill[] = [];

const BillManagementPage = () => {
	const { id } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { t } = useTranslation();
	const isCreateMode = !id;

	const [bill, setBill] = useState<Bill>({
		id: '',
		date: new Date(),
		items: [],
		merchant: { id: '', name: { original: '' } },
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id && !isCreateMode) {
			setIsLoading(true);
			setError(null);
			const found = billsMemory.find((b) => b.id === id.toString());
			if (found) setBill(found);
			else setError(t('failedToLoadBill'));
			setIsLoading(false);
		}
	}, [id, isCreateMode, t]);

	const addItem = (name: string, price: string) => {
		if (!name.trim() || isNaN(Number(price)) || Number(price) < 0) return;
		const newItem: BillItem = {
			id: generateUniqueBillItemId(bill.items || []),
			name: { original: name.trim() },
			quantity: 1,
			amount: { amount: Number(price), currency: 'THB' },
		};
		setBill((prev) => ({ ...prev, items: [...(prev.items || []), newItem] }));
	};

	const removeItem = (itemId: string) => {
		setBill((prev) => ({ ...prev, items: (prev.items || []).filter((i) => i.id !== itemId) }));
	};

	const onEditItem = (id: string, name: string, price: string) => {
		setBill((prev) => ({
			...prev,
			items: (prev.items || []).map((item) =>
				item.id === id
					? { ...item, name: { original: name.trim() }, amount: { amount: Number(price), currency: 'THB' } }
					: item
			),
		}));
	};

	const deleteBill = async () => {
		if (!window.confirm(t('deleteBillConfirm'))) return;
		setIsLoading(true);
		try {
			// Remove from memory
			const idx = billsMemory.findIndex((b) => b.id === bill.id);
			if (idx !== -1) billsMemory.splice(idx, 1);
			navigate({ to: '/' });
		} finally {
			setIsLoading(false);
		}
	};

	const createBill = async () => {
		setIsLoading(true);
		try {
			const newBill: Bill = { ...bill, id: bill.id || generateUniqueId(billsMemory.map((b) => b.id)) };
			billsMemory.push(newBill);
			navigate({ to: '/bill', search: { id: newBill.id } });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!isCreateMode && bill.id) {
			const idx = billsMemory.findIndex((b) => b.id === bill.id);
			if (idx !== -1) billsMemory[idx] = { ...bill };
		}
	}, [bill, isCreateMode]);

	const isFormValid = bill.merchant.name.original.trim() !== '' && (bill.items?.length ?? 0) > 0;

	return (
		<>
			<div className="container mx-auto max-w-2xl p-4">
				{isLoading && (
					<div className="py-4 text-center">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
						<p className="mt-2">{t('loading')}</p>
					</div>
				)}
				{error && !isCreateMode && (
					<div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>
				)}
				{!isLoading && (
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							if (!isFormValid) return;
							if (isCreateMode) await createBill();
						}}
						className="space-y-4"
					>
						<BillHeader bill={bill} setBill={setBill} isReadOnly={false} />
						<div>
							<h2 className="mb-1 text-sm font-medium text-gray-700">{t('items')}</h2>
							<BillItems
								items={bill.items || []}
								addItem={addItem}
								removeItem={removeItem}
								onEditItem={onEditItem}
								isReadOnly={false}
								hasBillId={!!id}
							/>
						</div>
						<div className="flex gap-2">
							{isCreateMode && (
								<button
									type="submit"
									disabled={!isFormValid}
									className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
								>
									{t('create')}
								</button>
							)}
							{!isCreateMode && (
								<button
									type="button"
									onClick={deleteBill}
									className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
								>
									{t('delete')}
								</button>
							)}
						</div>
					</form>
				)}
			</div>
			<BillDebugBox bill={bill} />
		</>
	);
};

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

export default BillManagementPage;
