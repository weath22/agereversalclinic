import { FOUNDER, TEAM_MEMBERS } from '../data';
import { motion } from 'motion/react';
import { Award, ArrowRight } from 'lucide-react';

interface TeamLeadershipProps {
  onViewProfile?: (name: string) => void;
}

export default function TeamLeadership({ onViewProfile }: TeamLeadershipProps) {
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
    <section id="leadership" className="py-24 md:py-32 bg-luxury-secondary border-t border-luxury-border">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Block */}
        <div className="text-center mb-16 md:mb-24 max-w-2xl mx-auto">
          <span className="text-[11px] md:text-xs font-sans text-luxury-muted uppercase tracking-[0.2em] block mb-4">
            Our Leadership
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6">
            Visionary <span className="text-luxury-gold italic">Leadership</span>
          </h2>
        </div>

        {/* Founder Spotlights (Bento block) */}
        <div className="max-w-6xl mx-auto bg-luxury-card rounded-[24px] overflow-hidden shadow-[0_4px_40px_-10px_rgba(0,0,0,0.03)] border border-luxury-border mb-20 md:mb-32">
          <div className="flex flex-col md:flex-row">
            
            {/* Image box */}
            <div className="md:w-1/2 relative min-h-[350px] sm:min-h-[450px] md:min-h-[500px]">
              <img
                alt={FOUNDER.name}
                className="w-full h-full object-cover"
                src={FOUNDER.image}
              />
            </div>

            {/* Description details */}
            <div className="md:w-1/2 p-8 sm:p-12 md:p-16 flex flex-col justify-center">
              <span className="font-serif italic text-sm text-luxury-subtext mb-2 block">
                Founder & Director
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-luxury-text mb-2">
                {FOUNDER.name}
              </h3>
              <p className="text-[11px] font-sans text-luxury-muted uppercase tracking-[0.15em] mb-8">
                {FOUNDER.role}
              </p>

              {/* Founder Stats Section */}
              <div className="grid grid-cols-3 gap-4 mb-8 border-y border-luxury-border py-6">
                <div className="text-center md:text-left">
                  <span className="block text-xl sm:text-2xl font-light text-luxury-text font-serif mb-1">20+</span>
                  <span className="text-[10px] text-luxury-muted uppercase tracking-wider font-sans">Years of Exp.</span>
                </div>
                <div className="text-center md:text-left border-l border-luxury-border pl-4">
                  <span className="block text-xl sm:text-2xl font-light text-luxury-text font-serif mb-1">4.9★</span>
                  <span className="text-[10px] text-luxury-muted uppercase tracking-wider font-sans">Patient Reviews</span>
                </div>
                <div className="text-center md:text-left border-l border-luxury-border pl-4">
                  <span className="block text-xl sm:text-2xl font-light text-luxury-text font-serif mb-1">15+</span>
                  <span className="text-[10px] text-luxury-muted uppercase tracking-wider font-sans">Treatments</span>
                </div>
              </div>
              
              <div className="space-y-4 text-luxury-subtext leading-relaxed text-sm md:text-base font-sans font-light">
                {FOUNDER.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* CEO CTA Button */}
              <div className="mt-10">
                <button
                  id="view-ceo-profile-button"
                  onClick={() => onViewProfile?.(FOUNDER.name)}
                  className="inline-flex items-center gap-2 bg-black text-white hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 px-8 py-3.5 rounded-full font-sans text-xs md:text-sm font-normal tracking-wide cursor-pointer"
                >
                  More about {FOUNDER.name.split(' ')[1] || FOUNDER.name}
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Meet the Team Segment */}
        <div className="text-center mb-16 md:mb-20">
          <h3 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-4">
            Meet the <span className="text-luxury-gold italic">Specialists</span>
          </h3>
        </div>

        {/* Team Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 md:gap-x-6 lg:gap-x-10 gap-y-8 md:gap-y-12 max-w-6xl mx-auto"
        >
          {TEAM_MEMBERS.map((member) => (
            <motion.div 
              key={member.id}
              variants={itemVariants}
              onClick={() => onViewProfile?.(member.name)}
              className="text-center group w-full cursor-pointer flex flex-col items-center"
            >
              <div className="w-full aspect-[3/4] rounded-[24px] overflow-hidden mb-6 bg-luxury-secondary transition-all duration-500 relative">
                <img
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  src={member.image}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>

              <h4 className="text-lg md:text-xl font-serif text-luxury-text mb-1">
                {member.name}
              </h4>
              <p className="text-[10px] md:text-xs font-sans text-luxury-muted uppercase tracking-widest mb-3">
                {member.role}
              </p>
              <p className="text-xs md:text-sm text-luxury-subtext px-2 leading-relaxed font-light">
                {member.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
