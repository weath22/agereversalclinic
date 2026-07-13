import { MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

interface TopBarProps {
  onBookClick: () => void;
}

export default function TopBar({ onBookClick }: TopBarProps) {
  return (
    <div className="bg-silver-800 text-white py-2 text-xs md:text-sm transition-all">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-silver-400" />
          <span className="text-silver-200">Vaishali Nagar, Jaipur &amp; Harley Street, London</span>
        </div>
        <div className="hidden lg:block text-silver-300 font-light">
          Welcome to Age Reversal Clinic • Expert Care &amp; Advanced Solutions
        </div>
        <div className="flex items-center space-x-6">
          <a href="tel:+919876543210" className="flex items-center space-x-1.5 hover:text-rose-gold transition-colors">
            <Phone className="h-3.5 w-3.5 text-silver-400" />
            <span className="text-silver-200 font-medium">+91 98765 43210</span>
          </a>
          <div className="flex items-center space-x-3 text-silver-400">
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
              <Twitter className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
