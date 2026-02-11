import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Scan, ShieldAlert, Lock, Network, 
  ArrowRight, Check, PlayCircle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SolutionCenter: React.FC = () => {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('overview');
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  
  const features = [
    {
      id: 'visibility',
      icon: Scan,
      title: language === 'zh' ? "可视性" : "Visibility",
      heading: language === 'zh' ? "发现任何地方的每一个设备。" : "See every device, everywhere.",
      description: language === 'zh' 
        ? "传统的签名扫描无法识别现代 IoT 设备。OLYM 使用获得专利的机器学习技术，通过分析网络流量行为，准确识别从未见过的设备——无需部署传感器或代理。"
        : "Legacy signature scanning fails on modern IoT. OLYM uses patented machine learning to identify never-before-seen devices by analyzing network traffic behaviors—without sensors or agents.",
      points: language === 'zh' 
        ? ["97% 的设备识别准确率", "自动分类设备类型", "实时风险评分"] 
        : ["97% device identification accuracy", "Auto-classify device type", "Real-time risk scoring"],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 'prevention',
      icon: ShieldAlert,
      title: language === 'zh' ? "威胁防御" : "Threat Prevention",
      heading: language === 'zh' ? "阻止已知和未知威胁。" : "Stop known and unknown threats.",
      description: language === 'zh' 
        ? "IoT 设备通常是网络中最薄弱的环节。我们的内置入侵防御系统 (IPS) 使用针对 IoT 优化的威胁情报，在网络层即时阻断漏洞利用、恶意软件和命令与控制 (C2) 流量。"
        : "IoT devices are often the weakest link. Our built-in IPS uses IoT-optimized threat intelligence to instantly block exploits, malware, and C2 traffic at the network layer.",
      points: language === 'zh' 
        ? ["阻断 IoT 特定漏洞利用", "防止横向移动", "基于 ML 的 C2 阻断"] 
        : ["Block IoT-specific exploits", "Prevent lateral movement", "ML-based C2 blocking"],
      image: "https://images.unsplash.com/photo-1563206767-5b1d972d9323?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 'integration',
      icon: Lock,
      title: language === 'zh' ? "零信任策略" : "Zero Trust Policy",
      heading: language === 'zh' ? "一键实施最小权限。" : "Enforce least privilege with one click.",
      description: language === 'zh' 
        ? "无需手动编写规则。OLYM 根据设备的行为基线，自动建议并实施细粒度的安全策略。确保监控摄像头只能访问视频服务器，而不是财务数据库。"
        : "Stop writing manual rules. OLYM automatically recommends and enforces granular policies based on device behavior baselines. Ensure cameras only talk to video servers, not finance databases.",
      points: language === 'zh' 
        ? ["自动策略建议", "基于上下文的分段", "原生防火墙集成"] 
        : ["Automated policy recommendations", "Context-based segmentation", "Native firewall integration"],
      image: "https://images.unsplash.com/photo-1558494949-ef2bb6ffaebd?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (entry.target.id) setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px" } 
    );
    document.querySelectorAll('.reveal-on-scroll, section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) setActiveFeatureIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionRefs.current.forEach((ref) => { if (ref) featureObserver.observe(ref); });
    return () => featureObserver.disconnect();
  }, [features]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white font-sans">
      <div className="relative bg-[#121212] text-white overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32" id="overview">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1558494949-ef2bb6ffaebd?q=80&w=2070&auto=format&fit=crop" alt="Abstract Network" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 reveal-on-scroll">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
              {language === 'zh' ? "看不见，" : "You can't secure"} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {language === 'zh' ? "就无法保护。" : "what you can't see."}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl font-light">
              {language === 'zh' ? "业界最全面的解决方案，利用机器学习自动发现并保护网络中的每一个设备。" : "The industry's most comprehensive solution to discover and secure every device."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-ibc-brand text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-green-600 transition-all flex items-center justify-center">
                 {language === 'zh' ? "申请免费评估" : "Get Free Assessment"} <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
             <div className="font-bold text-xl text-gray-900 tracking-tight">OLYM IoT Security</div>
             <div className="flex space-x-8">
               {[
                 { id: 'overview', label: language === 'zh' ? '概览' : 'Overview' },
                 { id: 'visibility', label: language === 'zh' ? '可视性' : 'Visibility' },
                 { id: 'prevention', label: language === 'zh' ? '防御' : 'Prevention' },
                 { id: 'integration', label: language === 'zh' ? '零信任' : 'Zero Trust' }
               ].map(item => (
                 <button key={item.id} onClick={() => scrollToSection(item.id)} className={`text-sm font-bold border-b-2 transition-all py-5 ${activeSection === item.id ? 'text-ibc-brand border-ibc-brand' : 'text-gray-500 border-transparent hover:text-gray-900'}`}>{item.label}</button>
               ))}
             </div>
             <button className="text-sm font-bold text-ibc-brand hover:underline">{language === 'zh' ? "下载数据表" : "Download Datasheet"}</button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-screen sticky-viewport-height sticky z-0 bg-gray-100 border-l border-gray-200 overflow-hidden">
           {features.map((feature, index) => (
             <div key={feature.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center p-12 ${activeFeatureIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="relative z-10 w-full max-w-xl">
                   <img src={feature.image} alt={feature.title} className="relative w-full rounded-xl shadow-2xl border border-white/50" />
                </div>
             </div>
           ))}
        </div>

        <div className="relative z-10 w-full lg:w-1/2">
          {features.map((feature, index) => (
            <section id={feature.id} key={feature.id} ref={(el) => { sectionRefs.current[index] = el; }} data-index={index} className="min-h-screen flex flex-col justify-center px-6 py-24 md:px-12 lg:px-24 bg-white lg:bg-transparent border-b lg:border-none border-gray-100">
               <div className="reveal-on-scroll">
                  <div className="inline-flex items-center text-ibc-brand font-bold mb-6 uppercase tracking-widest text-sm bg-ibc-brand/5 px-3 py-1 rounded-full">
                    <feature.icon className="mr-2" size={18} />
                    {feature.title}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">{feature.heading}</h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">{feature.description}</p>
                  <ul className="space-y-5 mb-10">
                    {feature.points.map((item, i) => (
                      <li key={i} className="flex items-start">
                         <div className="mt-1 mr-4 w-6 h-6 rounded-full bg-ibc-brand flex items-center justify-center text-white flex-shrink-0 shadow-sm"><Check size={14} strokeWidth={4} /></div>
                         <span className="text-gray-800 font-semibold text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to={`/solutions/${feature.id}-detail`} className="text-ibc-brand font-bold flex items-center text-lg hover:text-green-700 transition-colors group">
                     {language === 'zh' ? "深入了解" : "Learn more about"} {feature.title} 
                     <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
               </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};