import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBillContext } from '@/contexts/BillContext';
import { Button } from '../ui/button';
import {
	Drawer,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
} from '@/components/ui/drawer';
import BillSummaryInner from './bill-summary/BillSummaryInner';
import type { BillFormValues } from '@/types/billForm';

const BillSummary = ({ ...props }: ComponentProps<typeof Drawer>) => {
	const { getValues } = useFormContext<BillFormValues>();
	const { upsertBill } = useBillContext();

	const handleSaveBill = async () => {
		const formData = getValues();

		try {
			await upsertBill(formData);

			// Close the drawer after successful save
			if (props.onOpenChange) {
				props.onOpenChange(false);
			}
		} catch (error) {
			console.error('Error saving bill:', error);
			// You could add a toast notification here for error handling
		}
	};

	return (
		<Drawer {...props}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Bill summary</DrawerTitle>
					<DrawerDescription>
						This is where you can add, edit, or delete adjustments such as service
						charge, taxes, discounts, fees, etc.
					</DrawerDescription>
				</DrawerHeader>
				<BillSummaryInner />
				<DrawerFooter className="mb-8">
					<Button onClick={handleSaveBill}>Submit</Button>
					<DrawerClose>Cancel</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default BillSummary;
