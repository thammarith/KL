import { useWatch } from 'react-hook-form';
import { usePeopleContext } from '@/contexts/PeopleContext';
import { PersonAmountItem } from './PersonAmountItem';
import { UnsplitItemsAlert } from './UnsplitItemsAlert';
import { BillTotalsSection } from './BillTotalsSection';
import { calculateSplitItemsTotal, calculateTotalAdjustment, calculateUnsplitItemsTotal } from '@/utils/calculation';
import { getPersonItemData, getPersonSummary } from '@/utils/personCalculation';
import type { BillFormValues } from '@/types/billForm';
import type { Bill } from '@/interfaces/Bill';
import { getUnsplitItems } from '@/utils/items';

const BillSummaryInner = () => {
	const currentBill = useWatch<BillFormValues>() as Bill;
	const { getPersonById } = usePeopleContext();

	const displayCurrency = currentBill.currency.target || currentBill.currency.original;

	// Calculate base amounts
	const personItemData = getPersonItemData(currentBill.items);

	// Apply adjustments
	// const adjustedPersonItemData = applyAdjustments(personItemData, currentBill.adjustments);

	// Calculate totals
	const splitItemsTotal = calculateSplitItemsTotal(currentBill.items);
	const unsplitItemsTotal = calculateUnsplitItemsTotal(currentBill.items);
	const adjustmentTotal = calculateTotalAdjustment(currentBill.adjustments);

	return (
		<section className="flex flex-1 flex-col overflow-y-auto p-4">
			<div className="overflow-y-auto">
				<h3 className="text-muted-foreground text-sm font-medium">Amount per person</h3>
				{personItemData.size === 0 ? (
					<p className="text-muted-foreground text-sm">
						No items have been assigned to people yet.
					</p>
				) : (
					<div className="mt-4 space-y-2">
						{personItemData.entries().map(([personId, itemsDataMap]) => {
							const person = getPersonById(personId);
							if (!person) return null;

							return (
								<PersonAmountItem
									key={personId}
									person={person}
									personItemData={itemsDataMap}
									displayCurrency={displayCurrency}
									summary={getPersonSummary(itemsDataMap, currentBill.items, currentBill.adjustments)}
								/>
							);
						})}
					</div>
				)}
			</div>
			<div>
				{/* TODO: logic here is incorrect; adjustedUnsplitAmount is calculated incorrectly */}
				<UnsplitItemsAlert
					unsplitItems={getUnsplitItems(currentBill.items)}
					amount={unsplitItemsTotal}
					displayCurrency={displayCurrency}
				/>
				<BillTotalsSection
					totalSplit={splitItemsTotal}
					unsplitAmount={unsplitItemsTotal}
					adjustmentAmount={adjustmentTotal}
					grandTotal={currentBill.totals.grandTotal}
					currency={currentBill.currency}
				/>
			</div>
		</section>
	);
};

export default BillSummaryInner;
