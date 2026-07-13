import { useState } from 'react';
import { PRODUCTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, CheckCircle } from 'lucide-react';
import { Product } from '../types';
import { getSkincareCollectionConfig } from '../lib/adminStore';
import { useEffect } from 'react';

export default function SkincareCollection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [config, setConfig] = useState(getSkincareCollectionConfig());

  useEffect(() => {
    setConfig(getSkincareCollectionConfig());
  }, []);

  // Categories
  const categories = ['All', 'Serums', 'Cleansers', 'Mists', 'Creams'];

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Notify user
    setNotification(`${product.name} added to cart`);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as Array<{ product: Product; quantity: number }>;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== id));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => {
    const priceNum = parseFloat(item.product.price?.replace('$', '') || '0');
    return acc + (priceNum * item.quantity);
  }, 0);

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

          {/* Cart Icon trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 bg-white border border-luxury-border hover:bg-luxury-secondary text-luxury-text px-6 py-3.5 rounded-full shadow-sm transition-all self-start md:self-auto relative group font-sans font-normal tracking-wide"
          >
            <ShoppingBag className="h-4 w-4 text-luxury-muted group-hover:text-luxury-gold transition-colors" strokeWidth={1.5} />
            <span className="text-sm">My Cart</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center font-normal text-xs border-2 border-white">
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
              className={`px-6 py-2.5 rounded-full font-sans text-[11px] md:text-xs font-normal tracking-[0.15em] uppercase border transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-luxury-card text-luxury-subtext border-luxury-border hover:bg-luxury-secondary hover:text-luxury-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 max-w-6xl mx-auto">
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
                        onClick={() => addToCart(product)}
                        className="w-full bg-white/95 backdrop-blur-sm hover:bg-white text-luxury-text font-sans font-normal py-3 rounded-full shadow-lg text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-all"
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
                    onClick={() => addToCart(product)}
                    className="text-[10px] sm:text-xs font-sans font-normal text-luxury-text border-b border-luxury-border pb-1 hover:border-luxury-text transition-all uppercase tracking-wider"
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
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((pageNum) => (
              <button
                key={pageNum}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-sans text-sm transition-all duration-300 ${
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
            className="w-12 h-12 flex items-center justify-center rounded-full border border-luxury-border text-luxury-subtext hover:bg-luxury-card hover:text-luxury-text transition-colors duration-300 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        {/* Slide-out Shopping Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
              />

              <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
                >
                  {/* Cart Header */}
                  <div className="px-6 py-6 border-b border-silver-100 flex justify-between items-center bg-silver-900 text-white">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-rose-gold" />
                      <h3 className="text-lg font-bold">Your Skincare Bag</h3>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Cart Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-silver-100">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center text-silver-500">
                        <ShoppingBag className="h-12 w-12 text-silver-300 mb-3" />
                        <p className="font-semibold text-silver-700">Your bag is empty</p>
                        <p className="text-xs mt-1">Explore our essentials collection to add items.</p>
                      </div>
                    ) : (
                      cart.map((item, idx) => (
                        <div key={item.product.id} className={`flex items-center gap-4 py-4 ${idx === 0 ? 'border-none' : ''}`}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-xl object-cover border border-silver-200"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-silver-900 leading-snug">{item.product.name}</h4>
                            <p className="text-xs text-silver-500 font-semibold">{item.product.price}</p>
                            
                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="p-1 rounded bg-silver-100 hover:bg-silver-200 text-silver-700 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="p-1 rounded bg-silver-100 hover:bg-silver-200 text-silver-700 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs font-semibold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="px-6 py-6 border-t border-silver-100 bg-silver-100 space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-silver-600">Subtotal</span>
                        <span className="text-silver-900 text-lg">${totalCartPrice.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-silver-500 italic">
                        Shipping and clinical prescription taxes calculated at checkout.
                      </p>
                      <button
                        onClick={() => {
                          alert(`Thank you! Procedurally checking out: ${cart.length} unique items.`);
                          setCart([]);
                          setIsCartOpen(false);
                        }}
                        className="w-full bg-silver-900 hover:bg-black text-white text-center py-3.5 rounded-xl font-bold transition-all shadow text-sm"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Global notification banner */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 50, x: '-50%' }}
              className="fixed bottom-6 left-1/2 z-50 bg-silver-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs md:text-sm border border-white/10"
            >
              <CheckCircle className="h-4 w-4 text-rose-gold fill-rose-gold/10" />
              <span>{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
