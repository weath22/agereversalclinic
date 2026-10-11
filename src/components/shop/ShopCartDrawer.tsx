import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../../context/CartContext';
import { CartItem } from '../../types/shop';

interface UniversalCartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCheckout?: () => void;
  // Optional override props for backward compatibility
  cart?: CartItem[];
  onUpdateQuantity?: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
}

export const UniversalCartDrawer: React.FC<UniversalCartDrawerProps> = ({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  onCheckout: propsOnCheckout,
  cart: propsCart,
  onUpdateQuantity: propsOnUpdateQuantity,
  onRemoveItem: propsOnRemoveItem,
}) => {
  const globalCart = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Use props if explicitly passed; otherwise fall back to global CartContext
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : globalCart.isCartOpen;
  const closeDrawer = propsOnClose || globalCart.closeCart;
  const cart = propsCart || globalCart.cart;
  const updateQuantity = propsOnUpdateQuantity || globalCart.updateQuantity;
  const removeItem = propsOnRemoveItem || globalCart.removeFromCart;
  const subtotal = globalCart.subtotal;
  const total = globalCart.total;
  const isFreeShipping = globalCart.isFreeShipping;
  const amountNeededForFreeShipping = globalCart.amountNeededForFreeShipping;
  const freeShippingThreshold = globalCart.freeShippingThreshold;

  const handleCheckoutClick = () => {
    if (propsOnCheckout) {
      propsOnCheckout();
      return;
    }

    setIsCheckingOut(true);
    // Simulate seamless checkout initiation
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        globalCart.clearCart();
        closeDrawer();
      }, 2500);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop with smooth blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-luxury-border/60"
            >
              {/* Drawer Header - Clinic Luxury Theme: Black, Gold Accent */}
              <div className="px-5 sm:px-6 py-5 border-b border-white/10 flex justify-between items-center bg-black text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neutral-900 border border-luxury-gold/40 rounded-xl">
                    <ShoppingBag className="h-5 w-5 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif tracking-tight text-white">Your Skincare Bag</h3>
                    <p className="text-[11px] text-white/60 font-sans tracking-wider uppercase">
                      {globalCart.totalCartCount} {globalCart.totalCartCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white/80 hover:text-white"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-[#FAF7F2] px-5 sm:px-6 py-3 border-b border-luxury-border/40">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-luxury-gold" />
                    <span className="font-medium text-luxury-text text-[11px] sm:text-xs">
                      {isFreeShipping
                        ? 'Complimentary Delivery unlocked!'
                        : `Add £${amountNeededForFreeShipping.toFixed(2)} more for Free UK Delivery`}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-luxury-muted font-bold">
                    £{freeShippingThreshold}
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-luxury-gold to-[#a88d6b] rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`
                    }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 divide-y divide-luxury-border/30">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-72 text-center text-luxury-muted">
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4 border border-luxury-border/40">
                      <ShoppingBag className="h-8 w-8 text-luxury-muted" />
                    </div>
                    <p className="font-serif font-medium text-luxury-text text-base">Your bag is empty</p>
                    <p className="text-xs text-luxury-muted mt-1 max-w-xs leading-relaxed">
                      Discover our clinically formulated medical-grade skincare collections.
                    </p>
                    <button
                      onClick={closeDrawer}
                      className="mt-5 px-6 py-2.5 bg-black hover:bg-neutral-900 text-white text-xs font-sans font-medium uppercase tracking-wider rounded-full border border-luxury-gold/50 transition-all cursor-pointer shadow-xs"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div
                      key={item.product.id || idx}
                      className={`flex items-start gap-3.5 sm:gap-4 py-4 ${idx === 0 ? 'border-none' : ''}`}
                    >
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-[#FAF7F2] border border-luxury-border/50 shrink-0 overflow-hidden p-1 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-sans uppercase tracking-widest font-semibold text-luxury-gold block">
                              {item.product.brand || item.product.range || 'ARC Clinical'}
                            </span>
                            <h4 className="text-xs sm:text-sm font-medium text-luxury-text leading-snug line-clamp-2">
                              {item.product.name}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-[11px] font-medium text-rose-500 hover:text-rose-700 hover:underline cursor-pointer shrink-0"
                            title="Remove from bag"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs sm:text-sm font-semibold text-luxury-text font-serif">
                            £{(item.product.price * item.quantity).toFixed(2)}
                            {item.quantity > 1 && (
                              <span className="text-[11px] font-sans font-normal text-luxury-muted ml-1">
                                (£{item.product.price.toFixed(2)} ea)
                              </span>
                            )}
                          </p>

                          {/* Instant Quantity Adjustment (+ / -) */}
                          <div className="flex items-center border border-luxury-border rounded-lg bg-stone-50 overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1.5 hover:bg-stone-200 text-luxury-text transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-7 text-center select-none text-luxury-text">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1.5 hover:bg-stone-200 text-luxury-text transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer with Calculations & Direct Checkout */}
              {cart.length > 0 && (
                <div className="px-5 sm:px-6 py-5 border-t border-luxury-border/50 bg-[#FAF7F2] space-y-4">
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-luxury-subtext">
                      <span>Subtotal</span>
                      <span className="text-luxury-text font-serif font-bold text-sm sm:text-base">
                        £{subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-luxury-subtext">
                      <span>UK Standard Delivery</span>
                      <span className="font-medium text-luxury-text">
                        {isFreeShipping ? (
                          <span className="text-luxury-gold font-bold">FREE</span>
                        ) : (
                          '£4.95'
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-base sm:text-lg font-bold text-luxury-text pt-2.5 border-t border-luxury-border/50">
                      <span className="font-serif">Total</span>
                      <span className="font-serif text-black">£{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-luxury-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <span>Doctor-led clinic dispatch & secure payment</span>
                  </div>

                  {checkoutSuccess ? (
                    <div className="w-full bg-black text-white py-3.5 rounded-full text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border border-luxury-gold">
                      <Check className="h-4 w-4 text-luxury-gold" />
                      <span>Order Placed! Directing to Clinic Dispatch...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckoutClick}
                      disabled={isCheckingOut}
                      className="w-full bg-black hover:bg-neutral-900 active:scale-[0.99] text-white py-3.5 rounded-full font-sans font-medium tracking-wider transition-all shadow-md hover:shadow-lg text-xs sm:text-sm uppercase flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-luxury-gold/50"
                    >
                      {isCheckingOut ? (
                        <span>Processing Dispatch...</span>
                      ) : (
                        <>
                          <span>Proceed to Checkout</span>
                          <ArrowRight className="h-4 w-4 text-luxury-gold" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ShopCartDrawer = UniversalCartDrawer;
export default UniversalCartDrawer;
