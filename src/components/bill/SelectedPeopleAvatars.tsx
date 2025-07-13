import React from 'react';
import PersonAvatar from '@/components/people/PersonAvatar';
import type { Person } from '@/interfaces/Person';
import { cn } from '@/utils/shadcn';
import { Badge } from '@/components/ui/badge';
import { CheckCheck } from 'lucide-react';

interface SelectedPeopleAvatarsProps {
	selectedPeople: Person[];
	allPeople: Person[];
	maxDisplay?: number;
	className?: string;
}

const SelectedPeopleAvatars: React.FC<SelectedPeopleAvatarsProps> = ({
	selectedPeople,
	allPeople,
	maxDisplay = 3,
	className,
}) => {
	// Group participants by ID and count occurrences
	const participantsGroups = selectedPeople.reduce(
		(acc, participant) => {
			const existing = acc.find((group) => group.participant.id === participant.id);
			if (existing) {
				existing.count++;
			} else {
				acc.push({ participant, count: 1 });
			}
			return acc;
		},
		[] as Array<{ participant: Person; count: number }>
	);

	const displayGroups = participantsGroups.slice(0, maxDisplay);
	const remainingCount = participantsGroups.length - maxDisplay;

	if (selectedPeople.length === 0) {
		return null;
	}

	if (selectedPeople.length === allPeople.length) {
		return (
			<Badge variant="outline">
				<CheckCheck />
				Everyone
			</Badge>
		);
	}

	return (
		<div className={cn('flex items-center gap-1', className)}>
			{displayGroups.map(({ participant, count }, index) => (
				<div key={participant.id} className="relative">
					<PersonAvatar
						person={participant}
						allPeople={allPeople}
						className={cn('border-2 border-white', index > 0 && '-ml-2')}
					/>
					{count > 1 && (
						<div
							className={cn(
								'absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full',
								'bg-blue-500 text-xs leading-none text-white'
								// TODO: reverse z index
								// `z-${arr.length % index}`
							)}
						>
							{count}
						</div>
					)}
				</div>
			))}
			{remainingCount > 0 && <div className="ml-1 text-xs text-gray-500">+{remainingCount}</div>}
		</div>
	);
};

export default SelectedPeopleAvatars;
