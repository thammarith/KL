import type { FC } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { UserPlus, Minus, Plus, Check } from 'lucide-react';
import PersonAvatar from '@/components/people/PersonAvatar';
import { cn } from '@/utils/shadcn';
import type { Person } from '@/interfaces/Person';

// Mock data for demonstration
const mockPeople: Person[] = [
	{ id: '1', name: 'Alice' },
	{ id: '2', name: 'Bob' },
	{ id: '3', name: 'Charlie' },
	{ id: '4', name: 'Diana' },
	{ id: '5', name: 'Eve' },
];

interface ParticipantsSelectorProps {
	selectedPeople: Person[];
	onSelectionChange: (people: Person[]) => void;
	allPeople: Person[];
	openController: [boolean, (open: boolean) => void];
}

const ParticipantsSelector: FC<ParticipantsSelectorProps> = ({
	selectedPeople,
	onSelectionChange,
	// allPeople,
	openController,
}) => {
	const [isOpen, setIsOpen] = openController;

	const getPersonCount = (person: Person) => {
		return selectedPeople.filter((p) => p.id === person.id).length;
	};

	const incrementPerson = (person: Person) => {
		onSelectionChange([...selectedPeople, person]);
	};

	const decrementPerson = (person: Person) => {
		const index = selectedPeople.findIndex((p) => p.id === person.id);
		onSelectionChange(selectedPeople.filter((_, i) => i !== index));
	};

	const togglePersonSelection = (person: Person) => {
		const count = getPersonCount(person);
		if (count === 0) {
			// Add person (set to 1)
			onSelectionChange([...selectedPeople, person]);
		} else {
			// Clear person (set to 0)
			const newSelection = selectedPeople.filter((p) => p.id !== person.id);
			onSelectionChange(newSelection);
		}
	};

	const toggleAll = () => {
		onSelectionChange(selectedPeople.length === 0 ? [...mockPeople] : []);
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
				<Button
					variant="ghost"
					size={selectedPeople.length === 0 ? 'default' : 'icon'}
					className="-ml-2"
					aria-label="Select participants"
					onClick={() => setIsOpen(!isOpen)}
				>
					<UserPlus className="size-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-72 p-2" onClick={(e) => e.stopPropagation()}>
				<div className="mb-2 flex items-center justify-between p-2">
					<span className="text-sm font-semibold">Participants</span>
					<Button
						variant={selectedPeople.length === 0 ? 'default' : 'ghost'}
						size="sm"
						onClick={toggleAll}
						className="font-normal"
					>
						{selectedPeople.length === 0 ? 'Select All' : 'Clear All'}
					</Button>
				</div>
				<div className="max-h-48 space-y-2 overflow-y-auto">
					{mockPeople.map((person) => {
						const count = getPersonCount(person);
						const isSelected = count > 0;
						return (
							<div
								key={person.id}
								className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50"
							>
								<div
									className="flex flex-1 cursor-pointer items-center gap-2"
									onClick={() => togglePersonSelection(person)}
								>
									<span
										className={cn(
											'inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
											isSelected
												? 'border-blue-600 bg-blue-600 text-white'
												: 'border-gray-300 bg-white text-gray-400 hover:border-blue-300'
										)}
									>
										{isSelected && <Check className="h-4 w-4" />}
									</span>
									<PersonAvatar person={person} allPeople={mockPeople} />
									<span className="text-sm">{person.name}</span>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										size="icon"
										onClick={() => decrementPerson(person)}
										// disabled={count === 0}
										type="button"
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="w-6 text-center font-mono text-sm">{count}</span>
									<Button
										variant="outline"
										size="icon"
										onClick={() => incrementPerson(person)}
										type="button"
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ParticipantsSelector;
