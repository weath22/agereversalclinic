import React, { useState } from 'react';
import { TreatmentPricingItem, PricingPackage } from '../../data/treatmentPricing';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

interface PackageSelectModalProps {
  treatment: TreatmentPricingItem | null;
  onClose: () => void;
  onBookPackage: (treatment: TreatmentPricingItem, selectedPackage: PricingPackage) => void;
}

export const PackageSelectModal: React.FC<PackageSelectModalProps> = ({
  treatment,
  onClose,
  onBookPackage,
}) => {
  if (!treatment) return null;

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-xs">
        {/* Backdrop dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal/Drawer Dialog Window with Exact Requested Markup */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="no-scrollbar fixed bottom-0 right-0 max-h-[100dvh] rounded-t-lg bg-white md:relative md:my-10 md:max-h-[90vh] md:rounded-2xl overflow-y-auto h-auto w-full md:w-full md:max-w-xl translate-y-0 md:translate-y-0 z-10 shadow-2xl"
        >
          <div
            className="relative w-full text-left pb-2 lg:pb-6"
            id="headlessui-dialog-panel-_r_1q_"
            data-headlessui-state="open"
          >
            {/* Sticky Header */}
            <div className="sticky left-0 top-0 z-20 w-full shrink-0 border-b border-grey bg-white">
              <div className="flex items-center justify-between px-6 py-1.5 lg:py-2">
                <h4 className="my-2.5 line-clamp-1 sm:my-3 text-base sm:text-lg font-medium text-noir-900">
                  Select package
                </h4>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center w-min justify-center text-base whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none normal-case tracking-normal rounded-full bg-grey px-2 py-2 sm:hover:bg-noir-100 cursor-pointer"
                  aria-label="Close"
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
                    className="lucide lucide-x h-4 w-4 text-noir-800 sm:h-5 sm:w-5"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6">
              <div className="space-y-2 pb-4 pt-2 sm:space-y-6 md:pt-0">
                <div className="space-y-0 pb-4">
                  {/* Treatment Title Header */}
                  <div className="relative pb-2 pt-1 lg:pb-0 lg:pt-4">
                    <p className="no-margin text-base lg:text-lg text-noir-700 font-normal">
                      {treatment.title}
                    </p>
                  </div>

                  {/* Package Option Items */}
                  <div className="space-y-3 pb-2 pt-2 lg:space-y-3 lg:pb-0 lg:pt-4">
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
                          className={`relative flex flex-col cursor-pointer justify-between rounded-lg border px-4 py-3 ring-[2px] duration-200 lg:px-5 lg:py-4 ${
                            isSelected
                              ? 'bg-purple/5 ring-purple border-transparent'
                              : 'border-noir-300 bg-white/70 ring-transparent sm:hover:border-transparent sm:hover:bg-white/70 sm:hover:ring-purple'
                          }`}
                        >
                          {/* Top Row: Session Title, Badges, and Per-Session Price */}
                          <div className="flex items-start justify-between w-full">
                            <div className="space-y-1 sm:space-y-1">
                              <div className="no-margin flex items-center text-lg lg:text-xl">
                                <span>
                                  {pkg.sessions} {pkg.sessions === 1 ? 'session' : 'sessions'}
                                </span>

                                {/* Popular badge */}
                                {isPopular && (
                                  <span className="ml-2 -mt-0.5 rounded-full bg-access-lilac px-2 py-0.5 font-Lato text-xs text-white md:block md:px-2.5 md:text-sm">
                                    Popular
                                  </span>
                                )}

                                {/* Best value badge */}
                                {isBestValue && (
                                  <span className="flex items-center space-x-0.5 md:space-x-1 ml-2 -mt-1 rounded-full bg-[#E62414] pl-2 pr-2.5 py-0.5 font-Lato text-xs text-white md:pl-1.5 md:pr-2.5 md:text-sm">
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
                                      className="lucide lucide-thumbs-up h-3 w-3 md:h-4 md:w-4"
                                      aria-hidden="true"
                                    >
                                      <path d="M7 10v12"></path>
                                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
                                    </svg>
                                    <span>Best value</span>
                                  </span>
                                )}
                              </div>

                              {/* Savings percentage tag */}
                              {pkg.savingsBadge && (
                                <div className="flex items-center space-x-1 font-semibold font-Lato text-xs text-[#E62414] duration-500 md:py-1 md:text-sm w-min whitespace-nowrap uppercase">
                                  <span>{pkg.savingsBadge}</span>
                                </div>
                              )}
                            </div>

                            {/* Right Side Per-Session Pricing */}
                            <div className="flex flex-col -space-y-2 text-right sm:-space-y-1">
                              <p className="no-margin text-lg lg:text-xl font-normal">
                                £{perSessionAmount}
                                <span className="text-sm md:text-base md:align-bottom">.95</span>
                              </p>
                              <p className="no-margin text-noir-700 antialiased">
                                <small className="text-xs md:text-sm">per session</small>
                              </p>
                            </div>
                          </div>

                          {/* Collapsible Benefits Trigger & Drawer */}
                          <div className="w-full mt-2 pt-2 border-t border-black/5">
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
                </div>

                {/* Total Price Row */}
                <div className="h-auto sm:h-auto">
                  <div className="flex items-end justify-between space-x-2">
                    <div className="whitespace-nowrap">
                      <p className="text-2xl md:text-2xl font-normal text-noir-900">
                        Total £{currentSelectedPackage?.price || treatment.startingPrice}
                        <span className="text-sm md:text-lg md:align-bottom">.95</span>
                      </p>
                    </div>
                    <div></div>
                  </div>
                  <div className="pt-2 pb-4 sm:pt-4 sm:pb-0"></div>
                </div>

                {/* Add to Package Action Button */}
                <div className="w-full space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentSelectedPackage) {
                        onBookPackage(treatment, currentSelectedPackage);
                      }
                    }}
                    className="inline-flex items-center rounded-full justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none bg-noir-900 text-white sm:hover:bg-noir-800 disabled:bg-noir-700 disabled:sm:hover:bg-noir-700 px-6 md:px-10 text-lg sm:text-lg py-2.5 md:py-4 h-14 sm:h-15 w-full min-w-max whitespace-nowrap cursor-pointer shadow-md"
                  >
                    <div>
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <span>Add to Package →</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
