import React, { useState, useEffect, useMemo } from 'react';
import { TreatmentPricingItem, PricingPackage } from '../../data/treatmentPricing';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ThumbsUp } from 'lucide-react';

export interface SelectedTreatmentPackageEntry {
  treatment: TreatmentPricingItem;
  selectedPackage: PricingPackage;
}

interface PricingPackageSelectorProps {
  treatment: TreatmentPricingItem;
  treatments?: TreatmentPricingItem[];
  subcategoryTitle?: string;
  onBookPackage: (treatment: TreatmentPricingItem, selectedPackage: PricingPackage) => void;
  onBookPackages?: (entries: SelectedTreatmentPackageEntry[]) => void;
  className?: string;
  showHeader?: boolean;
}

export const PricingPackageSelector: React.FC<PricingPackageSelectorProps> = ({
  treatment,
  treatments,
  subcategoryTitle,
  onBookPackage,
  onBookPackages,
  className = '',
  showHeader = true,
}) => {
  const resolvedTreatments = useMemo(() => {
    const list =
      treatments && treatments.length > 0
        ? treatments.filter((t) => Array.isArray(t.packages) && t.packages.length > 0)
        : [];
    return list.length > 0 ? list : [treatment];
  }, [treatments, treatment]);

  const makeSelectionKey = (treatmentId: string, pkgId: string) => `${treatmentId}::${pkgId}`;

  const getDefaultSelection = (list: TreatmentPricingItem[]) => {
    const firstTreatment = list[0];
    if (!firstTreatment || !firstTreatment.packages.length) {
      return { treatmentId: treatment.id, pkgId: treatment.packages[0]?.id || '' };
    }
    const defaultPopular =
      firstTreatment.packages.find((p) => p.isPopular) || firstTreatment.packages[0];
    return {
      treatmentId: firstTreatment.id,
      pkgId: defaultPopular?.id || firstTreatment.packages[0]?.id || '',
    };
  };

  // Multi-selection state: array of composite keys `${treatmentId}::${pkgId}`
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    const def = getDefaultSelection(resolvedTreatments);
    return def.pkgId ? [makeSelectionKey(def.treatmentId, def.pkgId)] : [];
  });

  // Popular package in the first treatment is open by default for benefits
  const [openBenefitsKeys, setOpenBenefitsKeys] = useState<string[]>(() => {
    const firstTreatment = resolvedTreatments[0];
    if (!firstTreatment) return [];
    const popularKeys = firstTreatment.packages
      .filter((p) => p.isPopular)
      .map((p) => makeSelectionKey(firstTreatment.id, p.id));
    if (popularKeys.length > 0) return popularKeys;
    return firstTreatment.packages[0]
      ? [makeSelectionKey(firstTreatment.id, firstTreatment.packages[0].id)]
      : [];
  });

  useEffect(() => {
    const def = getDefaultSelection(resolvedTreatments);
    setSelectedKeys(def.pkgId ? [makeSelectionKey(def.treatmentId, def.pkgId)] : []);
    const firstTreatment = resolvedTreatments[0];
    if (firstTreatment) {
      const popularKeys = firstTreatment.packages
        .filter((p) => p.isPopular)
        .map((p) => makeSelectionKey(firstTreatment.id, p.id));
      if (popularKeys.length > 0) {
        setOpenBenefitsKeys(popularKeys);
      } else if (firstTreatment.packages[0]) {
        setOpenBenefitsKeys([makeSelectionKey(firstTreatment.id, firstTreatment.packages[0].id)]);
      } else {
        setOpenBenefitsKeys([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTreatments]);

  const handleTogglePackageSelection = (
    treatmentItem: TreatmentPricingItem,
    pkg: PricingPackage
  ) => {
    const compositeKey = makeSelectionKey(treatmentItem.id, pkg.id);
    setSelectedKeys((prev) => {
      // If already selected, toggle it off (if more than 1 treatment exists, allow deselecting freely; if single treatment with 1 option, also allow toggle)
      if (prev.includes(compositeKey)) {
        return prev.filter((k) => k !== compositeKey);
      }

      // Check if this treatment's packages are multi-session tiers (e.g. 1 session, 3 sessions, 5 sessions)
      // vs distinct menu items that all have 1 session.
      // Within a single treatment name section, selecting a package replaces any existing selection
      // under that same treatment name while keeping selections from all other treatment names intact.
      const prefix = `${treatmentItem.id}::`;
      const withoutSameTreatment = prev.filter((k) => !k.startsWith(prefix));
      return [...withoutSameTreatment, compositeKey];
    });
  };

  const toggleBenefits = (compositeKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenBenefitsKeys((prev) =>
      prev.includes(compositeKey)
        ? prev.filter((k) => k !== compositeKey)
        : [...prev, compositeKey]
    );
  };

  // Resolve all currently selected treatment + package entries in display order
  const selectedEntries = useMemo<SelectedTreatmentPackageEntry[]>(() => {
    const entries: SelectedTreatmentPackageEntry[] = [];
    for (const t of resolvedTreatments) {
      for (const p of t.packages) {
        if (selectedKeys.includes(makeSelectionKey(t.id, p.id))) {
          entries.push({ treatment: t, selectedPackage: p });
        }
      }
    }
    return entries;
  }, [resolvedTreatments, selectedKeys]);

  const totalSelectedPrice = useMemo(() => {
    return selectedEntries.reduce((sum, entry) => sum + (entry.selectedPackage.price || 0), 0);
  }, [selectedEntries]);

  const primaryActiveTreatment = selectedEntries[0]?.treatment || resolvedTreatments[0] || treatment;
  const primarySelectedPackage =
    selectedEntries[0]?.selectedPackage || primaryActiveTreatment.packages[0];

  const isMultiTreatment = resolvedTreatments.length > 1;

  return (
    <div
      className={`w-full bg-white rounded-none sm:rounded-2xl border-y sm:border border-grey/80 shadow-none sm:shadow-md px-4 py-5 sm:p-7 md:p-8 ${className}`}
    >
      {showHeader && (
        <div className="border-b border-grey pb-4 mb-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-lg sm:text-xl font-medium text-noir-900 tracking-tight">
              Select package
            </h4>
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-noir-600 bg-grey px-2.5 py-1 rounded-full">
              {primaryActiveTreatment?.category || treatment.category}
            </span>
          </div>

          {isMultiTreatment ? (
            <div className="mt-1">
              <p className="text-base lg:text-lg text-noir-900 font-semibold">
                {subcategoryTitle || treatment.title}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Select one or more treatments below to combine into your package
              </p>
            </div>
          ) : (
            <>
              <p className="text-base lg:text-lg text-noir-900 font-semibold mt-1">
                {primaryActiveTreatment.title}
              </p>
              {/* Unique Procedure & Downtime for the single treatment */}
              {(() => {
                const activeProcedureTime =
                  primarySelectedPackage?.procedureTime ||
                  primaryActiveTreatment.procedureTime ||
                  '20-30 Mins';
                const activeDowntime =
                  primarySelectedPackage?.downtime || primaryActiveTreatment.downtime || 'None';
                return (
                  <div className="flex items-center gap-2 text-xs text-stone-600 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-stone-100/90 text-stone-800 px-2 py-0.5 rounded-md font-medium">
                      <span className="text-stone-400">Procedure:</span> {activeProcedureTime}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="inline-flex items-center gap-1 bg-stone-100/90 text-stone-800 px-2 py-0.5 rounded-md font-medium">
                      <span className="text-stone-400">Downtime:</span> {activeDowntime}
                    </span>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* Treatments & Their Respective Package Option Items */}
      <div className={isMultiTreatment ? 'space-y-7 pb-5' : 'space-y-3.5 pb-5'}>
        {resolvedTreatments.map((treatmentItem, tIdx) => {
          const itemProcedureTime = treatmentItem.procedureTime || '20-30 Mins';
          const itemDowntime = treatmentItem.downtime || 'None';
          const currencySymbol = treatmentItem.currency || '£';
          const isTreatmentSelected = selectedKeys.some((k) =>
            k.startsWith(`${treatmentItem.id}::`)
          );

          return (
            <div
              key={treatmentItem.id}
              className={
                isMultiTreatment && tIdx > 0
                  ? 'pt-6 border-t border-grey/80'
                  : ''
              }
            >
              {/* Separated Treatment Header when multiple treatments belong to the subcategory */}
              {isMultiTreatment && (
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-base lg:text-lg text-noir-900 font-semibold leading-snug">
                      {treatmentItem.title}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-stone-600 mt-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-stone-100/90 text-stone-800 px-2 py-0.5 rounded-md font-medium">
                        <span className="text-stone-400">Procedure:</span> {itemProcedureTime}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="inline-flex items-center gap-1 bg-stone-100/90 text-stone-800 px-2 py-0.5 rounded-md font-medium">
                        <span className="text-stone-400">Downtime:</span> {itemDowntime}
                      </span>
                    </div>
                  </div>
                  {isTreatmentSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple bg-purple/10 px-2.5 py-0.5 rounded-full shrink-0">
                      <Check className="w-3 h-3" />
                      Selected
                    </span>
                  )}
                </div>
              )}

              {/* Session Items under this Treatment */}
              <div className="space-y-3.5">
                {treatmentItem.packages.map((pkg, idx) => {
                  const compositeKey = makeSelectionKey(treatmentItem.id, pkg.id);
                  const isSelected = selectedKeys.includes(compositeKey);
                  const isBenefitsOpen = openBenefitsKeys.includes(compositeKey);
                  const perSessionAmount =
                    pkg.perSessionPrice || Math.round(pkg.price / (pkg.sessions || 1));
                  const isBestValue =
                    idx === treatmentItem.packages.length - 1 &&
                    treatmentItem.packages.length > 1;
                  const isPopular = pkg.isPopular && !isBestValue;

                  return (
                    <div
                      key={compositeKey}
                      onClick={() => handleTogglePackageSelection(treatmentItem, pkg)}
                      className={`relative flex flex-col cursor-pointer justify-between rounded-xl border px-4 py-3.5 ring-[2px] transition-all duration-200 lg:px-5 lg:py-4 ${
                        isSelected
                          ? 'bg-purple/5 ring-purple border-transparent shadow-xs'
                          : 'border-noir-300 bg-white/70 ring-transparent hover:border-transparent hover:bg-white/70 hover:ring-purple'
                      }`}
                    >
                      {/* Top Row: Session Title, Badges, and Per-Session Price */}
                      <div className="flex items-start justify-between w-full gap-2">
                        <div className="space-y-1 sm:space-y-1">
                          <div className="flex items-center text-lg lg:text-xl font-semibold text-noir-900">
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
                          <p className="text-lg lg:text-xl font-semibold text-noir-900">
                            {currencySymbol}
                            {perSessionAmount}
                            <span className="text-sm md:text-base font-normal align-baseline">
                              .95
                            </span>
                          </p>
                          <p className="text-xs text-noir-700 antialiased -mt-0.5">
                            per session
                          </p>
                        </div>
                      </div>

                      {/* Package-specific details */}
                      {pkg.description && (
                        <div className="flex items-center gap-2 text-sm sm:text-[15px] text-stone-700 mt-1.5 flex-wrap">
                          <span
                            className={`text-stone-700 font-semibold not-italic ${
                              isBenefitsOpen ? 'break-words' : 'line-clamp-1'
                            }`}
                          >
                            {pkg.description}
                          </span>
                        </div>
                      )}

                      {/* Collapsible Benefits Trigger & Drawer */}
                      <div className="w-full mt-2.5 pt-2 border-t border-black/5">
                        <button
                          type="button"
                          onClick={(e) => toggleBenefits(compositeKey, e)}
                          className="flex items-center gap-1.5 text-xs font-Lato font-medium text-noir-700 hover:text-black transition-colors cursor-pointer py-0.5"
                        >
                          <span>
                            {isBenefitsOpen
                              ? 'Hide package benefits'
                              : 'View package benefits'}
                          </span>
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
                                    <span>
                                      Full clinician assessment and post-treatment aftercare
                                    </span>
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
          );
        })}
      </div>

      {/* Total Price and Action Button Bar */}
      <div className="border-t border-grey pt-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold text-noir-600">
            Total Investment
            {selectedEntries.length > 1 ? ` (${selectedEntries.length} selected)` : ''}
          </p>
          {isMultiTreatment && selectedEntries.length > 0 && (
            <p className="text-xs font-medium text-stone-600 break-words whitespace-normal mt-0.5">
              {selectedEntries.map((e) => e.treatment.title).join(' + ')}
            </p>
          )}
          <p className="text-2xl sm:text-3xl font-normal text-noir-900 mt-0.5 whitespace-nowrap">
            {primaryActiveTreatment?.currency || '£'}
            {selectedEntries.length > 0 ? totalSelectedPrice : 0}
            <span className="text-base sm:text-lg align-baseline">
              {selectedEntries.length > 0 ? '.95' : '.00'}
            </span>
          </p>
        </div>

        <button
          type="button"
          disabled={selectedEntries.length === 0}
          onClick={() => {
            if (selectedEntries.length === 0) return;
            if (onBookPackages) {
              onBookPackages(selectedEntries);
            } else {
              selectedEntries.forEach((entry) => {
                onBookPackage(entry.treatment, entry.selectedPackage);
              });
            }
          }}
          className="inline-flex items-center rounded-full justify-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 font-Lato disabled:text-noir-100 duration-200 font-semibold antialiased focus:outline-none bg-noir-900 text-white hover:bg-noir-800 px-8 py-3.5 sm:py-4 text-base cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] shrink-0"
        >
          <span>
            {selectedEntries.length > 1
              ? `Add ${selectedEntries.length} to Package →`
              : 'Add to Package →'}
          </span>
        </button>
      </div>
    </div>
  );
};


