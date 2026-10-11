/**
 * Global Treatment Cart & Clinical Plan Context
 * Manages selected clinical treatments, package tiers, pricing calculations,
 * and treatment drawer visibility across all pages.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TreatmentCartItem, TreatmentTotals } from '../types/treatmentCart';
import { TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import {
  loadTreatmentCartFromStorage,
  saveTreatmentCartToStorage,
  calculateTotalTreatmentCount,
  calculateTreatmentTotals,
  createTreatmentCartItem,
  generateTreatmentCartItemId,
  TREATMENT_CART_STORAGE_KEY,
  TREATMENT_CART_UPDATED_EVENT,
} from '../lib/treatmentCartStore';

export interface TreatmentCartContextValue {
  treatmentCart: TreatmentCartItem[];
  totalTreatmentCount: number;
  treatmentSubtotal: number;
  totalSessions: number;
  totalSavings: number;
  currency: string;
  isTreatmentCartOpen: boolean;
  notification: string | null;
  // Actions
  addTreatment: (
    treatment: TreatmentPricingItem,
    pkg: PricingPackage,
    quantity?: number,
    openDrawer?: boolean
  ) => void;
  removeTreatment: (itemId: string) => void;
  updateTreatmentPackage: (treatmentId: string, newPackage: PricingPackage) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearTreatmentCart: () => void;
  openTreatmentCart: () => void;
  closeTreatmentCart: () => void;
  toggleTreatmentCart: () => void;
  dismissNotification: () => void;
}

const TreatmentCartContext = createContext<TreatmentCartContextValue | undefined>(undefined);

export const TreatmentCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [treatmentCart, setTreatmentCart] = useState<TreatmentCartItem[]>(() => {
    return loadTreatmentCartFromStorage();
  });
  const [isTreatmentCartOpen, setIsTreatmentCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state and localStorage
  const updateCartState = useCallback(
    (newCart: TreatmentCartItem[] | ((prev: TreatmentCartItem[]) => TreatmentCartItem[])) => {
      setTreatmentCart(prev => {
        const next = typeof newCart === 'function' ? newCart(prev) : newCart;
        saveTreatmentCartToStorage(next);
        return next;
      });
    },
    []
  );

  // Cross-tab and window event listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TREATMENT_CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setTreatmentCart(parsed);
          }
        } catch (err) {
          console.error('[TreatmentCartContext] Storage sync error:', err);
        }
      }
    };

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<{ cart: TreatmentCartItem[] }>;
      if (custom.detail?.cart) {
        setTreatmentCart(custom.detail.cart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(TREATMENT_CART_UPDATED_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(TREATMENT_CART_UPDATED_EVENT, handleCustomEvent);
    };
  }, []);

  // Notification auto-dismiss timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Actions
  const addTreatment = useCallback(
    (
      treatment: TreatmentPricingItem,
      pkg: PricingPackage,
      quantity: number = 1,
      openDrawer: boolean = false
    ) => {
      const targetId = generateTreatmentCartItemId(treatment.id, pkg.id);
      const safeQty = Math.max(1, quantity);

      updateCartState(prev => {
        // If exact treatment + package combination already exists, bump quantity
        const existingExactIndex = prev.findIndex(item => item.id === targetId);
        if (existingExactIndex > -1) {
          const updated = [...prev];
          updated[existingExactIndex] = {
            ...updated[existingExactIndex],
            quantity: updated[existingExactIndex].quantity + safeQty,
          };
          return updated;
        }

        // If the same treatment is in the cart with a different package tier, update the tier
        const existingTreatmentIndex = prev.findIndex(item => item.treatment.id === treatment.id);
        if (existingTreatmentIndex > -1) {
          const updated = [...prev];
          updated[existingTreatmentIndex] = createTreatmentCartItem(
            treatment,
            pkg,
            updated[existingTreatmentIndex].quantity || 1
          );
          return updated;
        }

        // Otherwise add as new treatment item
        return [...prev, createTreatmentCartItem(treatment, pkg, safeQty)];
      });

      setNotification(`Added "${treatment.title} (${pkg.name})" to your Treatment Plan`);

      if (openDrawer) {
        setIsTreatmentCartOpen(true);
      }
    },
    [updateCartState]
  );

  const removeTreatment = useCallback(
    (itemId: string) => {
      updateCartState(prev => prev.filter(item => item.id !== itemId));
    },
    [updateCartState]
  );

  const updateTreatmentPackage = useCallback(
    (treatmentId: string, newPackage: PricingPackage) => {
      updateCartState(prev => {
        return prev.map(item => {
          if (item.treatment.id === treatmentId) {
            return createTreatmentCartItem(item.treatment, newPackage, item.quantity);
          }
          return item;
        });
      });
      setNotification(`Updated package for "${newPackage.name}"`);
    },
    [updateCartState]
  );

  const updateQuantity = useCallback(
    (itemId: string, delta: number) => {
      updateCartState(prev =>
        prev
          .map(item => {
            if (item.id === itemId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as TreatmentCartItem[]
      );
    },
    [updateCartState]
  );

  const clearTreatmentCart = useCallback(() => {
    updateCartState([]);
  }, [updateCartState]);

  const openTreatmentCart = useCallback(() => setIsTreatmentCartOpen(true), []);
  const closeTreatmentCart = useCallback(() => setIsTreatmentCartOpen(false), []);
  const toggleTreatmentCart = useCallback(() => setIsTreatmentCartOpen(prev => !prev), []);
  const dismissNotification = useCallback(() => setNotification(null), []);

  // Aggregated Totals
  const totalTreatmentCount = useMemo(() => calculateTotalTreatmentCount(treatmentCart), [treatmentCart]);
  const totals: TreatmentTotals = useMemo(() => calculateTreatmentTotals(treatmentCart), [treatmentCart]);

  const value: TreatmentCartContextValue = useMemo(
    () => ({
      treatmentCart,
      totalTreatmentCount,
      treatmentSubtotal: totals.subtotal,
      totalSessions: totals.totalSessions,
      totalSavings: totals.totalSavings,
      currency: totals.currency,
      isTreatmentCartOpen,
      notification,
      addTreatment,
      removeTreatment,
      updateTreatmentPackage,
      updateQuantity,
      clearTreatmentCart,
      openTreatmentCart,
      closeTreatmentCart,
      toggleTreatmentCart,
      dismissNotification,
    }),
    [
      treatmentCart,
      totalTreatmentCount,
      totals,
      isTreatmentCartOpen,
      notification,
      addTreatment,
      removeTreatment,
      updateTreatmentPackage,
      updateQuantity,
      clearTreatmentCart,
      openTreatmentCart,
      closeTreatmentCart,
      toggleTreatmentCart,
      dismissNotification,
    ]
  );

  return <TreatmentCartContext.Provider value={value}>{children}</TreatmentCartContext.Provider>;
};

export function useTreatmentCart(): TreatmentCartContextValue {
  const context = useContext(TreatmentCartContext);
  if (!context) {
    throw new Error('useTreatmentCart must be used within a TreatmentCartProvider');
  }
  return context;
}
