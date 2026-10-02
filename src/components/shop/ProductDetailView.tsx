import React, { useState } from 'react';
import { ShopProduct } from '../../types/shop';

interface ProductDetailViewProps {
  product: ShopProduct;
  onBack: () => void;
  onAddToCart: (product: ShopProduct, quantity: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const isVoucher = product.type === 'Voucher';

  const priceParts = product.price.toFixed(2).split('.');
  const wholePrice = priceParts[0];
  const decimalPrice = priceParts[1];

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#fbf8f3] via-[#f6efe4] to-[#fbf9f5] text-stone-900 overflow-hidden">
      {/* Luxury Gold & Champagne Ambient Lighting (Matches Header CTA Theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-[#D8C2A3]/50 via-[#ecdcc8]/30 to-transparent rounded-full blur-3xl opacity-90" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-[#ecdcc8]/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-[600px] h-[600px] bg-[#e4d2bc]/45 rounded-full blur-3xl" />
      </div>

      <section className="relative z-10 w-full py-20 lg:py-28 pt-2 lg:pt-10 2xl:px-4">
        <div className="max-w-6xl mx-auto w-full px-6 2xl:px-0">
          
          {/* Mobile Back button */}
          <div className="space-y-2 pb-6 lg:hidden">
            <button
              type="button"
              onClick={onBack}
              className="w-min rounded-full justify-center text-base whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none normal-case tracking-normal py-2 px-0 flex items-center space-x-2 sm:hover:bg-transparent cursor-pointer text-stone-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left h-5 w-5 text-noir-800"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <small>Back</small>
            </button>
          </div>

          {/* Desktop Breadcrumbs */}
          <div className="hidden pb-12 lg:block">
            <ul className="flex items-center space-x-1">
              <li className="flex items-center space-x-1 antialiased whitespace-nowrap">
                <span className="text-base text-[#8a7250] sm:text-lg">
                  <button
                    type="button"
                    onClick={onBack}
                    className="hover:text-black transition-colors cursor-pointer hover:underline"
                  >
                    Products
                  </button>
                </span>
                <span id="dupa" className="px-0 text-sm text-[#bda380] lg:px-2">/</span>
              </li>
              <li className="flex items-center space-x-1 antialiased whitespace-nowrap">
                <span className="text-base text-stone-900 font-medium sm:text-lg">{product.name}</span>
              </li>
            </ul>
          </div>

          {/* Sticky 12-Column Grid */}
          <div className="sticky grid gap-8 lg:grid-cols-12 lg:gap-10">
            
            {/* Left 7 Columns: Product Image Container with 30% OFF Badge */}
            <div className="lg:col-span-7 lg:h-auto">
              <div className="relative h-auto max-h-96 w-full overflow-hidden lg:sticky lg:top-32 lg:h-[600px] lg:max-h-fit bg-white/90 backdrop-blur-md rounded-3xl border border-[#D8C2A3]/45 shadow-[0_15px_40px_-10px_rgba(216,194,163,0.30)] flex items-center justify-center p-4">
                <img
                  alt={product.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  decoding="async"
                  data-nimg="1"
                  className="mx-auto h-full max-h-96 w-full object-contain object-top lg:max-h-fit drop-shadow-sm"
                  src={product.image}
                  style={{ color: 'transparent' }}
                />

                {(product.discountBadge || product.originalPrice) && (
                  <div className="absolute right-[10%] top-[2%] z-20 flex items-center justify-center rounded-full bg-[#EA014A] text-center font-Lato font-bold leading-tight text-white antialiased h-20 w-20 text-xl md:h-32 md:w-32 md:text-3xl shadow-lg">
                    <span>
                      {product.discountBadge ? (
                        <span dangerouslySetInnerHTML={{ __html: product.discountBadge.replace('\n', '<br>') }} />
                      ) : (
                        <>30%<br />OFF!</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Columns: Details, Pricing, Quantity & Add to Bag */}
            <div className="pb-40 lg:col-span-5">
              <div className="space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight font-serif text-stone-950">{product.name}</h1>
                </div>

                {/* Pricing */}
                <div>
                  <p className="no-margin text-2xl font-bold lg:text-3xl text-stone-950">
                    £{wholePrice}
                    <span className="text-lg md:text-xl md:align-bottom">.{decimalPrice}</span>
                  </p>
                  {product.originalPrice && (
                    <p className="no-margin text-sm font-bold uppercase text-red-600 line-through sm:text-base">
                      Was £{product.originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <p className="text-xl lg:text-2xl font-normal text-stone-900">Quantity</p>
                  <div className="flex items-center shadow-xs">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="inline-flex items-center w-min justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed font-Lato duration-200 font-semibold antialiased focus:outline-none border text-noir-800 bg-white/95 sm:hover:bg-[#faf4ec] disabled:text-noir-900 py-2 md:py-2.5 text-base sm:text-base rounded-none rounded-l-md border-[#D8C2A3]/70 px-3 disabled:border-[#D8C2A3]/40 disabled:opacity-100 cursor-pointer"
                      aria-label="Decrement quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-minus w-4 h-4"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                      </svg>
                    </button>
                    <p className="no-margin w-10 items-center border-b border-t border-[#D8C2A3]/70 bg-white/95 text-center text-base leading-8 md:py-0.5 select-none font-medium text-stone-900">
                      {quantity}
                    </p>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="inline-flex items-center w-min justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed font-Lato duration-200 font-semibold antialiased focus:outline-none border text-noir-800 bg-white/95 sm:hover:bg-[#faf4ec] disabled:text-noir-900 py-2 md:py-2.5 text-base sm:text-base rounded-none rounded-r-md border-[#D8C2A3]/70 px-3 disabled:border-[#D8C2A3]/40 disabled:opacity-100 cursor-pointer"
                      aria-label="Increment quantity"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus w-4 h-4"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add to Bag Button & Free Shipping Text */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="inline-flex items-center rounded-full justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none bg-noir-900 text-white sm:hover:bg-black disabled:bg-noir-700 disabled:sm:hover:bg-noir-700 px-6 md:px-10 text-lg sm:text-lg py-2.5 md:py-4 h-14 sm:h-15 w-full min-w-max whitespace-nowrap cursor-pointer shadow-[0_10px_25px_-5px_rgba(15,23,42,0.25)] hover:shadow-[0_15px_30px_-5px_rgba(15,23,42,0.35)] active:scale-[0.99]"
                  >
                    <div>
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <span>{isVoucher ? 'Buy Voucher' : 'Add to bag'}</span>
                      </div>
                    </div>
                  </button>
                  <div className="text-center">
                    <small className="text-[#8a7250] font-medium">Free shipping on orders over £50</small>
                  </div>
                </div>
              </div>

              {/* Extended Sections: Size, Description, Directions for use */}
              <div className="mt-10 space-y-6 lg:mt-16 lg:space-y-8">
                
                {/* Size */}
                <div className="space-y-2 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-[#D8C2A3]/40 shadow-xs">
                  <p className="text-xl lg:text-2xl font-semibold text-stone-900">Size</p>
                  <div className="prose font-Lato text-lg text-stone-700">{product.volume || '95ml'}</div>
                </div>

                {/* Description */}
                <div className="space-y-2 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-[#D8C2A3]/40 shadow-xs">
                  <p className="text-xl lg:text-2xl font-semibold text-stone-900">Description</p>
                  <div className="prose font-Lato text-lg text-stone-700 leading-relaxed">
                    {product.description || 'Fresh Matte Finish. An antioxidant-rich, matte day cream that offers daily protection while controlling oil and shine throughout the day.'}
                    <br />
                    <br />
                    {product.keyIngredients && product.keyIngredients.length > 0 ? (
                      <ul className="list-disc ml-4 space-y-1 text-stone-700">
                        {product.keyIngredients.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="list-disc ml-4 space-y-1 text-stone-700">
                        <li>Controls oil and shine throughout the day</li>
                        <li>Physical and Organic filters</li>
                        <li>B3 and Hyaluronic Acid</li>
                        <li>Vitamin E for skin healing</li>
                        <li>Vitamin B3 for large pores and acne-prone skins.</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Directions for use */}
                <div className="space-y-2 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-[#D8C2A3]/40 shadow-xs">
                  <p className="text-xl lg:text-2xl font-semibold text-stone-900">Directions for use</p>
                  <div className="prose font-Lato text-lg text-stone-700 leading-relaxed">
                    {product.howToUse || 'Apply every morning on top of your Skin Theory serum. Re-apply every 2 hours if exposed to the sun. Pair with our Antioxidant Lightening Serum for ultimate protection from pigmentation.'}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
