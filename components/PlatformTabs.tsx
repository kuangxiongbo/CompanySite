import React, { useState } from 'react';
import { ArrowRight, Shield, Cloud, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const PlatformTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useLanguage();

  const tabs = [
    {
      id: 'strata',
      icon: Shield,
      ...t('tabs.strata'),
      image: "https://images.unsplash.com/photo-1558494949-ef2bb6ffaebd?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 'prisma',
      icon: Cloud,
      ...t('tabs.prisma'),
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    },
    {
      id: 'cortex',
      icon: Activity,
      ...t('tabs.cortex'),
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    }
  ];

  return (
    <section className="bg-[#121212] py-24 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center">
           <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('tabs.heading')}</h2>
           <p className="text-xl text-gray-400 max-w-3xl mx-auto">
             {t('tabs.subheading')}
           </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Tabs Navigation */}
          <div className="w-full lg:w-1/3 flex flex-col space-y-4">
            {tabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`group text-left p-6 rounded-xl transition-all duration-300 border ${
                    isActive 
                      ? 'bg-white/10 border-ibc-brand shadow-lg' 
                      : 'bg-transparent border-gray-800 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${isActive ? 'bg-ibc-brand text-white' : 'bg-gray-800 text-gray-400 group-hover:text-white'}`}>
                      <tab.icon size={24} />
                    </div>
                    <div>
                      <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-ibc-brand' : 'text-gray-500'}`}>
                        {tab.product}
                      </span>
                      <span className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {tab.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="w-full lg:w-2/3 relative h-full min-h-[500px] bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
             {tabs.map((tab, index) => (
               <div 
                 key={tab.id}
                 className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                   activeTab === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                 }`}
               >
                 <div className="relative h-full flex flex-col">
                    <div className="h-64 overflow-hidden">
                       <img src={tab.image} alt={tab.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    </div>
                    <div className="p-10 flex-1 flex flex-col justify-center">
                       <h3 className="text-3xl font-bold text-white mb-4">{tab.title}</h3>
                       <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                         {tab.desc}
                       </p>
                       <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                          {/* Defensive optional chaining added here */}
                          {tab.features?.map((feature: string, i: number) => (
                             <li key={i} className="flex items-center text-sm font-medium text-gray-300 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-ibc-brand mr-2"></span>
                                {feature}
                             </li>
                          ))}
                       </ul>
                       <div>
                         <a href="#" className="inline-flex items-center text-ibc-brand font-bold hover:text-white transition-colors">
                           {tab.link} <ArrowRight className="ml-2 w-5 h-5" />
                         </a>
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};