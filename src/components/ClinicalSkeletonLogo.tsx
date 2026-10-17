import React from 'react';
import { motion } from 'motion/react';

interface ClinicalSkeletonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  text?: string;
}

export default function ClinicalSkeletonLogo({
  size = 'md',
  className = '',
  showText = true,
  text = 'Loading Clinical Suite...'
}: ClinicalSkeletonLogoProps) {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-4 ${className}`}>
      {/* Luxury Outline Crest SVG with Pulse & Shimmer Animation */}
      <div className={`relative flex items-center justify-center ${dimensions}`}>
        {/* Outer glowing halo */}
        <motion.div
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 rounded-full bg-[#c5a880]/15 blur-xl pointer-events-none"
        />

        {/* Geometric Luxury Crest SVG Outline */}
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#c5a880] stroke-current fill-none"
          strokeWidth="1.5"
        >
          {/* Outer Diamond / Shield Outline */}
          <motion.path
            d="M 50,5 L 90,50 L 50,95 L 10,50 Z"
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Inner Monogram / Cross Outline */}
          <motion.path
            d="M 50,25 L 50,75 M 30,50 L 70,50"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Center Diamond Core */}
          <motion.circle
            cx="50"
            cy="50"
            r="8"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="fill-[#c5a880]/20 stroke-[#c5a880]"
          />
        </motion.svg>
      </div>

      {/* Optional Loading Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center space-y-1"
        >
          <p className="text-xs font-serif tracking-widest uppercase text-[#003334] font-semibold">
            Age Reversal Clinic
          </p>
          <p className="text-[10px] font-mono tracking-wider text-slate-400">
            {text}
          </p>
        </motion.div>
      )}
    </div>
  );
}
