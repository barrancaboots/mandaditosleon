import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Importa tus archivos de traducción usando el alias '@/'
import en from '@/locales/en.json';
import es from '@/locales/es.json';

// Crea una instancia de I18n
const i18n = new I18n({
  en,
  es,
});

// Establece el idioma del dispositivo o usa 'es' como predeterminado
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'es';

// Si una clave no existe en el idioma actual, buscará en el idioma por defecto.
i18n.enableFallback = true;
i18n.defaultLocale = 'es';

// Exporta una función 't' para usar en tus componentes.
export const t = (scope: I18n.Scope, options?: I18n.TranslateOptions) => {
  return i18n.t(scope, options);
};

export default i18n;