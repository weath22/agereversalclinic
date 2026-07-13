import React from 'react';

interface ServiceOverviewProps {
  data: {
    title: string;
    description: string;
  };
}

export default function ServiceOverview({ data }: ServiceOverviewProps) {
  return (
    <div id="service-overview" className="max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left side on desktop: overlapping clinical treatment images */}
        <div className="md:col-span-5 relative w-full aspect-[1.0] flex items-center justify-center">
          {/* Luxury soft background watermark lines */}
          <div className="absolute -bottom-6 -left-6 w-40 h-40 opacity-20 pointer-events-none select-none z-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-silver-300 stroke-current fill-none stroke-[0.85]" aria-hidden="true">
              <path d="M 10,90 A 80,80 0 0,1 90,10" />
              <path d="M 20,90 A 70,70 0 0,1 90,20" />
              <path d="M 30,90 A 60,60 0 0,1 90,30" />
              <path d="M 40,90 A 50,50 0 0,1 90,40" />
            </svg>
          </div>

          {/* Back/Top-Left Card */}
          <div className="absolute top-[4%] left-0 w-[72%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-silver-100 z-10 transition-all duration-500 hover:scale-103 hover:z-25 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
              alt={`${data.title} procedural profile - back framing`}
              className="w-full h-full object-cover brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>

          {/* Front/Bottom-Right Card */}
          <div className="absolute bottom-[-4%] right-0 w-[72%] aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-silver-150 z-20 transition-all duration-500 hover:scale-105 hover:shadow-[0_25px_60px_rgba(0,0,0,0.16)] group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK134gv5bOV1d7aZiP1QG_u9fKjKQ1_jlRBXLR-E5Cst7nSdtayh9Zwkvuuhz3dP6vySkKzLGjdMYc8iMIRXdyhsx9jSRhWuZ2Ko5pQgUihbuqwfdTwbjxtShh29W1LrCfdefV754VZMLFcfswtICdzLfdn_ds83B85z662-e6K50qYlBWu8V0jz2Pz3aPok1SLdWcBBObR9QvnsdqE0Ur7_jkggwLIa4QxTmWu7HNm99XuxZ6eHxCoiVQwYKiqsYRa9CxFNwuAhuR"
              alt={`${data.title} procedural profile - front focal`}
              className="w-full h-full object-cover brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </div>

        {/* Right side on desktop: Treatment description and Philosophy */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-[10px] font-black tracking-widest uppercase text-rose-gold block">
            Scientific Profile
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-silver-950">
            Treatment Overview
          </h2>
          <p className="text-sm md:text-base text-silver-600 leading-relaxed font-normal">
            {data.description}
          </p>
          
          <div className="bg-sky-50/70 border-l-4 border-sky-400 p-4 rounded-r-lg my-6">
            <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-widest block mb-1">
              Philosophy & Protocol
            </span>
            <p className="text-sm text-sky-900 font-medium italic leading-relaxed">
              Every protocol is strictly diagnostic-first, ensuring high safety parameters and clinical efficacy tailored exactly to your dermal matrix.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
