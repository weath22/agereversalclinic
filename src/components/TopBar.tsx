import { useState, useEffect } from 'react';
import { MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { CLINIC_INFO, ClinicData } from '../data/clinicInfo';
import { getClinicData } from '../lib/adminStore';

interface TopBarProps {
  onBookClick: () => void;
}

export default function TopBar({ onBookClick }: TopBarProps) {
  const [clinicData, setClinicData] = useState<ClinicData>(getClinicData());

  useEffect(() => {
    setClinicData(getClinicData());
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setClinicData(e.detail);
      }
    };
    window.addEventListener('clinic_data_changed', handleUpdate);
    return () => window.removeEventListener('clinic_data_changed', handleUpdate);
  }, []);

  const phone = clinicData.phone || CLINIC_INFO.primaryPhone || '+44 20 8857 2000';
  const phoneHref = `tel:${phone.replace(/[^0-9+]/g, '')}`;
  const locationSummary = clinicData.locations?.map((l) => l.name).join(' & ') || CLINIC_INFO.locations?.map((l) => l.shortName).join(' & ') || 'Harley Street Flagship';
  const welcomeText = `Welcome to ${clinicData.name || 'Age Reversal Clinic'}`;

  return (
    <div className="bg-black text-white py-2 text-xs md:text-sm transition-all border-b border-luxury-gold/25">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
          <span className="text-white/90 font-light">{locationSummary}</span>
        </div>
        <div className="hidden lg:block text-luxury-gold/90 font-serif italic text-xs tracking-wider">
          {welcomeText}
        </div>
        <div className="flex items-center space-x-6">
          <a href={phoneHref} className="flex items-center space-x-1.5 text-luxury-gold hover:text-white transition-colors">
            <Phone className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
            <span className="font-medium tracking-wide">{phone}</span>
          </a>
          <div className="flex items-center space-x-3 text-luxury-gold">
            <a href={CLINIC_INFO.socialLinks?.facebook || '#'} aria-label="Facebook" className="hover:text-white hover:scale-110 transition-all">
              <Facebook className="h-3.5 w-3.5" />
            </a>
            <a href={CLINIC_INFO.socialLinks?.instagram || '#'} aria-label="Instagram" className="hover:text-white hover:scale-110 transition-all">
              <Instagram className="h-3.5 w-3.5" />
            </a>
            <a href={CLINIC_INFO.socialLinks?.twitter || '#'} aria-label="Twitter" className="hover:text-white hover:scale-110 transition-all">
              <Twitter className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
