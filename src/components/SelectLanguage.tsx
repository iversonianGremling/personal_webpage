import React from 'react';

export const SelectLanguage: React.FC = () => {
  const [globalLanguage, setGlobalLanguage] = React.useState('en');

  return (
    <div className="flex items-center gap-2 content-center cursor-pointer">
      <div
        onClick={() => globalLanguage === 'en' ? setGlobalLanguage('es') : setGlobalLanguage('en')}
        className={`w-full h-full px-8 transition-all duration-200 content-center ${
          'bg-black text-white hover:bg-red-600'
        }`}
      >
        {globalLanguage === 'en' ? 'English' : 'Español'}
      </div>
    </div>
  );
};
