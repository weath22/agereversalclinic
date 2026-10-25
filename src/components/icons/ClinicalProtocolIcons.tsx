import React from 'react';

export interface ProtocolIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * 1. Face Cleansing & Epidermal Prep Icon
 * Faithfully structured after User Reference 2:
 * Woman with headband towel wrap, serene closed eyes, relaxed puckered lips,
 * gentle foam bubble cloud on right cheek, hands gently washing cheeks, and floating water droplets.
 */
export function FaceCleansingIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Head towel wrap outer dome */}
      <path d="M 27 44 C 25 24, 34 8, 50 8 C 66 8, 75 24, 73 44" strokeWidth="2.4" />
      
      {/* Fold curve inside top of towel wrap */}
      <path d="M 62 16 C 66 20, 69 25, 71 30" strokeWidth="2" />

      {/* Forehead towel band wrap */}
      <path d="M 27 42 C 34 23, 66 23, 73 42" strokeWidth="2.4" />
      
      {/* Hairline beneath towel band */}
      <path d="M 32 43 C 36 33, 44 28, 50 28 C 56 28, 64 33, 68 43" strokeWidth="1.8" />

      {/* Ears */}
      <path d="M 27 46 C 22 46, 22 57, 27 57" strokeWidth="2.2" />
      <path d="M 73 46 C 78 46, 78 57, 73 57" strokeWidth="2.2" />

      {/* Jawline & Chin */}
      <path d="M 27 51 C 29 63, 38 73, 50 73 C 62 73, 71 63, 73 51" strokeWidth="2.2" />

      {/* Eyebrows */}
      <path d="M 33 40 C 37 38, 42 38, 45 40" strokeWidth="2.4" />
      <path d="M 55 40 C 58 38, 63 38, 67 40" strokeWidth="2.4" />

      {/* Serene closed eyelids with outer lash flick */}
      <path d="M 36 47 C 39 49, 43 49, 44 47" strokeWidth="2.2" />
      <path d="M 36 47 L 34 49" strokeWidth="2" />
      <path d="M 56 47 C 57 49, 61 49, 64 47" strokeWidth="2.2" />
      <path d="M 64 47 L 66 49" strokeWidth="2" />

      {/* Nose curve */}
      <path d="M 48 54 C 49 56, 51 56, 52 54" strokeWidth="2.2" />

      {/* Puckered lips */}
      <path d="M 48 60 C 49 59, 51 59, 52 60" strokeWidth="2" />
      <path d="M 48 63 C 49 64, 51 64, 52 63" strokeWidth="2" />

      {/* Foam cloud on right cheek */}
      <path
        d="M 58 50 C 56 48, 61 47, 64 48 C 67 48, 69 51, 68 54 C 70 57, 68 61, 65 63 C 62 64, 59 63, 58 60 C 56 58, 56 55, 57 53 C 57 51, 57 50, 58 50 Z"
        strokeWidth="2"
      />

      {/* Left arm & fingers touching left cheek */}
      <path d="M 24 94 C 23 89, 27 78, 30 73 L 34 53 C 34 52, 36 52, 36 53 L 37 66" strokeWidth="2.2" />
      <path d="M 37 66 L 39 53 C 39 52, 41 52, 41 53 L 42 70" strokeWidth="2.2" />
      <path d="M 42 70 C 43 67, 46 67, 47 70 L 41 77 C 38 82, 35 88, 33 94" strokeWidth="2.2" />

      {/* Right arm & fingers touching foam bubble on right cheek */}
      <path d="M 76 94 C 77 89, 73 78, 70 73 L 66 53 C 66 52, 64 52, 64 53 L 63 66" strokeWidth="2.2" />
      <path d="M 63 66 L 61 53 C 61 52, 59 52, 59 53 L 58 70" strokeWidth="2.2" />
      <path d="M 58 70 C 57 67, 54 67, 53 70 L 59 77 C 62 82, 65 88, 67 94" strokeWidth="2.2" />

      {/* Shoulders */}
      <path d="M 24 94 C 22 89, 19 88, 18 94" strokeWidth="2.2" />
      <path d="M 76 94 C 78 89, 81 88, 82 94" strokeWidth="2.2" />

      {/* Water Droplets */}
      {/* Left Droplet */}
      <path d="M 25 60 C 23 63, 21 65, 23 68 C 25 70, 27 68, 27 65 C 27 63, 25 60, 25 60 Z" strokeWidth="2" />
      {/* Right Droplet 1 (Upper) */}
      <path d="M 81 52 C 79 54, 78 57, 80 59 C 82 61, 84 59, 84 57 C 84 55, 81 52, 81 52 Z" strokeWidth="2" />
      {/* Right Droplet 2 (Lower) */}
      <path d="M 76 60 C 74 63, 73 66, 75 69 C 78 70, 79 67, 78 64 C 77 62, 76 60, 76 60 Z" strokeWidth="2" />
    </svg>
  );
}

/**
 * 2. Sheet Face Mask & Bio-Cellular Infusion Icon
 * Faithfully structured after User Reference 3:
 * Woman with top ruffled spa bun, right ear, serene closed right eye, elegant nose & lip line,
 * holding the distinctive facial sheet mask with kidney eye cutouts, nose flap, and mouth opening.
 */
export function SheetMaskIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Spa Ruffled Hair Bun on top */}
      <path
        d="M 39 15 C 39 8, 43 3, 49 3 C 51 1, 56 1, 58 3 C 63 3, 67 7, 67 15"
        strokeWidth="2.4"
      />
      {/* Internal Bun Ruffle Highlights */}
      <path d="M 43 9 C 45 6, 49 6, 50 9" strokeWidth="1.8" />
      <path d="M 54 9 C 56 6, 60 6, 62 9" strokeWidth="1.8" />

      {/* Bun base hair band */}
      <path d="M 38 15 C 44 11, 62 11, 68 15" strokeWidth="2.2" />

      {/* Woman's Hair & Head Contour */}
      <path d="M 68 15 C 75 22, 78 32, 76 40" strokeWidth="2.4" />
      <path d="M 38 15 C 42 24, 52 27, 68 25" strokeWidth="2.2" />

      {/* Right Ear */}
      <path d="M 76 37 C 82 37, 82 48, 75 51" strokeWidth="2.2" />

      {/* Facial Profile Behind Mask */}
      {/* Right Eyebrow */}
      <path d="M 57 33 C 61 30, 67 31, 70 34" strokeWidth="2.4" />
      {/* Right Closed Eyelid with Winged Lash */}
      <path d="M 59 41 C 62 44, 67 44, 70 41" strokeWidth="2.2" />
      <path d="M 69 41 L 71 43" strokeWidth="2" />
      {/* Elegant Nose Line */}
      <path d="M 56 32 C 54 39, 54 48, 57 52 C 55 53, 52 52, 52 52" strokeWidth="2.4" />
      {/* Delicate Lips Behind Mask */}
      <path d="M 50 58 C 53 57, 57 58, 60 57" strokeWidth="2.2" />
      <path d="M 50 61 C 53 63, 57 62, 58 61" strokeWidth="2" />

      {/* Neck & Shoulder */}
      <path d="M 66 64 C 66 75, 71 84, 82 89 L 98 94" strokeWidth="2.4" />
      {/* Collarbone Notch */}
      <path d="M 50 83 C 53 85, 57 85, 60 83" strokeWidth="2" />

      {/* The Sheet Face Mask (Front Left) */}
      <path
        d="M 27 28 C 39 28, 49 39, 49 52 C 49 65, 39 75, 27 75 C 15 75, 5 65, 5 52 C 5 39, 15 28, 27 28 Z"
        strokeWidth="2.6"
      />

      {/* Left Kidney-shaped Eye Cutout */}
      <path
        d="M 12 47 C 12 43, 16 42, 19 43 C 22 42, 25 43, 25 47 C 25 50, 21 53, 18 53 C 14 53, 12 50, 12 47 Z"
        strokeWidth="2.2"
      />

      {/* Right Kidney-shaped Eye Cutout */}
      <path
        d="M 29 47 C 29 43, 33 42, 36 43 C 39 42, 42 43, 42 47 C 42 50, 38 53, 35 53 C 31 53, 29 50, 29 47 Z"
        strokeWidth="2.2"
      />

      {/* Nose Flap Cutout */}
      <path d="M 23 54 C 23 58, 28 58, 28 54" strokeWidth="2" />

      {/* Mouth Cutout */}
      <path
        d="M 17 62 C 17 59, 34 59, 34 62 C 34 68, 17 68, 17 62 Z"
        strokeWidth="2.2"
      />

      {/* Hand holding bottom-left edge of the mask */}
      <path d="M 17 66 L 8 70 C 7 71, 6 73, 8 75 L 18 70" strokeWidth="2.4" />
      {/* Curled Fingers */}
      <path d="M 8 75 L 13 80 C 14 81, 16 80, 17 78" strokeWidth="2" />
      <path d="M 5 78 L 10 83 C 11 84, 13 83, 14 81" strokeWidth="2" />
      <path d="M 3 81 L 8 86 C 9 87, 11 86, 12 84" strokeWidth="2" />
      {/* Wrist / Arm extending downwards */}
      <path d="M 8 86 C 6 90, 7 94, 8 98" strokeWidth="2.2" />
      <path d="M 16 80 C 15 88, 16 94, 18 98" strokeWidth="2.2" />
    </svg>
  );
}

/**
 * 3. Radiance, Glow & Cellular Renewal Icon
 * Faithfully structured after User Reference 1:
 * Minimalist facial silhouette with delicate hair lock, serene closed eyelids,
 * and 4-point sparkle stars blooming on the right cheek.
 */
export function RadianceGlowIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Forehead to right cheek contour */}
      <path d="M 48 19 C 55 24, 66 32, 73 47 L 73 53" strokeWidth="2.8" />
      
      {/* Forehead to left jaw contour */}
      <path d="M 48 19 C 34 25, 25 36, 25 50 C 27 68, 38 82, 50 85 C 56 81, 61 75, 64 69" strokeWidth="2.8" />

      {/* S-wave hair strand on left side */}
      <path d="M 25 48 C 20 53, 20 62, 24 67 C 25 69, 25 72, 23 74" strokeWidth="2.4" />

      {/* Arched Eyebrows */}
      <path d="M 33 38 C 37 36, 42 37, 45 40" strokeWidth="2.6" />
      <path d="M 53 40 C 56 37, 61 36, 65 38" strokeWidth="2.6" />

      {/* Serene Eyelids with delicate winged lash */}
      <path d="M 32 48 C 36 50, 42 49, 45 47" strokeWidth="2.6" />
      <path d="M 31 46 C 32 48, 34 50, 36 48" strokeWidth="2.2" />
      <path d="M 53 47 C 56 49, 62 50, 66 48" strokeWidth="2.6" />
      <path d="M 64 48 C 66 50, 67 49, 68 47" strokeWidth="2.2" />

      {/* Subtle Nose Hook */}
      <path d="M 46 60 C 48 62, 52 62, 54 60" strokeWidth="2.6" />

      {/* Full Relaxed Lips with Cupid's Bow */}
      <path d="M 44 68 C 47 66, 50 67, 52 66 C 54 67, 56 68, 56 68" strokeWidth="2.6" />
      <path d="M 44 68 C 47 72, 53 72, 56 68" strokeWidth="2.6" />
      <path d="M 46 73 C 48 75, 52 75, 54 73" strokeWidth="2.2" />

      {/* Primary 4-pointed Radiance Star on right cheek */}
      <path
        d="M 66 65 C 66 61, 68 59, 72 59 C 68 59, 66 57, 66 53 C 66 57, 64 59, 60 59 C 64 59, 66 61, 66 65 Z"
        fill="currentColor"
        strokeWidth="1.2"
      />

      {/* Top Accent Star */}
      <path
        d="M 75 56 C 75 54, 76 53, 78 53 C 76 53, 75 52, 75 50 C 75 52, 74 53, 72 53 C 74 53, 75 54, 75 56 Z"
        fill="currentColor"
        strokeWidth="1"
      />

      {/* Right Accent Star */}
      <path
        d="M 76 68 C 76 66, 77 65, 79 65 C 77 65, 76 64, 76 62 C 76 64, 75 65, 73 65 C 75 65, 76 66, 76 68 Z"
        fill="currentColor"
        strokeWidth="1"
      />

      {/* Bottom Accent Star */}
      <path
        d="M 69 77 C 69 75, 70 74, 72 74 C 70 74, 69 73, 69 71 C 69 73, 68 74, 66 74 C 68 74, 69 75, 69 77 Z"
        fill="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

/**
 * 4. Facial Mapping & Clinical Diagnostics Icon
 * Matching line-art face with precision crosshair targets and calibrated dermal measurement points.
 */
export function FacialMappingIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Face Silhouette */}
      <path d="M 48 19 C 55 24, 66 32, 73 47 L 73 53" strokeWidth="2.6" />
      <path d="M 48 19 C 34 25, 25 36, 25 50 C 27 68, 38 82, 50 85 C 58 82, 65 74, 69 64" strokeWidth="2.6" />

      {/* S-wave Hair Strand */}
      <path d="M 25 48 C 20 53, 20 62, 24 67 C 25 69, 25 72, 23 74" strokeWidth="2.2" />

      {/* Serene eyes, brows, nose, lips */}
      <path d="M 33 38 C 37 36, 42 37, 45 40" strokeWidth="2.2" />
      <path d="M 53 40 C 56 37, 61 36, 65 38" strokeWidth="2.2" />
      <path d="M 32 48 C 36 50, 42 49, 45 47" strokeWidth="2.4" />
      <path d="M 53 47 C 56 49, 62 50, 66 48" strokeWidth="2.4" />
      <path d="M 46 60 C 48 62, 52 62, 54 60" strokeWidth="2.2" />
      <path d="M 44 68 C 47 66, 53 66, 56 68" strokeWidth="2.4" />

      {/* Clinical Target Mapping Crosshairs & Calibration Dots */}
      <circle cx="67" cy="56" r="6" strokeWidth="1.8" strokeDasharray="2 2" />
      <path d="M 67 47 L 67 65" strokeWidth="1.8" />
      <path d="M 58 56 L 76 56" strokeWidth="1.8" />
      <circle cx="67" cy="56" r="1.5" fill="currentColor" />

      {/* Calibrated Dermal Measurement Grid Points */}
      <circle cx="34" cy="62" r="1.6" fill="currentColor" />
      <circle cx="40" cy="73" r="1.6" fill="currentColor" />
      <circle cx="50" cy="79" r="1.6" fill="currentColor" />
      <path d="M 34 62 L 40 73 L 50 79" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.6" />
    </svg>
  );
}

/**
 * 5. Micro-Droplet Infusion & Serum Delivery Icon
 * Matching line-art face receiving calibrated micro-droplet infusion from precision dropper.
 */
export function MicroDropletInfusionIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Face Silhouette */}
      <path d="M 48 19 C 54 23, 64 30, 70 44" strokeWidth="2.6" />
      <path d="M 48 19 C 34 25, 25 36, 25 50 C 27 68, 38 82, 50 85 C 57 82, 63 76, 66 69" strokeWidth="2.6" />

      {/* S-wave Hair Strand */}
      <path d="M 25 48 C 20 53, 20 62, 24 67 C 25 69, 25 72, 23 74" strokeWidth="2.2" />

      {/* Serene eyes, brows, nose, lips */}
      <path d="M 33 38 C 37 36, 42 37, 45 40" strokeWidth="2.2" />
      <path d="M 53 40 C 56 37, 61 36, 65 38" strokeWidth="2.2" />
      <path d="M 32 48 C 36 50, 42 49, 45 47" strokeWidth="2.4" />
      <path d="M 53 47 C 56 49, 62 50, 66 48" strokeWidth="2.4" />
      <path d="M 46 60 C 48 62, 52 62, 54 60" strokeWidth="2.2" />
      <path d="M 44 68 C 47 66, 53 66, 56 68" strokeWidth="2.4" />

      {/* Precision Pipette / Dropper on right side */}
      <path d="M 76 16 L 82 22" strokeWidth="3" />
      <path d="M 73 19 L 63 29 C 62 30, 61 33, 61 36 L 60 41 L 65 42 L 70 37 C 73 37, 76 36, 77 35 L 87 25" strokeWidth="2" />
      <path d="M 60 41 L 58 45" strokeWidth="2.2" />

      {/* Falling concentrated active micro-droplets */}
      <path d="M 58 49 C 56 52, 56 55, 58 57 C 60 57, 61 55, 60 52 C 59 50, 58 49, 58 49 Z" fill="currentColor" strokeWidth="1" />
      <path d="M 68 56 C 66 59, 66 62, 68 64 C 70 64, 71 62, 70 59 C 69 57, 68 56, 68 56 Z" strokeWidth="1.6" />
      <path d="M 65 67 C 64 69, 64 71, 65 72 C 66 72, 67 71, 66 69 C 65.5 68, 65 67, 65 67 Z" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * 6. Contour Lift & Collagen Contraction Icon
 * Matching line-art face with structural tightening & non-surgical hoisting vectors.
 */
export function ContourLiftIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Face Silhouette */}
      <path d="M 48 19 C 55 24, 66 32, 73 47 L 73 53" strokeWidth="2.6" />
      <path d="M 48 19 C 34 25, 25 36, 25 50 C 27 68, 38 82, 50 85 C 57 82, 63 76, 66 69" strokeWidth="2.6" />

      {/* S-wave Hair Strand */}
      <path d="M 25 48 C 20 53, 20 62, 24 67 C 25 69, 25 72, 23 74" strokeWidth="2.2" />

      {/* Serene eyes, brows, nose, lips */}
      <path d="M 33 38 C 37 36, 42 37, 45 40" strokeWidth="2.2" />
      <path d="M 53 40 C 56 37, 61 36, 65 38" strokeWidth="2.2" />
      <path d="M 32 48 C 36 50, 42 49, 45 47" strokeWidth="2.4" />
      <path d="M 53 47 C 56 49, 62 50, 66 48" strokeWidth="2.4" />
      <path d="M 46 60 C 48 62, 52 62, 54 60" strokeWidth="2.2" />
      <path d="M 44 68 C 47 66, 53 66, 56 68" strokeWidth="2.4" />

      {/* Elegant Lifting Vectors along jawline and cheek */}
      <path d="M 54 75 C 62 70, 72 58, 76 44" strokeWidth="2.4" strokeDasharray="3 3" />
      <path d="M 72 44 L 76 44 L 77 48" strokeWidth="2.4" />

      <path d="M 48 64 C 58 58, 68 49, 72 38" strokeWidth="2.2" strokeDasharray="2 3" />
      <path d="M 68 38 L 72 38 L 73 42" strokeWidth="2.2" />

      {/* Collagen remodeling helix cue */}
      <circle cx="76" cy="62" r="3" strokeWidth="1.6" />
      <circle cx="82" cy="52" r="2" strokeWidth="1.4" />
      <path d="M 76 62 Q 79 57 82 52" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * 7. Bio-Shielding & Moisture Sealing Icon
 * Serene face enveloped by protective dermal barrier crest.
 */
export function BioShieldSealingIcon({ className = "w-16 h-16", ...props }: ProtocolIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Face Silhouette */}
      <path d="M 48 20 C 55 24, 65 31, 71 45" strokeWidth="2.6" />
      <path d="M 48 20 C 35 25, 27 36, 27 50 C 29 67, 39 80, 50 83 C 57 80, 62 74, 65 67" strokeWidth="2.6" />

      {/* S-wave Hair Strand */}
      <path d="M 27 48 C 22 53, 22 62, 26 67 C 27 69, 27 72, 25 74" strokeWidth="2.2" />

      {/* Serene eyes, brows, nose, lips */}
      <path d="M 33 39 C 37 37, 42 38, 45 41" strokeWidth="2.2" />
      <path d="M 52 41 C 55 38, 60 37, 64 39" strokeWidth="2.2" />
      <path d="M 33 48 C 37 51, 43 50, 45 48" strokeWidth="2.4" />
      <path d="M 52 48 C 55 50, 61 51, 65 48" strokeWidth="2.4" />
      <path d="M 46 60 C 48 62, 52 62, 54 60" strokeWidth="2.2" />
      <path d="M 44 69 C 47 67, 53 67, 56 69" strokeWidth="2.4" />

      {/* Protective Bio-Barrier Shield Ring */}
      <path d="M 50 10 C 65 10, 84 15, 84 32 C 84 58, 64 78, 50 88 C 36 78, 16 58, 16 32 C 16 15, 35 10, 50 10 Z" strokeWidth="2" strokeDasharray="4 3" opacity="0.85" />
      
      {/* Sparkle seal node at top of shield */}
      <path d="M 50 6 L 51 9 L 54 10 L 51 11 L 50 14 L 49 11 L 46 10 L 49 9 Z" fill="currentColor" strokeWidth="0.8" />
    </svg>
  );
}
