import React from 'react';
import { standardsData } from '../../data/research';
import { Globe, Map, BookOpen, Bookmark } from 'lucide-react';
import { PageHero } from '../../components/PageHero';

export const StandardsPage: React.FC = () => {
  const { intro, stats, categories } = standardsData;

  const getIcon = (id: string) => {
    switch (id) {
      case 'national': return Map;
      case 'industry': return BookOpen;
      case 'international': return Globe;
      case 'group': return Bookmark;
      default: return BookOpen;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <PageHero
        title="标准制定"
        subtitle="为中国信息安全技术国际化做出贡献，形成一系列标准成果"
        image="/upload/about/profile/banner.png"
      />

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Intro & Stats */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-900 leading-tight">
              引领行业标准<br />
              <span className="text-ibc-brand">推动技术规范</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {intro}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="text-5xl font-black text-gray-200 group-hover:text-ibc-brand transition-colors mb-2">
                  {stat.count}
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-900">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standards Lists */}
        <div className="space-y-24">
          {categories.map((category) => {
            const Icon = getIcon(category.id);
            return (
              <div key={category.id} className="scroll-mt-32" id={category.id}>
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-2xl bg-ibc-brand/5 flex items-center justify-center text-ibc-brand">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900">{category.title}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="group p-8 bg-white border border-gray-100 rounded-3xl hover:border-ibc-brand/30 hover:shadow-lg transition-all duration-300 flex gap-6 items-start">
                      <Bookmark className="flex-shrink-0 text-gray-300 group-hover:text-ibc-brand transition-colors mt-1" size={24} />
                      <div className="flex-1 space-y-3">
                        <p className={`text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors ${typeof item === 'object' ? 'font-bold' : 'font-medium'}`}>
                          {typeof item === 'object' ? item.title : item}
                        </p>
                        {typeof item === 'object' && item.desc && (
                          <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Project Research Section */}
          {standardsData.projectResearch && (
            <div className="scroll-mt-32" id="project-research">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Bookmark size={32} />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{standardsData.projectResearch.title}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {standardsData.projectResearch.items.map((item, idx) => (
                  <div key={idx} className="group p-8 bg-blue-50/30 border border-blue-100 rounded-3xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex gap-6 items-start">
                    <Bookmark className="flex-shrink-0 text-blue-300 group-hover:text-blue-600 transition-colors mt-1" size={24} />
                    <p className="text-gray-700 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};