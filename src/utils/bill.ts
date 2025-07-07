import { getNanoId } from '@/utils/nanoId';

export const generateUniqueId = (existingIds: string[] = [], id: string = getNanoId()): string =>
	existingIds.includes(id) || Number(id) ? generateUniqueId(existingIds) : id;

export const generateUniqueBillItemId = (items: { id: string }[]): string =>
	generateUniqueId(items.map((item) => item.id));

export const getDefaultBillName = (billText: string, id: string): string => `${billText} #${id}`;
