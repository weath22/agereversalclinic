export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  range: string; // 'Skin Theory' | 'Age Reversal Rx' | 'Laser Care' | 'Gifts & Vouchers'
  brand?: string;
  type: string; // 'Cleanser' | 'Day Cream' | 'Night Cream' | 'Serum' | 'Mask' | 'Eye Cream' | 'Bundle' | 'Voucher'
  skinType: string[]; // 'All Skin Types' | 'Dry / Dehydrated' | 'Oily / Blemish-Prone' | 'Sensitive' | 'Combination'
  skinConcerns: string[]; // 'Anti-Aging & Fine Lines' | 'Pigmentation & Brightening' | 'Acne & Breakouts' | 'Redness & Recovery' | 'Dehydration'
  price: number;
  originalPrice?: number;
  currency?: string; // 'GBP' or '£'
  discountBadge?: string; // e.g. '30%\nOFF!'
  badge?: string; // e.g. 'Best Seller', 'Doctor Recommended', 'Award Winner'
  sku?: string;
  image: string;
  hoverImage?: string;
  textureImage?: string;
  description: string;
  clinicalBenefits?: string[];
  volume?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  keyIngredients?: string[];
  howToUse?: string;
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

export interface FilterState {
  range: string[];
  type: string[];
  skinType: string[];
  skinConcerns: string[];
  searchQuery: string;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}
