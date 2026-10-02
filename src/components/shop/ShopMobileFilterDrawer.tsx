import React from 'react';
import { FilterState } from '../../types/shop';
import { X, Check } from 'lucide-react';
import { FILTER_OPTIONS, SHOP_PRODUCTS } from '../../data/shopProducts';
import { motion, AnimatePresence } from 'motion/react';

interface ShopMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const ShopMobileFilterDrawer: React.FC<ShopMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
}) => {
  if (!isOpen) return null;

  const handleRangeToggle = (range: string) => {
    if (range === 'All Products') {
      onFilterChange({ ...filters, range: [] });
      return;
    }
    const exists = filters.range.includes(range);
    const newRanges = exists
      ? filters.range.filter(r => r !== range)
      : [...filters.range, range];
    onFilterChange({ ...filters, range: newRanges });
  };

  const handleTypeToggle = (type: string) => {
    const exists = filters.type.includes(type);
    const newTypes = exists
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    onFilterChange({ ...filters, type: newTypes });
  };

  const handleSkinTypeToggle = (skinType: string) => {
    const exists = filters.skinType.includes(skinType);
    const newSkinTypes = exists
      ? filters.skinType.filter(s => s !== skinType)
      : [...filters.skinType, skinType];
    onFilterChange({ ...filters, skinType: newSkinTypes });
  };

  const handleConcernToggle = (concern: string) => {
    const exists = filters.skinConcerns.includes(concern);
    const newConcerns = exists
      ? filters.skinConcerns.filter(c => c !== concern)
      : [...filters.skinConcerns, concern];
    onFilterChange({ ...filters, skinConcerns: newConcerns });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between relative"
          >
            {/* Header */}
            <div className="p-4 border-b border-silver-200 flex items-center justify-between bg-silver-50">
              <h3 className="font-serif text-lg font-bold text-silver-900">
                Filter Products
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-silver-200 text-silver-600 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Product Range */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-900 mb-2.5">
                  Product Range
                </h4>
                <div className="space-y-1.5">
                  {FILTER_OPTIONS.ranges.map((range) => {
                    const isAll = range === 'All Products';
                    const isSelected = isAll
                      ? filters.range.length === 0
                      : filters.range.includes(range);
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => handleRangeToggle(range)}
                        className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'bg-silver-200 text-black font-bold' : 'text-silver-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-black border-black text-white' : 'border-silver-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{range}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Type */}
              <div className="border-t border-silver-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-900 mb-2.5">
                  Product Type
                </h4>
                <div className="space-y-1.5">
                  {FILTER_OPTIONS.types.map((type) => {
                    const isSelected = filters.type.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleTypeToggle(type)}
                        className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'bg-silver-200 text-black font-bold' : 'text-silver-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-black border-black text-white' : 'border-silver-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{type}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skin Type */}
              <div className="border-t border-silver-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-900 mb-2.5">
                  Skin Type
                </h4>
                <div className="space-y-1.5">
                  {FILTER_OPTIONS.skinTypes.map((st) => {
                    const isSelected = filters.skinType.includes(st);
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleSkinTypeToggle(st)}
                        className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'bg-silver-200 text-black font-bold' : 'text-silver-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-black border-black text-white' : 'border-silver-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{st}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skin Concerns */}
              <div className="border-t border-silver-200 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-900 mb-2.5">
                  Skin Concerns
                </h4>
                <div className="space-y-1.5">
                  {FILTER_OPTIONS.skinConcerns.map((concern) => {
                    const isSelected = filters.skinConcerns.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        onClick={() => handleConcernToggle(concern)}
                        className={`flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                          isSelected ? 'bg-silver-200 text-black font-bold' : 'text-silver-600'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-black border-black text-white' : 'border-silver-300'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span>{concern}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-silver-200 bg-silver-50 flex gap-3">
              <button
                type="button"
                onClick={onResetFilters}
                className="flex-1 py-2.5 text-xs font-semibold text-silver-700 bg-white border border-silver-300 rounded-full hover:bg-silver-100 transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-2 py-2.5 text-xs font-bold text-white bg-black rounded-full hover:bg-silver-800 transition-colors shadow-sm cursor-pointer"
              >
                Show {totalFilteredCount} Results
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
