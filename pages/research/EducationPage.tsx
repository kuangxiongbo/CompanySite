
import React from 'react';
import { PageHero } from '../../components/PageHero';
import { educationData } from '../../data/research';

export const EducationPage: React.FC = () => {
    const { intro, hero, cisp, framework, schedule, notice, exam } = educationData;

    return (
        <div className="bg-white min-h-screen">
            <PageHero
                title="产业教育"
                subtitle={intro.split('|')[1].trim()}
                image={hero.bg}
            />

            {/* Course Intro */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ibc-brand/10 text-ibc-brand rounded-full text-sm font-bold tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-ibc-brand animate-pulse"></span>
                                {cisp.title}
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                                CISP <br />
                                <span className="text-ibc-brand">注册信息安全专业人员</span>
                            </h2>
                            <div className="text-lg text-gray-600 leading-relaxed font-medium space-y-4 whitespace-pre-line">
                                {cisp.desc}
                            </div>
                            <div className="p-8 bg-ibc-brand rounded-[2rem] text-white">
                                <p className="text-xl font-bold leading-relaxed italic opacity-90">
                                    "{cisp.highlight}"
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 relative group">
                            <div className="absolute inset-0 bg-ibc-brand/20 rounded-[3rem] blur-3xl group-hover:bg-ibc-brand/30 transition-all duration-700 -z-10"></div>
                            <img
                                src={cisp.image}
                                alt="CISP Certificate"
                                className="w-full h-auto rounded-[2rem] shadow-2xl group-hover:scale-[1.02] transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Framework */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-gray-900 mb-6">{framework.title}</h2>
                        <p className="text-lg text-gray-500 font-medium whitespace-pre-line">{framework.desc}</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-5 relative">
                            <img
                                src={framework.image}
                                alt="CISP Framework Hexagon"
                                className="w-full h-auto drop-shadow-2xl animate-ken-burns"
                            />
                        </div>
                        <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
                            {framework.domains.map((domain) => (
                                <div key={domain.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-ibc-brand/20 transition-all group">
                                    <div className="text-ibc-brand font-black text-xl mb-4 group-hover:translate-x-1 transition-transform">{domain.name}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {domain.subdomains.map((sub, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-lg border border-gray-100 group-hover:text-gray-600 group-hover:bg-ibc-brand/5 transition-all">
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Training Schedule */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-gray-900 mb-6">{schedule.title}</h2>
                        <p className="text-lg text-ibc-brand font-bold">{schedule.subtitle}</p>
                    </div>

                    <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-2xl">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="py-8 px-10 text-left font-black tracking-widest uppercase">时间</th>
                                    <th className="py-8 px-10 text-left font-black tracking-widest uppercase border-l border-white/10">培训内容</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {schedule.days.map((day, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr className="group hover:bg-gray-50 transition-colors">
                                            <td rowSpan={2} className="py-8 px-10 font-black text-gray-900 border-r border-gray-100">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-10 h-10 rounded-full bg-ibc-brand text-white flex items-center justify-center text-sm">{idx + 1}</span>
                                                    {day.day}
                                                </div>
                                            </td>
                                            <td className="py-6 px-10">
                                                <div className="flex items-center gap-6">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-24">上午 9-12</span>
                                                    <span className="text-lg font-bold text-gray-700">{day.morning}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-6 px-10">
                                                <div className="flex items-center gap-6">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest w-24">下午 14-17</span>
                                                    <span className="text-lg font-bold text-gray-700">{day.afternoon}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Notices */}
            <section className="py-24 bg-gray-900 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-ibc-brand/10 rounded-full blur-[150px] -ml-96 -mb-96"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-8 border-l-4 border-ibc-brand pl-6">{notice.title}</h2>
                                <div className="grid gap-4">
                                    {notice.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all whitespace-pre-line">
                                            <div className="w-1.5 h-1.5 rounded-full bg-ibc-brand mt-2.5 shrink-0"></div>
                                            <span className="text-gray-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-4xl font-black text-white mb-8 border-l-4 border-ibc-brand pl-6">{exam.title}</h2>
                                <div className="grid gap-4">
                                    {exam.items.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                            <div className="w-1.5 h-1.5 rounded-full bg-ibc-brand mt-2.5 shrink-0"></div>
                                            <span className="text-gray-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 p-8 bg-gradient-to-br from-ibc-brand to-ibc-brand/80 rounded-[2.5rem] shadow-2xl relative overflow-hidden group/btn">
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <div className="text-white/80 font-bold mb-1">准备好开启成长之旅了吗？</div>
                                            <div className="text-2xl font-black text-white">立即预约 CISP 培训课程</div>
                                        </div>
                                        <button className="px-10 py-5 bg-white text-ibc-brand rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl">
                                            立即报名
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

