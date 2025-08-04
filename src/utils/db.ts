import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Bill } from '@/interfaces/Bill';
import type { Person } from '@/interfaces/Person';

interface KLDB extends DBSchema {
	bills: {
		key: string;
		value: Bill;
		indexes: { 'by-date': string }; // Store as ISO string
	};
	people: {
		key: string;
		value: Person;
		indexes: { 'by-name': string };
	};
}

const DB_NAME = 'kl-bill-manager';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KLDB>> | null = null;

export async function getDB(): Promise<IDBPDatabase<KLDB>> {
	if (!dbPromise) {
		dbPromise = openDB<KLDB>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				const storeOptions = { keyPath: 'id' as const };

				if (!db.objectStoreNames.contains('bills')) {
					const billStore = db.createObjectStore('bills', storeOptions);
					billStore.createIndex('by-date', 'date');
				}

				if (!db.objectStoreNames.contains('people')) {
					const peopleStore = db.createObjectStore('people', storeOptions);
					peopleStore.createIndex('by-name', 'name');
				}
			},
		});
	}
	return dbPromise;
}

export async function clearDB(): Promise<void> {
	const db = await getDB();
	const tx = db.transaction(['bills', 'people'], 'readwrite');
	await Promise.all([tx.objectStore('bills').clear(), tx.objectStore('people').clear(), tx.done]);
}
