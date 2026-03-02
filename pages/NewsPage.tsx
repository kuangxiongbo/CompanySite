import React, { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsData } from '../data/news';

export const NewsPage: React.FC = () => {
   const { t, language } = useLanguage();
   const [activeTab, setActiveTab] = useState<'all' | 'company' | 'industry' | 'policy'>('all');
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 24;

   // Define Categories based on language
   const categories = {
      all: '全部',
      company: '公司动态',
      industry: '行业动态',
      policy: '政策解读'
   };

   // Filter and Sort News
   const filteredNews = newsData
      .filter(item => {
         if (activeTab === 'all') return true;
         // Default to "公司动态" if category missing, but unified script sets it.
         const itemCat = item.category || '公司动态';
         return itemCat === categories[activeTab];
      })
      .sort((a, b) => b.date.localeCompare(a.date));

   // Pagination Logic
   const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
   const currentNews = filteredNews.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const handleTabChange = (tab: 'all' | 'company' | 'industry' | 'policy') => {
      setActiveTab(tab);
      setCurrentPage(1); // Reset to page 1
   };

   return (
      <div className="bg-white font-sans min-h-screen">
         <PageHero
            title={t('news.heading')}
            subtitle={t('news.subheading')}
            image="/upload/173016165.png"
         />

         <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 border-b border-gray-100 mb-12 pb-4">
               {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => (
                  <button
                     key={key}
                     onClick={() => handleTabChange(key)}
                     className={`pb-2 px-4 text-lg font-semibold border-b-2 transition-colors duration-300 ${activeTab === key
                        ? 'border-ibc-brand text-ibc-brand'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                  >
                     {/* Translate tab labels if needed, for now using map keys or values */}
                     {language === 'zh' ? categories[key] : (key === 'all' ? 'All' : key === 'policy' ? 'Policy' : key === 'industry' ? 'Industry' : 'Company')}
                  </button>
               ))}
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
               {currentNews.map((item) => (
                  <Link
                     to={`/news/${item.id}`}
                     key={item.id}
                     className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group h-full"
                  >
                     <div className="h-52 overflow-hidden relative bg-gray-50">
                        <img
                           src={item.image || "/upload/news_default.png"}
                           alt={item.title}
                           onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src !== window.location.origin + "/upload/news_default.png") {
                                 target.src = "/upload/news_default.png";
                              }
                           }}
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />

                        <div className="absolute top-4 left-4 bg-ibc-brand/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                           {item.category}
                        </div>
                     </div>
                     <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center text-xs font-medium text-gray-400 mb-4 space-x-4">
                           <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {item.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-ibc-brand transition-colors line-clamp-2">
                           {item.title}
                        </h3>
                        <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed line-clamp-3">
                           {item.summary || "暂无摘要"}
                        </p>
                        <div className="flex items-center text-ibc-brand font-bold text-sm group-hover:translate-x-2 transition-transform mt-auto">
                           {t('news.readMore')} <ArrowRight size={16} className="ml-1.5" />
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                     disabled={currentPage === 1}
                     className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {t('news.prevPage')}
                  </button>
                  <div className="flex space-x-2">
                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Simple logic to show window around current page
                        let p = i + 1;
                        if (totalPages > 5) {
                           if (currentPage > 3) p = currentPage - 2 + i;
                           if (p > totalPages) p = totalPages - (4 - i);
                        }
                        return (
                           <button
                              key={p}
                              onClick={() => setCurrentPage(p)}
                              className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${currentPage === p
                                 ? 'bg-ibc-brand text-white font-bold'
                                 : 'border hover:bg-gray-50 text-gray-600'
                                 }`}
                           >
                              {p}
                           </button>
                        );
                     })}
                  </div>
                  <button
                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                     disabled={currentPage === totalPages}
                     className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {t('news.nextPage')}
                  </button>
               </div>
            )}

            {filteredNews.length === 0 && (
               <div className="text-center py-20 text-gray-500">
                  暂无相关动态
               </div>
            )}
         </div>
      </div>
   );
};