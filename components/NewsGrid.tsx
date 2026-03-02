import React from 'react';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { newsData } from '../data/news';
import { Link } from 'react-router-dom';

export const NewsGrid: React.FC = () => {
  const { t, language } = useLanguage();

  // 取最新3条新闻
  const latestNews = newsData.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{t('news.heading')}</h2>
            <p className="text-gray-500">{t('news.subheading')}</p>
          </div>
          <Link to="/about/news" className="hidden md:flex items-center font-bold text-gray-900 hover:text-ibc-brand transition-colors">
            {t('news.viewAll')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {latestNews.map((item, idx) => (
            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image || "/upload/news_default.png"}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== window.location.origin + "/upload/news_default.png") {
                      target.src = "/upload/news_default.png";
                    }
                  }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center">
                  <Newspaper size={14} className="mr-1.5 text-ibc-brand" /> {item.category}
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col">
                <div className="text-xs font-semibold text-gray-400 mb-3">{item.category} • {item.date}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-ibc-brand transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
                <div className="flex items-center font-bold text-sm text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                  {t('news.readMore')} <ArrowRight className="ml-2 w-4 h-4 text-ibc-brand" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};