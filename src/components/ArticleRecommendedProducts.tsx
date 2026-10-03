import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SHOP_PRODUCTS } from '../data/shopProducts';
import { ShopProduct } from '../types/shop';
import { ProductCard } from './shop/ProductCard';

interface ArticleRecommendedProductsProps {
  onShopClick?: () => void;
  onProductClick?: (product: ShopProduct) => void;
}

export default function ArticleRecommendedProducts({ onShopClick, onProductClick }: ArticleRecommendedProductsProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recommendedProducts = SHOP_PRODUCTS.slice(0, 4);

  const handleAddToCart = (product: ShopProduct) => {
    setToastMessage(`Added "${product.name}" to your list`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleViewProduct = (product: ShopProduct) => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <section id="article-recommended-products" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-[#fbf8f3] via-[#f4ebe1] to-[#faf6f0] text-luxury-text border-b border-[#D8C2A3]/40 overflow-hidden relative selection:bg-[#D8C2A3]/30">
      {/* Soft Fade Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-white/20 to-white/45 backdrop-blur-[0.5px] pointer-events-none" />

      {/* Luminous Ambient Light Blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[950px] h-[550px] bg-gradient-to-b from-[#D8C2A3]/30 via-[#ecdcc8]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-[#ecdcc8]/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-xs sm:text-sm font-sans font-medium text-luxury-gold uppercase tracking-[0.24em] block mb-2">
              Medical-Grade Post-Care
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text tracking-tight mb-2">
              Recommended Skincare Essentials
            </h2>
            <p className="text-sm sm:text-base text-luxury-subtext max-w-xl font-light leading-relaxed">
              Clinical-grade serums and formulations recommended by our physicians to maintain and elevate treatment results at home.
            </p>
          </div>
          
          {onShopClick && (
            <button
              onClick={onShopClick}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-medium text-luxury-text hover:text-black border-b border-luxury-gold pb-0.5 uppercase tracking-wider transition-colors cursor-pointer group shrink-0 self-start sm:self-auto"
            >
              <span>Explore All Skincare</span>
              <ArrowRight className="w-4 h-4 text-luxury-gold group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Reusable Main Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 items-stretch">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="h-full flex">
              <ProductCard
                product={product}
                onViewProduct={handleViewProduct}
                onAddToCart={(prod) => handleAddToCart(prod)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Added Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D8C2A3]/40 flex items-center gap-3 text-xs sm:text-sm font-sans"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
