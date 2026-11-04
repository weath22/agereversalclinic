import { useState, useEffect } from 'react';
import { ClinicData } from '../data/clinicInfo';
import { getClinicData, fetchRemoteClinicData, slugifyArticleText } from '../lib/adminStore';
import { generateAllClinicalSchemas } from '../lib/clinicalSEO';
import { generateSingleProductSchema } from '../lib/shopSEO';
import { ShopProduct } from '../types/shop';
import { Article } from '../types';

interface ClinicalSEOHeadProps {
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  canonicalPath?: string;
  productData?: ShopProduct | null;
  customKeywords?: string[];
  articleData?: Article | null;
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
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

/**
 * ClinicalSEOHead: Injects and synchronizes all Schema.org JSON-LD structured data,
 * OpenGraph social share cards, Twitter cards, and meta tags directly from clinic, treatment, product, and blog article data.
 */
export default function ClinicalSEOHead({
  customTitle,
  customDescription,
  customImage,
  canonicalPath = '',
  productData,
  customKeywords,
  articleData,
  treatmentData
}: ClinicalSEOHeadProps) {
  const [clinicData, setClinicData] = useState<ClinicData>(() => getClinicData());

  useEffect(() => {
    setClinicData(getClinicData());
    fetchRemoteClinicData().then((remote) => {
      if (remote) setClinicData(remote);
    });

    const handleClinicDataChanged = (e: Event) => {
      const customEvt = e as CustomEvent<ClinicData>;
      setClinicData(customEvt.detail || getClinicData());
    };

    window.addEventListener('clinic_data_changed', handleClinicDataChanged);
    window.addEventListener('storage', handleClinicDataChanged);
    return () => {
      window.removeEventListener('clinic_data_changed', handleClinicDataChanged);
      window.removeEventListener('storage', handleClinicDataChanged);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let pageTitle = customTitle
      ? `${customTitle} | ${clinicData.name}`
      : `${clinicData.name} | ${clinicData.tagline}`;

    let pageDescription = customDescription || clinicData.metaDescription;
    let pageImage =
      customImage ||
      clinicData.ogImage ||
      clinicData.exteriorPhoto ||
      clinicData.logo?.full ||
      clinicData.logo?.icon;
    let pageUrl = `${clinicData.canonicalUrl}${canonicalPath}`;
    let ogType = productData ? 'product' : articleData ? 'article' : 'website';

    if (productData) {
      pageTitle = `${productData.name} | ${productData.brand || productData.range} | ${clinicData.name}`;
      pageDescription = `${productData.description} Active Ingredients: ${productData.keyIngredients?.slice(0, 3).join(', ')}. Volume: ${productData.volume || 'Standard'}. Price: £${productData.price.toFixed(2)}`;
      pageImage = productData.image;
      pageUrl = `${clinicData.canonicalUrl}/#product-${productData.id}`;
    }

    if (treatmentData) {
      pageTitle = `${treatmentData.title} | ${treatmentData.category} | ${clinicData.name}`;
      pageDescription = `${treatmentData.description} Starting from ${treatmentData.price || '£250'}. Harley Street clinical excellence and bespoke recovery protocols.`;
      if (treatmentData.imageUrl) pageImage = treatmentData.imageUrl;
      pageUrl = `${clinicData.canonicalUrl}/#treatment-${treatmentData.id}`;
    }

    if (articleData) {
      const articleSlug =
        articleData.slug || slugifyArticleText(articleData.title, articleData.id);
      pageTitle =
        articleData.seoTitle?.trim() ||
        `${articleData.title} | ${clinicData.name}`;
      pageDescription =
        articleData.metaDescription?.trim() ||
        articleData.description ||
        `${articleData.title} — clinical journal insights by ${articleData.author} at ${clinicData.name}.`;
      if (articleData.image && articleData.image.trim()) {
        pageImage = articleData.image.trim();
      }
      if (articleData.canonicalUrl && articleData.canonicalUrl.startsWith('http')) {
        pageUrl = articleData.canonicalUrl;
      } else {
        pageUrl = `${clinicData.canonicalUrl}/#article-${articleSlug}`;
      }
      ogType = 'article';
    }

    // 1. Update Title & Standard Meta
    document.title = pageTitle;
    setMetaTag('name', 'description', pageDescription);

    // Export tags to <meta name="keywords">
    const mergedKeywords = Array.from(
      new Set([
        ...(articleData?.focusKeywords || []),
        ...(customKeywords || []),
        ...(treatmentData?.seoKeywords || []),
        ...(clinicData.brandKeywords || []),
        ...(clinicData.processSection?.seoKeywords || []),
        ...(clinicData.processSection?.steps?.flatMap((s) => s.seoKeywords || []) || []),
        ...(clinicData.facilityGallery?.seoKeywords || []),
        ...(clinicData.trustBrandsSection?.seoKeywords || []),
        ...(clinicData.accreditationsSection?.seoKeywords || []),
      ])
    );
    setMetaTag('name', 'keywords', mergedKeywords.join(', '));
    setMetaTag('name', 'author', articleData?.author || clinicData.name);
    setMetaTag('name', 'geo.region', 'GB-ENG');
    setMetaTag('name', 'geo.placename', 'London, Harley Street');

    // 2. Canonical URL
    setLinkTag('canonical', pageUrl);

    // 3. OpenGraph / Social Share Card Meta Tags (WhatsApp, iMessage, Facebook, LinkedIn, Slack)
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', clinicData.name);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:locale', 'en_GB');

    if (articleData) {
      const pubTime = articleData.publishedAt || new Date().toISOString();
      const modTime = articleData.updatedAt || pubTime;
      setMetaTag('property', 'article:published_time', pubTime);
      setMetaTag('property', 'article:modified_time', modTime);
      setMetaTag('property', 'article:author', articleData.author || clinicData.name);
      setMetaTag(
        'property',
        'article:section',
        articleData.category || articleData.tag || 'Clinical Journal'
      );
      if (Array.isArray(articleData.focusKeywords) && articleData.focusKeywords.length > 0) {
        setMetaTag('property', 'article:tag', articleData.focusKeywords.join(', '));
      }
    }

    // 4. Product-Specific OpenGraph Commerce Tags
    if (productData) {
      setMetaTag('property', 'product:price:amount', productData.price.toFixed(2));
      setMetaTag('property', 'product:price:currency', productData.currency || 'GBP');
      setMetaTag('property', 'product:brand', productData.brand || productData.range);
      setMetaTag(
        'property',
        'product:availability',
        productData.inStock !== false ? 'in stock' : 'out of stock'
      );
    }

    // 5. Twitter / X Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);
    if (articleData?.imageAlt) {
      setMetaTag('name', 'twitter:image:alt', articleData.imageAlt);
    }

    // 6. Inject / Update Schema.org JSON-LD structured data script
    const schemaScriptId = 'clinical-schema-org-jsonld';
    let scriptElement = document.getElementById(schemaScriptId) as HTMLScriptElement | null;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = schemaScriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    if (articleData) {
      const pubTime = articleData.publishedAt || new Date().toISOString();
      const modTime = articleData.updatedAt || pubTime;
      const clinicLogo =
        clinicData.logo?.full || clinicData.logo?.icon || clinicData.ogImage;
      const articleKeywords = Array.isArray(articleData.focusKeywords)
        ? articleData.focusKeywords
        : [articleData.category || articleData.tag || 'Clinical Aesthetics'];

      // Build article body text from structured blocks for search engine indexing
      const articleBodyText = Array.isArray(articleData.contentBlocks)
        ? articleData.contentBlocks
            .map((b) =>
              [
                b.heading || '',
                b.text || '',
                ...(Array.isArray(b.paragraphs) ? b.paragraphs : []),
                b.calloutQuote || '',
                ...(Array.isArray(b.bulletPoints) ? b.bulletPoints : []),
              ]
                .filter(Boolean)
                .join(' ')
            )
            .filter(Boolean)
            .join('\n\n')
        : articleData.description;

      const blogPostingNode: Record<string, any> = {
        '@type': ['BlogPosting', 'MedicalWebPage'],
        '@id': `${pageUrl}#blogposting`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: articleData.seoTitle || articleData.title,
        name: articleData.title,
        description: pageDescription,
        image: {
          '@type': 'ImageObject',
          url: pageImage,
          caption: articleData.imageAlt || articleData.title,
        },
        datePublished: pubTime,
        dateModified: modTime,
        author: {
          '@type': 'Person',
          name: articleData.author || 'Adv. Faith Chris',
          affiliation: {
            '@type': 'MedicalClinic',
            name: clinicData.name,
            url: clinicData.canonicalUrl,
          },
        },
        reviewedBy: {
          '@type': 'Person',
          name: articleData.author || 'Adv. Faith Chris',
        },
        publisher: {
          '@type': 'MedicalOrganization',
          name: clinicData.name,
          url: clinicData.canonicalUrl,
          logo: {
            '@type': 'ImageObject',
            url: clinicLogo,
          },
        },
        articleSection: articleData.category || articleData.tag || 'Clinical News',
        keywords: articleKeywords.join(', '),
        articleBody: articleBodyText,
        inLanguage: 'en-GB',
      };

      const graphNodes: Record<string, any>[] = [blogPostingNode];

      // Inject FAQPage JSON-LD when the article has FAQ items for Google Rich Snippets
      const validFaqs = Array.isArray(articleData.faqItems)
        ? articleData.faqItems.filter(
            (f) => f && f.question && f.question.trim() && f.answer && f.answer.trim()
          )
        : [];

      if (validFaqs.length > 0) {
        graphNodes.push({
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faqpage`,
          mainEntity: validFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question.trim(),
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer.trim(),
            },
          })),
        });
      }

      const articleSchemaGraph = {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
      };
      scriptElement.textContent = JSON.stringify(articleSchemaGraph, null, 2);
    } else if (productData) {
      // Focused product Schema along with parent Clinic provider
      const singleProductSchema = generateSingleProductSchema(productData);
      scriptElement.textContent = JSON.stringify(singleProductSchema, null, 2);
    } else if (treatmentData) {
      // Focused treatment MedicalProcedure Schema with exported keywords
      const treatmentPrice = treatmentData.price
        ? parseInt(treatmentData.price.replace(/[^0-9]/g, '') || '250', 10)
        : 250;

      const primaryLoc = clinicData.locations?.[0];
      const procedureSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        '@id': `${clinicData.canonicalUrl}/#procedure-${treatmentData.id}`,
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
          priceCurrency: clinicData.currency,
          availability: 'https://schema.org/InStock',
          url: pageUrl,
        },
        provider: {
          '@type': 'MedicalClinic',
          name: clinicData.name,
          url: clinicData.canonicalUrl,
          logo: clinicData.logo?.full || clinicData.logo?.icon || clinicData.ogImage,
          image: clinicData.exteriorPhoto || clinicData.ogImage,
          telephone: clinicData.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: primaryLoc?.address || '4 Harley Street, Marylebone',
            addressLocality: primaryLoc?.city || 'London',
            postalCode: primaryLoc?.postalCode || 'W1G 9PB',
            addressCountry: primaryLoc?.country || 'GB',
          },
        },
      };
      scriptElement.textContent = JSON.stringify(procedureSchema, null, 2);
    } else {
      // Master complete Schema graph (Clinic + FAQs + Procedures + Catalog)
      const allSchemas = generateAllClinicalSchemas(clinicData);
      scriptElement.textContent = JSON.stringify(allSchemas, null, 2);
    }
  }, [
    clinicData,
    customTitle,
    customDescription,
    customImage,
    canonicalPath,
    productData,
    customKeywords,
    articleData,
    treatmentData,
  ]);

  return null;
}
