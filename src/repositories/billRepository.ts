import { getDB } from '@/utils/db';
import type { Bill } from '@/interfaces/Bill';

export const billRepository = {
	async get(id?: string) {
		const db = await getDB();
		if (id === undefined) {
			const result = await db.getAll('bills');
			return result as unknown as Bill[];
		}
		const result = await db.get('bills', id);
		return result as Bill | undefined;
	},

	async save(items: Bill[]): Promise<void> {
		const db = await getDB();
		const tx = db.transaction('bills', 'readwrite');
		await Promise.all([...items.map((item) => tx.store.put(item as never)), tx.done]);
	},

	async delete(id?: string): Promise<void> {
		const db = await getDB();
		if (id === undefined) {
			await db.clear('bills');
			return;
		}
		await db.delete('bills', id);
	},

	async getByDateRange(startDate: string, endDate: string): Promise<Bill[]> {
		const db = await getDB();
		const tx = db.transaction('bills', 'readonly');
		const index = tx.store.index('by-date');
		const range = IDBKeyRange.bound(startDate, endDate);
		return index.getAll(range);
	},
};
