import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { generateUniqueId } from '@/utils/nanoId';
import { getItem, setItem } from '@/utils/localStorage';

export interface UserContextType {
	locale: string;
	countryCode: string;
	defaultCurrency: string;
	id: string;
	name: string;
}

const uniqueId = generateUniqueId();
const getDefaultLocale = () => window?.navigator?.language ?? 'en-GB';

const defaultUser: UserContextType = {
	locale: getDefaultLocale(),
	countryCode: 'GB',
	defaultCurrency: 'GBP',
	id: uniqueId,
	name: `u#${uniqueId}`,
};

const USER_STORAGE_KEY = 'user';

const UserContext = createContext<UserContextType>(defaultUser);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user] = useState<UserContextType>(() => {
		if (typeof window !== 'undefined') {
			const stored = getItem<UserContextType>(USER_STORAGE_KEY);
			if (stored) return stored;
		}
		return defaultUser;
	});

	// Save to localStorage on user change
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setItem(USER_STORAGE_KEY, user);
		}
	}, [user]);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};
