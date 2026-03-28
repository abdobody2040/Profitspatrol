
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PublicNavbarProps {
  onHome: () => void;
  onFeatures: () => void;
  onCurriculum: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister
}) => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    document.dir = e.target.value === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onHome}>
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12 object-contain bg-transparent" />
          <img src="/images/logo_text.png" alt="Profits Patrol" className="h-14 w-auto object-contain" />
        </div>
        <div className="hidden md:flex gap-8 font-bold text-gray-500">
          <button onClick={onFeatures} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.features')}</button>
          <button onClick={onCurriculum} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.curriculum')}</button>
          <button onClick={onPricing} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.pricing')}</button>
        </div>
        <div className="flex items-center gap-3 space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">🌐</span>
            <select
              value={i18n.language}
              onChange={changeLanguage}
              className="pl-8 pr-2 py-2 bg-transparent text-gray-500 hover:text-gray-800 transition-colors font-bold text-sm appearance-none cursor-pointer focus:outline-none"
              title="Switch Language"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button
            onClick={onLogin}
            className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors mx-1"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={onRegister}
            className="px-6 py-2 bg-kid-primary text-yellow-900 font-black rounded-xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 transition-all mx-1"
          >
            {t('nav.start_free')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
