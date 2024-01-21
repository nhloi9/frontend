import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import i18nBackend from 'i18next-http-backend';
import {baseUrl} from './Constants';

i18n
	.use(i18nBackend)
	.use(initReactI18next)
	.init({
		fallbackLng: 'en',
		lng: 'en',
		interpolation: {
			escapeValue: false,
		},
		backend: {
			loadPath: baseUrl + '/i18n/{{lng}}.json',
		},
	});

export default i18n;
