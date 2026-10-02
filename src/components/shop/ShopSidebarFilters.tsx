import React, { useState } from 'react';
import { ChevronDown, RotateCcw, Check } from 'lucide-react';
import { FilterState } from '../../types/shop';
import { FILTER_OPTIONS, SHOP_PRODUCTS } from '../../data/shopProducts';

interface ShopSidebarFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export const ShopSidebarFilters: React.FC<ShopSidebarFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  // Open states for accordion sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    range: true,
    type: true,
    skinType: true,
    skinConcerns: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  const hasActiveFilters =
    filters.range.length > 0 ||
    filters.type.length > 0 ||
    filters.skinType.length > 0 ||
    filters.skinConcerns.length > 0 ||
    filters.searchQuery !== '';

  return (
    <div className="space-y-6 text-left lg:sticky lg:top-24 w-full pr-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#D8C2A3]/40">
        <h3 className="font-serif text-xl xl:text-2xl text-stone-950 font-bold tracking-tight">
          Browse by
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-gold-dark hover:text-black flex items-center gap-1.5 font-bold uppercase tracking-wider transition-colors cursor-pointer bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-[#D8C2A3]/30">
        {/* 1. Product Range Accordion */}
        <div className="py-2.5">
          <button
            type="button"
            onClick={() => toggleSection('range')}
            className="flex flex-1 w-full items-center justify-between text-left font-sans text-base xl:text-[17px] font-bold text-stone-900 transition-all hover:text-black cursor-pointer py-2.5"
          >
            <span>Product Range</span>
            <ChevronDown
              className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${
                openSections.range ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.range && (
            <div className="pb-3 pt-1.5 space-y-1.5">
              {FILTER_OPTIONS.ranges.map((range) => {
                const isAll = range === 'All Products';
                const isSelected = isAll
                  ? filters.range.length === 0
                  : filters.range.includes(range);
                const count = isAll
                  ? SHOP_PRODUCTS.length
                  : SHOP_PRODUCTS.filter(p => p.range === range).length;

                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => handleRangeToggle(range)}
                    className={`flex items-center justify-between w-full text-sm xl:text-[15px] py-2 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold shadow-xs'
                        : 'text-stone-700 hover:text-black hover:bg-[#faf4ec] font-normal'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white text-black' : 'border-[#c8b499] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{range}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'text-[#7a6242] bg-[#f5ede2]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Product Type Accordion */}
        <div className="py-2.5">
          <button
            type="button"
            onClick={() => toggleSection('type')}
            className="flex flex-1 w-full items-center justify-between text-left font-sans text-base xl:text-[17px] font-bold text-stone-900 transition-all hover:text-black cursor-pointer py-2.5"
          >
            <span>Product Type</span>
            <ChevronDown
              className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${
                openSections.type ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.type && (
            <div className="pb-3 pt-1.5 space-y-1.5">
              {FILTER_OPTIONS.types.map((type) => {
                const isSelected = filters.type.includes(type);
                const count = SHOP_PRODUCTS.filter(p => p.type === type).length;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`flex items-center justify-between w-full text-sm xl:text-[15px] py-2 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold shadow-xs'
                        : 'text-stone-700 hover:text-black hover:bg-[#faf4ec] font-normal'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white text-black' : 'border-[#c8b499] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{type}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'text-[#7a6242] bg-[#f5ede2]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Skin Type Accordion */}
        <div className="py-2.5">
          <button
            type="button"
            onClick={() => toggleSection('skinType')}
            className="flex flex-1 w-full items-center justify-between text-left font-sans text-base xl:text-[17px] font-bold text-stone-900 transition-all hover:text-black cursor-pointer py-2.5"
          >
            <span>Skin Type</span>
            <ChevronDown
              className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${
                openSections.skinType ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.skinType && (
            <div className="pb-3 pt-1.5 space-y-1.5">
              {FILTER_OPTIONS.skinTypes.map((skinType) => {
                const isSelected = filters.skinType.includes(skinType);
                const count = SHOP_PRODUCTS.filter(p => p.skinType.includes(skinType)).length;

                return (
                  <button
                    key={skinType}
                    type="button"
                    onClick={() => handleSkinTypeToggle(skinType)}
                    className={`flex items-center justify-between w-full text-sm xl:text-[15px] py-2 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold shadow-xs'
                        : 'text-stone-700 hover:text-black hover:bg-[#faf4ec] font-normal'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white text-black' : 'border-[#c8b499] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{skinType}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'text-[#7a6242] bg-[#f5ede2]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Skin Concerns Accordion */}
        <div className="py-2.5">
          <button
            type="button"
            onClick={() => toggleSection('skinConcerns')}
            className="flex flex-1 w-full items-center justify-between text-left font-sans text-base xl:text-[17px] font-bold text-stone-900 transition-all hover:text-black cursor-pointer py-2.5"
          >
            <span>Skin Concerns</span>
            <ChevronDown
              className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${
                openSections.skinConcerns ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openSections.skinConcerns && (
            <div className="pb-3 pt-1.5 space-y-1.5">
              {FILTER_OPTIONS.skinConcerns.map((concern) => {
                const isSelected = filters.skinConcerns.includes(concern);
                const count = SHOP_PRODUCTS.filter(p => p.skinConcerns.includes(concern)).length;

                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleConcernToggle(concern)}
                    className={`flex items-center justify-between w-full text-sm xl:text-[15px] py-2 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white font-semibold shadow-xs'
                        : 'text-stone-700 hover:text-black hover:bg-[#faf4ec] font-normal'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white border-white text-black' : 'border-[#c8b499] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span>{concern}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected ? 'bg-white/20 text-white' : 'text-[#7a6242] bg-[#f5ede2]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Direct All Products Action */}
        <div className="py-3">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, range: [], type: [], skinType: [], skinConcerns: [] })}
            className="w-full text-left font-sans text-sm xl:text-[15px] font-bold text-stone-900 hover:text-black flex items-center justify-between py-2 px-1 cursor-pointer transition-colors"
          >
            <span>View All ({SHOP_PRODUCTS.length} Formulas)</span>
            <span className="text-xs bg-stone-900 text-white px-2.5 py-1 rounded-full font-bold">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
