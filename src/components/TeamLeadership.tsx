import { FOUNDER, TEAM_MEMBERS } from '../data';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';

interface TeamLeadershipProps {
  onViewProfile?: (name: string) => void;
  groupImageUrl?: string;
}

export default function TeamLeadership({ onViewProfile, groupImageUrl = '' }: TeamLeadershipProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <section id="leadership" className="py-10 sm:py-16 md:py-24 lg:py-28 bg-luxury-secondary border-t border-luxury-border">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8">

        {/* Clinic Group Image Placeholder Item */}
        <div className="max-w-6xl mx-auto mb-10 sm:mb-16 md:mb-24 lg:mb-28 rounded-2xl md:rounded-[24px] overflow-hidden border border-luxury-border bg-luxury-card shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] aspect-[16/9] sm:aspect-[21/9]">
          <ClinicImageWithPlaceholder
            src={groupImageUrl}
            slotId="clinic-team-group"
            alt="Age Reversal Clinics Specialist Team"
            logoSize="lg"
            showBrandText={false}
            containerClassName="relative w-full h-full overflow-hidden bg-luxury-card flex items-center justify-center"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Meet the Specialists Segment */}
        <div className="text-center mb-7 sm:mb-12 md:mb-14 lg:mb-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-luxury-text">
            Meet the <span className="text-luxury-gold italic">Specialists</span>
          </h3>
        </div>

        {/* Team Grid: 2 columns per row on mobile, 4 columns on tablet & mini-desktop/desktop (md+) with compact card dimensions */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-3 sm:gap-x-5 md:gap-x-5 lg:gap-x-6 xl:gap-x-8 gap-y-6 sm:gap-y-8 md:gap-y-10 max-w-5xl mx-auto items-stretch mb-12 sm:mb-16 md:mb-24 lg:mb-28"
        >
          {TEAM_MEMBERS.map((member) => {
            const isDummyImage =
              !member.image ||
              member.image.includes('googleusercontent.com') ||
              member.image.includes('unsplash.com');
            const cleanSpecialistSrc = isDummyImage ? '' : member.image;

            return (
              <motion.div 
                key={member.id}
                variants={itemVariants}
                onClick={() => onViewProfile?.(member.name)}
                className="text-center group w-full cursor-pointer flex flex-col items-center h-full"
              >
                <div className="w-full max-w-[175px] sm:max-w-[200px] md:max-w-[185px] lg:max-w-[200px] xl:max-w-[215px] mx-auto aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden mb-2.5 sm:mb-3.5 lg:mb-4 bg-luxury-card border border-luxury-border transition-all duration-500 relative">
                  <ClinicImageWithPlaceholder
                    src={cleanSpecialistSrc}
                    slotId={`clinic-specialist-${member.id}`}
                    alt={member.name}
                    logoSize="md"
                    showBrandText={false}
                    containerClassName="relative w-full h-full overflow-hidden bg-luxury-card flex items-center justify-center"
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                </div>

                <h4 className="text-sm sm:text-base md:text-base lg:text-lg font-serif text-luxury-text mb-0.5 sm:mb-1 leading-snug">
                  {member.name}
                </h4>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-sans text-luxury-muted uppercase tracking-wider sm:tracking-widest mb-1.5 sm:mb-2.5">
                  {member.role}
                </p>
                <p className="text-[11px] sm:text-xs md:text-xs lg:text-[13px] text-luxury-subtext px-0.5 sm:px-1.5 leading-snug sm:leading-relaxed font-light max-w-[220px] mx-auto">
                  {member.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Our Leadership Header Block (Moved below Meet the Specialists) */}
        <div className="text-center mb-7 sm:mb-12 md:mb-16 lg:mb-20 max-w-2xl mx-auto">
          <span className="text-[10px] sm:text-[11px] md:text-xs font-sans text-luxury-muted uppercase tracking-[0.2em] block mb-2 sm:mb-3 md:mb-4">
            Our Leadership
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-serif font-light text-luxury-text">
            Visionary <span className="text-luxury-gold italic">Leadership</span>
          </h2>
        </div>

        {/* Founder Spotlight (Compact on mobile, 12-Col Bento Block on Tablet & Desktop) */}
        <div className="max-w-6xl mx-auto bg-luxury-card rounded-2xl md:rounded-[24px] overflow-hidden shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] border border-luxury-border">
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
            
            {/* Image box: compact height on mobile, 5 cols on tablet/desktop */}
            <div className="md:col-span-5 lg:col-span-5 relative h-56 sm:h-80 md:h-auto md:min-h-[420px] lg:min-h-[500px] overflow-hidden bg-luxury-secondary">
              <img
                alt={FOUNDER.name}
                className="w-full h-full object-cover object-top"
                src={FOUNDER.image}
              />
            </div>

            {/* Description details: compact padding on mobile, 7 cols on tablet/desktop */}
            <div className="md:col-span-7 lg:col-span-7 p-4 sm:p-7 md:p-8 lg:p-12 xl:p-14 flex flex-col justify-center">
              <span className="font-serif italic text-xs sm:text-sm text-luxury-subtext mb-1 sm:mb-2 block">
                Founder &amp; Director
              </span>
              <h3 className="text-xl sm:text-3xl md:text-3xl lg:text-4xl font-serif text-luxury-text mb-1 sm:mb-2">
                {FOUNDER.name}
              </h3>
              <p className="text-[9px] sm:text-[11px] font-sans text-luxury-muted uppercase tracking-[0.14em] sm:tracking-[0.15em] mb-3.5 sm:mb-6 lg:mb-8">
                {FOUNDER.role}
              </p>

              {/* Founder Stats Section */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-7 lg:mb-8 border-y border-luxury-border py-3 sm:py-5 lg:py-6">
                <div className="text-center md:text-left">
                  <span className="block text-base sm:text-xl md:text-xl lg:text-2xl font-light text-luxury-text font-serif tabular-nums mb-0.5">
                    20+
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-luxury-muted uppercase tracking-wider font-sans block leading-tight">
                    Years of Exp.
                  </span>
                </div>
                <div className="text-center md:text-left border-l border-luxury-border pl-2 sm:pl-4 md:pl-5">
                  <span className="block text-base sm:text-xl md:text-xl lg:text-2xl font-light text-luxury-text font-serif tabular-nums mb-0.5">
                    4.9★
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-luxury-muted uppercase tracking-wider font-sans block leading-tight">
                    Patient Reviews
                  </span>
                </div>
                <div className="text-center md:text-left border-l border-luxury-border pl-2 sm:pl-4 md:pl-5">
                  <span className="block text-base sm:text-xl md:text-xl lg:text-2xl font-light text-luxury-text font-serif tabular-nums mb-0.5">
                    15+
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-luxury-muted uppercase tracking-wider font-sans block leading-tight">
                    Treatments
                  </span>
                </div>
              </div>
              
              <div className="space-y-2.5 sm:space-y-3.5 md:space-y-4 text-luxury-subtext leading-relaxed text-xs sm:text-sm md:text-[15px] lg:text-base font-sans font-light">
                {FOUNDER.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* CEO CTA Button */}
              <div className="mt-5 sm:mt-8 lg:mt-10">
                <button
                  id="view-ceo-profile-button"
                  onClick={() => onViewProfile?.(FOUNDER.name)}
                  className="inline-flex items-center gap-2 bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-sans text-[11px] sm:text-xs md:text-sm font-normal tracking-wide cursor-pointer whitespace-nowrap"
                >
                  More about {FOUNDER.name.split(' ')[1] || FOUNDER.name}
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" strokeWidth={1.5} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
