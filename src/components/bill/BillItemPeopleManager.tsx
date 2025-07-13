import React, { useState } from 'react';
import ParticipantsSelector from './ParticipantsSelector';
import SelectedPeopleAvatars from './SelectedPeopleAvatars';
import type { Person } from '@/interfaces/Person';

interface BillItemPeopleManagerProps {
	onPeopleChange: (people: Person[]) => void;
	initialPeople?: Person[];
	className?: string;
}

// Mock data for people selector - replace with actual people from context later
const mockAllPeople: Person[] = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Charlie' },
	{ id: '4', name: 'Diana' },
	{ id: '5', name: 'Eve' },
];

const BillItemPeopleManager: React.FC<BillItemPeopleManagerProps> = ({
	onPeopleChange,
	initialPeople = [],
	className,
}) => {
	const [selectedPeople, setSelectedPeople] = useState<Person[]>(initialPeople);
	const participantsSelectorOpenController = useState(false);

	const handlePeopleChange = (people: Person[]) => {
		setSelectedPeople(people);
		onPeopleChange(people);
	};

	return (
		<div className={`flex items-center gap-x-4 ${className || ''}`}>
			<SelectedPeopleAvatars selectedPeople={selectedPeople} allPeople={mockAllPeople} />
			<ParticipantsSelector
				selectedPeople={selectedPeople}
				onSelectionChange={handlePeopleChange}
				allPeople={mockAllPeople}
				openController={participantsSelectorOpenController}
			/>
		</div>
	);
};

export default BillItemPeopleManager;
