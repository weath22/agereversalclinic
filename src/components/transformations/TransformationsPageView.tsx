import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, CheckCircle2, Sparkles, ShoppingBag, ChevronRight, X } from 'lucide-react';
import {
  CLINICAL_TRANSFORMATION_CASES,
  ADMIN_SYNCED_TRANSFORMATION_CASES,
  EXISTING_BEFORE_AFTER_TREATMENT_GROUPS,
  TransformationCase,
  getRecommendedTreatmentsForCase,
  getRecommendedProductsForCase,
} from '../../data/transformationsData';
import {
  getBeforeAfterGalleryConfig,
  fetchRemoteBeforeAfterGalleryConfig,
  getMasterServices,
  normalizeMasterBranch,
  inferTransformationCategoryFromBranch,
} from '../../lib/adminStore';
import { BeforeAfterGalleryConfig, SpecialistArea } from '../../types';
import { PricingCard } from '../pricing/PricingCard';
import { PackageSelectModal } from '../pricing/PackageSelectModal';
import { ProductCard } from '../shop/ProductCard';
import { TransformationCarousel } from './TransformationCarousel';
import { TreatmentPricingItem, PricingPackage } from '../../data/treatmentPricing';
import { ShopProduct } from '../../types/shop';
import { useCart } from '../../context/CartContext';
import { useTreatmentCart } from '../../context/TreatmentCartContext';

interface TransformationsPageViewProps {
  onClose: () => void;
  onBookClick?: (serviceName?: string) => void;
  onOpenProduct?: (product: ShopProduct) => void;
  initialCategoryFilter?: string;
  initialCaseId?: string;
}

export const TransformationsPageView: React.FC<TransformationsPageViewProps> = ({
  onClose,
  onBookClick,
  onOpenProduct,
  initialCategoryFilter,
  initialCaseId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter || 'All');
  const [galleryConfig, setGalleryConfig] = useState<BeforeAfterGalleryConfig>(() =>
    getBeforeAfterGalleryConfig()
  );
  const [masterServices, setMasterServices] = useState<SpecialistArea[]>(() => getMasterServices());
  const [activePackageModalTreatment, setActivePackageModalTreatment] = useState<TreatmentPricingItem | null>(null);
  const [activeBottomSheet, setActiveBottomSheet] = useState<{ type: 'treatments' | 'products'; caseItem: TransformationCase } | null>(null);
  
  // Connect to unified CartContext & TreatmentCartContext
  const { addToCart, openCart, totalCartCount } = useCart();
  const {
    addTreatment,
    openTreatmentCart,
    totalTreatmentCount,
  } = useTreatmentCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem('homepage_gallery_config_v6')) {
      fetchRemoteBeforeAfterGalleryConfig().then((remote) => {
        if (remote) setGalleryConfig(remote);
      });
    }
    const handleGalleryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeAfterGalleryConfig>;
      if (customEvent.detail) {
        setGalleryConfig(customEvent.detail);
      } else {
        setGalleryConfig(getBeforeAfterGalleryConfig());
      }
    };
    const handleMasterServicesUpdate = () => {
      setMasterServices(getMasterServices());
      setGalleryConfig(getBeforeAfterGalleryConfig());
    };
    window.addEventListener('before_after_gallery_updated', handleGalleryUpdate);
    window.addEventListener('master_services_updated', handleMasterServicesUpdate);
    window.addEventListener('storage', handleMasterServicesUpdate);
    return () => {
      window.removeEventListener('before_after_gallery_updated', handleGalleryUpdate);
      window.removeEventListener('master_services_updated', handleMasterServicesUpdate);
      window.removeEventListener('storage', handleMasterServicesUpdate);
    };
  }, []);

  const liveTreatmentGroups = useMemo(() => {
    if (masterServices && masterServices.length > 0) {
      return masterServices.map((s) => {
        const branch = normalizeMasterBranch(s.pricingCategory || s.category, s.title);
        return {
          id: s.id,
          name: s.title,
          pricingCategory: branch,
          transformationCategory:
            s.transformationCategory || inferTransformationCategoryFromBranch(branch, s.title),
        };
      });
    }
    return EXISTING_BEFORE_AFTER_TREATMENT_GROUPS;
  }, [masterServices]);

  const categories = useMemo(
    () => ['All', ...liveTreatmentGroups.map((g) => g.name)],
    [liveTreatmentGroups]
  );

  const allCases = useMemo(() => {
    const defaultCaseIds = new Set(CLINICAL_TRANSFORMATION_CASES.map((c) => c.id));
    const defaultPairIds = new Set(['pair-1', 'pair-2', 'pair-3', 'pair-4', 'pair-5', 'pair-6', 'pair-7', 'pair-8']);

    const adminCases: TransformationCase[] = (galleryConfig?.categories || []).flatMap((cat) => {
      const groupMeta = liveTreatmentGroups.find((g) => g.id === cat.id);
      const mappedCategory = groupMeta?.transformationCategory || 'Facial Rejuvenation';

      return (cat.pairs || [])
        .filter((p) => !p.hidden && !defaultCaseIds.has(p.id) && !defaultPairIds.has(p.id))
        .map((pair): TransformationCase => ({
          id: pair.id,
          title: groupMeta?.name || pair.title,
          category: mappedCategory,
          tag: groupMeta?.name || cat.name,
          patientInfo: groupMeta?.name || pair.linkedTreatmentTitle || cat.name,
          duration: pair.duration || '8 Weeks',
          sessions: pair.sessions || 1,
          concern: pair.seoTitle || `${groupMeta?.name || pair.title} clinical transformation at Age Reversal Clinics.`,
          beforeImage: pair.beforeImage,
          afterImage: pair.afterImage,
          galleryImages: [pair.beforeImage, pair.afterImage],
          recommendedTreatmentIds: pair.linkedTreatmentId ? [pair.linkedTreatmentId] : [cat.id, 'profhilo-2ml'],
          recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream'],
          treatmentGroupId: pair.treatmentGroupId || cat.id,
          linkedTreatmentId: pair.linkedTreatmentId || cat.id,
          beforeAltText: pair.beforeAltText,
          afterAltText: pair.afterAltText,
          seoTitle: pair.seoTitle,
          seoKeywords: pair.seoKeywords,
          featured: pair.featured,
          updatedAt: pair.updatedAt,
        }));
    });

    const syncedStaticCases = [...ADMIN_SYNCED_TRANSFORMATION_CASES, ...CLINICAL_TRANSFORMATION_CASES].map((c) => {
      const groupMeta = liveTreatmentGroups.find(
        (g) => g.id === c.treatmentGroupId || g.id === c.linkedTreatmentId
      );
      if (!groupMeta) return c;
      return {
        ...c,
        title: groupMeta.name,
        tag: groupMeta.name,
        category: groupMeta.transformationCategory || c.category,
      };
    });

    const combined = [...adminCases, ...syncedStaticCases];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [galleryConfig, liveTreatmentGroups]);

  const filteredCases = useMemo(() => {
    if (selectedCategory === 'All') return allCases;
    const selectedLower = selectedCategory.toLowerCase();
    const matchedGroup = liveTreatmentGroups.find(
      (g) => g.name.toLowerCase() === selectedLower || g.id.toLowerCase() === selectedLower
    );
    return allCases.filter((c) => {
      if (matchedGroup) {
        if (c.treatmentGroupId === matchedGroup.id || c.linkedTreatmentId === matchedGroup.id) {
          return true;
        }
        if (c.recommendedTreatmentIds?.includes(matchedGroup.id)) {
          return true;
        }
      }
      return (
        c.title.toLowerCase() === selectedLower ||
        c.tag.toLowerCase() === selectedLower ||
        c.category.toLowerCase() === selectedLower
      );
    });
  }, [selectedCategory, allCases, liveTreatmentGroups]);

  // Schema.org/ImageObject Structured Data for Google Image Search
  const structuredDataJson = useMemo(() => {
    const imageObjects = filteredCases.flatMap((c) => {
      const kw = (c.seoKeywords || [c.title, c.tag, 'before and after', 'Age Reversal Clinics London']).join(', ');
      return [
        {
          '@type': 'ImageObject',
          contentUrl: c.beforeImage,
          name: c.seoTitle ? `${c.seoTitle} (Before)` : `${c.title} Before Treatment`,
          description:
            c.beforeAltText || `${c.title} Before ${c.tag} Treatment at Age Reversal Clinics London`,
          keywords: kw,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
        {
          '@type': 'ImageObject',
          contentUrl: c.afterImage,
          name: c.seoTitle ? `${c.seoTitle} (After)` : `${c.title} After Treatment`,
          description:
            c.afterAltText || `${c.title} After ${c.tag} Treatment Result at Age Reversal Clinics London`,
          keywords: kw,
          creator: {
            '@type': 'MedicalBusiness',
            name: 'Age Reversal Clinics',
          },
        },
      ];
    });

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      name: 'Age Reversal Clinics Patient Before & After Transformations',
      description:
        'Unretouched clinical before and after patient photography and treatment pathways at Age Reversal Clinics London.',
      image: imageObjects,
    });
  }, [filteredCases]);

  const handleAddToCart = (product: ShopProduct) => {
    addToCart(product, 1, false);
    setToastMessage(`Added "${product.name}" to your shopping bag`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleChoosePackage = (treatment: TreatmentPricingItem) => {
    setActivePackageModalTreatment(treatment);
  };

  const handleBookPackage = (treatment: TreatmentPricingItem, selectedPackage: PricingPackage) => {
    setActivePackageModalTreatment(null);
    // Add treatment to global treatment cart and open treatment plan drawer
    addTreatment(treatment, selectedPackage, 1, true);
  };

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen pt-4 pb-0 sm:pb-20 selection:bg-rose-gold selection:text-stone-900">
      {/* Google Image Search Schema.org ImageObject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[10001] bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm border border-luxury-gold/40"
          >
            <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation & Breadcrumb Header */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#D8C2A3]/30">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-stone-700 hover:text-black hover:-translate-x-1 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-luxury-gold" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={openTreatmentCart}
              className="relative p-2 sm:px-3 sm:py-2 rounded-full border border-[#D8C2A3]/50 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              aria-label="View Planned Treatments"
            >
              <Calendar className="w-4 h-4 text-stone-800" />
              <span className="hidden sm:inline text-xs font-medium text-stone-800">Plan</span>
              {totalTreatmentCount > 0 && (
                <span className="bg-black text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center -ml-0.5 border border-luxury-gold/50">
                  {totalTreatmentCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="relative p-2 sm:px-3 sm:py-2 rounded-full border border-[#D8C2A3]/50 bg-white hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 text-stone-800" />
              <span className="hidden sm:inline text-xs font-medium text-stone-800">Bag</span>
              {totalCartCount > 0 && (
                <span className="bg-[#EA014A] text-white text-[10px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center -ml-0.5">
                  {totalCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onBookClick && onBookClick('General Rejuvenation Consultation')}
              className="bg-black hover:bg-neutral-900 text-white text-xs sm:text-sm px-5 py-2 sm:py-2.5 rounded-full border border-luxury-gold/50 shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-medium cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Headline Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 mb-10 md:mb-14 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D8C2A3]/40 shadow-xs mb-4">
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 tracking-tight leading-tight mb-4">
          Real Patient Results & <span className="italic text-luxury-gold font-normal">Treatment Pathways</span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
          Witness authentic, unretouched photographic documentation from our Harley Street & Knightsbridge flagships. Each case illustrates the tailored clinical procedures and prescribed skincare formulas used to achieve radiant, natural results.
        </p>
      </section>

      {/* Category Filter Pills */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 mb-10">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-sans font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-black text-white shadow-md border border-black'
                    : 'bg-white text-stone-700 hover:text-black border border-[#D8C2A3]/40 hover:border-luxury-gold/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Transformation Cases Stream */}
      <section className="container mx-auto px-4 sm:px-6 md:px-8 space-y-16 md:space-y-24">
        {filteredCases.map((caseItem, idx) => {
          const recommendedTreatments = getRecommendedTreatmentsForCase(caseItem);
          const recommendedProducts = getRecommendedProductsForCase(caseItem);

          return (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-transparent lg:bg-white rounded-none lg:rounded-[36px] border-0 lg:border lg:border-[#D8C2A3]/40 shadow-none lg:shadow-[0_12px_40px_-15px_rgba(0,0,0,0.06)] p-0 lg:p-10 xl:p-12 pb-12 lg:pb-10 xl:pb-12 border-b border-stone-200/70 lg:border-b-0 overflow-hidden relative"
            >
              {/* Subtle Luxury Corner Watermark (Large Desktop only) */}
              <div className="hidden lg:block absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D8C2A3]/10 to-transparent pointer-events-none rounded-bl-full" />

              {/* Elementor Section: Heading, Divider with Icon, and Image Carousel */}
              <TransformationCarousel
                title={caseItem.title}
                images={caseItem.galleryImages && caseItem.galleryImages.length > 0 ? caseItem.galleryImages : [caseItem.beforeImage, caseItem.afterImage]}
                beforeAltText={caseItem.beforeAltText}
                afterAltText={caseItem.afterAltText}
                seoTitle={caseItem.seoTitle}
              />

              {/* Discover More Widget (Google AI entries style) */}
              <div className="w-full max-w-sm sm:max-w-md mx-auto my-6 sm:my-8 bg-[#F8F9FA] rounded-md border border-[#DADCE0] overflow-hidden shadow-xs">
                {/* Discover More Header */}
                <div className="bg-[#E8F0FE] px-4 py-3 border-b border-[#DADCE0] flex items-center justify-start">
                  <span className="text-base sm:text-[17px] font-bold text-[#4A4A4A] font-sans">
                    Discover more
                  </span>
                </div>

                {/* Entry Links */}
                <div className="divide-y divide-[#DADCE0]">
                  {/* Item 1: Recommended Clinical Treatments */}
                  <button
                    type="button"
                    onClick={() => setActiveBottomSheet({ type: 'treatments', caseItem })}
                    className="w-full bg-white hover:bg-stone-50 active:bg-stone-100 transition-colors px-4 py-3.5 sm:py-4 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-[17px] font-normal text-[#3C4043] group-hover:text-black font-sans">
                        Recommended Clinical Treatments
                      </span>
                      {recommendedTreatments.length > 0 && (
                        <span className="text-[11px] font-sans font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          {recommendedTreatments.length}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9AA0A6] group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  {/* Item 2: Prescribed Skincare Products */}
                  <button
                    type="button"
                    onClick={() => setActiveBottomSheet({ type: 'products', caseItem })}
                    className="w-full bg-white hover:bg-stone-50 active:bg-stone-100 transition-colors px-4 py-3.5 sm:py-4 flex items-center justify-between text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-[17px] font-normal text-[#3C4043] group-hover:text-black font-sans">
                        Prescribed Skincare Products
                      </span>
                      {recommendedProducts.length > 0 && (
                        <span className="text-[11px] font-sans font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                          {recommendedProducts.length}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9AA0A6] group-hover:text-stone-900 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Bottom Consultation Banner */}
      <section className="w-full sm:container sm:mx-auto px-0 sm:px-6 md:px-8 mt-16 md:mt-24">
        <div className="bg-black text-white rounded-none sm:rounded-[36px] p-8 sm:p-12 md:p-16 border-y sm:border border-luxury-gold/40 shadow-2xl relative overflow-hidden text-center max-w-none sm:max-w-4xl mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-luxury-gold/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-[0.2em] text-luxury-gold block">
              Bespoke Aesthetic Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-white tracking-tight">
              Ready to Begin Your Own Transformation?
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              Book an in-depth clinical consultation with our specialist dermatologists and aesthetic doctors. We’ll design a custom treatment journey tailored specifically to your facial anatomy.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onBookClick && onBookClick('Comprehensive Aesthetic Consultation')}
                className="bg-luxury-gold hover:bg-white text-black font-sans font-medium text-xs sm:text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-black" />
                <span>Book Diagnostic Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile & Desktop Bottom Sheet Drawer */}
      <AnimatePresence>
        {activeBottomSheet && (
          <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs">
            {/* Backdrop Dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBottomSheet(null)}
              className="fixed inset-0"
            />

            {/* Bottom Sheet Modal Dialog */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="no-scrollbar fixed bottom-0 left-0 right-0 max-h-[88vh] sm:max-h-[85vh] md:max-w-2xl md:mx-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col font-sans z-10 overflow-hidden"
            >
              {/* Drag handle pill */}
              <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

              {/* Sticky Header */}
              <div className="px-5 sm:px-6 py-3 border-b border-stone-200/80 flex items-center justify-between shrink-0 bg-white">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-medium text-stone-900">
                    {activeBottomSheet.type === 'treatments' ? 'Specialist Treatments' : 'Recommended Products'}
                  </h3>
                  <p className="text-xs text-stone-500 font-light truncate max-w-xs sm:max-w-md">
                    For: {activeBottomSheet.caseItem.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBottomSheet(null)}
                  className="p-1.5 sm:p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-4">
                {activeBottomSheet.type === 'treatments' ? (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-stone-600 font-light">
                      Select a clinical treatment package calibrated to achieve this aesthetic outcome:
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {getRecommendedTreatmentsForCase(activeBottomSheet.caseItem).map((treatment) => (
                        <div key={treatment.id} className="bg-stone-50 rounded-2xl border border-stone-200/80 p-2 sm:p-3">
                          <PricingCard
                            treatment={treatment}
                            onChoosePackage={(t) => {
                              setActiveBottomSheet(null);
                              handleChoosePackage(t);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-stone-600 font-light">
                      Prescribed medical-grade skincare products for post-treatment recovery and skin health:
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {getRecommendedProductsForCase(activeBottomSheet.caseItem).map((product) => (
                        <div key={product.id} className="h-full">
                          <ProductCard
                            product={product}
                            onViewProduct={(p) => {
                              setActiveBottomSheet(null);
                              if (onOpenProduct) onOpenProduct(p);
                            }}
                            onAddToCart={handleAddToCart}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Package Selection Modal */}
      {activePackageModalTreatment && (
        <PackageSelectModal
          treatment={activePackageModalTreatment}
          onClose={() => setActivePackageModalTreatment(null)}
          onBookPackage={handleBookPackage}
        />
      )}
    </div>
  );
};

export default TransformationsPageView;
