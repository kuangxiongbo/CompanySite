import React from 'react';
import { ArrowRight, FileText, Video, Mic } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const NewsGrid: React.FC = () => {
  const { t } = useLanguage();
  const items: any[] = t('news.items');

  // Helper to get icon
  const getIcon = (type: string) => {
    if (type === 'Report') return FileText;
    if (type === 'Webinar') return Video;
    return Mic;
  };

  const images = [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=2070&auto=format&fit=crop"
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{t('news.heading')}</h2>
            <p className="text-gray-500">{t('news.subheading')}</p>
          </div>
          <a href="#" className="hidden md:flex items-center font-bold text-gray-900 hover:text-ibc-brand transition-colors">
            {t('news.viewAll')} <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {items.map((item, idx) => {
            const Icon = getIcon(item.type);
            return (
              <div key={idx} className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={images[idx]} 
                    alt={item.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                    <Icon size={14} className="mr-1.5 text-ibc-brand" /> {item.tag}
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col">
                  <div className="text-xs font-semibold text-gray-400 mb-3">{item.type} • {item.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-ibc-brand transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center font-bold text-sm text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                    {t('news.readMore')} <ArrowRight className="ml-2 w-4 h-4 text-ibc-brand" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};