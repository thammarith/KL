import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BillProvider, useBillContext } from '@/contexts/BillContext';
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
import { generateUniqueId } from '@/utils/bill';

const billSearchSchema = z.object({
	id: z.string().or(z.number()).optional(),
});

const BillManagementInner = () => {
	const navigate = useNavigate();
	const { getBillById, deleteBill, mode, currentId, updateBill, bills } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

	// Gather existing merchant name IDs to avoid duplicates
	const existingIds = bills?.map((b) => b.merchant?.name?.original).filter(Boolean) || [];
	const billId = useMemo(() => {
		const id = generateUniqueId(existingIds);
		console.log('Generated bill ID:', id);
		return id;
	}, [currentId]);

	const form = useForm<BillFormValues>({
		resolver: zodResolver(billFormSchema),
		mode: 'onBlur',
		defaultValues: bill || {
			id: billId,
			date: '',
			time: '',
			merchant: {
				id: '',
				name: {
					original: billId,
					english: '',
				},
			},
			items: [],
		},
	});

	// Update form when bill data changes
	useEffect(() => {
		if (bill) {
			form.reset(bill);
		}
	}, [bill, form]);

	// Console log form changes
	useEffect(() => {
		const subscription = form.watch((value) => {
			console.log('Form data changed:', value);
			console.log(form.getFieldState('merchant.name.original'));
		});
		return () => subscription.unsubscribe();
	}, [form]);

	useEffect(() => {
		if (currentId && !bill && mode === CrudMode.View) {
			// If bill not found, go back to home or show a message
			// TODO: uncomment this
			// navigate({ to: '/' });
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
				<BillContent />
				<BillFooter />
			</form>
		</Form>
	);
};

const BillManagementPage = () => {
	const { id } = Route.useSearch();
	return (
		<BillProvider id={id?.toString()}>
			<BillManagementInner />
		</BillProvider>
	);
};

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

export default BillManagementPage;
