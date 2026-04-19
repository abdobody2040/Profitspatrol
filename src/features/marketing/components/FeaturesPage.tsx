
import React from 'react';
import { Brain, Gamepad2, TrendingUp, Shield, Mic, Scale, BookOpen, LineChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import PublicNavbar from '../../../components/layout/PublicNavbar';
import SmartImage from '../../../components/ui/SmartImage';

interface FeaturesPageProps {
  onHome: () => void;
  onFeatures: () => void;
  onCurriculum: () => void;
  onPricing: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onHome, onFeatures, onCurriculum, onPricing, onLogin, onRegister
}) => {
  const { t } = useTranslation();

  // Helper to safely get array from translations
  const getList = (key: string) => {
    const items = t(key as any, { returnObjects: true }) as any;
    return Array.isArray(items) ? items : [];
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <PublicNavbar
        onHome={onHome}
        onFeatures={onFeatures}
        onCurriculum={onCurriculum}
        onPricing={onPricing}
        onLogin={onLogin}
        onRegister={onRegister}
      />

      <div className="bg-blue-50 p-8 border-b border-blue-100 pt-32">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-black text-gray-800 mb-4">{t('features.page_title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl">{t('features.page_desc')}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid gap-12">

        <FeatureSection
          title={t('features.tankTitle')}
          desc={t('features.tankDesc')}
          icon={<Mic size={40} className="text-white" />}
          color="bg-red-500"
          items={getList('features.tankItems')}
          image="/images/features/tank.png"
        />

        <FeatureSection
          title={t('features.learningTitle')}
          desc={t('features.learningDesc')}
          icon={<Brain size={40} className="text-white" />}
          color="bg-purple-500"
          items={getList('features.learningItems')}
          image="/images/features/learning.png"
          reverse
        />

        <FeatureSection
          title={t('features.libraryTitle')}
          desc={t('features.libraryDesc')}
          icon={<BookOpen size={40} className="text-white" />}
          color="bg-indigo-500"
          items={getList('features.libraryItems')}
          image="/images/features/library.png"
        />

        <FeatureSection
          title={t('features.debateTitle')}
          desc={t('features.debateDesc')}
          icon={<Scale size={40} className="text-white" />}
          color="bg-orange-500"
          items={getList('features.debateItems')}
          image="/images/features/debate.png"
          reverse
        />

        <FeatureSection
          title={t('features.investTitle')}
          desc={t('features.investDesc')}
          icon={<LineChart size={40} className="text-white" />}
          color="bg-green-600"
          items={getList('features.investItems')}
          image="/images/features/invest.png"
        />

        <FeatureSection
          title={t('features.arcadeTitle')}
          desc={t('features.arcadeDesc')}
          icon={<Gamepad2 size={40} className="text-white" />}
          color="bg-blue-500"
          items={getList('features.arcadeItems')}
          image="/images/features/arcade.png"
          reverse
        />

        <FeatureSection
          title={t('features.progressionTitle')}
          desc={t('features.progressionDesc')}
          icon={<TrendingUp size={40} className="text-white" />}
          color="bg-green-500"
          items={getList('features.progressionItems')}
          image="/images/features/progression.png"
        />

        <FeatureSection
          title={t('features.safetyTitle')}
          desc={t('features.safetyDesc')}
          icon={<Shield size={40} className="text-white" />}
          color="bg-gray-500"
          items={getList('features.safetyItems')}
          image="/images/features/safety.png"
          reverse
        />

      </div>
    </div>
  );
};

const FeatureSection = ({ title, desc, icon, color, items, image, reverse }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`flex flex-col md:flex-row gap-12 items-center ${reverse ? 'md:flex-row-reverse' : ''}`}
  >
    <div className="flex-1 space-y-6">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${color}`}>
        {icon}
      </div>
      <h2 className="text-3xl font-black text-gray-800">{title}</h2>
      <p className="text-lg text-gray-500 font-medium leading-relaxed">{desc}</p>
      <ul className="space-y-3">
        {items.map((item: string) => (
          <li key={item} className="flex items-center gap-3 font-bold text-gray-700">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex-1">
      <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 aspect-video relative group">
        <SmartImage
          src={image}
          alt={title}
          type="feature"
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
        />
        <div className={`absolute inset-0 opacity-10 ${color} mix-blend-overlay`}></div>
      </div>
    </div>
  </motion.div>
);

export default FeaturesPage;
