
import React from 'react';
import { PageHero } from '../components/PageHero';
import { serviceContentData } from '../data/services';
import { Download, HelpCircle, MessageSquare, GraduationCap, Code, Phone, Headphones, Shield, Cpu, Activity, AlertTriangle, FileText, Database, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ServicesPage: React.FC = () => {
  const { overview, basicServices, valueAddedServices } = serviceContentData;

  return (
    <div className="bg-white">
      <PageHero
        title={overview.title}
        subtitle="专业服务，全心为您"
        image="/upload/about/profile/banner.png"
      />

      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
        {/* Overview Section */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <p className="text-2xl text-gray-500 font-medium leading-relaxed">
            {overview.description}
          </p>
          <div className="flex justify-center gap-8 text-ibc-brand font-bold text-lg">
            <div className="flex items-center gap-2 px-6 py-3 bg-ibc-brand/5 rounded-full">
              <Headphones /> 5×9小时日常服务
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-ibc-brand/5 rounded-full">
              <Activity /> 7×24小时特定保障
            </div>
          </div>
        </div>

        {/* Basic Services Section */}
        <div className="space-y-16">
          <div className="flex items-center gap-6">
            <div className="w-12 h-1 bg-ibc-brand"></div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{basicServices.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {basicServices.items.map((item, index) => (
              <div key={index} className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-ibc-brand/30 hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-ibc-brand mb-8 group-hover:bg-ibc-brand group-hover:text-white transition-all">
                  {index === 0 && <Cpu size={32} />}
                  {index === 1 && <MessageSquare size={32} />}
                  {index === 2 && <AlertTriangle size={32} />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Value-added Services Section */}
        <div className="space-y-16">
          <div className="flex items-center gap-6">
            <div className="w-12 h-1 bg-ibc-brand"></div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{valueAddedServices.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueAddedServices.items.map((item: any, index: number) => (
              <div key={index} className="group p-10 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-gray-400 group-hover:text-ibc-brand shadow-sm group-hover:shadow-md transition-all duration-500">
                    {index === 0 && <Activity size={24} />}
                    {index === 1 && <Shield size={24} />}
                    {index === 2 && <AlertTriangle size={24} />}
                    {index === 3 && <FileText size={24} />}
                    {index === 4 && <Database size={24} />}
                    {index === 5 && <Layers size={24} />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{item.title}</h3>
                </div>
                <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                  {item.description}
                </p>
                {item.subItems && (
                  <div className="mt-auto pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                    {item.subItems.map((sub: string, subIndex: number) => (
                      <span
                        key={subIndex}
                        className="px-4 py-1.5 bg-white text-gray-600 text-sm font-bold rounded-lg border border-gray-100 group-hover:border-ibc-brand/20 group-hover:text-ibc-brand transition-colors duration-300"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-ibc-brand/20 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-ibc-brand/30 transition-colors duration-700"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">需要更多帮助？</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              我们的技术专家随时准备为您解答疑问，提供最专业的支持。
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <Link to="/about/contact" className="bg-ibc-brand/90 hover:bg-ibc-brand text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-ibc-brand/25">
                联系技术支持
              </Link>
              <Link to="/services/downloads" className="bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/10">
                访问下载中心
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};