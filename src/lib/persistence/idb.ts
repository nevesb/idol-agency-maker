/**
 * Cache offline IndexedDB (P5-06) — API mínima sem dependências.
 */

const DB_NAME = 'star-idol-agency';
const DB_VERSION = 1;
const STORE = 'saves';

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onerror = () => reject(req.error ?? new Error('IDB open failed'));
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE);
			}
		};
		req.onsuccess = () => resolve(req.result);
	});
}

export async function idbPutSave(slotKey: string, json: string): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
		tx.onerror = () => reject(tx.error ?? new Error('IDB put failed'));
		tx.objectStore(STORE).put(json, slotKey);
	});
}

export async function idbGetSave(slotKey: string): Promise<string | undefined> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readonly');
		const r = tx.objectStore(STORE).get(slotKey);
		r.onsuccess = () => {
			db.close();
			resolve(r.result as string | undefined);
		};
		r.onerror = () => reject(r.error ?? new Error('IDB get failed'));
	});
}

export async function idbDeleteSave(slotKey: string): Promise<void> {
	const db = await openDb();
	return new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, 'readwrite');
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
		tx.onerror = () => reject(tx.error ?? new Error('IDB delete failed'));
		tx.objectStore(STORE).delete(slotKey);
	});
}

export function saveSlotKey(slotIndex: number): string {
	return `slot_${slotIndex}`;
}
