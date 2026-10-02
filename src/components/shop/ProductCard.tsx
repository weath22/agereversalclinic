import React from 'react';
import { ShopProduct } from '../../types/shop';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: ShopProduct;
  onViewProduct: (product: ShopProduct) => void;
  onAddToCart: (product: ShopProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onAddToCart,
}) => {
  const isVoucher = product.type === 'Voucher';
  const priceParts = product.price.toFixed(2).split('.');
  const wholePrice = priceParts[0];
  const decimalPrice = priceParts[1];

  return (
    <div className="group flex h-full flex-1 p-0 sm:p-3.5 rounded-none sm:rounded-3xl bg-transparent sm:bg-white/90 sm:backdrop-blur-xs border-0 sm:border sm:border-[#D8C2A3]/40 shadow-none sm:shadow-[0_4px_20px_-4px_rgba(216,194,163,0.14)] sm:hover:shadow-[0_12px_32px_-4px_rgba(216,194,163,0.25)] sm:hover:border-[#D8C2A3] transition-all duration-300">
      <div className="mb-0 sm:mb-2 flex h-auto w-full flex-col justify-between space-y-2 sm:space-y-4">
        <div className="space-y-2 sm:space-y-4">
          {/* Image Box with Hover Overlay & Discount Badge */}
          <div
            onClick={() => onViewProduct(product)}
            className="relative h-44 sm:h-48 md:h-80 w-full overflow-hidden bg-white/95 rounded-2xl border border-[#D8C2A3]/30 cursor-pointer shadow-xs transition-all duration-300"
          >
            <img
              alt={product.name}
              loading="lazy"
              className="mx-auto h-full w-full object-contain p-2.5 sm:p-4 md:p-6 duration-300 group-hover:scale-105 transition-transform"
              src={product.image}
            />

            {/* Hover 'View product' CTA overlay */}
            <div className="absolute left-0 top-0 h-full w-full pointer-events-none">
              <div className="flex h-full flex-1 items-center justify-center opacity-0 duration-300 group-hover:opacity-100 bg-[#D8C2A3]/15 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProduct(product);
                  }}
                  className="pointer-events-auto inline-flex items-center rounded-full justify-center whitespace-nowrap transition-all duration-200 font-sans font-semibold border border-[#D8C2A3] text-stone-900 hover:bg-black hover:text-white px-5 py-2 md:py-2.5 text-xs sm:text-sm bg-white shadow-md cursor-pointer"
                >
                  View product →
                </button>
              </div>
            </div>

            {/* Discount Badge */}
            {product.discountBadge && (
              <div className="absolute right-[5%] sm:right-[8%] top-[3%] sm:top-[4%] z-20 flex items-center justify-center rounded-full bg-[#EA014A] text-center font-Lato font-bold leading-tight text-white antialiased h-11 w-11 sm:h-14 sm:w-14 text-[10px] sm:text-xs md:h-16 md:w-16 md:text-sm shadow-md rotate-3">
                <span dangerouslySetInnerHTML={{ __html: product.discountBadge.replace('\n', '<br>') }} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="text-center px-0.5 sm:px-1">
            <button
              onClick={() => onViewProduct(product)}
              className="w-full text-center hover:text-stone-950 transition-colors cursor-pointer"
            >
              <p className="no-margin text-center text-xs sm:text-base md:text-lg font-medium text-stone-900 line-clamp-2 min-h-[1.9rem] sm:min-h-[2.5rem] group-hover:text-black leading-snug">
                {product.name}
              </p>
            </button>

            <p className="no-margin text-center text-sm sm:text-lg md:text-xl font-bold text-stone-950 mt-0.5 sm:mt-1">
              £{wholePrice}
              <span className="text-xs sm:text-sm md:text-base font-medium align-top">.{decimalPrice}</span>
            </p>

            {product.originalPrice ? (
              <p className="no-margin text-center text-[10px] sm:text-xs md:text-sm font-bold uppercase text-red-600 line-through mt-0.5">
                Was £{product.originalPrice.toFixed(2)}
              </p>
            ) : (
              <p className="text-[10px] sm:text-xs text-transparent select-none mt-0.5">Placeholder</p>
            )}
          </div>
        </div>

        {/* Add to List / Buy Voucher Button */}
        <div className="flex flex-col items-center justify-center pt-0.5 sm:pt-1">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center rounded-full justify-center whitespace-nowrap transition-all duration-200 font-sans font-semibold bg-noir-900 text-white hover:bg-black active:scale-98 px-3 sm:px-6 py-2 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm w-full md:w-44 shadow-sm hover:shadow-md cursor-pointer gap-1.5 sm:gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isVoucher ? 'Buy Voucher' : 'Add to List'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
