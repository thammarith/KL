import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { generateUniqueId } from '@/utils/nanoId';
import { getItem, setItem } from '@/utils/localStorage';
import type { Person } from '@/interfaces/Person';

export interface PeopleContextType {
	people: Person[];
	addPerson: (person: Omit<Person, 'id'>) => void;
	updatePerson: (person: Person) => void;
	deletePerson: (personId: string) => void;
	getPersonById: (personId: string) => Person | undefined;
}

const PEOPLE_STORAGE_KEY = 'people';

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export const usePeopleContext = () => {
	const context = useContext(PeopleContext);
	if (context === undefined) {
		throw new Error('usePeopleContext must be used within a PeopleProvider');
	}
	return context;
};

// Sample data for development
const samplePeople: Person[] = [
	{
		id: 'person-1',
		name: 'John Doe',
	},
	{
		id: 'person-2',
		name: 'Jane Smith',
	},
	{
		id: 'person-3',
		name: 'Michael Johnson',
	},
];

export const PeopleProvider = ({ children }: { children: ReactNode }) => {
	// Load people from localStorage or use sample data
	const [people, setPeople] = useState<Person[]>(() => {
		const savedPeople = getItem<Person[]>(PEOPLE_STORAGE_KEY);
		return savedPeople || samplePeople;
	});

	// Save to localStorage whenever people change
	useEffect(() => {
		setItem(PEOPLE_STORAGE_KEY, people);
	}, [people]);

	const addPerson = useCallback((personData: Omit<Person, 'id'>) => {
		const newPerson: Person = {
			...personData,
			id: generateUniqueId(),
		};
		setPeople((prev) => [...prev, newPerson].toSorted((a, b) => a.name.localeCompare(b.name)));
	}, []);

	const updatePerson = useCallback((updatedPerson: Person) => {
		setPeople((prev) =>
			prev.map((person) => (person.id === updatedPerson.id ? updatedPerson : person))
		);
	}, []);

	const deletePerson = useCallback((personId: string) => {
		setPeople((prev) => prev.filter((person) => person.id !== personId));
	}, []);

	const getPersonById = useCallback(
		(personId: string) => people.find((person) => person.id === personId),
		[people]
	);

	return (
		<PeopleContext.Provider
			value={{ people, addPerson, updatePerson, deletePerson, getPersonById }}
		>
			{children}
		</PeopleContext.Provider>
	);
};
