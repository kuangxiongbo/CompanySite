import React from 'react';
import { PageHero } from '../components/PageHero';
import { LogoTicker } from '../components/LogoTicker';
import { useLanguage } from '../contexts/LanguageContext';

export const PartnersPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-white">
      <PageHero 
        title={language === 'zh' ? "合作伙伴生态系统" : "Partner Ecosystem"} 
        subtitle={language === 'zh' ? "我们与世界领先的技术公司合作，为您提供集成的安全解决方案。" : "We collaborate with the world's leading technology companies to provide integrated security solutions."}
        image="/upload/local_images/aHR0cHM6Ly9pbWF.jpg"
      />
      
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
           <h2 className="text-3xl font-bold mb-6">{language === 'zh' ? "我们的战略合作伙伴" : "Our Strategic Partners"}</h2>
           <p className="text-gray-500 max-w-2xl mx-auto">
             {language === 'zh' 
               ? "通过与云服务提供商、系统集成商和托管安全服务提供商的深度合作，我们共同构建了一个更安全的数字世界。"
               : "Through deep collaboration with cloud providers, system integrators, and MSSPs, we are building a safer digital world together."}
           </p>
        </div>
        <LogoTicker />
      </div>

      <div className="bg-gray-900 text-white py-24">
         <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">{language === 'zh' ? "成为 OLYM 合作伙伴" : "Become an OLYM Partner"}</h2>
            <p className="text-xl text-gray-300 mb-10">
               {language === 'zh' ? "加入我们的 NextWave 合作伙伴计划，获得行业领先的技术、培训和市场支持。" : "Join our NextWave Partner Program to access industry-leading technology, training, and marketing support."}
            </p>
            <button className="bg-ibc-brand text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-green-600 transition-all">
               {language === 'zh' ? "立即申请" : "Apply Now"}
            </button>
         </div>
      </div>
    </div>
  );
};