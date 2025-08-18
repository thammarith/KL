import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { generateUniqueId } from '@/utils/nanoId';
import type { Person } from '@/interfaces/Person';
import { peopleRepository } from '@/repositories/peopleRepository';

export interface PeopleContextType {
	people: Person[];
	addPerson: (person: Omit<Person, 'id'>) => void;
	updatePerson: (person: Person) => void;
	deletePerson: (personId: string) => void;
	getPersonById: (personId: string) => Person | undefined;
	syncWithDB: () => Promise<void>;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const usePeopleContext = () => {
	const context = useContext(PeopleContext);
	if (context === undefined) {
		throw new Error('usePeopleContext must be used within a PeopleProvider');
	}
	return context;
};

export const PeopleProvider = ({ children }: { children: ReactNode }) => {
	const [people, setPeople] = useState<Person[]>([]);

	// Load people from IndexedDB on mount
	useEffect(() => {
		loadPeople();
	}, []);

	const loadPeople = async () => {
		const storedPeople = (await peopleRepository.get()) as Person[];
		setPeople(storedPeople.sort((a, b) => a.name.localeCompare(b.name)));
	};

	const syncWithDB = useCallback(async () => {
		await loadPeople();
	}, []);

	const addPerson = useCallback(async (personData: Omit<Person, 'id'>) => {
		const newPerson: Person = {
			...personData,
			id: generateUniqueId(),
		};
		await peopleRepository.save([newPerson]);
		setPeople((prev) => [...prev, newPerson].toSorted((a, b) => a.name.localeCompare(b.name)));
	}, []);

	const updatePerson = useCallback(async (updatedPerson: Person) => {
		await peopleRepository.save([updatedPerson]);
		setPeople((prev) =>
			prev.map((person) => (person.id === updatedPerson.id ? updatedPerson : person))
		);
	}, []);

	const deletePerson = useCallback(async (personId: string) => {
		await peopleRepository.delete(personId);
		setPeople((prev) => prev.filter((person) => person.id !== personId));
	}, []);

	const getPersonById = useCallback(
		(personId: string) => people.find((person) => person.id === personId),
		[people]
	);

	return (
		<PeopleContext.Provider
			value={{
				people,
				addPerson,
				updatePerson,
				deletePerson,
				getPersonById,
				syncWithDB,
			}}
		>
			{children}
		</PeopleContext.Provider>
	);
};
