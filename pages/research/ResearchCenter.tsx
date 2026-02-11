import React from 'react';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { Cpu, Lock, Network, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResearchCenter: React.FC = () => {
  const { t, language } = useLanguage();
  const areas: any[] = t('research.areas');
  const icons = [Lock, Cpu, Database, Network];

  return (
    <div className="bg-white">
      <PageHero 
        title={t('research.heroTitle')} 
        subtitle={t('research.heroSubtitle')}
        image="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-2 gap-12">
            {areas.map((area, idx) => {
               const Icon = icons[idx % icons.length];
               return (
                  <Link to={`/research/topic-${idx}`} key={idx} className="bg-gray-50 p-10 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group block">
                     <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-ibc-brand transition-colors">
                        <Icon size={32} className="text-ibc-brand group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="text-2xl font-bold text-gray-900 mb-4">{area.title}</h3>
                     <p className="text-gray-600 text-lg leading-relaxed">
                        {area.desc}
                     </p>
                  </Link>
               );
            })}
         </div>

         <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {language === 'zh' ? "参与我们的研究" : "Join Our Research"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10">
              {language === 'zh' 
                ? "我们与高校、科研机构保持紧密合作。如果您对相关领域感兴趣，欢迎联系奥联研究院。"
                : "We collaborate closely with universities and research institutions. Contact OLYM Research Institute if you are interested."}
            </p>
            <button className="bg-ibc-brand text-white px-8 py-3 rounded-md font-bold hover:bg-green-600 transition-colors">
               {language === 'zh' ? "联系研究院" : "Contact Institute"}
            </button>
         </div>
      </div>
    </div>
  );
};