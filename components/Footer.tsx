import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { OlymLogo } from './OlymLogo';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const columns = t('footer.columns');
  const [icp, setIcp] = React.useState('');

  React.useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        if (data.site_icp) setIcp(data.site_icp);
      })
      .catch(() => { });
  }, []);

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <div className="opacity-90 hover:opacity-100 transition-opacity">
                <OlymLogo className="h-14 w-auto" variant="light" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-ibc-brand hover:text-white transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Columns */}
          {columns && Object.values(columns).map((col: any, idx: number) => (
            <div key={idx}>
              <h4 className="font-bold text-lg mb-6 text-gray-200">{col.title}</h4>
              <ul className="space-y-3">
                {col.items.map((item: any, i: number) => (
                  <li key={i}>
                    <Link to={item.href} className="text-gray-500 hover:text-ibc-brand transition-colors text-sm">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>
            © 2025 OLYM Networks, Inc. {t('footer.rights')}
            {icp && <span className="ml-4 hover:text-white transition-colors cursor-pointer">{icp}</span>}
          </p>
          <div className="flex items-center mt-4 md:mt-0 space-x-6">
            <button className="flex items-center hover:text-white transition-colors">
              <Globe size={16} className="mr-2" /> {language === 'zh' ? '全球 - 中文' : 'Global - English'}
            </button>
            <Link to="#" className="hover:text-white">{t('footer.manageCookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};