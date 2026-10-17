import React, { useState, useMemo } from 'react';
import { 
  Search, Image as ImageIcon, Sparkles, Check, X, Edit3, 
  Filter, RefreshCw, Upload, ExternalLink, MoreVertical, Layers, Camera 
} from 'lucide-react';
import { 
  TREATMENT_PRICING_DATA, 
  TreatmentPricingItem, 
  PRICING_CATEGORIES,
  PricingCategory 
} from '../data/treatmentPricing';
import { getTreatmentPricingData, saveTreatmentPricingData } from '../lib/adminStore';

const PRESET_CLINIC_PHOTOS = [
  { label: 'Facial Aesthetics & Injectables', url: 'https://images.unsplash.com/photo-1512290900672-1f0230f81d18?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lip & Dermal Fillers', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Skin Boosters & Glow', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Body Sculpting & Contouring', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Clinical Facial Care', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80' },
  { label: 'IV Wellness Infusion', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laser & Tightening', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hair & Scalp Health', url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80' },
];

export default function TreatmentImageManager() {
  const [treatments, setTreatments] = useState<TreatmentPricingItem[]>(() => getTreatmentPricingData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Procedures');
  
  // Editing state
  const [editingTreatment, setEditingTreatment] = useState<TreatmentPricingItem | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Feedback toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Filter treatments
  const filteredTreatments = useMemo(() => {
    return treatments.filter((t) => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All Procedures' || t.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [treatments, searchQuery, selectedCategory]);

  const handleOpenEdit = (treatment: TreatmentPricingItem) => {
    setEditingTreatment(treatment);
    setCustomImageUrl(treatment.image || PRESET_CLINIC_PHOTOS[0].url);
    setActiveMenuId(null);
  };

  const handleSaveImage = async () => {
    if (!editingTreatment) return;
    const trimmed = customImageUrl.trim();
    if (!trimmed) {
      showToast('Please provide a valid image URL', 'error');
      return;
    }

    const updated = treatments.map((t) => 
      t.id === editingTreatment.id ? { ...t, image: trimmed } : t
    );

    setTreatments(updated);
    const res = await saveTreatmentPricingData(updated);
    if (res.success) {
      showToast(`Successfully updated cover image for "${editingTreatment.title}"`);
      setEditingTreatment(null);
    } else {
      showToast('Failed to save image changes', 'error');
    }
  };

  const handleResetImage = async (treatment: TreatmentPricingItem) => {
    const originalItem = TREATMENT_PRICING_DATA.find((item) => item.id === treatment.id);
    const defaultImg = originalItem?.image || PRESET_CLINIC_PHOTOS[0].url;

    const updated = treatments.map((t) => 
      t.id === treatment.id ? { ...t, image: defaultImg } : t
    );

    setTreatments(updated);
    await saveTreatmentPricingData(updated);
    showToast(`Reset image for "${treatment.title}" to default`);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      
      {/* Header banner */}
      <div className="bg-gradient-to-r from-silver-950 via-[#1b253b] to-silver-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#D8C2A3_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-gold/20 text-[#D8C2A3] text-xs font-semibold tracking-wider uppercase mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Media & Imagery Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Treatment Service Images Manager
            </h2>
            <p className="text-sm text-silver-300 mt-1 max-w-2xl font-light">
              Manage cover photos and visual assets for all clinical treatment service components. Changes reflect instantly across the live clinic portal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-white/10 px-3 py-1.5 rounded-xl text-silver-200">
              {filteredTreatments.length} of {treatments.length} Treatments
            </span>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold tracking-wide flex items-center gap-3 animate-slideUp ${
          toast.type === 'success' ? 'bg-[#003334] text-white border border-[#004d4f]' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-4 h-4 text-rose-gold" /> : <X className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-silver-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
            <input
              type="text"
              placeholder="Search treatments by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-silver-50/60 border border-silver-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/40 text-silver-950 placeholder-silver-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-400 hover:text-silver-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown / Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {PRICING_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#003334] text-white shadow-sm'
                    : 'bg-silver-100/70 text-silver-600 hover:bg-silver-200/70 hover:text-silver-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Treatments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTreatments.map((treatment) => (
          <div 
            key={treatment.id}
            className="bg-white border border-silver-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
          >
            {/* Image Thumbnail Header */}
            <div className="relative h-48 w-full bg-silver-100 overflow-hidden">
              <img 
                src={treatment.image || PRESET_CLINIC_PHOTOS[0].url} 
                alt={treatment.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_CLINIC_PHOTOS[0].url;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              
              {/* Top badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-extrabold text-white tracking-widest uppercase border border-white/20">
                  {treatment.category}
                </span>

                {/* Contextual menu trigger */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === treatment.id ? null : treatment.id)}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-silver-800 flex items-center justify-center shadow-md transition-all cursor-pointer"
                    aria-label="Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenuId === treatment.id && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-silver-200 py-2 z-30 animate-fadeIn">
                      <button
                        onClick={() => handleOpenEdit(treatment)}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-silver-800 hover:bg-silver-50 flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-rose-gold" />
                        <span>Change Cover Photo</span>
                      </button>
                      <button
                        onClick={() => handleResetImage(treatment)}
                        className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Default</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title overlay on image bottom */}
              <div className="absolute bottom-3 left-4 right-4">
                <h4 className="text-white font-serif font-bold text-base leading-snug drop-shadow-sm line-clamp-1">
                  {treatment.title}
                </h4>
                <p className="text-[11px] text-silver-200 font-light">
                  From £{treatment.startingPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-silver-600 line-clamp-2 leading-relaxed">
                {treatment.description}
              </p>

              <div className="pt-3 border-t border-silver-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-silver-400">
                  ID: {treatment.id}
                </span>
                
                <button
                  onClick={() => handleOpenEdit(treatment)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-silver-50 hover:bg-[#003334] text-silver-800 hover:text-white border border-silver-200 text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer group/btn shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5 text-rose-gold group-hover/btn:text-white transition-colors" />
                  <span>Edit Image</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTreatments.length === 0 && (
        <div className="bg-white border border-silver-200 rounded-3xl p-12 text-center space-y-3">
          <ImageIcon className="w-10 h-10 text-silver-300 mx-auto" />
          <h4 className="text-base font-serif font-bold text-silver-800">No treatments found</h4>
          <p className="text-xs text-silver-500">Try adjusting your search query or category filter.</p>
        </div>
      )}

      {/* EDIT IMAGE MODAL / MOBILE FLOATING BOTTOM SHEET */}
      {editingTreatment && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-silver-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
            
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-silver-950 to-[#1b253b] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D8C2A3] block">
                  Image Editor
                </span>
                <h3 className="text-lg font-serif font-bold">
                  {editingTreatment.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingTreatment(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Live Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-silver-700 uppercase tracking-wider block">
                  Current Cover Image Preview
                </label>
                <div className="relative h-56 rounded-2xl overflow-hidden bg-silver-100 border border-silver-200 shadow-inner">
                  <img
                    src={customImageUrl || editingTreatment.image}
                    alt={editingTreatment.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_CLINIC_PHOTOS[0].url;
                    }}
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white">
                    Live Preview
                  </div>
                </div>
              </div>

              {/* Custom URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-silver-700 uppercase tracking-wider block">
                  Image URL Source
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-4 py-2.5 text-xs bg-silver-50 border border-silver-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold/40 text-silver-950"
                  />
                </div>
                <p className="text-[11px] text-silver-500 font-light">
                  Paste any high-resolution Unsplash or clinic image link.
                </p>
              </div>

              {/* Preset Clinic Photo Library */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-silver-700 uppercase tracking-wider block">
                  Or Choose from Preset Clinic Library
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1 scrollbar-thin">
                  {PRESET_CLINIC_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomImageUrl(preset.url)}
                      className={`relative group rounded-xl overflow-hidden border-2 text-left transition-all cursor-pointer h-20 ${
                        customImageUrl === preset.url ? 'border-[#003334] ring-2 ring-rose-gold/50' : 'border-silver-200 hover:border-silver-400'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                        <span className="text-[9px] font-bold text-white leading-tight line-clamp-2">
                          {preset.label}
                        </span>
                      </div>
                      {customImageUrl === preset.url && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#003334] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-rose-gold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-silver-50 border-t border-silver-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setEditingTreatment(null)}
                className="px-5 py-2.5 rounded-xl border border-silver-300 text-silver-700 hover:bg-silver-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                className="px-6 py-2.5 rounded-xl bg-[#003334] hover:bg-[#002627] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-gold" />
                <span>Save Cover Image</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
