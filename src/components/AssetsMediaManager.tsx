import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Video,
  Check, 
  Copy, 
  RefreshCw, 
  Folder, 
  ExternalLink, 
  FileCheck, 
  AlertCircle,
  HardDrive,
  Plus,
  Search,
  Globe,
  X
} from 'lucide-react';
import { uploadAssetFile, listProjectAssets, registerMediaAsset } from '../lib/adminStore';

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

export default function AssetsMediaManager() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);

  // New URL registration form state
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Treatments' | 'Before & After' | 'Interiors & Facilities' | 'Videos' | 'Uploads'>('Treatments');
  const [newAltText, setNewAltText] = useState('');
  const [newSeoKeywords, setNewSeoKeywords] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const list = await listProjectAssets();
      setAssets(list);
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to load assets from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Listen to central asset updates from other components
  useEffect(() => {
    const handleUpdate = () => fetchAssets();
    window.addEventListener('central_assets_updated', handleUpdate);
    return () => window.removeEventListener('central_assets_updated', handleUpdate);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatusMessage(null);

    let successCount = 0;
    let lastUrl = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await uploadAssetFile(file);
      if (result.success && result.url) {
        successCount++;
        lastUrl = result.url;
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (successCount > 0) {
      setStatusMessage({
        type: 'success',
        text: `Successfully uploaded ${successCount} asset${successCount > 1 ? 's' : ''} directly into src/assets/images and public/assets!`
      });
      fetchAssets();
      if (lastUrl) {
        navigator.clipboard.writeText(lastUrl);
        setCopiedUrl(lastUrl);
        setTimeout(() => setCopiedUrl(null), 3000);
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Failed to upload asset. Please verify server connection.'
      });
    }
  };

  const handleRegisterUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const trimmedUrl = newUrl.trim();
    const isVideo = !!trimmedUrl.match(/\.(mp4|webm|mov)(\?|$)/i) || newCategory === 'Videos';
    const cleanName = newName.trim() || trimmedUrl.split('/').pop()?.split('?')[0] || 'Web Media Asset';
    const keywords = newSeoKeywords.split(',').map(s => s.trim()).filter(Boolean);

    registerMediaAsset({
      name: cleanName,
      url: trimmedUrl,
      mediaType: isVideo ? 'video' : 'image',
      category: newCategory,
      altText: newAltText.trim() || `${cleanName} - Age Reversal Clinic London`,
      seoKeywords: keywords.length > 0 ? keywords : ['anti-aging clinic london', 'cellular skin regeneration']
    });

    setStatusMessage({
      type: 'success',
      text: `Successfully registered "${cleanName}" in the Central Media Library!`
    });

    setNewUrl('');
    setNewName('');
    setNewAltText('');
    setNewSeoKeywords('');
    setShowAddUrlModal(false);
    fetchAssets();
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Cloud CDN';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const categories = ['All', 'Treatments', 'Videos', 'Before & After', 'Uploads'];

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Videos' && asset.mediaType !== 'video') return false;
      if (selectedCategory !== 'Videos' && asset.category !== selectedCategory) return false;
    }
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-[#003334] text-[#c5a880] rounded-2xl shadow-sm">
              <Folder className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#003334]">Assets &amp; Media Manager</h2>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Synced Storage
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Centralized asset repository managing physical files (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-700">src/assets/images/</code>) and registered cloud media with SEO labels.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={fetchAssets}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddUrlModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#003334] bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4 text-[#c5a880]" />
              Add Web URL
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#003334] bg-[#c5a880] hover:bg-[#d5b890] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Upload className={`h-4 w-4 ${uploading ? 'animate-bounce' : ''}`} />
              {uploading ? 'Uploading...' : 'Upload Asset'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/mp4,video/webm"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`mt-4 p-4 rounded-2xl text-xs flex items-center justify-between gap-3 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              {statusMessage.type === 'success' ? (
                <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="p-1 hover:bg-black/5 rounded">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Storage explanation callout */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003334] mb-1">
              <HardDrive className="h-4 w-4 text-[#c5a880]" />
              Physical Disk Storage
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Uploaded images are saved directly into <span className="font-semibold text-slate-700">src/assets/images</span> for permanent Git versioning and builds.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003334] mb-1">
              <Globe className="h-4 w-4 text-[#c5a880]" />
              Central Media Library
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every image/video registered here is immediately available in the 1-click **Asset Library Picker** across all treatment pages.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003334] mb-1">
              <Copy className="h-4 w-4 text-[#c5a880]" />
              SEO-Ready Metadata
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assets include structured Google Image alt labels and clinical keywords for search optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Asset Grid & Filter Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Top Controls: Search and Categories */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-[#003334]" />
            <h3 className="font-serif font-bold text-lg text-[#003334]">
              Available Assets ({filteredAssets.length})
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search assets by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
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
        </div>

        {copiedUrl && (
          <div className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 animate-fade-in w-fit">
            <Check className="h-3.5 w-3.5" />
            Copied URL: {copiedUrl}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-[#c5a880]" />
            <p className="text-xs font-semibold">Scanning central asset directories...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 mb-1">No assets found</p>
            <p className="text-xs text-slate-500 mb-4">Upload an asset or register a web image URL to add it to the central library.</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors cursor-pointer"
              >
                Upload File
              </button>
              <button
                onClick={() => setShowAddUrlModal(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Register Web URL
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => {
              const isVideo = asset.mediaType === 'video';

              return (
                <div 
                  key={asset.name + asset.url}
                  className="group border border-slate-200 rounded-2xl overflow-hidden hover:border-[#c5a880] hover:shadow-md transition-all flex flex-col bg-slate-50/50"
                >
                  <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                    {isVideo ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                        <video src={asset.url} className="w-full h-full object-cover opacity-80" muted playsInline />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="p-2.5 rounded-full bg-white/90 text-[#003334] shadow-md">
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
                        alt={asset.altText || asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23cbd5e1"><rect width="100" height="100"/><text x="50" y="50" font-size="12" text-anchor="middle" fill="%2364748b" dy=".3em">Preview</text></svg>';
                        }}
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                      {formatFileSize(asset.size)}
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 truncate" title={asset.name}>
                          {asset.name}
                        </p>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase shrink-0">
                          {asset.category || 'Asset'}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                        {asset.url}
                      </p>
                      {asset.altText && (
                        <p className="text-[10px] text-slate-500 italic truncate mt-1" title={asset.altText}>
                          Alt: {asset.altText}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleCopy(asset.url)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          copiedUrl === asset.url
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:border-[#c5a880] hover:text-[#003334]'
                        }`}
                      >
                        {copiedUrl === asset.url ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg transition-colors"
                        title="Open full size"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Register External Media URL */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#c5a880]" />
                <h4 className="font-serif font-bold text-base text-[#003334]">Register Web Media URL</h4>
              </div>
              <button
                onClick={() => setShowAddUrlModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterUrl} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Media URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or https://.../video.mp4"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Asset Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Morpheus8 Clinical Session"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                  >
                    <option value="Treatments">Treatments</option>
                    <option value="Videos">Videos</option>
                    <option value="Before & After">Before &amp; After</option>
                    <option value="Interiors & Facilities">Interiors &amp; Facilities</option>
                    <option value="Uploads">Uploads</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  SEO Alt Label
                </label>
                <input
                  type="text"
                  placeholder="Descriptive text for Google Image Search"
                  value={newAltText}
                  onChange={(e) => setNewAltText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  SEO Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="anti-aging london, facial aesthetics, dermal filler"
                  value={newSeoKeywords}
                  onChange={(e) => setNewSeoKeywords(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003334]/20 focus:border-[#003334]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUrlModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Register Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
