import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HotSaleBannerProps {
  onOffersClick?: () => void;
}

export default function HotSaleBanner({ onOffersClick }: HotSaleBannerProps) {
  // Dynamic countdown timer targeting a realistic final hours deadline
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    mins: string;
    secs: string;
  }>({
    days: '02',
    hours: '14',
    mins: '38',
    secs: '50'
  });

  useEffect(() => {
    // Persist or initialize a realistic deadline (approx 2 days 14 hours ahead)
    const STORAGE_KEY = 'arc_hot_sale_deadline_v1';
    let targetTime: number;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        targetTime = parseInt(stored, 10);
        // If expired or invalid, reset to 2.5 days ahead
        if (isNaN(targetTime) || targetTime <= Date.now()) {
          targetTime = Date.now() + (2 * 24 * 60 + 14 * 60 + 39) * 60 * 1000;
          localStorage.setItem(STORAGE_KEY, targetTime.toString());
        }
      } else {
        targetTime = Date.now() + (2 * 24 * 60 + 14 * 60 + 39) * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, targetTime.toString());
      }
    } catch {
      targetTime = Date.now() + (2 * 24 * 60 + 14 * 60 + 39) * 60 * 1000;
    }

    const updateCountdown = () => {
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        // Roll over for continuous promotion
        const newTarget = Date.now() + (1 * 24 * 60 + 18 * 60) * 60 * 1000;
        try {
          localStorage.setItem(STORAGE_KEY, newTarget.toString());
        } catch {
          // ignore
        }
        setTimeLeft({ days: '01', hours: '18', mins: '00', secs: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (onOffersClick) {
      onOffersClick();
    } else {
      const offersEl = document.getElementById('offers');
      if (offersEl) {
        offersEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      role="banner"
      aria-live="polite"
      className="w-full min-h-[44px] md:h-12 z-40 relative flex items-center bg-[#EA014A] bg-gradient-to-r from-[#EA014A] via-[#E80045] to-[#D9003E] shadow-sm select-none border-y border-white/10"
    >
      <div className="text-white w-full max-w-4xl mx-auto overflow-hidden">
        <div className="flex h-full w-full mx-auto transition-transform ease-in-out">
          <div
            onClick={handleClick}
            className="w-full flex-none block cursor-pointer hover:bg-black/5 active:bg-black/10 transition-colors py-1.5 md:py-0"
          >
            <div className="flex items-center justify-between md:justify-center gap-2 sm:gap-4 md:gap-7 px-3 sm:px-6">
              {/* Promotion Title & Mobile View Offers Link */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center text-left md:contents">
                  {/* Mobile Presentation */}
                  <div className="md:hidden flex flex-col items-start leading-tight">
                    <span className="flex items-center gap-1 font-sans text-xs sm:text-sm font-bold antialiased text-white tracking-tight">
                      <Sparkles className="w-3 h-3 text-rose-100 animate-pulse shrink-0" />
                      Hot Sale Final Hours
                    </span>
                    <span className="font-sans text-[11px] sm:text-xs font-medium text-white/90 underline underline-offset-2 antialiased hover:text-white mt-0.5">
                      View offers
                    </span>
                  </div>

                  {/* Desktop Presentation */}
                  <div className="hidden md:flex items-center gap-2 text-white">
                    <span className="inline-flex items-center justify-center p-1 rounded-full bg-white/15">
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                    </span>
                    <p className="whitespace-nowrap font-sans text-base lg:text-lg font-bold antialiased tracking-tight text-white">
                      Hot Sale Final Hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="border-l border-white/35 h-7 hidden md:block"></div>

                {/* Days */}
                <div className="flex flex-col items-center justify-center -space-y-0.5 w-7 sm:w-8 md:w-9 text-center">
                  <span className="font-bold text-base sm:text-lg md:text-xl font-mono tabular-nums leading-tight text-white drop-shadow-sm">
                    {timeLeft.days}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/90 font-medium leading-none">
                    days
                  </span>
                </div>

                <div className="border-l border-white/30 h-6 sm:h-7"></div>

                {/* Hours */}
                <div className="flex flex-col items-center justify-center -space-y-0.5 w-7 sm:w-8 md:w-9 text-center">
                  <span className="font-bold text-base sm:text-lg md:text-xl font-mono tabular-nums leading-tight text-white drop-shadow-sm">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/90 font-medium leading-none">
                    hours
                  </span>
                </div>

                <div className="border-l border-white/30 h-6 sm:h-7"></div>

                {/* Mins */}
                <div className="flex flex-col items-center justify-center -space-y-0.5 w-7 sm:w-8 md:w-9 text-center">
                  <span className="font-bold text-base sm:text-lg md:text-xl font-mono tabular-nums leading-tight text-white drop-shadow-sm">
                    {timeLeft.mins}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/90 font-medium leading-none">
                    mins
                  </span>
                </div>

                <div className="border-l border-white/30 h-6 sm:h-7"></div>

                {/* Secs */}
                <div className="flex flex-col items-center justify-center -space-y-0.5 w-7 sm:w-8 md:w-9 text-center">
                  <span className="font-bold text-base sm:text-lg md:text-xl font-mono tabular-nums leading-tight text-white drop-shadow-sm">
                    {timeLeft.secs}
                  </span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-white/90 font-medium leading-none">
                    secs
                  </span>
                </div>

                <div className="border-l border-white/35 h-7 hidden md:block"></div>
              </div>

              {/* Desktop View Offers CTA */}
              <div className="hidden md:flex items-center">
                <span className="group/link inline-flex items-center gap-1.5 font-sans font-medium text-sm text-white underline underline-offset-4 hover:text-rose-100 transition-colors whitespace-nowrap cursor-pointer">
                  <span>View offers</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
