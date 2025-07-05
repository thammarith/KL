import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enGB from '@/locales/en-GB.json';
import th from '@/locales/th.json';

const resources = {
	'en-GB': { translation: enGB },
	th: { translation: th },
};

i18n.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en-GB',
		debug: import.meta.env.DEV,
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
