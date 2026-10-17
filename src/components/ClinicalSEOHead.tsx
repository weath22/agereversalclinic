import { useEffect } from 'react';
import { CLINIC_DATA } from '../data/clinicInfo';
import { generateAllClinicalSchemas } from '../lib/clinicalSEO';
import { generateSingleProductSchema } from '../lib/shopSEO';
import { ShopProduct } from '../types/shop';

interface ClinicalSEOHeadProps {
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  canonicalPath?: string;
  productData?: ShopProduct | null;
  customKeywords?: string[];
  treatmentData?: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
    price?: string;
    seoKeywords?: string[];
    procedureTime?: string;
  } | null;
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
    element.setAttribute(rel, rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * ClinicalSEOHead: Injects and synchronizes all Schema.org JSON-LD structured data,
 * OpenGraph social share cards, Twitter cards, and meta tags directly from clinic and treatment data.
 */
export default function ClinicalSEOHead({
  customTitle,
  customDescription,
  customImage,
  canonicalPath = '',
  productData,
  customKeywords,
  treatmentData
}: ClinicalSEOHeadProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    let pageTitle = customTitle 
      ? `${customTitle} | ${CLINIC_DATA.name}`
      : `${CLINIC_DATA.name} | ${CLINIC_DATA.tagline}`;

    let pageDescription = customDescription || CLINIC_DATA.metaDescription;
    let pageImage = customImage || CLINIC_DATA.ogImage;
    let pageUrl = `${CLINIC_DATA.canonicalUrl}${canonicalPath}`;
    const ogType = productData ? 'product' : 'website';

    if (productData) {
      pageTitle = `${productData.name} | ${productData.brand || productData.range} | ${CLINIC_DATA.name}`;
      pageDescription = `${productData.description} Active Ingredients: ${productData.keyIngredients?.slice(0, 3).join(', ')}. Volume: ${productData.volume || 'Standard'}. Price: £${productData.price.toFixed(2)}`;
      pageImage = productData.image;
      pageUrl = `${CLINIC_DATA.canonicalUrl}/#product-${productData.id}`;
    }

    if (treatmentData) {
      pageTitle = `${treatmentData.title} | ${treatmentData.category} | ${CLINIC_DATA.name}`;
      pageDescription = `${treatmentData.description} Starting from ${treatmentData.price || '£250'}. Harley Street clinical excellence and bespoke recovery protocols.`;
      if (treatmentData.imageUrl) pageImage = treatmentData.imageUrl;
      pageUrl = `${CLINIC_DATA.canonicalUrl}/#treatment-${treatmentData.id}`;
    }

    // 1. Update Title & Standard Meta
    document.title = pageTitle;
    setMetaTag('name', 'description', pageDescription);

    // Export tags to <meta name="keywords"> (Task 5.3)
    const mergedKeywords = Array.from(new Set([
      ...(customKeywords || []),
      ...(treatmentData?.seoKeywords || []),
      ...CLINIC_DATA.brandKeywords
    ]));
    setMetaTag('name', 'keywords', mergedKeywords.join(', '));
    setMetaTag('name', 'author', CLINIC_DATA.name);
    setMetaTag('name', 'geo.region', 'GB-ENG');
    setMetaTag('name', 'geo.placename', 'London, Harley Street');

    // 2. Canonical URL
    setLinkTag('canonical', pageUrl);

    // 3. OpenGraph / Social Share Card Meta Tags (WhatsApp, iMessage, Facebook, Slack)
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', CLINIC_DATA.name);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:locale', 'en_GB');

    // 4. Product-Specific OpenGraph Commerce Tags
    if (productData) {
      setMetaTag('property', 'product:price:amount', productData.price.toFixed(2));
      setMetaTag('property', 'product:price:currency', productData.currency || 'GBP');
      setMetaTag('property', 'product:brand', productData.brand || productData.range);
      setMetaTag('property', 'product:availability', productData.inStock !== false ? 'in stock' : 'out of stock');
    }

    // 5. Twitter / X Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);

    // 6. Inject / Update Schema.org JSON-LD structured data script (Task 5.3)
    const schemaScriptId = 'clinical-schema-org-jsonld';
    let scriptElement = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = schemaScriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    if (productData) {
      // Focused product Schema along with parent Clinic provider
      const singleProductSchema = generateSingleProductSchema(productData);
      scriptElement.textContent = JSON.stringify(singleProductSchema, null, 2);
    } else if (treatmentData) {
      // Focused treatment MedicalProcedure Schema with exported keywords
      const treatmentPrice = treatmentData.price 
        ? parseInt(treatmentData.price.replace(/[^0-9]/g, '') || '250', 10) 
        : 250;

      const procedureSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        '@id': `${CLINIC_DATA.canonicalUrl}/#procedure-${treatmentData.id}`,
        name: treatmentData.title,
        description: treatmentData.description,
        procedureType: treatmentData.category,
        bodyLocation: treatmentData.category,
        keywords: (treatmentData.seoKeywords || []).join(', '),
        image: treatmentData.imageUrl || pageImage,
        duration: treatmentData.procedureTime || '45 Minutes',
        offers: {
          '@type': 'Offer',
          price: treatmentPrice,
          priceCurrency: CLINIC_DATA.currency,
          availability: 'https://schema.org/InStock',
          url: pageUrl
        },
        provider: {
          '@type': 'MedicalClinic',
          name: CLINIC_DATA.name,
          url: CLINIC_DATA.canonicalUrl,
          telephone: CLINIC_DATA.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: '4 Harley Street, Marylebone',
            addressLocality: 'London',
            postalCode: 'W1G 9PB',
            addressCountry: 'GB'
          }
        }
      };
      scriptElement.textContent = JSON.stringify(procedureSchema, null, 2);
    } else {
      // Master complete Schema graph (Clinic + FAQs + Procedures + Catalog)
      const allSchemas = generateAllClinicalSchemas();
      scriptElement.textContent = JSON.stringify(allSchemas, null, 2);
    }

    return () => {
      // Cleanup is optional as SPA stays in-app
    };
  }, [customTitle, customDescription, customImage, canonicalPath, productData, customKeywords, treatmentData]);

  return null;
}
