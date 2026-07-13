import { useState } from 'react';
import TopBar from './components/TopBar';
import Header from './components/Header';
import Hero from './components/Hero';
import SpecialistAreas from './components/SpecialistAreas';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import Treatments from './components/Treatments';
import Process from './components/Process';
import FacilityInteriors from './components/FacilityInteriors';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import Testimonials from './components/Testimonials';
import SpecialOffers from './components/SpecialOffers';
import SkincareCollection from './components/SkincareCollection';
import TeamLeadership from './components/TeamLeadership';
import TrustBrands from './components/TrustBrands';
import Accreditations from './components/Accreditations';
import LatestNews from './components/LatestNews';
import AwardsShowcase from './components/AwardsShowcase';
import DoctorAppointment from './components/DoctorAppointment';
import LocationsAndConsultation from './components/LocationsAndConsultation';
import FloatingMenu from './components/FloatingMenu';
import Footer from './components/Footer';
import ServicePageView from './components/ServicePageView';
import ExploreTreatmentsView from './components/ExploreTreatmentsView';
import NewsArticleView from './components/NewsArticleView';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import { Article, HeaderConfig, HeroConfig, SpecialistAreasConfig, TreatmentsConfig } from './types';
import { useEffect } from 'react';
import { getHeaderConfig, getHeroConfig, getSpecialistAreasConfig, getTreatmentsConfig } from './lib/adminStore';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [preferredService, setPreferredService] = useState<string>('');
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  // Dynamic homepage configs
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>(() => getHeaderConfig());
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(() => getHeroConfig());
  const [specialistAreasConfig, setSpecialistAreasConfig] = useState<SpecialistAreasConfig>(() => getSpecialistAreasConfig());
  const [treatmentsConfig, setTreatmentsConfig] = useState<TreatmentsConfig>(() => getTreatmentsConfig());

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };
    
    checkHash();
    
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    if (!isAdminOpen) {
      setHeaderConfig(getHeaderConfig());
      setHeroConfig(getHeroConfig());
      setSpecialistAreasConfig(getSpecialistAreasConfig());
      setTreatmentsConfig(getTreatmentsConfig());
    }
  }, [isAdminOpen]);

  const handleToggleAdmin = (open: boolean) => {
    setIsAdminOpen(open);
    if (open) {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
      // Return to main clinic site cleanly
      setActiveSection('home');
    }
  };

  const handleScrollToBooking = (serviceName?: string) => {
    setIsExploreOpen(false);
    setSelectedArticle(null);
    setSelectedConsultant(null);
    if (serviceName) {
      setPreferredService(serviceName);
    }
    const element = document.getElementById('preferred-consultation') || document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection('preferred-consultation');
  };

  const handleClaimOffer = (offerTitle: string) => {
    // Translate offer to a general booking topic
    const mappedService = offerTitle.includes('Beauty') 
      ? 'Anti-Aging' 
      : 'General Rejuvenation Consultation';
    handleScrollToBooking(mappedService);
  };

  const handleActiveSectionChange = (section: string) => {
    setActiveSection(section);
    setSelectedTreatment(null);
    setSelectedArticle(null);
    setSelectedConsultant(null);
    setIsExploreOpen(false);
    setScrollTrigger(prev => prev + 1);
  };

  // Robust scroll behavior when clicking navigation sections
  useEffect(() => {
    if (activeSection) {
      const scrollTimer = setTimeout(() => {
        const element = activeSection === 'home'
          ? document.getElementById('home') || document.body
          : document.getElementById(activeSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [activeSection, scrollTrigger, selectedTreatment, selectedArticle, selectedConsultant, isExploreOpen]);


  if (isAdminOpen) {
    return <AdminDashboard onBackToClinic={() => handleToggleAdmin(false)} />;
  }

  return (
    <div className="bg-silver-100 text-silver-800 antialiased min-h-screen flex flex-col relative selection:bg-rose-gold selection:text-silver-900">
      
      {/* 1. Top Informational Banner Ribbon */}
      <TopBar onBookClick={() => handleScrollToBooking()} />

      {/* 2. Sticky Brand Header & Primary Nav */}
      <Header 
        onBookClick={(service) => handleScrollToBooking(service)} 
        onTreatmentClick={(name) => setSelectedTreatment(name)}
        activeSection={activeSection}
        setActiveSection={handleActiveSectionChange}
        headerConfig={headerConfig}
      />

      <main className="flex-grow">
        {selectedConsultant ? (
          <ProfilePage
            authorName={selectedConsultant}
            onClose={() => setSelectedConsultant(null)}
            onBookClick={() => handleScrollToBooking()}
          />
        ) : isExploreOpen ? (
          <ExploreTreatmentsView
            onClose={() => setIsExploreOpen(false)}
            onBookClick={handleScrollToBooking}
            onTreatmentClick={(name) => {
              setIsExploreOpen(false);
              setSelectedTreatment(name);
            }}
          />
        ) : selectedArticle ? (
          <NewsArticleView 
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onBookClick={() => handleScrollToBooking()}
            onArticleClick={setSelectedArticle}
            onViewProfile={() => setSelectedConsultant(selectedArticle.author)}
          />
        ) : selectedTreatment ? (
          <ServicePageView
            treatmentName={selectedTreatment}
            onClose={() => setSelectedTreatment(null)}
            onBook={(service) => {
              setSelectedTreatment(null);
              handleScrollToBooking(service);
            }}
          />
        ) : (
          <>
            {/* 3. Hero Presentation Section */}
            <Hero 
              onBookClick={() => handleScrollToBooking()} 
              onExploreClick={() => {
                const el = document.getElementById('specialist-areas');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                setActiveSection('specialist-areas');
              }}
              heroConfig={heroConfig}
            />

            {/* Specialist Areas Section from uploaded image */}
            <SpecialistAreas 
              onExploreAllClick={() => setIsExploreOpen(true)}
              onBookClick={handleScrollToBooking} 
              onTreatmentClick={(name) => setSelectedTreatment(name)}
              specialistAreasConfig={specialistAreasConfig}
            />

            {/* 5. Editorial Treatment Teasers Section */}
            <Treatments 
              onBookClick={() => handleScrollToBooking('General Rejuvenation Consultation')} 
              onTreatmentClick={(name) => setSelectedTreatment(name)}
              treatmentsConfig={treatmentsConfig}
            />

            {/* 8. Breathtaking Interactive Before/After Gallery */}
            <BeforeAfterGallery />

            {/* Why Choose Us Section */}
            <WhyChooseUs />

            {/* 13.6 Awards & Recognition Auto-scrolling Section */}
            <AwardsShowcase />       

            {/* Our Locations and Preferred Consultation Sections from HTML request */}
            <LocationsAndConsultation 
              preselectedService={preferredService} 
              onTreatmentClick={(name) => setSelectedTreatment(name)}
            />

            {/* 12. Corporate Leadership & Team Board */}
            <TeamLeadership onViewProfile={setSelectedConsultant} />

            {/* 6. Dynamic Process Steps (Journey) */}
            <Process />

            {/* 7. Facility Interiors tour */}
            <FacilityInteriors />

            {/* 9. Star Reviews / Testimonials segment */}
            <Testimonials />

            {/* 10. Limited Time Promotional Banners */}
            <SpecialOffers onClaimOffer={handleClaimOffer} />

            {/* 11. Skincare Essentials Shop Collection */}
            <SkincareCollection />

            {/* 13. Brand Trust Indicator Line */}
            <TrustBrands />

            {/* 13.5 Accreditations & Certifications Section */}
            <Accreditations />

            {/* Latest from The London Clinic Section */}
            <LatestNews onArticleClick={setSelectedArticle} />
          </>
        )}
      </main>

      {/* 15. Footnotes and Sitemap */}
      <Footer />

      {/* 16. Persistent side action menu */}
      <FloatingMenu />

    </div>
  );
}
