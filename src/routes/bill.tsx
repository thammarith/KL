import { createFileRoute } from '@tanstack/react-router';
import { BillProvider } from '@/contexts/BillContext';
import { z } from 'zod';
import BillHeader from '@/components/bill/BillHeader';

const billSearchSchema = z.object({
	id: z.string().optional(),
});

const BillManagementPage = () => {
	const { id } = Route.useSearch();

	return (
		<BillProvider id={id}>
			<BillHeader />
		</BillProvider>
	);
};

export const Route = createFileRoute('/bill')({
	validateSearch: billSearchSchema,
	component: BillManagementPage,
});

export default BillManagementPage;
