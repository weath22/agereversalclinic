import React, { useState, useMemo, useEffect } from 'react';
import {
  TreatmentPricingItem,
  PricingPackage,
  DEFAULT_TREATMENT_TAXONOMY,
  inferTreatmentSubGroup,
} from '../data/treatmentPricing';
import { getHybridTreatmentPricing } from '../lib/treatmentResolver';
import {
  getTreatmentPricingData,
  getTreatmentTaxonomy,
  getMasterServices,
} from '../lib/adminStore';
import { PricingPackageSelector } from './pricing/PricingPackageSelector';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTreatmentCart } from '../context/TreatmentCartContext';

interface ServiceBottomCTAProps {
  data: {
    id?: string;
    title: string;
    subCategoryId?: string;
    subCategoryName?: string;
    price?: string;
    imageUrl?: string;
    beforeImage?: string;
    description?: string;
    badgeText?: string;
    category?: string;
    procedureTime?: string;
    downtime?: string;
    recommendedSessions?: string;
    summary?: string;
  };
  onBook: (serviceName: string) => void;
}

export default function ServiceBottomCTA({ data }: ServiceBottomCTAProps) {
  const { addTreatment } = useTreatmentCart();
  const [notification] = useState<string | null>(null);
  const [pricingCatalog, setPricingCatalog] = useState<TreatmentPricingItem[]>(() =>
    getTreatmentPricingData()
  );

  useEffect(() => {
    const handlePricingUpdate = () => {
      setPricingCatalog(getTreatmentPricingData());
    };
    window.addEventListener('treatment_pricing_updated', handlePricingUpdate);
    window.addEventListener('site_customizations_hydrated', handlePricingUpdate);
    window.addEventListener('storage', handlePricingUpdate);
    return () => {
      window.removeEventListener('treatment_pricing_updated', handlePricingUpdate);
      window.removeEventListener('site_customizations_hydrated', handlePricingUpdate);
      window.removeEventListener('storage', handlePricingUpdate);
    };
  }, []);

  // Resolve matching treatments for this subcategory or specific treatment
  const { primaryTreatment, subcategoryTreatments } = useMemo(() => {
    const activeCatalog = (pricingCatalog || []).filter(
      (item) => !item.hidden && item.isActive !== false && Array.isArray(item.packages) && item.packages.length > 0
    );

    const rawId = (data.id || '').toLowerCase().trim();
    const rawTitle = (data.title || '').toLowerCase().trim();
    const rawSubId = (data.subCategoryId || '').toLowerCase().trim();
    const rawSubName = (data.subCategoryName || '').toLowerCase().trim();

    // 1. Check if this page represents a Subcategory (Specialist Area)
    const taxonomy = getTreatmentTaxonomy() || DEFAULT_TREATMENT_TAXONOMY;
    const masterServices = getMasterServices() || [];

    const allSubGroups: Array<{ id: string; name: string }> = [];
    for (const branch of taxonomy) {
      for (const sg of branch.subGroups || []) {
        allSubGroups.push({ id: sg.id.toLowerCase().trim(), name: sg.name.toLowerCase().trim() });
      }
    }
    for (const sg of DEFAULT_TREATMENT_TAXONOMY.flatMap((b) => b.subGroups)) {
      const idLower = sg.id.toLowerCase().trim();
      if (!allSubGroups.some((x) => x.id === idLower)) {
        allSubGroups.push({ id: idLower, name: sg.name.toLowerCase().trim() });
      }
    }
    for (const ms of masterServices) {
      const idLower = ms.id.toLowerCase().trim();
      if (!allSubGroups.some((x) => x.id === idLower)) {
        allSubGroups.push({ id: idLower, name: ms.title.toLowerCase().trim() });
      }
    }

    const matchedSubGroup =
      allSubGroups.find(
        (sg) =>
          sg.id === rawId ||
          sg.name === rawTitle ||
          (rawSubId && sg.id === rawSubId && (!rawId || rawId === rawSubId)) ||
          (rawSubName && sg.name === rawSubName && (!rawTitle || rawTitle === rawSubName))
      ) ||
      (rawSubId
        ? allSubGroups.find((sg) => sg.id === rawSubId || sg.name === rawSubName)
        : undefined);

    // Check if the current page is a direct single treatment (not a subcategory)
    const directSingleMatch = activeCatalog.find(
      (item) =>
        (item.id.toLowerCase().trim() === rawId || item.title.toLowerCase().trim() === rawTitle) &&
        (!matchedSubGroup ||
          (matchedSubGroup.id !== rawId && matchedSubGroup.name !== rawTitle))
    );

    if (directSingleMatch) {
      return {
        primaryTreatment: directSingleMatch,
        subcategoryTreatments: [directSingleMatch],
      };
    }

    if (matchedSubGroup) {
      const targetSubId = matchedSubGroup.id;
      const targetSubName = matchedSubGroup.name;

      const matchingItems = activeCatalog.filter((item) => {
        const inferred = inferTreatmentSubGroup(item);
        const itemSubId = (item.subGroupId || inferred.subGroupId || '').toLowerCase().trim();
        const itemSubCat = (item.subCategory || inferred.subCategory || '').toLowerCase().trim();

        if (
          (targetSubId === 'men-and-kids' || targetSubId === 'men-kids-services') &&
          (itemSubId === 'men-and-kids' || itemSubId === 'men-kids-services')
        ) {
          return true;
        }

        return itemSubId === targetSubId || itemSubCat === targetSubName;
      });

      if (matchingItems.length > 0) {
        return {
          primaryTreatment: matchingItems[0],
          subcategoryTreatments: matchingItems,
        };
      }
    }

    // Fallback to hybrid resolver with live pricing catalog
    const fallback = getHybridTreatmentPricing(
      {
        id: data.id || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: data.title,
        price: data.price || '£250',
        time: data.procedureTime || '30 - 45 Mins',
        desc:
          data.description ||
          data.summary ||
          'Clinical treatment calibrated to your unique anatomy.',
        badge: data.badgeText,
      },
      data.category,
      activeCatalog
    );

    return {
      primaryTreatment: fallback,
      subcategoryTreatments: [fallback],
    };
  }, [data, pricingCatalog]);

  const handleBookPackage = (treatment: TreatmentPricingItem, pkg: PricingPackage) => {
    // Add to global treatment cart and open treatment plan drawer
    addTreatment(treatment, pkg, 1, true);
  };

  const handleBookPackages = (
    entries: Array<{ treatment: TreatmentPricingItem; selectedPackage: PricingPackage }>
  ) => {
    entries.forEach((entry, idx) => {
      const isLast = idx === entries.length - 1;
      addTreatment(entry.treatment, entry.selectedPackage, 1, isLast);
    });
  };

  return (
    <div id="bottom-booking-cta" className="my-6 sm:my-8 -mx-4 sm:mx-0">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm border border-luxury-gold/40"
          >
            <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full sm:max-w-2xl sm:mx-auto">
        <PricingPackageSelector
          treatment={primaryTreatment}
          treatments={subcategoryTreatments}
          subcategoryTitle={data.subCategoryName || data.title}
          onBookPackage={handleBookPackage}
          onBookPackages={handleBookPackages}
          showHeader={true}
        />
      </div>
    </div>
  );
}

