// Utility to convert time objects to milliseconds

export type TimeInput = {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	ms?: number;
};

export function formatDate(date: Date): string {
	return Intl.DateTimeFormat(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		weekday: 'short',
	}).format(date);
}

export function formatTime(date: Date): string {
	return Intl.DateTimeFormat(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(date);
}

export function toMs({ days = 0, hours = 0, minutes = 0, seconds = 0, ms = 0 }: TimeInput): number {
	return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000 + ms;
}
