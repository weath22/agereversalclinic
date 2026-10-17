import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Check, 
  Search, 
  ExternalLink, 
  Sparkles, 
  X, 
  Link2, 
  HardDrive, 
  Globe, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { listProjectAssets, uploadAssetFile, registerMediaAsset } from '../lib/adminStore';
import { MediaAssetRecord } from '../types';

interface AssetItem {
  name: string;
  url: string;
  size: number;
  mtime: string;
  location: string;
  mediaType?: 'image' | 'video';
  category?: string;
  altText?: string;
  seoKeywords?: string[];
}

export interface AssetLibraryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: {
    url: string;
    mediaType: 'image' | 'video';
    altText?: string;
    seoTitle?: string;
    seoKeywords?: string[];
    name?: string;
  }) => void;
  currentUrl?: string;
  title?: string;
  allowedTypes?: 'all' | 'image-only' | 'video-only';
  treatmentContextName?: string;
}

export default function AssetLibraryPicker({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
  title = 'Clinic Asset & Media Library',
  allowedTypes = 'all',
  treatmentContextName
}: AssetLibraryPickerProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'url'>('browse');
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Direct URL paste form state
  const [pasteUrl, setPasteUrl] = useState('');
  const [pasteName, setPasteName] = useState('');
  const [pasteMediaType, setPasteMediaType] = useState<'image' | 'video'>('image');
  const [pasteAltText, setPasteAltText] = useState('');
  const [pasteSeoKeywords, setPasteSeoKeywords] = useState('');

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const list = await listProjectAssets();
      setAssets(list);
    } catch (err) {
      console.error('Failed to load assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
      if (treatmentContextName) {
        setPasteName(`${treatmentContextName} Visual`);
        setPasteAltText(`${treatmentContextName} clinical procedure - Age Reversal Clinic London`);
        setPasteSeoKeywords('cellular skin regeneration, anti-aging clinic london, collagen bio-remodeling');
      }
    }
  }, [isOpen, treatmentContextName]);

  // Listen to central asset updates from other tabs/modals
  useEffect(() => {
    const handleUpdate = () => fetchAssets();
    window.addEventListener('central_assets_updated', handleUpdate);
    return () => window.removeEventListener('central_assets_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    // Type restriction
    if (allowedTypes === 'image-only' && asset.mediaType === 'video') return false;
    if (allowedTypes === 'video-only' && asset.mediaType !== 'video') return false;

    // Category filter
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Videos' && asset.mediaType !== 'video') return false;
      if (selectedCategory !== 'Videos' && asset.category !== selectedCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(q);
      const matchUrl = asset.url.toLowerCase().includes(q);
      const matchAlt = (asset.altText || '').toLowerCase().includes(q);
      const matchKeywords = (asset.seoKeywords || []).some(k => k.toLowerCase().includes(q));
      return matchName || matchUrl || matchAlt || matchKeywords;
    }

    return true;
  });

  const categories = ['All', 'Treatments', 'Videos', 'Before & After', 'Uploads'];

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const file = files[0];
    const isVideo = file.type.startsWith('video/') || !!file.name.match(/\.(mp4|webm|mov)(\?|$)/i);

    try {
      const result = await uploadAssetFile(file);
      if (result.success && result.url) {
        // Auto register in central library
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const autoAlt = `${cleanName} - Age Reversal Clinic London`;
        const autoKeywords = [
          'anti-aging clinic london',
          'cellular skin regeneration',
          treatmentContextName ? treatmentContextName.toLowerCase() : 'aesthetic clinic'
        ];

        registerMediaAsset({
          name: cleanName,
          url: result.url,
          mediaType: isVideo ? 'video' : 'image',
          size: file.size,
          category: isVideo ? 'Videos' : 'Uploads',
          altText: autoAlt,
          seoKeywords: autoKeywords
        });

        setUploadSuccess(`Uploaded "${file.name}" successfully to disk and registered in Asset Library!`);
        await fetchAssets();

        // 1-click select the newly uploaded asset
        onSelect({
          url: result.url,
          mediaType: isVideo ? 'video' : 'image',
          altText: autoAlt,
          seoTitle: cleanName,
          seoKeywords: autoKeywords,
          name: cleanName
        });
        onClose();
      } else {
        setUploadError(result.error || 'Failed to upload asset file');
      }
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle URL Paste & Register
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteUrl.trim()) return;

    const trimmedUrl = pasteUrl.trim();
    const isVideo = pasteMediaType === 'video' || !!trimmedUrl.match(/\.(mp4|webm|mov)(\?|$)/i);
    const resolvedName = pasteName.trim() || trimmedUrl.split('/').pop()?.split('?')[0] || 'Web Media Asset';
    const resolvedAlt = pasteAltText.trim() || `${resolvedName} - Age Reversal Clinic London`;
    const keywordsArray = pasteSeoKeywords.split(',').map(s => s.trim()).filter(Boolean);

    // Register into central assets library (Task 2.1)
    registerMediaAsset({
      name: resolvedName,
      url: trimmedUrl,
      mediaType: isVideo ? 'video' : 'image',
      category: isVideo ? 'Videos' : 'Treatments',
      altText: resolvedAlt,
      seoKeywords: keywordsArray.length > 0 ? keywordsArray : ['cellular skin regeneration', 'anti-aging clinic london']
    });

    // Pass back to editor (Task 2.2)
    onSelect({
      url: trimmedUrl,
      mediaType: isVideo ? 'video' : 'image',
      altText: resolvedAlt,
      seoTitle: resolvedName,
      seoKeywords: keywordsArray,
      name: resolvedName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#003334] text-[#c5a880] rounded-xl shadow-xs hidden md:block">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#003334]">{title}</h3>
              <p className="text-xs text-slate-500">
                Browse existing clinic assets, upload directly to server, or paste &amp; register external URLs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 pt-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'border-[#003334] text-[#003334]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Browse Library ({assets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-[#003334] text-[#003334]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload New File</span>
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'url'
                ? 'border-[#003334] text-[#003334]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Link2 className="h-4 w-4" />
            <span>Paste &amp; Register URL</span>
          </button>
        </div>

        {/* Tab 1: Browse Clinic Assets */}
        {activeTab === 'browse' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Search & Categories Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets by filename, clinical tag, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#003334] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Grid */}
            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <div className="animate-spin h-7 w-7 border-2 border-[#c5a880] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs font-medium">Scanning clinic media assets...</p>
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No matching assets found</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, or upload a new file from your device.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="mt-4 px-4 py-2 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload An Asset
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredAssets.map((asset, idx) => {
                  const isCurrent = currentUrl === asset.url;
                  const isVideo = asset.mediaType === 'video';

                  return (
                    <div
                      key={`${asset.url}-${idx}`}
                      onClick={() => {
                        onSelect({
                          url: asset.url,
                          mediaType: isVideo ? 'video' : 'image',
                          altText: asset.altText || `${asset.name} - Age Reversal Clinic London`,
                          seoTitle: asset.name,
                          seoKeywords: asset.seoKeywords,
                          name: asset.name
                        });
                        onClose();
                      }}
                      className={`group relative border rounded-2xl overflow-hidden bg-slate-50 transition-all cursor-pointer flex flex-col hover:shadow-md hover:border-[#c5a880] ${
                        isCurrent ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200'
                      }`}
                    >
                      {/* Media Thumbnail */}
                      <div className="aspect-4/3 w-full bg-slate-200 relative overflow-hidden">
                        {isVideo ? (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                            <video
                              src={asset.url}
                              className="w-full h-full object-cover opacity-80"
                              muted
                              playsInline
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                              <div className="p-2.5 rounded-full bg-white/90 text-[#003334] shadow-md group-hover:scale-110 transition-transform">
                                <Video className="h-5 w-5 fill-current" />
                              </div>
                            </div>
                            <span className="absolute bottom-2 left-2 text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                              Video
                            </span>
                          </div>
                        ) : (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                        )}

                        {isCurrent && (
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-sm">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Card Info */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800 truncate" title={asset.name}>
                            {asset.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5" title={asset.location}>
                            {asset.location}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {asset.category || 'Asset'}
                          </span>
                          <span className="text-[11px] font-bold text-[#003334] group-hover:text-[#c5a880] transition-colors flex items-center gap-1">
                            <span>Select</span>
                            <Check className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Upload New File */}
        {activeTab === 'upload' && (
          <div className="p-8 max-w-xl mx-auto w-full space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#003334] rounded-3xl p-10 text-center bg-slate-50 hover:bg-slate-100/60 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-white rounded-2xl w-fit mx-auto shadow-sm group-hover:scale-105 transition-transform border border-slate-200">
                <Upload className="h-8 w-8 text-[#003334]" />
              </div>
              <h4 className="font-serif font-bold text-base text-[#003334] mt-4">
                Click to choose image or video file
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Uploads are saved directly to <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px]">src/assets/images</code> and <code className="bg-slate-200/80 px-1 py-0.5 rounded text-[11px]">public/assets</code>.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold shadow-xs">
                {uploading ? 'Processing & Saving...' : 'Browse Computer'}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/webm"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadError && (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-3">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paste & Register External URL */}
        {activeTab === 'url' && (
          <form onSubmit={handlePasteSubmit} className="p-8 max-w-xl mx-auto w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Media File or Streaming URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or https://.../video.mp4"
                  value={pasteUrl}
                  onChange={(e) => {
                    setPasteUrl(e.target.value);
                    if (e.target.value.match(/\.(mp4|webm|mov)(\?|$)/i)) {
                      setPasteMediaType('video');
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Media Type
                </label>
                <select
                  value={pasteMediaType}
                  onChange={(e) => setPasteMediaType(e.target.value as 'image' | 'video')}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                >
                  <option value="image">Image Asset</option>
                  <option value="video">Hero Video (MP4 / WebM)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Asset Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exosome Cellular Protocol"
                  value={pasteName}
                  onChange={(e) => setPasteName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                SEO Image Label &amp; Alt Text
              </label>
              <input
                type="text"
                placeholder="Descriptive label for Google Image Search"
                value={pasteAltText}
                onChange={(e) => setPasteAltText(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Clinical SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                placeholder="cellular skin regeneration, anti-aging clinic london"
                value={pasteSeoKeywords}
                onChange={(e) => setPasteSeoKeywords(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
              />
            </div>

            {/* Live Preview if URL is valid */}
            {pasteUrl && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="h-14 w-20 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                  {pasteMediaType === 'video' ? (
                    <video src={pasteUrl} className="w-full h-full object-cover" muted />
                  ) : (
                    <img src={pasteUrl} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{pasteName || 'Preview Asset'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{pasteUrl}</p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Register &amp; Use Asset</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            <span>Connected to Central Clinic Asset Storage</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
