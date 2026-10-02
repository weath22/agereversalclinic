import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ShopProduct, FilterState, CartItem } from '../../types/shop';
import { SHOP_PRODUCTS } from '../../data/shopProducts';
import { ProductCard } from './ProductCard';
import { ShopSidebarFilters } from './ShopSidebarFilters';
import { ProductDetailView } from './ProductDetailView';
import { ShopCartDrawer } from './ShopCartDrawer';
import { ShopMobileFilterDrawer } from './ShopMobileFilterDrawer';
import { Search, ShoppingBag, ArrowLeft, CheckCircle2, SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SORT_OPTIONS: Array<{ id: FilterState['sort']; label: string; mobileLabel: string }> = [
  { id: 'featured', label: 'Featured Order', mobileLabel: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High', mobileLabel: 'Price ↑' },
  { id: 'price-desc', label: 'Price: High to Low', mobileLabel: 'Price ↓' },
  { id: 'name-asc', label: 'Alphabetical: A to Z', mobileLabel: 'A - Z' },
];

interface ShopPageViewProps {
  onClose: () => void;
  onBookClick?: (serviceName?: string) => void;
  initialRangeFilter?: string;
}

export const ShopPageView: React.FC<ShopPageViewProps> = ({
  onClose,
  onBookClick,
  initialRangeFilter,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    range: initialRangeFilter ? [initialRangeFilter] : [],
    type: [],
    skinType: [],
    skinConcerns: [],
    searchQuery: '',
    sort: 'featured',
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const mobileOrderMenuRef = useRef<HTMLDivElement>(null);
  const desktopOrderMenuRef = useRef<HTMLDivElement>(null);

  // Close order menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideMobile = mobileOrderMenuRef.current?.contains(target);
      const clickedInsideDesktop = desktopOrderMenuRef.current?.contains(target);
      if (!clickedInsideMobile && !clickedInsideDesktop) {
        setIsOrderMenuOpen(false);
      }
    };
    if (isOrderMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOrderMenuOpen]);

  // Scroll to top when product detail opens
  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedProduct]);

  const renderOrderMenu = (isMobileView: boolean) => (
    <div className="relative" ref={isMobileView ? mobileOrderMenuRef : desktopOrderMenuRef}>
      <button
        type="button"
        onClick={() => setIsOrderMenuOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
          isOrderMenuOpen
            ? 'bg-black text-white border-black'
            : 'bg-white/95 hover:bg-white text-stone-800 border-[#D8C2A3]/70 hover:border-[#bda380]'
        }`}
        aria-expanded={isOrderMenuOpen}
        aria-label="Filter Order Menu"
      >
        <ArrowUpDown className="w-3.5 h-3.5 shrink-0 text-[#bda380]" />
        {isMobileView ? (
          <span>Order</span>
        ) : (
          <span>{SORT_OPTIONS.find((opt) => opt.id === filters.sort)?.label || 'Order'}</span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
            isOrderMenuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu UI */}
      <AnimatePresence>
        {isOrderMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 sm:w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#D8C2A3]/50 py-1.5 z-40 overflow-hidden"
          >
            <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8a7250] border-b border-[#D8C2A3]/30">
              Filter Order
            </div>
            {SORT_OPTIONS.map((opt) => {
              const isSelected = filters.sort === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setFilters({ ...filters, sort: opt.id });
                    setIsOrderMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#faf4ec] text-stone-950 font-bold'
                      : 'text-stone-700 hover:bg-[#faf5ee] hover:text-black font-normal'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#8a7250] stroke-[2.5]" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesRange = product.range.toLowerCase().includes(query);
        const matchesType = product.type.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesRange && !matchesType) return false;
      }

      // Range
      if (filters.range.length > 0 && !filters.range.includes(product.range)) {
        return false;
      }

      // Type
      if (filters.type.length > 0 && !filters.type.includes(product.type)) {
        return false;
      }

      // Skin Type
      if (filters.skinType.length > 0) {
        const hasMatchingSkinType = product.skinType.some((st) => filters.skinType.includes(st));
        if (!hasMatchingSkinType) return false;
      }

      // Skin Concerns
      if (filters.skinConcerns.length > 0) {
        const hasMatchingConcern = product.skinConcerns.some((sc) => filters.skinConcerns.includes(sc));
        if (!hasMatchingConcern) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      if (filters.sort === 'name-asc') return a.name.localeCompare(b.name);
      return 0; // featured default
    });
  }, [filters]);

  // Cart Handlers
  const handleAddToCart = (product: ShopProduct, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });

    setNotification(`${product.name} added to your bag`);
    setTimeout(() => {
      setNotification(null);
    }, 3200);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleResetFilters = () => {
    setFilters({
      range: [],
      type: [],
      skinType: [],
      skinConcerns: [],
      searchQuery: '',
      sort: 'featured',
    });
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbf8f3] via-[#f6efe4] to-[#fbf9f5] text-stone-900 relative selection:bg-[#D8C2A3]/30">
      {/* Luxury Gold & Champagne Ambient Lighting (Matches Header CTA Theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#D8C2A3]/50 via-[#ecdcc8]/30 to-transparent rounded-full blur-3xl opacity-90" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#ecdcc8]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-[600px] h-[600px] bg-[#e4d2bc]/45 rounded-full blur-3xl" />
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-medium border border-silver-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-rose-gold underline hover:text-white ml-2 text-xs font-bold uppercase cursor-pointer"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Breadcrumbs & Cart Bar */}
      <div className="bg-white/85 backdrop-blur-md border-b border-[#D8C2A3]/40 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-[0_2px_15px_-3px_rgba(216,194,163,0.15)]">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#7a6242] hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Clinic</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 bg-white/95 border border-[#D8C2A3]/70 hover:border-black text-stone-900 px-4 sm:px-5 py-1.5 rounded-full shadow-xs transition-all text-xs font-semibold cursor-pointer relative"
            >
              <ShoppingBag className="h-4 w-4 text-[#a88d6b]" />
              <span>Bag ({totalCartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* If a product is selected, render its full product page layout */}
      {selectedProduct ? (
        <ProductDetailView
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
        />
      ) : (
        /* Main Section matching user layout snippet with tighter, modern spacing */
        <section className="relative z-10 w-full py-4 sm:py-8 lg:py-16 pt-2 sm:pt-4 lg:pt-8 2xl:px-4">
          <div className="max-w-screen-2xl mx-auto w-full px-2.5 sm:px-6 2xl:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
              
              {/* Left Sidebar (3 Columns on lg, closer to products) */}
              <div className="lg:col-span-3 hidden lg:block w-full">
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-[#D8C2A3]/40 shadow-[0_4px_20px_-4px_rgba(216,194,163,0.18)]">
                  <ShopSidebarFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilters={handleResetFilters}
                  />
                </div>
              </div>

              {/* Right Products Area (9 Columns on lg) */}
              <div className="lg:col-span-9 space-y-6 w-full">
                
                {/* Direct on-page Search, Filter & Order Controls Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-[#D8C2A3]/40">
                  {/* On mobile: Products count on left, Order button on right end */}
                  <div className="flex items-center justify-between w-full lg:w-auto">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <h1 className="font-serif text-2xl lg:text-3xl font-normal text-stone-950 tracking-tight">
                        Products
                      </h1>
                      <span className="bg-[#f3ebdF] text-[#7a6242] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D8C2A3]/60">
                        ({filteredProducts.length})
                      </span>
                    </div>

                    {/* Mobile Order Menu - positioned at the right end with Products text */}
                    <div className="lg:hidden">
                      {renderOrderMenu(true)}
                    </div>
                  </div>

                  {/* Second row on mobile: Search bar + Filters button */}
                  <div className="flex items-center gap-2.5 w-full lg:w-auto">
                    {/* Modern Luxury Search Input */}
                    <div className="relative flex-1 sm:w-60 lg:w-72 min-w-0">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a88d6b]" />
                      <input
                        type="text"
                        placeholder="Search formulas..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                        className="w-full bg-white/95 border border-[#D8C2A3]/60 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#a88d6b] focus:bg-white transition-all shadow-xs"
                      />
                      {filters.searchQuery && (
                        <button
                          onClick={() => setFilters({ ...filters, searchQuery: '' })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-black p-0.5 cursor-pointer text-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Desktop Order Menu (hidden on mobile, visible on desktop next to search) */}
                    <div className="hidden lg:block">
                      {renderOrderMenu(false)}
                    </div>

                    {/* Mobile Filter Button - positioned with the search bar */}
                    <button
                      onClick={() => setIsMobileFilterOpen(true)}
                      className="items-center rounded-full justify-center text-xs font-bold border border-black bg-black text-white hover:bg-stone-800 py-2 px-3.5 sm:px-4 flex gap-1.5 lg:hidden cursor-pointer shadow-xs shrink-0"
                      aria-label="Filter by"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      <span>Filters</span>
                      {(filters.range.length + filters.type.length + filters.skinType.length + filters.skinConcerns.length) > 0 && (
                        <span className="w-4 h-4 rounded-full bg-rose-gold text-white text-[10px] flex items-center justify-center font-bold ml-0.5">
                          {filters.range.length + filters.type.length + filters.skinType.length + filters.skinConcerns.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Filter Tags Bar */}
                {(filters.range.length > 0 || filters.type.length > 0 || filters.skinType.length > 0 || filters.skinConcerns.length > 0 || filters.searchQuery) && (
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-white/75 backdrop-blur-xs rounded-xl border border-[#D8C2A3]/40 shadow-xs">
                    <span className="text-xs font-semibold text-[#7a6242] pl-1">Filtered by:</span>
                    {filters.range.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1.5 text-xs bg-white text-stone-900 font-medium px-3 py-1 rounded-full border border-[#D8C2A3]/50 shadow-xs"
                      >
                        <span>{r}</span>
                        <button
                          onClick={() => setFilters({ ...filters, range: filters.range.filter((x) => x !== r) })}
                          className="hover:text-red-600 font-bold text-stone-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {filters.type.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 text-xs bg-white text-stone-900 font-medium px-3 py-1 rounded-full border border-[#D8C2A3]/50 shadow-xs"
                      >
                        <span>{t}</span>
                        <button
                          onClick={() => setFilters({ ...filters, type: filters.type.filter((x) => x !== t) })}
                          className="hover:text-red-600 font-bold text-stone-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {filters.skinType.map((st) => (
                      <span
                        key={st}
                        className="inline-flex items-center gap-1.5 text-xs bg-white text-stone-900 font-medium px-3 py-1 rounded-full border border-[#D8C2A3]/50 shadow-xs"
                      >
                        <span>{st}</span>
                        <button
                          onClick={() => setFilters({ ...filters, skinType: filters.skinType.filter((x) => x !== st) })}
                          className="hover:text-red-600 font-bold text-stone-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {filters.skinConcerns.map((sc) => (
                      <span
                        key={sc}
                        className="inline-flex items-center gap-1.5 text-xs bg-white text-stone-900 font-medium px-3 py-1 rounded-full border border-[#D8C2A3]/50 shadow-xs"
                      >
                        <span>{sc}</span>
                        <button
                          onClick={() => setFilters({ ...filters, skinConcerns: filters.skinConcerns.filter((x) => x !== sc) })}
                          className="hover:text-red-600 font-bold text-stone-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {filters.searchQuery && (
                      <span className="inline-flex items-center gap-1.5 text-xs bg-white text-stone-900 font-medium px-3 py-1 rounded-full border border-[#D8C2A3]/50 shadow-xs">
                        <span>"{filters.searchQuery}"</span>
                        <button
                          onClick={() => setFilters({ ...filters, searchQuery: '' })}
                          className="hover:text-red-600 font-bold text-stone-400 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={handleResetFilters}
                      className="text-xs text-rose-gold-dark hover:text-black font-bold uppercase tracking-wider ml-auto pr-1 cursor-pointer"
                    >
                      Reset all
                    </button>
                  </div>
                )}

                {/* Product Grid (2 cols on mobile, 3 cols on lg with closer, balanced gap) */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-[#D8C2A3]/40 my-8 shadow-xs">
                    <p className="font-serif text-xl text-stone-800 font-medium mb-2">
                      No matching products found
                    </p>
                    <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
                      Try adjusting your filters or search keywords to view available skincare formulas.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-2 sm:gap-x-6 gap-y-3.5 sm:gap-y-6 lg:grid-cols-3 lg:gap-6 xl:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onViewProduct={setSelectedProduct}
                        onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* Cart Drawer */}
      <ShopCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => {
          setIsCartOpen(false);
          if (onBookClick) {
            onBookClick('Skincare Order Inquiry & Consultation');
          }
        }}
      />

      {/* Mobile Filter Drawer */}
      <ShopMobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredProducts.length}
      />
    </div>
  );
};
