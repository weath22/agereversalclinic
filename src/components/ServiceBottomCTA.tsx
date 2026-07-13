import React from 'react';
import { Calendar } from 'lucide-react';

interface ServiceBottomCTAProps {
  data: {
    title: string;
    price?: string;
  };
  onBook: (serviceName: string) => void;
}

export default function ServiceBottomCTA({ data, onBook }: ServiceBottomCTAProps) {
  const handleBookClick = () => {
    onBook(data.title);
  };

  return (
    <div id="bottom-booking-cta" className="mt-16 bg-[#003334] text-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg border border-[#004b4d]">
      <div className="space-y-2 max-w-xl">
        <span className="text-[9px] font-extrabold text-[#c5a880] uppercase tracking-widest block">
          Immediate Action
        </span>
        <h4 className="text-xl font-serif font-bold tracking-tight text-white">
          Begin Your Journey With {data.title}
        </h4>
        <p className="text-xs text-white/80 leading-relaxed font-normal">
          Book a personalized clinical diagnostic session. Our leading clinical practitioners will calibrate this protocol specifically to your skin profile.
        </p>
      </div>
      
      <div className="flex flex-col sm:items-end justify-center gap-3 shrink-0">
        <div>
          <span className="text-[9px] font-bold text-white/55 uppercase tracking-widest block">Starting From</span>
          <span className="text-2xl font-semibold text-white tracking-tight">{data.price || '$150'}</span>
        </div>
        <button
          onClick={handleBookClick}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#c5a880] hover:bg-[#b0936b] text-[#003334] font-black text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg cursor-pointer"
          id="cta-book-btn"
        >
          <Calendar className="h-4 w-4" />
          <span>Secure Booking</span>
        </button>
      </div>
    </div>
  );
}
