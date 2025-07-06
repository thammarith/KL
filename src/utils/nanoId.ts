import { customAlphabet } from 'nanoid';
import { NANO_ID_CHARACTERS, NANO_ID_SIZE } from '@/constants/meta';

export const getNanoId = (size: number = NANO_ID_SIZE): string => customAlphabet(NANO_ID_CHARACTERS, size)();
