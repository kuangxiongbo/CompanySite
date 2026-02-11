import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { FileText, Target, Users, BarChart } from 'lucide-react';

export const SolutionDetail: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || "Solution Detail";
  const { language } = useLanguage();

  return (
    <div className="bg-white">
      <PageHero 
        title={name} 
        subtitle={language === 'zh' ? "深入业务场景，提供端到端的安全解决方案。" : "End-to-end security solutions tailored for your business."}
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div>
               <h2 className="text-3xl font-bold mb-6 text-gray-900">{language === 'zh' ? "方案背景" : "Background"}</h2>
               <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                 {language === 'zh' 
                   ? `针对 ${name} 领域的特定安全需求，奥联提供了完整的解决方案。随着数字化转型的深入，传统的安全边界正在消失，身份成为新的防线。` 
                   : `Addressing the specific security needs of ${name}, OLYM provides a comprehensive solution.`}
               </p>
               <p className="text-lg text-gray-600 leading-relaxed">
                 {language === 'zh'
                   ? "本方案基于 IBC 标识密码技术，解决了传统 PKI 体系在海量设备和复杂网络环境下的证书管理难题。"
                   : "Based on IBC technology, this solution solves the certificate management challenges of traditional PKI."}
               </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
               <h3 className="text-xl font-bold mb-6">{language === 'zh' ? "主要痛点" : "Key Challenges"}</h3>
               <ul className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <li key={i} className="flex items-start">
                       <div className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">{i}</div>
                       <span className="text-gray-700 mt-1">{language === 'zh' ? "传统证书管理成本高，维护困难" : "High cost of traditional certificate management"}</span>
                    </li>
                  ))}
               </ul>
            </div>
         </div>

         <div className="mb-24">
            <h2 className="text-3xl font-bold mb-10 text-center">{language === 'zh' ? "方案架构" : "Architecture"}</h2>
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
               <span className="text-gray-400 font-medium">{language === 'zh' ? "架构图示意区域" : "Architecture Diagram Placeholder"}</span>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-gray-100 rounded-xl hover:shadow-lg transition-all">
               <Target size={40} className="text-ibc-brand mx-auto mb-4" />
               <h3 className="font-bold text-xl mb-3">{language === 'zh' ? "精准防护" : "Precision Protection"}</h3>
               <p className="text-gray-500">{language === 'zh' ? "细粒度的访问控制策略" : "Granular access control policies"}</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-xl hover:shadow-lg transition-all">
               <Users size={40} className="text-ibc-brand mx-auto mb-4" />
               <h3 className="font-bold text-xl mb-3">{language === 'zh' ? "用户体验" : "User Experience"}</h3>
               <p className="text-gray-500">{language === 'zh' ? "无感知的安全认证" : "Seamless security authentication"}</p>
            </div>
            <div className="p-8 border border-gray-100 rounded-xl hover:shadow-lg transition-all">
               <BarChart size={40} className="text-ibc-brand mx-auto mb-4" />
               <h3 className="font-bold text-xl mb-3">{language === 'zh' ? "可视运营" : "Visual Operations"}</h3>
               <p className="text-gray-500">{language === 'zh' ? "全链路的数据监控大屏" : "Full-link data monitoring dashboard"}</p>
            </div>
         </div>
      </div>
    </div>
  );
};