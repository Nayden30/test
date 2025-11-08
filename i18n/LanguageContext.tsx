import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

type Locale = 'fr' | 'en';
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    // Check if browser default is French
    const browserLang = navigator.language.split('-')[0];
    if (!savedLocale && browserLang === 'fr') {
        return 'fr';
    }
    // Default to English if no preference is saved and browser is not French, or if saved preference is invalid
    return (savedLocale === 'fr' || savedLocale === 'en') ? savedLocale : 'en';
  });

  useEffect(() => {
    localStorage.setItem('locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);
  
  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};