import React from 'react';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Target, Flag, Users, MapPin, Mail, Phone, Award, Globe } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white">
      <PageHero 
        title={t('about.heroTitle')} 
        subtitle={t('about.heroSubtitle')}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      />
      
      {/* Introduction */}
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
               <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('about.mission')}</h2>
               <p className="text-lg text-gray-600 leading-relaxed mb-6">
                 {t('about.missionDesc')}
               </p>
               <p className="text-gray-600 leading-relaxed">
                 {language === 'zh' 
                   ? "奥联作为国家密码管理局批准的商用密码产品定点生产与销售单位，始终坚持自主创新。我们拥有 SM2、SM9 等多项国密算法的核心知识产权，参与了多项国家及行业标准的制定。"
                   : "As a designated producer and seller of commercial cipher products approved by the State Cryptography Administration, OLYM adheres to independent innovation. We hold core IP for SM2 and SM9 algorithms."}
               </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
               <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                  <Flag size={36} className="text-ibc-brand mx-auto mb-4" />
                  <div className="font-bold text-2xl mb-1">SM9</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "原研单位" : "Standard Originator"}</div>
               </div>
               <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                  <Award size={36} className="text-ibc-brand mx-auto mb-4" />
                  <div className="font-bold text-2xl mb-1">50+</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "发明专利" : "Patents"}</div>
               </div>
               <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100 col-span-2">
                  <Users size={36} className="text-ibc-brand mx-auto mb-4" />
                  <div className="font-bold text-2xl mb-1">Top 10</div>
                  <div className="text-sm text-gray-500">{language === 'zh' ? "商密创新企业" : "Innovation Enterprise"}</div>
               </div>
            </div>
         </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-24">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">{t('about.contact')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="bg-gray-800 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors">
                  <MapPin size={32} className="text-ibc-brand mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-4">{t('about.address')}</h3>
                  <p className="text-gray-400 text-sm">
                     {language === 'zh' ? "深圳市南山区科技园..." : "Nanshan Science Park, Shenzhen..."}
                  </p>
               </div>
               <div className="bg-gray-800 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors">
                  <Mail size={32} className="text-ibc-brand mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-4">{t('about.email')}</h3>
                  <p className="text-gray-400 text-sm">support@olym.com</p>
                  <p className="text-gray-400 text-sm">sales@olym.com</p>
               </div>
               <div className="bg-gray-800 p-8 rounded-xl text-center hover:bg-gray-700 transition-colors">
                  <Phone size={32} className="text-ibc-brand mx-auto mb-6" />
                  <h3 className="font-bold text-xl mb-4">{t('about.phone')}</h3>
                  <p className="text-gray-400 text-sm">+86 755 8888 8888</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};