import Currency from 'currency.js';
import type { BillItem, Adjustment } from '@/interfaces/Bill';

type PersonItemData = {
	item: BillItem;
	totalShare: number;
	count: number;
};

type ApplyAdjustmentsParams = {
	personAmounts: Map<string, number>;
	unsplitAmount: number;
	adjustments: Adjustment[];
};

type PersonId = string;
type Amount = number;
type ItemId = string;

const getPersonAmounts = (items: BillItem[]): Map<PersonId, Amount> => {
	const personAmounts = new Map<PersonId, Amount>();

	items.forEach((item) => {
		if (item.selectedPeople.length === 0) return;

		const amountPerPerson = Currency(item.amount).divide(item.selectedPeople.length).value;

		item.selectedPeople.forEach((person) => {
			const currentAmount = personAmounts.get(person.id) || 0;
			personAmounts.set(person.id, Currency(currentAmount).add(amountPerPerson).value);
		});
	});

	return personAmounts;
};

const getPersonItems = (items: BillItem[]): Map<PersonId, Map<ItemId, PersonItemData>> => {
	const personItems = new Map<PersonId, Map<ItemId, PersonItemData>>();

	items.forEach((item) => {
		if (item.selectedPeople.length === 0) return;

		const amountPerPerson = Currency(item.amount).divide(item.selectedPeople.length).value;

		item.selectedPeople.forEach((person) => {
			if (!personItems.has(person.id)) {
				personItems.set(person.id, new Map());
			}

			const personItemMap = personItems.get(person.id)!;
			const existingItem = personItemMap.get(item.id);

			const itemData = {
				item,
				totalShare: existingItem
					? Currency(existingItem.totalShare).add(amountPerPerson).value
					: amountPerPerson,
				count: existingItem ? existingItem.count + 1 : 1,
			};

			personItemMap.set(item.id, itemData);
		});
	});

	return personItems;
};

const getUnsplitAmount = (items: BillItem[]): number => {
	return items
		.filter((item) => item.selectedPeople.length === 0)
		.reduce((sum, item) => Currency(sum).add(item.amount).value, 0);
};

const getTotalAdjustments = (adjustments: Adjustment[]): number => {
	return adjustments.reduce((sum, adj) => Currency(sum).add(adj.amount).value, 0);
};

const getPersonAmountsWithAdjustments = (
	personAmounts: Map<PersonId, Amount>,
	adjustments: Adjustment[],
	totalSplit: number
): Map<PersonId, Amount> => {
	if (adjustments.length === 0 || totalSplit <= 0) {
		return new Map(personAmounts);
	}

	const totalAdjustments = getTotalAdjustments(adjustments);
	const adjustedPersonAmounts = new Map(personAmounts);

	personAmounts.forEach((amount, personId) => {
		const adjustmentShare = Currency(amount)
			.divide(totalSplit)
			.multiply(totalAdjustments).value;
		const adjustedAmount = Currency(amount).add(adjustmentShare).value;
		adjustedPersonAmounts.set(personId, adjustedAmount);
	});

	return adjustedPersonAmounts;
};

const getUnsplitAmountWithAdjustments = (
	unsplitAmount: number,
	adjustments: Adjustment[],
	totalSplit: number
): number => {
	if (adjustments.length === 0 || totalSplit <= 0) {
		return unsplitAmount;
	}

	const totalAdjustments = getTotalAdjustments(adjustments);
	const adjustmentShare = Currency(unsplitAmount)
		.divide(totalSplit)
		.multiply(totalAdjustments).value;

	return Currency(unsplitAmount).add(adjustmentShare).value;
};

export const calculatePersonAmounts = (items: BillItem[]) => {
	const personAmounts = getPersonAmounts(items);
	const personItems = getPersonItems(items);
	const unsplitAmount = getUnsplitAmount(items);

	return { personAmounts, personItems, unsplitAmount };
};

export const applyAdjustments = ({
	personAmounts,
	unsplitAmount,
	adjustments,
}: ApplyAdjustmentsParams) => {
	const totalSplit = Array.from(personAmounts.values()).reduce(
		(sum, amount) => Currency(sum).add(amount).value,
		0
	);

	const adjustedPersonAmounts = getPersonAmountsWithAdjustments(
		personAmounts,
		adjustments,
		totalSplit
	);
	const adjustedUnsplitAmount = getUnsplitAmountWithAdjustments(
		unsplitAmount,
		adjustments,
		totalSplit
	);

	return { adjustedPersonAmounts, adjustedUnsplitAmount };
};

export const calculateTotalSplit = (personAmounts: Map<PersonId, Amount>): number => {
	return Array.from(personAmounts.values()).reduce(
		(sum, amount) => Currency(sum).add(amount).value,
		0
	);
};
