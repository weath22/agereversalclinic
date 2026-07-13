import { Shield, Sparkles } from 'lucide-react';

interface TargetConcernsProps {
  concerns: string[];
}

export default function TargetConcerns({ concerns }: TargetConcernsProps) {
  return (
    <div className="space-y-3" id="target-concerns-component">
      <h3 className="text-xs font-extrabold text-[#003334] uppercase tracking-wider flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-[#c5a880]" />
        <span>Target Concerns</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {concerns.map((concern, index) => (
          <div 
            key={index} 
            className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-silver-50 transition-colors"
          >
            <div className="p-1 bg-[#004b4d]/5 rounded-md text-[#004b4d] mt-0.5 shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs md:text-sm text-silver-700 leading-normal font-medium">
              {concern}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
