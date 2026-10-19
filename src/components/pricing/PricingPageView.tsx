import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  TREATMENT_PRICING_DATA,
  PRICING_CATEGORIES,
  TreatmentPricingItem,
  PricingCategory,
  PricingPackage,
} from '../../data/treatmentPricing';
import { getTreatmentPricingData, getTreatmentDetailsConfig, fetchRemoteTreatmentPricingData } from '../../lib/adminStore';
import { PricingCard } from './PricingCard';
import { PackageSelectModal } from './PackageSelectModal';
import { TreatmentVisualBanner } from './TreatmentVisualBanner';
import {
  Search,
  ArrowLeft,
  ArrowUpDown,
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  X,
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTreatmentCart } from '../../context/TreatmentCartContext';

export interface TreatmentSubOptionConfig {
  id: string;
  label: string;
  filter: (item: TreatmentPricingItem) => boolean;
}

export const TREATMENT_CATEGORY_SUB_OPTIONS: Record<string, TreatmentSubOptionConfig[]> = {
  'Face & Injectables': [
    {
      id: 'anti-wrinkle',
      label: 'Anti-Wrinkle (Botox)',
      filter: (item) => item.id.startsWith('botox-'),
    },
    {
      id: 'dermal-fillers',
      label: 'Dermal Fillers (1ml)',
      filter: (item) => item.id.startsWith('filler-'),
    },
    {
      id: 'skin-boosters-lifting',
      label: 'Skin Boosters & Lifting',
      filter: (item) =>
        item.id.includes('profhilo') ||
        item.id.includes('salmon-sperm') ||
        item.id.includes('morpheus8-facial') ||
        item.id.includes('emface') ||
        item.id.includes('endolift') ||
        item.id.includes('co2-laser'),
    },
  ],
  'Body Sculpting': [
    {
      id: 'fat-dissolving',
      label: 'Fat Dissolving (Aqualyx & Deso)',
      filter: (item) => item.id.startsWith('aqualyx-') || item.id.startsWith('deso-'),
    },
    {
      id: 'body-contouring',
      label: 'Body Contouring & Fat Loss',
      filter: (item) =>
        item.id.includes('cryo') ||
        item.id.includes('emsculpt') ||
        item.id.includes('slimming-pen') ||
        item.id.includes('cellulite'),
    },
    {
      id: 'high-tech-body',
      label: 'High-Tech Body & Tightening',
      filter: (item) => item.id.includes('morpheus8-body'),
    },
  ],
  'Advanced Facials': [
    {
      id: 'clinical-medical',
      label: 'Clinical & Medical Facials',
      filter: (item) =>
        item.id.includes('aquafacial') ||
        item.id.includes('glass-skin') ||
        item.id.includes('microneedling') ||
        item.id.includes('bb-glow') ||
        item.id.includes('diamond-microdermabrasion') ||
        item.id.includes('regenerative-scalp'),
    },
    {
      id: 'specials',
      label: 'Monday & Friday Specials',
      filter: (item) =>
        item.id.includes('gold-facial') ||
        item.id.includes('egf-facial') ||
        item.id.includes('red-carpet') ||
        item.id.includes('idebenone'),
    },
    {
      id: 'light-oxygen',
      label: 'Light, Oxygen & Extractions',
      filter: (item) =>
        item.id.includes('oxygen') ||
        item.id.includes('led-light') ||
        item.id.includes('high-frequency') ||
        item.id.includes('extractions'),
    },
  ],
  'Hair & Beauty': [
    {
      id: 'beauty-lashes-spmu',
      label: 'Beauty, Lashes & SPMU',
      filter: (item) =>
        item.id.includes('lash') ||
        item.id.includes('brow') ||
        item.id.includes('spmu') ||
        item.id.includes('tattoo-removal') ||
        item.id.includes('party-makeup'),
    },
    {
      id: 'hair-salon',
      label: 'Hair Salon & Trichology',
      filter: (item) =>
        item.id.includes('hair-salon') ||
        item.id.includes('hair-colour') ||
        item.id.includes('hair-treatments') ||
        item.id.includes('mens-kids'),
    },
    {
      id: 'laser-hair-removal',
      label: 'Laser Hair Removal & Waxing',
      filter: (item) =>
        item.id.includes('laser-') ||
        item.id.includes('electrolysis') ||
        item.id.includes('body-waxing'),
    },
  ],
  'IV Drip Lounge & Wellness': [
    {
      id: 'iv-drips',
      label: 'IV Nutrient Infusions',
      filter: (item) =>
        item.id.includes('iv-') &&
        !item.id.includes('b12') &&
        !item.id.includes('iron-shot'),
    },
    {
      id: 'booster-shots',
      label: 'Booster Vitamin Shots',
      filter: (item) => item.id.includes('b12') || item.id.includes('iron-shot'),
    },
    {
      id: 'prp-regenerative',
      label: 'PRP Regenerative Therapy',
      filter: (item) => item.id.startsWith('prp-'),
    },
  ],
};

const SORT_OPTIONS: Array<{ id: 'featured' | 'price-asc' | 'price-desc' | 'name-asc'; label: string }> = [
  { id: 'featured', label: 'Featured Order' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Alphabetical: A to Z' },
];

interface PricingPageViewProps {
  onClose: () => void;
  onBookClick?: (serviceName?: string) => void;
  initialCategoryFilter?: string;
}

export const PricingPageView: React.FC<PricingPageViewProps> = ({
  onClose,
  onBookClick,
  initialCategoryFilter,
}) => {
  const {
    addTreatment,
    openTreatmentCart,
    totalTreatmentCount,
  } = useTreatmentCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategoryFilter || 'All Procedures'
  );
  const [selectedSubOptions, setSelectedSubOptions] = useState<string[]>([]);
  const [activeFloatingCategory, setActiveFloatingCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [activePackageModalTreatment, setActivePackageModalTreatment] = useState<TreatmentPricingItem | null>(null);
  const [selectedPackageInitialId, setSelectedPackageInitialId] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<string | null>(null);

  // Helper to merge pricing data with custom treatment details (coverMedia and imageUrl)
  const getMergedPricingData = () => {
    const rawPricing = getTreatmentPricingData();
    const detailsDb = getTreatmentDetailsConfig();
    if (!detailsDb) return rawPricing;

    return rawPricing.map(item => {
      const match = detailsDb[item.id] || Object.values(detailsDb).find((d: any) => 
        (d.id && d.id.toLowerCase() === item.id.toLowerCase()) || 
        (d.title && d.title.toLowerCase() === item.title.toLowerCase())
      );
      if (match && (match.coverMedia?.url || match.imageUrl)) {
        return {
          ...item,
          image: match.coverMedia?.url || match.imageUrl || item.image,
          coverMedia: match.coverMedia || item.coverMedia
        };
      }
      return item;
    });
  };

  // Dynamic treatment pricing data initialized from admin store with live update subscription
  const [pricingData, setPricingData] = useState<TreatmentPricingItem[]>(() => getMergedPricingData());

  useEffect(() => {
    const refreshPricing = () => {
      setPricingData(getMergedPricingData());
    };

    // On mount, also pull remote server customizations (siteCustomizations.json) so deployed clients get the latest edits!
    fetchRemoteTreatmentPricingData().then(() => {
      refreshPricing();
    }).catch(() => {});

    window.addEventListener('treatment_pricing_updated', refreshPricing);
    window.addEventListener('treatment_details_updated', refreshPricing);
    return () => {
      window.removeEventListener('treatment_pricing_updated', refreshPricing);
      window.removeEventListener('treatment_details_updated', refreshPricing);
    };
  }, []);

  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(57);
  const orderMenuRef = useRef<HTMLDivElement>(null);
  const floatingModalRef = useRef<HTMLDivElement>(null);

  // Measure sticky header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (orderMenuRef.current && !orderMenuRef.current.contains(e.target as Node)) {
        setIsOrderMenuOpen(false);
      }
      if (floatingModalRef.current && !floatingModalRef.current.contains(e.target as Node)) {
        setActiveFloatingCategory(null);
      }
    };
    if (isOrderMenuOpen || activeFloatingCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOrderMenuOpen, activeFloatingCategory]);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All Procedures') {
      setSelectedCategory('All Procedures');
      setSelectedSubOptions([]);
      setActiveFloatingCategory(null);
      return;
    }

    if (selectedCategory !== cat) {
      setSelectedCategory(cat);
      setSelectedSubOptions([]); // Unselected by default
      setActiveFloatingCategory(cat); // Open floating modal!
    } else {
      // Toggle floating modal if clicking active category
      setActiveFloatingCategory((prev) => (prev === cat ? null : cat));
    }
  };

  const handleToggleSubOption = (optionId: string) => {
    setSelectedSubOptions((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
    );
  };

  // Filtered & Sorted Treatments
  const filteredTreatments = useMemo(() => {
    // Only display active, non-hidden procedures to clients
    let list = pricingData.filter((item) => !item.hidden && item.isActive !== false);

    // Category Filter
    if (selectedCategory !== 'All Procedures') {
      list = list.filter((item) => item.category === selectedCategory);

      // Multi-select sub-option filter within category:
      // When one or more options are selected, show treatments matching ANY selected option
      if (selectedSubOptions.length > 0) {
        const catOptions = TREATMENT_CATEGORY_SUB_OPTIONS[selectedCategory];
        const activeFilters = catOptions?.filter((o) => selectedSubOptions.includes(o.id));
        if (activeFilters && activeFilters.length > 0) {
          list = list.filter((item) => activeFilters.some((f) => f.filter(item)));
        }
      }
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.packages.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        list.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-desc':
        list.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'name-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'featured':
      default:
        // Prioritize popular items, then original order
        list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    return list;
  }, [selectedCategory, selectedSubOptions, searchQuery, sortOption]);

  const handleBookPackage = (treatment: TreatmentPricingItem, pkg: PricingPackage) => {
    setActivePackageModalTreatment(null);
    // Add directly to global Treatment Cart and open the Treatment Plan drawer
    addTreatment(treatment, pkg, 1, true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-luxury-text flex flex-col selection:bg-[#D8C2A3]/30">
      {/* 1. Sticky Clean Top Bar matching Shop page */}
      <header ref={headerRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-luxury-border shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3.5 flex items-center justify-between gap-4">
          {/* Back to Clinic Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7a6242] hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#bda380]" />
            <span>Back to Clinic</span>
          </button>

          {/* Center Brand Title */}
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-light tracking-wide text-stone-900 hidden sm:inline">
              Treatment & Procedure Rates
            </span>
          </div>

          {/* Right Actions: Treatment Plan Drawer Button + Direct Consultation Booking */}
          <div className="flex items-center gap-3">
            <button
              onClick={openTreatmentCart}
              className="flex items-center space-x-2 bg-white/95 border border-[#D8C2A3]/70 hover:border-black text-stone-900 px-3.5 sm:px-4 py-1.5 rounded-full shadow-xs transition-all text-xs font-semibold cursor-pointer relative"
              aria-label="View Planned Treatments"
            >
              <Calendar className="h-3.5 w-3.5 text-[#a88d6b]" />
              <span>Plan ({totalTreatmentCount})</span>
            </button>

            <button
              onClick={() => {
                if (onBookClick) onBookClick('Skincare Consultation');
              }}
              className="bg-black hover:bg-neutral-900 text-white px-4 sm:px-5 py-2 rounded-full border border-luxury-gold/50 shadow-xs transition-all text-xs sm:text-sm font-sans font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="hidden sm:inline">Book Consultation</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2.5 text-xs sm:text-sm border border-luxury-gold/40"
          >
            <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-0 flex-1 w-full">
        {/* 2. Page Header & Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-sans font-medium text-luxury-gold uppercase tracking-[0.25em] block mb-2">
            Age Reversal Clinical Distinction
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-luxury-text mb-3 sm:mb-4 tracking-tight leading-tight">
            Treatment Pricing & Packages
          </h1>
        </div>

        {/* 3. Search & Sorting Control Bar */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search procedures (e.g. Exosome, Morpheus8, Botox)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#D8C2A3]/70 focus:border-stone-900 rounded-full text-xs sm:text-sm focus:outline-none transition-all shadow-2xs placeholder:text-stone-400 font-light"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Count & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <span className="text-xs sm:text-sm text-stone-500 font-light">
              Showing <strong className="text-stone-900 font-semibold">{filteredTreatments.length}</strong> treatments
            </span>

            {/* Sort Order Menu */}
            <div className="relative" ref={orderMenuRef}>
              <button
                type="button"
                onClick={() => setIsOrderMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                  isOrderMenuOpen
                    ? 'bg-black text-white border-black'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border-[#D8C2A3]/70'
                }`}
                aria-expanded={isOrderMenuOpen}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#bda380]" />
                <span>
                  {SORT_OPTIONS.find((s) => s.id === sortOption)?.label}
                </span>
              </button>

              <AnimatePresence>
                {isOrderMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-luxury-border/90 p-2 z-50 flex flex-col gap-1"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortOption(opt.id);
                          setIsOrderMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          sortOption === opt.id
                            ? 'bg-stone-100 text-stone-900 font-semibold'
                            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 4. Category Filter Tabs & Floating Options Modal - Sticky on All Screens when scrolled to top */}
        <div
          ref={floatingModalRef}
          style={{ top: `${headerHeight}px` }}
          className="sticky z-30 -mx-4 sm:-mx-6 md:-mx-12 px-4 sm:px-6 md:px-12 py-3 mb-6 sm:mb-8 bg-[#faf8f5]/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs transition-shadow"
        >
          {/* Main Category Tabs - Horizontal scrollable pills */}
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 pb-1 md:pb-0 min-w-max">
              {PRICING_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const activeCount = isActive ? selectedSubOptions.length : 0;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={(e) => {
                      e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      handleCategoryClick(cat);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'bg-black text-white shadow-sm border border-black'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-luxury-border/90 hover:border-luxury-gold/50'
                    }`}
                  >
                    <span>{cat}</span>
                    {activeCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-semibold bg-white text-black">
                        {activeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floating UI: Floats directly ABOVE the cards without taking space below options */}
          <AnimatePresence>
            {activeFloatingCategory && TREATMENT_CATEGORY_SUB_OPTIONS[activeFloatingCategory] && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-4 right-4 sm:left-0 sm:right-auto z-40 mt-2 max-w-xl sm:w-full"
              >
                <div className="bg-white/98 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl shadow-stone-900/15 p-3.5 sm:p-4">
                  <div className="flex items-center justify-between gap-3 mb-2.5 pb-2 border-b border-stone-100">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-800">
                      {activeFloatingCategory} Options
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedSubOptions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedSubOptions([])}
                          className="text-[11px] text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveFloatingCategory(null)}
                        className="p-1 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        aria-label="Close options"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Options appear directly on the modal, multi-selectable */}
                  <div className="flex flex-wrap items-center gap-2">
                    {TREATMENT_CATEGORY_SUB_OPTIONS[activeFloatingCategory].map((opt) => {
                      const isSelected = selectedSubOptions.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleToggleSubOption(opt.id)}
                          className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                            isSelected
                              ? 'bg-black text-white shadow-xs border border-black'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/80 hover:border-stone-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. Pricing Cards Grid (2 per row on mobile screens) */}
        {filteredTreatments.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredTreatments.map((treatment) => (
              <PricingCard
                key={treatment.id}
                treatment={treatment}
                onChoosePackage={(t) => {
                  setSelectedPackageInitialId(undefined);
                  setActivePackageModalTreatment(t);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 sm:py-24 text-center bg-white rounded-3xl border border-luxury-border/80 p-8 shadow-xs max-w-lg mx-auto">
            <Search className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-xl font-serif text-stone-800 mb-2">No treatments found</h3>
            <p className="text-sm text-stone-500 font-light mb-6">
              We couldn't find any procedures matching "{searchQuery}". Try selecting another category or clearing your search.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Procedures');
                setSelectedSubOptions([]);
                setActiveFloatingCategory(null);
              }}
              className="bg-black hover:bg-neutral-900 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Treatment Visual Banner Component */}
        <TreatmentVisualBanner />

        {/* 6. Bottom Information & Consultation Banner (Full bleed to screen edges on mobile) */}
        <div className="mt-8 sm:mt-12 mb-0 -mx-4 sm:mx-0 px-4 py-8 sm:p-10 rounded-none sm:rounded-3xl bg-gradient-to-br from-white via-[#fbf8f3] to-[#f4ebe1] border-y sm:border border-[#D8C2A3]/50 shadow-xs text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs font-sans font-semibold text-luxury-gold uppercase tracking-[0.2em] block mb-2">
              Bespoke Treatment Combinations
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-luxury-text mb-3">
              Require a Tailored Treatment Protocol?
            </h3>
            <p className="text-xs sm:text-sm text-luxury-subtext font-light leading-relaxed mb-6">
              Many of our patients benefit from multi-modality combinations (e.g. Morpheus8 paired with Exosomes or Polynucleotides). Book a comprehensive in-depth medical consultation with our leading practitioners for a bespoke aesthetic roadmap.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (onBookClick) onBookClick('Comprehensive Aesthetic Consultation');
                }}
                className="bg-black hover:bg-neutral-900 text-white px-7 sm:px-9 py-3.5 rounded-full border border-luxury-gold/50 shadow-md hover:shadow-xl transition-all duration-300 font-sans font-medium text-xs sm:text-sm flex items-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-luxury-gold" />
                <span>Book Diagnostic Consultation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Package Selection Modal */}
      {activePackageModalTreatment && (
        <PackageSelectModal
          treatment={activePackageModalTreatment}
          initialPackageId={selectedPackageInitialId}
          onClose={() => {
            setActivePackageModalTreatment(null);
            setSelectedPackageInitialId(undefined);
          }}
          onBookPackage={handleBookPackage}
        />
      )}
    </div>
  );
};

export default PricingPageView;
