import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { LogoTicker } from '../components/LogoTicker';
import { PlatformTabs } from '../components/PlatformTabs';
import { FeatureGrid } from '../components/FeatureGrid';
import { SplitSection } from '../components/SplitSection';
import { NewsGrid } from '../components/NewsGrid';
import { useLanguage } from '../contexts/LanguageContext';
import { ContactModal } from '../components/ContactModal';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <Hero />
      <LogoTicker />
      <PlatformTabs />
      <FeatureGrid />
      <SplitSection />
      <NewsGrid />

      {/* Call to Action Section */}
      <section className="bg-ibc-brand py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{t('cta.title')}</h2>
          <p className="text-white/90 text-xl mb-12 font-light">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="px-10 py-4 bg-white text-ibc-brand font-bold text-lg rounded-md hover:bg-gray-50 shadow-2xl transition-all hover:scale-105">
              {t('cta.demo')}
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-md hover:bg-white/10 transition-all"
            >
              {t('cta.contact')}
            </button>
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="consultation"
      />
    </>
  );
};