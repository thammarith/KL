// Generic localStorage utility

export function setItem<T>(key: string, value: T) {
	localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
	const item = localStorage.getItem(key);
	if (!item) return null;
	try {
		return JSON.parse(item) as T;
	} catch {
		return null;
	}
}

export function removeItem(key: string) {
	localStorage.removeItem(key);
}

// Set value with expiry (in ms)
export function setItemWithExpiry<T>(key: string, value: T, ttl: number) {
	const now = Date.now();
	const item = {
		value,
		expiry: now + ttl,
	};
	localStorage.setItem(key, JSON.stringify(item));
}

// Get value with expiry check
export function getItemWithExpiry<T>(key: string): T | null {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) return null;
	try {
		const item = JSON.parse(itemStr);
		if (!item.expiry || !('value' in item)) return null;
		if (Date.now() > item.expiry) {
			localStorage.removeItem(key);
			return null;
		}
		return item.value as T;
	} catch {
		return null;
	}
}
