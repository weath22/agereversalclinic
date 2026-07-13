import { BRAND_PARTNERS } from '../data';
import { Shield, Layers, Circle, Compass, Cpu, Infinity } from 'lucide-react';
import { getTrustBrandsConfig } from '../lib/adminStore';
import { useState, useEffect } from 'react';

export default function TrustBrands() {
  const [config, setConfig] = useState(getTrustBrandsConfig());

  useEffect(() => {
    setConfig(getTrustBrandsConfig());
  }, []);

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
    <section className="bg-luxury-secondary border-y border-luxury-border py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Banner Label */}
        <div className="text-center mb-12">
          <h2 className="text-[11px] font-sans font-normal tracking-[0.2em] text-luxury-muted uppercase">
            Over 1,000+ Brands &amp; Laboratories Trust Us
          </h2>
        </div>

        {/* Partners Row */}
        <div className="flex overflow-x-auto md:overflow-x-visible md:flex-wrap justify-start md:justify-center items-center gap-10 md:gap-16 lg:gap-24 transition-all duration-700 pb-4 md:pb-0 px-2 md:px-0 scrollbar-none snap-x snap-mandatory">
          {config.brands.map((brand) => (
            <div key={brand.id} className="flex flex-col items-center group cursor-default shrink-0 snap-center">
              <div className="w-12 h-12 mb-3 flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-500">
                {renderBrandIcon(brand.iconType)}
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
