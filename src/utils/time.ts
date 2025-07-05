// Utility to convert time objects to milliseconds

export type TimeInput = {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	ms?: number;
};

export function toMs({ days = 0, hours = 0, minutes = 0, seconds = 0, ms = 0 }: TimeInput): number {
	return (((days * 24 + hours) * 60 + minutes) * 60 + seconds) * 1000 + ms;
}
