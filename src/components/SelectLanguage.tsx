import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const SelectLanguage: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.language || 'en');

  useEffect(() => {
    // Update local state when i18n language changes
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2 content-center cursor-pointer">
      <div
        onClick={toggleLanguage}
        className="w-full h-full px-8 transition-all duration-200 content-center bg-black text-white hover:bg-red-600"
      >
        {currentLanguage === 'en' ? 'Español' : 'English'}
      </div>
    </div>
  );
};
