import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, image }) => {
  return (
    <div className="relative bg-[#0b0c10] py-32 lg:py-48 overflow-hidden">
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-40 animate-ken-burns"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/upload/local_images/product_center_hero.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-[#0b0c10]/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-transparent z-10"></div>
        </div>
      )}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">{title}</h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">{subtitle}</p>
      </div>
    </div>
  );
};