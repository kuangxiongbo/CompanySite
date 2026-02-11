import React from 'react';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    category: "云安全",
    title: "Prisma Cloud",
    description: "业界最完整的云原生应用保护平台 (CNAPP)，全方位保障您的上云之旅。",
    image: "https://picsum.photos/600/400?random=20",
    link: "了解更多"
  },
  {
    category: "网络安全",
    title: "下一代防火墙",
    description: "基于机器学习的网络安全技术，即时拦截未知威胁。",
    image: "https://picsum.photos/600/400?random=21",
    link: "探索防火墙"
  },
  {
    category: "安全运营",
    title: "Cortex XDR",
    description: "业界首个扩展检测与响应平台，跨越数据边界进行统一防护。",
    image: "https://picsum.photos/600/400?random=22",
    link: "查看 Cortex XDR"
  }
];

export const FeatureGrid: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">核心平台</h2>
            <p className="text-xl text-gray-500 max-w-2xl">
              全面的网络安全产品组合，确保您的组织在威胁面前始终领先一步。
            </p>
          </div>
          <a href="#" className="hidden md:flex items-center font-bold text-ibc-orange hover:text-orange-700 transition-colors">
            查看所有产品 <ArrowRight className="ml-2" size={20} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group relative bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="p-8">
                <div className="text-xs font-bold text-ibc-orange uppercase tracking-wider mb-2">{feature.category}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center font-bold text-gray-900 group-hover:text-ibc-orange transition-colors">
                  {feature.link} <ArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform" size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};