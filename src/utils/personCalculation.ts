import Currency from 'currency.js';
import type { BillItem, Adjustment } from '@/interfaces/Bill';
import { calculateSubTotal, calculateTotalAdjustment } from './calculation';
import type { PersonId, ItemId } from '@/interfaces/Bill';

export interface PersonItemData {
	item: BillItem;
	shares: number;
	amount: number;
}

const getItemTotalShares = (item: BillItem): number => item.selectedPeople.length;

const getItemSharesByPersonId = (personId: PersonId, item: BillItem): number =>
	item.selectedPeople.filter((p) => p.id === personId).length;

const getItemRatioByPersonId = (personId: PersonId, item: BillItem): number => {
	const personShares = getItemSharesByPersonId(personId, item);
	const totalShares = getItemTotalShares(item);

	if (personShares === 0 || totalShares === 0) return 0;

	return personShares / totalShares;
};

const getItemAmountByPersonId = (personId: PersonId, item: BillItem): number => {
	const ratio = getItemRatioByPersonId(personId, item);
	return Currency(item.amount).multiply(ratio).value;
};

const getPersonItemsMap = (items: BillItem[]): Map<PersonId, BillItem[]> => {
	const personItemsMap = new Map<PersonId, BillItem[]>();

	items.forEach((item) => {
		item.selectedPeople.forEach((person) => {
			if (!personItemsMap.has(person.id)) {
				personItemsMap.set(person.id, []);
			}
			personItemsMap.get(person.id)?.push(item);
		});
	});

	return personItemsMap;
};

const buildPersonItemData = (personId: PersonId, item: BillItem): PersonItemData => {
	const shares = getItemSharesByPersonId(personId, item);
	const amount = getItemAmountByPersonId(personId, item);

	return { item, shares, amount };
};

export const getPersonItemData = (
	items: BillItem[]
): Map<PersonId, Map<ItemId, PersonItemData>> => {
	const personItemDataMap = new Map<PersonId, Map<ItemId, PersonItemData>>();

	const personItemsMap = getPersonItemsMap(items);
	personItemsMap.forEach((personItems, personId) => {
		personItemDataMap.set(personId, new Map<ItemId, PersonItemData>());
		personItems.forEach((item) => {
			const personItemData = buildPersonItemData(personId, item);
			personItemDataMap.get(personId)?.set(item.id, personItemData);
		});
	});

	return personItemDataMap;
};

export interface PersonSummary {
	unadjustedTotal: number;
	adjustedTotal: number;
	adjustmentAmount: number;
}

export const getPersonSummary = (
	personItemData: Map<ItemId, PersonItemData>,
	items: BillItem[],
	adjustments: Adjustment[]
): PersonSummary => {
	const personItemDataArray = Array.from(personItemData.values());
	const unadjustedTotal = personItemDataArray.reduce((sum, itemData) => sum + itemData.amount, 0);
	const billSubtotal = calculateSubTotal(items);
	const billAdjustmentTotal = calculateTotalAdjustment(adjustments);

	const adjustmentAmount = Currency(unadjustedTotal / billSubtotal).multiply(
		billAdjustmentTotal
	).value;
	const adjustedTotal = Currency(unadjustedTotal).add(adjustmentAmount).value;

	return { unadjustedTotal, adjustedTotal, adjustmentAmount };
};
