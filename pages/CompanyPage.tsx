import React from 'react';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Users, Globe } from 'lucide-react';

export const CompanyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-white">
      <PageHero 
        title={language === 'zh' ? "关于 OLYM" : "About OLYM"} 
        subtitle={language === 'zh' ? "我们的使命是保护数字时代的生活方式。我们致力于通过预防网络攻击，让每一天都更安全。" : "Our mission is to protect our way of life in the digital age by preventing successful cyberattacks."}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
            <div className="w-full md:w-1/2">
               <h2 className="text-3xl font-bold mb-6 text-gray-900">{language === 'zh' ? "愿景与使命" : "Vision & Mission"}</h2>
               <p className="text-gray-600 text-lg leading-relaxed mb-6">
                 {language === 'zh' 
                   ? "作为全球网络安全的领导者，OLYM 始终走在创新的前沿。我们将 AI、分析和自动化深度整合到我们的平台中，以应对世界上最困难的安全挑战。"
                   : "As a global cybersecurity leader, OLYM is always at the forefront of innovation. We deeply integrate AI, analytics, and automation into our platforms to solve the world's most difficult security challenges."}
               </p>
               <p className="text-gray-600 text-lg leading-relaxed">
                 {language === 'zh' 
                   ? "我们不仅提供技术，更提供信任。从财富 100 强企业到政府机构，各种规模的组织都信赖 OLYM 来保护他们最宝贵的资产。"
                   : "We provide not just technology, but trust. Organizations of all sizes, from Fortune 100 companies to government agencies, rely on OLYM to protect their most valuable assets."}
               </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
               <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <Target size={40} className="text-ibc-brand mx-auto mb-3" />
                  <div className="font-bold text-3xl mb-1">#1</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "市场领导者" : "Market Leader"}</div>
               </div>
               <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <Users size={40} className="text-ibc-brand mx-auto mb-3" />
                  <div className="font-bold text-3xl mb-1">85k+</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "企业客户" : "Customers"}</div>
               </div>
               <div className="bg-gray-50 p-6 rounded-xl text-center col-span-2">
                  <Globe size={40} className="text-ibc-brand mx-auto mb-3" />
                  <div className="font-bold text-3xl mb-1">150+</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "服务的国家/地区" : "Countries Served"}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};