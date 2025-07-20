import type { BillItem } from '@/interfaces/Bill';

export const getUnsplitItems = (items: BillItem[]) =>
	items.filter((item) => !item.selectedPeople.length);
