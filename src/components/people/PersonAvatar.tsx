import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { generateUniqueInitials, getAvatarColour } from '@/utils/avatar';
import type { Person } from '@/interfaces/Person';
import { cn } from '@/utils/shadcn';

interface PersonAvatarProps {
	person: Person;
	allPeople: Person[];
	className?: string;
}

const PersonAvatar = ({ person, allPeople, className }: PersonAvatarProps) => {
	const initials = generateUniqueInitials(person, allPeople);
	const colourClass = getAvatarColour(person.id);

	return (
		<Avatar className={cn('size-8 text-xs', className)}>
			<AvatarFallback className={cn(colourClass, 'leading-6 font-medium text-white')}>
				{initials}
			</AvatarFallback>
		</Avatar>
	);
};

export default PersonAvatar;
