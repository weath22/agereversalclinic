import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Copy, 
  RefreshCw, 
  Folder, 
  ExternalLink, 
  FileCheck, 
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { uploadAssetFile, listProjectAssets } from '../lib/adminStore';

interface AssetItem {
  name: string;
  url: string;
  size: number;
  mtime: string;
  location: string;
}

export default function AssetsMediaManager() {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
        text: `Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''} directly into src/assets/images and public/assets!`
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
        text: 'Failed to upload image. Please verify server connection.'
      });
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#003334]">Assets & Media Manager</h2>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Real Disk Storage
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Upload images directly into <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-700">src/assets/images/</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono text-slate-700">public/assets/</code> before deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAssets}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#003334] bg-[#c5a880] hover:bg-[#d5b890] transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Upload className={`h-4 w-4 ${uploading ? 'animate-bounce' : ''}`} />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`mt-4 p-4 rounded-2xl text-xs flex items-center gap-3 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
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
              Images are saved into <span className="font-semibold text-slate-700">src/assets/images</span> for Git source tracking and deployment builds.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003334] mb-1">
              <ExternalLink className="h-4 w-4 text-[#c5a880]" />
              Immediate Web URL
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Also served via <span className="font-semibold text-slate-700">public/assets/</span> (<code className="text-[11px] font-mono">/assets/image.jpg</code>) so the live preview updates instantly without rebuilding.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003334] mb-1">
              <Copy className="h-4 w-4 text-[#c5a880]" />
              One-Click Copy & Paste
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click &quot;Copy URL&quot; on any asset to paste it into the Hero, Treatments, Specialist, or Profile editors.
            </p>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-[#003334]" />
            <h3 className="font-serif font-bold text-lg text-[#003334]">
              Available Assets ({assets.length})
            </h3>
          </div>
          {copiedUrl && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in">
              <Check className="h-3.5 w-3.5" />
              Copied: {copiedUrl}
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-[#c5a880]" />
            <p className="text-xs font-semibold">Scanning asset directories on disk...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 mb-1">No assets found</p>
            <p className="text-xs text-slate-500 mb-4">Upload an image to save it directly into the project assets folder.</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[#003334] text-[#c5a880] rounded-xl text-xs font-bold hover:bg-[#002526] transition-colors cursor-pointer"
            >
              Upload First Asset
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.name}
                className="group border border-slate-200 rounded-2xl overflow-hidden hover:border-[#c5a880] hover:shadow-md transition-all flex flex-col bg-slate-50/50"
              >
                <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23cbd5e1"><rect width="100" height="100"/><text x="50" y="50" font-size="12" text-anchor="middle" fill="%2364748b" dy=".3em">Preview</text></svg>';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {formatFileSize(asset.size)}
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 truncate" title={asset.name}>
                      {asset.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                      {asset.url}
                    </p>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
