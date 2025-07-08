import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { generateUniqueId } from '@/utils/nanoId';
import { getItem, setItem } from '@/utils/localStorage';
import { getCurrencyByCountryCode } from '@/constants/i18n';
import { DEFAULT_CURRENCY } from '@/constants/currency';
import type { User } from '@/interfaces/User';

export interface UserContextType extends User {
	setName: (name: string) => void;
}

const getDefaultLocale = () => window?.navigator?.language ?? 'en-GB';

const USER_STORAGE_KEY = 'user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, countryCode }: { children: ReactNode; countryCode?: string }) => {
	const uniqueId = useMemo(() => generateUniqueId(), []);
	const [name, setName] = useState<string>(`u#${uniqueId}`);

	const _user = (window && getItem<User>(USER_STORAGE_KEY)) ?? {
		id: uniqueId,
		name,
		countryCode: 'XX',
		defaultCurrency: DEFAULT_CURRENCY,
		locale: getDefaultLocale(),
	};

	const user = {
		..._user,
		countryCode: countryCode ?? _user.countryCode,
		defaultCurrency: (countryCode && getCurrencyByCountryCode(countryCode)?.code) ?? _user.defaultCurrency,
		locale: getDefaultLocale(),
	};

	// Save to localStorage on user change
	useEffect(() => {
		if (window) setItem(USER_STORAGE_KEY, user);
	}, [user]);

	return <UserContext.Provider value={{ ...user, setName }}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return context;
};
