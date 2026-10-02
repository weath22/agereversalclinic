import React, { useState } from 'react';
import { ShopProduct } from '../../types/shop';
import { X, ShoppingBag, Plus, Minus, Star, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductQuickViewModalProps {
  product: ShopProduct | null;
  onClose: () => void;
  onAddToCart: (product: ShopProduct, quantity: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
          className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-silver-200 z-10 flex flex-col md:flex-row my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-silver-200 text-silver-600 hover:text-black flex items-center justify-center shadow-sm cursor-pointer transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Image */}
          <div className="w-full md:w-1/2 bg-silver-100 p-6 sm:p-8 flex items-center justify-center relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-64 sm:max-h-80 w-auto object-contain drop-shadow-md"
            />
            {product.discountBadge && (
              <div className="absolute left-4 top-4 z-10 flex items-center justify-center rounded-full bg-[#EA014A] text-center font-sans font-bold leading-tight text-white antialiased h-14 w-14 text-xs shadow-md">
                <span dangerouslySetInnerHTML={{ __html: product.discountBadge.replace('\n', '<br>') }} />
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[60vh] md:max-h-[90vh] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-gold-dark bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {product.range}
                </span>
                {product.volume && (
                  <span className="text-xs text-silver-500 font-medium">
                    • {product.volume}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-serif text-silver-900 font-semibold mb-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mb-4 text-xs text-silver-600">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">{product.rating || 5.0}</span>
                <span className="text-silver-400">• Verified Clinical Formulation</span>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-silver-900">
                  £{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-bold text-red-600 line-through">
                    Was £{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-silver-600 leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Key Ingredients */}
              {product.keyIngredients && product.keyIngredients.length > 0 && (
                <div className="mb-5 bg-silver-50 p-3.5 rounded-xl border border-silver-200/60">
                  <span className="text-xs font-bold text-silver-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-gold-dark" />
                    Key Active Actives:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.keyIngredients.map((ing, i) => (
                      <span key={i} className="text-[11px] bg-white border border-silver-200 text-silver-700 px-2 py-0.5 rounded-md">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* How to use */}
              {product.howToUse && (
                <div className="mb-6">
                  <span className="text-xs font-bold text-silver-800 uppercase tracking-wider block mb-1">
                    Clinical Application:
                  </span>
                  <p className="text-xs text-silver-600 italic">
                    {product.howToUse}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart Action */}
            <div className="border-t border-silver-200 pt-5 mt-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-silver-700 uppercase">Quantity:</span>
                <div className="flex items-center border border-silver-300 rounded-full overflow-hidden bg-silver-50">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1.5 px-3 hover:bg-silver-200 transition-colors text-silver-700 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-silver-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1.5 px-3 hover:bg-silver-200 transition-colors text-silver-700 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-black hover:bg-silver-800 text-white py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity > 1 ? `(${quantity}) Items` : 'to bag'} • £{(product.price * quantity).toFixed(2)}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-silver-500 pt-3">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-emerald-600" /> Next day dispatch
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authenticity guaranteed
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
