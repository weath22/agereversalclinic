import { useState, useEffect } from 'react';
import { PRODUCTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { getSkincareCollectionConfig } from '../lib/adminStore';
import { useCart } from '../context/CartContext';

interface SkincareCollectionProps {
  onShopClick?: () => void;
}

export default function SkincareCollection({ onShopClick }: SkincareCollectionProps = {}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [config, setConfig] = useState(getSkincareCollectionConfig());

  // Connect to unified Global Cart Context
  const { addToCart, openCart, totalCartCount, notification } = useCart();

  useEffect(() => {
    setConfig(getSkincareCollectionConfig());
  }, []);

  // Categories
  const categories = ['All', 'Serums', 'Cleansers', 'Mists', 'Creams'];

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const handleProductAddToCart = (product: Product) => {
    // Adds to unified cart and triggers drawer optionally or toast
    addToCart(product, 1, false);
  };

  return (
    <section id="essentials" className="py-24 md:py-32 bg-luxury-primary border-t border-luxury-border relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 max-w-6xl mx-auto">
          <div>
            <span className="text-[11px] font-sans font-normal text-luxury-subtext uppercase tracking-[0.2em] block mb-3">
              {config.description || 'SHOP OUR COLLECTION'}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text leading-tight">
              {config.heading}
            </h2>
            <div className="w-12 h-[1px] bg-luxury-gold mt-6" />
          </div>

          {/* Cart Icon trigger - Wires directly to global openCart() */}
          <button 
            onClick={openCart}
            className="flex items-center space-x-2 bg-white border border-luxury-border hover:bg-luxury-secondary text-luxury-text px-6 py-3.5 rounded-full shadow-sm transition-all self-start md:self-auto relative group font-sans font-normal tracking-wide cursor-pointer"
            aria-label="Open clinical shopping cart"
          >
            <ShoppingBag className="h-4 w-4 text-luxury-muted group-hover:text-luxury-gold transition-colors" strokeWidth={1.5} />
            <span className="text-sm">My Cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-normal text-xs border-2 border-white shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-16 max-w-6xl mx-auto pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-sans text-[11px] md:text-xs font-normal tracking-[0.15em] uppercase border transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-luxury-card text-luxury-subtext border-luxury-border hover:bg-luxury-secondary hover:text-luxury-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-luxury-secondary mb-4 sm:mb-6 relative border border-luxury-border">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                    
                    {/* Add to Cart quick button on hover */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                      <button
                        onClick={() => handleProductAddToCart(product)}
                        className="w-full bg-white/95 backdrop-blur-sm hover:bg-white text-luxury-text font-sans font-normal py-3 rounded-full shadow-lg text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-all cursor-pointer hover:shadow-xl"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] font-sans font-light text-luxury-muted uppercase tracking-[0.15em] mb-1.5">
                    {product.brand}
                  </p>
                  <h3 className="text-sm sm:text-lg font-serif font-normal text-luxury-text group-hover:text-luxury-subtext transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-xs sm:text-sm font-sans font-light text-luxury-subtext block mt-1.5">
                    {product.price || '$50.00'}
                  </span>
                </div>

                <div className="mt-4 sm:mt-6">
                  <button
                    onClick={() => handleProductAddToCart(product)}
                    className="text-[10px] sm:text-xs font-sans font-normal text-luxury-text border-b border-luxury-border pb-1 hover:border-luxury-text transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel Pagination */}
        <div className="flex items-center justify-center gap-6 pt-16">
          <button
            aria-label="Previous Page"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((pageNum) => (
              <button
                key={pageNum}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 cursor-pointer ${
                  pageNum === 1
                    ? 'bg-luxury-text text-luxury-primary font-normal'
                    : 'text-luxury-subtext hover:bg-luxury-card'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            aria-label="Next Page"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Explore Full Shop CTA */}
        {onShopClick && (
          <div className="text-center pt-8">
            <button
              onClick={onShopClick}
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-102"
            >
              <span>Explore Full Online Shop (23 Formulas)</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Notification Banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-6 left-1/2 z-50 bg-black text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs md:text-sm border border-luxury-gold/50"
            >
              <CheckCircle className="h-4 w-4 text-luxury-gold" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
