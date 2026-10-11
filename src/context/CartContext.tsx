/**
 * Unified Global Shopping Cart Context & React Hook
 * Provides single-source-of-truth state, reactive subtotal/totals,
 * drawer visibility, cross-tab synchronization, and convenient dispatchers.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ShopProduct, CartItem } from '../types/shop';
import { Product } from '../types';
import {
  loadCartFromStorage,
  saveCartToStorage,
  normalizeProductToShopProduct,
  calculateTotalCartCount,
  calculateCartTotals,
  CART_UPDATED_EVENT,
  CART_STORAGE_KEY
} from '../lib/cartStore';

export interface CartContextValue {
  cart: CartItem[];
  totalCartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  notification: string | null;
  // Actions
  addToCart: (product: ShopProduct | Product, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  dismissNotification: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    return loadCartFromStorage();
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state into localStorage whenever cart changes
  const updateCartState = useCallback((newCart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => {
    setCart(prev => {
      const nextCart = typeof newCart === 'function' ? newCart(prev) : newCart;
      saveCartToStorage(nextCart);
      return nextCart;
    });
  }, []);

  // Listen for storage events (cross-tab / multi-window) and local custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCart(parsed);
          }
        } catch (err) {
          console.error('[CartContext] Error syncing storage event:', err);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<{ cart: CartItem[] }>;
      if (custom.detail?.cart) {
        setCart(custom.detail.cart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CART_UPDATED_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CART_UPDATED_EVENT, handleCustomEvent);
    };
  }, []);

  // Notification auto-dismiss timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [notification]);

  // Actions
  const addToCart = useCallback(
    (product: ShopProduct | Product, quantity: number = 1, openDrawer: boolean = false) => {
      const normalized = normalizeProductToShopProduct(product);
      const safeQty = Math.max(1, quantity);

      updateCartState(prev => {
        const existingIndex = prev.findIndex(item => item.product.id === normalized.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + safeQty
          };
          return updated;
        }
        return [...prev, { product: normalized, quantity: safeQty }];
      });

      setNotification(`Added "${normalized.name}" to your shopping bag`);

      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    [updateCartState]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      updateCartState(prev => prev.filter(item => item.product.id !== productId));
    },
    [updateCartState]
  );

  const updateQuantity = useCallback(
    (productId: string, delta: number) => {
      updateCartState(prev =>
        prev
          .map(item => {
            if (item.product.id === productId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
      );
    },
    [updateCartState]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      updateCartState(prev =>
        prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
      );
    },
    [updateCartState, removeFromCart]
  );

  const clearCart = useCallback(() => {
    updateCartState([]);
  }, [updateCartState]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const dismissNotification = useCallback(() => setNotification(null), []);

  // Compute calculated metrics
  const totalCartCount = useMemo(() => calculateTotalCartCount(cart), [cart]);
  const totals = useMemo(() => calculateCartTotals(cart), [cart]);

  const value: CartContextValue = useMemo(
    () => ({
      cart,
      totalCartCount,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      isFreeShipping: totals.isFreeShipping,
      freeShippingThreshold: totals.freeShippingThreshold,
      amountNeededForFreeShipping: totals.amountNeededForFreeShipping,
      isCartOpen,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      dismissNotification
    }),
    [
      cart,
      totalCartCount,
      totals,
      isCartOpen,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      setQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      dismissNotification
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
