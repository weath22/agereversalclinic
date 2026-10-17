import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Video, 
  Image as ImageIcon, 
  Upload, 
  Layers, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Play, 
  Pause, 
  Tag, 
  Sliders, 
  ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TreatmentMediaItem } from '../types';

export interface MobileMediaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: TreatmentMediaItem) => void;
  slotKey: string;
  slotNumber: number;
  slotLabel: string;
  slotCategory: string;
  treatmentTitle: string;
  treatmentCategory: string;
  initialMedia: TreatmentMediaItem;
  onOpenAssetPicker: () => void;
  onUploadFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const CLINICAL_DESCRIPTORS = [
  'clinic', 'london', 'skin', 'therapy', 'rejuvenation', 'treatment',
  'cellular', 'protocol', 'dermal', 'facial', 'regeneration', 'collagen'
];

const SUGGESTED_CLINICAL_KEYWORDS = [
  'cellular skin regeneration',
  'anti-wrinkle clinic london',
  'collagen bio-remodeling',
  'non-surgical dermal lift',
  'medical grade pre-care protocol',
  'subdermal adipose remodeling',
  'targeted bio-calibration',
  'exosome therapy london',
  'harley street clinic',
  'smas muscle lifting',
  'hyaluronic acid bio-stimulator'
];

export default function MobileMediaSheet({
  isOpen,
  onClose,
  onSave,
  slotKey,
  slotNumber,
  slotLabel,
  slotCategory,
  treatmentTitle,
  treatmentCategory,
  initialMedia,
  onOpenAssetPicker,
  onUploadFile
}: MobileMediaSheetProps) {
  const [url, setUrl] = useState(initialMedia.url || '');
  const [mediaType, setMediaType] = useState<'image' | 'video'>(initialMedia.mediaType || 'image');
  const [altText, setAltText] = useState(initialMedia.altText || `${treatmentTitle} - Age Reversal Clinic London`);
  const [seoTitle, setSeoTitle] = useState(initialMedia.seoTitle || treatmentTitle);
  const [caption, setCaption] = useState(initialMedia.caption || '');
  const [keywords, setKeywords] = useState<string[]>(initialMedia.seoKeywords || []);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  // Video settings
  const [videoPoster, setVideoPoster] = useState(initialMedia.videoPoster || '');
  const [autoPlay, setAutoPlay] = useState<boolean>(initialMedia.autoPlay ?? true);
  const [muted, setMuted] = useState<boolean>(initialMedia.muted ?? true);
  const [loop, setLoop] = useState<boolean>(initialMedia.loop ?? true);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialMedia.url || '');
      setMediaType(initialMedia.mediaType || 'image');
      setAltText(initialMedia.altText || `${treatmentTitle} - Age Reversal Clinic London`);
      setSeoTitle(initialMedia.seoTitle || treatmentTitle);
      setCaption(initialMedia.caption || '');
      setKeywords(initialMedia.seoKeywords && initialMedia.seoKeywords.length > 0 ? [...initialMedia.seoKeywords] : []);
      setVideoPoster(initialMedia.videoPoster || '');
      setAutoPlay(initialMedia.autoPlay ?? true);
      setMuted(initialMedia.muted ?? true);
      setLoop(initialMedia.loop ?? true);
      setUploadError(null);
    }
  }, [isOpen, initialMedia, treatmentTitle]);

  // SEO Score for Mobile
  const seoAnalysis = React.useMemo(() => {
    const text = (altText || '').trim();
    const len = text.length;
    let score = 0;

    if (len >= 30 && len <= 120) score += 30;
    else if (len > 0) score += 15;

    const lowerText = text.toLowerCase();
    const titleWords = treatmentTitle.toLowerCase().split(' ').filter(w => w.length > 3);
    if (titleWords.some(w => lowerText.includes(w))) score += 30;
    if (CLINICAL_DESCRIPTORS.some(term => lowerText.includes(term))) score += 25;
    if (keywords.length >= 2) score += 15;

    let grade = 'Needs Work';
    let color = 'text-amber-500 bg-amber-50';
    if (score >= 80) {
      grade = 'Clinical Grade';
      color = 'text-emerald-700 bg-emerald-50';
    } else if (score >= 55) {
      grade = 'Good';
      color = 'text-sky-700 bg-sky-50';
    }

    return { score: Math.min(score, 100), grade, color };
  }, [altText, treatmentTitle, keywords]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setUploadError(null);
    try {
      const res = await onUploadFile(file);
      if (res.success && res.url) {
        setUrl(res.url);
        const isVid = file.type.startsWith('video/') || !!file.name.match(/\.(mp4|webm|mov)(\?|$)/i);
        setMediaType(isVid ? 'video' : 'image');
      } else {
        setUploadError(res.error || 'Failed to upload');
      }
    } catch (err) {
      setUploadError(String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddKeyword = (kw: string) => {
    const trimmed = kw.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleSave = () => {
    if (!url.trim()) {
      setUploadError('Please provide a media URL or upload a file');
      return;
    }

    onSave({
      url: url.trim(),
      mediaType,
      altText: altText.trim() || `${treatmentTitle} - Age Reversal Clinic London`,
      seoTitle: seoTitle.trim() || treatmentTitle,
      caption: caption.trim() || undefined,
      seoKeywords: keywords.length > 0 ? keywords : ['cellular skin regeneration'],
      videoPoster: mediaType === 'video' ? (videoPoster.trim() || undefined) : undefined,
      autoPlay: mediaType === 'video' ? autoPlay : undefined,
      muted: mediaType === 'video' ? muted : undefined,
      loop: mediaType === 'video' ? loop : undefined
    });
  };

  if (!isOpen) return null;

  const isHeroSlot = slotKey === 'heroMedia';

  return (
    <div className="fixed inset-0 z-50 sm:hidden flex flex-col justify-end bg-black/75 backdrop-blur-xs">
      {/* Backdrop Tap to Close */}
      <div className="flex-1" onClick={onClose} />

      {/* Floating Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-3xl max-h-[88vh] flex flex-col shadow-2xl border-t border-slate-200 relative overflow-hidden"
      >
        {/* Swipe-down drag handle bar */}
        <div className="pt-2 pb-1 flex justify-center cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-[#003334] text-[#c5a880] rounded-xl shrink-0">
              {mediaType === 'video' ? <Video className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#c5a880] block">
                Slot #{slotNumber} • {slotCategory}
              </span>
              <h3 className="font-serif font-bold text-sm text-[#003334] truncate">
                {slotLabel}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Preview Thumbnail */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
            {url ? (
              mediaType === 'video' ? (
                <video
                  src={url}
                  poster={videoPoster || undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={url}
                  alt={altText}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                <ImageIcon className="h-8 w-8 mb-1" />
                <span>No media selected</span>
              </div>
            )}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-xs">
              {mediaType.toUpperCase()}
            </div>
          </div>

          {/* Touch-Friendly Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenAssetPicker}
              className="py-3 px-3 rounded-xl bg-[#003334] text-[#c5a880] font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-transform"
            >
              <Layers className="h-4 w-4" />
              <span>Clinic Assets</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="py-3 px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-transform"
            >
              <Camera className={`h-4 w-4 ${uploading ? 'animate-bounce text-[#003334]' : ''}`} />
              <span>{uploading ? 'Uploading...' : 'Camera / Upload'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {uploadError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Direct URL */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Media URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
            />
          </div>

          {/* Hero Media Switcher (Mobile) */}
          {isHeroSlot && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold text-[#003334] uppercase tracking-wider block">
                Hero Format
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    mediaType === 'image' ? 'bg-[#003334] text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  Photo
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    mediaType === 'video' ? 'bg-sky-700 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  4K Video
                </button>
              </div>

              {mediaType === 'video' && (
                <div className="pt-2 space-y-2 text-xs">
                  <input
                    type="url"
                    value={videoPoster}
                    onChange={(e) => setVideoPoster(e.target.value)}
                    placeholder="Poster image fallback URL..."
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={autoPlay}
                        onChange={(e) => setAutoPlay(e.target.checked)}
                        className="rounded text-[#003334]"
                      />
                      <span className="text-[10px] font-bold">Autoplay</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={muted}
                        onChange={(e) => setMuted(e.target.checked)}
                        className="rounded text-[#003334]"
                      />
                      <span className="text-[10px] font-bold">Muted</span>
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={loop}
                        onChange={(e) => setLoop(e.target.checked)}
                        className="rounded text-[#003334]"
                      />
                      <span className="text-[10px] font-bold">Loop</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Alt Text & Character Counter with SEO Score */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Google Alt Text (SEO)
              </label>
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${seoAnalysis.color}`}>
                  {seoAnalysis.score}% {seoAnalysis.grade}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {altText.length}/120
                </span>
              </div>
            </div>
            <textarea
              rows={2}
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text for Google Image Search..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
            />
          </div>

          {/* One-Tap Suggested SEO Keywords Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Tag className="h-3 w-3 text-[#c5a880]" />
                <span>Tagged Keywords ({keywords.length})</span>
              </span>
            </div>

            {/* Active Keywords */}
            <div className="flex flex-wrap gap-1">
              {keywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#003334] text-white"
                >
                  <span>{kw}</span>
                  <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                    <X className="h-2.5 w-2.5 text-[#c5a880]" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Suggestion Chips */}
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block pt-1">
              Tap to add clinical keyword:
            </span>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_CLINICAL_KEYWORDS.slice(0, 6).map((sug) => {
                const added = keywords.includes(sug);
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={added}
                    onClick={() => handleAddKeyword(sug)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                      added
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-[#c5a880]/15 text-[#003334] border border-[#c5a880]/30 active:scale-95'
                    }`}
                  >
                    + {sug}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sticky Save Bar Anchored to the Bottom (Task 4.3) */}
        <div className="sticky bottom-0 z-10 px-5 py-3 border-t border-slate-200 bg-white/95 backdrop-blur-md flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-2 py-3 rounded-xl bg-[#003334] hover:bg-[#236963] text-[#c5a880] text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 transition-transform"
          >
            <Check className="h-4 w-4" />
            <span>Save &amp; Sync</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
