import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, image }) => {
  return (
    <div className="relative bg-[#121212] py-32 overflow-hidden">
      {image && (
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent"></div>
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{title}</h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
};