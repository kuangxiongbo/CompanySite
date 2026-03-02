import React, { useEffect } from 'react';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { Cpu, Lock, Network, Database, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { frontierTopics } from '../../data/research';

export const ResearchCenter: React.FC = () => {
   const { language } = useLanguage();

   const icons = [Lock, Zap, Database, ShieldCheck];

   return (
      <div className="bg-white">
         <PageHero
            title={language === 'zh' ? "技术研究" : "Technical Research"}
            subtitle={language === 'zh' ? "探索密码技术前沿 · 构建未来安全基石" : "Exploring Frontier Cryptography · Building Future Security"}
            image="/upload/local_images/aHR0cHM6Ly9pbWF.jpg"
         />

         <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {frontierTopics.map((topic, idx) => {
                  // Cycle through generic icons if specific ones aren't mapped
                  const Icon = icons[idx % icons.length];

                  return (
                     <Link
                        to={`/research/${topic.id}`}
                        key={topic.id}
                        className="group bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-xl hover:border-transparent transition-all duration-300 flex flex-col h-full"
                     >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${topic.bg} ${topic.color}`}>
                           <Icon size={28} />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-ibc-brand transition-colors">
                           {topic.title}
                        </h3>

                        <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                           {topic.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                           {topic.highlights.map((tag, i) => (
                              <span key={i} className="text-xs font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded">
                                 #{tag}
                              </span>
                           ))}
                        </div>

                        <div className="flex items-center text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                           {language === 'zh' ? "了解更多" : "Learn More"} <ArrowRight size={16} className="ml-2 text-ibc-brand" />
                        </div>
                     </Link>
                  );
               })}
            </div>

            {/* Additional Section regarding Standards participation if needed */}
            <div className="mt-32 bg-gray-50 rounded-3xl p-12 lg:p-16 border border-gray-100">
               <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">
                     {language === 'zh' ? "参与标准制定" : "Standardization"}
                  </h2>
                  <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                     {language === 'zh'
                        ? "奥联积极参与国家标准和行业标准的制定工作，作为主要起草单位参与了多项国密标准（GM/T）的编制，推动中国商用密码技术的标准化与国际化进程。"
                        : "OlympTech actively participates in the formulation of national and industry standards, drafting multiple GM/T standards to promote the standardization and internationalization of Chinese commercial cryptography."}
                  </p>
                  <div className="flex justify-center gap-6">
                     <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-800">
                        GM/T 0044
                     </div>
                     <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-800">
                        GM/T 0005
                     </div>
                     <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-800">
                        IEEE 1609.2
                     </div>
                  </div>

                  <div className="mt-12">
                     <Link to="/research/standards" className="text-ibc-brand font-bold hover:underline inline-flex items-center">
                        {language === 'zh' ? "查看所有参编标准" : "View All Standards"} <ArrowRight size={16} className="ml-1" />
                     </Link>
                  </div>
               </div>
            </div>

            <div className="mt-24 text-center">
               <h2 className="text-2xl font-bold mb-4">
                  {language === 'zh' ? "科研合作" : "Research Collaboration"}
               </h2>
               <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                  {language === 'zh'
                     ? "我们与高校、科研机构保持紧密合作。如果您对隐私计算、抗量子密码等领域感兴趣，欢迎联系奥联研究院。"
                     : "We collaborate closely with universities and research institutions. Contact us if you are interested in privacy computing, PQC, etc."}
               </p>
               <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors">
                  {language === 'zh' ? "联系研究院" : "Contact Institute"}
               </button>
            </div>
         </div>
      </div>
   );
};