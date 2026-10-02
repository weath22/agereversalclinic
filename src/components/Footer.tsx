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
  ChevronUp,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <footer className="bg-gradient-to-b from-[#0e0e12] via-[#0a0a0d] to-[#070709] py-16 md:py-24 border-t border-[#D8C2A3]/30 text-white relative overflow-hidden">
      {/* Top subtle champagne gold ambient illumination */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-[#D8C2A3]/12 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Main Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-start gap-12 mb-16 md:mb-20">
          {/* Address info block */}
          <div className="text-center md:text-left">
            <h4 className="text-[11px] font-sans font-medium text-[#D8C2A3] uppercase tracking-[0.2em] mb-4 flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-4 w-4 text-[#D8C2A3]" strokeWidth={1.5} />
              <span>Headquarters</span>
            </h4>
            <p className="text-[11px] sm:text-xs font-sans font-light tracking-[0.1em] uppercase leading-relaxed text-white/80">
              LONDON COSMETIC CLINIC KNIGHTSBRIDGE,
              <br />
              2ND FLOOR, 4 HARLEY STREET, LONDON, W1G 9PB
            </p>
            <div className="mt-5 text-[11px] text-white/40 font-light">
              In partnership with Jaipur Medical Chambers
            </div>
          </div>

          {/* Logo brand centerpiece */}
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <img
                alt="Clinic Emblem"
                className="h-16 w-auto mb-4 mx-auto transition-transform hover:scale-105 duration-500 brightness-110 drop-shadow-[0_2px_12px_rgba(216,194,163,0.25)]"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjxq3WzjVonyYRXNXzK5c475rxgNujUJ0Cm9YnyMOaDn-cHHquCFSlgH51zEgGkVPBsUpIyK718k700FLjwoLlBP3LkU7j_c00e92k6nFndooqDaIr1Pr2xUHXnRpgbPjpIbQSLFhkE5dED9HuHvYEKB-plLBBj9pajUERxdBPCkT2TBLr8H_-ge7BRzNzPL6t4Pt06Rq9QLBy1bWAA1Dp6eDlqqEEPLDmxHYzNuCzpZVkp_JYmjp4xLxt5i0S4ge7kG8fwjWUL80z"
              />
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-[#D8C2A3]">
                  THE LONDON
                </span>
                <span className="text-2xl font-serif font-light tracking-[0.15em] uppercase text-white mt-1">
                  COSMETIC CLINIC
                </span>
              </div>
            </div>

            {/* Social media connections */}
            <div className="mt-4 flex flex-col items-center">
              <span className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase mb-4 text-[#D8C2A3]/90">
                FOLLOW OUR JOURNEY
              </span>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D8C2A3] hover:bg-[#D8C2A3] hover:text-black text-white/80 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D8C2A3] hover:bg-[#D8C2A3] hover:text-black text-white/80 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D8C2A3] hover:bg-[#D8C2A3] hover:text-black text-white/80 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-[#D8C2A3] hover:bg-[#D8C2A3] hover:text-black text-white/80 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Youtube"
                >
                  <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <h4 className="text-[11px] font-sans font-medium text-[#D8C2A3] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#D8C2A3]" strokeWidth={1.5} />
              <span>Contact Desk</span>
            </h4>
            <a
              href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`}
              className="text-lg md:text-xl font-sans font-light text-white hover:text-[#D8C2A3] mb-2 tracking-wide transition-colors"
            >
              {config.phone}
            </a>
            <p className="text-[11px] font-sans font-light tracking-[0.1em] uppercase text-white/70 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#D8C2A3]" strokeWidth={1.5} />
              <span>{config.hours}</span>
            </p>
            <a
              href={`mailto:${config.email}`}
              className="text-xs font-sans font-light text-white/70 hover:text-[#D8C2A3] mt-4 flex items-center gap-2 transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-[#D8C2A3]" strokeWidth={1.5} />
              <span>{config.email}</span>
            </a>
          </div>
        </div>

        {/* Newsletter Subscription Block */}
        <div className="border-t border-[#D8C2A3]/20 pt-12 pb-2 mb-8 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-white mb-2 tracking-tight">Stay Informed</h3>
          <p className="text-xs sm:text-sm text-white/70 mb-6 font-light max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter for latest treatments and exclusive insights.
          </p>
          <form className="max-w-3xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 md:flex md:flex-row gap-3 items-center justify-center">
              {/* First Name - Visible on mobile (left) and desktop */}
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-full col-span-1 md:w-36 lg:w-40 px-4 sm:px-5 py-3 rounded-full border border-white/15 bg-white/5 text-white placeholder:text-white/40 text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-[#D8C2A3] focus:bg-white/10 transition-all" 
              />
              {/* Last Name - Visible on mobile (right) and desktop */}
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-full col-span-1 md:w-36 lg:w-40 px-4 sm:px-5 py-3 rounded-full border border-white/15 bg-white/5 text-white placeholder:text-white/40 text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-[#D8C2A3] focus:bg-white/10 transition-all" 
              />
              {/* Email Address - Full width on mobile, inline on desktop */}
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full col-span-2 md:w-60 lg:w-68 px-5 py-3 rounded-full border border-white/15 bg-white/5 text-white placeholder:text-white/40 text-xs sm:text-sm font-sans font-light focus:outline-none focus:border-[#D8C2A3] focus:bg-white/10 transition-all" 
              />
              {/* Subscribe button */}
              <button 
                type="submit" 
                className="w-full col-span-2 md:w-auto bg-[#D8C2A3] hover:bg-white text-black px-8 py-3 rounded-full text-[11px] font-sans font-semibold uppercase tracking-[0.2em] hover:shadow-[0_0_20px_rgba(216,194,163,0.35)] transition-all whitespace-nowrap cursor-pointer shadow-md"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        {/* Standalone Back to Top Item */}
        <div className="flex justify-center items-center my-8">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#D8C2A3] hover:text-white transition-colors duration-300 cursor-pointer group"
            aria-label="Scroll back to top"
          >
            <span>Back to Top</span>
            <ChevronUp className="w-4 h-4 text-[#D8C2A3] group-hover:text-white group-hover:-translate-y-1 transition-all duration-300" strokeWidth={2} />
          </button>
        </div>

        {/* Footnotes copyright & Accessibility Statement */}
        <div className="border-t border-white/10 pt-10 text-center">
          <p className="text-[10px] md:text-[11px] font-sans font-light tracking-[0.1em] uppercase text-white/50 mb-2 leading-relaxed">
            COPYRIGHT &copy; {currentYear} THE LONDON COSMETIC CLINIC. ALL
            RIGHTS RESERVED. <br className="sm:hidden" />
            IN PARTNERSHIP WITH{" "}
            <a
              className="text-[#D8C2A3] hover:text-white transition-colors duration-300 font-medium"
              href="#"
            >
              LONDON KELOID SCAR CLINIC
            </a>
          </p>

          <p className="text-[10px] text-white/30 mb-8 font-sans font-light">
            Powered by DAB: Ecommerce Boutique Website Design &amp; Development
          </p>

          {/* Accessibility Statement Trigger - Details hidden by default */}
          <div className="border-t border-white/10 pt-6 flex justify-center items-center">
            <button
              type="button"
              onClick={() => setIsAccessibilityOpen(true)}
              className="inline-flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-[#D8C2A3] hover:bg-white/5 border border-white/10 hover:border-[#D8C2A3]/40 transition-all duration-300 font-sans cursor-pointer group py-1.5 px-4 rounded-full"
              aria-label="Open Accessibility Statement"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#D8C2A3] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <span className="underline underline-offset-4 decoration-white/20 group-hover:decoration-[#D8C2A3]">Accessibility Statement</span>
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
              className="relative w-full max-w-lg bg-[#121216] text-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#D8C2A3]/30 overflow-hidden z-10 max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-white">
                      Accessibility Statement
                    </h3>
                    <p className="text-[10px] tracking-wider uppercase text-[#D8C2A3] font-sans font-medium">
                      The London Cosmetic Clinic
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAccessibilityOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content Details */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans font-light text-white/80 leading-relaxed">
                <p>
                  Let your rejuvenation journey begin at our private boutique clinical healthcare clinics based in Jaipur and Harley Street, London. We provide customized, medically certified treatments supporting long-term structural anti-aging and total skin wellness.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C2A3] shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-white">Wheelchair Access:</strong> All consulting suites and treatment chambers are fully wheelchair accessible with wide doorways and level thresholds.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C2A3] shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-white">Elevator & Step-Free Access:</strong> Our Harley Street and Jaipur chambers feature step-free entrance ramps and dedicated patient lifts.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D8C2A3] shrink-0 mt-0.5" />
                    <span><strong className="font-medium text-white">Personal Assistance:</strong> Dedicated clinic concierge staff are available to assist with mobility, transport drop-offs, and customized appointment accommodations.</span>
                  </div>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10 text-[11px] text-white/70 mt-3">
                  If you require any specific assistance or have special requirements prior to your visit, please contact our desk at <strong className="text-white font-medium">{config.phone}</strong> or email <strong className="text-[#D8C2A3] font-medium">{config.email}</strong>.
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAccessibilityOpen(false)}
                  className="px-6 py-2.5 bg-[#D8C2A3] text-black font-semibold text-[11px] font-sans uppercase tracking-[0.18em] rounded-full hover:bg-white transition-colors cursor-pointer w-full sm:w-auto text-center"
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
