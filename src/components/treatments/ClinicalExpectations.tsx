interface ClinicalExpectationsProps {
  procedureTime: string;
  comfortLevel: string;
  downtime: string;
  recommendedSessions: string;
}

export default function ClinicalExpectations({
  procedureTime,
  comfortLevel,
  downtime,
  recommendedSessions
}: ClinicalExpectationsProps) {
  return (
    <div 
      className="bg-gradient-to-br from-white to-silver-50/50 border border-[#bfc8c8]/30 rounded-xl p-5 space-y-4 shadow-sm"
      id="clinical-expectations-component"
    >
      <span className="text-[10px] font-extrabold text-[#004b4d] uppercase tracking-widest block border-b border-[#bfc8c8]/20 pb-2">
        Clinical Expectations (Quick Facts)
      </span>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Procedure Time */}
        <div className="flex items-start space-x-3 group">
          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">⏱️</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-silver-400 uppercase tracking-wider">Procedure Time</span>
            <span className="text-xs md:text-sm font-semibold text-[#003334] leading-tight mt-0.5">
              {procedureTime}
            </span>
          </div>
        </div>

        {/* Downtime */}
        <div className="flex items-start space-x-3 group">
          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">✨</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-silver-400 uppercase tracking-wider">Downtime</span>
            <span className="text-xs md:text-sm font-semibold text-[#003334] leading-tight mt-0.5">
              {downtime}
            </span>
          </div>
        </div>

        {/* Comfort Level */}
        <div className="flex items-start space-x-3 group">
          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">💤</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-silver-400 uppercase tracking-wider">Comfort Level</span>
            <span className="text-xs md:text-sm font-semibold text-[#003334] leading-tight mt-0.5">
              {comfortLevel}
            </span>
          </div>
        </div>

        {/* Recommended Sessions */}
        <div className="flex items-start space-x-3 group">
          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform duration-300">📅</span>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-silver-400 uppercase tracking-wider">Recommended Sessions</span>
            <span className="text-xs md:text-sm font-semibold text-[#003334] leading-tight mt-0.5">
              {recommendedSessions}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
