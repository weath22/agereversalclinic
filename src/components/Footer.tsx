import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Clock,
  Mail,
  X,
  Accessibility,
  CheckCircle2,
} from "lucide-react";
import { getFooterConfig } from "../lib/adminStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Footer() {
  const [config, setConfig] = useState(getFooterConfig());
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  useEffect(() => {
    setConfig(getFooterConfig());
  }, []);

  const currentYear = new Date().getFullYear();

  const defaultLinks = [
    { name: "Services", href: "#services" },
    { name: "Treatments", href: "#treatments" },
    { name: "Before & Afters", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Skincare Essentials", href: "#essentials" },
    { name: "Book Appointment", href: "#contact" },
    { name: "Staff Portal", href: "#admin" },
  ];

  const rawLinks = config?.links?.length > 0 ? config.links : defaultLinks;
  const footerLinks = rawLinks.filter(
    (link) => link.name.toLowerCase() !== "home" && link.href !== "#home"
  );

  return (
    <footer className="bg-luxury-primary py-16 md:py-24 border-t border-luxury-border text-luxury-text">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Main Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-start gap-12 mb-16 md:mb-20">
          {/* Address info block */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-sans font-normal text-luxury-muted uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 text-luxury-gold" strokeWidth={1.5} />
              <span>Headquarters</span>
            </h4>
            <p className="text-[11px] sm:text-xs font-sans font-light tracking-[0.1em] uppercase leading-relaxed text-luxury-subtext">
              LONDON COSMETIC CLINIC KNIGHTSBRIDGE,
              <br />
              2ND FLOOR, 4 HARLEY STREET, LONDON, W1G 9PB
            </p>
            <div className="mt-5 text-[11px] text-luxury-muted font-light">
              In partnership with Jaipur Medical Chambers
            </div>
          </div>

          {/* Logo brand centerpiece */}
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <img
                alt="Clinic Emblem"
                className="h-16 w-auto mb-4 mx-auto transition-transform hover:scale-105 duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjxq3WzjVonyYRXNXzK5c475rxgNujUJ0Cm9YnyMOaDn-cHHquCFSlgH51zEgGkVPBsUpIyK718k700FLjwoLlBP3LkU7j_c00e92k6nFndooqDaIr1Pr2xUHXnRpgbPjpIbQSLFhkE5dED9HuHvYEKB-plLBBj9pajUERxdBPCkT2TBLr8H_-ge7BRzNzPL6t4Pt06Rq9QLBy1bWAA1Dp6eDlqqEEPLDmxHYzNuCzpZVkp_JYmjp4xLxt5i0S4ge7kG8fwjWUL80z"
              />
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-light text-luxury-muted">
                  THE LONDON
                </span>
                <span className="text-2xl font-serif font-light tracking-[0.15em] uppercase text-luxury-text mt-1">
                  COSMETIC CLINIC
                </span>
              </div>
            </div>

            {/* Social media connections */}
            <div className="mt-4 flex flex-col items-center">
              <span className="text-[10px] font-sans font-light tracking-[0.2em] uppercase mb-4 text-luxury-muted">
                FOLLOW OUR JOURNEY
              </span>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-luxury-subtext hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="text-luxury-subtext hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="text-luxury-subtext hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="text-luxury-subtext hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Youtube"
                >
                  <Youtube className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <h4 className="text-[11px] font-sans font-normal text-luxury-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-luxury-gold" strokeWidth={1.5} />
              <span>Contact Desk</span>
            </h4>
            <p className="text-lg md:text-xl font-sans font-light text-luxury-text mb-2 tracking-wide">
              {config.phone}
            </p>
            <p className="text-[11px] font-sans font-light tracking-[0.1em] uppercase text-luxury-subtext flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-luxury-muted" strokeWidth={1.5} />
              <span>{config.hours}</span>
            </p>
            <p className="text-xs font-sans font-light text-luxury-subtext mt-4 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-luxury-muted" strokeWidth={1.5} />
              <span>{config.email}</span>
            </p>
          </div>
        </div>

        {/* Newsletter Subscription Block (Rendered directly without container, below contact items) */}
        <div className="border-t border-luxury-border/60 pt-14 pb-4 mb-14 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-luxury-text mb-3 tracking-tight">Stay Informed</h3>
          <p className="text-sm text-luxury-subtext mb-8 font-light max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter for latest treatments and exclusive insights.
          </p>
          <form className="max-w-3xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 md:flex md:flex-row gap-3 sm:gap-4 items-center justify-center">
              {/* First Name - Left on mobile */}
              <input 
                type="text" 
                placeholder="First Name" 
                required
                className="w-full col-span-1 md:w-44 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
              />
              {/* Last Name - By the side on mobile */}
              <input 
                type="text" 
                placeholder="Last Name" 
                required
                className="w-full col-span-1 md:w-44 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
              />
              {/* Email Address - Below first/last name on mobile */}
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                className="w-full col-span-2 md:w-72 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
              />
              {/* Subscribe - Below email on mobile */}
              <button 
                type="submit" 
                className="w-full col-span-2 md:w-auto bg-black text-white px-8 py-3.5 rounded-full text-[11px] font-sans font-normal uppercase tracking-[0.2em] hover:bg-luxury-secondary hover:text-luxury-text border border-transparent hover:border-luxury-border transition-all whitespace-nowrap cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Footnotes copyright & links */}
        <div className="border-t border-luxury-border pt-12 text-center">
          <p className="text-[10px] md:text-[11px] font-sans font-light tracking-[0.1em] uppercase text-luxury-subtext mb-2 leading-relaxed">
            COPYRIGHT &copy; {currentYear} THE LONDON COSMETIC CLINIC. ALL
            RIGHTS RESERVED. <br className="sm:hidden" />
            IN PARTNERSHIP WITH{" "}
            <a
              className="text-luxury-text hover:text-luxury-gold transition-colors duration-300"
              href="#"
            >
              LONDON KELOID SCAR CLINIC
            </a>
          </p>

          <p className="text-[10px] text-luxury-muted mb-10 font-sans font-light">
            Powered by DAB: Ecommerce Boutique Website Design &amp; Development
          </p>

          {/* Footnotes navigation site-map links */}
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[10px] font-sans font-normal tracking-[0.15em] uppercase text-luxury-text mb-12">
            {footerLinks.map((link, i) => (
              <span key={i} className="flex items-center gap-6">
                <a
                  className="hover:text-luxury-gold transition-colors duration-300"
                  href={link.href}
                >
                  {link.name}
                </a>
                {i !== footerLinks.length - 1 && (
                  <span className="text-luxury-border font-light">|</span>
                )}
              </span>
            ))}
          </nav>

          {/* Accessibility Statement Trigger - Details hidden by default */}
          <div className="border-t border-luxury-border/50 pt-8 flex justify-center items-center">
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="inline-flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-luxury-muted hover:text-luxury-text transition-colors duration-300 font-sans cursor-pointer group py-1 px-3 rounded-full hover:bg-luxury-secondary/50"
              aria-label="Open Accessibility Statement"
            >
              <Accessibility className="w-3.5 h-3.5 text-luxury-gold group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="underline underline-offset-4 decoration-luxury-border group-hover:decoration-luxury-gold">Accessibility Statement</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Upward Accessibility Modal Sheet */}
      <AnimatePresence>
        {isAccessibilityOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsAccessibilityOpen(false)}
            />

            {/* Upward Floating Modal Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-luxury-border overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-3 pb-1 border-b border-luxury-border bg-luxury-primary/50">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-luxury-text">
                      Accessibility Statement
                    </h3>
                    <p className="text-[10px] tracking-wider uppercase text-luxury-muted font-sans font-light">
                      The London Cosmetic Clinic
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAccessibilityOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-luxury-muted hover:text-luxury-text hover:bg-luxury-secondary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Details */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans font-light text-luxury-subtext leading-relaxed">
                <p>
                  Let your rejuvenation journey begin at our private boutique clinical healthcare clinics based in Jaipur and Harley Street, London. We provide customized, medically certified treatments supporting long-term structural anti-aging and total skin wellness.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-luxury-border/50">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-luxury-text">Wheelchair Access:</strong> All consulting suites and treatment chambers are fully wheelchair accessible with wide doorways and level thresholds.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-luxury-text">Elevator & Step-Free Access:</strong> Our Harley Street and Jaipur chambers feature step-free entrance ramps and dedicated patient lifts.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-luxury-text">Personal Assistance:</strong> Dedicated clinic concierge staff are available to assist with mobility, transport drop-offs, and customized appointment accommodations.</span>
                  </div>
                </div>

                <div className="bg-luxury-primary p-3.5 rounded-xl border border-luxury-border/60 text-[11px] text-luxury-muted mt-3">
                  If you require any specific assistance or have special requirements prior to your visit, please contact our desk at <strong className="text-luxury-text font-medium">{config.phone}</strong> or email <strong className="text-luxury-text font-medium">{config.email}</strong>.
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-luxury-border bg-luxury-primary/30 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAccessibilityOpen(false)}
                  className="px-6 py-2.5 bg-black text-white text-[11px] font-sans font-normal uppercase tracking-[0.18em] rounded-full hover:bg-luxury-text transition-colors cursor-pointer w-full sm:w-auto text-center"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
