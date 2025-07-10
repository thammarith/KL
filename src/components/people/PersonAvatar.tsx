import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { generateUniqueInitials, getAvatarColour } from '@/utils/avatar';
import type { Person } from '@/interfaces/Person';
import { cn } from '@/utils/shadcn';

interface PersonAvatarProps {
	person: Person;
	allPeople: Person[];
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const PersonAvatar = ({ person, allPeople, size = 'md', className }: PersonAvatarProps) => {
	const initials = generateUniqueInitials(person, allPeople);
	const colourClass = getAvatarColour(person.id);

	const sizeClasses = {
		sm: 'size-6 text-xs',
		md: 'size-8 text-xs',
		lg: 'size-12 text-base',
	};

	return (
		<Avatar className={cn(sizeClasses[size], className)}>
			<AvatarFallback className={cn(colourClass, 'font-medium text-white')}>{initials}</AvatarFallback>
		</Avatar>
	);
};

export default PersonAvatar;
