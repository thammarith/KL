import type { ReactNode } from 'react';
import PersonAvatar from '@/components/people/PersonAvatar';
import type { Person } from '@/interfaces/Person';

type PersonCardMode = 'create' | 'view' | 'edit';

interface PersonCardProps {
	mode: PersonCardMode;
	person?: Person;
	allPeople?: Person[];
	view?: ReactNode;
	form?: ReactNode;
}

const PersonCard = ({ mode, person, allPeople = [], view, form }: PersonCardProps) => {
	const avatarPerson = mode === 'create' ? { id: 'q', name: '??' } : person!;
	const avatarPeople = mode === 'create' ? [] : allPeople;

	return (
		<div className="flex items-center gap-4">
			{/* Slot 1: Avatar */}
			<PersonAvatar person={avatarPerson} allPeople={avatarPeople} size="md" />

			{/* Slot 2: Form or View */}
			{(mode === 'create' || mode === 'edit') && form}
			{mode === 'view' && view}
		</div>
	);
};

export default PersonCard;
