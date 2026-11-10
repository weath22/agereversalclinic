import { useEffect } from 'react';

export interface ScriptProps {
  id?: string;
  src: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  'data-resources-url'?: string;
  'data-widget-id'?: string;
  [key: string]: any;
}

/**
 * React Script loader component compatible with Next.js `<Script strategy="afterInteractive" />` syntax.
 * Safely injects external widget scripts (such as LeadConnector HQ Chat) into document.body after hydration
 * without duplicating existing script tags.
 */
export default function Script({
  id = 'lead-connector-chat',
  src,
  strategy = 'afterInteractive',
  ...rest
}: ScriptProps) {
  useEffect(() => {
    if (typeof document === 'undefined' || !src) return;

    const existingById = id ? document.getElementById(id) : null;
    const existingBySrc = document.querySelector(`script[src="${src}"]`);
    if (existingById || existingBySrc) {
      return;
    }

    const injectScript = () => {
      if (id && document.getElementById(id)) return;
      const script = document.createElement('script');
      if (id) script.id = id;
      script.src = src;
      script.async = true;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          script.setAttribute(key, String(value));
        }
      });

      document.body.appendChild(script);
    };

    if (strategy === 'lazyOnload') {
      if (document.readyState === 'complete') {
        const timer = window.setTimeout(injectScript, 500);
        return () => window.clearTimeout(timer);
      } else {
        window.addEventListener('load', injectScript, { once: true });
        return () => window.removeEventListener('load', injectScript);
      }
    }

    injectScript();

    // Trigger interaction listener in LeadConnector loader.js so <chat-widget> mounts immediately
    const triggerTimer = window.setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 600);

    return () => window.clearTimeout(triggerTimer);
  }, [id, src, strategy]);

  return null;
}
