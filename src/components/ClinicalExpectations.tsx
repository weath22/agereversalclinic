import React from 'react';
import { Activity, Clock, Compass, Sparkles, Calendar } from 'lucide-react';

interface ClinicalExpectationsProps {
  data: {
    procedureTime: string;
    downtime: string;
    comfortLevel: string;
    recommendedSessions: string;
    anesthesia?: string;
    longevity?: string;
  };
}

export default function ClinicalExpectations({ data }: ClinicalExpectationsProps) {
  return (
    <div id="clinical-expectations" className="max-w-5xl mx-auto w-full bg-silver-50/60 border-y md:border border-silver-100 rounded-none md:rounded-3xl p-4 sm:p-6 md:p-8 -mx-4 md:mx-auto">
      <h3 className="text-xs font-black tracking-widest uppercase text-silver-950 border-b border-silver-150 pb-3 mb-6 flex items-center space-x-2">
        <Activity className="h-4 w-4 text-rose-gold" />
        <span>Clinical Expectations</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Procedure Time */}
        <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
          <Clock className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
              Procedure Time
            </span>
            <span className="text-sm font-semibold text-silver-950">
              {data.procedureTime}
            </span>
          </div>
        </div>

        {/* Downtime */}
        <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
          <Compass className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
              Recovery & Downtime
            </span>
            <span className="text-sm font-semibold text-silver-950">
              {data.downtime}
            </span>
          </div>
        </div>

        {/* Comfort Level */}
        <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
          <Sparkles className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
              Comfort Level
            </span>
            <span className="text-sm font-semibold text-silver-950">
              {data.comfortLevel}
            </span>
          </div>
        </div>

        {/* Recommended Sessions */}
        <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
          <Calendar className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
              Recommended Plan
            </span>
            <span className="text-sm font-semibold text-silver-950">
              {data.recommendedSessions}
            </span>
          </div>
        </div>

        {/* Anesthesia / Numbing (if specified) */}
        {data.anesthesia && (
          <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
            <Sparkles className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
                Anesthesia / Numbing
              </span>
              <span className="text-sm font-semibold text-silver-950">
                {data.anesthesia}
              </span>
            </div>
          </div>
        )}

        {/* Longevity / Duration of Results (if specified) */}
        {data.longevity && (
          <div className="flex flex-row lg:flex-col items-start space-x-3.5 lg:space-x-0">
            <Clock className="h-5 w-5 lg:h-8 lg:w-8 text-rose-gold shrink-0 mt-0.5 lg:mt-0 lg:mb-2.5" strokeWidth={1.6} />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
                Expected Longevity
              </span>
              <span className="text-sm font-semibold text-silver-950">
                {data.longevity}
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
