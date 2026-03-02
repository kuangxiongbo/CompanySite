
import React from 'react';
import { PageHero } from '../../components/PageHero';
import { researchCooperationData } from '../../data/research';
import { GraduationCap, FlaskConical, Building2, ArrowRight } from 'lucide-react';

export const IndustryUniversityPage: React.FC = () => {
    const { intro, partners } = researchCooperationData;

    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <PageHero
                title="产学研用"
                subtitle="前瞻性产学研用布局 推动国密算法成果转化"
                image="/upload/local_images/research_industry_university_hero.png"
            />

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                {/* Centers Grid - 2x2 Layout matching source */}
                <div className="grid md:grid-cols-2 gap-12">
                    {partners.map((partner, i) => (
                        <div
                            key={i}
                            className="group bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-700 flex flex-col items-center"
                        >
                            {/* Blue Line Indicator */}
                            <div className="w-12 h-1 bg-ibc-brand/30 group-hover:bg-ibc-brand group-hover:w-24 transition-all duration-500 rounded-full mb-10"></div>

                            {/* Heading */}
                            <h3 className="text-2xl font-black text-gray-900 mb-8 text-center group-hover:text-ibc-brand transition-colors">
                                {partner.name}
                            </h3>

                            {/* Plaque Image Container */}
                            <div className="w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden mb-10 border border-gray-100 flex items-center justify-center group-hover:border-ibc-brand/20 transition-all duration-500">
                                <img
                                    src={partner.image}
                                    alt={partner.name}
                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-1000"
                                />
                            </div>

                            {/* Description */}
                            <p className="text-gray-500 text-lg leading-relaxed text-center font-medium max-w-md">
                                {partner.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Slogan Section */}
                <div className="bg-gray-900 rounded-[4rem] p-16 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-ibc-brand/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-3xl md:text-4xl font-black text-white">{intro.split('|')[0]}</h3>
                        <p className="text-gray-400 text-xl font-medium">{intro.split('|')[1]}</p>
                        <div className="pt-8 flex justify-center">
                            <div className="px-8 py-4 bg-ibc-brand rounded-full text-white font-bold flex items-center gap-3 hover:shadow-[0_0_30px_rgba(0,177,64,0.4)] transition-all cursor-pointer">
                                了解更多合作详情 <ArrowRight size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
