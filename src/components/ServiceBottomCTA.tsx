import React, { useState, useMemo } from 'react';
import { TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import { getHybridTreatmentPricing } from '../lib/treatmentResolver';
import { PricingPackageSelector } from './pricing/PricingPackageSelector';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTreatmentCart } from '../context/TreatmentCartContext';

interface ServiceBottomCTAProps {
  data: {
    id?: string;
    title: string;
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

export default function ServiceBottomCTA({ data, onBook }: ServiceBottomCTAProps) {
  const { addTreatment } = useTreatmentCart();
  const [notification, setNotification] = useState<string | null>(null);

  // Resolve or synthesize the matching TreatmentPricingItem using Universal Hybrid Resolver
  const treatmentPricingItem: TreatmentPricingItem = useMemo(() => {
    return getHybridTreatmentPricing(
      {
        id: data.id || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: data.title,
        price: data.price || '£250',
        time: data.procedureTime || '30 - 45 Mins',
        desc: data.description || data.summary || 'Clinical treatment calibrated to your unique anatomy.',
        badge: data.badgeText
      },
      data.category
    );
  }, [data]);

  const handleBookPackage = (treatment: TreatmentPricingItem, pkg: PricingPackage) => {
    // Add to global treatment cart and open treatment plan drawer
    addTreatment(treatment, pkg, 1, true);
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
        {/* Exact Pricing Selector UI (reused directly) */}
        <PricingPackageSelector
          treatment={treatmentPricingItem}
          onBookPackage={handleBookPackage}
          showHeader={true}
        />
      </div>
    </div>
  );
}
