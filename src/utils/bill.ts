import { generateUniqueId } from '@/utils/nanoId';

export const generateUniqueBillItemId = (items: { id: string }[]): string =>
	generateUniqueId(items.map((item) => item.id));

export const getDefaultBillName = (billText: string, id: string): string => `${billText} #${id}`;
