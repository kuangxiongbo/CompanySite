import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Server, Shield, Smartphone, Database, ArrowRight, Cpu, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { productsData, productCategories } from '../../data/products';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  infrastructure: Server,
  management: Database,
  auth: Shield,
  'data-security': Lock,
  iot: Cpu,
  quantum: Smartphone,
};

export const ProductCenter: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setTimeout(() => {
        const el = document.getElementById(categoryParam);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.search]);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible');
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const categoryDescriptions: Record<string, { title: string; desc: string }> = {
    infrastructure: {
      title: language === 'en' ? 'Cryptographic Foundation' : '密码基础产品',
      desc: language === 'en' ? 'Build a secure root of cryptographic trust.' : '构建自主可控的密码算力底座，提供高性能、高可靠的密码运算。',
    },
    management: {
      title: language === 'en' ? 'Management Platform' : '密码管理平台',
      desc: language === 'en' ? 'Unified management of cryptographic resources.' : '统一纳管底层密码资源，提供标准化的密钥管理与合规运营能力。',
    },
    auth: {
      title: language === 'en' ? 'Authentication & Transport' : '认证与传输',
      desc: language === 'en' ? 'Secure network boundary and access control.' : '保障网络边界安全，提供身份认证与加密传输能力。',
    },
    'data-security': {
      title: language === 'en' ? 'Data Security' : '数据安全',
      desc: language === 'en' ? 'End-to-end data lifecycle protection.' : '聚焦数据要素流通与隐私保护，覆盖存储、传输及应用各环节。',
    },
    iot: {
      title: language === 'en' ? 'IoT Security' : '物联网安全',
      desc: language === 'en' ? 'Lightweight device identity & encryption.' : '打造轻量级、低功耗的物联网设备安全认证与通信加密体系。',
    },
    quantum: {
      title: language === 'en' ? 'Post-Quantum Series' : '后量子系列',
      desc: language === 'en' ? 'Quantum-resistant cryptographic infrastructure.' : '面向未来量子计算威胁，提供抗量子密码硬件与算法迁移方案。',
    },
  };

  const activeCategories = productCategories.filter((c) => c.id !== 'all');

  return (
    <div className="font-sans min-h-screen bg-[#0b0c10]">
      {/* ─── HERO ─── */}
      <div className="relative overflow-hidden pt-32 pb-52 lg:pt-48 lg:pb-72 bg-[#0b0c10]">
        <div className="absolute inset-0 z-0">
          <img
            src="/upload/local_images/product_center_hero.png"
            alt="Product Center"
            className="w-full h-full object-cover opacity-40 animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl animate-fade-in-up">
            <h4 className="text-ibc-brand text-sm font-bold tracking-[0.3em] uppercase mb-4">
              {language === 'en' ? 'PRODUCTS & SERVICES' : '全栈安全产品矩阵'}
            </h4>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
              {language === 'en' ? 'The Foundation of Digital Trust' : '自主创新构建数字信任基座'}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10 font-light">
              {language === 'en'
                ? 'Comprehensive cryptographic product lines spanning infrastructure to cloud-native applications.'
                : '以商用密码为核心的安全产品矩阵，从底层密码设备到上层应用安全，提供端到端的全面防护。'}
            </p>
          </div>
        </div>

        {/* Diagonal cut — blends into first dark section */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30 translate-y-px">
          <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="block w-full h-20 md:h-28 lg:h-40 fill-[#0b0c10]">
            <path d="M1200 100L0 100 0 100 1200 0z" />
          </svg>
        </div>
      </div>

      {/* ─── ALTERNATING CATEGORIES ─── */}
      <div className="relative z-20">
        {activeCategories.map((cat, index) => {
          const info = categoryDescriptions[cat.id] ?? { title: cat.name, desc: '' };
          const CategoryIcon = CATEGORY_ICONS[cat.id] ?? Server;
          const categoryProducts = productsData.filter((p) => p.category === cat.id);
          const isEven = index % 2 === 0;

          // Alternate: even → dark (#0b0c10), odd → white
          const isDark = isEven;

          if (categoryProducts.length === 0) return null;

          return (
            <section
              id={cat.id}
              key={cat.id}
              className={`reveal-on-scroll relative py-24 lg:py-32 opacity-0 translate-y-12 transition-all duration-1000 ease-out scroll-mt-20 ${isDark ? 'bg-[#0b0c10]' : 'bg-white'
                }`}
            >
              {/* Divider stripe at top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-ibc-brand/20" />

              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                  {/* ── Category info (alternates L/R) ── */}
                  <div className={`lg:w-1/3 lg:sticky top-32 ${!isEven ? 'lg:order-2' : ''}`}>
                    {/* Icon box */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg ${isDark
                      ? 'bg-ibc-brand/10 border border-ibc-brand/20'
                      : 'bg-ibc-brand/10 border border-ibc-brand/30'
                      }`}>
                      <CategoryIcon size={32} strokeWidth={1.5} className="text-ibc-brand" />
                    </div>

                    <h2 className={`text-4xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {info.title}
                    </h2>

                    {/* Green accent underline */}
                    <div className="h-1 w-16 bg-ibc-brand rounded-full mb-6" />

                    <p className={`text-xl leading-relaxed font-light mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {info.desc}
                    </p>

                    <div className={`text-sm font-mono ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      {categoryProducts.length} {language === 'en' ? 'products' : '款产品'}
                    </div>
                  </div>

                  {/* ── Product cards grid ── */}
                  <div className={`lg:w-2/3 ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="grid sm:grid-cols-2 gap-8 lg:gap-10">
                      {categoryProducts.map((product) => (
                        <Link
                          to={`/products/detail?name=${encodeURIComponent(product.name)}`}
                          key={product.id}
                          className={`group relative rounded-2xl p-6 overflow-hidden flex flex-col h-full transition-all duration-300 border ${isDark
                            ? 'bg-[#13161c] border-white/6 hover:border-ibc-brand/40 hover:shadow-[0_20px_60px_rgba(0,177,64,0.12)]'
                            : 'bg-gray-50 border-gray-200 hover:border-ibc-brand/50 hover:shadow-xl hover:shadow-ibc-brand/10'
                            }`}
                        >
                          {/* Arrow on hover */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight size={18} className="text-ibc-brand" />
                          </div>

                          {/* Tag */}
                          {product.tag && (
                            <div className="mb-5 z-10">
                              <span className="text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-ibc-brand/10 text-ibc-brand border border-ibc-brand/20">
                                {product.tag}
                              </span>
                            </div>
                          )}

                          <h3 className={`text-xl font-bold mb-3 z-10 leading-snug group-hover:text-ibc-brand transition-colors ${isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                            {product.name}
                          </h3>

                          <p className={`text-sm line-clamp-3 leading-relaxed mb-8 flex-grow z-10 ${isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            {product.description}
                          </p>

                          <div className={`mt-auto pt-5 border-t text-sm font-semibold group-hover:text-ibc-brand transition-colors z-10 ${isDark ? 'border-white/5 text-white/40' : 'border-gray-200 text-gray-400'
                            }`}>
                            {language === 'en' ? 'Explore Product →' : '查看详情 →'}
                          </div>

                          {/* Hover gradient */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl bg-gradient-to-br from-ibc-brand/5 to-transparent" />
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};