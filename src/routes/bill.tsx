import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { BillProvider, useBillContext } from '@/contexts/BillContext';
import { z } from 'zod';
import BillHeader from '@/components/bill/BillHeader';
import BillContent from '@/components/bill/BillContent';
import BillFooter from '@/components/bill/BillFooter';
import BillInfo from '@/components/bill/BillInfo';
import { useEffect } from 'react';
import { CrudMode } from '@/constants/crudMode';

const billSearchSchema = z.object({
	id: z.string().or(z.number()).optional(),
});

const BillManagementInner = () => {
	const navigate = useNavigate();
	const { getBillById, deleteBill, mode, currentId } = useBillContext();
	const bill = currentId ? getBillById(currentId) : undefined;

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

	return (
		<section className="mx-auto flex w-full max-w-lg flex-col gap-4 px-2 py-4 sm:px-4">
			<BillHeader onDelete={handleDelete} />
			{/* Pass bill as prop if BillInfo/BillContent need it */}
			<BillInfo />
			<BillContent />
			<BillFooter />
		</section>
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
