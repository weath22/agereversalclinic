import { useState, useEffect, useRef } from 'react';
import { Menu, X, Calendar, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HeaderConfig } from '../types';

interface HeaderProps {
  onBookClick: (serviceName?: string) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onTreatmentClick?: (treatmentName: string) => void;
  headerConfig?: HeaderConfig;
}

interface MegaColumn {
  title: string;
  items: string[];
}

interface NavItem {
  name: string;
  id: string;
  href?: string;
  isMega?: boolean;
  imageUrl?: string;
  megaColumns?: MegaColumn[];
  procedures?: { name: string; desc?: string; id?: string }[];
}

export default function Header({ onBookClick, activeSection, setActiveSection, onTreatmentClick, headerConfig }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
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
      name: 'Home',
      id: 'home',
      href: '#home'
    },
    {
      name: 'Face',
      id: 'face',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'INJECTABLE TREATMENTS',
          items: [
            'Exosome',
            'Migraines Treatment',
            'Profhilo',
            'Polynucleotide',
            'Non-Surgical Jaw Reduction',
            'Gummy Smile Treatment',
            'Eyebrow Lifting',
            'Lines & Wrinkles Smoothing',
            'Collagen Stimulator'
          ]
        },
        {
          title: 'DERMAL FILLERS FOR FACE',
          items: [
            'Temple Filler',
            'Forehead Filler',
            'Earlobe Filler',
            'Frown Line Treatment',
            'Contouring the Jaw Line',
            'Chin Enhancement',
            'Cheek Enhancement',
            'Eye Bag, Dark Circles & Tear Trough',
            'Nose To Mouth Lines, Folds & Wrinkles',
            'Non-Surgical Rhinoplasty',
            'Lip Enhancement',
            'Dermal filler Dissolving'
          ]
        },
        {
          title: 'SKIN REJUVENATION',
          items: [
            'FaceTite',
            'Morpheus 8',
            'Ultherapy',
            'PDO Thread',
            'Skin Tightening Treatment',
            'Treatments For Men',
            'Mesotherapy',
            'PRX Peel',
            'SkinPen (Micro-needling)',
            'Hyperpigmentation',
            'Cosmelan',
            'Skin Peels',
            'Obagi Skin Care System',
            'ZO Skin Health'
          ]
        }
      ]
    },
    {
      name: 'Body',
      id: 'body',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'DERMAL FILLERS FOR BODY',
          items: [
            'Hydrating Face and Hand Rejuvenation',
            'Radiesse Hand Rejuvenation'
          ]
        },
        {
          title: 'NON SURGICAL TREATMENTS',
          items: [
            'Exosome',
            'Excessive Sweating Treatment',
            'Effective Cellulite Treatment',
            'Port Wine Stains',
            'Nail Fungus',
            'Leg Veins',
            'Hyperpigmentation and Vascular',
            'Hay Fever Treatment'
          ]
        },
        {
          title: 'FEMALE INTIMATE TREATMENTS',
          items: [
            'Labia Enhancement',
            'Vaginal dryness'
          ]
        },
        {
          title: 'MALE INTIMATE TREATMENTS',
          items: [
            'Non-Surgical Penoplasty'
          ]
        },
        {
          title: 'FAT REDUCTION',
          items: [
            'Aqualyx',
            'Desoface® And Desobody®'
          ]
        }
      ]
    },
    {
      name: 'Buttocks',
      id: 'buttocks',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'BUTTOCK ENHANCEMENT',
          items: [
            'Non-Surgical Buttock Lift',
            'Lanluma Volume Contouring',
            'Sculptra Butt Lift'
          ]
        },
        {
          title: 'CONTOURING & REFINEMENT',
          items: [
            'Hip Dip Correction',
            'Asymmetry Correction',
            'Non-Surgical Sculpting'
          ]
        },
        {
          title: 'CELLULITE & TEXTURE',
          items: [
            'Cellulite Smoothing',
            'Deep-tissue Subcision',
            'Radiofrequency Therapy'
          ]
        }
      ]
    },
    {
      name: 'Minor Surgery & Scars',
      id: 'minor-surgery-scars',
      isMega: true,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80',
      megaColumns: [
        {
          title: 'MINOR SURGERY',
          items: [
            'Mole & Lesion Removal',
            'Cyst Removal',
            'Precision Scar-free Excision',
            'Lobe Correction'
          ]
        },
        {
          title: 'FACIAL REJUVENATION',
          items: [
            'Eyelid Blepharoplasty',
            'Upper Eyelid Rejuvenation',
            'Lower Eyelid Rejuvenation'
          ]
        },
        {
          title: 'SCAR REVISION',
          items: [
            'Fractional CO2 Laser',
            'Subcision Therapy',
            'Steroid Scar Flattening'
          ]
        },
        {
          title: 'COLLAGEN THERAPY',
          items: [
            'PRP Microneedling',
            'Growth Factor Therapy'
          ]
        }
      ]
    },
    {
      name: 'Gallery',
      id: 'gallery',
      procedures: [
        { name: 'Acne & Scarring Results', id: 'gallery', desc: 'Real patient skin texture corrections' },
        { name: 'Anti-Aging Rejuvenation', id: 'gallery', desc: 'Liquid lift & deep cellular therapy' },
        { name: 'Clinical Hair Restoration', id: 'gallery', desc: 'Collagen induction & growth factors' },
        { name: 'All Before & After Results', id: 'gallery', desc: 'Explore our full clinical transformations' }
      ]
    },
    {
      name: 'Pages',
      id: 'pages',
      procedures: [
        { name: 'Meet Our Leadership', id: 'leadership', desc: 'Adv. Faith Chris & specialists' },
        { name: 'Our Clinics & Locations', id: 'locations', desc: 'Harley Street & Main Hospital' },
        { name: 'Special Offers', id: 'offers', desc: 'Exclusive clinical packages & rates' },
        { name: 'Latest Clinic News', id: 'latest-news', desc: 'The London Clinic medical journal' },
        { name: 'Facility Tour', id: 'facility', desc: 'Step inside our treatment chambers' }
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
    } ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-5 shadow-sm'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo & Brand */}
        <a href="#home" onClick={() => handleNavClick('home')} className="flex items-center space-x-3 group">
          <img
            alt={`${headerConfig?.primaryName || 'Age Reversal'} Logo`}
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            src={headerConfig?.logoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q"}
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-silver-900 leading-none flex items-center gap-1">
              {headerConfig?.primaryName || "Age Reversal"}
            </span>
            <span className="text-[10px] font-bold text-silver-500 tracking-[0.3em] uppercase leading-none mt-1">
              {headerConfig?.secondaryName || "Clinic"}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-3 xl:space-x-5">
          {navItems.map((item) => {
            const isHovered = hoveredItem === item.id;

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
                    className={`inline-flex items-center text-xs xl:text-sm font-medium transition-all pb-1 border-b-2 uppercase tracking-wider hover:text-black h-7 ${
                      activeSection === item.id
                        ? 'text-silver-900 border-silver-900 font-semibold'
                        : 'text-silver-600 border-transparent hover:border-silver-300'
                    }`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <button
                    className={`inline-flex items-center text-xs xl:text-sm font-medium transition-all pb-1 border-b-2 uppercase tracking-wider hover:text-black h-7 gap-0.5 cursor-pointer ${
                      activeSection === item.id || isHovered
                        ? 'text-silver-900 border-silver-900 font-semibold'
                        : 'text-silver-600 border-transparent hover:border-silver-300'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isHovered ? 'rotate-180 text-silver-900' : 'text-silver-400'}`} />
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
                      className={`absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-silver-200/80 p-4 z-50 flex flex-col gap-1 overflow-hidden ${
                        item.id === 'pages' || item.id === 'gallery'
                          ? 'right-0'
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-silver-400 via-rose-gold to-silver-600" />
                      {item.procedures.map((proc) => (
                        <button
                          key={proc.name}
                          onClick={() => {
                            if (proc.id) {
                              handlePageClick(proc.id);
                            } else {
                              handleProcedureClick(proc.name);
                            }
                          }}
                          className="w-full text-left p-2.5 rounded-lg hover:bg-silver-100/50 transition-all group flex flex-col cursor-pointer"
                        >
                          <span className="text-xs font-bold text-silver-900 group-hover:text-black transition-colors">
                            {proc.name}
                          </span>
                          {proc.desc && (
                            <span className="text-[10px] text-silver-500 mt-0.5 line-clamp-1">
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

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => onBookClick()}
            className="bg-gradient-to-r from-silver-800 to-black text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-black hover:to-silver-900 transition-all font-medium flex items-center space-x-2 text-sm group"
          >
            <Calendar className="h-4 w-4 text-silver-300 group-hover:scale-110 transition-transform" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => onBookClick()}
            className="bg-gradient-to-r from-silver-800 to-black text-white p-2 rounded-lg shadow-sm"
            aria-label="Book appointment"
          >
            <Calendar className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-silver-800 hover:text-black hover:bg-silver-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="absolute left-1/2 -translate-x-1/2 top-full w-[78vw] max-w-6xl bg-[#f4f5f6]/95 backdrop-blur-md border border-silver-200/80 rounded-2xl shadow-2xl z-40 py-8 px-8 mt-2"
          >
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-silver-400 via-rose-gold to-silver-600 rounded-t-2xl" />
            
            <div>
              <div className="grid grid-cols-12 gap-8">
                
                {/* Left Column: Image and Category Title */}
                <div className="col-span-2 flex flex-col pr-4 border-r border-silver-200/50">
                  <span className="text-sm font-extrabold uppercase tracking-widest text-black mb-3">
                    {activeMegaItem.name}
                  </span>
                  {activeMegaItem.imageUrl && (
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden shadow-md border border-silver-200/80 group">
                      <img 
                        src={activeMegaItem.imageUrl} 
                        alt={`${activeMegaItem.name} aesthetics`}
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
                        <span className="text-xs font-black tracking-wider text-black mb-3 border-b border-silver-200/60 pb-1.5 select-none">
                          {col.title}
                        </span>
                        <div className="flex flex-col gap-1">
                          {col.items.map((subItem) => (
                            <button
                              key={subItem}
                              onClick={() => handleProcedureClick(subItem)}
                              className="text-left text-[11px] xl:text-xs text-zinc-600 hover:text-black hover:font-medium transition-all py-1 cursor-pointer truncate"
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-silver-100 overflow-hidden shadow-inner max-h-[85vh] overflow-y-auto"
          >
            <div className="px-6 py-6 space-y-3 flex flex-col">
              {navItems.map((item) => {
                const isExpanded = expandedMobileItem === item.id;

                return (
                  <div key={item.id} className="border-b border-silver-100/50 pb-2">
                    {item.href ? (
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.id);
                        }}
                        className={`text-sm font-semibold py-1.5 transition-all block uppercase tracking-wider ${
                          activeSection === item.id ? 'text-black' : 'text-silver-600'
                        }`}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <div>
                        <button
                          onClick={() => setExpandedMobileItem(isExpanded ? null : item.id)}
                          className="w-full flex justify-between items-center text-left py-1.5 text-sm font-semibold text-silver-600 hover:text-black uppercase tracking-wider"
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-black' : ''}`} />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 mt-1 flex flex-col gap-1.5 overflow-hidden"
                            >
                              {/* If isMega, show grouped columns */}
                              {item.isMega && item.megaColumns ? (
                                item.megaColumns.map((col) => (
                                  <div key={col.title} className="mt-2.5 first:mt-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block mb-1">
                                      {col.title}
                                    </span>
                                    <div className="flex flex-col gap-1 pl-1.5">
                                      {col.items.map((subItem) => (
                                        <button
                                          key={subItem}
                                          onClick={() => handleProcedureClick(subItem)}
                                          className="w-full text-left py-1 px-2 rounded-md hover:bg-silver-100 text-xs text-silver-600 hover:text-black font-medium transition-all"
                                        >
                                          {subItem}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                item.procedures?.map((proc) => (
                                  <button
                                    key={proc.name}
                                    onClick={() => {
                                      if (proc.id) {
                                        handlePageClick(proc.id);
                                      } else {
                                        handleProcedureClick(proc.name);
                                      }
                                    }}
                                    className="w-full text-left py-1 px-2 rounded-md hover:bg-silver-100 text-xs text-silver-600 hover:text-black font-medium flex flex-col"
                                  >
                                    <span className="font-bold text-silver-800">{proc.name}</span>
                                    {proc.desc && <span className="text-[10px] text-silver-400">{proc.desc}</span>}
                                  </button>
                                ))
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="pt-4 border-t border-silver-100">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full bg-silver-900 text-white py-3 rounded-lg shadow font-medium flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
