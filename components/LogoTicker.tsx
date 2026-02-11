import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Placeholder SVGs for logos to avoid external dependencies breaking
const LogoPlaceholder: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center justify-center mx-12 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-pointer">
    <span className="text-2xl font-bold text-gray-800 font-serif italic">{text}</span>
  </div>
);

export const LogoTicker: React.FC = () => {
  const { t } = useLanguage();
  const logos = [
    "TechCorp", "GlobalBank", "HealthPlus", "AeroSpace", "FutureNet", "DataSys", "CloudNine"
  ];

  return (
    <section className="bg-gray-50 py-12 border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('ticker.trustedBy')}</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex">
          {logos.map((logo, i) => (
            <LogoPlaceholder key={i} text={logo} />
          ))}
          {logos.map((logo, i) => (
            <LogoPlaceholder key={`dup-${i}`} text={logo} />
          ))}
          {logos.map((logo, i) => (
            <LogoPlaceholder key={`dup2-${i}`} text={logo} />
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};