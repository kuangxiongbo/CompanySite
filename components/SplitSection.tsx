import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';

export const SplitSection: React.FC = () => {
  const { t } = useLanguage();
  const points: string[] = t('split.points');

  return (
    <section className="bg-gray-900 text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
             <div className="inline-block px-3 py-1 bg-ibc-brand/20 text-ibc-brand font-bold text-xs rounded-full mb-6 uppercase tracking-widest">
                {t('split.badge')}
             </div>
             <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
               {t('split.titleStart')} <br/>
               <span className="text-gray-400">{t('split.titleEnd')}</span>
             </h2>
             <p className="text-gray-300 text-lg mb-8 leading-relaxed">
               {t('split.desc')}
             </p>
             
             <ul className="space-y-4 mb-10">
               {points.map((item, i) => (
                 <li key={i} className="flex items-start">
                   <CheckCircle className="text-ibc-brand mr-3 mt-1 flex-shrink-0" size={20} />
                   <span className="text-gray-200">{item}</span>
                 </li>
               ))}
             </ul>

             <Button variant="primary">{t('split.button')}</Button>
          </div>
          
          <div className="lg:w-1/2 relative">
             <div className="absolute -inset-4 bg-ibc-brand/20 rounded-full blur-3xl opacity-30"></div>
             <img 
               src="https://picsum.photos/800/800?random=50" 
               alt="Threat Intelligence Dashboard" 
               className="relative z-10 rounded-lg shadow-2xl border border-gray-700"
             />
             {/* Floating Badge */}
             <div className="absolute -bottom-6 -left-6 z-20 bg-white p-6 rounded-lg shadow-xl max-w-xs text-gray-900 hidden md:block">
                <div className="text-4xl font-bold text-ibc-brand mb-1">99.9%</div>
                <div className="font-semibold text-lg">{t('split.floatingMetric')}</div>
                <div className="text-sm text-gray-500">{t('split.floatingSub')}</div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};