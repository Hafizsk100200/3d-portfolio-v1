import { useEffect, useState } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';
import Scroll3DCanvas from './components/Scroll3DCanvas';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'contact'>('home');
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  useEffect(() => {
    if (!isIntroFinished) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isIntroFinished]);

  useEffect(() => {
    // Force browser to ignore previous scroll memory on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleHashChange = () => {
      const hash = window.location.hash || window.location.pathname;
      if (hash.includes('contact')) {
        setCurrentPage('contact');
        window.scrollTo(0, 0);
      } else {
        const isHome = currentPage === 'home';
        setCurrentPage('home');
        
        // Extract raw anchor hash (e.g. #about)
        const activeHash = window.location.hash;
        if (activeHash && activeHash !== '#') {
          // If we just navigated from contact to home, wait a tiny bit for the DOM to mount
          setTimeout(() => {
            const target = document.querySelector(activeHash);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }, isHome ? 0 : 250);
        } else if (!isHome) {
          window.scrollTo(0, 0);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    
    // Check initial hash/path
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [currentPage]);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <main className="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip font-sans antialiased selection:bg-[#B600A8]/20 selection:text-white">
        <LoadingScreen onFinished={() => setIsIntroFinished(true)} />
        {currentPage === 'home' ? (
          <>
            {/* Scroll-controlled fixed background 3D Canvas */}
            <Scroll3DCanvas isIntroFinished={isIntroFinished} />

            {/* Vertical scroll progress indicator */}
            <ScrollProgress isIntroFinished={isIntroFinished} />

            {/* 1. Hero Section */}
            <HeroSection isIntroFinished={isIntroFinished} />

            {/* 2. Marquee Section */}
            <MarqueeSection />

            {/* 3. About Section */}
            <AboutSection />

            {/* 4. Services Section */}
            <ServicesSection />

            {/* 5. Projects Section */}
            <ProjectsSection />

            {/* 6. Footer Credits Section */}
            <Footer showCTA={true} />
          </>
        ) : (
          <>
            {/* Dedicated Contact page view */}
            <ContactSection />

            {/* Clean Footer under contact form */}
            <Footer />
          </>
        )}
      </main>
    </ReactLenis>
  );
}

export default App;
