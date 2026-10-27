import { CLINIC_DATA, ClinicData } from '../data/clinicInfo';
import { CLINICAL_AREAS_DB } from '../data/clinicalTreatments';
import { TREATMENT_PRICING_DATA } from '../data/treatmentPricing';
import { generateAllProductsSchema, generateSingleProductSchema, generateProductCatalogItemListSchema } from './shopSEO';

export { generateAllProductsSchema, generateSingleProductSchema, generateProductCatalogItemListSchema };

/**
 * 1. Generates Google-compliant Schema.org MedicalClinic & MedicalBusiness structured data
 */
export const generateMedicalClinicSchema = (clinicData: ClinicData = CLINIC_DATA) => {
  const primaryLocation = clinicData.locations?.[0] || {
    name: 'Harley Street Flagship Clinic',
    address: '4 Harley Street, Marylebone',
    city: 'London',
    postalCode: 'W1G 9PB',
    country: 'United Kingdom',
    phone: clinicData.phone,
    hours: clinicData.openingHours,
    latitude: 51.5173,
    longitude: -0.1472
  };

  const resolvedLogoUrl =
    clinicData.logo?.full ||
    clinicData.logo?.icon ||
    clinicData.ogImage;

  const resolvedSchemaImages = Array.from(
    new Set(
      [
        clinicData.exteriorPhoto,
        clinicData.ogImage,
        clinicData.logo?.full,
        ...(Array.isArray(clinicData.interiorPhotos) ? clinicData.interiorPhotos : []),
      ]
        .map((u) => u?.trim())
        .filter(Boolean)
    )
  );

  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'MedicalBusiness', 'Dermatology'],
    '@id': `${clinicData.canonicalUrl}/#medical-clinic`,
    name: clinicData.name,
    alternateName: clinicData.tagline,
    description: clinicData.metaDescription,
    url: clinicData.canonicalUrl,
    logo: {
      '@type': 'ImageObject',
      url: resolvedLogoUrl,
      width: 1200,
      height: 630
    },
    image:
      resolvedSchemaImages.length > 1
        ? resolvedSchemaImages
        : resolvedSchemaImages[0] || clinicData.ogImage,
    telephone: clinicData.phone,
    email: clinicData.email,
    priceRange: clinicData.priceRange,
    currenciesAccepted: clinicData.currency,
    paymentAccepted: (clinicData.acceptedPayments || []).join(', '),
    knowsLanguage: clinicData.languagesSpoken,
    medicalSpecialty: clinicData.medicalSpecialties,
    award: clinicData.accreditations,
    address: {
      '@type': 'PostalAddress',
      streetAddress: primaryLocation.address,
      addressLocality: primaryLocation.city,
      postalCode: primaryLocation.postalCode,
      addressCountry: primaryLocation.country || 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: primaryLocation.latitude || 51.5173,
      longitude: primaryLocation.longitude || -0.1472
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '17:00'
      }
    ],
    department: (clinicData.locations || []).map((loc) => ({
      '@type': 'MedicalClinic',
      name: `${clinicData.name} - ${loc.name}`,
      image: loc.image || loc.gallery?.[0] || clinicData.exteriorPhoto || clinicData.ogImage,
      telephone: loc.phone || clinicData.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc.address,
        addressLocality: loc.city,
        postalCode: loc.postalCode,
        addressCountry: loc.country || 'GB'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: loc.latitude || 51.5173,
        longitude: loc.longitude || -0.1472
      }
    })),
    sameAs: Object.values(clinicData.socials || {}).filter(Boolean)
  };
};

/**
 * 2. Generates Google-compliant Schema.org MedicalProcedure items
 */
export const generateMedicalProceduresSchema = () => {
  const procedureItems = [];

  // Iterate across all clinical categories in the catalog
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      for (const item of cat.items) {
        const cleanPrice = parseInt(item.price.replace(/[^0-9]/g, '') || '250', 10);
        const pricingEntry = TREATMENT_PRICING_DATA.find(
          (p) => p.id.toLowerCase() === item.id.toLowerCase()
        );

        procedureItems.push({
          '@type': 'MedicalProcedure',
          '@id': `${CLINIC_DATA.canonicalUrl}/#procedure-${item.id}`,
          name: item.name,
          procedureType: cat.name,
          bodyLocation: area.name,
          description: item.desc,
          duration: item.time || pricingEntry?.procedureTime || '30 - 45 Minutes',
          preparation: 'Initial medical assessment, digital skin mapping, and topical anesthetic comfort protocol.',
          followup: 'Post-treatment barrier recovery serum, soothing guidelines, and scheduled follow-up review.',
          offers: {
            '@type': 'Offer',
            price: cleanPrice,
            priceCurrency: CLINIC_DATA.currency,
            availability: 'https://schema.org/InStock',
            url: `${CLINIC_DATA.canonicalUrl}`
          }
        });
      }
    }
  }

  return procedureItems;
};

/**
 * 3. Generates structured FAQPage JSON-LD for Google "People Also Ask" snippets
 */
export const generateClinicalFAQSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What qualifications do your aesthetic and dermatology practitioners hold?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All injectable, surgical, and advanced regenerative procedures at Age Reversal Clinics are performed exclusively by GMC-registered medical doctors, consultant dermatologists, and licensed aesthetic physicians with extensive Harley Street clinical experience.'
        }
      },
      {
        '@type': 'Question',
        name: 'How does Exosome Regenerative Therapy work compared to traditional skin boosters?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Exosome therapy utilizes pure biotech growth factors and cellular signaling vesicles that instruct tired dermal cells to regenerate, repair microvascular tissue, and accelerate deep collagen synthesis, providing superior longevity and rejuvenation compared to surface hyaluronic boosters.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the expected downtime after a Morpheus8 RF Microneedling session?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Morpheus8 involves minimal downtime. Most patients experience mild redness and light warmth for 24 to 48 hours, which easily subsides with our prescribed medical-grade post-procedure barrier recovery kit.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I book a consultation at the Harley Street or Devonshire Place flagships?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can book directly online through our interactive appointment portal, call our London clinic desk at +44 20 8857 2000, or chat with our team on WhatsApp for same-day private consultation availability.'
        }
      },
      {
        '@type': 'Question',
        name: 'Are multi-session package discounts available for course treatments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. We offer structured 3-session and 5-session clinical course protocols providing up to 20% savings, complimentary digital skin reviews at each stage, and full-size take-home barrier repair regimens.'
        }
      }
    ]
  };
};

/**
 * 4. Master Combined Graph: Generates the full Schema.org payload for the application
 */
export const generateAllClinicalSchemas = (clinicData: ClinicData = CLINIC_DATA) => {
  const clinicSchema = generateMedicalClinicSchema(clinicData);
  const proceduresSchema = generateMedicalProceduresSchema();
  const faqSchema = generateClinicalFAQSchema();
  const productSchemas = generateAllProductsSchema();

  return {
    '@context': 'https://schema.org',
    '@graph': [
      clinicSchema,
      faqSchema,
      ...proceduresSchema,
      ...productSchemas
    ]
  };
};
