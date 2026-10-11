/**
 * Global Cart State Management & Persistence Store
 * Provides single-source-of-truth shopping cart actions, local storage persistence,
 * real-time cross-tab/event sync, and subtotal/total calculations.
 */

import { ShopProduct, CartItem } from '../types/shop';
import { Product } from '../types';

export const CART_STORAGE_KEY = 'arc_clinic_shopping_cart_v1';
export const CART_UPDATED_EVENT = 'arc_cart_updated';
export const FREE_SHIPPING_THRESHOLD = 75; // £75 free shipping
export const STANDARD_SHIPPING_COST = 4.95;

/**
 * Normalizes either a ShopProduct or legacy Product into a standard ShopProduct
 */
export function normalizeProductToShopProduct(item: ShopProduct | Product): ShopProduct {
  if ('slug' in item && typeof item.price === 'number') {
    return item as ShopProduct;
  }

  // Handle legacy Product interface
  const legacy = item as Product;
  let parsedPrice = 65;
  if (legacy.price) {
    const cleaned = legacy.price.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 0) {
      parsedPrice = num;
    }
  }

  return {
    id: legacy.id,
    name: legacy.name,
    slug: legacy.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    range: legacy.category || 'Age Reversal Rx',
    brand: legacy.brand || 'ARC ESSENTIALS',
    type: legacy.category || 'Skincare',
    skinType: ['All Skin Types'],
    skinConcerns: ['Anti-Aging & Fine Lines'],
    price: parsedPrice,
    image: legacy.image,
    description: `${legacy.name} - Professional grade skincare formula by Age Reversal Clinics.`,
    inStock: true
  };
}

/**
 * Load cart from localStorage safely
 */
export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && item.product && typeof item.quantity === 'number');
    }
    return [];
  } catch (err) {
    console.error('[CartStore] Failed to load cart from storage:', err);
    return [];
  }
}

/**
 * Save cart to localStorage and broadcast event
 */
export function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    broadcastCartUpdated(cart);
  } catch (err) {
    console.error('[CartStore] Failed to save cart to storage:', err);
  }
}

/**
 * Broadcast custom event for cross-component and multi-window sync
 */
export function broadcastCartUpdated(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const event = new CustomEvent(CART_UPDATED_EVENT, { detail: { cart } });
    window.dispatchEvent(event);
  } catch {
    // Ignore in unsupported environments
  }
}

/**
 * Compute total item count in cart
 */
export function calculateTotalCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

/**
 * Compute financial breakdown
 */
export function calculateCartTotals(cart: CartItem[]): {
  subtotal: number;
  shipping: number;
  total: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
} {
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = cart.length > 0 ? (isFreeShipping ? 0 : STANDARD_SHIPPING_COST) : 0;
  const total = subtotal + shipping;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    isFreeShipping,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountNeededForFreeShipping: Math.round(amountNeededForFreeShipping * 100) / 100
  };
}
