import { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, ChevronDown, ChevronRight, ChevronLeft, Gift, ThumbsUp, BookOpen, HelpCircle, Phone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderConfig } from '../types';
import { CLINIC_INFO, CLINIC_DATA } from '../data/clinicInfo';
import { useCart } from '../context/CartContext';
import { useTreatmentCart } from '../context/TreatmentCartContext';

interface HeaderProps {
  onBookClick: (serviceName?: string) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onTreatmentClick?: (treatmentName: string) => void;
  headerConfig?: HeaderConfig;
  onAboutClick?: () => void;
  onShopClick?: (rangeFilter?: string) => void;
  onPricingClick?: (categoryFilter?: string) => void;
  onTransformationsClick?: () => void;
  onReviewsClick?: () => void;
}

interface MegaColumn {
  title: string;
  items: string[];
}

interface NavItem {
  name: string;
  desktopName?: string;
  mobileName?: string;
  id: string;
  href?: string;
  isMega?: boolean;
  hideOnDesktop?: boolean;
  imageUrl?: string;
  megaColumns?: MegaColumn[];
  procedures?: { name: string; desc?: string; id?: string }[];
}

export default function Header({
  onBookClick,
  activeSection,
  setActiveSection,
  onTreatmentClick,
  headerConfig,
  onAboutClick,
  onShopClick,
  onPricingClick,
  onTransformationsClick,
  onReviewsClick,
}: HeaderProps) {
  const { openCart, totalCartCount } = useCart();
  const { openTreatmentCart, totalTreatmentCount } = useTreatmentCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<NavItem | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      
      // Always show when near the top to prevent flickering
      if (currentScrollY <= 120) {
        setIsVisible(true);
        setIsScrolled(currentScrollY > 50);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Past 120px, check scroll direction with tolerance to prevent jitter
      if (Math.abs(delta) >= 8) {
        const nextVisible = !(currentScrollY > lastScrollY.current && !hoveredItem && !isMobileMenuOpen);
        setIsVisible(nextVisible);
        lastScrollY.current = currentScrollY;
      }
      
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hoveredItem, isMobileMenuOpen]);

  const navItems: NavItem[] = [
    {
      name: 'Our Clinic',
      id: 'home',
      href: '#home'
    },
    {
      name: 'Face & Injectables',
      desktopName: 'Face & Injectables',
      mobileName: 'Face & Injectables',
      id: 'face-injectables',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'ANTI-WRINKLE (BOTOX)',
          items: [
            '1 Area (£180)',
            '2 Areas (£250)',
            '3 Areas (£280)',
            'Forehead Lines (£230)',
            'Jaw Slimming / Masseter (£320)',
            'Bunny Lines (£160)',
            'Crow\'s Feet (£160)',
            'Lip Flip (£160)',
            'Gummy Smile (£160)',
            'Puppet Lines (£160)',
            'Neck Bands (£290 / Extended £370)'
          ]
        },
        {
          title: 'DERMAL FILLERS (1ML)',
          items: [
            'Cheeks Soft Volumisation (£290)',
            'Cheeks Deep Contouring (£350)',
            'Lip Enhancement (£290)',
            'Non-Surgical Rhinoplasty (from £290)',
            'Tear Troughs & Under Eyes (£290)',
            'Temples Rejuvenation (£290)',
            'Jaw & Chin Contouring (£350)',
            'Cleavage & Neck Lines (£290)',
            'Hand Rejuvenation (£470)'
          ]
        },
        {
          title: 'SKIN BOOSTERS & LIFTING',
          items: [
            'Profhilo 2ml (£350 / Course £560)',
            'Polynucleotides / Salmon Sperm (from £350)',
            'Morpheus8 Facial (£190)',
            'Emface Tightening & Lifting (from £250)',
            'Endolift Fiber Lift (from £950)',
            'Fractional CO2 Laser Face & Neck (£300)'
          ]
        }
      ]
    },
    {
      name: 'Body Sculpting',
      desktopName: 'Body',
      mobileName: 'Body Sculpting',
      id: 'body-sculpting',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'FAT DISSOLVING INJECTIONS',
          items: [
            'Aqualyx Small Area (£170)',
            'Aqualyx Medium Area (£190)',
            'Aqualyx Large Area (£230)',
            'Aqualyx Course of 3 (from £408)',
            'Desoface Single (£150)',
            'Desobody Single (£170 - £210)',
            'Deso Course of 3 (from £360)'
          ]
        },
        {
          title: 'BODY CONTOURING & FAT LOSS',
          items: [
            'Cryo Fat Freezing (from £95)',
            'EMSCULPT Body Sculpt (from £275)',
            'Medical Slimming Pen (1 Mo £155 / 3 Mo £450)',
            'Cellulite & Fat Loss (£195)',
            'Morpheus8 Body Sculpting (£200)'
          ]
        },
        {
          title: 'BUTTOCK & TIGHTENING',
          items: [
            'Non-Surgical Buttock Lift (Lanluma / Sculptra)',
            'Hip Dip Correction',
            'CO2 Laser Scars & Stretch Marks (£100 - £200)',
            'Excessive Sweating Hyperhidrosis'
          ]
        }
      ]
    },
    {
      name: 'Advanced Facials',
      desktopName: 'Advanced Facials',
      mobileName: 'Advanced Facials',
      id: 'advanced-facials',
      hideOnDesktop: true,
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'CLINICAL & MEDICAL FACIALS',
          items: [
            'Medical Aquafacial (£150)',
            'Ultimate Glass Skin Protocol (£250)',
            'Microneedling Collagen Induction (£150)',
            'BB Glow Mesotherapy (£180)',
            'Diamond Microdermabrasion (£60)'
          ]
        },
        {
          title: 'LIGHT & OXYGEN PROTOCOLS',
          items: [
            'Oxygen O2 Dome Therapy (£90)',
            'Medical LED Light Therapy (£25)',
            'High Frequency Acne Treatment (£55)'
          ]
        },
        {
          title: 'WEEKLY CLINICAL SPECIALS',
          items: [
            'Gold Special Facial (£95)',
            'Idebenone Antioxidant Facial (£105)',
            'EGF Cellular Growth Factor (£115)',
            'Red Carpet Celebrity Glow (£120)'
          ]
        }
      ]
    },
    {
      name: 'Beauty & Hair',
      desktopName: 'Beauty & Hair',
      mobileName: 'Hair & Beauty',
      id: 'hair-beauty',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'PRP & REGENERATIVE HAIR',
          items: [
            'PRP for Hair Loss (£150)',
            'PRP Facial / Vampire (from £120)',
            'PRP Cosmetic Injections'
          ]
        },
        {
          title: 'BEAUTY, LASHES & SPMU',
          items: [
            'Classic Lashes (£55) / Russian (£65)',
            'Lash Lift & Tint (£30)',
            'Brow Wax (£8) & Lamination (£30)',
            'Microblading & Ombré Brows (£250)',
            'Lip Blushing (£250)',
            'Semi-Permanent Eyeliner (£200)',
            'Laser Tattoo Removal (from £350)'
          ]
        },
        {
          title: 'LASER HAIR REMOVAL & SALON',
          items: [
            'Alma Soprano Full Body Laser (from £250)',
            'Bikini (£40) & Underarms',
            'Legs (£65 - £85) & Arms (£40 - £65)',
            'Medical Electrolysis (£50/h)',
            'Hair Salon Cuts, Highlights & Balayage',
            'Keratin (£60) & Hair Botox (£65)',
            'Olaplex Restorative Treatment'
          ]
        }
      ]
    },
    {
      name: 'IV Drip Lounge & Wellness',
      desktopName: 'IV Drip Lounge',
      mobileName: 'IV Drips & Wellness',
      id: 'iv-wellness',
      hideOnDesktop: true,
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'BOOSTER SHOTS',
          items: [
            'Vitamin B12 Booster (£45)',
            'Iron Booster (£75)',
            'Ginko Focus Booster (£80)',
            'Performance Booster (£90)'
          ]
        },
        {
          title: 'WELLNESS & IMMUNITY DRIPS',
          items: [
            'High-Dose Vitamin C (£100)',
            'Vitamin Cocktail (£110)',
            'Detox & Hangover Recovery (£125)',
            'Zinc & Mineral Infusion (£130)'
          ]
        },
        {
          title: 'PREMIUM INFUSIONS',
          items: [
            'Skinny Metabolic Drip (£160)',
            'Cinderella Glow Drip (£200)',
            'Myers Immune Booster (£200)'
          ]
        }
      ]
    },
    {
      name: 'Pricing',
      id: 'pricing',
      procedures: [
        { name: 'Specialist Treatment Rates', id: 'preferred-consultation', desc: 'Browse all clinical procedure fees' },
        { name: 'Consultation Price Calculator', id: 'preferred-consultation', desc: 'Custom estimated cost builder' },
        { name: 'Special Promotional Packages', id: 'offers', desc: 'Seasonal clinical packages & offers' },
        { name: 'Doctor Consultation Booking', id: 'preferred-consultation', desc: 'Book with leading Harley St practitioners' }
      ]
    },
    {
      name: 'Shop',
      id: 'shop',
      hideOnDesktop: true,
      procedures: [
        { name: 'Skincare Essentials Collection', id: 'essentials', desc: 'Dermatologist-formulated daily care' },
        { name: 'Anti-Aging & Cellular Serums', id: 'essentials', desc: 'Potent restorative active formulas' },
        { name: 'Post-Procedure Recovery', id: 'essentials', desc: 'Calming and regenerative care' },
        { name: 'View Full Skincare Range', id: 'essentials', desc: 'Explore all clinic-exclusive products' }
      ]
    },
    {
      name: 'More',
      id: 'more',
      procedures: [
        { name: 'Clinical Skincare Shop', id: 'shop', desc: 'Dermatologist-formulated skincare range' },
        { name: 'Before & After Gallery', id: 'gallery', desc: 'Real patient transformation results' },
        { name: 'Patient Reviews & Stories', id: 'reviews', desc: 'Verified 5-star clinical feedback' },
        { name: 'Medical Leadership & Team', id: 'leadership', desc: 'Meet our consultants & doctors' },
        { name: 'Our Clinics & Locations', id: 'locations', desc: 'Harley Street London & Lewisham' },
        { name: 'Facility & Interior Tour', id: 'facility', desc: 'State-of-the-art treatment suites' },
        { name: 'Latest Clinical News', id: 'latest-news', desc: 'Medical research and skincare journal' }
      ]
    }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProcedureClick = (procName: string) => {
    setHoveredItem(null);
    setIsMobileMenuOpen(false);
    if (onTreatmentClick) {
      onTreatmentClick(procName);
    } else {
      onBookClick(procName);
    }
  };

  const handlePageClick = (id: string) => {
    setHoveredItem(null);
    setIsMobileMenuOpen(false);
    if (id === 'shop' && onShopClick) {
      onShopClick();
      return;
    }
    if (id === 'gallery' && onTransformationsClick) {
      onTransformationsClick();
      return;
    }
    if ((id === 'reviews' || id === 'testimonials') && onReviewsClick) {
      onReviewsClick();
      return;
    }
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find currently active mega menu item
  const activeMegaItem = navItems.find(item => item.isMega && hoveredItem === item.id);

  return (
    <header className={`sticky top-0 left-0 right-0 w-full self-start z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-luxury-border/60' : 'bg-white py-3 lg:py-4.5 shadow-xs border-b border-luxury-border/40'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo & Brand */}
        <a href="#home" onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group">
          <img
            alt={`${headerConfig?.primaryName || CLINIC_DATA.name} Logo`}
            decoding="async"
            className="h-10 sm:h-11 lg:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            src={headerConfig?.logoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q"}
          />
          <div className="flex flex-col">
            <span className="text-lg lg:text-xl font-serif font-light tracking-tight text-luxury-text leading-none flex items-center gap-1">
              {headerConfig?.primaryName || CLINIC_DATA.name}
            </span>
            <span className="text-[9px] lg:text-[10px] font-sans font-medium text-luxury-gold tracking-[0.3em] uppercase leading-none mt-1">
              {headerConfig?.secondaryName || "London"}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-3 lg:space-x-4 xl:space-x-5">
          {navItems
            .filter((item) => !item.hideOnDesktop)
            .map((item) => {
              const isHovered = hoveredItem === item.id;
              const isActive = activeSection === item.id;
              const displayName = item.desktopName || item.name;

              return (
                <div
                  key={item.id}
                  className="relative py-2"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.id);
                      }}
                      className={`group relative inline-flex items-center text-[12px] lg:text-[13px] xl:text-sm font-sans font-medium tracking-wider uppercase transition-colors py-1 ${
                        isActive ? 'text-luxury-text font-semibold' : 'text-luxury-subtext hover:text-luxury-text'
                      }`}
                    >
                      <span className="relative pb-1">
                        {displayName}
                        {/* Animated Underline: Expands in gold */}
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-luxury-gold rounded-full transition-all duration-300 ease-out ${
                            isActive ? 'w-full' : 'w-0 group-hover:w-full'
                          }`}
                        />
                      </span>
                    </a>
                  ) : (
                    <button
                      onClick={(e) => {
                        if (item.id === 'pricing' && onPricingClick) {
                          e.preventDefault();
                          setHoveredItem(null);
                          onPricingClick();
                        } else if (item.id === 'shop' && onShopClick) {
                          e.preventDefault();
                          setHoveredItem(null);
                          onShopClick();
                        }
                      }}
                      className={`group relative inline-flex items-center text-[12px] lg:text-[13px] xl:text-sm font-sans font-medium tracking-wider uppercase transition-colors py-1 gap-1.5 cursor-pointer ${
                        isActive || isHovered ? 'text-luxury-text font-semibold' : 'text-luxury-subtext hover:text-luxury-text'
                      }`}
                    >
                      <span className="relative pb-1">
                        {displayName}
                        {/* Animated Underline: Expands in gold */}
                        <span
                          className={`absolute bottom-0 left-0 h-[2px] bg-luxury-gold rounded-full transition-all duration-300 ease-out ${
                            isActive || isHovered ? 'w-full' : 'w-0 group-hover:w-full'
                          }`}
                        />
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHovered ? 'rotate-180 text-luxury-gold' : 'text-luxury-muted group-hover:text-luxury-gold'}`} />
                    </button>
                  )}

                {/* Standard Dropdown Menu (For Non-Mega items) */}
                <AnimatePresence>
                  {!item.isMega && item.procedures && isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute top-full mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-luxury-border/80 p-4 z-50 flex flex-col gap-1 overflow-hidden ${
                        item.id === 'more' || item.id === 'shop'
                          ? 'right-0'
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-luxury-gold/40 via-luxury-gold to-luxury-gold/40" />
                      {item.procedures.map((proc) => (
                        <button
                          key={proc.name}
                          onClick={() => {
                            if (item.id === 'pricing' && onPricingClick) {
                              setHoveredItem(null);
                              onPricingClick();
                            } else if (item.id === 'shop' && onShopClick) {
                              setHoveredItem(null);
                              onShopClick(proc.name);
                            } else if (proc.id) {
                              handlePageClick(proc.id);
                            } else {
                              handleProcedureClick(proc.name);
                            }
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-luxury-secondary transition-all group flex flex-col cursor-pointer"
                        >
                          <span className="text-xs font-sans font-medium text-luxury-text group-hover:text-luxury-gold transition-colors">
                            {proc.name}
                          </span>
                          {proc.desc && (
                            <span className="text-[10px] text-luxury-muted mt-0.5 line-clamp-1 font-light">
                              {proc.desc}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* CTA Button & Cart (Larger Screens Only - lg:flex) */}
        <div className="hidden lg:flex items-center space-x-2.5 xl:space-x-3.5">
          

          {/* Skincare Bag Button */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full border border-luxury-border/80 bg-white hover:bg-stone-50 text-luxury-text hover:text-black transition-all flex items-center gap-2 cursor-pointer shadow-xs group"
            aria-label="Open clinical shopping cart"
            title="View shopping bag"
          >
            <ShoppingBag className="h-4 w-4 text-luxury-muted group-hover:text-luxury-gold transition-colors" strokeWidth={1.5} />
            <span className="hidden xl:inline text-xs font-sans font-medium tracking-wide">Bag</span>
            {totalCartCount > 0 && (
              <span className="bg-black text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center -ml-1 border border-luxury-gold/50 shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={() => onBookClick()}
            className="bg-black hover:bg-neutral-900 text-white border border-luxury-gold/40 px-5 xl:px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 font-sans font-medium tracking-wide flex items-center space-x-2 text-xs uppercase group cursor-pointer"
          >
            <Calendar className="h-3.5 w-3.5 text-luxury-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile Actions (Mobile Screens Only - lg:hidden, NO cart button on mobile) */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => onBookClick()}
            className="bg-black text-white p-2 rounded-full border border-luxury-gold/30 shadow-xs cursor-pointer"
            aria-label="Book appointment"
          >
            <Calendar className="h-4.5 w-4.5 text-luxury-gold" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-luxury-text hover:text-luxury-gold transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* DESKTOP MEGA MENU (70-80% Width, centered) */}
      <AnimatePresence>
        {activeMegaItem && (
          <motion.div
            key={activeMegaItem.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHoveredItem(activeMegaItem.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className="absolute left-1/2 -translate-x-1/2 top-full w-[78vw] max-w-6xl bg-white/95 backdrop-blur-md border border-luxury-border/80 rounded-2xl shadow-2xl z-40 py-8 px-8 mt-2"
          >
            {/* Top decorative gold line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-luxury-gold/30 via-luxury-gold to-luxury-gold/30 rounded-t-2xl" />
            
            <div>
              <div className="grid grid-cols-12 gap-8">
                
                {/* Left Column: Image and Category Title */}
                <div className="col-span-2 flex flex-col pr-4 border-r border-luxury-border/60">
                  <span className="text-xs font-serif font-medium uppercase tracking-[0.18em] text-luxury-text mb-3">
                    {activeMegaItem.desktopName || activeMegaItem.name}
                  </span>
                  {activeMegaItem.imageUrl && (
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md border border-luxury-border/60 group">
                      <img 
                        src={activeMegaItem.imageUrl} 
                        alt={`${activeMegaItem.name} aesthetics`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  )}
                </div>

                {/* Right Columns: Mega Columns */}
                <div className="col-span-10 grid gap-6" style={{ gridTemplateColumns: `repeat(${activeMegaItem.megaColumns?.length || 4}, minmax(0, 1fr))` }}>
                  {activeMegaItem.megaColumns?.map((col) => {
                    return (
                      <div key={col.title} className="flex flex-col">
                        <span className="text-[11px] font-sans font-semibold tracking-wider text-luxury-text mb-3 border-b border-luxury-border/80 pb-1.5 select-none">
                          {col.title}
                        </span>
                        <div className="flex flex-col gap-1">
                          {col.items.map((subItem) => (
                            <button
                              key={subItem}
                              onClick={() => handleProcedureClick(subItem)}
                              className="text-left text-[11px] xl:text-xs text-luxury-subtext hover:text-luxury-gold hover:translate-x-0.5 transition-all py-1 cursor-pointer truncate"
                              title={subItem}
                            >
                              {subItem}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer (Right Slide-over Panel matching requested layout) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveMobileSubmenu(null);
              }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            />

            {/* Slide-Over Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-screen w-[88vw] sm:w-[60vw] md:w-[45vw] bg-[#0d0e10] z-50 text-white shadow-2xl overflow-hidden flex flex-col border-l border-white/10"
            >
              {/* Dynamic Sliding Panes: Main Menu vs Submenu Drill-Down */}
              <div className="relative h-full w-full overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  {!activeMobileSubmenu ? (
                    /* Slide 1: Main Menu View */
                    <motion.div
                      key="main-menu"
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -30, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="no-scrollbar h-screen space-y-1 overflow-y-auto pb-32"
                    >
                      {/* Close Header */}
                      <div className="flex flex-col space-y-2 px-8 py-4">
                        <div className="flex items-center justify-end pb-4">
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setActiveMobileSubmenu(null);
                            }}
                            className="inline-flex items-center w-min rounded-full justify-center text-base whitespace-nowrap p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close"
                          >
                            <X className="h-7 w-7 text-white" strokeWidth={1.5} />
                          </button>
                        </div>

                        

                        {/* Top Section: Treatment Categories Only */}
                        <div className="space-y-1">
                          {navItems
                            .filter((item) => item.isMega)
                            .map((item) => (
                              <div key={item.id} className="py-1">
                                <button
                                  type="button"
                                  onClick={() => setActiveMobileSubmenu(item)}
                                  className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer group"
                                >
                                  <span>{item.mobileName || item.name}</span>
                                  <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2} />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 h-[1px] w-full bg-white/10" />

                      {/* Secondary Section: Pricing, Shop, Special Offers, Transformations, More, About */}
                      <div className="flex flex-col space-y-2 px-8 py-4">
                        <div className="space-y-1">
                          {/* Pricing */}
                          {(() => {
                            const pricingItem = navItems.find((i) => i.id === 'pricing');
                            return pricingItem ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setActiveMobileSubmenu(null);
                                  if (onPricingClick) {
                                    onPricingClick();
                                  } else {
                                    setActiveMobileSubmenu(pricingItem);
                                  }
                                }}
                                className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer group"
                              >
                                <span>Pricing</span>
                                <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2} />
                              </button>
                            ) : null;
                          })()}

                          {/* Shop */}
                          {(() => {
                            const shopItem = navItems.find((i) => i.id === 'shop');
                            return shopItem ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setActiveMobileSubmenu(null);
                                  if (onShopClick) {
                                    onShopClick();
                                  } else {
                                    setActiveMobileSubmenu(shopItem);
                                  }
                                }}
                                className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer group"
                              >
                                <span>Shop</span>
                                <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2} />
                              </button>
                            ) : null;
                          })()}

                          {/* Special Offers */}
                          <button
                            type="button"
                            onClick={() => handlePageClick('offers')}
                            className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer"
                          >
                            <span>Special Offers</span>
                            <ChevronRight className="h-6 w-6 text-white/70" strokeWidth={2} />
                          </button>

                          {/* Transformations */}
                          <button
                            type="button"
                            onClick={() => handlePageClick('gallery')}
                            className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer"
                          >
                            <span>Transformations</span>
                            <ChevronRight className="h-6 w-6 text-white/70" strokeWidth={2} />
                          </button>

                          {/* About Age Reversal */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              if (onAboutClick) {
                                onAboutClick();
                              } else {
                                handlePageClick('leadership');
                              }
                            }}
                            className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer"
                          >
                            <span>About Age Reversal</span>
                            <ChevronRight className="h-6 w-6 text-white/70" strokeWidth={2} />
                          </button>

                          {/* More */}
                          {(() => {
                            const moreItem = navItems.find((i) => i.id === 'more');
                            return moreItem ? (
                              <button
                                type="button"
                                onClick={() => setActiveMobileSubmenu(moreItem)}
                                className="flex w-full items-center justify-between px-0 py-1 text-left text-[22px] font-normal text-white hover:text-luxury-gold transition-colors cursor-pointer group"
                              >
                                <span>More</span>
                                <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2} />
                              </button>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 h-[1px] w-full bg-white/10" />

                      {/* Book Free Consultation Primary CTA Button */}
                      <div className="px-8 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveMobileSubmenu(null);
                            onBookClick();
                          }}
                          className="inline-flex items-center rounded-full justify-center whitespace-nowrap font-semibold antialiased bg-luxury-gold text-black hover:bg-black hover:text-white border border-luxury-gold transition-all px-6 md:px-10 text-lg py-2.5 md:py-4 h-14 sm:h-15 w-full cursor-pointer shadow-lg"
                          aria-label="Book free consultation"
                        >
                          Book free consultation
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 h-[1px] w-full bg-white/10" />

                      {/* Become a Member Block */}
                      <div className="px-8 py-4">
                        <p className="text-left text-[18px] text-white">
                          Receive exclusive offers when you become a member of Age Reversal Clinics
                        </p>
                        <p className="-ml-0.5 flex space-x-4 mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setActiveMobileSubmenu(null);
                              onBookClick();
                            }}
                            className="inline-flex items-center rounded-full justify-center text-base whitespace-nowrap font-semibold antialiased bg-white text-black hover:bg-silver-200 transition-colors px-6 py-3 w-1/2 cursor-pointer"
                          >
                            Sign up
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setActiveMobileSubmenu(null);
                              window.location.hash = 'admin';
                            }}
                            className="inline-flex items-center rounded-full justify-center text-base whitespace-nowrap font-semibold antialiased bg-white/15 text-white border border-white/40 hover:bg-transparent hover:border-white/20 px-4 py-3 w-1/2 transition-colors cursor-pointer"
                          >
                            Sign in
                          </button>
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 h-[1px] w-full bg-white/10" />

                      {/* Utility Action Links with Icons */}
                      <div className="px-8 py-3">
                        <ul className="space-y-2.5">
                          <li className="flex w-full justify-start">
                            <button
                              type="button"
                              onClick={() => handlePageClick('testimonials')}
                              className="flex w-full items-center space-x-2.5 p-0 text-[14px] font-normal text-white/75 hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <ThumbsUp className="h-4 w-4 text-white/50" />
                              <span>Reviews</span>
                            </button>
                          </li>
                          <li className="flex w-full justify-start">
                            <button
                              type="button"
                              onClick={() => handlePageClick('latest-news')}
                              className="flex w-full items-center space-x-2.5 p-0 text-[14px] font-normal text-white/75 hover:text-white transition-colors cursor-pointer text-left"
                            >
                              <BookOpen className="h-4 w-4 text-white/50" />
                              <span>Blog & Clinical Journal</span>
                            </button>
                          </li>
                          <li className="flex w-full justify-start">
                            <a
                              href="tel:+442071234567"
                              className="flex w-full items-center space-x-2.5 p-0 text-[14px] font-normal text-white/75 hover:text-white transition-colors"
                            >
                              <HelpCircle className="h-4 w-4 text-white/50" />
                              <span>Need help?</span>
                            </a>
                          </li>
                        </ul>
                      </div>

                      {/* Divider */}
                      <div className="shrink-0 h-[1px] w-full bg-white/10" />

                      {/* Location & Contact Region Footnote */}
                      <div className="px-8 py-3.5 pb-20 flex flex-col space-y-3">
                        {/* Location Row */}
                        <div className="flex items-center space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="15 0 30 30" className="w-5 h-5 rounded-full shadow-sm shrink-0 border border-white/10">
                            <clipPath id="union-jack-circle">
                              <circle cx="30" cy="15" r="15" />
                            </clipPath>
                            <g clipPath="url(#union-jack-circle)">
                              <clipPath id="union-jack-clip">
                                <path d="M0,0 v30 h60 v-30 z"/>
                              </clipPath>
                              <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#union-jack-clip)"/>
                              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                            </g>
                          </svg>
                          <span className="text-[13px] font-normal text-white/50 leading-snug">
                            {CLINIC_INFO.locations?.[1]?.address || CLINIC_INFO.locations?.[0]?.address || 'Grove Park, London Borough of Lewisham, UK'}
                          </span>
                        </div>

                        {/* Contact Row */}
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4.5 w-4.5 text-white/40 shrink-0" strokeWidth={1.75} />
                          <a href={CLINIC_INFO.phoneHref || `tel:${(CLINIC_INFO.primaryPhone || '+44 20 8857 2000').replace(/\s+/g, '')}`} className="text-[13px] font-normal text-luxury-gold hover:underline leading-none">
                            {CLINIC_INFO.primaryPhone || '+44 20 8857 2000'}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* Slide 2: Subcategory / Drill-Down Menu View */
                    <motion.div
                      key={`submenu-${activeMobileSubmenu.id}`}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 40, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="no-scrollbar relative flex h-screen flex-col justify-between gap-6 overflow-y-auto pb-32"
                    >
                      <div className="flex flex-col space-y-6 py-4">
                        {/* Back Button */}
                        <div className="flex justify-start px-6 pt-2 text-white">
                          <button
                            type="button"
                            onClick={() => setActiveMobileSubmenu(null)}
                            className="inline-flex items-center space-x-2 py-3 px-0 text-white hover:text-luxury-gold transition-colors cursor-pointer"
                            aria-label="Back"
                          >
                            <ChevronLeft className="h-6 w-6" strokeWidth={2} />
                            <span className="text-lg font-medium">Back</span>
                          </button>
                        </div>

                        {/* Title and Subcategory List */}
                        <div className="space-y-4 px-8">
                          <h4 className="text-left font-serif text-[26px] text-white tracking-wide">
                            {activeMobileSubmenu.mobileName || activeMobileSubmenu.name}
                          </h4>

                          <div className="text-white space-y-4">
                            {/* If Mega Columns (e.g. Face, Body, Buttocks) */}
                            {activeMobileSubmenu.isMega && activeMobileSubmenu.megaColumns ? (
                              activeMobileSubmenu.megaColumns.map((col) => (
                                <div key={col.title} className="space-y-1.5 pt-2 first:pt-0">
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-silver-400 block pb-1 border-b border-white/10">
                                    {col.title}
                                  </span>
                                  <div className="flex flex-col gap-0.5">
                                    {col.items.map((subItem) => (
                                      <button
                                        key={subItem}
                                        type="button"
                                        onClick={() => {
                                          setActiveMobileSubmenu(null);
                                          handleProcedureClick(subItem);
                                        }}
                                        className="flex w-full items-center justify-between px-0 py-2 text-left text-lg font-normal text-silver-300 hover:text-white transition-colors cursor-pointer"
                                      >
                                        <span>{subItem}</span>
                                        <ChevronRight className="h-5 w-5 text-white/40" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              /* If procedure list (e.g. Pricing, Shop, More) */
                              <div className="flex flex-col space-y-2">
                                {activeMobileSubmenu.procedures?.map((proc) => (
                                  <button
                                    key={proc.name}
                                    type="button"
                                    onClick={() => {
                                      setActiveMobileSubmenu(null);
                                      if (proc.id) {
                                        handlePageClick(proc.id);
                                      } else {
                                        handleProcedureClick(proc.name);
                                      }
                                    }}
                                    className="flex flex-col w-full py-2 border-b border-white/5 text-left text-silver-300 hover:text-white transition-colors cursor-pointer group"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <span className="text-lg font-medium text-white group-hover:text-luxury-gold">
                                        {proc.name}
                                      </span>
                                      <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white" />
                                    </div>
                                    {proc.desc && (
                                      <span className="text-xs text-white/50 mt-0.5">
                                        {proc.desc}
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Free Consultation CTA in Submenu */}
                      <div className="w-full px-8 pb-12 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveMobileSubmenu(null);
                            onBookClick();
                          }}
                          className="inline-flex items-center rounded-full justify-center whitespace-nowrap font-semibold antialiased bg-luxury-gold text-black hover:bg-black hover:text-white border border-luxury-gold transition-all px-6 md:px-10 text-lg py-2.5 md:py-4 h-14 sm:h-15 w-full cursor-pointer shadow-lg"
                          aria-label="Book free consultation"
                        >
                          Book free consultation
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
