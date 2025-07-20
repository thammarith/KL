import { useWatch } from 'react-hook-form';
import { usePeopleContext } from '@/contexts/PeopleContext';
import { PersonAmountItem } from './PersonAmountItem';
import { UnsplitItemsAlert } from './UnsplitItemsAlert';
import { BillTotalsSection } from './BillTotalsSection';
import { calculatePersonAmounts, applyAdjustments, calculateTotalSplit } from './billCalculations';
import type { BillFormValues } from '@/types/billForm';
import type { Bill } from '@/interfaces/Bill';
import { getUnsplitItems } from '@/utils/items';

const BillSummaryInner = () => {
	const currentBill = useWatch<BillFormValues>() as Bill;
	const { getPersonById } = usePeopleContext();

	// Calculate base amounts
	const { personAmounts, personItems, unsplitAmount } = calculatePersonAmounts(currentBill.items);

	// Apply adjustments
	const { adjustedPersonAmounts, adjustedUnsplitAmount } = applyAdjustments({
		personAmounts,
		unsplitAmount,
		adjustments: currentBill.adjustments,
	});

	// Calculate totals
	const totalSplit = calculateTotalSplit(adjustedPersonAmounts);
	const displayCurrency = currentBill.currency.target || currentBill.currency.original;

	return (
		<section className="flex flex-1 flex-col overflow-y-auto p-4">
			<div className="overflow-y-auto">
				<h3 className="text-muted-foreground text-sm font-medium">Amount per person</h3>
				{adjustedPersonAmounts.size === 0 ? (
					<p className="text-muted-foreground text-sm">
						No items have been assigned to people yet.
					</p>
				) : (
					<div className="mt-4 space-y-2">
						{adjustedPersonAmounts.entries().map(([personId, amount]) => {
							const person = getPersonById(personId);
							if (!person) return null;

							const items = personItems.get(personId) || new Map();

							return (
								<PersonAmountItem
									key={personId}
									person={person}
									amount={amount}
									items={items}
									displayCurrency={displayCurrency}
									adjustments={currentBill.adjustments}
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
					amount={adjustedUnsplitAmount}
					displayCurrency={displayCurrency}
				/>
				<BillTotalsSection
					totalSplit={totalSplit}
					unsplitAmount={adjustedUnsplitAmount}
					grandTotal={currentBill.totals.grandTotal}
					currency={currentBill.currency}
				/>
			</div>
		</section>
	);
};

export default BillSummaryInner;
