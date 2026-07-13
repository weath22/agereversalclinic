import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getAccreditationsConfig } from '../lib/adminStore';
import { useState, useEffect } from 'react';

export default function Accreditations() {
  const [config, setConfig] = useState(getAccreditationsConfig());

  useEffect(() => {
    setConfig(getAccreditationsConfig());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 14 }
    }
  };

  // Define cards in an array. We put the most visually attractive/centered ones in the middle of the flow.
  const cards = [
    /* Card 1: Aesthetics Awards Commended 2023 */
    <motion.div 
      key="card-1"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-white p-2.5 rounded-xl h-28 border border-amber-500/10 shadow-sm hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[11px] font-serif font-semibold text-amber-700 tracking-tight leading-none">Aesthetics</span>
      <span className="text-[13px] font-serif font-extrabold text-amber-700 uppercase tracking-wider mt-0.5 leading-none">AWARDS</span>
      <div className="w-full h-[1px] bg-amber-200 my-1" />
      <span className="text-[8px] font-sans font-bold text-amber-600 uppercase tracking-wider">Commended 2023</span>
    </motion.div>,

    /* Card 3: STYLE Magazine */
    <motion.div 
      key="card-3"
      variants={itemVariants} 
      className="inline-flex flex-col justify-between items-center text-center w-full bg-neutral-800 border border-neutral-700 p-2 rounded-xl h-36 relative overflow-hidden group hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-red-800" />
      <span className="text-[13px] font-serif font-black tracking-widest text-neutral-100 leading-none mt-1">STYLE</span>
      <span className="text-[7px] text-neutral-400 font-sans tracking-tight">Get me to the salon!</span>
      <span className="text-[6px] bg-red-950 text-red-300 px-1 py-0.5 rounded uppercase tracking-widest font-bold mb-1">Times Style</span>
    </motion.div>,

    /* Card 2: Sunday Times - Best for Injectables */
    <motion.div 
      key="card-2"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-neutral-800 p-2 rounded-xl h-20 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[9px] font-serif font-extrabold text-white uppercase tracking-tight leading-none">THE SUNDAY TIMES</span>
      <div className="w-4 h-[1px] bg-rose-gold/40 my-1.5" />
      <span className="text-[9px] font-sans font-medium text-neutral-300 italic">Best for Injectables</span>
    </motion.div>,

    /* Card 4: Global 100 Winner */
    <motion.div 
      key="card-4"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-yellow-600/20 p-2.5 rounded-xl h-24 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="w-8 h-8 rounded-full border border-yellow-500/50 flex flex-col justify-center items-center relative p-0.5 mb-1">
        <div className="absolute inset-0.5 rounded-full border border-dashed border-yellow-500/30" />
        <span className="text-[5px] font-sans font-black text-yellow-500 leading-none">WIN</span>
      </div>
      <span className="text-[8px] font-sans font-black text-yellow-500 uppercase tracking-widest leading-none">GLOBAL 100</span>
      <span className="text-[7px] font-sans font-bold text-white mt-0.5">2025 WINNER</span>
    </motion.div>,

    /* Card 8: English Hair & Beauty Awards */
    <motion.div 
      key="card-8"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-white p-2 rounded-xl h-32 border border-neutral-200 shadow-sm hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="flex items-center gap-1 mb-1">
        <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-[7px] text-purple-700 font-serif">👩</span>
        </div>
        <span className="text-[6px] font-sans font-extrabold text-purple-800 uppercase tracking-tighter">THE</span>
      </div>
      <span className="text-[7px] font-sans font-extrabold text-neutral-900 leading-none">ENGLISH</span>
      <span className="text-[6px] font-sans text-neutral-500 tracking-tight leading-none">HAIR & BEAUTY</span>
      <span className="text-[7px] font-sans font-black text-purple-700 leading-none mt-0.5">AWARDS 2023</span>
    </motion.div>,

    /* Card 6: GHP Awards */
    <motion.div 
      key="card-6"
      variants={itemVariants} 
      className="inline-flex w-full bg-neutral-900 border border-neutral-800 rounded-xl h-24 overflow-hidden hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="w-1/2 bg-white flex flex-col justify-center items-start p-1.5 h-full">
        <span className="text-[10px] font-sans font-extrabold text-neutral-900 leading-none">ghp</span>
        <span className="text-[6px] font-sans text-neutral-500 font-semibold leading-tight mt-1">Global Excellence</span>
      </div>
      <div className="w-1/2 bg-neutral-950 flex items-center justify-center relative p-1 opacity-85 h-full">
        <div className="grid grid-cols-3 gap-0.5 opacity-35">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 border border-white/40 rotate-45" />
          ))}
        </div>
      </div>
    </motion.div>,

    /* Card 7: The Tweakments Guide */
    <motion.div 
      key="card-7"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-white p-2 rounded-xl h-28 border border-neutral-200 shadow-sm hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm mb-1 relative">
        T
        <span className="absolute -top-1 -right-1 text-[6px] text-yellow-500 font-bold">✦</span>
      </div>
      <span className="text-[7px] font-sans font-extrabold text-neutral-800 leading-tight">The Tweakments</span>
      <span className="text-[7px] font-sans text-cyan-600 font-bold leading-none">Guide</span>
    </motion.div>,

    /* Card 5: Glamour */
    <motion.div 
      key="card-5"
      variants={itemVariants} 
      className="inline-flex justify-center items-center w-full bg-neutral-950 border border-neutral-850 p-2 rounded-xl h-16 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[13px] font-serif font-black tracking-[0.2em] text-white leading-none">GLAMOUR</span>
    </motion.div>,

    /* Card 9: Aesthetics Journal */
    <motion.div 
      key="card-9"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-white p-2 rounded-xl h-20 border border-neutral-200 shadow-sm hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[11px] font-serif font-extrabold text-blue-950 leading-none">Aesthetics</span>
      <span className="text-[7px] font-sans font-bold text-neutral-400 uppercase tracking-widest mt-0.5">JOURNAL</span>
    </motion.div>,

    /* Card 13: Times Style Salon Guide 2021 */
    <motion.div 
      key="card-13"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-white p-2.5 rounded-xl h-32 border border-neutral-200 shadow-sm hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="w-12 h-12 rounded-full bg-neutral-900 flex flex-col justify-center items-center p-1 text-white relative">
        <span className="text-[6px] font-serif font-bold tracking-tight">STYLE</span>
        <span className="text-[4px] tracking-tighter uppercase font-sans text-neutral-300">SALON GUIDE</span>
        <span className="text-[4px] font-bold text-yellow-500">TOP 10</span>
      </div>
    </motion.div>,

    /* Card 10: Aesthetics Awards Finalist */
    <motion.div 
      key="card-10"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-amber-600/20 p-2 rounded-xl h-24 relative overflow-hidden hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 to-transparent opacity-50" />
      <span className="text-[6px] font-sans text-neutral-400 uppercase tracking-widest font-semibold leading-none mb-1">FINALIST</span>
      <span className="text-[9px] font-serif font-bold text-amber-500 leading-none">Aesthetics</span>
      <span className="text-[10px] font-serif font-black text-amber-500 uppercase tracking-widest leading-none mt-0.5">AWARDS</span>
    </motion.div>,

    /* Card 11: Midlands Beauty Industry Winner */
    <motion.div 
      key="card-11"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl h-28 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="border border-white/10 p-1 rounded w-full h-full flex flex-col justify-center items-center">
        <span className="text-sm font-serif font-semibold text-white leading-none">B</span>
        <span className="text-[5px] text-neutral-400 uppercase tracking-widest mt-0.5 font-bold">Midlands Beauty</span>
        <span className="text-[7px] font-sans font-bold text-white uppercase tracking-widest mt-1">WINNER</span>
      </div>
    </motion.div>,

    /* Card 12: British Aesthetics Awards */
    <motion.div 
      key="card-12"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-neutral-800 p-2 rounded-xl h-20 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[6px] text-neutral-400 uppercase tracking-widest leading-none">THE BRITISH</span>
      <span className="text-[9px] font-serif font-bold text-white leading-none mt-1">Aesthetics</span>
      <span className="text-[8px] font-sans font-bold text-yellow-500 uppercase tracking-wider mt-0.5">WINNER 2020</span>
    </motion.div>,

    /* Card 14: Midlands Beauty Industry Finalist */
    <motion.div 
      key="card-14"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-950 border border-neutral-850 p-2 rounded-xl h-24 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-xs font-serif font-semibold text-neutral-500 leading-none">B</span>
      <span className="text-[5px] text-neutral-500 uppercase mt-0.5 font-bold">MIDLANDS BEAUTY</span>
      <span className="text-[7px] text-neutral-400 font-sans tracking-widest uppercase mt-1">FINALIST</span>
    </motion.div>,

    /* Card 15: English Hair & Beauty Finalist */
    <motion.div 
      key="card-15"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-neutral-800 p-2 rounded-xl h-24 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <span className="text-[6px] text-neutral-500 tracking-wider">HAIR & BEAUTY AWARDS</span>
      <span className="text-[8px] text-neutral-300 font-sans font-bold uppercase mt-1">FINALIST</span>
      <span className="text-[7px] text-rose-gold mt-0.5">2019</span>
    </motion.div>,

    /* Card 16: ThreeBest Rated */
    <motion.div 
      key="card-16"
      variants={itemVariants} 
      className="inline-flex flex-col justify-center items-center text-center w-full bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl h-20 hover:scale-[1.03] transition-transform duration-200 break-inside-avoid mb-2.5 sm:mb-3"
    >
      <div className="flex gap-0.5 text-yellow-500 text-[6px] mb-1">
        ★ ★ ★ ★ ★
      </div>
      <span className="text-[8px] font-sans font-bold text-white tracking-tight">ThreeBest</span>
      <span className="text-[8px] font-sans font-bold text-yellow-500 tracking-tight leading-none">Rated®</span>
    </motion.div>
  ];

  return (
    <section className="py-20 bg-[#124c6a] border-t border-sky-950 overflow-hidden relative">
      {/* Subtle background glow effect across the whole section */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-[#33B4AA]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Pure CSS masonry with direct flat cards to prevent any disappearing or isolated elements */}
          <div className="w-full lg:w-[58%] order-2 lg:order-1">
            <div className="bg-black/25 p-4 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6 px-1">
                  <span className="text-[10px] font-bold text-sky-200/70 uppercase tracking-widest block">
                    Verified Accreditations
                  </span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-rose-gold rounded-full" />
                    <span className="w-1.5 h-1.5 bg-sky-400/40 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-sky-900/60 rounded-full" />
                  </div>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="columns-2 md:columns-3 lg:columns-4 gap-2.5 sm:gap-3 w-full [column-fill:_balance]"
                >
                  {cards}
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Heading, Description, and Details */}
          <div className="w-full lg:w-[42%] order-1 lg:order-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-[0.25em] block mb-3">
              Accreditations &amp; Certifications
            </span>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Excellence guaranteed. Trusted globally.
            </h3>
            <div className="w-16 h-0.5 bg-rose-gold mb-6" />
            <p className="text-base text-neutral-300 leading-relaxed mb-8">
              Age Reversal Clinic adheres strictly to the highest medical, surgical, and cosmetic safety protocols. Our prestige is backed by leading medical boards, safety associations, and beauty standard committees in the UK and internationally.
            </p>

            {/* List of Accreditations */}
                        <div className="space-y-4">
              {config.accreditations.map(acc => (
              <div key={acc.id} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-950/45 border border-emerald-800/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-100 uppercase tracking-wider">{acc.text}</h4>
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
