import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBillContext } from '@/contexts/BillContext';
import z from 'zod/v4';
import BillHeader from '@/components/bill/BillHeader';
import BillContent from '@/components/bill/BillContent';
import BillFooter from '@/components/bill/BillFooter';
import BillInfo from '@/components/bill/BillInfo';
import { useEffect, useMemo, useState } from 'react';
import { CrudMode } from '@/constants/crudMode';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { billFormSchema, type BillFormValues } from '@/types/billForm';
import { generateUniqueId } from '@/utils/nanoId';
import { getDefaultBillName } from '@/utils/bill';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import SaveBill from '@/components/bill/SaveBill';
import BillSummary from '@/components/bill/BillSummary';

const billSearchSchema = z.object({
	id: z.string().optional(),
});

const buildDefaultValues = (billText: string, billId: string): BillFormValues => ({
	id: billId,
	date: '',
	time: '',
	name: { original: getDefaultBillName(billText, billId), english: '' },
	currency: { original: 'THB' },
	items: [],
	adjustments: [],
	totals: {
		subTotal: 0,
		grandTotal: 0,
	},
});

const BillManagementPage = () => {
	const navigate = useNavigate();
	const { getBillById, deleteBill, mode, currentId, updateBill, bills } = useBillContext();
	const { t } = useTranslation();

	const [isBillSummaryOpen, setIsBillSummaryOpen] = useState(false);

	const bill = currentId ? getBillById(currentId) : undefined;
	// Gather existing bill name IDs to avoid duplicates
	const existingIds = bills?.map((b) => b.name?.original).filter(Boolean) || [];
	const newBillId = useMemo(() => generateUniqueId(existingIds), [currentId]);

	const form = useForm<BillFormValues>({
		resolver: zodResolver(billFormSchema),
		mode: 'onBlur',
		defaultValues: bill || buildDefaultValues(t('bill'), newBillId),
	});

	// Update form when bill data changes
	useEffect(() => {
		form.reset(bill || buildDefaultValues(t('bill'), newBillId));
	}, [bill, form]);

	// Console log form changes
	useEffect(() => {
		const subscription = form.watch((value) => {
			console.log('Form data changed:', value);
		});
		return () => subscription.unsubscribe();
	}, [form]);

	useEffect(() => {
		if (currentId && !bill && mode === CrudMode.View) {
			// If bill not found, go back to home or show a message
			navigate({ to: '/' });
		}
	}, [currentId, bill, mode, navigate]);

	const handleDelete = () => {
		if (currentId) {
			deleteBill(currentId);
			navigate({ to: '/' });
		}
	};

	const onSaveBill = () => {
		setIsBillSummaryOpen(true);
	};

	const onSubmit = (values: BillFormValues) => {
		console.log('Form submitted:', values);
		if (updateBill) {
			updateBill(values);
		}
	};

	return (
		<main className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<BillHeader onDelete={handleDelete} />
					<BillInfo />
					<Separator className="my-4" />
					<BillContent />
					<Separator className="my-4" />
					<BillFooter />
					<SaveBill onSave={onSaveBill} />
					<Separator className="mt-8" />
					<Separator className="mt-2" />
				</form>
				<BillSummary open={isBillSummaryOpen} onOpenChange={setIsBillSummaryOpen} />
			</Form>

			<div className="mb-8" />
		</main>
	);
};

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

export default BillManagementPage;
