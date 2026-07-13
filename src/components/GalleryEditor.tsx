"use client";

import React, { useState, useEffect } from 'react';
import { 
  getBeforeAfterGalleryConfig, 
  saveBeforeAfterGalleryConfig,
  resetAdminStoreToDefaults
} from '../lib/adminStore';
import { BeforeAfterGalleryConfig } from '../types';
import { 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  Image, 
  Sparkles,
  FileText,
  Layers,
  FileEdit
} from 'lucide-react';

export default function GalleryEditor() {
  const [config, setConfig] = useState<BeforeAfterGalleryConfig | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setConfig(getBeforeAfterGalleryConfig());
  }, []);

  const handleSave = () => {
    if (!config) return;
    saveBeforeAfterGalleryConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to restore default Before & After Gallery settings? This will clear your custom changes for this section.")) {
      resetAdminStoreToDefaults();
      setConfig(getBeforeAfterGalleryConfig());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  if (!config) return null;

  // Add a new empty category
  const addCategory = () => {
    const newId = 'cat-' + Date.now();
    setConfig({
      ...config,
      categories: [
        ...config.categories,
        {
          id: newId,
          name: 'New Custom Category',
          pairs: []
        }
      ]
    });
  };

  // Delete a category
  const deleteCategory = (catId: string) => {
    setConfig({
      ...config,
      categories: config.categories.filter(c => c.id !== catId)
    });
  };

  // Edit category name
  const editCategoryName = (catId: string, newName: string) => {
    setConfig({
      ...config,
      categories: config.categories.map(c => 
        c.id === catId ? { ...c, name: newName } : c
      )
    });
  };

  // Add pair to category
  const addPairToCategory = (catId: string) => {
    setConfig({
      ...config,
      categories: config.categories.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            pairs: [
              ...c.pairs,
              {
                id: 'pair-' + Date.now(),
                title: 'New Clinical Trial Case',
                beforeImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400',
                afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
              }
            ]
          };
        }
        return c;
      })
    });
  };

  // Delete pair from category
  const deletePairFromCategory = (catId: string, pairId: string) => {
    setConfig({
      ...config,
      categories: config.categories.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            pairs: c.pairs.filter(p => p.id !== pairId)
          };
        }
        return c;
      })
    });
  };

  // Edit pair details
  const editPairDetails = (catId: string, pairId: string, field: 'title' | 'beforeImage' | 'afterImage', value: string) => {
    setConfig({
      ...config,
      categories: config.categories.map(c => {
        if (c.id === catId) {
          return {
            ...c,
            pairs: c.pairs.map(p => 
              p.id === pairId ? { ...p, [field]: value } : p
            )
          };
        }
        return c;
      })
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#003334] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-gold" />
              <span>Before & After Gallery Editor</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize the section headings, categories, and patient before & after Polaroid photo comparisons.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restore Section Defaults</span>
            </button>
          </div>
        </div>

        {/* Section Headings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Gallery Heading
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium"
              value={config.heading}
              onChange={(e) => setConfig({ ...config, heading: e.target.value })}
              placeholder="E.g., Real Results, Real Confidence"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Gallery Description / Subtitle
            </label>
            <textarea
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003334] focus:border-transparent text-sm text-slate-800 font-medium resize-none"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="E.g., See the dramatic, natural transformations achieved by our expert clinicians."
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-6 pt-4 border-t border-slate-150">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-base text-[#003334] flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-rose-gold" />
              <span>Gallery Categories ({config.categories.length})</span>
            </h4>
            <button
              onClick={addCategory}
              className="inline-flex items-center gap-1.5 bg-[#003334] text-white hover:bg-[#236963] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-10">
            {config.categories.map((cat, catIndex) => (
              <div 
                key={cat.id} 
                className="bg-slate-50/50 p-5 md:p-6 rounded-2xl border border-slate-200 space-y-6 relative group"
              >
                {/* Category Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2 flex-grow">
                    <span className="text-xs font-bold text-slate-400 font-mono">#{catIndex + 1}</span>
                    <input
                      type="text"
                      className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-serif font-bold text-sm text-[#003334] max-w-sm"
                      value={cat.name}
                      onChange={(e) => editCategoryName(cat.id, e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addPairToCategory(cat.id)}
                      className="inline-flex items-center gap-1 bg-[#236963]/10 text-[#236963] hover:bg-[#236963]/20 px-2.5 py-1.5 rounded-lg text-xs font-bold"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Comparison Pair</span>
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Grid of Polaroid Pairs in this category */}
                {cat.pairs.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400 font-sans border border-dashed border-slate-200 rounded-xl bg-white">
                    No before & after comparison cases in this category yet. Click "Add Comparison Pair" to create one.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {cat.pairs.map((pair, pIndex) => (
                      <div 
                        key={pair.id} 
                        className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-4 relative flex flex-col justify-between"
                      >
                        {/* Header for individual comparison pair */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                            Case Pair #{pIndex + 1}
                          </span>
                          <button
                            onClick={() => deletePairFromCategory(cat.id, pair.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            title="Delete Case"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Title of the Case */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case Title</label>
                          <input
                            type="text"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-bold"
                            value={pair.title}
                            onChange={(e) => editPairDetails(cat.id, pair.id, 'title', e.target.value)}
                            placeholder="E.g., Acne Scar Treatment - 3 Weeks"
                          />
                        </div>

                        {/* Image Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Before Image URL</label>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono"
                              value={pair.beforeImage}
                              onChange={(e) => editPairDetails(cat.id, pair.id, 'beforeImage', e.target.value)}
                            />
                            <div className="aspect-[4/5] bg-slate-50 border border-slate-100 rounded overflow-hidden mt-1 max-h-[120px]">
                              <img src={pair.beforeImage} alt="Before preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">After Image URL</label>
                            <input
                              type="text"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 font-mono"
                              value={pair.afterImage}
                              onChange={(e) => editPairDetails(cat.id, pair.id, 'afterImage', e.target.value)}
                            />
                            <div className="aspect-[4/5] bg-slate-50 border border-slate-100 rounded overflow-hidden mt-1 max-h-[120px]">
                              <img src={pair.afterImage} alt="After preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-6 border-t border-slate-150 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                <span>Gallery configuration saved successfully!</span>
              </span>
            )}
          </div>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-[#003334] hover:bg-[#236963] text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>Save Gallery Details</span>
          </button>
        </div>

      </div>
    </div>
  );
}
