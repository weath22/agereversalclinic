"use client";

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function StayInformed() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <section className="bg-gradient-to-b from-[#FAF7F2] via-[#F3EBE0] to-[#EFE5D6] py-14 sm:py-16 md:py-20 border-t border-b border-[#D8C2A3]/40 text-luxury-text relative overflow-hidden">
      {/* Luminous warm champagne and gold ambient light blooms */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-gradient-to-b from-white/70 via-[#D8C2A3]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-[#ecdcc8]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[450px] h-[450px] bg-[#e4d2bc]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] sm:text-xs font-sans font-semibold text-luxury-gold uppercase tracking-[0.28em] block mb-2 sm:mb-3">
            Clinical Insights
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-luxury-text mb-3 tracking-tight">
            Stay Informed
          </h2>
          <p className="text-xs sm:text-sm text-luxury-subtext mb-8 font-light max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter for latest treatments and exclusive insights.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/95 border border-[#D8C2A3] px-6 py-4 rounded-full text-luxury-text text-xs sm:text-sm shadow-md animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-luxury-gold" />
              <span className="font-medium">Thank you for subscribing to our clinical newsletter.</span>
            </div>
          ) : (
            <form className="max-w-3xl mx-auto" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 md:flex md:flex-row gap-3 items-center justify-center">
                {/* First Name */}
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name" 
                  className="w-full col-span-1 md:w-36 lg:w-40 px-4 sm:px-5 py-3 rounded-full border border-[#D8C2A3]/50 bg-white/90 text-luxury-text placeholder:text-luxury-muted text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-luxury-text focus:bg-white focus:ring-1 focus:ring-luxury-text/10 shadow-xs transition-all" 
                />
                {/* Last Name */}
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name" 
                  className="w-full col-span-1 md:w-36 lg:w-40 px-4 sm:px-5 py-3 rounded-full border border-[#D8C2A3]/50 bg-white/90 text-luxury-text placeholder:text-luxury-muted text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-luxury-text focus:bg-white focus:ring-1 focus:ring-luxury-text/10 shadow-xs transition-all" 
                />
                {/* Email Address */}
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  required
                  className="w-full col-span-2 md:w-64 lg:w-72 px-5 py-3 rounded-full border border-[#D8C2A3]/50 bg-white/90 text-luxury-text placeholder:text-luxury-muted text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-luxury-text focus:bg-white focus:ring-1 focus:ring-luxury-text/10 shadow-xs transition-all" 
                />
                {/* Subscribe button */}
                <button 
                  type="submit" 
                  className="w-full col-span-2 md:w-auto bg-luxury-text hover:bg-black text-white px-8 py-3 rounded-full text-[11px] font-sans font-semibold uppercase tracking-[0.2em] shadow-md hover:shadow-xl transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
