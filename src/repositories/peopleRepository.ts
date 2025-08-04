import { getDB } from '@/utils/db';
import type { Person } from '@/interfaces/Person';

export const peopleRepository = {
	async get(id?: string) {
		const db = await getDB();
		if (id === undefined) {
			const result = await db.getAll('people');
			return result as unknown as Person[];
		}
		const result = await db.get('people', id);
		return result as Person | undefined;
	},

	async save(items: Person[]): Promise<void> {
		const db = await getDB();
		const tx = db.transaction('people', 'readwrite');
		await Promise.all([...items.map((item) => tx.store.put(item as never)), tx.done]);
	},

	async delete(id?: string): Promise<void> {
		const db = await getDB();
		if (id === undefined) {
			await db.clear('people');
			return;
		}
		await db.delete('people', id);
	},

	async findByName(name: string): Promise<Person[]> {
		const db = await getDB();
		const tx = db.transaction('people', 'readonly');
		const index = tx.store.index('by-name');
		return index.getAll(name);
	},
};
