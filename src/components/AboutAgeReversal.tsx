import TeamLeadership from './TeamLeadership';
import Process from './Process';
import FacilityInteriors from './FacilityInteriors';
import Testimonials from './Testimonials';
import TrustBrands from './TrustBrands';
import Accreditations from './Accreditations';

interface AboutAgeReversalProps {
  onViewProfile?: (name: string) => void;
}

export default function AboutAgeReversal({ onViewProfile }: AboutAgeReversalProps) {
  return (
    <div className="bg-white min-h-screen flex flex-col relative z-10">
      {/* Header Title Hero element matching ServiceHero/Homepage style */}
      <section className="relative bg-white overflow-hidden min-h-0 md:min-h-[75vh] flex items-center pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-12 border-b border-silver-150">
        {/* Mobile Full-bleed Background Image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden md:hidden z-0">
          <img
            className="w-full h-full object-cover object-center brightness-[0.6]"
            src="https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY"
            alt="Age Reversal Clinic Reception Lounge"
            referrerPolicy="no-referrer"
          />
          {/* Dark gradient overlay for mobile text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/65 pointer-events-none" />
        </div>

        {/* Breadcrumb Path */}
        <div className="absolute top-4 sm:top-6 left-4 md:left-8 z-30 flex items-center text-[10px] sm:text-xs md:text-sm text-white/80 md:text-silver-400 font-sans tracking-wide">
          <span className="font-semibold cursor-default text-white md:text-silver-500">Home</span>
          <span className="mx-2 text-white/60 md:text-silver-300">&gt;</span>
          <span className="text-rose-gold font-bold">About Age Reversal</span>
        </div>

        {/* Desktop Full-bleed Right Half Image */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden hidden md:block z-0">
          <img
            className="w-full h-full object-cover brightness-[0.96] contrast-[1.02] transition-transform duration-10000 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AP1WRLvP3DFx2If1DMSMz3JKM0HPzM540kXV5qx4ncam1B_CstR80gJfBU5AgVz_YsPJ7u8V1nICj4IKO0ho2mOZo1vuUDFZEw-Ayq4p14_4qW8gAEOq6vYJFfmXi02IYti-uAUEojYV7cVHRx8-IjuVyoJ6AdGSCYT0VhPznGkC--nZZbr2vqIbtzvJQaOoTpF7vm4dZGfUyfQgXnhGm3ra1mjdJAGKWeB3fhbxho_WV4iW-9ZUAe7bRastfXY"
            alt="Age Reversal Clinic Reception Lounge"
            referrerPolicy="no-referrer"
          />
          {/* Subtle overlay for beautiful text blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent w-32 pointer-events-none" />
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

        {/* Decorative background gradient on the left half (Desktop only) */}
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-silver-50/30 to-white pointer-events-none hidden md:block z-0" />

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 pt-6 pb-2 md:py-8">
          {/* Left Column: Heading, Category, Call to action */}
          <div className="w-full md:w-1/2 flex flex-col justify-center max-w-xl relative z-10 text-left">
            <div className="inline-flex items-center space-x-2 bg-white/20 md:bg-silver-100 text-white md:text-silver-700 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider w-fit mb-4 md:mb-6 border border-white/20 md:border-transparent">
              <span className="w-2 h-2 rounded-full bg-rose-gold animate-pulse" />
              <span>About Age Reversal Clinic</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white md:text-silver-900 leading-tight mb-3 sm:mb-4 md:mb-6 chrome-text drop-shadow-sm md:drop-shadow-none">
              Pioneering <br/>
              <span className="text-rose-gold italic font-light">Biological Youth</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 md:text-silver-600 mb-6 md:mb-8 leading-relaxed max-w-md font-normal md:font-medium drop-shadow-sm md:drop-shadow-none">
              Grove Park’s premiere center for advanced diagnostics, visionary medical leadership, and bespoke regenerative therapies tailored to restore, elevate, and refine your skin architecture.
            </p>

            <div className="border-l-2 border-rose-gold pl-3 sm:pl-4 mb-6 md:mb-8">
              <span className="text-[9px] sm:text-[10px] font-extrabold text-white/70 md:text-silver-400 uppercase tracking-widest block">Clinical Excellence</span>
              <span className="text-xs sm:text-sm font-semibold text-white md:text-silver-900">Grove Park, London Borough of Lewisham, UK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Render selected Homepage components as specified by the user */}
      <TeamLeadership onViewProfile={onViewProfile} />
      <Process />
      <FacilityInteriors />
      <Testimonials />
      <TrustBrands />
      <Accreditations />
    </div>
  );
}
