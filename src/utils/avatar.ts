import type { Person } from '@/interfaces/Person';

// Predefined colours for avatars (using Tailwind CSS colours)
const AVATAR_COLOURS = [
	'bg-red-500',
	'bg-blue-500',
	'bg-green-500',
	'bg-yellow-500',
	'bg-purple-500',
	'bg-pink-500',
	'bg-indigo-500',
	'bg-teal-500',
	'bg-orange-500',
	'bg-cyan-500',
	'bg-emerald-500',
	'bg-rose-500',
	'bg-violet-500',
	'bg-sky-500',
	'bg-lime-500',
	'bg-amber-500',
];

/**
 * Generate initials from a name
 */
export const getInitials = (name: string): string => {
	if (!name.trim()) return '?';

	const words = name.trim().split(/\s+/);

	if (words.length === 1) {
		// Single word - use first 2 characters
		return words[0].substring(0, 2).toUpperCase();
	}

	// Multiple words - use first letter of first 2 words
	return words
		.slice(0, 2)
		.map((word) => word.charAt(0))
		.join('')
		.toUpperCase();
};

/**
 * Generate a deterministic colour based on the person's ID
 */
export const getAvatarColour = (id: string): string => {
	// Simple hash function to get a consistent colour for each ID
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		const char = id.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}

	const colourIndex = Math.abs(hash) % AVATAR_COLOURS.length;
	return AVATAR_COLOURS[colourIndex];
};

/**
 * Generate unique initials for a person, ensuring no conflicts with existing people
 */
export const generateUniqueInitials = (person: Person, existingPeople: Person[]): string => {
	const baseInitials = getInitials(person.name);

	// Get all existing initials except for the current person
	const existingInitials = existingPeople.filter((p) => p.id !== person.id).map((p) => getInitials(p.name));

	// If no conflict, return base initials
	if (!existingInitials.includes(baseInitials)) {
		return baseInitials;
	}

	// If conflict, try adding more characters from the name
	const name = person.name.trim();
	const words = name.split(/\s+/);

	// Strategy 1: Try first letter + second letter of first word
	if (words[0].length > 1) {
		const alternative1 = (words[0].charAt(0) + words[0].charAt(1)).toUpperCase();
		if (!existingInitials.includes(alternative1)) {
			return alternative1;
		}
	}

	// Strategy 2: Try first 3 letters if single word
	if (words.length === 1 && words[0].length > 2) {
		const alternative2 = words[0].substring(0, 3).toUpperCase();
		if (!existingInitials.includes(alternative2)) {
			return alternative2;
		}
	}

	// Strategy 3: Try first letter of first word + first letter of last word (if more than 2 words)
	if (words.length > 2) {
		const alternative3 = (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
		if (!existingInitials.includes(alternative3)) {
			return alternative3;
		}
	}

	// Strategy 4: Add numbers if still conflicting
	for (let i = 1; i <= 99; i++) {
		const numbered = `${baseInitials.charAt(0)}${i}`;
		if (!existingInitials.includes(numbered)) {
			return numbered;
		}
	}

	// Fallback: use the ID's first 2 characters
	return person.id.substring(0, 2).toUpperCase();
};
