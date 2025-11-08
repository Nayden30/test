import { useLanguage } from '../i18n/LanguageContext';
import { translations } from '../i18n/translations';

type TranslationPayload = Record<string, string | number>;

export const useTranslation = () => {
  const { locale } = useLanguage();

  const t = (key: string, payload?: TranslationPayload): string => {
    // First, try to find a pluralized version if a count is provided
    if (payload && typeof payload.count === 'number') {
      const count = payload.count;
      const pluralKey = count === 1 ? `${key}_one` : `${key}_other`;
      
      const pluralResult = pluralKey.split('.').reduce((acc, k) => acc && acc[k], translations[locale] as any);
      
      if (typeof pluralResult === 'string') {
        return Object.entries(payload).reduce((acc, [pKey, pValue]) => {
          return acc.replace(`{{${pKey}}}`, String(pValue));
        }, pluralResult);
      }
    }

    // Fallback to the non-pluralized key
    const result = key.split('.').reduce((acc, k) => acc && acc[k], translations[locale] as any);

    if (typeof result !== 'string') {
      return key; // Return the key itself as a fallback
    }

    // Perform interpolation
    if (payload) {
      return Object.entries(payload).reduce((acc, [pKey, pValue]) => {
        return acc.replace(`{{${pKey}}}`, String(pValue));
      }, result);
    }

    return result;
  };

  return { t };
};
