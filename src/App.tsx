import { useState } from 'react';
import TopBar from './components/TopBar';
import HotSaleBanner from './components/HotSaleBanner';
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
import TeamLeadership from './components/TeamLeadership';
import TrustBrands from './components/TrustBrands';
import Accreditations from './components/Accreditations';
import LatestNews from './components/LatestNews';
import AwardsShowcase from './components/AwardsShowcase';
import DoctorAppointment from './components/DoctorAppointment';
import LocationsAndConsultation from './components/LocationsAndConsultation';
import SocialVideoShowcase from './components/SocialVideoShowcase';
import FloatingMenu from './components/FloatingMenu';
import Footer from './components/Footer';
import ServicePageView from './components/ServicePageView';
import ExploreTreatmentsView from './components/ExploreTreatmentsView';
import NewsArticleView from './components/NewsArticleView';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import AboutAgeReversal from './components/AboutAgeReversal';
import { ShopPageView } from './components/shop/ShopPageView';
import { PricingPageView } from './components/pricing/PricingPageView';
import { Article, HeaderConfig, HeroConfig, SpecialistAreasConfig, TreatmentsConfig } from './types';
import { ShopProduct } from './types/shop';
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
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pricingCategoryFilter, setPricingCategoryFilter] = useState<string | undefined>(undefined);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopRangeFilter, setShopRangeFilter] = useState<string | undefined>(undefined);
  const [selectedShopProduct, setSelectedShopProduct] = useState<ShopProduct | null>(null);
  const [returnArticle, setReturnArticle] = useState<Article | null>(null);
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
    setIsPricingOpen(false);
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

  const handleViewOffers = () => {
    setIsExploreOpen(false);
    setIsPricingOpen(false);
    setSelectedArticle(null);
    setSelectedConsultant(null);
    setSelectedTreatment(null);
    setActiveSection('offers');
    setScrollTrigger(prev => prev + 1);
    setTimeout(() => {
      const el = document.getElementById('offers');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleActiveSectionChange = (section: string) => {
    setActiveSection(section);
    setSelectedTreatment(null);
    setSelectedArticle(null);
    setSelectedConsultant(null);
    setSelectedShopProduct(null);
    setReturnArticle(null);
    setIsExploreOpen(false);
    setIsAboutOpen(false);
    setIsPricingOpen(false);
    setIsShopOpen(false);
    setShopRangeFilter(undefined);
    setPricingCategoryFilter(undefined);
    setScrollTrigger(prev => prev + 1);
  };

  const handleOpenProduct = (product: ShopProduct) => {
    setReturnArticle(selectedArticle);
    setSelectedArticle(null);
    setSelectedConsultant(null);
    setSelectedTreatment(null);
    setIsAboutOpen(false);
    setIsExploreOpen(false);
    setIsPricingOpen(false);
    setShopRangeFilter(undefined);
    setSelectedShopProduct(product);
    setIsShopOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProduct = () => {
    if (returnArticle) {
      const articleToRestore = returnArticle;
      setIsShopOpen(false);
      setSelectedShopProduct(null);
      setReturnArticle(null);
      setSelectedArticle(articleToRestore);
      setTimeout(() => {
        const el = document.getElementById('article-recommended-products');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setSelectedShopProduct(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  }, [activeSection, scrollTrigger, selectedTreatment, selectedArticle, selectedConsultant, isExploreOpen, isShopOpen]);


  if (isAdminOpen) {
    return <AdminDashboard onBackToClinic={() => handleToggleAdmin(false)} />;
  }

  return (
    <div className="bg-silver-100 text-silver-800 antialiased min-h-screen flex flex-col relative selection:bg-rose-gold selection:text-silver-900">
      
      {/* 1. Top Informational Banner Ribbon */}
      <TopBar onBookClick={() => handleScrollToBooking()} />

      {/* Promotional Countdown Hot Sale Banner (Below Info Bar, Above Header) */}
      <HotSaleBanner onOffersClick={handleViewOffers} />

      {/* 2. Sticky Brand Header & Primary Nav */}
      <Header 
        onBookClick={(service) => handleScrollToBooking(service)} 
        onTreatmentClick={(name) => setSelectedTreatment(name)}
        activeSection={activeSection}
        setActiveSection={handleActiveSectionChange}
        headerConfig={headerConfig}
        onAboutClick={() => setIsAboutOpen(true)}
        onShopClick={(rangeFilter) => {
          setSelectedConsultant(null);
          setIsExploreOpen(false);
          setSelectedArticle(null);
          setSelectedTreatment(null);
          setIsAboutOpen(false);
          setIsPricingOpen(false);
          setReturnArticle(null);
          setSelectedShopProduct(null);
          setShopRangeFilter(rangeFilter);
          setIsShopOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPricingClick={(categoryFilter) => {
          setSelectedConsultant(null);
          setIsExploreOpen(false);
          setSelectedArticle(null);
          setSelectedTreatment(null);
          setIsAboutOpen(false);
          setIsShopOpen(false);
          setReturnArticle(null);
          setSelectedShopProduct(null);
          setPricingCategoryFilter(categoryFilter);
          setIsPricingOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
            onProductClick={handleOpenProduct}
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
        ) : isAboutOpen ? (
          <AboutAgeReversal onViewProfile={setSelectedConsultant} />
        ) : isPricingOpen ? (
          <PricingPageView
            initialCategoryFilter={pricingCategoryFilter}
            onClose={() => {
              setIsPricingOpen(false);
              setPricingCategoryFilter(undefined);
            }}
            onBookClick={handleScrollToBooking}
          />
        ) : isShopOpen ? (
          <ShopPageView
            initialRangeFilter={shopRangeFilter}
            initialSelectedProduct={selectedShopProduct}
            productBackLabel={returnArticle ? 'Article' : undefined}
            onBackFromProduct={returnArticle ? handleBackFromProduct : undefined}
            onClose={() => {
              setIsShopOpen(false);
              setShopRangeFilter(undefined);
              setSelectedShopProduct(null);
              if (returnArticle) {
                const articleToRestore = returnArticle;
                setReturnArticle(null);
                setSelectedArticle(articleToRestore);
                setTimeout(() => {
                  const el = document.getElementById('article-recommended-products');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }
            }}
            onBookClick={handleScrollToBooking}
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

            {/* Specialist Areas with Sculptural Bust Background */}
            <div className="relative overflow-hidden bg-[#faf9f8]">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8bgRX2IN0PJIId4hwyXvIXyAXymszL74AdUgStK58dFHc8-yHd7YTcqnjhsif69RjPTorG7X3K2L_bd7s4gjmN7BWOz_FKR0y4diN2rWbgdn3rsH3ormt2YNjUPPENB3P5V1pf5Vv3Opmiei3njD4hgCUAyHv5TB258eloVBqp55EW_KeB5ZpB9uITDcr9V8Hr0owysVe95b66YQbYKPz1BzX_NuBJVChJdYZxvlErr8HaxLbOY6AVAvs4gtL9k-XKw"
                  alt="Sculptural bust with pedestal in monochrome violet"
                  className="w-full h-full object-cover object-center brightness-100 contrast-105 opacity-90"
                />
                {/* Subtle, reduced whitish fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 backdrop-blur-[0.5px] pointer-events-none" />
              </div>

              <div className="relative z-10">
                <SpecialistAreas 
                  onExploreAllClick={() => setIsExploreOpen(true)}
                  onBookClick={handleScrollToBooking} 
                  onTreatmentClick={(name) => setSelectedTreatment(name)}
                  specialistAreasConfig={specialistAreasConfig}
                />
              </div>
            </div>

            {/* 5. Editorial Treatment Teasers Section (Using the luxury background) */}
            <Treatments 
              onBookClick={() => handleScrollToBooking('General Rejuvenation Consultation')} 
              onTreatmentClick={(name) => setSelectedTreatment(name)}
              treatmentsConfig={treatmentsConfig}
            />

            {/* 8. Breathtaking Interactive Before/After Gallery */}
            <div className="relative overflow-hidden bg-[#ff8656] text-slate-950 border-b border-[#e57042]">
              {/* Soft Fade Overlay (Matches Treatment component) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

              {/* Luminous Ambient Light Glow */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-white/30 rounded-full blur-3xl" />
                <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-white/25 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <BeforeAfterGallery />
              </div>
            </div>

            {/* Why Choose Us Section with App's Theme Background */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f3] via-[#f5ede1] to-[#faf7f2] border-b border-[#D8C2A3]/40">
              {/* Soft Fade Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

              {/* Luxury Ambient Light Blooms */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-[#D8C2A3]/30 via-[#ecdcc8]/20 to-transparent rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-28 w-[500px] h-[500px] bg-[#ecdcc8]/25 rounded-full blur-3xl" />
                <div className="absolute bottom-10 -left-28 w-[500px] h-[500px] bg-[#e4d2bc]/30 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <WhyChooseUs />
              </div>
            </div>       

            {/* 13.6 Awards & Recognition Auto-scrolling Section (Escapes the background for future custom styling) */}
            <AwardsShowcase />       

            {/* Our Locations and Preferred Consultation Sections from HTML request */}
            <LocationsAndConsultation 
              preselectedService={preferredService} 
              onTreatmentClick={(name) => setSelectedTreatment(name)}
            />

            {/* 10. Limited Time Promotional Banners */}
            <SpecialOffers onClaimOffer={handleClaimOffer} />

            {/* Latest from The London Clinic Section */}
            <LatestNews onArticleClick={setSelectedArticle} />
          </>
        )}
      </main>

      {/* 14.5 Social Media Reels / Video Showcase */}
      <SocialVideoShowcase />

      {/* 15. Footnotes and Sitemap */}
      <Footer />

      {/* 16. Persistent side action menu */}
      <FloatingMenu />

    </div>
  );
}
