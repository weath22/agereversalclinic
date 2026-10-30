import { useState, useEffect, useMemo } from 'react';
import { FACILITIES } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { FacilityRoom } from '../types';
import { getClinicData, fetchRemoteClinicData } from '../lib/adminStore';
import { ClinicData } from '../data/clinicInfo';
import { ClinicImageWithPlaceholder } from './common/ClinicImageWithPlaceholder';
import { getClinicSlotId } from '../utils/clinicImageHelper';

export default function FacilityInteriors() {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [clinicData, setClinicData] = useState<ClinicData>(() => getClinicData());

  useEffect(() => {
    setClinicData(getClinicData());
    fetchRemoteClinicData().then((remote) => {
      if (remote) setClinicData(remote);
    });

    const handleClinicDataChanged = (e: Event) => {
      const customEvt = e as CustomEvent<ClinicData>;
      setClinicData(customEvt.detail || getClinicData());
    };

    window.addEventListener('clinic_data_changed', handleClinicDataChanged);
    window.addEventListener('facility_interiors_updated', handleClinicDataChanged);
    window.addEventListener('storage', handleClinicDataChanged);
    return () => {
      window.removeEventListener('clinic_data_changed', handleClinicDataChanged);
      window.removeEventListener('facility_interiors_updated', handleClinicDataChanged);
      window.removeEventListener('storage', handleClinicDataChanged);
    };
  }, []);

  const galleryEyebrow = clinicData.facilityGallery?.eyebrow || 'Our Facility';
  const galleryHeading = clinicData.facilityGallery?.heading || 'Clinic Gallery';
  const galleryKeywords = Array.isArray(clinicData.facilityGallery?.seoKeywords)
    ? clinicData.facilityGallery.seoKeywords
    : [];

  const facilityItems: FacilityRoom[] = useMemo(() => {
    const configuredRooms = clinicData.facilityGallery?.rooms;
    if (Array.isArray(configuredRooms) && configuredRooms.length > 0) {
      return configuredRooms.map((room, idx) => ({
        id: room.id || `facility-room-${idx + 1}`,
        title: room.title || `Clinic Suite ${idx + 1}`,
        tag: room.tag || 'CLINIC SUITE',
        image: room.image,
        imageAlt: room.imageAlt || `${room.title} at ${clinicData.name || 'Age Reversal Clinics'}`,
      }));
    }

    const interiorPhotos = Array.isArray(clinicData.interiorPhotos)
      ? clinicData.interiorPhotos.map((u) => u?.trim()).filter(Boolean)
      : [];
    const exteriorPhoto = clinicData.exteriorPhoto?.trim() || '';

    const merged: FacilityRoom[] = FACILITIES.map((item, idx) => {
      const customInteriorImg = interiorPhotos[idx];
      if (customInteriorImg) {
        return { ...item, image: customInteriorImg };
      }
      if (idx === FACILITIES.length - 1 && exteriorPhoto) {
        return { ...item, image: exteriorPhoto };
      }
      return item;
    });

    // If additional interiorPhotos were added beyond FACILITIES.length, include them in the gallery
    if (interiorPhotos.length > FACILITIES.length) {
      for (let i = FACILITIES.length; i < interiorPhotos.length; i++) {
        merged.push({
          id: `facility-interior-${i + 1}`,
          title: `${clinicData.name || 'Clinic'} Suite ${i + 1}`,
          tag: 'CLINIC INTERIOR',
          image: interiorPhotos[i],
        });
      }
    }

    return merged;
  }, [clinicData]);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
  };

  const closeLightbox = () => {
    setActiveLightboxIndex(null);
  };

  const showNext = () => {
    if (activeLightboxIndex === null || facilityItems.length === 0) return;
    setActiveLightboxIndex((activeLightboxIndex + 1) % facilityItems.length);
  };

  const showPrev = () => {
    if (activeLightboxIndex === null || facilityItems.length === 0) return;
    setActiveLightboxIndex((activeLightboxIndex - 1 + facilityItems.length) % facilityItems.length);
  };

  return (
    <section 
      id="facility" 
      aria-label={`${galleryEyebrow} - ${galleryHeading}`}
      data-seo-keywords={galleryKeywords.join(', ')}
      className="py-16 md:py-24 relative overflow-hidden border-t border-silver-200 bg-cover bg-center bg-no-repeat bg-[url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1920')]"
    >
      {/* Luxurious overlay to keep text and gallery items beautifully legible while letting London's classic architecture shine through clearly */}
      <div className="absolute inset-0 bg-white/45" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {galleryKeywords.length > 0 && (
          <span className="sr-only">{galleryKeywords.join(', ')}</span>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#003334] uppercase tracking-[0.25em] block mb-3">
            {galleryEyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-silver-900 mb-4">
            {galleryHeading}
          </h2>
          <div className="w-16 h-0.5 bg-rose-gold mx-auto" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facilityItems.map((facility, index) => (
            <motion.div 
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col group cursor-pointer bg-white/75 hover:bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 hover:shadow-lg transition-all duration-300 shadow-sm"
              onClick={() => openLightbox(index)}
            >
              {/* Image Box */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-silver-100 border border-silver-200/50 relative">
                <ClinicImageWithPlaceholder 
                  src={facility.image}
                  slotId={getClinicSlotId('facility', facility.id || index + 1)}
                  alt={facility.imageAlt || facility.title} 
                  logoSize="md"
                  showBrandText={true}
                  containerClassName="w-full h-full relative overflow-hidden bg-silver-100 flex items-center justify-center"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                >
                  {/* Interactive Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-silver-900 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Eye className="h-5 w-5" />
                    </span>
                  </div>
                </ClinicImageWithPlaceholder>
              </div>

              {/* Text Meta */}
              <div className="flex justify-between items-start mt-1 px-1">
                <div>
                  <h3 className="text-base font-bold text-silver-900 group-hover:text-black transition-colors leading-snug">
                    {facility.title}
                  </h3>
                  <span className="text-[10px] text-silver-500 font-bold uppercase tracking-wider block mt-1">
                    {facility.tag}
                  </span>
                </div>
                <span className="text-silver-400 group-hover:text-rose-gold transition-colors duration-300 pt-0.5">
                  <ArrowUpRight className="h-4.5 w-4.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Lightbox Overlay */}
        <AnimatePresence>
          {activeLightboxIndex !== null && facilityItems[activeLightboxIndex] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
              
              {/* Close Button */}
              <button 
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20"
                aria-label="Close Lightbox"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Left Selector */}
              <button 
                onClick={showPrev}
                className="absolute left-4 md:left-8 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20"
                aria-label="Previous Image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Main Image View */}
              <motion.div 
                key={activeLightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl w-full flex flex-col items-center relative z-10"
              >
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2 max-h-[75vh] flex items-center justify-center">
                  <ClinicImageWithPlaceholder 
                    alt={facilityItems[activeLightboxIndex].imageAlt || facilityItems[activeLightboxIndex].title}
                    className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
                    src={facilityItems[activeLightboxIndex].image}
                    slotId={getClinicSlotId('facility', facilityItems[activeLightboxIndex].id || activeLightboxIndex + 1)}
                    logoSize="xl"
                    showBrandText={true}
                    containerClassName="flex items-center justify-center min-w-[280px] min-h-[280px] bg-transparent"
                  />
                </div>
                
                {/* Meta details below image */}
                <div className="text-center mt-6 text-white">
                  <span className="text-xs uppercase tracking-[0.2em] text-rose-gold font-bold block mb-1">
                    {facilityItems[activeLightboxIndex].tag}
                  </span>
                  <h4 className="text-2xl font-serif font-bold">
                    {facilityItems[activeLightboxIndex].title}
                  </h4>
                  <p className="text-xs text-silver-400 mt-2">
                    {activeLightboxIndex + 1} / {facilityItems.length}
                  </p>
                </div>
              </motion.div>

              {/* Right Selector */}
              <button 
                onClick={showNext}
                className="absolute right-4 md:right-8 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-20"
                aria-label="Next Image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
