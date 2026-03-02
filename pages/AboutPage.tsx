import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Award, Phone, Mail, MapPin, Clock, Calendar, Tag, Briefcase, Users, ArrowRight } from 'lucide-react';
import {
   profileData, historyData, honorsData, careersData,
   contactData, aboutPageMeta
} from '../data/about';
import { newsData, industryNewsData } from '../data/news';

// Sub-navigation tabs matching the production site
const tabs = [
   { id: 'news', label: '最新动态' },
   { id: 'profile', label: '关于奥联' },
   { id: 'history', label: '发展历程' },
   { id: 'honors', label: '荣誉资质' },
   { id: 'careers', label: '招贤纳士' },
   { id: 'contact', label: '联系我们' },
];

export const AboutPage: React.FC = () => {
   const { id } = useParams();
   const { language } = useLanguage();
   const pageId = id || 'profile';
   const meta = aboutPageMeta[pageId] || aboutPageMeta.profile;

   return (
      <div className="bg-white">
         <PageHero
            title={meta.title}
            subtitle={meta.subtitle}
            image={meta.image}
         />
         <div id="v2-check" style={{ display: 'none' }}>v2-optimized</div>

         <div className="max-w-7xl mx-auto px-6 py-24">
            {/* Sub-nav */}
            <div className="flex flex-wrap gap-4 mb-16 border-b border-gray-200 pb-6">
               {tabs.map(tab => (
                  <Link
                     key={tab.id}
                     to={`/about/${tab.id}`}
                     className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${pageId === tab.id
                        ? 'bg-ibc-brand text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                  >
                     {tab.label}
                  </Link>
               ))}
            </div>

            {pageId === 'news' && <NewsSection />}
            {pageId === 'profile' && <ProfileSection />}
            {pageId === 'history' && <HistorySection />}
            {pageId === 'honors' && <HonorsSection />}
            {pageId === 'careers' && <CareersSection />}
            {pageId === 'contact' && <ContactSection />}
         </div>
      </div>
   );
};

// ============================================================
// 最新动态
// ============================================================
const NewsSection: React.FC = () => {
   const { t, language } = useLanguage();
   const [currentPage, setCurrentPage] = React.useState(1);
   const [activeTab, setActiveTab] = React.useState('all');
   const itemsPerPage = 24;

   const categoryMap: Record<string, string> = {
      all: language === 'zh' ? '全部' : 'All',
      company: language === 'zh' ? '公司动态' : 'Company',
      industry: language === 'zh' ? '行业动态' : 'Industry',
      policy: language === 'zh' ? '政策解读' : 'Policy'
   };

   const categoryValues: Record<string, string> = {
      company: '公司动态',
      industry: '行业动态',
      policy: '政策解读'
   };

   const filteredNews = React.useMemo(() => {
      const all = [...newsData, ...industryNewsData];
      const filtered = all.filter(item => {
         if (activeTab === 'all') return true;
         return item.category === categoryValues[activeTab];
      });
      return filtered.sort((a, b) => b.date.localeCompare(a.date));
   }, [activeTab]);

   // Pagination Logic
   const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
   const currentNews = filteredNews.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      setCurrentPage(1);
      window.scrollTo({ top: 400, behavior: 'smooth' });
   };

   return (
      <div>
         {/* Category Tabs */}
         <div className="flex flex-wrap items-center gap-4 mb-12 border-b border-gray-100 pb-4">
            {Object.keys(categoryMap).map((key) => (
               <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={`px-4 py-2 text-sm font-bold transition-all border-b-2 ${activeTab === key
                     ? 'border-ibc-brand text-ibc-brand'
                     : 'border-transparent text-gray-500 hover:text-gray-800'
                     }`}
               >
                  {categoryMap[key]}
               </button>
            ))}
            <div className="ml-auto text-xs text-gray-400">
               {language === 'zh' ? `共 ${filteredNews.length} 条` : `Total ${filteredNews.length}`}
            </div>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentNews.map((item) => (
               <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group block h-full flex flex-col"
               >
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                     <img
                        src={item.image || "/upload/news_default.png"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           if (target.src !== window.location.origin + "/upload/news_default.png") {
                              target.src = "/upload/news_default.png";
                           }
                        }}
                     />
                     <div className="absolute top-4 left-4 bg-ibc-brand/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {item.category}
                     </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                     <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center"><Calendar size={14} className="mr-1" />{item.date}</span>
                     </div>
                     <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-ibc-brand transition-colors line-clamp-2 leading-snug">
                        {item.title}
                     </h3>
                     <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {item.summary || "暂无摘要"}
                     </p>
                     <span className="mt-auto inline-flex items-center text-ibc-brand text-sm font-bold group-hover:translate-x-1 transition-transform">
                        {t('news.readMore')} <ArrowRight size={14} className="ml-1" />
                     </span>
                  </div>
               </Link>
            ))}
         </div>

         {/* Pagination Controls */}
         {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-16">
               <button
                  onClick={() => {
                     setCurrentPage(prev => Math.max(prev - 1, 1));
                     window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
               >
                  {t('news.prevPage')}
               </button>
               <div className="flex space-x-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                     let p = i + 1;
                     if (totalPages > 5) {
                        if (currentPage > 3) p = currentPage - 2 + i;
                        if (p > totalPages) p = totalPages - (4 - i);
                     }
                     if (p <= 0) p = i + 1;

                     return (
                        <button
                           key={p}
                           onClick={() => {
                              setCurrentPage(p);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                           }}
                           className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors text-sm font-bold ${currentPage === p
                              ? 'bg-ibc-brand text-white'
                              : 'border hover:bg-gray-50 text-gray-600'
                              }`}
                        >
                           {p}
                        </button>
                     );
                  })}
               </div>
               <button
                  onClick={() => {
                     setCurrentPage(prev => Math.min(prev + 1, totalPages));
                     window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
               >
                  {t('news.nextPage')}
               </button>
            </div>
         )}
      </div>
   );
};

// ============================================================
// 公司简介
// ============================================================
const ProfileSection: React.FC = () => (
   <div className="space-y-32">
      {/* Upper: Text & Vision */}
      <div className="grid lg:grid-cols-2 gap-20 items-center">
         <div className="space-y-10">
            <div className="space-y-4">
               <div className="w-12 h-1 bg-ibc-brand"></div>
               <h2 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                  专注密码技术应用<br />
                  <span className="text-ibc-brand">领航</span>民族安全产业
               </h2>
            </div>
            <div className="space-y-8 text-gray-500 leading-relaxed text-lg font-medium">
               {profileData.descriptions.map((p, i) => (
                  <p key={i} className="text-justify">{p}</p>
               ))}
            </div>
         </div>
         <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-ibc-brand/10 to-transparent rounded-[3rem] blur-2xl group-hover:bg-ibc-brand/20 transition-all duration-700"></div>
            <div className="relative bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-2xl space-y-12">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-ibc-brand flex items-center justify-center text-white shadow-lg shadow-ibc-brand/30">
                     <Award size={32} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-gray-900 leading-none">核心优势</h3>
                     <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest font-black">Core Advantages</p>
                  </div>
               </div>
               <div className="grid gap-10">
                  {profileData.advantages.map((item, i) => (
                     <div key={i} className="group/item flex gap-6">
                        <div className="text-3xl font-black text-ibc-brand/20 group-hover/item:text-ibc-brand transition-colors">
                           {String(i + 1).padStart(2, '0')}
                        </div>
                        <div>
                           <div className="font-black text-gray-900 mb-1 text-lg">{item.title}</div>
                           <div className="text-gray-400 text-sm leading-relaxed">{item.desc}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Stats Grid - Ultra Minimalist & Bold */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 border-y border-gray-100 py-20">
         {[...profileData.stats, ...(profileData.attributes || [])].slice(0, 8).map((item: any, i) => (
            <div key={i} className="text-center group">
               <div className="text-6xl font-black text-gray-900 mb-4 tracking-tighter group-hover:text-ibc-brand transition-all duration-500 tabular-nums">
                  {item.value}
               </div>
               <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{item.label}</div>
            </div>
         ))}
      </div>

      {/* Environment - Modern Gallery */}
      {profileData.environmentImages && (
         <div className="space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="space-y-4">
                  <span className="text-ibc-brand font-black tracking-widest text-xs uppercase">Office Space</span>
                  <h3 className="text-4xl font-black text-gray-900">公司环境</h3>
               </div>
               <p className="max-w-md text-gray-500 text-lg">
                  身处现代化、人性化的办公环境，
                  我们以创新为引擎，共同筑就信息安全的坚固堡垒。
               </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
               {profileData.environmentImages.slice(0, 7).map((img: string, i: number) => (
                  <div
                     key={i}
                     className={`group relative overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 
                      ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                      ${i === 5 ? 'md:col-span-2' : ''}`}
                  >
                     <img
                        src={img}
                        alt={`Env ${i}`}
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        loading="lazy"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
               ))}
            </div>
         </div>
      )}
   </div>
);

// ============================================================
// 发展历程
// ============================================================
const HistorySection: React.FC = () => {
   const [visibleItems, setVisibleItems] = React.useState<number[]>([]);

   React.useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  const index = Number(entry.target.getAttribute('data-index'));
                  setVisibleItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
               }
            });
         },
         { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      document.querySelectorAll('.history-item').forEach((el) => observer.observe(el));
      return () => observer.disconnect();
   }, []);

   return (
      <div className="relative py-12 overflow-hidden">
         {/* Background Decoration - simplified */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50"></div>

         <div className="relative max-w-6xl mx-auto px-4 md:px-0">
            {/* Vertical center line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100"></div>

            <div className="space-y-8">
               {historyData.map((m, i) => (
                  <div
                     key={i}
                     data-index={i}
                     className={`history-item relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'
                        } transition-all duration-1000 ease-out ${visibleItems.includes(i) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                        }`}
                  >
                     {/* Content Side */}
                     <div className={`w-full md:w-1/2 flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} pl-12 md:pl-0`}>
                        <div
                           className={`relative p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 w-full max-w-md group hover:-translate-y-1 hover:border-ibc-brand/20 ${visibleItems.includes(i) ? 'delay-200' : ''
                              }`}
                        >
                           {/* Year Tag inside card for mobile, outside for desktop visual flow */}
                           <div className="flex items-center justify-between mb-4">
                              <div className="text-ibc-brand font-black text-2xl tracking-tight">{m.year}</div>
                              <div className="h-px bg-gray-100 flex-1 ml-4"></div>
                           </div>
                           <p className="text-gray-600 text-base font-medium leading-relaxed text-justify">
                              {m.event}
                           </p>
                        </div>
                     </div>

                     {/* Center marker */}
                     <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full bg-white border-2 border-ibc-brand shadow-lg z-10 transition-all duration-500 ${visibleItems.includes(i) ? 'scale-125 bg-ibc-brand' : 'scale-75 opacity-50'
                           }`}></div>
                        <div className={`absolute w-8 h-8 bg-ibc-brand/10 rounded-full animate-ping ${visibleItems.includes(i) ? 'opacity-100' : 'opacity-0'
                           }`}></div>
                     </div>

                     {/* Empty Side for layout balance on desktop */}
                     <div className="hidden md:block md:w-1/2"></div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

// ============================================================
// 荣誉资质
// ============================================================
const HonorsSection: React.FC = () => {
   const categories = ['全部', '企业资质', '荣誉奖项'];
   const [activeCat, setActiveCat] = React.useState('全部');

   const filtered = activeCat === '全部'
      ? honorsData
      : honorsData.filter(h => h.category === activeCat);

   return (
      <div className="space-y-12">
         {/* Simple Filter */}
         <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all border ${activeCat === cat
                     ? 'bg-ibc-brand text-white border-ibc-brand shadow-lg scale-105'
                     : 'bg-white text-gray-500 border-gray-200 hover:border-ibc-brand/50 hover:text-ibc-brand'
                     }`}
               >
                  {cat}
               </button>
            ))}
         </div>

         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((h, i) => (
               <div key={i} className="group relative bg-white rounded-3xl p-6 border border-gray-100 hover:border-ibc-brand/30 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center">

                  {/* Image Container */}
                  <div className="w-full aspect-[4/3] mb-6 rounded-2xl overflow-hidden bg-gray-50 border border-gray-50 flex items-center justify-center p-4 group-hover:bg-white transition-colors">
                     {/* @ts-ignore - image property added dynamically */}
                     <img
                        src={h.image}
                        alt={h.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                     />
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black bg-gray-50 text-gray-400 mb-3 uppercase tracking-widest border border-gray-100 group-hover:bg-ibc-brand/5 group-hover:text-ibc-brand transition-colors">
                     {h.category}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2 min-h-[2.5em] group-hover:text-ibc-brand transition-colors">
                     {h.title}
                  </h3>
               </div>
            ))}
         </div>
      </div>
   );
};

// ============================================================
// 招贤纳士
// ============================================================
const CareersSection: React.FC = () => (
   <div className="space-y-32">
      <div className="max-w-4xl space-y-8">
         <div className="w-12 h-1 bg-ibc-brand"></div>
         <h2 className="text-6xl font-black text-gray-900 tracking-tighter leading-tight">
            加入奥联，<br />
            <span className="text-ibc-brand">共筑</span>密码安全未来。
         </h2>
         <p className="text-2xl text-gray-400 font-medium leading-relaxed">{careersData.intro}</p>
      </div>

      {/* 福利 - Ultra Clean */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
         {careersData.benefits.map((b, i) => {
            const icons = [<Tag key={1} />, <Award key={2} />, <Clock key={3} />, <Users key={4} />, <Users key={5} />, <Briefcase key={6} />];
            return (
               <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-ibc-brand/30 hover:shadow-2xl transition-all duration-500">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-ibc-brand group-hover:text-white transition-all duration-500 mb-8">
                     {React.cloneElement(icons[i % icons.length] as React.ReactElement, { size: 24 })}
                  </div>
                  <span className="text-xl font-black text-gray-900 tracking-tight">{b}</span>
               </div>
            );
         })}
      </div>

      {/* 在招职位 - Minimalist List */}
      <div className="space-y-16">
         <div className="flex items-end justify-between border-b border-gray-100 pb-10">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">加入我们</h3>
            <div className="text-ibc-brand font-black text-sm tracking-widest uppercase">Join Us</div>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            {/* 招聘平台 */}
            <div className="bg-white border border-gray-100 rounded-[3rem] p-12 hover:border-ibc-brand/30 hover:shadow-2xl transition-all duration-700 group space-y-8">
               <div className="w-16 h-16 rounded-2xl bg-ibc-brand/5 flex items-center justify-center text-ibc-brand mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase size={32} />
               </div>
               <h4 className="text-3xl font-black text-gray-900">招聘平台投递</h4>
               <p className="text-gray-500 text-lg leading-relaxed">
                  请访问以下招聘平台查看最新职位详情并投递简历。
               </p>
               <div className="flex gap-4">
                  <a href="https://www.liepin.com/company/8537555/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-50 hover:bg-ibc-brand hover:text-white transition-all py-4 rounded-xl font-bold text-center border border-gray-100">
                     猎聘网
                  </a>
                  <a href="https://jobs.51job.com/all/co2743950.html" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-50 hover:bg-ibc-brand hover:text-white transition-all py-4 rounded-xl font-bold text-center border border-gray-100">
                     前程无忧
                  </a>
               </div>
            </div>

            {/* 邮箱投递 */}
            <div className="bg-gray-900 text-white rounded-[3rem] p-12 relative overflow-hidden group space-y-8">
               <div className="absolute top-0 right-0 w-64 h-64 bg-ibc-brand/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                  <Mail size={32} />
               </div>
               <h4 className="text-3xl font-black">邮箱直接投递</h4>
               <p className="text-gray-400 text-lg leading-relaxed">
                  您也可以将简历直接发送至我们的招聘邮箱，邮件标题请注明“应聘职位+姓名”。
               </p>
               <a href={`mailto:${careersData.resumeEmail}`} className="block">
                  <div className="text-2xl font-black text-white border-b-2 border-ibc-brand pb-1 inline-block group-hover:text-ibc-brand transition-colors">
                     {careersData.resumeEmail}
                  </div>
               </a>
            </div>
         </div>
      </div>
   </div>
);

// ============================================================
// 联系我们
// ============================================================
const ContactSection: React.FC = () => {
   // Split branches into chunks for layout
   const branches = contactData.branches || [];

   return (
      <div className="space-y-32">
         {/* 头部标题区 */}
         <div className="max-w-4xl space-y-6">
            <div className="w-12 h-1 bg-ibc-brand"></div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tight">联系方式</h2>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">随时可以联系我们</p>
         </div>

         {/* 核心联系卡片 - 仿照原网布局 */}
         <div className="grid lg:grid-cols-3 gap-8">
            {/* 售后/技术咨询 */}
            <div className="group bg-gray-50 rounded-[2rem] p-10 hover:bg-white hover:shadow-xl transition-all duration-500 border border-gray-100">
               <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Phone size={32} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-6">售后/技术咨询</h3>
               <div className="space-y-4 text-gray-600 font-medium">
                  <p className="flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">Hotline</span>
                     <span className="text-lg text-gray-900">{contactData.hotline}</span>
                  </p>
                  <p className="flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">Email</span>
                     <span>{contactData.email_service}</span>
                  </p>
                  <p className="flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">QQ</span>
                     <span>{contactData.qq}</span>
                  </p>
               </div>
            </div>

            {/* 总部地址 */}
            <div className="group bg-gray-50 rounded-[2rem] p-10 hover:bg-white hover:shadow-xl transition-all duration-500 border border-gray-100 relative overflow-hidden">
               <div className="w-16 h-16 bg-ibc-brand/10 text-ibc-brand rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <MapPin size={32} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-6">总部地址</h3>
               <div className="space-y-4 text-gray-600 font-medium relative z-10">
                  <p className="leading-relaxed">
                     {contactData.address}
                  </p>
                  <p className="flex items-center gap-3 pt-4">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">Tel</span>
                     <span>{contactData.phone}</span>
                  </p>
               </div>
               {/* Decorative Background */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            </div>

            {/* 市场媒体 */}
            <div className="group bg-gray-50 rounded-[2rem] p-10 hover:bg-white hover:shadow-xl transition-all duration-500 border border-gray-100">
               <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <Mail size={32} />
               </div>
               <h3 className="text-2xl font-bold text-gray-900 mb-6">市场媒体</h3>
               <div className="space-y-4 text-gray-600 font-medium">
                  <p className="flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">Tel</span>
                     <span>18923725603</span>
                  </p>
                  <p className="flex items-center gap-3">
                     <span className="text-sm font-bold text-gray-400 uppercase tracking-wider w-16">Email</span>
                     <span>{contactData.email_market}</span>
                  </p>
               </div>
            </div>
         </div>

         {/* 全国分支机构 */}
         <div className="space-y-12">
            <div className="flex items-end justify-between border-b border-gray-100 pb-8">
               <h3 className="text-3xl font-black text-gray-900 tracking-tight">全国分支机构</h3>
               <div className="hidden md:block text-gray-400 font-bold text-sm tracking-widest uppercase">National Branches</div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {branches.map((branch, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-8 rounded-3xl hover:border-ibc-brand/30 hover:shadow-lg transition-all duration-300 group">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-ibc-brand group-hover:text-white transition-colors">
                           <MapPin size={18} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">{branch.name}</h4>
                     </div>
                     <p className="text-gray-500 leading-relaxed pl-14">
                        {branch.address}
                     </p>
                     {/* Decorative number */}
                     <div className="text-right mt-4">
                        <span className="text-[10px] font-black text-gray-200 group-hover:text-ibc-brand/10 transition-colors text-6xl leading-none -mb-4 block">
                           {String(i + 1).padStart(2, '0')}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};