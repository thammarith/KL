import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import BillDebugBox from '@/components/bill/BillDebugBox';
import BillItems from '@/components/bill/BillItems';
import type { Bill, BillItem } from '@/interfaces/Bill';
import { CrudMode } from '@/constants/crudMode';
import { useTranslation } from 'react-i18next';
import BillMerchantDateRow from '@/components/bill/BillMerchantDateRow';

// Search params validation
const billSearchSchema = z.object({
	id: z.number().optional(),
});

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

function BillManagementPage() {
	const { id } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { t } = useTranslation();

	// Determine the current mode
	const currentMode = id ? CrudMode.View : CrudMode.Create;
	const [isEditMode, setIsEditMode] = useState(false);

	// State management
	const [bill, setBill] = useState<Bill>({
		id: '',
		date: new Date(),
		items: [],
		merchant: { id: '', name: { original: '' } },
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isModified, setIsModified] = useState(false);

	// Load bill data when ID is provided
	useEffect(() => {
		if (id && currentMode !== CrudMode.Create) {
			loadBill(id.toString());
		}
	}, [id, currentMode]);

	// Mock functions for CRUD operations (to be implemented with actual data layer)
	const loadBill = async (billId: string) => {
		setIsLoading(true);
		setError(null);
		try {
			// TODO: Implement actual data loading from IndexedDB
			console.log('Loading bill:', billId);
			// Mock data for now
			setBill({
				id: billId,
				date: new Date('2024-01-15T10:00:00Z'),
				items: [],
				merchant: { id: '1', name: { original: 'ร้านไฟฟ้า' } },
			});
		} catch (err) {
			setError(t('failedToLoadBill'));
			console.error('Error loading bill:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditToggle = () => {
		if (isEditMode && isModified && !window.confirm(t('unsavedChangesConfirm'))) {
			return;
		}
		setIsEditMode((prev: boolean) => !prev);
	};

	const isReadOnly = currentMode === CrudMode.View && !isEditMode;
	const isCreateMode = currentMode === CrudMode.Create;

	const addItem = (name: string, price: string) => {
		if (!name.trim() || isNaN(Number(price)) || Number(price) < 0) return;
		const newItem: BillItem = {
			id: Date.now().toString(),
			name: { original: name.trim() },
			quantity: 1,
			amount: { amount: Number(price), currency: 'THB' },
		};
		setBill((prev: Bill) => ({
			...prev,
			items: [...(prev.items || []), newItem],
		}));
		setIsModified(true);
	};

	const removeItem = (itemId: string) => {
		setBill((prev: Bill) => ({
			...prev,
			items: (prev.items || []).filter((i: BillItem) => i.id !== itemId),
		}));
		setIsModified(true);
	};

	const onEditItem = (id: string, name: string, price: string) => {
		setBill((prev: Bill) => ({
			...prev,
			items: (prev.items || []).map((item: BillItem) =>
				item.id === id
					? {
							...item,
							name: { original: name.trim() },
							amount: { amount: Number(price), currency: 'THB' },
					  }
					: item
			),
		}));
		setIsModified(true);
	};

	const deleteBill = async () => {
		if (!window.confirm(t('deleteBillConfirm'))) {
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			// TODO: Implement bill deletion
			console.log('Deleting bill:', bill.id);
			// Navigate back to bills list or home
			navigate({ to: '/' });
		} catch (err) {
			setError(t('failedToDeleteBill'));
			console.error('Error deleting bill:', err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="container mx-auto max-w-2xl p-4">
				{/* Header */}
				<div className="mb-6">
					<div className="flex items-center justify-between">
						{!isCreateMode && <h1 className="text-2xl font-bold">{t('billTitle', { merchant: bill.merchant.name.original || t('untitled') })}</h1>}
						<div className="flex gap-2">
							{!isCreateMode && (
								<>
									{isReadOnly && (
										<button
											onClick={handleEditToggle}
											className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
										>
											{t('edit')}
										</button>
									)}
									{isEditMode && (
										<button
											onClick={handleEditToggle}
											className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
										>
											{t('view')}
										</button>
									)}
								</>
							)}
						</div>
					</div>

					{!isCreateMode && (
						<div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
							<span>
								{t('mode')} <span className="font-medium capitalize">{isEditMode ? t('editMode') : t('viewMode')}</span>
								{isModified && <span className="ml-2 text-orange-600">{t('modified')}</span>}
							</span>
							<span className="text-xs text-gray-400">
								{t('billId')} <span className="font-mono">{bill.id}</span>
							</span>
						</div>
					)}
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="py-4 text-center">
						<div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
						<p className="mt-2">{t('loading')}</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">{error}</div>
				)}

				{/* Main Form */}
				{!isLoading && (
					<form onSubmit={(e) => e.preventDefault()} className="space-y-4">
						{/* Merchant Name & Date on the same line */}
						<BillMerchantDateRow
							bill={bill}
							setBill={setBill}
							isReadOnly={isReadOnly}
							isCreateMode={isCreateMode}
						/>

						{/* Items */}
						<div>
							<h2 className="mb-1 text-sm font-medium text-gray-700">{t('items')}</h2>
							<BillItems
								items={bill.items || []}
								isReadOnly={isReadOnly}
								addItem={addItem}
								removeItem={removeItem as (id: string) => void}
								onEditItem={onEditItem as (id: string, name: string, price: string) => void}
							/>
						</div>

						{/* Actions */}
						<div className="flex gap-2">
							{!isCreateMode && (
								<button
									type="button"
									onClick={handleEditToggle}
									className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
								>
									{t('view')}
								</button>
							)}
							{isCreateMode && (
								<button
									type="submit"
									className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
								>
									{t('create')}
								</button>
							)}
							{!isCreateMode && (
								<button
									type="submit"
									className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
								>
									{t('save')}
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
}
