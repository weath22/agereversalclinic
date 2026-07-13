import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Clock,
  Mail,
} from "lucide-react";
import { getFooterConfig } from "../lib/adminStore";
import { useState, useEffect } from "react";

export default function Footer() {  const [config, setConfig] = useState(getFooterConfig()); useEffect(() => { setConfig(getFooterConfig()); }, []);
  const currentYear = new Date().getFullYear();

  const footerLinks = config?.links?.length > 0 ? config.links : [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Treatments", href: "#treatments" },
    { name: "Before & Afters", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Skincare Essentials", href: "#essentials" },
    { name: "Book Appointment", href: "#contact" },
    { name: "Staff Portal", href: "#admin" },
  ];

  return (
    <footer className="bg-luxury-primary py-16 md:py-24 border-t border-luxury-border text-luxury-text">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Newsletter Subscription Block */}
        <div className="bg-luxury-secondary border border-luxury-border rounded-[24px] p-8 md:p-12 mb-16 md:mb-24 text-center max-w-5xl mx-auto shadow-sm">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-luxury-text mb-3 tracking-tight">Stay Informed</h3>
          <p className="text-sm text-luxury-subtext mb-8 font-light max-w-xl mx-auto leading-relaxed">
            Subscribe to our newsletter for exclusive insights, latest treatments, and specialized skincare advice directly from our clinical experts.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="First Name" 
              required
              className="w-full md:w-1/4 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
            />
            <input 
              type="text" 
              placeholder="Last Name" 
              required
              className="w-full md:w-1/4 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full md:w-1/3 px-5 py-3.5 rounded-full border border-luxury-border bg-white text-luxury-text text-sm font-sans font-light focus:outline-none focus:border-luxury-gold transition-colors" 
            />
            <button 
              type="submit" 
              className="w-full md:w-auto bg-black text-white px-8 py-3.5 rounded-full text-[11px] font-sans font-normal uppercase tracking-[0.2em] hover:bg-luxury-secondary hover:text-luxury-text border border-transparent hover:border-luxury-border transition-all whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

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

          {/* Accessible statement block */}
          <p className="text-[10px] md:text-[11px] leading-loose text-luxury-muted max-w-4xl mx-auto border-t border-luxury-border/50 pt-8 font-sans font-light">
            <span className="font-normal text-luxury-subtext">
              Accessibility Statement:
            </span>{" "}
            Let your rejuvenation journey begin at our private boutique clinical
            healthcare clinics based in Jaipur and Harley Street, London. We
            provide customized, medically certified treatments supporting
            long-term structural anti-aging and total skin wellness. All
            consulting rooms are fully wheelchair accessible.
          </p>
        </div>
      </div>
    </footer>
  );
}
