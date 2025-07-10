import { useState } from 'react';
import PersonCard from '@/components/people/PersonCard';
import PeopleForm from '@/components/people/PeopleForm';
import PeopleView from '@/components/people/PeopleView';
import { usePeopleContext } from '@/contexts/PeopleContext';

const PeopleList = () => {
	const { people, addPerson, updatePerson, deletePerson } = usePeopleContext();
	const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

	const handleCreateSave = (name: string) => {
		addPerson({ name });
	};

	const handleEditStart = (personId: string) => {
		setEditingPersonId(personId);
	};

	const handleEditSave = (personId: string, name: string) => {
		updatePerson({ id: personId, name });
		setEditingPersonId(null);
	};

	const handleEditCancel = () => {
		setEditingPersonId(null);
	};

	const handleDelete = (personId: string) => {
		deletePerson(personId);
	};

	return (
		<div className="space-y-4 md:pe-24">
			{/* Create new person card */}
			<PersonCard mode="create" form={<PeopleForm onSave={handleCreateSave} />} />

			{/* Existing people */}
			{people.map((person) => (
				<PersonCard
					key={person.id}
					mode={editingPersonId === person.id ? 'edit' : 'view'}
					person={person}
					allPeople={people}
					view={
						<PeopleView
							person={person}
							onEdit={() => handleEditStart(person.id)}
							onDelete={() => handleDelete(person.id)}
						/>
					}
					form={
						<PeopleForm
							person={person}
							onSave={(name) => handleEditSave(person.id, name)}
							onCancel={handleEditCancel}
						/>
					}
				/>
			))}
		</div>
	);
};

export default PeopleList;
