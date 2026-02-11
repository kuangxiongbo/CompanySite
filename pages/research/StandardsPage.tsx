import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, BookOpen, Shield, Map, Bookmark, ChevronRight } from 'lucide-react';
import { PageHero } from '../../components/PageHero';

export const StandardsPage: React.FC = () => {
  const { t } = useLanguage();
  const standardsData: any = t('standards');
  const [activeSection, setActiveSection] = useState<string>('international');
  
  // Extract data sections
  const sections = [
    { id: 'international', title: standardsData.international.title, data: standardsData.international.list, icon: Globe },
    { id: 'national', title: standardsData.national.title, data: standardsData.national.list, icon: Map },
    { id: 'industry', title: standardsData.industry.title, data: standardsData.industry.list, icon: Shield },
    { id: 'research', title: standardsData.researchTopics.title, data: standardsData.researchTopics.list, icon: BookOpen },
  ];

  // Intersection Observer for highlighting sidebar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            // Add visibility class for animation
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px -50% 0px" }
    );

    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120, // Offset for sticky header
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHero 
        title={standardsData.heroTitle}
        subtitle={standardsData.heroSubtitle}
        image="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* Sticky Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block w-1/4 relative">
             <div className="sticky top-32 space-y-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">目录 / Contents</div>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-all duration-300 group ${
                      activeSection === section.id 
                        ? 'bg-ibc-brand text-white shadow-md' 
                        : 'text-gray-600 hover:bg-white hover:text-ibc-brand hover:shadow-sm'
                    }`}
                  >
                    <span className="font-bold flex items-center">
                       <section.icon size={18} className={`mr-3 ${activeSection === section.id ? 'text-white' : 'text-gray-400 group-hover:text-ibc-brand'}`} />
                       {section.title}
                    </span>
                    {activeSection === section.id && <ChevronRight size={16} />}
                  </button>
                ))}
             </div>
          </div>

          {/* Mobile Navigation (Horizontal Scroll) */}
          <div className="lg:hidden sticky top-[72px] z-20 bg-gray-50/95 backdrop-blur-md border-b border-gray-200 py-4 -mx-6 px-6 overflow-x-auto">
             <div className="flex space-x-4 min-w-max">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                      activeSection === section.id 
                        ? 'bg-ibc-brand text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-24 pb-24">
             {sections.map((section, idx) => (
               <section 
                 key={section.id} 
                 id={section.id} 
                 className="scroll-mt-32 reveal-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out"
               >
                 {/* Section Header with Large Icon */}
                 <div className="flex items-center gap-6 mb-10 pb-6 border-b border-gray-200">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center text-ibc-brand flex-shrink-0">
                       <section.icon size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                       <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
                       <p className="text-gray-500 text-sm">
                         {section.data.length} {standardsData.items || "项标准/成果"}
                       </p>
                    </div>
                 </div>

                 {/* List Items */}
                 <div className="space-y-6">
                    {section.data.map((item: any, i: number) => (
                      <div 
                        key={i} 
                        className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-ibc-brand/30 transition-all duration-300 relative overflow-hidden"
                      >
                         {/* Decorative Hover Bar */}
                         <div className="absolute top-0 left-0 w-1 h-full bg-ibc-brand opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         
                         <div className="flex gap-4">
                            <div className="mt-1 flex-shrink-0 text-gray-300 group-hover:text-ibc-brand transition-colors">
                               <Bookmark size={20} />
                            </div>
                            <div className="flex-1">
                               <h3 className="text-lg font-bold text-gray-800 group-hover:text-ibc-brand transition-colors leading-snug">
                                 {item.title}
                               </h3>
                               {item.desc && (
                                 <p className="text-gray-500 mt-3 text-sm leading-relaxed pl-4 border-l-2 border-gray-100 group-hover:border-ibc-brand/20 transition-colors">
                                   {item.desc}
                                 </p>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </section>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};