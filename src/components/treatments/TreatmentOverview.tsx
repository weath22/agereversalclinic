import { Sparkles } from 'lucide-react';

interface TreatmentOverviewProps {
  title: string;
  category?: string;
  description: string;
  imageUrl?: string;
  badgeText?: string;
}

export default function TreatmentOverview({
  title,
  category = 'Clinical Aesthetics',
  description,
  imageUrl,
  badgeText
}: TreatmentOverviewProps) {
  return (
    <div className="flex flex-col gap-6" id="treatment-overview-component">
      {imageUrl && (
        <div className="relative aspect-[16/10] md:aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-[#bfc8c8]/40 group">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {badgeText && (
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-black tracking-widest uppercase bg-[#c5a880]/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-white inline-block shadow-sm">
                {badgeText}
              </span>
            </div>
          )}
        </div>
      )}

      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004b4d]/70 mb-1.5 block">
          {category}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#003334] mb-3">
          {title}
        </h2>
        
        <div className="border-l-2 border-[#c5a880] pl-4 my-4">
          <span className="text-[10px] font-extrabold text-[#bfc8c8] uppercase tracking-widest block mb-1">
            Technology & Philosophy
          </span>
          <p className="text-sm md:text-base text-[#003334]/80 font-medium leading-relaxed italic">
            Precision clinical science matched with customized beauty goals.
          </p>
        </div>

        <div>
          <span className="text-[10px] font-extrabold text-[#bfc8c8] uppercase tracking-widest block mb-2">
            Treatment Overview
          </span>
          <p className="text-sm text-silver-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
