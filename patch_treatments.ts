import fs from 'fs';

let content = fs.readFileSync('src/components/Treatments.tsx', 'utf8');

const regex = /<div className="w-full lg:w-7\/12 relative">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/section>)/;

const replacement = `<div className="w-full lg:w-7/12 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 relative w-full">
              {/* Image 1 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-7 group relative overflow-hidden aspect-[4/3] border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Radiance Protocol" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[0]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">DERMAL CARE</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Radiance Protocol</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Radiance Protocol
                </div>
              </motion.div>

              {/* Image 2 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-5 group relative overflow-hidden aspect-square md:aspect-auto border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Volume Definition" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[1]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">FACIAL SCULPTING</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Volume Definition</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Precision Sculpting
                </div>
              </motion.div>

              {/* Image 3 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-5 group relative overflow-hidden aspect-[4/3] md:aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Symmetry Mastered" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[2]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">BROW ARCHITECTURE</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Symmetry Mastered</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Brow Restoration
                </div>
              </motion.div>

              {/* Image 4 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-7 group relative overflow-hidden aspect-[16/9] md:aspect-auto border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Anatomical Precision" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[3]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">BODY CONTOURING</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Anatomical Precision</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Contour Refining
                </div>
              </motion.div>

              {/* Image 5 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-6 group relative overflow-hidden aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Lash Extension Art" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[4]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">OCULAR BEAUTY</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Lash Extension Art</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Lash Enhancement
                </div>
              </motion.div>

              {/* Image 6 */}
              <motion.div 
                whileHover={{ scale: 1.01, y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="md:col-span-6 group relative overflow-hidden aspect-square border border-luxury-border rounded-2xl cursor-pointer"
              >
                <img 
                  alt="Advanced Portrait" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={TREATMENT_IMAGES[5]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-luxury-gold mb-2">CLINICAL FACIAL</span>
                  <h3 className="font-serif text-xl md:text-2xl font-light text-white">Advanced Aesthetics</h3>
                </div>
                <div className="absolute bottom-6 left-6 font-sans text-[10px] tracking-[0.15em] uppercase text-white/70 group-hover:opacity-0 transition-opacity">
                  Portrait Art
                </div>
              </motion.div>
            </div>
          </div>`;

if (content.match(regex)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/Treatments.tsx', content);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find match to replace!");
}
