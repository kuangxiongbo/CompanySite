import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { LanguageProvider } from './contexts/LanguageContext';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProductCenter } from './pages/products/ProductCenter';
import { ProductDetail } from './pages/products/ProductDetail';
import { SolutionCenter } from './pages/solutions/SolutionCenter';
import { SolutionDetail } from './pages/solutions/SolutionDetail';
import { ResearchCenter } from './pages/research/ResearchCenter';
import { StandardsPage } from './pages/research/StandardsPage';
import { IndustryUniversityPage } from './pages/research/IndustryUniversityPage';
import { EducationPage } from './pages/research/EducationPage';
import { ServicesPage } from './pages/ServicesPage';
import { DownloadPage } from './pages/DownloadPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { AboutPage } from './pages/AboutPage';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MenuManager } from './pages/admin/MenuManager';
import { PageManager } from './pages/admin/PageManager';
import { NewsManager } from './pages/admin/NewsManager';
import { DownloadManager } from './pages/admin/DownloadManager';
import { LeadManager } from './pages/admin/LeadManager';
import {
  SiteSettings,
  EmailSettings,
  AiSettings,
  ThemeSettings,
  OperationLogs
} from './pages/admin/SettingsPages';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname, search]);
  return null;
};

// Wrapper for public pages (with header/footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
    <AIChatBot />
  </>
);

const AppContent = () => {
  React.useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(config => {
        if (config.site_name) {
          document.title = config.site_name;
        }
        if (config.site_theme) {
          let brandColor = '#00B140'; // OLYM green (default)
          if (config.site_theme === 'blue') brandColor = '#0ea5e9';
          else if (config.site_theme === 'dark') brandColor = '#6366f1';
          else if (config.site_theme === 'green') brandColor = '#10b981';
          else if (config.site_theme === 'purple') brandColor = '#8b5cf6';
          else if (config.site_theme === 'red') brandColor = '#ef4444';
          // Update root CSS variable
          document.documentElement.style.setProperty('--ibc-brand', brandColor);
        }
      })
      .catch(err => console.error("Failed to fetch public site config", err));
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <Routes>
          {/* Admin Routes - no header/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menus" element={<MenuManager />} />
            <Route path="pages" element={<PageManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="downloads" element={<DownloadManager />} />
            <Route path="leads" element={<LeadManager />} />
            <Route path="users" element={<div className="p-8 text-gray-400">账号管理 (即将上线)</div>} />
            <Route path="settings/site" element={<SiteSettings />} />
            <Route path="settings/email" element={<EmailSettings />} />
            <Route path="settings/ai" element={<AiSettings />} />
            <Route path="settings/theme" element={<ThemeSettings />} />
            <Route path="settings/logs" element={<OperationLogs />} />
          </Route>

          {/* Public Routes - with header/footer */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><ProductCenter /></PublicLayout>} />
          <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
          <Route path="/solutions" element={<PublicLayout><SolutionCenter /></PublicLayout>} />
          <Route path="/solutions/:id" element={<PublicLayout><SolutionDetail /></PublicLayout>} />
          <Route path="/research" element={<PublicLayout><StandardsPage /></PublicLayout>} />
          <Route path="/research/standards" element={<PublicLayout><StandardsPage /></PublicLayout>} />
          <Route path="/research/industry-university" element={<PublicLayout><IndustryUniversityPage /></PublicLayout>} />
          <Route path="/research/education" element={<PublicLayout><EducationPage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/services/content" element={<PublicLayout><ServicesPage /></PublicLayout>} />
          <Route path="/services/downloads" element={<PublicLayout><DownloadPage /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><NewsPage /></PublicLayout>} />
          <Route path="/news/:newsId" element={<PublicLayout><NewsDetailPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/about/:id" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;