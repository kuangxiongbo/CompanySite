import React from 'react';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const newsItems: any[] = t('news.items');

  return (
    <div className="bg-white">
      <PageHero 
        title={t('news.heading')} 
        subtitle={t('news.subheading')}
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-3 gap-8">
            {newsItems.map((item, idx) => (
               <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
                  <div className="h-56 overflow-hidden relative">
                     <img 
                       src={`https://picsum.photos/seed/news${idx}/800/500`} 
                       alt={item.title} 
                       className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-4 left-4 bg-ibc-brand text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.tag}
                     </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                     <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                        <span className="flex items-center"><Tag size={14} className="mr-1" /> {item.type}</span>
                        <span className="flex items-center"><Calendar size={14} className="mr-1" /> {item.date}</span>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-ibc-brand transition-colors">{item.title}</h3>
                     <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">{item.desc}</p>
                     <button className="flex items-center text-ibc-brand font-bold text-sm group-hover:translate-x-2 transition-transform">
                        {t('news.readMore')} <ArrowRight size={16} className="ml-1" />
                     </button>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-16 text-center">
            <button className="border-2 border-gray-200 text-gray-600 px-8 py-3 rounded-md font-bold hover:border-ibc-brand hover:text-ibc-brand transition-colors">
               {language === 'zh' ? "加载更多" : "Load More"}
            </button>
         </div>
      </div>
    </div>
  );
};