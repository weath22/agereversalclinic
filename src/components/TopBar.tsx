import { MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

interface TopBarProps {
  onBookClick: () => void;
}

export default function TopBar({ onBookClick }: TopBarProps) {
  return (
    <div className="bg-black text-white py-2 text-xs md:text-sm transition-all border-b border-luxury-gold/25">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
          <span className="text-white/90 font-light">Grove Park, London &amp; Harley Street Flagship</span>
        </div>
        <div className="hidden lg:block text-luxury-gold/90 font-serif italic text-xs tracking-wider">
          Welcome to Age Reversal Clinic
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:+442088572000" className="flex items-center space-x-1.5 text-luxury-gold hover:text-white transition-colors">
            <Phone className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
            <span className="font-medium tracking-wide">+44 20 8857 2000</span>
          </a>
          <div className="flex items-center space-x-3 text-luxury-gold">
            <a href="#" aria-label="Facebook" className="hover:text-white hover:scale-110 transition-all">
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white hover:scale-110 transition-all">
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white hover:scale-110 transition-all">
              <Twitter className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
