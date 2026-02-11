import React, { useEffect } from 'react';
import { PageHero } from '../components/PageHero';
import { PlatformTabs } from '../components/PlatformTabs';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Cloud, Activity, Check, ArrowRight, Lock, Cpu, Wifi } from 'lucide-react';

export const PlatformPage: React.FC = () => {
  const { language } = useLanguage();

  // Initialize IntersectionObserver for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: language === 'zh' ? "看见一切，保护一切" : "See Everything. Secure Everything.",
      desc: language === 'zh' 
        ? "你无法保护你看不见的东西。OLYM 能够发现并保护您网络中的每一个设备——包括托管设备、非托管设备以及物联网 (IoT) 设备。无需额外部署传感器。" 
        : "You can't secure what you can't see. OLYM discovers and secures every device on your network—managed, unmanaged, and IoT. No extra sensors required.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      points: language === 'zh' ? ["97% 的设备可视性", "自动分类与风险评估", "基于行为的威胁检测"] : ["97% Device Visibility", "Automated Classification", "Behavior-based Detection"]
    },
    {
      title: language === 'zh' ? "机器学习驱动的防御" : "ML-Powered Defense",
      desc: language === 'zh' 
        ? "传统的签名机制已经不够了。我们的内联深度学习引擎可以在零日威胁发生时即时阻断，为您提供比任何其他解决方案快 3 倍的防护速度。" 
        : "Signatures aren't enough anymore. Our inline deep learning engines stop zero-day threats instantly as they happen, protecting you 3x faster than any other solution.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
      points: language === 'zh' ? ["实时恶意软件分析", "DNS 安全", "抗网络钓鱼"] : ["Real-time Malware Analysis", "DNS Security", "Anti-Phishing"]
    }
  ];

  const capabilities = [
    {
      icon: Lock,
      title: language === 'zh' ? "零信任执行" : "Zero Trust Enforcement",
      desc: language === 'zh' ? "基于设备风险和上下文自动实施最小权限访问策略。" : "Automate least-privilege access policies based on device risk and context."
    },
    {
      icon: Cpu,
      title: language === 'zh' ? "量子级安全" : "Quantum-Ready Security",
      desc: language === 'zh' ? "为未来的量子计算威胁做好准备，确保持续的数据加密保护。" : "Prepare for future quantum threats with continuous data encryption protection."
    },
    {
      icon: Wifi,
      title: language === 'zh' ? "无缝物联网集成" : "Seamless IoT Integration",
      desc: language === 'zh' ? "原生集成到防火墙中，保护医疗、工业和企业物联网设备。" : "Natively integrated into firewalls to secure medical, industrial, and enterprise IoT."
    }
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title={language === 'zh' ? "智能设备安全" : "Intelligent Device Security"} 
        subtitle={language === 'zh' ? "业界唯一基于机器学习的全面设备可视性与保护平台。" : "The industry's only ML-powered platform for complete device visibility and protection."}
        image="https://images.unsplash.com/photo-1563206767-5b1d972d9323?q=80&w=2070&auto=format&fit=crop"
      />
      
      {/* Sticky Subnav Simulation */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-gray-900">{language === 'zh' ? "平台概览" : "Platform Overview"}</div>
          <div className="flex space-x-6 text-sm font-medium text-gray-600">
            <a href="#visibility" className="hover:text-ibc-brand">{language === 'zh' ? "可视性" : "Visibility"}</a>
            <a href="#protection" className="hover:text-ibc-brand">{language === 'zh' ? "威胁防护" : "Protection"}</a>
            <a href="#integration" className="hover:text-ibc-brand">{language === 'zh' ? "集成" : "Integration"}</a>
          </div>
          <button className="bg-ibc-brand text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 transition-colors">
            {language === 'zh' ? "获取报告" : "Get Report"}
          </button>
        </div>
      </div>

      {/* Main Features - ZigZag Layout */}
      <div className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {features.map((feature, idx) => (
            <div key={idx} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
               <div className="w-full md:w-1/2 reveal-on-scroll">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {feature.desc}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {feature.points.map((p, i) => (
                      <li key={i} className="flex items-center text-gray-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-ibc-brand">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button className="group flex items-center text-ibc-brand font-bold text-lg hover:text-green-700 transition-colors">
                    {language === 'zh' ? "了解工作原理" : "See how it works"} 
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </button>
               </div>
               <div className="w-full md:w-1/2 relative reveal-on-scroll delay-200">
                  <div className={`absolute -inset-4 bg-gradient-to-tr from-ibc-brand/20 to-transparent rounded-3xl blur-2xl opacity-50 ${idx % 2 !== 0 ? 'left-4' : 'right-4'}`}></div>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="relative z-10 rounded-2xl shadow-2xl w-full object-cover h-[400px] border border-gray-100 hover:scale-[1.02] transition-transform duration-500"
                  />
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Capabilities Section */}
      <div className="bg-[#121212] text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 max-w-3xl mx-auto reveal-on-scroll">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">
               {language === 'zh' ? "不仅仅是防火墙" : "More Than Just a Firewall"}
             </h2>
             <p className="text-gray-400 text-lg">
               {language === 'zh' 
                 ? "OLYM 平台将网络安全扩展到了每一个接触点。从物理边界到云端边缘，我们提供一致的、世界级的保护。" 
                 : "The OLYM Platform extends network security to every touchpoint. From the physical perimeter to the cloud edge, we deliver consistent, world-class protection."}
             </p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
             {capabilities.map((cap, i) => (
               <div key={i} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-ibc-brand transition-all hover:-translate-y-1 group reveal-on-scroll" style={{ transitionDelay: `${i * 100}ms` }}>
                 <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 text-ibc-brand group-hover:bg-ibc-brand group-hover:text-white transition-colors">
                   <cap.icon size={24} />
                 </div>
                 <h3 className="text-xl font-bold mb-4">{cap.title}</h3>
                 <p className="text-gray-400 leading-relaxed">
                   {cap.desc}
                 </p>
               </div>
             ))}
           </div>
        </div>
      </div>

      <PlatformTabs />
    </div>
  );
};