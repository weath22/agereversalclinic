export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  range: string; // 'Skin Theory' | 'Post-Treatment' | 'Laser Care' | 'Gifts & Vouchers'
  type: string; // 'Cleanser' | 'Day Cream' | 'Night Cream' | 'Serum' | 'Mask' | 'Eye Cream' | 'Bundle' | 'Voucher'
  skinType: string[]; // 'All Skin Types' | 'Dry / Dehydrated' | 'Oily / Blemish-Prone' | 'Sensitive' | 'Combination'
  skinConcerns: string[]; // 'Anti-Aging & Fine Lines' | 'Pigmentation & Brightening' | 'Acne & Breakouts' | 'Redness & Recovery' | 'Dehydration'
  price: number;
  originalPrice?: number;
  discountBadge?: string; // e.g. '30%\nOFF!'
  image: string;
  description: string;
  volume?: string;
  rating?: number;
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
