import React, { useState } from 'react';
import ParticipantsSelector from './ParticipantsSelector';
import SelectedPeopleAvatars from './SelectedPeopleAvatars';
import type { Person } from '@/interfaces/Person';
import { usePeopleContext } from '@/contexts/PeopleContext';

interface BillItemPeopleManagerProps {
	onPeopleChange: (people: Person[]) => void;
	selectedPeople?: Person[];
	className?: string;
}

const BillItemPeopleManager: React.FC<BillItemPeopleManagerProps> = ({
	onPeopleChange,
	selectedPeople = [],
	className,
}) => {
	const participantsSelectorOpenController = useState(false);

	// Get all people from PeopleContext
	const { people } = usePeopleContext();

	return (
		<div className={`flex items-center gap-2 ${className}`}>
			<SelectedPeopleAvatars selectedPeople={selectedPeople} allPeople={people} />
			<ParticipantsSelector
				selectedPeople={selectedPeople}
				onSelectionChange={onPeopleChange}
				allPeople={people}
				openController={participantsSelectorOpenController}
			/>
		</div>
	);
};

export default BillItemPeopleManager;
