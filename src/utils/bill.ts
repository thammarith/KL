import { getNanoId } from '@/utils/nanoid';

export const generateUniqueId = (existingIds: string[]): string =>
	existingIds.includes(getNanoId())
		? generateUniqueId(existingIds)
		: getNanoId();

export const generateUniqueBillItemId = (items: { id: string }[]): string =>
	generateUniqueId(items.map((item) => item.id));
