import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, CheckCircle, FileText, Server } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || id;
  const { language } = useLanguage();

  // In a real app, fetch data based on ID. 
  // Here we use static mock data generated based on the ID/Name to simulate unique content.
  
  return (
    <div className="bg-white">
      <PageHero 
        title={name || "Product Detail"} 
        subtitle={language === 'zh' ? "基于国密算法的高性能安全基础设施，为您提供合规、高效的密码服务。" : "High-performance security infrastructure based on national crypto algorithms."}
        image="https://images.unsplash.com/photo-1558494949-ef2bb6ffaebd?q=80&w=2070&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
               <h2 className="text-3xl font-bold mb-6 text-gray-900">{language === 'zh' ? "产品概述" : "Product Overview"}</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                 {name} {language === 'zh' 
                   ? "是奥联自主研发的新一代高性能密码设备。支持 SM2/SM3/SM4 等国密算法，同时兼容国际主流算法。该产品广泛应用于金融、政务、能源等关键领域，满足等级保护三级及以上安全要求。" 
                   : "is OLYM's self-developed new generation high-performance crypto device. Supporting SM2/SM3/SM4 algorithms and compatible with international standards."}
               </p>
               
               <h3 className="text-2xl font-bold mb-4 text-gray-900">{language === 'zh' ? "核心功能" : "Key Features"}</h3>
               <div className="grid sm:grid-cols-2 gap-4 mb-12">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-start p-4 bg-gray-50 rounded-lg">
                       <CheckCircle className="text-ibc-brand mt-1 mr-3 flex-shrink-0" size={20} />
                       <div>
                          <div className="font-bold text-gray-900 mb-1">{language === 'zh' ? `功能特性 ${i}` : `Feature ${i}`}</div>
                          <div className="text-sm text-gray-500">{language === 'zh' ? "提供高吞吐量的数据加密与完整性保护。" : "High throughput data encryption."}</div>
                       </div>
                    </div>
                  ))}
               </div>

               <h3 className="text-2xl font-bold mb-4 text-gray-900">{language === 'zh' ? "应用场景" : "Use Cases"}</h3>
               <p className="text-gray-600 mb-6">
                 {language === 'zh' ? "适用于电子政务外网、金融支付系统、物联网设备认证等场景。" : "Ideal for E-gov networks, financial payment systems, and IoT auth."}
               </p>
            </div>

            <div className="md:col-span-1">
               <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 sticky top-24">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Server className="mr-2 text-ibc-brand" /> {language === 'zh' ? "技术规格" : "Specs"}
                  </h3>
                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{language === 'zh' ? "算法支持" : "Algorithms"}</span>
                        <span className="font-medium text-right">SM2, SM3, SM4, RSA</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{language === 'zh' ? "吞吐量" : "Throughput"}</span>
                        <span className="font-medium text-right">10 Gbps</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{language === 'zh' ? "接口" : "Interfaces"}</span>
                        <span className="font-medium text-right">4x 10GE SFP+</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">{language === 'zh' ? "认证" : "Certification"}</span>
                        <span className="font-medium text-right text-ibc-brand">国密二级/三级</span>
                     </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-gray-200">
                     <button className="w-full bg-ibc-brand text-white py-3 rounded-md font-bold hover:bg-green-600 transition-colors mb-4">
                       {language === 'zh' ? "商务咨询" : "Contact Sales"}
                     </button>
                     <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors flex items-center justify-center">
                       <FileText size={18} className="mr-2" /> {language === 'zh' ? "下载白皮书" : "Whitepaper"}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};