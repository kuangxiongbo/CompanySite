import React, { useState, useEffect, useMemo } from 'react';
import { MegaMenu } from './MegaMenu';
import { NavItem } from '../types';
import { Menu, X, Search, Globe, User, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { OlymLogo } from './OlymLogo';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Helper to generate slugs for routing
  const toSlug = (text: string) => {
    return text.toLowerCase().replace(/[\s\/]+/g, '-').replace(/[^\w-]/g, '');
  };

  const navItems: NavItem[] = useMemo(() => {
    const s = t('header.solutionsMenu');

    // Helper: Map items to specific detail pages
    const mapItemsToDetails = (items: string[], basePath: string) => 
      items.map(label => ({ 
        label, 
        href: `${basePath}/${toSlug(language === 'zh' ? 'detail' : label)}?name=${encodeURIComponent(label)}` 
      }));

    return [
      {
        label: t('header.nav.home'),
        href: "/",
      },
      {
        label: t('header.nav.products'),
        href: "/products",
        children: [
          {
            label: language === 'zh' ? "密码基础产品类" : "Crypto Infrastructure",
            href: "/products/infrastructure",
            children: [
              { label: language === 'zh' ? "服务器密码机" : "Server HSM", href: "/products/server-hsm" },
              { label: language === 'zh' ? "云服务器密码机" : "Cloud HSM", href: "/products/cloud-hsm" },
              { label: language === 'zh' ? "签名验签服务器" : "Signature Server", href: "/products/sign-server" },
              { label: language === 'zh' ? "智能密码钥匙" : "Smart Key", href: "/products/smart-key" },
              { label: language === 'zh' ? "协同签名系统/客户端" : "Co-signature System", href: "/products/co-sign" },
              { label: language === 'zh' ? "TEE密码模块" : "TEE Crypto Module", href: "/products/tee-module" },
              { label: language === 'zh' ? "软件密码模块" : "Software Crypto Module", href: "/products/soft-module" },
              { label: language === 'zh' ? "PCI-E密码卡" : "PCI-E Crypto Card", href: "/products/pcie-card" }
            ]
          },
          {
            label: language === 'zh' ? "密码管理平台类" : "Crypto Management",
            href: "/products/management",
            children: [
              { label: language === 'zh' ? "统一密码服务平台" : "Unified Crypto Platform", href: "/products/unified-platform" },
              { label: language === 'zh' ? "密钥管理系统" : "Key Management System", href: "/products/kms" },
              { label: language === 'zh' ? "证书认证系统" : "CA System", href: "/products/ca-system" },
              { label: language === 'zh' ? "密码资源运维平台" : "Crypto Ops Platform", href: "/products/ops-platform" },
              { label: language === 'zh' ? "商用密码监管平台" : "Crypto Supervision", href: "/products/supervision" }
            ]
          },
          {
            label: language === 'zh' ? "认证与传输类" : "Auth & Transmission",
            href: "/products/auth-trans",
            children: [
              { label: language === 'zh' ? "安全接入网关" : "Secure Access Gateway", href: "/products/access-gateway" },
              { label: language === 'zh' ? "综合安全网关" : "Unified Security Gateway", href: "/products/unified-gateway" },
              { label: language === 'zh' ? "数据安全传输SSL VPN" : "SSL VPN", href: "/products/ssl-vpn" },
              { label: language === 'zh' ? "透明加密网关" : "Transparent Enc Gateway", href: "/products/transparent-gateway" },
              { label: language === 'zh' ? "安全接入终端" : "Secure Access Terminal", href: "/products/access-terminal" },
              { label: language === 'zh' ? "4G无线数据终端" : "4G Data Terminal", href: "/products/4g-terminal" }
            ]
          },
          {
            // MERGED DATA SECURITY SECTION
            label: language === 'zh' ? "数据安全类" : "Data Security",
            href: "/products/data-security",
            colSpan: 2, // Take up 2 columns in the main grid
            itemGridCols: 2, // Display children in 2 columns internally
            children: [
              // Column 1 Items
              { label: language === 'zh' ? "数据库加解密系统" : "DB Encryption", href: "/products/db-enc" },
              { label: language === 'zh' ? "数据安全服务平台" : "Data Security Platform", href: "/products/data-platform" },
              { label: language === 'zh' ? "数据脱敏与水印溯源" : "Masking & Watermarking", href: "/products/masking" },
              { label: language === 'zh' ? "隐私计算服务平台" : "Privacy Computing", href: "/products/privacy" },
              { label: language === 'zh' ? "安全存储分发系统" : "Secure Storage", href: "/products/storage" },
              { label: language === 'zh' ? "文件分发管控系统" : "File Distribution", href: "/products/file-dist" },
              // Column 2 Items (formerly Data Security II)
              { label: language === 'zh' ? "文件透明加解密系统" : "Transparent File Enc", href: "/products/file-enc" },
              { label: language === 'zh' ? "国密堡垒机" : "Bastion Host", href: "/products/bastion" },
              { label: language === 'zh' ? "视频加密服务器" : "Video Encryption", href: "/products/video-enc" },
              { label: language === 'zh' ? "加密即时通讯平台" : "Encrypted IM", href: "/products/im" },
              { label: language === 'zh' ? "邮件加密网关" : "Email Gateway", href: "/products/email-gateway" },
              { label: language === 'zh' ? "安全邮件客户端" : "Secure Email Client", href: "/products/email-client" }
            ]
          },
          {
            // NEW MERGED GROUP: IoT & Quantum
            // By wrapping them in this structure, MegaMenu will detect it and render them stacked.
            label: "IoT & Quantum", 
            href: "/products/iot",
            children: [
              { 
                label: language === 'zh' ? "物联网安全类" : "IoT Security", 
                href: "/products/iot",
                children: [
                  { label: language === 'zh' ? "视频安全产品" : "Video Security", href: "/products/video-sec" },
                  { label: language === 'zh' ? "工业互联网标识解析" : "IIoT ID Resolution", href: "/products/iiot" },
                  { label: language === 'zh' ? "物联网安全模组" : "IoT Module", href: "/products/iot-module" }
                ]
              },
              { 
                label: language === 'zh' ? "后量子系列" : "Post Quantum Series", 
                href: "/products/post-quantum",
                children: [
                  { label: language === 'zh' ? "抗量子密码机" : "PQC HSM", href: "/products/pqc-hsm" },
                  { label: language === 'zh' ? "抗量子证书认证系统" : "PQC CA", href: "/products/pqc-ca" },
                  { label: language === 'zh' ? "抗量子密钥管理系统" : "PQC KMS", href: "/products/pqc-kms" },
                  { label: language === 'zh' ? "抗量子系列产品" : "PQC Series", href: "/products/pqc-series" }
                ]
              }
            ]
          }
        ]
      },
      {
        label: t('header.nav.solutions'),
        href: "/solutions",
        children: [
          {
            label: s.gov.title,
            href: "/solutions/gov",
            children: mapItemsToDetails(s.gov.items, "/solutions")
          },
          {
            label: s.operator.title,
            href: "/solutions/operator",
            children: mapItemsToDetails(s.operator.items, "/solutions")
          },
          {
            label: s.enterprise.title,
            href: "/solutions/enterprise",
            children: mapItemsToDetails(s.enterprise.items, "/solutions")
          },
          {
            label: "industry-misc", // Internal ID for grouping
            href: "/solutions/other",
            children: [
              {
                label: s.resources.title,
                href: "/solutions/resources",
                children: mapItemsToDetails(s.resources.items, "/solutions")
              },
              {
                label: s.other.title,
                href: "/solutions/other",
                children: mapItemsToDetails(s.other.items, "/solutions")
              }
            ]
          }
        ]
      },
      {
        label: t('header.nav.research'),
        href: "/research",
        children: [
           {
             label: language === 'zh' ? "标准制定" : "Standard Formulation",
             href: "/research/standards",
             children: [
               { label: "国密标准参与", href: "/research/standards#national" },
               { label: "行业标准制定", href: "/research/standards#industry" },
               { label: "国际标准贡献", href: "/research/standards#international" }
             ]
           },
           {
             label: language === 'zh' ? "产学研用" : "Industry-University-Research",
             href: "/research/academic",
             children: [
               { label: "联合实验室", href: "/research/labs" },
               { label: "高校科研合作", href: "/research/universities" },
               { label: "科研成果转化", href: "/research/commercialization" }
             ]
           },
           {
              label: language === 'zh' ? "产业教育" : "Industry Education",
              href: "/research/education",
              children: [
                { label: "密码人才培养", href: "/research/talent" },
                { label: "技能认证培训", href: "/research/certification" },
                { label: "校企实习基地", href: "/research/internships" }
              ]
           }
        ]
      },
      {
        label: t('header.nav.services'),
        href: "/services",
        children: [
           { label: language === 'zh' ? "服务内容" : "Service Content", href: "/services/content" },
           { label: language === 'zh' ? "下载中心" : "Downloads", href: "/services/downloads" },
           { label: language === 'zh' ? "咨询规划" : "Consulting", href: "/services/consulting" },
           { label: language === 'zh' ? "培训认证" : "Training", href: "/services/training" }
        ]
      },
      {
        label: t('header.nav.about'),
        href: "/about",
        children: [
           { label: language === 'zh' ? "公司简介" : "Company Profile", href: "/about/profile" },
           { label: language === 'zh' ? "荣誉资质" : "Honors", href: "/about/honors" },
           { label: language === 'zh' ? "联系我们" : "Contact Us", href: "/about/contact" }
        ]
      }
    ];
  }, [language, t]);

  // Determine logo variant based on scroll and mobile state
  const logoVariant = (isScrolled || mobileMenuOpen) ? 'dark' : 'light';

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled || mobileMenuOpen 
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
            <Button variant="primary" size="sm" className="rounded-md font-bold text-sm px-5 hover:shadow-[0_0_15px_rgba(0,177,64,0.4)] transition-all">
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
                 <Link to={item.href} className="text-gray-900 text-lg font-bold w-full text-left flex justify-between items-center">
                   {item.label}
                   <ChevronRight size={16} className="text-gray-400" />
                 </Link>
                 {item.children && item.children.length > 0 && (
                   <div className="pl-4 mt-3 space-y-3">
                      {item.children.map(child => (
                        <div key={child.label}>
                           <Link to={child.href} className="block text-gray-600 font-medium text-sm py-1 hover:text-ibc-brand">{child.label}</Link>
                           {child.children && (
                             <div className="pl-4 mt-1 border-l border-gray-200">
                               {child.children.map(sub => (
                                 <Link key={sub.label} to={sub.href} className="block text-gray-500 text-xs py-1 hover:text-gray-900">{sub.label}</Link>
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
              <Button variant="primary" className="w-full justify-center py-4 font-bold text-lg">{t('header.contactSales')}</Button>
              <Button variant="secondary" className="w-full justify-center border border-gray-200 py-4 font-bold text-lg text-white bg-gray-900">{t('header.signIn')}</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};