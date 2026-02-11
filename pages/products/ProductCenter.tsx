import React, { useEffect } from 'react';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { Server, Shield, Smartphone, Database, Check, ArrowRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProductCenter: React.FC = () => {
  const { t } = useLanguage();
  const categories: any = t('products.categories');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categoryConfig: Record<string, any> = {
    cryptography: { icon: Server, color: "text-blue-500", bg: "bg-blue-50" },
    identity: { icon: Shield, color: "text-ibc-brand", bg: "bg-green-50" },
    iot: { icon: Smartphone, color: "text-purple-500", bg: "bg-purple-50" },
    data: { icon: Database, color: "text-orange-500", bg: "bg-orange-50" },
    postQuantum: { icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50" }
  };

  return (
    <div className="bg-white">
      <PageHero 
        title={t('products.heroTitle')} 
        subtitle={t('products.heroSubtitle')}
        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {Object.entries(categories).map(([key, cat]: [string, any], index) => {
          const config = categoryConfig[key] || categoryConfig.cryptography;
          const isEven = index % 2 === 0;

          return (
            <div key={key} id={key} className={`flex flex-col lg:flex-row gap-16 items-center reveal-on-scroll ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className={`inline-flex p-3 rounded-lg mb-6 ${config.bg} ${config.color}`}>
                   <config.icon size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{cat.title}</h2>
                <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                  {cat.desc}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {cat.items.map((item: string, i: number) => (
                    <Link to={`/products/${key}-detail`} key={i} className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gray-50 group cursor-pointer">
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${config.bg} ${config.color}`}>
                          <Check size={14} strokeWidth={3} />
                       </div>
                       <span className="font-semibold text-gray-700 group-hover:text-ibc-brand transition-colors">{item}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-8">
                   <button className="text-ibc-brand font-bold flex items-center hover:underline">
                      查看详情 <ArrowRight size={18} className="ml-1" />
                   </button>
                </div>
              </div>
              <div className="lg:w-1/2">
                 <div className="relative">
                    <div className={`absolute -inset-4 rounded-3xl blur-2xl opacity-30 ${config.bg}`}></div>
                    <img 
                      src={`https://picsum.photos/seed/${key}/800/600`} 
                      alt={cat.title}
                      className="relative z-10 rounded-2xl shadow-2xl border border-gray-100 hover:scale-[1.01] transition-transform duration-500"
                    />
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};