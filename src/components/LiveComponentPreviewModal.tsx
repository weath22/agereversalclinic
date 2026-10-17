import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Edit3, 
  Eye, 
  Layers, 
  Info 
} from 'lucide-react';
import { TreatmentDetail } from './treatments/treatmentData';
import ServiceHero from './ServiceHero';
import ServiceOverview from './ServiceOverview';
import TargetConcerns from './TargetConcerns';
import BeforeAfterComparisonSlider from './BeforeAfterComparisonSlider';
import PrePostCareGuidelines from './PrePostCareGuidelines';

export interface LiveComponentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  treatment: TreatmentDetail;
  slotKey: string;
  slotLabel: string;
  componentLocation: string;
  onEditSlot: () => void;
}

export default function LiveComponentPreviewModal({
  isOpen,
  onClose,
  treatment,
  slotKey,
  slotLabel,
  componentLocation,
  onEditSlot
}: LiveComponentPreviewModalProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#003334] text-[#c5a880] rounded-xl shadow-xs">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a880]">
                  Live Component Preview
                </span>
                <span className="text-[11px] text-slate-400 font-mono">| {treatment.title}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-[#003334]">
                {slotLabel} <span className="font-normal text-xs text-slate-500 font-sans">({componentLocation})</span>
              </h3>
            </div>
          </div>

          {/* Right Controls: Device Mode Switcher + Edit Button + Close */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-[#003334] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-[#003334] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">Mobile</span>
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onEditSlot();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#003334] hover:bg-[#236963] text-[#c5a880] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Media &amp; SEO</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Informational Sub-bar */}
        <div className="px-6 py-2 bg-[#003334]/5 border-b border-[#003334]/10 text-xs text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-[#c5a880]" />
            <span>Simulating exact live DOM rendering for <strong>{treatment.title}</strong></span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Viewport: {deviceMode === 'desktop' ? '100% Fluid Width' : '390px Mobile View'}
          </span>
        </div>

        {/* Preview Scroll Container */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          <div 
            className={`transition-all duration-300 w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200 ${
              deviceMode === 'mobile' ? 'max-w-[390px] border-4 border-slate-700 my-auto' : 'max-w-5xl'
            }`}
          >
            {/* Dynamic Component Rendering based on slotKey */}
            {slotKey === 'coverMedia' && (
              <div className="p-8 space-y-6">
                <div className="border-b pb-4">
                  <span className="text-[10px] uppercase font-bold text-[#c5a880] tracking-wider">Homepage Specialist Care Card</span>
                  <h4 className="font-serif font-bold text-xl text-[#003334]">Specialist Areas Grid Preview</h4>
                </div>
                <div className="max-w-sm mx-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg group">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={treatment.coverMedia?.url || treatment.imageUrl}
                      alt={treatment.coverMedia?.altText || treatment.title}
                      title={treatment.coverMedia?.seoTitle || treatment.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#003334]/90 text-[#c5a880] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#c5a880]/30">
                      {treatment.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h5 className="font-serif font-bold text-lg text-[#003334]">{treatment.title}</h5>
                    <p className="text-xs text-slate-500 line-clamp-2">{treatment.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#003334]">
                      <span>Starting from {treatment.price || '$250'}</span>
                      <span className="text-[#c5a880]">Learn More &rarr;</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {slotKey === 'heroMedia' && (
              <div>
                <ServiceHero
                  data={{
                    category: treatment.category,
                    title: treatment.title,
                    imageUrl: treatment.imageUrl,
                    price: treatment.price || '$250',
                    heroMedia: treatment.heroMedia
                  }}
                  onClose={() => {}}
                  onBook={() => {}}
                />
              </div>
            )}

            {(slotKey === 'overviewMedia_back' || slotKey === 'overviewMedia_front') && (
              <div className="p-4 sm:p-8">
                <ServiceOverview
                  data={{
                    title: treatment.title,
                    description: treatment.description,
                    overviewMedia: treatment.overviewMedia,
                    imageUrl: treatment.imageUrl
                  }}
                />
              </div>
            )}

            {slotKey === 'targetConcernsMedia' && (
              <div className="p-4 sm:p-8">
                <TargetConcerns
                  data={{
                    title: treatment.title,
                    concerns: treatment.concerns || [
                      'Dermal volume depletion and mid-face laxity',
                      'Fine lines, dynamic expression folds & structural creases',
                      'Uneven skin texture, cellular pigmentation and dull tone',
                      'Decreased fibroblast vitality and diminished collagen resilience'
                    ],
                    targetConcernsMedia: treatment.targetConcernsMedia
                  }}
                />
              </div>
            )}

            {(slotKey === 'clinicalComparison_before' || slotKey === 'clinicalComparison_after') && (
              <div className="p-4 sm:p-8">
                <BeforeAfterComparisonSlider
                  beforeImage={treatment.clinicalComparisonMedia?.beforeImage?.url || treatment.beforeImage || treatment.imageUrl}
                  afterImage={treatment.clinicalComparisonMedia?.afterImage?.url || treatment.afterImage || treatment.imageUrl}
                  treatmentName={treatment.title}
                  clinicalComparisonMedia={treatment.clinicalComparisonMedia}
                />
              </div>
            )}

            {(slotKey === 'clinicalGuidance_pre' || slotKey === 'clinicalGuidance_post') && (
              <div className="p-4 sm:p-8">
                <PrePostCareGuidelines
                  preCare={treatment.preCare || [
                    'Refrain from retinoids and chemical exfoliants for 5 days prior to clinical treatment.',
                    'Maintain optimal epidermal hydration; drink at least 2 litres of water daily.',
                    'Avoid direct sun exposure and apply SPF 50+ broad-spectrum daily.'
                  ]}
                  postCare={treatment.postCare || [
                    'Apply prescribed post-procedure calming lipid barrier serum morning and evening.',
                    'Avoid high-intensity aerobic exercise, steam rooms, and saunas for 48 hours.',
                    'Do not apply makeup for 24 hours post-treatment to allow micro-channels to recover.'
                  ]}
                  treatmentName={treatment.title}
                  clinicalGuidanceMedia={treatment.clinicalGuidanceMedia}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Preview reflects all current and saved visual configurations in the database.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
