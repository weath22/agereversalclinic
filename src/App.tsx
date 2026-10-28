import { useState, useEffect, lazy, Suspense } from 'react';
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
import StayInformed from './components/StayInformed';
import SocialVideoShowcase from './components/SocialVideoShowcase';
import FloatingMenu from './components/FloatingMenu';
import Footer from './components/Footer';
import ClinicalSEOHead from './components/ClinicalSEOHead';
import { UniversalCartDrawer } from './components/shop/ShopCartDrawer';
import { TreatmentCartDrawer } from './components/pricing/TreatmentCartDrawer';
import { Article, HeaderConfig, HeroConfig, SpecialistAreasConfig, TreatmentsConfig } from './types';
import { ShopProduct } from './types/shop';
import { getHeaderConfig, getHeroConfig, getSpecialistAreasConfig, getTreatmentsConfig, getTreatmentDetailsConfig } from './lib/adminStore';
import PageLoadingFallback from './components/common/PageLoadingFallback';

// Task 1.1: Dynamic Lazy Imports for Heavy Route Views
const ServicePageView = lazy(() => import('./components/ServicePageView'));
const ExploreTreatmentsView = lazy(() => import('./components/ExploreTreatmentsView'));
const NewsArticleView = lazy(() => import('./components/NewsArticleView'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AboutAgeReversal = lazy(() => import('./components/AboutAgeReversal'));
const ShopPageView = lazy(() => import('./components/shop/ShopPageView'));
const PricingPageView = lazy(() => import('./components/pricing/PricingPageView'));
const TransformationsPageView = lazy(() => import('./components/transformations/TransformationsPageView'));
const ReviewsPageView = lazy(() => import('./components/reviews/ReviewsPageView'));

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
  const [isTransformationsOpen, setIsTransformationsOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [shopRangeFilter, setShopRangeFilter] = useState<string | undefined>(undefined);
  const [selectedShopProduct, setSelectedShopProduct] = useState<ShopProduct | null>(null);
  const [returnArticle, setReturnArticle] = useState<Article | null>(null);
  const [returnToTransformations, setReturnToTransformations] = useState(false);
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

      if (window.location.hash === '#reviews') {
        setIsReviewsOpen(true);
      }
    };
    
    checkHash();
    
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const syncConfigs = () => {
      setHeaderConfig(getHeaderConfig());
      setHeroConfig(getHeroConfig());
      setSpecialistAreasConfig(getSpecialistAreasConfig());
      setTreatmentsConfig(getTreatmentsConfig());
    };
    if (!isAdminOpen) {
      syncConfigs();
    }
    window.addEventListener('master_services_updated', syncConfigs);
    window.addEventListener('treatment_pricing_updated', syncConfigs);
    window.addEventListener('treatment_taxonomy_updated', syncConfigs);
    window.addEventListener('storage', syncConfigs);
    return () => {
      window.removeEventListener('master_services_updated', syncConfigs);
      window.removeEventListener('treatment_pricing_updated', syncConfigs);
      window.removeEventListener('treatment_taxonomy_updated', syncConfigs);
      window.removeEventListener('storage', syncConfigs);
    };
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
    setIsTransformationsOpen(false);
    setIsReviewsOpen(false);
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
    setIsTransformationsOpen(false);
    setIsReviewsOpen(false);
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
    setReturnToTransformations(false);
    setIsExploreOpen(false);
    setIsAboutOpen(false);
    setIsPricingOpen(false);
    setIsTransformationsOpen(false);
    setIsReviewsOpen(false);
    setIsShopOpen(false);
    setShopRangeFilter(undefined);
    setPricingCategoryFilter(undefined);
    setScrollTrigger(prev => prev + 1);
  };

  const handleOpenReviews = () => {
    setSelectedConsultant(null);
    setIsExploreOpen(false);
    setSelectedArticle(null);
    setSelectedTreatment(null);
    setIsAboutOpen(false);
    setIsShopOpen(false);
    setIsPricingOpen(false);
    setIsTransformationsOpen(false);
    setReturnArticle(null);
    setSelectedShopProduct(null);
    setIsReviewsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: ShopProduct, fromTransformations = false) => {
    if (fromTransformations) {
      setReturnToTransformations(true);
      setIsTransformationsOpen(false);
    }
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
    if (returnToTransformations) {
      setIsShopOpen(false);
      setSelectedShopProduct(null);
      setReturnToTransformations(false);
      setIsTransformationsOpen(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (returnArticle) {
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


  // Dynamic SEO metadata based on current active view
  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  let seoImage: string | undefined;
  let seoPath = '';

  if (selectedConsultant) {
    seoTitle = `${selectedConsultant} | Medical Consultant`;
    seoDescription = `Consultant profile, clinical qualifications, and medical specialties for ${selectedConsultant} at Age Reversal Clinics.`;
    seoPath = `#consultant-${selectedConsultant.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  } else if (isTransformationsOpen) {
    seoTitle = 'Before & After Transformations | Clinical Case Results';
    seoDescription = 'Explore verified patient before and after results, clinical protocols, and recommended skincare regimens at Age Reversal Clinics.';
    seoPath = '#transformations';
  } else if (isReviewsOpen) {
    seoTitle = 'Patient Reviews & 5-Star Stories | Europe\'s Top Rated Clinic';
    seoDescription = 'Explore verified patient reviews, 5-star ratings, and transformation feedback for Age Reversal Clinics London Harley Street.';
    seoPath = '#reviews';
  } else if (isExploreOpen) {
    seoTitle = 'All Treatments & Clinical Categories';
    seoDescription = 'Browse all aesthetic injectables, regenerative medicine, dermatology, and body contouring treatments at our London Harley Street clinic.';
    seoPath = '#explore-treatments';
  } else if (selectedArticle) {
    seoTitle = `${selectedArticle.title} | Clinical Journal`;
    seoDescription = selectedArticle.description || selectedArticle.title;
    seoImage = selectedArticle.image;
    seoPath = `#article-${selectedArticle.id}`;
  } else if (selectedTreatment) {
    const config = getTreatmentDetailsConfig();
    const lower = selectedTreatment.toLowerCase().trim();
    const activeTreatment = config ? (config[lower] || Object.values(config).find((t: any) => t.title.toLowerCase() === lower || t.id.toLowerCase() === lower)) : null;
    seoTitle = `${selectedTreatment} | Treatment Details & Packages`;
    seoDescription = activeTreatment?.description || `Discover clinical protocols, procedure times, downtime, expected benefits, and pricing packages for ${selectedTreatment} at Age Reversal Clinics.`;
    seoPath = `#treatment-${selectedTreatment.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (activeTreatment?.imageUrl) seoImage = activeTreatment.imageUrl;
  } else if (isAboutOpen) {
    seoTitle = 'About Our Clinic | Medical Heritage & Philosophy';
    seoDescription = 'Learn about Age Reversal Clinics, our GMC-registered doctors, London Harley Street heritage, and clinical philosophy.';
    seoPath = '#about';
  } else if (isPricingOpen) {
    seoTitle = 'Pricing & Treatment Packages | Transparent Clinical Rates';
    seoDescription = 'Explore transparent single-session and multi-session package rates with savings badges at Age Reversal Clinics.';
    seoPath = '#pricing';
  } else if (isShopOpen) {
    if (selectedShopProduct) {
      seoTitle = `${selectedShopProduct.name} | Medical Skincare`;
      seoDescription = selectedShopProduct.description;
      seoImage = selectedShopProduct.image;
      seoPath = `#product-${selectedShopProduct.id}`;
    } else {
      seoTitle = 'Medical Skincare Shop | Doctor-Formulated Formulations';
      seoDescription = 'Browse physician-curated medical-grade active skincare, barrier recovery creams, and post-procedure soothing serums.';
      seoPath = '#shop';
    }
  }

  // Resolve matching treatment data if viewing a treatment
  let activeTreatmentData: any = null;
  if (selectedTreatment) {
    const config = getTreatmentDetailsConfig();
    if (config) {
      const lower = selectedTreatment.toLowerCase().trim();
      activeTreatmentData = config[lower] || Object.values(config).find((t: any) => t.title.toLowerCase() === lower || t.id.toLowerCase() === lower);
    }
  }

  if (isAdminOpen) {
    return (
      <Suspense fallback={<PageLoadingFallback message="Opening Clinical Management Studio..." subMessage="Loading content editors, treatment media assets, and clinic settings" />}>
        <AdminDashboard onBackToClinic={() => handleToggleAdmin(false)} />
      </Suspense>
    );
  }

  return (
    <div className="bg-silver-100 text-silver-800 antialiased min-h-screen flex flex-col relative selection:bg-rose-gold selection:text-silver-900">
      {/* Dynamic Schema.org JSON-LD & OpenGraph Meta Injector */}
      <ClinicalSEOHead
        customTitle={seoTitle}
        customDescription={seoDescription}
        customImage={seoImage}
        canonicalPath={seoPath}
        customKeywords={activeTreatmentData?.seoKeywords}
        treatmentData={activeTreatmentData}
      />
      
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
          setIsTransformationsOpen(false);
          setReturnArticle(null);
          setSelectedShopProduct(null);
          setPricingCategoryFilter(categoryFilter);
          setIsPricingOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onTransformationsClick={() => {
          setSelectedConsultant(null);
          setIsExploreOpen(false);
          setSelectedArticle(null);
          setSelectedTreatment(null);
          setIsAboutOpen(false);
          setIsShopOpen(false);
          setIsPricingOpen(false);
          setReturnArticle(null);
          setSelectedShopProduct(null);
          setIsTransformationsOpen(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReviewsClick={handleOpenReviews}
      />

      <main className="flex-grow">
        <Suspense fallback={<PageLoadingFallback />}>
          {selectedConsultant ? (
          <ProfilePage
            authorName={selectedConsultant}
            onClose={() => setSelectedConsultant(null)}
            onBookClick={() => handleScrollToBooking()}
          />
        ) : isReviewsOpen ? (
          <ReviewsPageView
            onClose={() => setIsReviewsOpen(false)}
            onBookClick={handleScrollToBooking}
          />
        ) : isTransformationsOpen ? (
          <TransformationsPageView
            onClose={() => setIsTransformationsOpen(false)}
            onBookClick={handleScrollToBooking}
            onOpenProduct={(product) => handleOpenProduct(product, true)}
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
            productBackLabel={returnToTransformations ? 'Transformations' : returnArticle ? 'Article' : undefined}
            onBackFromProduct={returnToTransformations || returnArticle ? handleBackFromProduct : undefined}
            onClose={() => {
              setIsShopOpen(false);
              setShopRangeFilter(undefined);
              setSelectedShopProduct(null);
              if (returnToTransformations) {
                setReturnToTransformations(false);
                setIsTransformationsOpen(true);
              } else if (returnArticle) {
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
              onPricingClick={() => {
                setSelectedConsultant(null);
                setIsExploreOpen(false);
                setSelectedArticle(null);
                setSelectedTreatment(null);
                setIsAboutOpen(false);
                setIsShopOpen(false);
                setIsTransformationsOpen(false);
                setReturnArticle(null);
                setSelectedShopProduct(null);
                setPricingCategoryFilter(undefined);
                setIsPricingOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onTransformationsClick={() => {
                setSelectedConsultant(null);
                setIsExploreOpen(false);
                setSelectedArticle(null);
                setSelectedTreatment(null);
                setIsAboutOpen(false);
                setIsShopOpen(false);
                setIsPricingOpen(false);
                setReturnArticle(null);
                setSelectedShopProduct(null);
                setIsTransformationsOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReviewsClick={handleOpenReviews}
              heroConfig={heroConfig}
            />

            {/* Specialist Areas with Sculptural Bust Background */}
            <div className="relative overflow-hidden bg-[#faf9f8] isolate transform-gpu">
              <div className="absolute inset-0 z-0 pointer-events-none transform-gpu">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8bgRX2IN0PJIId4hwyXvIXyAXymszL74AdUgStK58dFHc8-yHd7YTcqnjhsif69RjPTorG7X3K2L_bd7s4gjmN7BWOz_FKR0y4diN2rWbgdn3rsH3ormt2YNjUPPENB3P5V1pf5Vv3Opmiei3njD4hgCUAyHv5TB258eloVBqp55EW_KeB5ZpB9uITDcr9V8Hr0owysVe95b66YQbYKPz1BzX_NuBJVChJdYZxvlErr8HaxLbOY6AVAvs4gtL9k-XKw"
                  alt="Sculptural bust with pedestal in monochrome violet"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="w-full h-full object-cover object-center brightness-100 contrast-105 opacity-90 transform-gpu"
                  style={{ transform: 'translateZ(0)' }}
                />
                {/* Hardware-native alpha fade overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/25 to-white/45 pointer-events-none" />
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

            {/* 5. Editorial Treatment Teasers Section */}
            <div className="relative isolate">
              <Treatments 
                onBookClick={() => handleScrollToBooking('General Rejuvenation Consultation')} 
                onTreatmentClick={(name) => setSelectedTreatment(name)}
                treatmentsConfig={treatmentsConfig}
              />
            </div>

            {/* 8. Breathtaking Interactive Before/After Gallery */}
            <div className="relative overflow-hidden bg-[#ff8656] text-slate-950 border-b border-[#e57042] isolate">
              {/* Soft Fade Overlay (Matches Treatment component) */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />

              {/* Luminous Ambient Light Glow (GPU-optimized pre-computed radial gradients) */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-85" 
                style={{
                  background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 75%), radial-gradient(circle 350px at 0% 90%, rgba(255, 255, 255, 0.28) 0%, transparent 70%)'
                }}
              />

              <div className="relative z-10">
                <BeforeAfterGallery />
              </div>
            </div>

            {/* Why Choose Us Section with App's Theme Background */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f3] via-[#f5ede1] to-[#faf7f2] border-b border-[#D8C2A3]/40 isolate">
              {/* Soft Fade Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/25 to-white/50 pointer-events-none" />

              {/* Luxury Ambient Light Blooms (GPU-optimized pre-computed radial gradients) */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-90"
                style={{
                  background: 'radial-gradient(ellipse 65% 55% at 50% 0%, rgba(216, 194, 163, 0.35) 0%, rgba(236, 220, 200, 0.15) 50%, transparent 75%), radial-gradient(circle 380px at 100% 35%, rgba(236, 220, 200, 0.25) 0%, transparent 70%), radial-gradient(circle 380px at 0% 90%, rgba(228, 210, 188, 0.3) 0%, transparent 70%)'
                }}
              />

              <div className="relative z-10">
                <WhyChooseUs />
              </div>
            </div>       

            {/* 13.6 Awards & Recognition Auto-scrolling Section */}
            <div className="relative isolate">
              <AwardsShowcase />       
            </div>

            {/* Our Locations and Preferred Consultation Sections from HTML request */}
            <div className="relative isolate">
              <LocationsAndConsultation 
                preselectedService={preferredService} 
                onTreatmentClick={(name) => setSelectedTreatment(name)}
              />
            </div>

            {/* 10. Limited Time Promotional Banners */}
            <div className="relative isolate">
              <SpecialOffers onClaimOffer={handleClaimOffer} />
            </div>

            {/* Latest from The London Clinic Section */}
            <div className="relative isolate">
              <LatestNews onArticleClick={setSelectedArticle} />
            </div>
          </>
        )}
        </Suspense>
      </main>

      {/* 14. Stay Informed Newsletter Subscription */}
      <div className="relative isolate">
        <StayInformed />
      </div>

      {/* 14.5 Social Media Reels / Video Showcase (Excluded on Pricing Page to save bandwidth) */}
      {!isPricingOpen && (
        <div className="relative isolate">
          <SocialVideoShowcase />
        </div>
      )}

      {/* 15. Footnotes and Sitemap */}
      <div className="relative isolate">
        <Footer />
      </div>

      {/* 16. Persistent side action menu */}
      <FloatingMenu />

      {/* 17. Universal Shopping Bag & Cart Drawer (Mounted at Root) */}
      <UniversalCartDrawer />

      {/* 18. Universal Clinical Treatment Plan Drawer (Mounted at Root) */}
      <TreatmentCartDrawer />

    </div>
  );
}
