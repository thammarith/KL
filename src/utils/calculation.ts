import type { Adjustment } from '@/interfaces/Bill';
import Currency from 'currency.js';

export const calculateSubTotal = (items: { amount: number }[]) =>
	items.reduce((acc, item) => Currency(acc).add(item.amount).value, 0);

export const calculateAdjustments = (adjustments: Adjustment[]) =>
	adjustments.reduce((acc, adjustment) => Currency(acc).add(adjustment.amount).value, 0);

export const calculateTotal = (subTotal: number, adjustments: number) =>
	Currency(subTotal).add(adjustments).value;
