import React, { useState } from 'react';
import { TreatmentPricingItem, PricingPackage } from '../../data/treatmentPricing';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ThumbsUp } from 'lucide-react';

interface PricingPackageSelectorProps {
  treatment: TreatmentPricingItem;
  onBookPackage: (treatment: TreatmentPricingItem, selectedPackage: PricingPackage) => void;
  className?: string;
  showHeader?: boolean;
}

export const PricingPackageSelector: React.FC<PricingPackageSelectorProps> = ({
  treatment,
  onBookPackage,
  className = '',
  showHeader = true,
}) => {
  // Set default selected package (popular one if available, otherwise first)
  const defaultPopular = treatment.packages.find((p) => p.isPopular) || treatment.packages[0];

  const [selectedPkgId, setSelectedPkgId] = useState<string>(
    defaultPopular?.id || treatment.packages[0]?.id || ''
  );

  // Popular package is open by default for benefits
  const [openBenefitsIds, setOpenBenefitsIds] = useState<string[]>(() => {
    const popularPkgs = treatment.packages.filter((p) => p.isPopular).map((p) => p.id);
    if (popularPkgs.length > 0) return popularPkgs;
    return treatment.packages[0] ? [treatment.packages[0].id] : [];
  });

  const toggleBenefits = (pkgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenBenefitsIds((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  const currentSelectedPackage =
    treatment.packages.find((p) => p.id === selectedPkgId) || treatment.packages[0];

  return (
    <div className={`w-full bg-white rounded-none sm:rounded-2xl border-y sm:border border-grey/80 shadow-none sm:shadow-md px-4 py-5 sm:p-7 md:p-8 ${className}`}>
      {showHeader && (
        <div className="border-b border-grey pb-4 mb-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg sm:text-xl font-medium text-noir-900 tracking-tight">
              Select package
            </h4>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-noir-600 bg-grey px-2.5 py-1 rounded-full">
              {treatment.category}
            </span>
          </div>
          <p className="text-sm lg:text-base text-noir-700 font-normal mt-1">
            {treatment.title}
          </p>
        </div>
      )}

      {/* Package Option Items */}
      <div className="space-y-3.5 pb-5">
        {treatment.packages.map((pkg, idx) => {
          const isSelected = selectedPkgId === pkg.id;
          const isBenefitsOpen = openBenefitsIds.includes(pkg.id);
          const perSessionAmount =
            pkg.perSessionPrice || Math.round(pkg.price / (pkg.sessions || 1));
          const isBestValue = idx === treatment.packages.length - 1 && treatment.packages.length > 1;
          const isPopular = pkg.isPopular && !isBestValue;

          return (
            <div
              key={pkg.id}
              onClick={() => setSelectedPkgId(pkg.id)}
              className={`relative flex flex-col cursor-pointer justify-between rounded-xl border px-4 py-3.5 ring-[2px] transition-all duration-200 lg:px-5 lg:py-4 ${
                isSelected
                  ? 'bg-purple/5 ring-purple border-transparent shadow-xs'
                  : 'border-noir-300 bg-white/70 ring-transparent hover:border-transparent hover:bg-white/70 hover:ring-purple'
              }`}
            >
              {/* Top Row: Session Title, Badges, and Per-Session Price */}
              <div className="flex items-start justify-between w-full gap-2">
                <div className="space-y-1 sm:space-y-1">
                  <div className="flex items-center text-lg lg:text-xl font-normal text-noir-900">
                    <span>
                      {pkg.sessions} {pkg.sessions === 1 ? 'session' : 'sessions'}
                    </span>

                    {/* Popular badge */}
                    {isPopular && (
                      <span className="ml-2 -mt-0.5 rounded-full bg-access-lilac px-2.5 py-0.5 font-Lato text-xs font-semibold text-white">
                        Popular
                      </span>
                    )}

                    {/* Best value badge */}
                    {isBestValue && (
                      <span className="flex items-center space-x-1 ml-2 -mt-0.5 rounded-full bg-[#E62414] px-2.5 py-0.5 font-Lato text-xs font-semibold text-white">
                        <ThumbsUp className="h-3 w-3" />
                        <span>Best value</span>
                      </span>
                    )}
                  </div>

                  {/* Savings percentage tag */}
                  {pkg.savingsBadge && (
                    <div className="flex items-center space-x-1 font-semibold font-Lato text-xs text-[#E62414] uppercase tracking-wide">
                      <span>{pkg.savingsBadge}</span>
                    </div>
                  )}
                </div>

                {/* Right Side Per-Session Pricing */}
                <div className="flex flex-col text-right shrink-0">
                  <p className="text-lg lg:text-xl font-normal text-noir-900">
                    £{perSessionAmount}
                    <span className="text-sm md:text-base align-baseline">.95</span>
                  </p>
                  <p className="text-xs text-noir-700 antialiased -mt-0.5">
                    per session
                  </p>
                </div>
              </div>

              {/* Collapsible Benefits Trigger & Drawer */}
              <div className="w-full mt-2.5 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={(e) => toggleBenefits(pkg.id, e)}
                  className="flex items-center gap-1.5 text-xs font-Lato font-medium text-noir-700 hover:text-black transition-colors cursor-pointer py-0.5"
                >
                  <span>{isBenefitsOpen ? 'Hide package benefits' : 'View package benefits'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isBenefitsOpen ? 'rotate-180 text-black' : 'text-noir-600'
                    }`}
                  />
                </button>

                {/* Collapsible Benefits Content */}
                <AnimatePresence>
                  {isBenefitsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 space-y-1.5">
                        {pkg.includes && pkg.includes.length > 0 ? (
                          <ul className="space-y-1">
                            {pkg.includes.map((benefit, bIdx) => (
                              <li
                                key={bIdx}
                                className="flex items-start gap-2 text-xs text-noir-800 font-light"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-noir-800 font-light">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Full clinician assessment and post-treatment aftercare</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price and Action Button Bar */}
      <div className="border-t border-grey pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="whitespace-nowrap">
          <p className="text-xs uppercase tracking-wider font-semibold text-noir-600">Total Investment</p>
          <p className="text-2xl sm:text-3xl font-normal text-noir-900 mt-0.5">
            £{currentSelectedPackage?.price || treatment.startingPrice}
            <span className="text-base sm:text-lg align-baseline">.95</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentSelectedPackage) {
              onBookPackage(treatment, currentSelectedPackage);
            }
          }}
          className="inline-flex items-center rounded-full justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none bg-noir-900 text-white hover:bg-noir-800 px-8 py-3.5 sm:py-4 text-base cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99]"
        >
          <span>Add to Package →</span>
        </button>
      </div>
    </div>
  );
};
