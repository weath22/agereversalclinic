import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link2, 
  Sparkles, 
  Check, 
  Clock, 
  Tag, 
  Layers, 
  Trash2, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProtocolStepItem } from '../types';
import { uploadAssetFile } from '../lib/adminStore';
import { 
  FaceCleansingIcon, 
  SheetMaskIcon, 
  RadianceGlowIcon, 
  FacialMappingIcon, 
  MicroDropletInfusionIcon, 
  ContourLiftIcon, 
  BioShieldSealingIcon 
} from './icons/ClinicalProtocolIcons';

export interface ClinicalProtocolModalProps {
  isOpen: boolean;
  step: ProtocolStepItem | null;
  stepNumber: number;
  treatmentName?: string;
  onSave: (step: ProtocolStepItem) => void;
  onClose: () => void;
  onDelete?: (stepId: string) => void;
}

// Curated Clinical Aesthetic Presets
export interface PresetIconItem {
  id: string;
  name: string;
  type: 'image' | 'svg_preset';
  src: string;
  category: 'Asset' | 'Vector Icon';
  description: string;
}

export const CLINICAL_PRESETS: PresetIconItem[] = [
  {
    id: 'asset-facewash',
    name: 'Epidermal Cleansing',
    type: 'image',
    src: '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg',
    category: 'Asset',
    description: 'Gentle foam cleanse & prep'
  },
  {
    id: 'asset-disk',
    name: 'Micro-Channel Disk',
    type: 'image',
    src: '/assets/aistudio/_________Disk_Google_cf269914.jpg',
    category: 'Asset',
    description: 'Precision cellular pathways'
  },
  {
    id: 'asset-mask',
    name: 'Bio-Cellular Mask',
    type: 'image',
    src: '/assets/aistudio/Sheet_Face_Mask_Vector_Illustration_-_Graphics_by_Canva_a7a34ce5.jpg',
    category: 'Asset',
    description: 'Infusion & regenerative seal'
  },
  {
    id: 'svg-radiance',
    name: 'Radiance Glow',
    type: 'svg_preset',
    src: 'svg_preset:radiance',
    category: 'Vector Icon',
    description: 'Cellular glow & final luminosity'
  },
  {
    id: 'svg-mapping',
    name: 'Diagnostic Mapping',
    type: 'svg_preset',
    src: 'svg_preset:mapping',
    category: 'Vector Icon',
    description: 'Calibrated anatomical target points'
  },
  {
    id: 'svg-infusion',
    name: 'Droplet Delivery',
    type: 'svg_preset',
    src: 'svg_preset:infusion',
    category: 'Vector Icon',
    description: 'Targeted serum micro-infusion'
  },
  {
    id: 'svg-contour',
    name: 'Contour Vectors',
    type: 'svg_preset',
    src: 'svg_preset:contour',
    category: 'Vector Icon',
    description: 'SMAS & collagen tightening'
  },
  {
    id: 'svg-shield',
    name: 'Bio-Shield Barrier',
    type: 'svg_preset',
    src: 'svg_preset:shield',
    category: 'Vector Icon',
    description: 'Lipid barrier & moisture lock'
  }
];

export const SUGGESTED_DESCRIPTIONS = [
  'Deep bio-enzymatic cleansing to clear impurities and prepare the skin barrier.',
  'Precision micro-channels calibrated for optimal bio-active peptide absorption.',
  'Direct infusion of concentrated regenerative exosomes and growth factors.',
  'Calibrated radiofrequency delivery targeting deep collagen synthesis.',
  'Cooling bio-cellulose sheet infused with soothing peptides to calm and seal.'
];

export default function ClinicalProtocolModal({
  isOpen,
  step,
  stepNumber,
  treatmentName,
  onSave,
  onClose,
  onDelete
}: ClinicalProtocolModalProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [phaseTag, setPhaseTag] = useState('');
  const [duration, setDuration] = useState('');
  const [focusArea, setFocusArea] = useState('');

  // Selector Tab State: 'presets' | 'upload' | 'url'
  const [imageTab, setImageTab] = useState<'presets' | 'upload' | 'url'>('presets');
  
  // Custom URL State
  const [urlInput, setUrlInput] = useState('');
  const [urlTestSuccess, setUrlTestSuccess] = useState<boolean | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation & Error
  const [formError, setFormError] = useState<string | null>(null);

  // Synchronize on open or step change
  useEffect(() => {
    if (isOpen) {
      if (step) {
        setTitle(step.title || '');
        setDescription(step.description || '');
        setImage(step.image || CLINICAL_PRESETS[0].src);
        setPhaseTag(step.phaseTag || `Phase ${step.stepNumber || stepNumber}`);
        setDuration(step.duration || '15 mins');
        setFocusArea(step.focusArea || '');
        setUrlInput(step.image?.startsWith('http') ? step.image : '');
        // Determine tab
        if (CLINICAL_PRESETS.some(p => p.src === step.image)) {
          setImageTab('presets');
        } else if (step.image?.startsWith('http')) {
          setImageTab('url');
        } else {
          setImageTab('upload');
        }
      } else {
        // Creating new step
        setTitle('');
        setDescription('');
        const defaultPreset = CLINICAL_PRESETS[(stepNumber - 1) % CLINICAL_PRESETS.length] || CLINICAL_PRESETS[0];
        setImage(defaultPreset.src);
        setPhaseTag(`Phase ${stepNumber} • 15 mins`);
        setDuration('15 mins');
        setFocusArea('');
        setUrlInput('');
        setImageTab('presets');
      }
      setFormError(null);
      setUploadError(null);
      setUrlTestSuccess(null);
    }
  }, [isOpen, step, stepNumber]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await uploadAssetFile(file);
      if (res.success && res.url) {
        setImage(res.url);
      } else {
        // Fallback to local DataURL for immediate visual use
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setImage(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      // Local preview fallback
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImage(dataUrl);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // URL apply
  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setImage(urlInput.trim());
    setUrlTestSuccess(true);
  };

  // Save handler
  const handleSave = () => {
    if (!title.trim()) {
      setFormError('Step title is required.');
      return;
    }

    const updatedStep: ProtocolStepItem = {
      id: step?.id || `step-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      stepNumber: step?.stepNumber || stepNumber,
      title: title.trim(),
      description: description.trim(),
      image: image || CLINICAL_PRESETS[0].src,
      phaseTag: phaseTag.trim() || undefined,
      duration: duration.trim() || undefined,
      focusArea: focusArea.trim() || undefined
    };

    onSave(updatedStep);
    onClose();
  };

  // Render SVG or Image helper
  const renderSelectedVisual = (imgSrc: string, sizeClass = "w-20 h-20") => {
    if (!imgSrc) return null;

    if (imgSrc.startsWith('svg_preset:')) {
      const key = imgSrc.replace('svg_preset:', '');
      switch (key) {
        case 'facewash':
          return <FaceCleansingIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'sheetmask':
          return <SheetMaskIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'radiance':
          return <RadianceGlowIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'mapping':
          return <FacialMappingIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'infusion':
          return <MicroDropletInfusionIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'contour':
          return <ContourLiftIcon className={`${sizeClass} text-[#c5a880]`} />;
        case 'shield':
          return <BioShieldSealingIcon className={`${sizeClass} text-[#c5a880]`} />;
        default:
          return <RadianceGlowIcon className={`${sizeClass} text-[#c5a880]`} />;
      }
    }

    return (
      <img 
        src={imgSrc} 
        alt={title || 'Protocol step preview'} 
        className={`${sizeClass} object-contain rounded-xl bg-white border border-slate-200/80 p-1 shadow-xs`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Face_Wash_free_icons_designed_by_Iconfromus_e0f9b71f.jpg';
        }}
      />
    );
  };

  const charCount = description.length;
  const maxChars = 180;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 sm:p-6 overflow-hidden">
      {/* Dimmed backdrop with luxury blur */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Main Container: Desktop Modal (md:) & Mobile Bottom Drawer (<md) */}
      <motion.div 
        initial={{ y: '100%', opacity: 0.8 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative z-10 w-full md:max-w-3xl bg-white border-t md:border border-slate-200 text-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[88vh]"
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="md:hidden pt-3 pb-1 flex justify-center items-center bg-[#FAF9F5]">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-slate-200 bg-[#FAF9F5]">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-white border border-[#c5a880]/40 text-[#003334] font-mono text-xs font-bold flex items-center justify-center shadow-2xs">
              #{String(step?.stepNumber || stepNumber).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-base md:text-lg font-serif font-bold text-[#003334] tracking-wide">
                {step ? 'Edit Protocol Step' : 'Add Clinical Protocol Step'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {treatmentName ? `${treatmentName} • The Clinical Protocol` : 'Configure step visual icon, concise text, and timing'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-5 space-y-6 bg-white">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* SECTION 1: VISUAL ICON / IMAGE SELECTOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#9e7e56] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#c5a880]" />
                Step Icon & Visual Asset
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {image.startsWith('svg_preset:') ? 'Vector line art' : 'High-resolution image'}
              </span>
            </div>

            {/* Selector Method Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 border border-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setImageTab('presets')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageTab === 'presets'
                    ? 'bg-white text-[#003334] font-bold border border-slate-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Presets</span>
              </button>

              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageTab === 'upload'
                    ? 'bg-white text-[#003334] font-bold border border-slate-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Upload</span>
              </button>

              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all min-h-[44px] flex items-center justify-center gap-1.5 cursor-pointer ${
                  imageTab === 'url'
                    ? 'bg-white text-[#003334] font-bold border border-slate-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Image URL</span>
              </button>
            </div>

            {/* TAB CONTENT: PRESETS */}
            {imageTab === 'presets' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {CLINICAL_PRESETS.map((preset) => {
                    const isSelected = image === preset.src;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setImage(preset.src)}
                        className={`group relative p-2.5 rounded-xl border text-left transition-all flex flex-col items-center justify-between min-h-[110px] cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAF9F5] border-[#c5a880] shadow-xs ring-1 ring-[#c5a880]/40'
                            : 'bg-slate-50/70 border-slate-200 hover:border-[#c5a880]/50 hover:bg-white'
                        }`}
                      >
                        {/* Selected Indicator */}
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#c5a880] text-zinc-950 flex items-center justify-center shadow-2xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}

                        <div className="w-14 h-14 flex items-center justify-center my-1">
                          {renderSelectedVisual(preset.src, "w-14 h-14")}
                        </div>

                        <div className="text-center w-full mt-1">
                          <span className="text-[11px] font-semibold text-[#003334] block truncate group-hover:text-[#9e7e56]">
                            {preset.name}
                          </span>
                          <span className="text-[9px] text-slate-500 block truncate">
                            {preset.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: UPLOAD / DRAG & DROP */}
            {imageTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2.5 cursor-pointer ${
                    isDragOver 
                      ? 'border-[#c5a880] bg-[#FAF9F5]' 
                      : 'border-slate-300 hover:border-[#c5a880] bg-[#FAF9F5]/60 hover:bg-[#FAF9F5]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#c5a880] shadow-2xs">
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#003334]">
                      {isUploading ? 'Uploading asset...' : 'Click to select or drag & drop an aesthetic icon'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Supports JPG, PNG, WebP, SVG (Auto-compressed and registered)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <p className="text-[11px] text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {uploadError}
                  </p>
                )}
              </div>
            )}

            {/* TAB CONTENT: URL INPUT */}
            {imageTab === 'url' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Paste image link: https://.../icon.png or .jpg"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setUrlTestSuccess(null);
                      }}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] min-h-[44px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!urlInput.trim()}
                    className="px-4 bg-[#003334] hover:bg-[#004445] disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition-colors min-h-[44px] shrink-0 cursor-pointer"
                  >
                    Apply URL
                  </button>
                </div>
                {urlTestSuccess && (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Image URL applied to active preview
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ACTIVE PREVIEW PILL (Instant Visual Feedback) */}
          <div className="p-3 bg-[#FAF9F5] border border-[#c5a880]/30 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                {renderSelectedVisual(image, "w-12 h-12")}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#9e7e56] block">
                  Active Step Visual
                </span>
                <p className="text-xs text-[#003334] font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {image.startsWith('svg_preset:') 
                    ? `Vector: ${image.replace('svg_preset:', '')}` 
                    : image.split('/').pop() || image}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-semibold px-2.5 py-1 bg-white text-slate-600 rounded-full border border-slate-200 shadow-2xs">
              Live Preview
            </span>
          </div>

          {/* SECTION 2: STEP DETAILS FORM */}
          <div className="space-y-4 pt-1">
            {/* Step Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Step Title <span className="text-[#c5a880]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Epidermal Clearing & Prep"
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] min-h-[44px]"
              />
            </div>

            {/* Concise Description with Character Count */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Concise Description
                </label>
                <span className={`text-[10px] font-mono ${charCount > maxChars ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                  {charCount}/{maxChars}
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={maxChars}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief clinical protocol instruction (e.g. Gentle enzyme cleanse removing lipids without stripping barrier)..."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] resize-none"
              />
              {/* Quick suggestion helper chips */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#c5a880]" /> Suggestions:
                </span>
                {SUGGESTED_DESCRIPTIONS.slice(0, 2).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDescription(sug)}
                    className="text-[10px] bg-slate-100 hover:bg-[#FAF9F5] text-slate-600 hover:text-[#003334] px-2 py-0.5 rounded-md border border-slate-200 hover:border-[#c5a880]/40 transition-colors truncate max-w-[220px] cursor-pointer"
                  >
                    "{sug.substring(0, 28)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Meta Tags Grid: Phase Tag, Duration, Target Tissue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#c5a880]" />
                  Phase Tag
                </label>
                <input
                  type="text"
                  value={phaseTag}
                  onChange={(e) => setPhaseTag(e.target.value)}
                  placeholder="Phase 1 • 10 mins"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#c5a880]" />
                  Step Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="10 mins"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#c5a880]" />
                  Focus Layer
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="Epidermis / Dermis"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c5a880] min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions (Accessible touch targets >= 44px) */}
        <div className="px-5 md:px-7 py-4 border-t border-slate-200 bg-[#FAF9F5] flex items-center justify-between gap-3">
          {step && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to remove this protocol step?')) {
                  onDelete(step.id);
                  onClose();
                }
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete Step</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 transition-colors min-h-[44px] cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-200 via-[#c5a880] to-amber-300 hover:brightness-105 shadow-[0_4px_14px_rgba(197,168,128,0.3)] transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{step ? 'Save Changes' : 'Add Step'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
