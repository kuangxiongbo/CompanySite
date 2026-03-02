import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, Building2, Radio, Factory, Mountain, Briefcase, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { solutionCategories, solutionIntro } from '../../data/solutions';

const categoryIcons: Record<string, React.ElementType> = {
  gov: Building2,
  operator: Radio,
  enterprise: Factory,
  resources: Mountain,
  other: Briefcase,
};

export const SolutionCenter: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState(solutionCategories[0].id);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && sectionRefs.current[categoryParam]) {
      setTimeout(() => {
        scrollToCategory(categoryParam);
      }, 100);
    }
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    if (categoryParam && sectionRefs.current[categoryParam]) {
      scrollToCategory(categoryParam);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            const id = entry.target.getAttribute('data-category-id');
            if (id) setActiveTab(id);
          }
        });
      },
      { threshold: 0.15, rootMargin: '-120px 0px -40% 0px' }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref as Element);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (id: string) => {
    setActiveTab(id);
    const el = sectionRefs.current[id];
    if (el) {
      const yOffset = -130;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0b0c10] font-sans text-gray-300 min-h-screen">
      {/* ─── HERO BANNER ─── */}
      <div className="relative overflow-hidden pt-32 pb-48 lg:pt-48 lg:pb-64 bg-[#0b0c10]">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src="/upload/local_images/product_center_hero.png"
            alt="Cybersecurity Solutions"
            className="w-full h-full object-cover opacity-40 animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl animate-fade-in-up">
            <h4 className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase mb-4">
              {language === 'en' ? 'INDUSTRY SOLUTIONS' : '行业解决方案'}
            </h4>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
              {solutionIntro.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10 font-light">
              {solutionIntro.desc1} {solutionIntro.desc2}
            </p>
          </div>
        </div>

        {/* Irregular Diagonal Divider (Palo Alto Style) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30 transform translate-y-1">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="block w-full h-24 md:h-32 lg:h-48 fill-[#0f1115]">
            <path d="M1200 120L0 120 0 120 1200 0z"></path>
          </svg>
        </div>
      </div>

      {/* ─── STICKY TAB NAV ─── */}
      <div className="sticky top-0 z-40 bg-[#0f1115]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {solutionCategories.map((cat) => {
              const Icon = categoryIcons[cat.id] || Shield;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-6 py-4 text-[15px] font-semibold border-b-[3px] transition-all duration-300 ${activeTab === cat.id
                    ? 'text-ibc-brand border-ibc-brand bg-white/5'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon size={18} strokeWidth={activeTab === cat.id ? 2.5 : 2} />
                  {cat.title}
                  <span className="text-xs opacity-60 ml-1">({cat.solutions.length})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#0f1115]">
        {/* ─── OVERVIEW SECTION ─── */}
        <section className="py-24 border-b border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
                  {language === 'en' ? 'Comprehensive Security Architecture' : '综合密码安全体系'}
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed mb-6 font-light">
                  {solutionIntro.desc1}
                </p>
                <p className="text-lg text-gray-400 leading-relaxed mb-10 font-light">
                  {solutionIntro.desc2}
                </p>
                <div className="flex flex-wrap gap-3">
                  {solutionCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => scrollToCategory(cat.id)}
                      className="px-5 py-2.5 rounded-full text-sm font-medium border border-white/10 text-gray-300 hover:text-white hover:border-ibc-brand/50 hover:bg-ibc-brand/10 transition-colors"
                    >
                      {cat.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Side */}
              <div className="flex justify-center relative">
                <div className="absolute inset-0 bg-ibc-brand/20 blur-[100px] rounded-full z-0" />
                <img
                  src={solutionIntro.pyramidImage}
                  alt="Architecture"
                  className="relative z-10 w-full max-w-md drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── SOLUTION CATEGORIES ─── */}
        <div className="pb-0">
          {solutionCategories.map((cat, index) => {
            const Icon = categoryIcons[cat.id] || Shield;

            const bgColors = [
              "bg-[#0b0c10]", // base dark
              "bg-[#11131a]", // navy tint
              "bg-[#0f1412]", // teal tint
              "bg-[#151218]", // purple tint
              "bg-[#161616]"  // graphite
            ];
            const sectionBg = bgColors[index % bgColors.length];

            return (
              <section
                key={cat.id}
                data-category-id={cat.id}
                ref={(el) => { sectionRefs.current[cat.id] = el; }}
                className={`py-24 border-t border-white/5 scroll-mt-24 ${sectionBg}`}
              >
                <div className="max-w-7xl mx-auto px-6">
                  {/* Category Header */}
                  <div className="flex items-center gap-6 mb-16">
                    <div className="w-16 h-16 rounded-2xl bg-ibc-brand/10 border border-ibc-brand/20 flex flex-shrink-0 items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                      <Icon size={32} className="text-ibc-brand" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                        {cat.title}
                      </h2>
                      <p className="text-gray-400 text-[15px] font-medium uppercase tracking-wider">
                        {language === 'en' ? 'Solutions Count' : '包含'} : {cat.solutions.length}
                      </p>
                    </div>
                  </div>

                  {/* Solutions Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {cat.solutions.map((sol) => (
                      <Link
                        key={sol.id}
                        to={`/solutions/detail?name=${encodeURIComponent(sol.title)}`}
                        className="group flex flex-col bg-[#15181e] border border-white/5 rounded-2xl p-8 transition-all duration-300 hover:bg-[#1a1e25] hover:border-ibc-brand/30 hover:shadow-2xl hover:shadow-ibc-brand/10 overflow-hidden relative min-h-[300px]"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 cursor-pointer">
                          <ArrowRight className="text-ibc-brand" size={24} />
                        </div>

                        <div className="flex items-center gap-3 mb-6 z-10">
                          <span className="text-xs font-bold px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700 font-mono">
                            NO.{sol.number}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 leading-snug group-hover:text-ibc-brand transition-colors z-10 pr-6">
                          {sol.title}
                        </h3>

                        <p className="text-[15px] text-gray-400 leading-relaxed mb-8 flex-grow z-10">
                          {sol.summary}
                        </p>

                        <div className="mt-auto border-t border-white/10 pt-6 flex items-center text-[14px] font-semibold text-white/50 group-hover:text-white transition-colors z-10">
                          {language === 'en' ? 'Explore Detail' : '查看方案详情'}
                        </div>

                        {/* Hover Gradient Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-ibc-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-t from-[#0b0c10] to-[#0f1115] text-white py-32 relative border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,100,0.03)_0%,transparent_100%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            {language === 'en' ? 'Need a Custom Security Solution?' : '需要定制化的密码安全解决方案？'}
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            {language === 'en' ? 'We have rich industry experience and can tailor end-to-end security solutions for your business.' : '基于 SM9 与全面国密算法支持，量身定制端到端的高级安全体系。'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-ibc-brand text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-500 transition-all shadow-[0_0_30px_rgba(0,200,83,0.3)] hover:shadow-[0_0_40px_rgba(0,200,83,0.5)] hover:-translate-y-1"
            >
              {language === 'en' ? 'Contact Us' : '联系我们'}
              <ArrowRight className="ml-3" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};