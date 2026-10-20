import React, { useId } from 'react';
import { motion } from 'motion/react';

export type LogoSkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type LogoSkeletonVariant = 'gold' | 'silver' | 'noir' | 'light';

export interface LogoOutlineSkeletonProps {
  /**
   * Predefined sizing preset or full container width/height
   * Default: 'md'
   */
  size?: LogoSkeletonSize | number;
  /**
   * Additional custom CSS classes for the outer container
   */
  className?: string;
  /**
   * Enable subtle luxury stroke pulse and gradient shimmer
   * Default: true
   */
  animate?: boolean;
  /**
   * Color palette preset
   * Default: 'gold'
   */
  variant?: LogoSkeletonVariant;
  /**
   * Optional subtle clinic wordmark beneath the emblem
   * Default: false
   */
  showText?: boolean;
  /**
   * Optional custom secondary status or procedure text
   */
  text?: string;
  /**
   * Accessible ARIA label
   */
  label?: string;
}

const SIZE_MAP: Record<LogoSkeletonSize, { box: string; stroke: number }> = {
  xs: { box: 'w-8 h-8', stroke: 1.2 },
  sm: { box: 'w-12 h-12', stroke: 1.25 },
  md: { box: 'w-20 h-20', stroke: 1.5 },
  lg: { box: 'w-32 h-32', stroke: 1.75 },
  xl: { box: 'w-44 h-44', stroke: 2 },
  full: { box: 'w-full h-full', stroke: 1.5 },
};

const VARIANT_CONFIG: Record<
  LogoSkeletonVariant,
  {
    strokeStart: string;
    strokeMid: string;
    strokeEnd: string;
    haloBg: string;
    ambientBg: string;
    textColor: string;
    subtextColor: string;
  }
> = {
  gold: {
    strokeStart: '#C5A880',
    strokeMid: '#F5E6D3',
    strokeEnd: '#9B7B52',
    haloBg: 'bg-[#C5A880]/10',
    ambientBg: 'bg-[#C5A880]/5',
    textColor: 'text-[#003334]',
    subtextColor: 'text-stone-400',
  },
  silver: {
    strokeStart: '#94A3B8',
    strokeMid: '#F1F5F9',
    strokeEnd: '#64748B',
    haloBg: 'bg-slate-300/15',
    ambientBg: 'bg-slate-100/40',
    textColor: 'text-slate-800',
    subtextColor: 'text-slate-400',
  },
  noir: {
    strokeStart: '#D8C2A3',
    strokeMid: '#FFFFFF',
    strokeEnd: '#8C7355',
    haloBg: 'bg-[#D8C2A3]/15',
    ambientBg: 'bg-[#121820]/60',
    textColor: 'text-white',
    subtextColor: 'text-stone-300',
  },
  light: {
    strokeStart: '#003334',
    strokeMid: '#C5A880',
    strokeEnd: '#003334',
    haloBg: 'bg-[#003334]/5',
    ambientBg: 'bg-stone-50/70',
    textColor: 'text-[#003334]',
    subtextColor: 'text-stone-500',
  },
};

/**
 * Task 3.1: Standalone Clean Outline Logo Preloader Component
 * Architectural/geometric line-art vector outline of the clinic emblem.
 * Uses thin luxury stroke styling with a subtle opacity pulse & gold gradient shimmer,
 * completely avoiding heavy solid fills.
 */
export const LogoOutlineSkeleton: React.FC<LogoOutlineSkeletonProps> = ({
  size = 'md',
  className = '',
  animate = true,
  variant = 'gold',
  showText = false,
  text,
  label = 'Age Reversal Clinic Emblem Skeleton',
}) => {
  const gradientId = useId();
  const shimmerId = useId();

  const variantStyles = VARIANT_CONFIG[variant] || VARIANT_CONFIG.gold;
  const isCustomNumeric = typeof size === 'number';
  const sizeConfig = !isCustomNumeric ? SIZE_MAP[size] || SIZE_MAP.md : { box: '', stroke: 1.5 };
  const customInlineStyle = isCustomNumeric ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      role="status"
      aria-label={label}
      className={`relative flex flex-col items-center justify-center p-3 select-none pointer-events-none ${className}`}
    >
      <div
        className={`relative flex items-center justify-center ${sizeConfig.box}`}
        style={customInlineStyle}
      >
        {/* Soft Radial Ambient Aura */}
        {animate && (
          <motion.div
            animate={{
              scale: [0.95, 1.08, 0.95],
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute inset-0 rounded-full ${variantStyles.haloBg} blur-xl pointer-events-none`}
          />
        )}

        {/* Refined Geometric Vector Emblem */}
        <motion.svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
          animate={
            animate
              ? {
                  opacity: [0.65, 1, 0.65],
                }
              : undefined
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <defs>
            {/* Primary Luxury Metallic Shimmer Linear Gradient */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={variantStyles.strokeStart} />
              <stop offset="50%" stopColor={variantStyles.strokeMid} />
              <stop offset="100%" stopColor={variantStyles.strokeEnd} />
            </linearGradient>

            {/* Sweep Shimmer Gradient Mask */}
            {animate && (
              <linearGradient id={shimmerId} x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="50%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0.4" />
              </linearGradient>
            )}
          </defs>

          {/* Group with thin luxury stroke parameters */}
          <g
            stroke={`url(#${gradientId})`}
            strokeWidth={sizeConfig.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 1. Outer Faceted Architectural Diamond / Crest */}
            <path
              d="M 50 6 L 92 50 L 50 94 L 8 50 Z"
              strokeDasharray="400"
              strokeDashoffset="0"
            />

            {/* 2. Inner Concentric Geometric Diamond (Fine Hairline Offset) */}
            <path
              d="M 50 16 L 82 50 L 50 84 L 18 50 Z"
              opacity="0.5"
              strokeWidth={Math.max(1, sizeConfig.stroke * 0.75)}
            />

            {/* 3. Aesthetic Botanical / Cellular Petal Arcs (Rejuvenation Cross) */}
            {/* Vertical Petal Arc */}
            <path
              d="M 50 20 C 60 36 60 64 50 80 C 40 64 40 36 50 20 Z"
              opacity="0.75"
            />
            {/* Horizontal Petal Arc */}
            <path
              d="M 20 50 C 36 60 64 60 80 50 C 64 40 36 40 20 50 Z"
              opacity="0.75"
            />

            {/* 4. Cardinal Axial Precision Lines (Micro Precision Hairlines) */}
            <line x1="50" y1="8" x2="50" y2="22" opacity="0.6" />
            <line x1="50" y1="78" x2="50" y2="92" opacity="0.6" />
            <line x1="10" y1="50" x2="22" y2="50" opacity="0.6" />
            <line x1="78" y1="50" x2="90" y2="50" opacity="0.6" />

            {/* 5. Center Brilliant Diamond Core */}
            <polygon
              points="50,42 58,50 50,58 42,50"
              opacity="0.9"
              fill={variantStyles.strokeMid}
              fillOpacity="0.08"
            />

            {/* 6. Central Seed / Micro Focal Apex */}
            <circle
              cx="50"
              cy="50"
              r="2"
              fill={`url(#${gradientId})`}
            />
          </g>
        </motion.svg>
      </div>

      {/* Optional Minimalist Brand Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={animate ? { opacity: [0.55, 0.9, 0.55] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center mt-3 space-y-0.5"
        >
          <p
            className={`text-[11px] font-serif tracking-[0.25em] uppercase font-medium ${variantStyles.textColor}`}
          >
            Age Reversal
          </p>
          {text && (
            <p className={`text-[9px] font-sans tracking-wider ${variantStyles.subtextColor}`}>
              {text}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LogoOutlineSkeleton;
