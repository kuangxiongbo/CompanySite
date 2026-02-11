import React from 'react';
import { PageHero } from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { Headphones, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { language } = useLanguage();

  const services = [
    {
      title: language === 'zh' ? "Unit 42 事件响应" : "Unit 42 Incident Response",
      desc: language === 'zh' ? "受到攻击？我们的精英响应团队可以全天候为您提供帮助，最大限度地减少影响并恢复运营。" : "Under attack? Our elite response team is available 24/7 to minimize impact and restore operations.",
      icon: AlertTriangle
    },
    {
      title: language === 'zh' ? "专业咨询服务" : "Professional Consulting",
      desc: language === 'zh' ? "从架构设计到实施，我们的专家将指导您的每一步，确保最佳的安全态势。" : "From architecture to implementation, our experts guide you every step of the way to ensure optimal security posture.",
      icon: Lightbulb
    },
    {
      title: language === 'zh' ? "教育与培训" : "Education & Training",
      desc: language === 'zh' ? "通过官方培训和认证计划，提升您团队的网络安全技能。" : "Empower your team with cybersecurity skills through our official training and certification programs.",
      icon: BookOpen
    },
    {
      title: language === 'zh' ? "客户支持" : "Customer Support",
      desc: language === 'zh' ? "无论何时何地，我们的全球支持团队随时待命，为您解决技术难题。" : "Whenever, wherever. Our global support team is ready to solve your technical challenges.",
      icon: Headphones
    }
  ];

  return (
    <div className="bg-white">
      <PageHero 
        title={language === 'zh' ? "服务与支持" : "Services & Support"} 
        subtitle={language === 'zh' ? "专家指导、全天候支持和世界级的情报，助您从容应对安全挑战。" : "Expert guidance, 24/7 support, and world-class intelligence to help you tackle security challenges with confidence."}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop"
      />
      
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
               <div key={i} className="bg-gray-50 p-8 rounded-xl border border-gray-100 hover:border-ibc-brand/50 hover:shadow-lg transition-all text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-ibc-brand">
                     <s.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{s.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{s.desc}</p>
                  <a href="#" className="text-ibc-brand font-bold text-sm hover:underline">
                     {language === 'zh' ? "了解更多" : "Learn More"}
                  </a>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};