import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ContactModal } from '../../components/ContactModal';
import { productsData, productCategories } from '../../data/products';
import {
   Check, Shield, Settings, Cpu, Layers, Database,
   Activity, ArrowRight, ChevronRight, Star, Zap, Lock
} from 'lucide-react';

const FEATURE_ICONS = [Settings, Shield, Cpu, Layers, Database, Activity, Zap, Lock, Star];

export const ProductDetail: React.FC = () => {
   const { id } = useParams();
   const { language } = useLanguage();
   const navigate = useNavigate();
   const [activeSection, setActiveSection] = useState('intro');
   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
   const observedRef = useRef<HTMLDivElement[]>([]);

   useEffect(() => {
      if (productCategories.some(c => c.id === id)) {
         navigate(`/ products ? category = ${id} `, { replace: true });
      }
   }, [id, navigate]);

   const [searchParams] = useSearchParams();
   const nameQuery = searchParams.get('name');
   const product = nameQuery
      ? productsData.find(p => p.name === nameQuery)
      : productsData.find(p => p.id === id);

   // Active nav tracking
   useEffect(() => {
      const handleScroll = () => {
         const sections = ['intro', 'features', 'value', 'usecases'];
         for (const sec of sections) {
            const el = document.getElementById(sec);
            if (el) {
               const rect = el.getBoundingClientRect();
               if (rect.top <= 120 && rect.bottom >= 120) {
                  setActiveSection(sec);
                  break;
               }
            }
         }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // Reveal-on-scroll
   useEffect(() => {
      const observer = new IntersectionObserver(
         (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
         { threshold: 0.1 }
      );
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
      return () => observer.disconnect();
   }, [product]);

   const scrollTo = (sectionId: string) => {
      const el = document.getElementById(sectionId);
      if (el) window.scrollTo({ top: el.offsetTop - 88, behavior: 'smooth' });
   };

   if (!product) {
      if (productCategories.some(c => c.id === id)) return null;
      return (
         <div className="min-h-screen bg-[#0b0c10] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-white">未找到相关产品</h2>
            <Link to="/products" className="text-ibc-brand hover:underline">返回产品中心</Link>
         </div>
      );
   }

   // Separate intro from feature list
   const introFeature = product.features.find(f => f.title === '产品介绍');
   const featureList = product.features.filter(f => f.title !== '产品介绍');
   const introText = introFeature?.desc || product.description;

   const navItems = [
      { id: 'intro', zh: '产品介绍', en: 'Overview' },
      ...(featureList.length > 0 ? [{ id: 'features', zh: '主要功能', en: 'Features' }] : []),
      ...(product.advantages && product.advantages.length > 0 ? [{ id: 'value', zh: '产品优势', en: 'Advantages' }] : []),
      ...(product.usecases_data && product.usecases_data.length > 0
         ? [{ id: 'usecases', zh: '应用场景', en: 'Use Cases' }]
         : []),
   ];

   return (
      <div className="font-sans min-h-screen overflow-x-hidden">
         {/* ══════════════════════════════════════
           HERO SECTION — Background Image Style
       ══════════════════════════════════════ */}
         <section className="relative min-h-[70vh] flex flex-col pt-28 pb-32 lg:pt-36 lg:pb-48 bg-[#0b0c10] overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/70 to-transparent z-10" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent z-10" />
               <img
                  src={product.image || '/upload/local_images/generic_product_hero.png'}
                  alt={product.name}
                  onError={(e) => {
                     (e.target as HTMLImageElement).src = '/upload/local_images/generic_product_hero.png';
                  }}
                  className="w-full h-full object-cover opacity-60 animate-ken-burns"
               />
               {/* Ambient Glow */}
               <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-full bg-ibc-brand/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
               {/* Breadcrumb - Overload on top of hero */}
               <nav className="flex items-center gap-2 text-sm text-gray-400 mb-12 font-medium">
                  <Link to="/" className="hover:text-white transition-colors">{language === 'en' ? 'Home' : '首页'}</Link>
                  <ChevronRight size={14} />
                  <Link to="/products" className="hover:text-white transition-colors">{language === 'en' ? 'Products' : '产品中心'}</Link>
                  <ChevronRight size={14} />
                  <span className="text-ibc-brand">{product.name}</span>
               </nav>

               <div className="max-w-4xl mt-auto lg:mt-0 lg:pt-20">
                  <div className="animate-fade-in-up">
                     {product.tag && (
                        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8">
                           <span className="w-2 h-2 rounded-full bg-ibc-brand animate-pulse" />
                           <span className="text-[11px] font-bold tracking-widest uppercase text-white/80">
                              {product.tag}
                           </span>
                        </div>
                     )}
                     <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight drop-shadow-2xl">
                        {product.name}
                     </h1>
                     <div className="h-1.5 w-20 bg-ibc-brand rounded-full mb-8 shadow-[0_0_12px_rgba(0,177,64,0.5)]" />
                     <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-12 drop-shadow-md">
                        {product.description}
                     </p>
                     <div className="flex flex-wrap gap-5">
                        <button
                           onClick={() => scrollTo('features')}
                           className="group flex items-center gap-3 bg-ibc-brand hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_24px_rgba(0,177,64,0.3)] hover:shadow-[0_0_40px_rgba(0,177,64,0.5)] hover:-translate-y-1"
                        >
                           {language === 'en' ? 'Explore Details' : '查看详情'}
                           <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                           onClick={() => setIsContactModalOpen(true)}
                           className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm shadow-xl"
                        >
                           {language === 'en' ? 'Contact Us' : '联系我们'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ══════════════════════════════════════
          STICKY NAV — glassmorphism
      ══════════════════════════════════════ */}
         <nav className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
               <ul className="flex items-center whitespace-nowrap gap-8 lg:gap-12">
                  {navItems.map(item => (
                     <li key={item.id}>
                        <button
                           onClick={() => scrollTo(item.id)}
                           className={`block py-5 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-all duration-300 ${activeSection === item.id
                              ? 'border-ibc-brand text-ibc-brand'
                              : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                              }`}
                        >
                           {language === 'en' ? item.en : item.zh}
                        </button>
                     </li>
                  ))}
               </ul>
            </div>
         </nav>

         {/* ══════════════════════════════════════
          产品介绍 — white section
      ══════════════════════════════════════ */}
         <section id="intro" className="bg-white py-24">
            <div className="max-w-5xl mx-auto px-6 reveal-on-scroll">
               <div className="text-center mb-12">
                  <span className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase">
                     {language === 'en' ? 'OVERVIEW' : '产品介绍'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-0">
                     {product.name}
                  </h2>
                  <div className="h-1 w-12 bg-ibc-brand rounded-full mx-auto mt-4" />
               </div>
               <p className="text-lg text-gray-600 leading-relaxed text-justify">
                  {introText}
               </p>
            </div>
         </section>

         {/* ══════════════════════════════════════
          主要功能 — dark section
      ══════════════════════════════════════ */}
         {featureList.length > 0 && (
            <section id="features" className="bg-[#0b0c10] py-24">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-16 reveal-on-scroll">
                     <span className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase">
                        {language === 'en' ? 'CORE CAPABILITIES' : '主要功能'}
                     </span>
                     <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
                        {language === 'en' ? 'What This Product Does' : '核心功能一览'}
                     </h2>
                     <div className="h-1 w-12 bg-ibc-brand rounded-full mx-auto mt-4" />
                  </div>

                  <div className={`grid gap-8 lg:gap-10 ${featureList.length <= 2 ? 'md:grid-cols-2' :
                     featureList.length === 3 ? 'md:grid-cols-3' :
                        featureList.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
                           'md:grid-cols-2 lg:grid-cols-3'
                     }`}>
                     {featureList.map((f, i) => {
                        const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                        return (
                           <div
                              key={i}
                              className="reveal-on-scroll group bg-[#13161c] border border-white/6 rounded-2xl p-8 hover:border-ibc-brand/40 hover:bg-[#171b22] hover:shadow-[0_20px_60px_rgba(0,177,64,0.10)] transition-all duration-300"
                              style={{ transitionDelay: `${i * 80} ms` }}
                           >
                              <div className="w-14 h-14 rounded-xl bg-ibc-brand/10 border border-ibc-brand/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-ibc-brand/15 transition-all duration-300">
                                 <Icon size={28} strokeWidth={1.5} className="text-ibc-brand" />
                              </div>
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-ibc-brand transition-colors">{f.title}</h3>
                              <p className="text-gray-400 leading-relaxed text-[15px]">{f.desc}</p>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </section>
         )}

         {/* ══════════════════════════════════════
          产品价值 — white section
      ══════════════════════════════════════ */}
         {product.advantages && product.advantages.length > 0 && (
            <section id="value" className="bg-white py-24">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-16 reveal-on-scroll">
                     <span className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase">
                        {language === 'en' ? 'ADVANTAGES' : '产品优势'}
                     </span>
                     <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                        {language === 'en' ? 'Why Choose This Product' : '为什么选择我们'}
                     </h2>
                     <div className="h-1 w-12 bg-ibc-brand rounded-full mx-auto mt-4" />
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {product.advantages.map((adv, i) => {
                        return (
                           <div
                              key={i}
                              className="reveal-on-scroll group bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:border-ibc-brand/30 hover:shadow-xl hover:shadow-ibc-brand/8 hover:-translate-y-1 transition-all duration-300"
                              style={{ transitionDelay: `${i * 80} ms` }}
                           >
                              <div className="flex items-start gap-4">
                                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ibc-brand/10 border border-ibc-brand/20 flex items-center justify-center mt-0.5 group-hover:bg-ibc-brand group-hover:border-ibc-brand transition-all duration-300">
                                    <Check size={18} className="text-ibc-brand stroke-[2.5px] group-hover:text-white transition-colors duration-300" />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-ibc-brand transition-colors">{adv.title}</h3>
                                    <p className="text-gray-500 leading-relaxed text-[15px]">{adv.desc}</p>
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </section>
         )}

         {/* ══════════════════════════════════════
          应用场景 — dark section
      ══════════════════════════════════════ */}
         {product.usecases_data && product.usecases_data.length > 0 && (
            <section id="usecases" className="bg-[#0b0c10] py-24">
               <div className="max-w-7xl mx-auto px-6 text-center reveal-on-scroll">
                  <span className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase">
                     {language === 'en' ? 'USE CASES' : '应用场景'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-16">
                     {language === 'en' ? "Where It's Used" : '广泛适用场景'}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                     {product.usecases_data.map((u, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-ibc-brand/50 transition-colors duration-300">
                           <h3 className="text-xl font-bold text-white mb-3">{u.title}</h3>
                           <p className="text-gray-400 leading-relaxed text-sm">
                              {u.desc}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>
         )}

         {/* ══════════════════════════════════════
          CTA — white with green accent
      ══════════════════════════════════════ */}
         <section className="bg-white py-20 border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-6 text-center reveal-on-scroll">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {language === 'en' ? 'Ready to Get Started?' : '了解更多，欢迎联系我们'}
               </h2>
               <p className="text-gray-500 mb-8 text-lg">
                  {language === 'en' ? 'Our experts will tailor a solution for your needs.' : '我们的技术团队将为您提供专业的定制化方案。'}
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                     to="/contact"
                     className="inline-flex items-center justify-center gap-2 bg-ibc-brand hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold text-base transition-all duration-300 shadow-[0_0_24px_rgba(0,177,64,0.25)] hover:shadow-[0_0_36px_rgba(0,177,64,0.4)] hover:-translate-y-0.5"
                  >
                     {language === 'en' ? 'Contact Sales' : '商务咨询'} <ArrowRight size={18} />
                  </Link>
                  <Link
                     to="/products"
                     className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-10 py-4 rounded-full font-bold text-base transition-all duration-300"
                  >
                     {language === 'en' ? 'Back to Products' : '返回产品中心'}
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};