import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIChatBot } from './components/AIChatBot';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductCenter } from './pages/products/ProductCenter';
import { ProductDetail } from './pages/products/ProductDetail';
import { SolutionCenter } from './pages/solutions/SolutionCenter';
import { SolutionDetail } from './pages/solutions/SolutionDetail';
import { ResearchCenter } from './pages/research/ResearchCenter';
import { StandardsPage } from './pages/research/StandardsPage';
import { ServicesPage } from './pages/ServicesPage';
import { NewsPage } from './pages/NewsPage';
import { AboutPage } from './pages/AboutPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Products Routes */}
            <Route path="/products" element={<ProductCenter />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            
            {/* Solutions Routes */}
            <Route path="/solutions" element={<SolutionCenter />} />
            <Route path="/solutions/:id" element={<SolutionDetail />} />
            
            {/* Research Routes */}
            <Route path="/research" element={<ResearchCenter />} />
            <Route path="/research/standards" element={<StandardsPage />} />
            <Route path="/research/:id" element={<ResearchCenter />} />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServicesPage />} />
            
            <Route path="/news" element={<NewsPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/:id" element={<AboutPage />} />
            
            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <AIChatBot />
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