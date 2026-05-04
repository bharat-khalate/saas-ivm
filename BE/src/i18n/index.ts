import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import * as i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

i18n
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload: ['en', 'hi'],
        backend: {
            // Points to en.json and hi.json in the same folder
            loadPath: path.join(__dirname, './{{lng}}.json'),
        },
        detection: {
            order: ['header', 'querystring', 'cookie'],
            caches: ['cookie'],
        },
        interpolation: {
            escapeValue: false, // Not needed for an API
        }
    });

export { i18n, i18nextMiddleware };