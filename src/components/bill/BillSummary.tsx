import type { ComponentProps } from 'react';
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

const BillSummary = ({ ...props }: ComponentProps<typeof Drawer>) => {
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
					<Button>Submit</Button>
					<DrawerClose>Cancel</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default BillSummary;
