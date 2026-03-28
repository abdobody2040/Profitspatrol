
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    document.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="relative">
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="p-2 rounded-xl transition-colors bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-kid-primary pr-8"
        aria-label="Select Language"
      >
        <option value="en" className="dark:bg-gray-800">EN</option>
        <option value="ar" className="dark:bg-gray-800">AR</option>
        <option value="es" className="dark:bg-gray-800">ES</option>
        <option value="fr" className="dark:bg-gray-800">FR</option>
        <option value="de" className="dark:bg-gray-800">DE</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
      </div>
    </div>
  );
};

export default LanguageToggle;
