import type { Adjustment, BillItem } from '@/interfaces/Bill';
import Currency from 'currency.js';

export const calculateSplitItemsTotal = (items: BillItem[]): number =>
	items
		.filter((item) => item.selectedPeople.length)
		.reduce((sum, item) => Currency(sum).add(item.amount).value, 0);

export const calculateUnsplitItemsTotal = (items: BillItem[]): number =>
	items
		.filter((item) => !item.selectedPeople.length)
		.reduce((sum, item) => Currency(sum).add(item.amount).value, 0);

export const calculateSubTotal = (items: BillItem[]): number =>
	items.reduce((acc, item) => Currency(acc).add(item.amount).value, 0);

export const calculateTotalAdjustment = (adjustments: Adjustment[]): number =>
	adjustments.reduce((sum, adjustment) => Currency(sum).add(adjustment.amount).value, 0);

export const calculateTotal = (subTotal: number, adjustments: number): number =>
	Currency(subTotal).add(adjustments).value;
