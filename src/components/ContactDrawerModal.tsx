"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Send, Check, Mail, Phone } from 'lucide-react';
import { saveInquiry } from '../lib/adminStore';

export interface ContactDrawerTarget {
  id?: string;
  name: string;
  address?: string;
  hours?: string;
  phone?: string;
}

export interface ContactDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: ContactDrawerTarget | null;
  defaultSubject?: string;
  onSuccessSubmit?: (data: { name: string; email: string; phone?: string; subject: string; message: string; locationName: string }) => void;
}

export default function ContactDrawerModal({
  isOpen,
  onClose,
  location,
  defaultSubject = '',
  onSuccessSubmit
}: ContactDrawerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update subject if defaultSubject changes
  useEffect(() => {
    if (defaultSubject) {
      setFormData(prev => ({ ...prev, subject: defaultSubject }));
    }
  }, [defaultSubject]);

  // Reset submitted state when opening for a new location
  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
    }
  }, [isOpen, location?.name]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const locationName = location?.name || 'Central Clinic';
    
    // Persist to admin store
    saveInquiry({
      location: locationName,
      name: formData.name,
      email: formData.email,
      subject: formData.subject || `Inquiry for ${locationName}`,
      message: formData.phone ? `Phone: ${formData.phone}\n${formData.message}` : formData.message
    });

    if (onSuccessSubmit) {
      onSuccessSubmit({
        ...formData,
        locationName
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 250);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitted(false);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer/modal is open on mobile/desktop
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs cursor-pointer z-0"
          />

          {/* Drawer / Modal Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative z-10 w-full max-w-lg bg-luxury-card rounded-t-[28px] sm:rounded-[28px] border border-luxury-border shadow-2xl p-5 sm:p-8 h-[60vh] max-h-[60vh] sm:h-auto sm:max-h-[88vh] overflow-y-auto flex flex-col justify-between"
          >
            {/* Mobile Grab Bar */}
            <div className="w-10 h-1 bg-luxury-border rounded-full mx-auto mb-3 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-luxury-border/70 mb-3.5 sm:mb-5 shrink-0">
              <div className="pr-3 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-luxury-gold uppercase tracking-[0.2em] block mb-1">
                  Direct Clinic Inquiry
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-2xl text-luxury-text leading-tight truncate">
                  {location?.name || 'Clinic Consultation'}
                </h3>
                {location?.address && (
                  <p className="font-sans text-xs sm:text-sm text-luxury-subtext mt-1 flex items-center gap-1.5 truncate font-light">
                    <MapPin className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <span className="truncate">{location.address}</span>
                  </p>
                )}
                {location?.phone && (
                  <p className="font-sans text-xs sm:text-sm text-luxury-subtext mt-0.5 flex items-center gap-1.5 truncate font-light">
                    <Phone className="h-3.5 w-3.5 text-luxury-gold shrink-0" />
                    <a href={`tel:${location.phone.replace(/[^0-9+]/g, '')}`} className="truncate hover:text-luxury-gold transition-colors">{location.phone}</a>
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-full hover:bg-luxury-secondary text-luxury-muted hover:text-luxury-text transition-colors cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="drawer-form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="flex flex-col flex-1 justify-between overflow-y-auto no-scrollbar space-y-3"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Name & Email Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                      <div>
                        <label className="text-[11px] sm:text-xs font-semibold text-luxury-muted uppercase tracking-wider block mb-1">
                          Full Name <span className="text-luxury-gold">*</span>
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="Your Name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-luxury-border bg-luxury-secondary text-xs sm:text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all placeholder:text-luxury-muted"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] sm:text-xs font-semibold text-luxury-muted uppercase tracking-wider block mb-1">
                          Email Address <span className="text-luxury-gold">*</span>
                        </label>
                        <input 
                          type="email" 
                          required
                          placeholder="email@example.com" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-luxury-border bg-luxury-secondary text-xs sm:text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all placeholder:text-luxury-muted"
                        />
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="text-[11px] sm:text-xs font-semibold text-luxury-muted uppercase tracking-wider block mb-1">
                        Inquiry Subject
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="E.g. Treatment query, consultation timing, or pricing" 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-luxury-border bg-luxury-secondary text-xs sm:text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all placeholder:text-luxury-muted"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="text-[11px] sm:text-xs font-semibold text-luxury-muted uppercase tracking-wider block mb-1">
                        Message Details <span className="text-luxury-gold">*</span>
                      </label>
                      <textarea 
                        required
                        placeholder="Please share any clinical details, concerns, or questions..." 
                        rows={2}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-luxury-border bg-luxury-secondary text-xs sm:text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none placeholder:text-luxury-muted"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-neutral-800 text-white py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md mt-3 shrink-0 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5 text-luxury-gold" />
                    <span>{isSubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                  </button>
                </motion.form>
              ) : (
                /* Success State */
                <motion.div 
                  key="drawer-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-50/80 border border-emerald-200/80 p-5 sm:p-7 rounded-2xl text-center flex flex-col flex-1 justify-center items-center my-auto"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-xs">
                    <Check className="h-6 w-6 stroke-[2.5]" />
                  </div>
                  <h4 className="font-serif font-bold text-emerald-950 text-base sm:text-lg">
                    Inquiry Received
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800/90 mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
                    Thank you, <strong className="font-semibold">{formData.name}</strong>. Your message for <strong className="font-semibold">{location?.name || 'our clinic'}</strong> has been sent to our desk. We will respond within 24 hours.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-5">
                    <button 
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 text-xs font-semibold text-emerald-900 hover:underline cursor-pointer"
                    >
                      Send another message
                    </button>
                    <button 
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
