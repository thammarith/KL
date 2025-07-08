import { customAlphabet } from 'nanoid';
import { NANO_ID_CHARACTERS, NANO_ID_SIZE } from '@/constants/meta';

const getNanoId = (size: number = NANO_ID_SIZE): string => customAlphabet(NANO_ID_CHARACTERS, size)();

export const generateUniqueId = (existingIds: string[] = [], id: string = getNanoId()): string =>
	existingIds.includes(id) || Number(id) ? generateUniqueId(existingIds) : id;
