import React from 'react';
import { UserCheck, ArrowRight } from 'lucide-react';

interface ConsultantProfileProps {
  authorName: string;
  onViewProfile?: () => void;
}

export default function ConsultantProfile({ authorName, onViewProfile }: ConsultantProfileProps) {
  return (
    <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-luxury-border max-w-md mr-auto">
      <div className="bg-[#faf7f2] p-4 sm:p-5 rounded-2xl border border-[#e8dcc8] shadow-xs flex flex-col items-start gap-3 sm:gap-4 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 sm:gap-4 w-full">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xs bg-luxury-secondary">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDddaCi7PsPNTwV7AiEWxAoBSKDc9x7oJb4yFMVO41f99W4wxnnsgcI6AzvsOCf4kSCE8EDCAOgvLeEfBhBAJqjpM00DsGFv8_3x2tYtIe6sFTplMAF9SLyrwFaIWhlfrTIF4wOh7dR5swda_bf9ss9jn1vOr5QOYEgWeCxEODworWQ1wvIOUWEoW4mKN15tNvMocfNZjw7xG4qU0sKbOB2UrkHu3YPQoq-WswAXNY-4y2nGG1mBgta8XV5lBlewVQ242-xoDTjIW1l" 
              alt={authorName}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left flex-1">
            <span className="text-[10px] font-sans font-medium text-luxury-gold uppercase tracking-[0.18em] block mb-0.5">
              Medical Consultant
            </span>
            <h3 className="text-base sm:text-lg font-serif font-normal text-luxury-text leading-snug">
              {authorName}
            </h3>
          </div>
        </div>
        <p className="text-luxury-subtext font-sans text-xs sm:text-sm leading-relaxed text-left font-light">
          {authorName} is a premier clinical specialist at The London Cosmetic Clinic with extensive expertise in bespoke dermatology and facial rejuvenation protocols.
        </p>
        <button 
          onClick={onViewProfile}
          className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-luxury-text hover:text-black border-b border-luxury-gold pb-0.5 uppercase tracking-wider transition-colors cursor-pointer group"
        >
          <span>View Consultant Profile</span>
          <ArrowRight className="w-3.5 h-3.5 text-luxury-gold group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
