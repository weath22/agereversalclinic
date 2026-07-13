import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

interface TargetConcernsProps {
  data: {
    title: string;
    concerns: string[];
  };
}

export default function TargetConcerns({ data }: TargetConcernsProps) {
  return (
    <div id="target-concerns" className="max-w-5xl mx-auto w-full pt-6">
      <div className="space-y-6">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-silver-800 flex items-center space-x-2">
          <Shield className="h-4 w-4 text-rose-gold" />
          <span>Target Concerns</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Concerns List */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.concerns.map((concern, idx) => (
              <div key={idx} className="flex items-start space-x-3 group p-2.5 rounded-lg hover:bg-silver-50/50 transition-colors">
                <CheckCircle2 className="h-4 w-4 text-rose-gold shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-silver-600 leading-normal font-medium">
                  {concern}
                </span>
              </div>
            ))}
          </div>

          {/* Right: Modern Aesthetic/Technology Closeup card */}
          <div className="md:col-span-4">
            <div className="relative aspect-[4/3] md:aspect-square w-full rounded-xl overflow-hidden border border-silver-200 bg-silver-50 group shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
                alt="High-precision targeted aesthetic treatment technology"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-[9px] font-bold text-white tracking-wide uppercase text-center bg-black/45 backdrop-blur-xs py-1 rounded">
                Targeted Bio-Calibration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
