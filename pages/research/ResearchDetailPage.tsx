import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHero } from '../../components/PageHero';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { topicDetails } from '../../data/research';

export const ResearchDetailPage: React.FC = () => {
    const { id } = useParams();
    const { language } = useLanguage();
    const topic = topicDetails[id || ''];

    if (!topic) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">页面不存在</h1>
                    <Link to="/research" className="text-ibc-brand font-bold">返回技术研究</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <PageHero
                title={topic.title}
                subtitle={topic.desc}
                image="/upload/local_images/aHR0cHM6Ly9pbWF.jpg"
            />

            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="flex items-center text-sm text-gray-500 mb-12">
                    <Link to="/research" className="hover:text-ibc-brand transition-colors flex items-center">
                        <ArrowLeft size={16} className="mr-1" /> {language === 'zh' ? '技术研究' : 'Research'}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{topic.title}</span>
                </div>

                <div className="space-y-16">
                    {topic.sections.map((section, i) => (
                        <div key={i} className="border-l-4 border-ibc-brand pl-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <BookOpen className="text-ibc-brand mr-3" size={24} />
                                {section.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
