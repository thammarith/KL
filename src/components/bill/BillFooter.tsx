import SubTotal from './SubTotal';
import Adjustments from './Adjustments';
import GrandTotal from './GrandTotal';
import { useEffect, useState } from 'react';
import { calculateTotalAdjustment, calculateSubTotal, calculateTotal } from '@/utils/calculation';
import { useFormContext, useWatch } from 'react-hook-form';
import type { BillFormValues } from '@/types/billForm';
import AdjustmentsSheet from './AdjustmentsSheet';

const BillFooter: React.FC = () => {
	const form = useFormContext<BillFormValues>();
	const currency = useWatch<BillFormValues>({
		name: 'currency',
	}) as BillFormValues['currency'];

	const [isAdjustmentsSheetShown, setIsAdjustmentsSheetShown] = useState(false);

	const adjustments = useWatch<BillFormValues>({
		name: 'adjustments',
	}) as BillFormValues['adjustments'];

	const items = useWatch<BillFormValues>({
		name: 'items',
	}) as BillFormValues['items'];

	const calculatedAdjustments = calculateTotalAdjustment(adjustments);
	const subTotal = calculateSubTotal(items);
	const grandTotal = calculateTotal(subTotal, calculatedAdjustments);

	useEffect(() => {
		form.setValue('totals.subTotal', subTotal);
		form.setValue('totals.grandTotal', grandTotal);
	}, [subTotal, grandTotal, form]);

	return (
		<footer className="font-content">
			<section className="grid grid-cols-[1fr_auto] items-center tabular-nums">
				<SubTotal currency={currency} subTotal={subTotal} />
				<Adjustments
					adjustments={adjustments}
					openAdjustmentsSheet={setIsAdjustmentsSheetShown}
					currency={currency}
				/>
				<GrandTotal currency={currency} grandTotal={grandTotal} />
			</section>
			<AdjustmentsSheet
				open={isAdjustmentsSheetShown}
				onOpenChange={setIsAdjustmentsSheetShown}
			/>
		</footer>
	);
};

export default BillFooter;
