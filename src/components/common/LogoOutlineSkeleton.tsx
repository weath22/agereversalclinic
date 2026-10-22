import React from 'react';
import { motion } from 'motion/react';
import { getHeaderConfig } from '../../lib/adminStore';

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
   * Enable subtle luxury pulse animation
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

const DEFAULT_BRAND_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDesjN_a9T_c5ApVXtUbu_ZXToYSdPJkIyWoDOPkSuBoQRUyOhQp9l6Db9Wj4GBiuknLiRRmpxvA8iVUDtgyK1RWmkj17T-q0e-wv--cxohuK0XmXvrJN6DnkzK2gFmAprNxac_5EvIby0Pz6lyQGXQN8mXvvvWzRMdLtFeNDOnDO771chO4DAAYKRhLj_xguQkL4cWu1mf8hIz8RmRWNBhRLYOnOER31n5Ivd-7gbMKNxOExOBolE15qJO37x9C8cAZLSbx_RCy48Q';

const SIZE_MAP: Record<LogoSkeletonSize, { box: string }> = {
  xs: { box: 'w-8 h-8' },
  sm: { box: 'w-12 h-12' },
  md: { box: 'w-16 h-16 sm:w-20 sm:h-20' },
  lg: { box: 'w-16 h-16 sm:w-32 sm:h-32' },
  xl: { box: 'w-28 h-28 sm:w-44 sm:h-44' },
  full: { box: 'w-full h-full' },
};

const VARIANT_CONFIG: Record<
  LogoSkeletonVariant,
  {
    haloBg: string;
    textColor: string;
    subtextColor: string;
  }
> = {
  gold: {
    haloBg: 'bg-[#C5A880]/15',
    textColor: 'text-[#D8C2A3]',
    subtextColor: 'text-stone-400',
  },
  silver: {
    haloBg: 'bg-slate-300/15',
    textColor: 'text-slate-300',
    subtextColor: 'text-slate-400',
  },
  noir: {
    haloBg: 'bg-[#D8C2A3]/15',
    textColor: 'text-white',
    subtextColor: 'text-stone-300',
  },
  light: {
    haloBg: 'bg-[#003334]/10',
    textColor: 'text-[#003334]',
    subtextColor: 'text-stone-500',
  },
};

/**
 * Brand Real Logo Placeholder & Preloader Component
 * Displays the authentic Age Reversal Clinic brand logo instead of an outlined SVG.
 */
export const LogoOutlineSkeleton: React.FC<LogoOutlineSkeletonProps> = ({
  size = 'md',
  className = '',
  animate = true,
  variant = 'gold',
  showText = false,
  text,
  label = 'Age Reversal Clinic Brand Logo',
}) => {
  const headerConfig = getHeaderConfig();
  const brandLogoUrl = headerConfig?.logoUrl || DEFAULT_BRAND_LOGO_URL;

  const variantStyles = VARIANT_CONFIG[variant] || VARIANT_CONFIG.gold;
  const isCustomNumeric = typeof size === 'number';
  const sizeConfig = !isCustomNumeric ? SIZE_MAP[size] || SIZE_MAP.md : { box: '' };
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

        {/* Real Clinic Brand Logo */}
        <motion.img
          src={brandLogoUrl}
          alt={label}
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain drop-shadow-[0_2px_12px_rgba(216,194,163,0.22)]"
          animate={
            animate
              ? {
                  opacity: [0.65, 1, 0.65],
                  scale: [0.98, 1.02, 0.98],
                }
              : undefined
          }
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Optional Minimalist Brand Text */}
      {showText && (
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={animate ? { opacity: [0.55, 0.9, 0.55] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-center mt-1.5 sm:mt-3 space-y-0.5"
        >
          <p
            className={`text-[9px] sm:text-[11px] font-serif tracking-[0.18em] sm:tracking-[0.25em] uppercase font-medium ${variantStyles.textColor}`}
          >
            Age Reversal Clinics
          </p>
          {text && (
            <p className={`text-[8px] sm:text-[9px] font-sans tracking-wider ${variantStyles.subtextColor}`}>
              {text}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LogoOutlineSkeleton;
