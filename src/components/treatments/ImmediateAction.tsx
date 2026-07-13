import { ArrowRight, Calendar } from 'lucide-react';

interface ImmediateActionProps {
  treatmentName: string;
  onBook: (serviceName: string) => void;
  onClose: () => void;
  price?: string;
}

export default function ImmediateAction({
  treatmentName,
  onBook,
  onClose,
  price
}: ImmediateActionProps) {
  const handleAction = () => {
    onClose();
    onBook(treatmentName);
  };

  return (
    <div 
      className="bg-[#003334] text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-md border border-[#004b4d]"
      id="immediate-action-component"
    >
      <div className="space-y-1.5 max-w-md">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#c5a880]" />
          <span className="text-[10px] font-extrabold text-[#c5a880] uppercase tracking-widest">
            Immediate Action
          </span>
        </div>
        <h4 className="text-lg font-bold tracking-tight">
          Ready to begin your journey?
        </h4>
        <p className="text-xs text-white/85 leading-relaxed font-normal">
          Secure a personalized diagnostic appointment. Our clinical experts will customize this treatment precisely for your unique skin properties.
        </p>
      </div>

      <div className="flex flex-col sm:items-end justify-center gap-2.5 shrink-0">
        {price && (
          <div className="text-left sm:text-right">
            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest block">Starting From</span>
            <span className="text-xl md:text-2xl font-semibold text-white tracking-tight">{price}</span>
          </div>
        )}
        <button
          onClick={handleAction}
          className="w-full sm:w-auto px-6 py-3 bg-[#c5a880] hover:bg-[#b0936b] text-[#003334] font-black text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-95 cursor-pointer shadow-md group"
          id="book-now-button"
        >
          <span>Secure Booking</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
