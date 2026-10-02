import React from 'react';
import { CartItem } from '../../types/shop';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShopCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const ShopCartDrawer: React.FC<ShopCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 75;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 4.95;
  const total = subtotal + (cart.length > 0 ? shippingCost : 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop matching SkincareCollection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Cart Header matching SkincareCollection */}
            <div className="px-6 py-6 border-b border-silver-100 flex justify-between items-center bg-silver-900 text-white">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-rose-gold" />
                <h3 className="text-lg font-bold">Your Skincare Bag</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Body matching SkincareCollection */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-silver-100">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-silver-500">
                  <ShoppingBag className="h-12 w-12 text-silver-300 mb-3" />
                  <p className="font-semibold text-silver-700">Your bag is empty</p>
                  <p className="text-xs mt-1">Explore our essentials collection to add items.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={item.product.id}
                    className={`flex items-center gap-4 py-4 ${idx === 0 ? 'border-none' : ''}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-contain bg-white border border-silver-200 shrink-0 p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-silver-900 leading-snug truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-silver-500 font-semibold mt-0.5">
                        £{item.product.price.toFixed(2)}
                      </p>

                      {/* Quantity buttons */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="p-1 rounded bg-silver-100 hover:bg-silver-200 text-silver-700 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="p-1 rounded bg-silver-100 hover:bg-silver-200 text-silver-700 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-xs font-semibold text-red-500 hover:underline cursor-pointer ml-2 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer matching SkincareCollection layout with Subtotal, Shipping, Total, Checkout */}
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-silver-100 bg-silver-100 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-silver-600 font-medium">Subtotal</span>
                    <span className="text-silver-900 font-bold text-base">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-silver-600 font-medium">Estimated Shipping</span>
                    <span className="font-semibold text-silver-900">
                      {isFreeShipping ? 'FREE' : '£4.95'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold text-silver-900 pt-2 border-t border-silver-200">
                    <span>Total</span>
                    <span className="text-lg">£{total.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-silver-500 italic">
                  Shipping and clinical prescription taxes calculated at checkout.
                </p>

                <button
                  onClick={onCheckout}
                  className="w-full bg-silver-900 hover:bg-black text-white text-center py-3.5 rounded-xl font-bold transition-all shadow text-sm cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
