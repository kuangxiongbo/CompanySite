import React from 'react';
import { ChevronRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-black flex items-center">
      {/* Background Image - Simulating the high-tech video feel */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
          alt="Cybersecurity Network" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full pr-4 pl-1 py-1 mb-8 hover:bg-white/20 transition-colors cursor-pointer group">
            <span className="bg-ibc-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{t('hero.badge')}</span>
            <span className="text-white text-sm font-medium tracking-wide group-hover:underline">{t('hero.badgeText')}</span>
            <ChevronRight className="text-white w-4 h-4" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-lg">
            {t('hero.titleStart')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ibc-brand to-green-400">
               {t('hero.titleEnd')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed font-light max-w-2xl drop-shadow-md">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <button className="bg-ibc-brand text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-green-600 transition-all shadow-[0_0_20px_rgba(0,177,64,0.3)] hover:shadow-[0_0_30px_rgba(0,177,64,0.5)] flex items-center justify-center">
              {t('hero.explore')} <ChevronRight className="ml-2 w-5 h-5" />
            </button>
            <button className="group border-2 border-white text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center backdrop-blur-sm">
              <PlayCircle className="mr-2 w-5 h-5" /> {t('hero.demo')}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             <div className="border-l-2 border-ibc-brand pl-4">
               <div className="text-3xl font-bold text-white">85,000+</div>
               <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">{t('hero.stats.customers')}</div>
             </div>
             <div className="border-l-2 border-ibc-brand pl-4">
               <div className="text-3xl font-bold text-white">95%</div>
               <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">{t('hero.stats.fortune')}</div>
             </div>
             <div className="border-l-2 border-ibc-brand pl-4">
               <div className="text-3xl font-bold text-white">150+</div>
               <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">{t('hero.stats.countries')}</div>
             </div>
             <div className="border-l-2 border-ibc-brand pl-4">
               <div className="text-3xl font-bold text-white">#1</div>
               <div className="text-sm text-gray-400 uppercase tracking-wider mt-1">{t('hero.stats.rating')}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};