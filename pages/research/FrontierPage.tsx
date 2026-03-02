import React from 'react';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lock, Cpu, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { frontierTopics } from '../../data/research';

const iconMap: Record<string, React.FC<any>> = {
    fhe: Lock,
    pqc: Cpu,
    privacy: Shield,
};

export const FrontierPage: React.FC = () => {
    const { language } = useLanguage();

    return (
        <div className="bg-white">
            <PageHero
                title={language === 'zh' ? "前沿技术研究" : "Frontier Technology Research"}
                subtitle={language === 'zh' ? "聚焦全同态加密、隐私计算及抗量子密码等前沿密码技术领域，持续推动技术创新。" : "Focusing on cutting-edge cryptographic technology research."}
                image="/upload/local_images/aHR0cHM6Ly9pbWF.jpg"
            />

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-3 gap-8">
                    {frontierTopics.map((topic) => {
                        const Icon = iconMap[topic.id] || Shield;
                        return (
                            <div key={topic.id} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group">
                                <div className={`inline-flex p-3 rounded-lg mb-6 ${topic.bg} ${topic.color}`}>
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{topic.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{topic.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {topic.highlights.map((h, i) => (
                                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${topic.bg} ${topic.color}`}>
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                <Link to={`/research/${topic.id}`} className="flex items-center font-bold text-gray-900 group-hover:text-ibc-brand transition-colors text-sm">
                                    {language === 'zh' ? '了解更多' : 'Learn More'} <ArrowRight className="ml-2" size={16} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
