import React, { useState, useRef } from 'react';
import { NavItem } from '../types';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  items: NavItem[];
  darkText?: boolean;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ items, darkText = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(label);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100); // Slightly faster exit for snappier feel
  };

  // Helper to determine total grid columns based on child colSpans with responsive classes
  const getGridCols = (item: NavItem) => {
    if (item.featured) return 'grid-cols-2 xl:grid-cols-4';

    // Custom logic for specific menus
    if (item.label.includes('Research') || item.label.includes('研究')) return 'grid-cols-1 lg:grid-cols-3 gap-x-20';
    if (item.label.includes('Support') || item.label.includes('支持')) return 'grid-cols-2 lg:grid-cols-4 gap-x-12';

    // Calculate total columns based on colSpan properties
    if (item.children) {
      const totalSpans = item.children.reduce((acc, child) => acc + (child.colSpan || 1), 0);

      // Responsive grid logic:
      // On LG (1024px), reduce columns to prevent squashing.
      // On XL (1280px), use full columns.

      if (totalSpans >= 6) return 'grid-cols-3 xl:grid-cols-6'; // Rare case
      if (totalSpans === 5) return 'grid-cols-3 xl:grid-cols-5';
      if (totalSpans === 4) return 'grid-cols-2 xl:grid-cols-4'; // 2x2 on LG, 1x4 on XL
      if (totalSpans === 3) return 'grid-cols-3';
      if (totalSpans === 2) return 'grid-cols-2';
    }

    return 'grid-cols-3'; // Default fallback
  };

  return (
    <nav className="hidden lg:flex h-full items-center">
      {items.map((item) => {
        const isActive = activeMenu === item.label;
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.label}
            className="h-full flex items-center group/navitem"
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={item.href}
              className={`
                px-5 h-full flex items-center text-[15px] font-medium tracking-wide transition-colors duration-200 relative z-10
                ${isActive
                  ? (darkText ? 'text-ibc-brand' : 'text-white') // Active State text color
                  : (darkText ? 'text-gray-700 hover:text-ibc-brand' : 'text-gray-200 hover:text-white') // Inactive State
                }
              `}
            >
              <span className="flex items-center">
                {item.label}
                {/* Subtle Chevron that rotates on Hover */}
                {hasChildren && (
                  <ChevronDown
                    size={14}
                    strokeWidth={3}
                    className={`ml-1.5 transition-transform duration-300 ${isActive ? 'rotate-180' : 'rotate-0 opacity-70 group-hover/navitem:opacity-100'}`}
                  />
                )}
              </span>

              {/* High-End Bottom Indicator Line */}
              <span className={`absolute bottom-0 left-0 w-full h-[3px] bg-ibc-brand transform transition-all duration-300 ease-out origin-center ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                }`}></span>
            </Link>

            {/* Mega Menu Dropdown */}
            {isActive && hasChildren && (
              <div
                className="fixed left-0 right-0 top-[88px] z-50 text-white animate-in fade-in slide-in-from-top-2 duration-300"
                style={{ width: '100vw' }}
              >
                {/* Main Content Container - Dark Theme (Palo Alto Style) */}
                <div className="bg-[#121212]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-white/10">
                  {/* Inner Content with Max Width */}
                  <div className="max-w-[1440px] mx-auto flex min-h-[280px] max-h-[85vh] overflow-y-auto">
                    {/* Links Grid */}
                    <div className={`flex-1 py-12 px-8 grid gap-8 ${getGridCols(item)}`}>
                      {item.children?.map((child) => {
                        // Check if this column is a "Grouped Column" (contains stacked sections)
                        // Heuristic: If the first child of this column HAS children, it's likely a section header, not a direct link.
                        const isGroupedColumn = child.children && child.children.length > 0 && child.children[0].children;

                        return (
                          <div
                            key={child.label}
                            className={`space-y-6 ${child.colSpan ? `col-span-${child.colSpan}` : 'col-span-1'}`}
                          >
                            {isGroupedColumn ? (
                              /* Case 1: Stacked Sections (e.g. IoT & Quantum in one column) */
                              <div className="flex flex-col gap-8">
                                {child.children?.map((section) => (
                                  <div key={section.label} className="break-inside-avoid">
                                    {/* Section Header */}
                                    <div className="mb-4 pb-2 border-b-2 border-ibc-brand inline-block pr-8">
                                      <h4 className="font-bold text-[15px] text-white tracking-wide uppercase">
                                        {section.label}
                                      </h4>
                                    </div>
                                    {/* Section Links */}
                                    <ul className="space-y-3">
                                      {section.children?.map((sub) => (
                                        <li key={sub.label} className="flex items-start">
                                          <Link
                                            to={sub.href}
                                            onClick={() => setActiveMenu(null)}
                                            className="group block text-[14px] font-normal text-gray-400 hover:text-white transition-colors leading-relaxed hover:translate-x-1 duration-200"
                                          >
                                            {sub.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Case 2: Standard Column */
                              <>
                                {/* Column Header */}
                                <div className="mb-6">
                                  <h4 className={`font-bold text-[16px] inline-block pb-2 border-b-2 border-ibc-brand pr-6 text-white tracking-wide`}>
                                    {child.label}
                                  </h4>
                                </div>

                                {child.children ? (
                                  /* Standard Link List or Internal Grid */
                                  <ul className={`grid gap-x-8 gap-y-3 ${child.itemGridCols ? `grid-cols-${child.itemGridCols}` : 'grid-cols-1'}`}>
                                    {child.children.map((sub) => (
                                      <li key={sub.label}>
                                        <Link
                                          to={sub.href}
                                          onClick={() => setActiveMenu(null)}
                                          className="group flex items-start text-[14px] text-gray-400 hover:text-white transition-colors duration-200"
                                        >
                                          {/* Bullet Point that lights up on hover */}
                                          <div className="mt-1.5 mr-2 w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-ibc-brand transition-colors flex-shrink-0" />
                                          <span className="leading-relaxed">{sub.label}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <Link
                                    to={child.href}
                                    onClick={() => setActiveMenu(null)}
                                    className="text-sm font-bold text-ibc-brand hover:text-green-400 flex items-center mt-2 group"
                                  >
                                    查看详情 <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Featured Column - Visual Richness */}
                    {item.featured && (
                      <div className="w-[380px] bg-[#1A1A1A] p-10 border-l border-white/5 flex flex-col justify-start flex-shrink-0 relative overflow-hidden group/featured">
                        {/* Background Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-ibc-brand/5 rounded-full blur-3xl pointer-events-none"></div>

                        <h4 className="text-xs font-bold text-ibc-brand uppercase tracking-[0.2em] mb-6">Featured</h4>

                        <div className="cursor-pointer">
                          <div className="overflow-hidden rounded-lg mb-6 shadow-2xl border border-white/10 aspect-video relative">
                            <img
                              src={item.featured.image}
                              alt={item.featured.title}
                              className="w-full h-full object-cover transform group-hover/featured:scale-105 transition-transform duration-700 opacity-90 group-hover/featured:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className="px-2 py-1 bg-ibc-brand text-white text-[10px] font-bold rounded uppercase">New</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-xl text-white mb-3 group-hover/featured:text-ibc-brand transition-colors leading-snug">
                            {item.featured.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                            {item.featured.description}
                          </p>
                          <span className="inline-flex items-center text-sm font-bold text-white group-hover/featured:text-ibc-brand transition-colors border-b border-white/20 pb-0.5 group-hover/featured:border-ibc-brand">
                            {item.featured.linkText} <ChevronRight size={14} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

// Helper component for arrow if needed internally, though Lucide icons are used directly
const ArrowRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);