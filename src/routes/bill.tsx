import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useBillContext } from '@/contexts/BillContext';
import z from 'zod/v4';
import BillHeader from '@/components/bill/BillHeader';
import BillContent from '@/components/bill/BillContent';
import BillFooter from '@/components/bill/BillFooter';
import BillInfo from '@/components/bill/BillInfo';
import { useEffect, useMemo } from 'react';
import { CrudMode } from '@/constants/crudMode';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { billFormSchema, type BillFormValues } from '@/types/billForm';
import { generateUniqueId, getDefaultBillName } from '@/utils/bill';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';

const billSearchSchema = z.object({
	id: z.string().optional(),
});

const buildDefaultValues = (billText: string, billId: string): BillFormValues => ({
	id: billId,
	date: '',
	time: '',
	merchant: {
		id: '',
		name: {
			original: getDefaultBillName(billText, billId),
			english: '',
		},
	},
	items: [],
});

const BillManagementPage = () => {
	const navigate = useNavigate();
	const { getBillById, deleteBill, mode, currentId, updateBill, bills } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;
	const { t } = useTranslation();

	// Gather existing merchant name IDs to avoid duplicates
	const existingIds = bills?.map((b) => b.merchant?.name?.original).filter(Boolean) || [];
	const billId = useMemo(() => generateUniqueId(existingIds), [currentId]);

	const form = useForm<BillFormValues>({
		resolver: zodResolver(billFormSchema),
		mode: 'onBlur',
		defaultValues: bill || buildDefaultValues(t('bill'), billId),
	});

	// Update form when bill data changes
	useEffect(() => {
		form.reset(bill || buildDefaultValues(t('bill'), billId));
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

	const onSubmit = (values: BillFormValues) => {
		console.log('Form submitted:', values);
		if (updateBill) {
			updateBill(values);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto flex w-full max-w-lg flex-col gap-4 px-2 py-4 sm:px-4"
			>
				<BillHeader onDelete={handleDelete} />
				<BillInfo />
				<Separator />
				<BillContent />
				<BillFooter />
			</form>
		</Form>
	);
};

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

export default BillManagementPage;
