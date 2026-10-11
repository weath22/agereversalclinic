import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TREATMENT_PRICING_DATA, TreatmentPricingItem, PricingPackage } from '../data/treatmentPricing';
import { PricingCard } from './pricing/PricingCard';
import { PackageSelectModal } from './pricing/PackageSelectModal';
import Pagination from './Pagination';
import { useTreatmentCart } from '../context/TreatmentCartContext';

interface ArticleRelatedTreatmentsProps {
  onBookClick: (treatmentName?: string) => void;
}

export default function ArticleRelatedTreatments({ onBookClick }: ArticleRelatedTreatmentsProps) {
  const { addTreatment } = useTreatmentCart();
  const [activePackageModalTreatment, setActivePackageModalTreatment] = useState<TreatmentPricingItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 3;
  const totalPages = Math.ceil(TREATMENT_PRICING_DATA.length / itemsPerPage);

  const currentTreatments = TREATMENT_PRICING_DATA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBookPackage = (treatment: TreatmentPricingItem, pkg: PricingPackage) => {
    setActivePackageModalTreatment(null);
    // Add to global treatment cart and open treatment plan drawer
    addTreatment(treatment, pkg, 1, true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById('article-related-treatments');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="article-related-treatments"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 bg-[#faf8f5] text-luxury-text border-b border-luxury-border overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm font-sans font-semibold text-luxury-gold uppercase tracking-[0.24em] block mb-2">
            Recommended Procedures
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text tracking-tight mb-3">
            Related Clinical Treatments
          </h2>
          <p className="text-sm sm:text-base text-luxury-subtext max-w-xl mx-auto font-light leading-relaxed">
            Specialist backed medical protocols to address concerns as discussed in this article.
          </p>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4 sm:mt-5" />
        </div>

        {/* Pricing Cards Grid (2 per row on mobile screens, 3 on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="wait">
            {currentTreatments.map((treatment) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                <PricingCard
                  treatment={treatment}
                  onChoosePackage={(t) => setActivePackageModalTreatment(t)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reusable Clinical Pagination Component */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Package Selection Modal */}
      {activePackageModalTreatment && (
        <PackageSelectModal
          treatment={activePackageModalTreatment}
          onClose={() => setActivePackageModalTreatment(null)}
          onBookPackage={handleBookPackage}
        />
      )}
    </section>
  );
}
