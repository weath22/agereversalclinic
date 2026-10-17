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
  CheckCircle2, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink,
  Sliders,
  Tag,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { TreatmentMediaItem } from '../types';

export interface MediaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: TreatmentMediaItem) => void;
  slotKey: string;
  slotNumber: number;
  slotLabel: string;
  slotCategory: string;
  componentLocation: string;
  treatmentTitle: string;
  treatmentCategory: string;
  initialMedia: TreatmentMediaItem;
  onOpenAssetPicker: () => void;
  onUploadFile: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

const CLINICAL_DESCRIPTORS = [
  'clinic', 'london', 'skin', 'therapy', 'rejuvenation', 'treatment',
  'cellular', 'protocol', 'dermal', 'facial', 'regeneration', 'collagen',
  'aesthetic', 'harley street', 'anti-wrinkle', 'bio-remodeling'
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
  'hyaluronic acid bio-stimulator',
  'clinical skin prep serum',
  'dermal matrix repair',
  'polynucleotide rejuvenation'
];

export default function MediaEditModal({
  isOpen,
  onClose,
  onSave,
  slotKey,
  slotNumber,
  slotLabel,
  slotCategory,
  componentLocation,
  treatmentTitle,
  treatmentCategory,
  initialMedia,
  onOpenAssetPicker,
  onUploadFile
}: MediaEditModalProps) {
  // Form fields
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

  // Left Preview Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state when modal opens
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
      setIsPlaying(true);
      setZoomLevel(1);
      setUploadError(null);
    }
  }, [isOpen, initialMedia, treatmentTitle]);

  // Video play/pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // SEO Quality Score Calculation (Task 5.2)
  const seoAnalysis = React.useMemo(() => {
    const text = (altText || '').trim();
    const len = text.length;
    let score = 0;
    const tips: string[] = [];

    // Check 1: Length (optimal 30 - 120 chars)
    if (len >= 30 && len <= 120) {
      score += 30;
    } else if (len > 0 && len < 30) {
      score += 15;
      tips.push('Expand alt text to 30–120 characters for higher Google Image rankings');
    } else if (len > 120) {
      score += 15;
      tips.push('Alt text is quite long; keep concise under 120 characters');
    } else {
      tips.push('Alt text is empty — required for Google SEO and clinical accessibility');
    }

    // Check 2: Contains Treatment Name
    const lowerText = text.toLowerCase();
    const titleWords = treatmentTitle.toLowerCase().split(' ').filter(w => w.length > 3);
    const hasTitle = titleWords.some(w => lowerText.includes(w));
    if (hasTitle) {
      score += 30;
    } else {
      tips.push(`Include procedure name ("${treatmentTitle}")`);
    }

    // Check 3: Clinical Descriptors present
    const hasClinicalTerm = CLINICAL_DESCRIPTORS.some(term => lowerText.includes(term));
    if (hasClinicalTerm) {
      score += 25;
    } else {
      tips.push('Add clinical descriptor like "London", "clinic", "treatment", or "rejuvenation"');
    }

    // Check 4: Tagged Keywords present
    if (keywords.length >= 2) {
      score += 15;
    } else {
      tips.push('Tag at least 2 clinical SEO keywords below');
    }

    let gradeLabel = 'Needs Improvement';
    let gradeColor = 'text-amber-500 bg-amber-50 border-amber-200';
    let barColor = 'bg-amber-500';

    if (score >= 85) {
      gradeLabel = 'Clinical Grade SEO (Top Ranking)';
      gradeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      barColor = 'bg-emerald-500';
    } else if (score >= 60) {
      gradeLabel = 'Good SEO Indexability';
      gradeColor = 'text-sky-700 bg-sky-50 border-sky-200';
      barColor = 'bg-sky-500';
    }

    return {
      score: Math.min(score, 100),
      gradeLabel,
      gradeColor,
      barColor,
      tips
    };
  }, [altText, treatmentTitle, keywords]);

  // Handle local file upload
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
        setUploadError(res.error || 'Failed to upload file');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setUploadError('Media URL cannot be empty');
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
  const isComparisonSlot = slotKey.startsWith('clinicalComparison');

  return (
    <div className="fixed inset-0 z-50 hidden sm:flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#003334] text-[#c5a880] rounded-xl shadow-xs">
              {mediaType === 'video' ? <Video className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#c5a880]">
                  Slot #{slotNumber}: {slotCategory}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">| {treatmentTitle}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#003334]">
                {slotLabel}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-block text-[11px] text-slate-400 font-mono">
              {componentLocation}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Split Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Media Preview & Visual Controls */}
          <div className="w-full md:w-1/2 p-6 bg-slate-900 text-white flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#c5a880] uppercase tracking-wider flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Desktop Viewport Preview</span>
                </span>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-[10px] text-slate-300">
                  <span>{mediaType.toUpperCase()}</span>
                  {zoomLevel !== 1 && <span>• {Math.round(zoomLevel * 100)}%</span>}
                </div>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[16/10] bg-black/60 rounded-2xl overflow-hidden border border-white/10 shadow-inner flex items-center justify-center group">
                {url ? (
                  mediaType === 'video' ? (
                    <video
                      ref={videoRef}
                      src={url}
                      poster={videoPoster || undefined}
                      autoPlay={autoPlay}
                      loop={loop}
                      muted={muted}
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: `scale(${zoomLevel})` }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={altText}
                      className="w-full h-full object-cover transition-transform duration-300"
                      style={{ transform: `scale(${zoomLevel})` }}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                    <ImageIcon className="h-10 w-10 text-slate-600" />
                    <p className="text-xs">No media URL or file selected</p>
                  </div>
                )}

                {/* Overlaid Play/Pause or Zoom Toolbar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    {mediaType === 'video' ? (
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1 hover:text-[#c5a880] transition-colors cursor-pointer flex items-center gap-1 font-bold text-[11px]"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-300 truncate max-w-[150px]">
                        {treatmentCategory}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isComparisonSlot && (
                      <span className="text-[10px] text-amber-400 font-bold mr-1">Comparison Slot</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                      className="p-1 hover:text-[#c5a880] transition-colors cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1)}
                      className="px-1.5 py-0.5 text-[10px] font-mono hover:text-[#c5a880] transition-colors"
                      title="Reset Zoom"
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                      className="p-1 hover:text-[#c5a880] transition-colors cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Alt Text Overlay Preview */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Google Image Search Hover Caption:
                </span>
                <p className="text-slate-200 text-xs font-serif italic">
                  "{altText || 'Alt text label will display here...'}"
                </p>
              </div>
            </div>

            {/* Bottom Left Summary */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Target: {componentLocation}</span>
              <span className="text-[#c5a880] font-mono">Slot #{slotNumber}</span>
            </div>
          </div>

          {/* Right Column: Controls, Inputs & SEO Validator */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-5 bg-white">
            
            {/* Quick Actions Bar: Asset Library & Upload */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenAssetPicker}
                className="flex-1 bg-[#003334] hover:bg-[#236963] text-[#c5a880] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Layers className="h-4 w-4" />
                <span>Replace from Clinic Assets</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer flex items-center gap-2"
              >
                <Upload className={`h-4 w-4 ${uploading ? 'animate-bounce text-[#003334]' : ''}`} />
                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
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
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Direct Media URL Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Direct Media URL / CDN Link
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://domain/video.mp4"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
              />
            </div>

            {/* Hero Media Type Switcher & Settings (Task 5.1) */}
            {isHeroSlot && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#003334] uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#c5a880]" />
                    <span>Hero Media Type Switcher</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">16:9 Full Bleed</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-[#003334] text-white border-[#003334] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>High-Res Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('video')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-sky-700 text-white border-sky-700 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Streaming 4K Video</span>
                  </button>
                </div>

                {/* Video Playback & Poster Controls */}
                {mediaType === 'video' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Poster Fallback Image URL (Shown while video loads or on low-bandwidth)
                      </label>
                      <input
                        type="url"
                        value={videoPoster}
                        onChange={(e) => setVideoPoster(e.target.value)}
                        placeholder="https://images.unsplash.com/...poster.jpg"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={(e) => setAutoPlay(e.target.checked)}
                          className="rounded text-[#003334] focus:ring-[#003334]"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Autoplay</span>
                      </label>
                      <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={muted}
                          onChange={(e) => setMuted(e.target.checked)}
                          className="rounded text-[#003334] focus:ring-[#003334]"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Muted</span>
                      </label>
                      <label className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={loop}
                          onChange={(e) => setLoop(e.target.checked)}
                          className="rounded text-[#003334] focus:ring-[#003334]"
                        />
                        <span className="text-[11px] font-bold text-slate-700">Loop</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Alt Text & Google Image Search Validator (Task 5.2) */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Alt Text (Google Image Search SEO &amp; Accessibility)
                </label>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {altText.length} / 120 chars
                </span>
              </div>

              <textarea
                rows={2}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="e.g., Exosome Regenerative Therapy cellular rejuvenation procedure - Age Reversal Clinic London"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
              />

              {/* SEO Score Meter & Diagnostics */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${seoAnalysis.gradeColor}`}>
                    {seoAnalysis.gradeLabel}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    SEO Score: {seoAnalysis.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${seoAnalysis.barColor} transition-all duration-300`}
                    style={{ width: `${seoAnalysis.score}%` }}
                  />
                </div>

                {/* Tips */}
                {seoAnalysis.tips.length > 0 && (
                  <ul className="text-[11px] text-slate-500 space-y-1 pt-1 list-disc list-inside">
                    {seoAnalysis.tips.map((tip, idx) => (
                      <li key={idx} className="text-slate-600">{tip}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* SEO Title Attribute & Caption */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  SEO Hover Title Attribute
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g., Exosome Therapy London"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Visual Card Caption (Optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Cellular rejuvenation at 4 weeks"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                />
              </div>
            </div>

            {/* Tagged Clinical Keywords */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#c5a880]" />
                  <span>Clinical SEO Keyword Tagging</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{keywords.length} Tagged</span>
              </div>

              {/* Keyword Pills */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[48px] items-center">
                {keywords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No keywords tagged yet</span>
                ) : (
                  keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#003334] text-white shadow-2xs"
                    >
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-[#c5a880] hover:text-white"
                        aria-label={`Remove keyword ${kw}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Custom Keyword Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeywordInput}
                  onChange={(e) => setNewKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddKeyword(newKeywordInput);
                    }
                  }}
                  placeholder="Add custom clinical keyword and press Enter..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003334]"
                />
                <button
                  type="button"
                  onClick={() => handleAddKeyword(newKeywordInput)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* One-Tap Suggested Keywords */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Suggested High-Impact Clinical Keywords (1-Click Add):
                </span>
                <div className="flex flex-wrap gap-1">
                  {SUGGESTED_CLINICAL_KEYWORDS.slice(0, 8).map((sug) => {
                    const isAdded = keywords.includes(sug);
                    return (
                      <button
                        key={sug}
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddKeyword(sug)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-slate-100 text-slate-400 opacity-50 cursor-default'
                            : 'bg-[#c5a880]/15 hover:bg-[#c5a880]/30 text-[#003334] border border-[#c5a880]/30'
                        }`}
                      >
                        + {sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Bottom Save Actions */}
            <div className="pt-4 border-t border-slate-150 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#003334] hover:bg-[#236963] text-[#c5a880] text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Save Slot &amp; Sync Central Library</span>
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
