import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';


export const FeatureGrid: React.FC = () => {
  const { t } = useLanguage();
  const categories = t('products.categories');

  // Helper to map keys to images
  const getCategoryDetails = (key: string) => {
    const images: Record<string, string> = {
      cryptography: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg",
      management: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg",
      authTrans: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg",
      data: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg",
      iot: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg",
      postQuantum: "/upload/local_images/aHR0cHM6Ly9pbWF.jpg"
    };

    return { image: images[key] || images.cryptography };
  };

  const categoryKeys = ['cryptography', 'management', 'authTrans', 'data', 'iot', 'postQuantum'];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">{t('products.heroTitle')}</h2>
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              {t('products.heroSubtitle')}
            </p>
          </div>
          <a href="#/products" className="hidden md:flex items-center font-bold text-ibc-brand hover:text-green-700 transition-colors mt-6 md:mt-0">
            查看全系产品 <ArrowRight className="ml-2" size={20} />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryKeys.map((key) => {
            const data = categories[key];
            const details = getCategoryDetails(key);

            return (
              <div key={key} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                  <img
                    src={details.image}
                    alt={data.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {key === 'postQuantum' ? 'Future' : 'Core'}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ibc-brand transition-colors">{data.title}</h3>
                  <p className="text-gray-500 mb-6 text-sm leading-relaxed min-h-[40px]">
                    {data.desc}
                  </p>

                  {/* Mini List of Top Items */}
                  <ul className="mb-8 space-y-2">
                    {data.items.slice(0, 3).map((item: string, i: number) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 group-hover:bg-ibc-brand transition-colors"></span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center font-bold text-gray-900 group-hover:text-ibc-brand transition-colors text-sm">
                    了解更多 <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={16} />
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