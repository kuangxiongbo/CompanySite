import React from 'react';

interface OlymLogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // light = white text (for dark bg), dark = black text (for light bg)
}

export const OlymLogo: React.FC<OlymLogoProps> = ({ className = "", variant = 'light' }) => {
  // logic: The source image is white text.
  // If variant is 'light' (on dark background), we keep it as is.
  // If variant is 'dark' (on light background), we invert the colors to make it black.
  
  const filterStyle = variant === 'dark' 
    ? { filter: 'invert(1)' } 
    : { filter: 'none' };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="image/logo.png" 
        alt="OLYM 奥联 - 民族密码 奥联智造" 
        className="h-full w-auto object-contain"
        style={filterStyle}
        onError={(e) => {
             console.warn("Logo image failed to load from image/logo.png");
        }}
      />
    </div>
  );
};