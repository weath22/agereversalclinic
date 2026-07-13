import React from 'react';

interface ConsultantProfileProps {
  authorName: string;
  onViewProfile?: () => void;
}

export default function ConsultantProfile({ authorName, onViewProfile }: ConsultantProfileProps) {
  return (
    <div className="mt-16 pt-8 border-t border-[#bfc8c8]/40 max-w-sm mr-auto">
      <div className="bg-[#f8f9ff] p-6 rounded-2xl shadow-sm flex flex-col items-start gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2v_Qy0F12eTq307-F4t22D5-5B2vF5W5vE9p6hB9aJ6pU2yH6eZ5f-L6r3q8c9U4F8C9zK2L2eJ7qH1a_P8X9sE8hR2W8B1c2Q7K9wM7cR3X2Y7J3vL2D4aH5Y6R4W5F6E3B8D9H4F2K5M9J2P3L9Y8X7P3H6K7N8B2" 
              alt={authorName}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left flex-1">
            <h4 className="text-xs font-bold text-[#236963] uppercase tracking-wider mb-0.5">Written by Consultant</h4>
            <h3 className="text-lg font-serif font-bold text-[#003334]">{authorName}</h3>
          </div>
        </div>
        <p className="text-[#3f4849] font-sans text-sm leading-relaxed text-left">
          {authorName} is a highly respected specialist at The London Clinic with over 15 years of clinical experience.
        </p>
        <button 
          onClick={onViewProfile}
          className="text-[#003334] font-bold text-xs border-b border-[#003334] pb-0.5 hover:text-[#236963] hover:border-[#236963] transition-colors uppercase tracking-wider self-start cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
