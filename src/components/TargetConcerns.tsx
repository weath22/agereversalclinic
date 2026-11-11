import { Check } from 'lucide-react';
import { TreatmentMediaItem } from '../types';
import ClinicImageWithPlaceholder from './common/ClinicImageWithPlaceholder';
import { cleanServiceImageUrl } from './treatments/treatmentData';

interface TargetConcernsProps {
  data: {
    id?: string;
    title: string;
    concerns: string[];
    targetConcernsMedia?: TreatmentMediaItem;
  };
}

export default function TargetConcerns({ data }: TargetConcernsProps) {
  const media = data.targetConcernsMedia;
  const mediaId = media?.id || `service-${data.id || 'default'}-target-concerns`;
  const mediaUrl = cleanServiceImageUrl(media?.url);
  const altText =
    media?.altText ||
    `${data.title} diagnostic technology - High-precision targeted aesthetic treatment technology`;
  const seoTitle = media?.seoTitle || data.title;
  const caption = media?.caption || 'Targeted Bio-Calibration';

  return (
    <div id="target-concerns" className="max-w-5xl lg:max-w-6xl mx-auto w-full pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Column: Editorial Header & Clean Structured Concerns List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-silver-150 pb-4">
            <span className="text-[10px] font-black tracking-widest uppercase text-rose-gold block">
              Clinical Indications
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-silver-950 tracking-tight">
              Target Concerns
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            {data.concerns.map((concern, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 py-3.5 border-b border-silver-100 group transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-rose-gold/10 text-rose-gold-dark flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:bg-rose-gold group-hover:text-white">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-sm md:text-[15px] text-silver-700 group-hover:text-silver-950 leading-snug font-medium transition-colors">
                  {concern}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean Framing for Clinical Media / Logo Placeholder */}
        <div className="lg:col-span-5">
          <div className="space-y-2.5">
            <div
              id={mediaId}
              data-media-id={mediaId}
              className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-silver-150 bg-slate-50 shadow-[0_12px_36px_rgba(0,0,0,0.06)] group"
            >
              <ClinicImageWithPlaceholder
                src={mediaUrl}
                alt={altText}
                title={seoTitle}
                containerClassName="relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center justify-between px-1 text-[11px] text-silver-400 font-medium tracking-wide">
              <span>{caption}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[60%] text-right">{data.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
