/**
 * ============================================================================
 * CLINIC DEMO INFORMATION
 * ============================================================================
 * Edit this single file to update all clinic demo info across the website:
 * 1. Name
 * 2. Contact (Phone, Email, WhatsApp)
 * 3. Locations (Address, City, Postal Code)
 * 4. Opening Times / Hours
 * 5. Social Links
 * ============================================================================
 */

export interface ClinicLocation {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  hours: string;
  directionsUrl?: string;
}

export interface ClinicData {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;
  locations: ClinicLocation[];
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export const CLINIC_DATA: ClinicData = {
  // 1. Clinic Name
  name: 'Age Reversal Clinics',

  // 2. Contact Details
  phone: '+44 20 8857 2000',
  email: 'info@agereversalclinics.com',
  whatsapp: 'https://wa.me/442088572000',

  // 3. Opening Time / Hours
  openingHours: 'Mon – Fri: 09:00 – 19:00 | Sat: 10:00 – 17:00',

  // 4. Clinic Locations
  locations: [
    {
      name: 'Harley Street Flagship Clinic',
      address: '4 Harley Street, Marylebone',
      city: 'London',
      postalCode: 'W1G 9PB',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 19:00',
      directionsUrl: 'https://maps.google.com/?q=4+Harley+Street+London+W1G+9PB',
    },
    {
      name: 'Grove Park Clinic',
      address: 'Grove Park, London Borough of Lewisham',
      city: 'London',
      postalCode: 'SE12 0AL',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 18:00',
      directionsUrl: 'https://maps.google.com/?q=Grove+Park+London+SE12',
    },
    {
      name: 'Hull City England Clinic UK',
      address: 'Hull City, London Borough of Lewisham',
      city: 'London',
      postalCode: 'SE12 0AL',
      phone: '+44 20 8857 2000',
      hours: 'Mon – Fri: 09:00 – 18:00',
      directionsUrl: 'https://maps.google.com/?q=Grove+Park+London+SE12',
    },
  ],

  // 5. Social Links
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com/agereversalclinicuk',
    twitter: 'https://twitter.com',
    youtube: 'https://youtube.com',
  },
};

/**
 * Compatible helper mapping for components
 */
export const CLINIC_INFO = {
  clinicName: CLINIC_DATA.name,
  primaryPhone: CLINIC_DATA.phone,
  phoneHref: `tel:${CLINIC_DATA.phone.replace(/[^0-9+]/g, '')}`,
  primaryEmail: CLINIC_DATA.email,
  whatsappUrl: CLINIC_DATA.whatsapp,
  welcomeMessage: `Welcome to ${CLINIC_DATA.name}`,
  openingHoursSummary: {
    weekdays: CLINIC_DATA.openingHours,
    saturdays: 'Sat: 10:00 – 17:00',
    sundays: 'Sun: Closed',
  },
  locations: CLINIC_DATA.locations.map((loc) => ({
    ...loc,
    id: loc.name.toLowerCase().replace(/\s+/g, '-'),
    shortName: loc.name,
  })),
  socialLinks: CLINIC_DATA.socials,
};

export default CLINIC_DATA;
