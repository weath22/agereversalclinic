import { BRAND_PARTNERS } from '../data';
import { Shield, Layers, Circle, Compass, Cpu, Infinity } from 'lucide-react';
import { getClinicData, fetchRemoteClinicData, getTrustBrandsConfig } from '../lib/adminStore';
import { ClinicData } from '../data/clinicInfo';
import { useState, useEffect } from 'react';

export default function TrustBrands() {
  const [clinicData, setClinicData] = useState<ClinicData>(() => getClinicData());

  useEffect(() => {
    setClinicData(getClinicData());
    fetchRemoteClinicData().then((remote) => {
      if (remote) setClinicData(remote);
    });

    const handleUpdate = () => {
      setClinicData(getClinicData());
    };

    window.addEventListener('clinic_data_changed', handleUpdate);
    window.addEventListener('trust_brands_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('clinic_data_changed', handleUpdate);
      window.removeEventListener('trust_brands_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const fallbackConfig = getTrustBrandsConfig();
  const trustSection = clinicData.trustBrandsSection;
  const heading =
    trustSection?.heading ||
    fallbackConfig.heading ||
    'Over 1,000+ Brands & Laboratories Trust Us';
  const brands =
    Array.isArray(trustSection?.brands) && trustSection.brands.length > 0
      ? trustSection.brands
      : Array.isArray(fallbackConfig.brands) && fallbackConfig.brands.length > 0
      ? fallbackConfig.brands
      : BRAND_PARTNERS;
  const seoKeywords = Array.isArray(trustSection?.seoKeywords)
    ? trustSection.seoKeywords
    : fallbackConfig.seoKeywords || [];

  // Mapping brand icon names to clean Lucide icons for elite style
  const renderBrandIcon = (type: string) => {
    switch (type) {
      case 'circle':
        return <Circle className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
      case 'layers':
        return <Layers className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
      case 'pill':
        return <Compass className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
      case 'shield':
        return <Shield className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
      case 'instagram':
        return <Infinity className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
      default:
        return <Cpu className="w-8 h-8 text-luxury-muted group-hover:text-luxury-gold transition-colors duration-500" strokeWidth={1} />;
    }
  };

  return (
    <section
      aria-label={heading}
      data-seo-keywords={seoKeywords.join(', ')}
      className="bg-luxury-secondary border-y border-luxury-border py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-8">
        {seoKeywords.length > 0 && (
          <span className="sr-only">{seoKeywords.join(', ')}</span>
        )}
        
        {/* Banner Label */}
        <div className="text-center mb-12">
          <h2 className="text-[11px] font-sans font-normal tracking-[0.2em] text-luxury-muted uppercase">
            {heading}
          </h2>
        </div>

        {/* Partners Row */}
        <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap justify-start md:justify-center items-center gap-10 md:gap-16 lg:gap-24 transition-all duration-700 pb-4 md:pb-0 px-2 md:px-0 scrollbar-none snap-x snap-mandatory">
          {brands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center group cursor-default shrink-0 snap-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-500">
                {brand.imageUrl ? (
                  <img
                    src={brand.imageUrl}
                    alt={`${brand.name} — Trusted Clinical Partner of ${clinicData.name || 'Age Reversal Clinics'}`}
                    className="w-10 h-10 object-contain opacity-85 group-hover:opacity-100 transition-opacity duration-500"
                  />
                ) : (
                  renderBrandIcon(brand.iconType)
                )}
              </div>
              <span className="text-[10px] font-sans font-light tracking-[0.2em] uppercase text-luxury-subtext group-hover:text-luxury-text transition-colors duration-500">
                {brand.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
