import React, { useState, useEffect, useMemo } from 'react';
import { MegaMenu } from './MegaMenu';
import { NavItem } from '../types';
import { Menu, X, Search, Globe, User, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { OlymLogo } from './OlymLogo';
import { Link, useLocation } from 'react-router-dom';
import { ContactModal } from './ContactModal';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Helper to generate slugs for routing (used only for fallback)
  const toSlug = (text: string) => {
    return text.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^\w-]/g, '');
  };

  const fallbackNavItems: NavItem[] = useMemo(() => {
    const s = t('header.solutionsMenu');
    const p: any = t('products.categories');

    // Fallback URL format uses detail page paths based on Chinese name slug 
    const mapProductItems = (items: string[]): NavItem[] =>
      items.map(label => ({
        label,
        href: `/products/${toSlug(language === 'zh' ? 'detail' : label)}?name=${encodeURIComponent(label)}`
      }));

    const mapSolutionItems = (items: string[]): NavItem[] =>
      items.map(label => ({
        label,
        href: `/solutions/${toSlug(language === 'zh' ? 'detail' : label)}?name=${encodeURIComponent(label)}`
      }));

    return [
      { label: t('header.nav.home'), href: "/" },
      {
        label: t('header.nav.products'), href: "/products",
        children: [
          { label: p.cryptography.title, href: "/products?category=infrastructure", children: mapProductItems(p.cryptography.items) },
          { label: p.management.title, href: "/products?category=management", children: mapProductItems(p.management.items) },
          { label: p.authTrans.title, href: "/products?category=auth", children: mapProductItems(p.authTrans.items) },
          { label: p.data.title, href: "/products?category=data-security", children: mapProductItems(p.data.items) },
          { label: p.iot.title, href: "/products?category=iot", children: mapProductItems(p.iot.items) },
          { label: p.postQuantum.title, href: "/products?category=quantum", children: mapProductItems(p.postQuantum.items) },
        ]
      },
      {
        label: t('header.nav.solutions'), href: "/solutions",
        children: [
          { label: s.gov.title, href: "/solutions?category=gov", children: mapSolutionItems(s.gov.items) },
          { label: s.operator.title, href: "/solutions?category=operator", children: mapSolutionItems(s.operator.items) },
          { label: s.enterprise.title, href: "/solutions?category=enterprise", children: mapSolutionItems(s.enterprise.items) },
          { label: s.resources?.title || "自然资源安全", href: "/solutions?category=resources", children: mapSolutionItems(s.resources?.items || []) },
          { label: s.other?.title || "其他行业安全", href: "/solutions?category=other", children: mapSolutionItems(s.other?.items || []) },
        ]
      },
      {
        label: t('header.nav.research'), href: "/research",
        children: [
          { label: language === 'zh' ? "标准制定" : "Standards", href: "/research/standards" },
          { label: language === 'zh' ? "产学研用" : "Industry-University-Research", href: "/research/industry-university" },
          { label: language === 'zh' ? "产业教育" : "Industrial Education", href: "/research/education" },
        ]
      },
      {
        label: t('header.nav.services'), href: "/services",
        children: [
          { label: language === 'zh' ? "服务内容" : "Service Content", href: "/services/content" },
          { label: language === 'zh' ? "下载中心" : "Download Center", href: "/services/downloads" },
        ]
      },
      {
        label: t('header.nav.about'), href: "/about",
        children: [
          { label: language === 'zh' ? "最新动态" : "News", href: "/about/news" },
          { label: language === 'zh' ? "关于奥联" : "About OLYM", href: "/about/profile" },
          { label: language === 'zh' ? "发展历程" : "History", href: "/about/history" },
          { label: language === 'zh' ? "荣誉资质" : "Honors", href: "/about/honors" },
          { label: language === 'zh' ? "招贤纳士" : "Careers", href: "/about/careers" },
          { label: language === 'zh' ? "联系我们" : "Contact Us", href: "/about/contact" },
        ]
      },
    ];
  }, [language, t]);

  const [dynamicNavItems, setDynamicNavItems] = useState<NavItem[] | null>(null);

  useEffect(() => {
    fetch('/api/menus')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const mapDynamicItems = (items: any[]): NavItem[] => {
            return items.map((item: any) => {
              const label = item.title[language] || item.title.zh || 'Title';
              let href = item.href || '#';

              // Preference: If item has a custom href set (not # or empty), we trust it.
              // Otherwise, we generate it from linkedPage if available.
              const isCustomHref = item.href && item.href !== '#' && item.href !== '';

              if (!isCustomHref && item.linkedPage) {
                const pageCategory = item.linkedPage.type === 'product' ? 'products' :
                  item.linkedPage.type === 'solution' ? 'solutions' : 'pages';
                const pageSlug = item.linkedPage.slug;
                const pageTitle = item.linkedPage.title[language] || item.linkedPage.title.zh || label;
                href = `/${pageCategory}/${pageSlug}?name=${encodeURIComponent(pageTitle)}`;
              }

              return {
                label,
                href,
                featured: item.config?.featured ? {
                  title: item.config.featured.title || '',
                  description: item.config.featured.description || '',
                  image: item.config.featured.image || '',
                  linkText: item.config.featured.linkText || '',
                  href: item.config.featured.href || href || '#'
                } : undefined,
                children: item.children && item.children.length > 0 ? mapDynamicItems(item.children) : undefined
              };
            });
          };
          setDynamicNavItems(mapDynamicItems(data));
        }
      })
      .catch(err => console.error("Failed to load dynamic menus", err));
  }, [language]);

  const navItems = dynamicNavItems && dynamicNavItems.length > 0 ? dynamicNavItems : fallbackNavItems;

  // Logo: white+green at top, black+green after scroll
  const logoVariant = (isScrolled || mobileMenuOpen) ? 'dark' : 'light';

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled || mobileMenuOpen
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 shadow-md'
        : 'bg-transparent border-b border-transparent py-6 bg-gradient-to-b from-black/70 via-black/20 to-transparent'
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Updates based on background */}
          <Link to="/" className="flex-shrink-0 flex items-center z-50 cursor-pointer group h-full">
            <OlymLogo className="h-10 md:h-12 w-auto" variant={logoVariant} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:block h-full ml-10">
            {/* Pass isScrolled to change text color in MegaMenu if needed, but MegaMenu controls its own hover state usually. 
                We might need to adjust MegaMenu text color prop based on header bg.
            */}
            <MegaMenu items={navItems} darkText={isScrolled} />
          </div>

          {/* Utilities */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-ibc-brand transition-colors p-2`}><Search size={20} /></button>
            <button
              onClick={toggleLanguage}
              className={`${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-ibc-brand transition-colors p-2 flex items-center font-bold text-xs`}
            >
              <Globe size={20} className="mr-1" />
              {language === 'zh' ? 'EN' : '中文'}
            </button>
            <button className={`flex items-center ${isScrolled ? 'text-gray-700' : 'text-white'} hover:text-ibc-brand transition-colors font-bold text-sm px-3`}>
              <User size={18} className="mr-2" /> {t('header.signIn')}
            </button>
            <Button onClick={() => setIsContactModalOpen(true)} variant="primary" size="sm" className="rounded-md font-bold text-sm px-5 hover:shadow-[0_0_15px_rgba(0,177,64,0.4)] transition-all">
              {t('header.contactSales')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center z-50 space-x-4">
            <button onClick={toggleLanguage} className={`${isScrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'} font-bold text-sm`}>
              {language === 'zh' ? 'EN' : '中'}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`${isScrolled || mobileMenuOpen ? 'text-gray-900' : 'text-white'} p-2`}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white pt-24 px-6 overflow-y-auto z-40 animate-in slide-in-from-right-10 duration-200">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100 pb-4">
                <Link
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-900 text-lg font-bold w-full text-left flex justify-between items-center"
                >
                  {item.label}
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="pl-4 mt-3 space-y-3">
                    {item.children.map(child => (
                      <div key={child.label}>
                        <Link
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-gray-600 font-medium text-sm py-1 hover:text-ibc-brand"
                        >
                          {child.label}
                        </Link>
                        {child.children && (
                          <div className="pl-4 mt-1 border-l border-gray-200">
                            {child.children.map(sub => (
                              <Link
                                key={sub.label}
                                to={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-gray-500 text-xs py-1 hover:text-gray-900"
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 space-y-4 pb-12">
              <Button onClick={() => { setMobileMenuOpen(false); setIsContactModalOpen(true); }} variant="primary" className="w-full justify-center py-4 font-bold text-lg">{t('header.contactSales')}</Button>
              <Button variant="secondary" className="w-full justify-center border border-gray-200 py-4 font-bold text-lg text-white bg-gray-900">{t('header.signIn')}</Button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type="consultation"
      />
    </header>
  );
};