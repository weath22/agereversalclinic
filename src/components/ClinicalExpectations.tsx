import React from 'react';
import { Activity, Clock, Compass, Sparkles, Calendar } from 'lucide-react';

interface ClinicalExpectationsProps {
  data: {
    procedureTime: string;
    downtime: string;
    comfortLevel: string;
    recommendedSessions: string;
  };
}

export default function ClinicalExpectations({ data }: ClinicalExpectationsProps) {
  return (
    <div id="clinical-expectations" className="max-w-5xl mx-auto w-full bg-silver-50/60 border border-silver-100 rounded-3xl p-6 md:p-8">
      <h3 className="text-xs font-black tracking-widest uppercase text-silver-950 border-b border-silver-150 pb-3 mb-6 flex items-center space-x-2">
        <Activity className="h-4 w-4 text-rose-gold" />
        <span>Clinical Expectations</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        
        {/* Procedure Time */}
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-white rounded-lg text-silver-800 border border-silver-100 shadow-sm shrink-0">
            <Clock className="h-4 w-4 text-rose-gold" />
          </div>
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
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-white rounded-lg text-silver-800 border border-silver-100 shadow-sm shrink-0">
            <Compass className="h-4 w-4 text-rose-gold" />
          </div>
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
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-white rounded-lg text-silver-800 border border-silver-100 shadow-sm shrink-0">
            <Sparkles className="h-4 w-4 text-rose-gold" />
          </div>
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
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-white rounded-lg text-silver-800 border border-silver-100 shadow-sm shrink-0">
            <Calendar className="h-4 w-4 text-rose-gold" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-silver-400 block">
              Recommended Plan
            </span>
            <span className="text-sm font-semibold text-silver-950">
              {data.recommendedSessions}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
