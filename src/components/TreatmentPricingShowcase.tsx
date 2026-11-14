import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TreatmentPricingCardSummary,
  TreatmentPricingItem,
  PricingPackage,
  TreatmentTaxonomyGroup,
} from '../data/treatmentPricing';
import {
  getPaginatedTreatmentCards,
  fetchPaginatedTreatmentCards,
  getTreatmentTaxonomy,
  fetchRemoteTreatmentTaxonomy,
} from '../lib/adminStore';
import { PricingCard } from './pricing/PricingCard';
import { PackageSelectModal } from './pricing/PackageSelectModal';
import Pagination from './Pagination';
import { LogoOutlineSkeleton } from './common/LogoOutlineSkeleton';
import { useTreatmentCart } from '../context/TreatmentCartContext';

interface TreatmentPricingShowcaseProps {
  onViewAllPricingClick?: (categoryFilter?: string) => void;
}

const ITEMS_PER_PAGE = 6;

export default function TreatmentPricingShowcase({
  onViewAllPricingClick,
}: TreatmentPricingShowcaseProps) {
  const { addTreatment } = useTreatmentCart();
  const sectionRef = useRef<HTMLElement | null>(null);

  const [taxonomy, setTaxonomy] = useState<TreatmentTaxonomyGroup[]>(() => getTreatmentTaxonomy());
  const [selectedCategory, setSelectedCategory] = useState<string>('All Procedures');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Synchronous initial page with exact projected card summary columns (fields: 'card')
  const initialPageRef = useRef<ReturnType<typeof getPaginatedTreatmentCards> | null>(null);
  if (!initialPageRef.current) {
    initialPageRef.current = getPaginatedTreatmentCards({
      page: 1,
      offset: 0,
      limit: ITEMS_PER_PAGE,
      category: 'All Procedures',
      sort: 'featured',
      fields: 'card',
      taxonomy,
    });
  }

  const [cards, setCards] = useState<TreatmentPricingCardSummary[]>(
    () => initialPageRef.current?.items || []
  );
  const [totalCount, setTotalCount] = useState<number>(
    () => initialPageRef.current?.totalCount || 0
  );
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);
  const [activeModalTreatment, setActiveModalTreatment] = useState<
    TreatmentPricingCardSummary | TreatmentPricingItem | null
  >(null);

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  // Load a specific page with exact projected card columns (fields: 'card')
  const loadPage = useCallback(
    async (page: number, category: string, activeTaxonomy: TreatmentTaxonomyGroup[]) => {
      const offset = (page - 1) * ITEMS_PER_PAGE;

      // Immediate local projection for zero-flash responsiveness
      const localResult = getPaginatedTreatmentCards({
        page,
        offset,
        limit: ITEMS_PER_PAGE,
        category,
        sort: 'featured',
        fields: 'card',
        taxonomy: activeTaxonomy,
      });
      setCards(localResult.items);
      setTotalCount(localResult.totalCount);

      setIsLoadingPage(true);
      try {
        const remoteResult = await fetchPaginatedTreatmentCards({
          page,
          offset,
          limit: ITEMS_PER_PAGE,
          category,
          sort: 'featured',
          fields: 'card',
          taxonomy: activeTaxonomy,
        });
        setCards(remoteResult.items);
        setTotalCount(remoteResult.totalCount);
      } finally {
        setIsLoadingPage(false);
      }
    },
    []
  );

  useEffect(() => {
    loadPage(currentPage, selectedCategory, taxonomy);
  }, [currentPage, selectedCategory, taxonomy, loadPage]);

  // Listen for live admin updates to pricing or taxonomy
  useEffect(() => {
    fetchRemoteTreatmentTaxonomy()
      .then((remoteTax) => {
        if (remoteTax && remoteTax.length > 0) {
          setTaxonomy(remoteTax);
        }
      })
      .catch(() => {});

    const handleStoreUpdate = () => {
      const nextTax = getTreatmentTaxonomy();
      setTaxonomy(nextTax);
      loadPage(currentPage, selectedCategory, nextTax);
    };

    window.addEventListener('treatment_pricing_updated', handleStoreUpdate);
    window.addEventListener('treatment_taxonomy_updated', handleStoreUpdate);
    window.addEventListener('master_services_updated', handleStoreUpdate);
    window.addEventListener('storage', handleStoreUpdate);
    return () => {
      window.removeEventListener('treatment_pricing_updated', handleStoreUpdate);
      window.removeEventListener('treatment_taxonomy_updated', handleStoreUpdate);
      window.removeEventListener('master_services_updated', handleStoreUpdate);
      window.removeEventListener('storage', handleStoreUpdate);
    };
  }, [currentPage, selectedCategory, loadPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (sectionRef.current) {
      const yOffset = -90;
      const y = sectionRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleBookPackage = useCallback(
    (treatment: TreatmentPricingItem, selectedPkg: PricingPackage) => {
      addTreatment(treatment, selectedPkg, 1, true);
      setActiveModalTreatment(null);
    },
    [addTreatment]
  );

  return (
    <section
      ref={sectionRef}
      id="treatment-pricing-showcase"
      className="py-12 sm:py-20 md:py-24 bg-[#faf8f5] border-b border-luxury-border/50 relative isolate transform-gpu"
    >
      <div className="container mx-auto px-4 md:px-12 max-w-7xl">
        {/* Section Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5 sm:gap-8 mb-8 sm:mb-10">
          <div className="max-w-3xl">
            <span className="text-[10px] sm:text-xs font-sans font-semibold text-luxury-gold uppercase tracking-[0.2em] block mb-2">
              Transparent Clinical Investment
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-4 tracking-tight leading-tight">
              Treatment <span className="italic text-luxury-gold">packages &amp; pricing</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm md:text-base text-luxury-subtext font-light leading-relaxed">
              Explore our individual procedures and multi-session clinical courses. Select any treatment below to view session options and bespoke package benefits.
            </p>
          </div>

          {onViewAllPricingClick && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={() =>
                  onViewAllPricingClick(
                    selectedCategory !== 'All Procedures' ? selectedCategory : undefined
                  )
                }
                className="bg-white sm:bg-white/95 sm:backdrop-blur-md border border-luxury-border/80 text-silver-900 px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full hover:bg-white hover:border-luxury-gold transition-all duration-300 font-sans text-xs sm:text-sm font-medium tracking-wide flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>View full price list ({totalCount})</span>
                <ChevronRight className="h-4 w-4 text-silver-500" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </header>

        {/* Category Filter Pills */}
        <div className="overflow-x-auto no-scrollbar mb-6 sm:mb-8">
          <div className="flex items-center gap-2 pb-1 min-w-max">
            {['All Procedures', ...taxonomy.map((b) => b.name)].map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'bg-black text-white shadow-sm border border-black'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-luxury-border/90 hover:border-luxury-gold/50'
                  }`}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {cards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 isolate transform-gpu">
            <AnimatePresence mode="wait">
              {cards.map((treatment) => (
                <motion.div
                  key={`${selectedCategory}-${currentPage}-${treatment.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="h-full"
                >
                  <PricingCard
                    treatment={treatment}
                    onChoosePackage={(item) => setActiveModalTreatment(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : isLoadingPage ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
              <div
                key={`showcase-skeleton-${idx}`}
                className="flex h-full flex-col rounded bg-transparent sm:bg-mist overflow-hidden border border-stone-200/50 animate-pulse"
              >
                <div className="h-44 sm:h-72 md:h-80 bg-gradient-to-b from-[#0e141b] via-[#141b24] to-[#0a0e13] flex items-center justify-center relative">
                  <LogoOutlineSkeleton size="lg" variant="gold" animate={true} />
                </div>
                <div className="flex flex-1 flex-col justify-between space-y-3 sm:space-y-4 px-3 sm:px-4 py-3 sm:py-4 bg-white/60">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-stone-200 rounded" />
                    <div className="h-7 w-24 bg-stone-200 rounded" />
                    <div className="hidden md:block h-4 w-full bg-stone-200 rounded" />
                  </div>
                  <div className="h-9 w-full md:w-36 bg-stone-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* App's "1, 2, 3" Style Pagination */}
        <div className="pt-1 pb-0 sm:py-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* On-Demand Package Selection Modal */}
      {activeModalTreatment && (
        <PackageSelectModal
          treatment={activeModalTreatment}
          onClose={() => setActiveModalTreatment(null)}
          onBookPackage={handleBookPackage}
        />
      )}
    </section>
  );
}
