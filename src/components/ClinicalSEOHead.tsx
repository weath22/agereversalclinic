import { useEffect } from 'react';
import { CLINIC_DATA } from '../data/clinicInfo';
import { generateAllClinicalSchemas } from '../lib/clinicalSEO';

interface ClinicalSEOHeadProps {
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  canonicalPath?: string;
}

/**
 * Helper to update or create a <meta> tag in the document <head>
 */
const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

/**
 * Helper to update or create a <link rel="..."> tag in the document <head>
 */
const setLinkTag = (rel: string, href: string) => {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * ClinicalSEOHead: Injects and synchronizes all Schema.org JSON-LD structured data,
 * OpenGraph social share cards, Twitter cards, and meta tags directly from the clinic TypeScript data.
 */
export default function ClinicalSEOHead({
  customTitle,
  customDescription,
  customImage,
  canonicalPath = ''
}: ClinicalSEOHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const pageTitle = customTitle 
      ? `${customTitle} | ${CLINIC_DATA.name}`
      : `${CLINIC_DATA.name} | ${CLINIC_DATA.tagline}`;

    const pageDescription = customDescription || CLINIC_DATA.metaDescription;
    const pageImage = customImage || CLINIC_DATA.ogImage;
    const pageUrl = `${CLINIC_DATA.canonicalUrl}${canonicalPath}`;

    // 1. Update Title & Standard Meta
    document.title = pageTitle;
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'keywords', CLINIC_DATA.brandKeywords.join(', '));
    setMetaTag('name', 'author', CLINIC_DATA.name);
    setMetaTag('name', 'geo.region', 'GB-ENG');
    setMetaTag('name', 'geo.placename', 'London, Harley Street');

    // 2. Canonical URL
    setLinkTag('canonical', pageUrl);

    // 3. OpenGraph / Social Share Card Meta Tags
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', CLINIC_DATA.name);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:locale', 'en_GB');

    // 4. Twitter / X Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);

    // 5. Inject / Update Schema.org JSON-LD structured data script
    const schemaScriptId = 'clinical-schema-org-jsonld';
    let scriptElement = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = schemaScriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const allSchemas = generateAllClinicalSchemas();
    scriptElement.textContent = JSON.stringify(allSchemas, null, 2);

    return () => {
      // Cleanup is optional as SPA stays in-app
    };
  }, [customTitle, customDescription, customImage, canonicalPath]);

  return null;
}
