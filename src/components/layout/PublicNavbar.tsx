
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
    <nav className="fixed top-0 start-0 end-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-1 sm:gap-2 cursor-pointer shrink-0" onClick={onHome}>
          <picture>
            <source srcSet="/images/logo.webp" type="image/webp" />
            <img
              src="/images/logo.png"
              alt="Logo"
              width={48}
              height={36}
              className="w-10 h-10 md:w-12 md:h-12 object-contain bg-transparent"
              loading="eager"
              decoding="async"
            />
          </picture>
          <picture>
            <source srcSet="/images/logo_text.webp" type="image/webp" />
            <img
              src="/images/logo_text.png"
              alt="Profits Patrol"
              width={200}
              height={40}
              className="h-8 sm:h-10 md:h-14 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
        <div className="hidden md:flex gap-8 font-bold text-gray-500">
          <button onClick={onFeatures} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.features')}</button>
          <button onClick={onCurriculum} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.curriculum')}</button>
          <button onClick={onPricing} className="hover:text-kid-secondary transition-colors mx-2">{t('nav.pricing')}</button>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 space-x-1 sm:space-x-3 rtl:space-x-reverse">
          <div className="relative">
            <span className="absolute start-1.5 sm:start-2 top-1/2 -translate-y-1/2 text-xs sm:text-sm">🌐</span>
            <select
              value={i18n.language}
              onChange={changeLanguage}
              className="ps-6 sm:ps-8 pe-1 sm:pe-2 py-1.5 sm:py-2 bg-transparent text-gray-500 hover:text-gray-800 transition-colors font-bold text-[10px] sm:text-sm appearance-none cursor-pointer focus:outline-none"
              title="Switch Language"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
            </select>
          </div>
          <button
            onClick={onLogin}
            className="px-2 sm:px-5 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors text-xs sm:text-base"
          >
            {t('auth.login')}
          </button>
          <button
            onClick={onRegister}
            className="px-3 sm:px-6 py-2 bg-kid-primary text-yellow-900 font-black rounded-xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy hover:bg-yellow-400 transition-all text-xs sm:text-base whitespace-nowrap"
          >
            <span className="hidden xs:inline">{t('nav.start_free')}</span>
            <span className="xs:hidden">{t('nav.start_free').split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
