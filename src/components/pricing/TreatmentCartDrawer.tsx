import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Sparkles, Trash2, ArrowRight, ShieldCheck, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTreatmentCart } from '../../context/TreatmentCartContext';
import { PricingPackage, TreatmentPricingItem } from '../../data/treatmentPricing';
import { getTreatmentPricingData } from '../../lib/adminStore';
import { getTreatmentImagePath } from '../../utils/treatmentImageHelper';
import { LogoOutlineSkeleton } from '../common/LogoOutlineSkeleton';

function getInitialCardImageSrc(item: {
  id: string;
  image?: string;
  updatedAt?: number | string;
  coverMedia?: { url?: string };
}): string {
  const customImg = (item.image || item.coverMedia?.url || '').trim();
  const hasCustomNonUnsplash = Boolean(customImg && !customImg.includes('unsplash.com'));

  if (hasCustomNonUnsplash && !customImg.startsWith('/assets/treatments/')) {
    return customImg;
  }

  return getTreatmentImagePath(item.id, item.image, item.updatedAt);
}

const CartItemThumbnail: React.FC<{
  treatment: {
    id: string;
    title: string;
    image?: string;
    badge?: string;
    updatedAt?: number | string;
    coverMedia?: { url?: string; altText?: string; seoTitle?: string };
  };
}> = ({ treatment }) => {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(() =>
    getInitialCardImageSrc(treatment)
  );
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const nextSrc = getInitialCardImageSrc(treatment);
    setCurrentImageSrc(nextSrc);
    setIsLoaded(false);
    setHasError(false);
  }, [treatment.id, treatment.image, treatment.coverMedia?.url, treatment.updatedAt]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentImageSrc]);

  const handleImageError = () => {
    const predictablePath = getTreatmentImagePath(treatment.id, treatment.image, treatment.updatedAt);
    const customFallback = (treatment.image || treatment.coverMedia?.url || '').trim();
    const isValidCustomFallback =
      Boolean(customFallback) &&
      !customFallback.includes('unsplash.com') &&
      !customFallback.startsWith('/assets/treatments/');

    if (currentImageSrc !== predictablePath && !currentImageSrc.startsWith('/assets/treatments/')) {
      setCurrentImageSrc(predictablePath);
      return;
    }

    if (isValidCustomFallback && currentImageSrc !== customFallback) {
      setCurrentImageSrc(customFallback);
      return;
    }

    setHasError(true);
  };

  return (
    <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#0e141b] via-[#141b24] to-[#0a0e13] border border-luxury-border/50 shrink-0 overflow-hidden flex items-center justify-center">
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex items-center justify-center p-1.5 z-0">
          <LogoOutlineSkeleton
            size="sm"
            variant="gold"
            animate={!hasError}
            showText={false}
          />
        </div>
      )}

      {!hasError && (
        <img
          ref={imgRef}
          src={currentImageSrc}
          alt={treatment.coverMedia?.altText || treatment.title}
          title={treatment.coverMedia?.seoTitle || treatment.title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
          referrerPolicy="no-referrer"
        />
      )}

      {treatment.badge && (
        <div className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 z-10 bg-[#EA014A] text-white text-[7px] sm:text-[8px] font-bold px-1 sm:px-1.5 py-0.2 rounded-full uppercase leading-tight">
          {treatment.badge}
        </div>
      )}
    </div>
  );
};

interface TreatmentCartDrawerProps {
  onBookTreatmentPlan?: (serviceNames: string[]) => void;
}

export const TreatmentCartDrawer: React.FC<TreatmentCartDrawerProps> = ({
  onBookTreatmentPlan,
}) => {
  const {
    treatmentCart,
    totalTreatmentCount,
    treatmentSubtotal,
    totalSessions,
    totalSavings,
    currency,
    isTreatmentCartOpen,
    closeTreatmentCart,
    removeTreatment,
    updateTreatmentPackage,
    clearTreatmentCart,
  } = useTreatmentCart();

  // State to toggle mobile tier switcher dropdown per item
  const [expandedMobileTierItem, setExpandedMobileTierItem] = useState<string | null>(null);
  const [isOnConsultationSection, setIsOnConsultationSection] = useState<boolean>(false);
  const [livePricingCatalog, setLivePricingCatalog] = useState<TreatmentPricingItem[]>(() =>
    getTreatmentPricingData()
  );

  useEffect(() => {
    const syncPricing = () => {
      setLivePricingCatalog(getTreatmentPricingData());
    };
    window.addEventListener('treatment_pricing_updated', syncPricing);
    window.addEventListener('storage', syncPricing);
    return () => {
      window.removeEventListener('treatment_pricing_updated', syncPricing);
      window.removeEventListener('storage', syncPricing);
    };
  }, []);

  const catalogById = useMemo(
    () => new Map(livePricingCatalog.map((t) => [t.id, t])),
    [livePricingCatalog]
  );

  useEffect(() => {
    if (!isTreatmentCartOpen || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const updateConsultationVisibility = () => {
      const el = document.getElementById('preferred-consultation');
      if (!el) {
        setIsOnConsultationSection(false);
        return;
      }
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 120;
      setIsOnConsultationSection(inView);
    };

    updateConsultationVisibility();
    window.addEventListener('scroll', updateConsultationVisibility, { passive: true });
    window.addEventListener('resize', updateConsultationVisibility);
    return () => {
      window.removeEventListener('scroll', updateConsultationVisibility);
      window.removeEventListener('resize', updateConsultationVisibility);
    };
  }, [isTreatmentCartOpen]);

  const toggleMobileTier = (itemId: string) => {
    setExpandedMobileTierItem((prev) => (prev === itemId ? null : itemId));
  };

  const handleProceedToBooking = () => {
    closeTreatmentCart();

    const summaryServices = treatmentCart.map(
      (item) => `${item.treatment.title} (${item.selectedPackage.name})`
    );

    if (onBookTreatmentPlan) {
      onBookTreatmentPlan(summaryServices);
    }

    const scrollAndBroadcast = () => {
      const element =
        document.getElementById('preferred-consultation') ||
        document.getElementById('contact') ||
        document.getElementById('appointment-booking');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('arc_apply_treatment_plan', {
            detail: {
              treatmentPlan: treatmentCart,
              servicesSummary: summaryServices.join(', '),
            },
          })
        );
      }
    };

    scrollAndBroadcast();
    setTimeout(scrollAndBroadcast, 200);
  };

  return (
    <AnimatePresence>
      {isTreatmentCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={closeTreatmentCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-3 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col h-full border-l border-luxury-border/60"
            >
              {/* Header: Clinic Luxury Black, Gold accents */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex justify-between items-center bg-black text-white shrink-0">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-neutral-900 border border-luxury-gold/40 rounded-xl">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg font-serif tracking-tight text-white leading-tight">
                      Treatment Plan
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-white/60 font-sans tracking-wider uppercase">
                      {totalTreatmentCount} {totalTreatmentCount === 1 ? 'Procedure' : 'Procedures'}
                      {totalSessions > 0 && ` • ${totalSessions} Sessions`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeTreatmentCart}
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
                  aria-label="Close treatment plan"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Savings & Clinical Plan Summary Banner */}
              {totalSavings > 0 && (
                <div className="bg-[#FAF7F2] px-4 sm:px-6 py-2 sm:py-2.5 border-b border-luxury-border/40 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-luxury-gold shrink-0" />
                    <span className="text-[11px] sm:text-xs font-serif text-stone-800">
                      Multi-Session Course Savings
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#EA014A] text-white shadow-2xs">
                    Save {currency}{totalSavings.toFixed(0)}
                  </span>
                </div>
              )}

              {/* Treatment List Body */}
              <div className="flex-1 overflow-y-auto px-3.5 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 divide-y divide-luxury-border/30">
                {treatmentCart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-80 text-center text-luxury-muted px-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-3 sm:mb-4 border border-luxury-border/40">
                      <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-luxury-muted" />
                    </div>
                    <p className="font-serif font-medium text-luxury-text text-sm sm:text-base">
                      No treatments in your plan yet
                    </p>
                    <p className="text-xs text-luxury-muted mt-1 sm:mt-1.5 max-w-xs leading-relaxed">
                      Explore our physician-led procedures, injectable rates, and restorative biotech packages to build your personalized aesthetic journey.
                    </p>
                    <button
                      onClick={closeTreatmentCart}
                      className="mt-5 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 bg-black hover:bg-neutral-900 text-white text-[11px] sm:text-xs font-sans font-medium uppercase tracking-wider rounded-full border border-luxury-gold/50 transition-all cursor-pointer shadow-xs"
                    >
                      Browse Treatments & Pricing
                    </button>
                  </div>
                ) : (
                  treatmentCart.map((item, idx) => {
                    const availablePackages = item.treatment.packages || [];
                    const isMobileTierOpen = expandedMobileTierItem === item.id;
                    const latestCardMeta = catalogById.get(item.treatment.id);
                    const mergedTreatmentForThumb = latestCardMeta
                      ? {
                          ...item.treatment,
                          image: latestCardMeta.image || item.treatment.image,
                          coverMedia: latestCardMeta.coverMedia || item.treatment.coverMedia,
                          updatedAt: latestCardMeta.updatedAt || item.treatment.updatedAt,
                        }
                      : item.treatment;

                    return (
                      <div
                        key={item.id || idx}
                        className={`pt-3 sm:pt-4 ${idx === 0 ? 'pt-0 border-none' : ''}`}
                      >
                        {/* Compact, Clean Card Container on Mobile / Rich details on Desktop */}
                        <div className="rounded-xl bg-white sm:bg-transparent border border-luxury-border/40 sm:border-0 p-3 sm:p-0 shadow-2xs sm:shadow-none">
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Image preview with brand logo placeholder */}
                            <CartItemThumbnail treatment={mergedTreatmentForThumb} />

                            {/* Info & Price */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="min-w-0">
                                  <span className="text-[9px] sm:text-[10px] font-sans uppercase tracking-wider font-semibold text-luxury-gold block truncate">
                                    {item.treatment.category}
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-medium text-luxury-text leading-snug line-clamp-1 sm:line-clamp-2">
                                    {item.treatment.title}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => removeTreatment(item.id)}
                                  className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer shrink-0"
                                  title="Remove treatment"
                                  aria-label="Remove treatment"
                                >
                                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                              </div>

                              {/* Desktop only: Procedure Time & Downtime */}
                              <div className="hidden sm:flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-luxury-gold shrink-0" />
                                  {item.treatment.procedureTime}
                                </span>
                                <span>•</span>
                                <span>Downtime: {item.treatment.downtime}</span>
                              </div>

                              {/* Price & Sessions pill for mobile view */}
                              <div className="flex sm:hidden items-center justify-between mt-2 pt-1.5 border-t border-stone-100">
                                <div className="text-[11px] text-stone-600 font-sans">
                                  <span className="font-medium text-stone-900 truncate block max-w-[150px]">
                                    {item.selectedPackage.name}
                                  </span>
                                  <span className="text-[10px] text-stone-400">
                                    {item.selectedPackage.sessions} {item.selectedPackage.sessions === 1 ? 'Session' : 'Sessions'}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="font-serif font-bold text-xs text-stone-900 block">
                                    {item.treatment.currency || '£'}{item.selectedPackage.price}
                                  </span>
                                  {availablePackages.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => toggleMobileTier(item.id)}
                                      className="text-[10px] text-[#7a6242] hover:text-black font-medium underline flex items-center gap-0.5 ml-auto cursor-pointer"
                                    >
                                      <span>Change tier</span>
                                      {isMobileTierOpen ? (
                                        <ChevronUp className="w-2.5 h-2.5" />
                                      ) : (
                                        <ChevronDown className="w-2.5 h-2.5" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Collapsible Tier Switcher (Only opens on click to keep screen clean) */}
                          {availablePackages.length > 1 && (
                            <AnimatePresence>
                              {isMobileTierOpen && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="sm:hidden mt-2 pt-2 border-t border-stone-100 overflow-hidden"
                                >
                                  <p className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
                                    Select Package Tier:
                                  </p>
                                  <div className="space-y-1">
                                    {availablePackages.map((pkg: PricingPackage) => {
                                      const isSelected = item.selectedPackage.id === pkg.id;
                                      return (
                                        <button
                                          key={pkg.id}
                                          type="button"
                                          onClick={() => {
                                            updateTreatmentPackage(item.treatment.id, pkg);
                                            setExpandedMobileTierItem(null);
                                          }}
                                          className={`w-full text-left p-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between border cursor-pointer ${
                                            isSelected
                                              ? 'border-black bg-stone-900 text-white font-medium'
                                              : 'border-stone-200 bg-stone-50 text-stone-700'
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5 min-w-0">
                                            <div
                                              className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                                                isSelected
                                                  ? 'border-luxury-gold bg-luxury-gold text-black'
                                                  : 'border-stone-400'
                                              }`}
                                            >
                                              {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                                            </div>
                                            <span className="truncate">{pkg.name}</span>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0 ml-1.5 font-bold font-serif">
                                            <span>{item.treatment.currency || '£'}{pkg.price}</span>
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          )}

                          {/* Desktop Tier Switcher (Visible on sm and larger) */}
                          <div className="hidden sm:block mt-3">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-stone-500 block mb-1">
                              Selected Tier / Package:
                            </label>
                            <div className="space-y-1.5">
                              {availablePackages.map((pkg: PricingPackage) => {
                                const isSelected = item.selectedPackage.id === pkg.id;

                                return (
                                  <button
                                    key={pkg.id}
                                    type="button"
                                    onClick={() => updateTreatmentPackage(item.treatment.id, pkg)}
                                    className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between border cursor-pointer ${
                                      isSelected
                                        ? 'border-black bg-stone-900 text-white shadow-xs'
                                        : 'border-luxury-border/60 bg-stone-50/60 hover:bg-stone-100 text-stone-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div
                                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                          isSelected
                                            ? 'border-luxury-gold bg-luxury-gold text-black'
                                            : 'border-stone-400'
                                        }`}
                                      >
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-black" />}
                                      </div>
                                      <span className="truncate font-medium">{pkg.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                      {pkg.savingsBadge && !isSelected && (
                                        <span className="text-[9px] bg-[#EA014A]/10 text-[#EA014A] font-bold px-1.5 py-0.2 rounded">
                                          {pkg.savingsBadge}
                                        </span>
                                      )}
                                      <span
                                        className={`font-serif font-bold ${
                                          isSelected ? 'text-luxury-gold' : 'text-stone-900'
                                        }`}
                                      >
                                        {item.treatment.currency || '£'}
                                        {pkg.price}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Desktop only: Included Protocols summary */}
                            {item.selectedPackage.includes && item.selectedPackage.includes.length > 0 && (
                              <div className="mt-2 p-2 rounded-lg bg-[#FAF7F2] border border-luxury-border/40 text-[10px] text-stone-600">
                                <span className="font-semibold text-stone-800 block mb-0.5">
                                  Includes ({item.selectedPackage.sessions} {item.selectedPackage.sessions === 1 ? 'Session' : 'Sessions'}):
                                </span>
                                <ul className="space-y-0.5 list-disc list-inside">
                                  {item.selectedPackage.includes.slice(0, 2).map((inc, i) => (
                                    <li key={i} className="truncate">{inc}</li>
                                  ))}
                                  {item.selectedPackage.includes.length > 2 && (
                                    <li className="text-luxury-gold italic">
                                      + {item.selectedPackage.includes.length - 2} more protocols
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer: Total Breakdown & Direct Booking Action */}
              {treatmentCart.length > 0 && (
                <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-luxury-border/50 bg-[#FAF7F2] space-y-3 sm:space-y-4 shrink-0">
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-luxury-subtext">
                      <span>Planned Procedures</span>
                      <span className="font-medium text-stone-900">
                        {totalTreatmentCount} ({totalSessions} Sessions)
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex justify-between items-center text-emerald-700 font-medium text-xs sm:text-sm">
                        <span>Course Savings</span>
                        <span>-{currency}{totalSavings.toFixed(0)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm sm:text-lg font-bold text-luxury-text pt-2 border-t border-luxury-border/50">
                      <span className="font-serif">Estimated Total</span>
                      <span className="font-serif text-black">
                        {currency}{treatmentSubtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-luxury-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <span>No upfront charge required — fee settled upon clinical consultation</span>
                  </div>

                  {!isOnConsultationSection && (
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white py-3 sm:py-3.5 rounded-full font-sans font-medium tracking-wider transition-all shadow-md hover:shadow-lg text-xs sm:text-sm uppercase flex items-center justify-center gap-2 cursor-pointer border border-luxury-gold/50"
                    >
                      <span>Book Treatment Plan</span>
                      <ArrowRight className="h-4 w-4 text-luxury-gold" />
                    </button>
                  )}

                  <button
                    onClick={clearTreatmentCart}
                    className="w-full text-center text-[10px] sm:text-[11px] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer py-0.5"
                  >
                    Clear Treatment Plan
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TreatmentCartDrawer;
