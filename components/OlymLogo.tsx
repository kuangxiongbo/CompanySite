import React from 'react';

interface OlymLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const OlymLogo: React.FC<OlymLogoProps> = ({ className = "", variant = 'dark' }) => {
  // On light/white backgrounds (variant='dark'), show black OLYM + green tagline
  // On dark backgrounds (variant='light'), show white OLYM + green tagline
  const mainColor = variant === 'dark' ? '#000000' : '#FFFFFF';

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Main Logo Text */}
      <div className="flex items-baseline leading-none" style={{ fontFamily: "'Inter', 'Noto Sans SC', sans-serif" }}>
        <span
          className="font-extrabold tracking-tighter"
          style={{ color: mainColor, fontSize: '1.8em', letterSpacing: '-0.05em' }}
        >
          OLYM
        </span>
        <sup style={{ color: mainColor, fontSize: '0.4em', position: 'relative', top: '-1.2em' }}>®</sup>
        <span
          className="font-black"
          style={{ color: mainColor, fontSize: '1.6em', fontFamily: "'Noto Sans SC', sans-serif", marginLeft: '2px' }}
        >
          奥联
        </span>
      </div>
      {/* Tagline */}
      <div
        className="text-right leading-none"
        style={{
          color: '#00B140',
          fontSize: '0.65em',
          fontFamily: "'Noto Sans SC', sans-serif",
          letterSpacing: '0.1em',
          marginTop: '2px'
        }}
      >
        民族密码 奥联智造
      </div>
    </div>
  );
};