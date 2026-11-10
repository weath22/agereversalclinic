"use client";

import { useState, useEffect } from 'react';
import { getFloatingMenuConfig } from '../lib/adminStore';
import { Phone, MessageCircle, MapPin, Mail, MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CLINIC_INFO } from '../data/clinicInfo';

export default function FloatingMenu() {
  const [config, setConfig] = useState(getFloatingMenuConfig());

  useEffect(() => {
    setConfig(getFloatingMenuConfig());
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Hide the default LeadConnector floating bubble inside its Shadow DOM and sync open/close state
  useEffect(() => {
    const styleShadowRoot = () => {
      const chatWidgetEl = document.querySelector('chat-widget') as (HTMLElement & { shadowRoot: ShadowRoot | null }) | null;
      if (chatWidgetEl && chatWidgetEl.shadowRoot) {
        if (!chatWidgetEl.shadowRoot.getElementById('arc-custom-lc-launcher-override')) {
          const styleEl = document.createElement('style');
          styleEl.id = 'arc-custom-lc-launcher-override';
          styleEl.textContent = `
            .lc_text-widget--bubble,
            #lc_text-widget--btn,
            .lc_text-widget--prompt {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
              width: 0 !important;
              height: 0 !important;
            }
            .lc_text-widget {
              padding-bottom: 76px !important;
              right: 24px !important;
            }
          `;
          chatWidgetEl.shadowRoot.appendChild(styleEl);
        }
      }

      const lcWidget = (window as unknown as {
        leadConnector?: {
          chatWidget?: {
            isActive?: () => boolean;
          };
        };
      })?.leadConnector?.chatWidget;

      if (lcWidget && typeof lcWidget.isActive === 'function') {
        const active = Boolean(lcWidget.isActive());
        setIsChatOpen(active);
      }
    };

    styleShadowRoot();
    const interval = window.setInterval(styleShadowRoot, 250);
    return () => window.clearInterval(interval);
  }, []);

  const activePhone = config?.phone || CLINIC_INFO.primaryPhone;
  const activeEmail = config?.email || CLINIC_INFO.primaryEmail;
  const activeAddress = config?.address || CLINIC_INFO.locations?.[0]?.address || '4 Harley Street, London';
  const whatsappUrl = CLINIC_INFO.whatsappUrl || 'https://wa.me/442088572000';

  const actions = [
    {
      label: 'Call Now',
      icon: <Phone className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: `tel:${activePhone.replace(/[^0-9+]/g, '')}`,
      color: 'hover:bg-silver-100'
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="h-5 w-5 text-silver-700 group-hover:text-black" />,
      href: whatsappUrl,
      color: 'hover:bg-black'
    },
    {
      label: 'Location',
      icon: <MapPin className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: CLINIC_INFO.locations?.[0]?.directionsUrl || `https://maps.google.com/?q=${encodeURIComponent(activeAddress)}`,
      color: 'hover:bg-silver-100'
    },
    {
      label: 'Email Us',
      icon: <Mail className="h-5 w-5 text-silver-700 group-hover:text-[#003334]" />,
      href: `mailto:${activeEmail}`,
      color: 'hover:bg-silver-100'
    }
  ];

  const openHqChatWidget = () => {
    setIsOpen(false);
    // Wake up LeadConnector loader if it hasn't initialized yet
    window.dispatchEvent(new Event('scroll'));

    const tryOpen = (attemptsLeft: number) => {
      const lcWidget = (window as unknown as {
        leadConnector?: {
          chatWidget?: {
            openWidget?: () => void;
            isActive?: () => boolean;
          };
        };
      })?.leadConnector?.chatWidget;

      if (lcWidget && typeof lcWidget.openWidget === 'function') {
        lcWidget.openWidget();
        setIsChatOpen(true);
        return;
      }

      const chatWidgetEl = document.querySelector('chat-widget') as (HTMLElement & { shadowRoot: ShadowRoot | null }) | null;
      const shadowBtn = chatWidgetEl?.shadowRoot?.getElementById('lc_text-widget--btn');
      if (shadowBtn) {
        shadowBtn.click();
        setIsChatOpen(true);
        return;
      }

      if (attemptsLeft > 0) {
        window.setTimeout(() => tryOpen(attemptsLeft - 1), 150);
      }
    };

    tryOpen(30);
  };

  const closeHqChatWidget = () => {
    const lcWidget = (window as unknown as {
      leadConnector?: {
        chatWidget?: {
          closeWidget?: () => void;
          isActive?: () => boolean;
        };
      };
    })?.leadConnector?.chatWidget;

    if (lcWidget && typeof lcWidget.closeWidget === 'function') {
      lcWidget.closeWidget();
    } else {
      const chatWidgetEl = document.querySelector('chat-widget') as (HTMLElement & { shadowRoot: ShadowRoot | null }) | null;
      const shadowBtn = chatWidgetEl?.shadowRoot?.getElementById('lc_text-widget--btn');
      if (shadowBtn) {
        shadowBtn.click();
      }
    }
    setIsChatOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end">
      {/* Floating Action Buttons (Call Now, WhatsApp, Location, Email Us) */}
      <AnimatePresence>
        {isOpen && !isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col space-y-3 mb-4 origin-bottom items-end"
          >
            {actions.map((act, idx) => (
              <div key={idx} className="relative group flex items-center justify-end">
                <a
                  href={act.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-12 h-12 rounded-full bg-white flex items-center justify-center transition-all shadow-lg border border-silver-200 group-hover:scale-110 ${act.color}`}
                >
                  {act.icon}
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-3">
        {!isOpen && !isChatOpen && config.enableChat && (
          <div 
            onClick={openHqChatWidget}
            className="flex items-center bg-white border border-silver-200 rounded-full h-14 px-4 shadow-2xl w-[55vw] sm:w-[240px] max-w-[240px] cursor-text hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="text-silver-400 text-sm flex-1 text-left truncate">Type a message...</span>
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shrink-0 ml-2">
              <Send className="w-4 h-4 -ml-0.5" />
            </div>
          </div>
        )}
        
        <button
          onClick={() => {
            if (isChatOpen) {
              closeHqChatWidget();
            } else {
              setIsOpen(!isOpen);
            }
          }}
          className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-black transition-all focus:outline-none z-10 hover:scale-105"
        >
          {isOpen || isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
