
import React from 'react';
import { PageHero } from '../components/PageHero';
import { downloadData } from '../data/services';
import { Download, Monitor, Smartphone, ShieldCheck } from 'lucide-react';

export const DownloadPage: React.FC = () => {
    return (
        <div className="bg-white">
            <PageHero
                title="下载中心"
                subtitle="提供密九邮、密九通及安全接入客户端的最新版本下载"
                image="/upload/about/profile/banner.png"
            />

            <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
                {downloadData.products.map((product, index) => (
                    <div key={product.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                        {/* Image/Icon Area */}
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <div className="relative w-64 h-64 bg-gray-50 rounded-[3rem] flex items-center justify-center border border-gray-100 shadow-xl group">
                                <div className="absolute inset-0 bg-ibc-brand/5 rounded-[3rem] transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                                {/* Placeholder for product icon/image */}
                                <div className="z-10 text-ibc-brand">
                                    {product.id === 'mijiu-mail' && <MailIcon size={80} />}
                                    {product.id === 'mijiu-tong' && <MessageIcon size={80} />}
                                    {product.id === 'access-client' && <ShieldIcon size={80} />}
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-gray-900">{product.name}</h2>
                                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                                <span>Updated: {product.updated}</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {product.platforms.map((platform, i) => (
                                    <a
                                        key={i}
                                        href={platform.link}
                                        className="flex items-center justify-between p-6 rounded-2xl border-2 border-gray-100 hover:border-ibc-brand/30 hover:bg-gray-50 transition-all group/btn"
                                    >
                                        <div className="flex items-center gap-4">
                                            {platform.os === 'Android' && <Smartphone size={24} className="text-gray-400 group-hover/btn:text-ibc-brand transition-colors" />}
                                            {platform.os === 'Windows' && <Monitor size={24} className="text-gray-400 group-hover/btn:text-ibc-brand transition-colors" />}
                                            {(platform.os === 'MacOS' || platform.os === 'iOS') && <Monitor size={24} className="text-gray-400 group-hover/btn:text-ibc-brand transition-colors" />}

                                            <div>
                                                <div className="font-bold text-gray-900">{platform.os}</div>
                                                <div className="text-xs font-bold text-gray-400">{platform.version}</div>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-200 text-white flex items-center justify-center group-hover/btn:bg-ibc-brand transition-colors">
                                            <Download size={16} />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Simple icon components for internal use
const MailIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const MessageIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
);

const ShieldIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-1.95c.03.01.07.03.11.04C14.59 18.7 17 17.06 17 13V6l-5-3-5 3v7a3 3 0 0 0-3-3" />
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);
