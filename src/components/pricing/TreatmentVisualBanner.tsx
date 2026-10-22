import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

export const TreatmentVisualBanner: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD56gYgiDMXjY5hM_ovt-M8s7FPPFtBUdhB-zEtC3FUl8JHhWOAIJ31becBEb7imUW8isajBG_fc_zkfbPJEEVKwonnXglSbg2FAExjfmWOIKb0qCZdLHSRhyMiewovU2W_yVzgFh4jQ7EulCDZSCh_A2OPaPOGpOMEWI37Akoz6jEfeaSbN_VfzyW_hBRWOMvybrORwKgL8QhZWjiQUdVt8bsMTLrHvC4M9l0pdyiVjbmN4mrh160WjzSPojHNjSRWPA",
      alt: "Treatment Combination Visual 1"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6jNL9n7ZSHyEXlcJ0r0IwqQHuLDTmSB-jzqwVZyf7azj3FFcz0Yh-LxXtNgqsedic9D-vKAIEJ8EpruO6p728UYKHfqkZt5zxOn-2R2Q65Z5usN5zyJ7vlxKgX9DPuixrp_m3iJbkbiYsYbRQaPGyR-EoYGOsVI3wfksikQ8_vKmjXeHn7tQDbjCot_3KvN2lAyNI7hNPx5LXAeT6hwJ6L7iJcUzZAoy4zyo48mqEGRNwePYm13I4j0tdfAwATJQI2A",
      alt: "Treatment Combination Visual 2"
    }
  ];

  return (
    <>
      <div className="space-y-6 mt-4 sm:mt-6">
        {images.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#FAF6F0] border border-[#E6D5C3]/40 shadow-sm hover:shadow-md transition-all duration-300"
            onClick={() => {
              setSelectedImage(img.src);
              setIsZoomed(false);
            }}
          >
            <div className="relative w-full flex items-center justify-center p-2 sm:p-4">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto max-h-[500px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center rounded-2xl pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                  <Maximize2 className="w-4 h-4" /> Click to view & zoom
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-colors backdrop-blur-md flex items-center justify-center cursor-pointer"
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-full transition-colors backdrop-blur-md flex items-center justify-center cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Container */}
              <div className="overflow-auto w-full h-full flex items-center justify-center p-2">
                <img
                  src={selectedImage}
                  alt="Enlarged Treatment Visual"
                  className={`transition-all duration-300 select-none ${
                    isZoomed 
                      ? 'w-[150%] max-w-none cursor-zoom-out' 
                      : 'max-w-full max-h-[85vh] object-contain cursor-zoom-in rounded-lg shadow-2xl'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
