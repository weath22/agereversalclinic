import React, { useState, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Percent,
} from 'lucide-react';

interface BrochureItem {
  name: string;
  price: string;
  numericPrice?: number;
  note?: string;
  badge?: string;
  isSpecial?: boolean;
}

interface BrochureSubCategory {
  title: string;
  description?: string;
  items: BrochureItem[];
}

interface BrochureCategory {
  id: string;
  title: string;
  tagline: string;
  iconName?: string;
  subcategories: BrochureSubCategory[];
}

const BROCHURE_CATEGORIES: BrochureCategory[] = [
  {
    id: 'injectables',
    title: 'Anti-Wrinkle & Fillers',
    tagline: 'Botox, 1ml Dermal Fillers & Bioremodeling',
    subcategories: [
      {
        title: 'Anti-Wrinkle Injections (Botox)',
        description: 'FDA-approved neuromodulator treatments for fine lines, softening and profile smoothing.',
        items: [
          { name: 'Bunny Lines', price: '£160', note: 'Nose lines' },
          { name: "Crow's Feet", price: '£160', note: 'Lateral eye crinkles' },
          { name: 'Gummy Smile', price: '£160', note: 'Upper lip elevation control' },
          { name: 'Lip Flip', price: '£160', note: 'Natural lip eversion' },
          { name: 'Puppet Lines', price: '£160', note: 'Corner of mouth support' },
          { name: '1 Area', price: '£180', note: 'Choice of standard single zone' },
          { name: 'Chin Dimpling', price: '£180', note: 'Pebble/golf ball chin softening' },
          { name: 'Frown Lines', price: '£180', note: 'Glabellar 11s' },
          { name: 'Forehead Lines', price: '£230', note: 'Frontalis smoothing' },
          { name: '2 Areas Combination', price: '£250', badge: 'Popular', note: 'e.g. Frown + Forehead' },
          { name: '3 Areas Complete', price: '£280', badge: 'Best Value', note: 'Upper face rejuvenation' },
          { name: 'Neck Bands', price: '£290', note: 'Platysmal band relaxation' },
          { name: 'Jaw Slimming (Masseter)', price: '£320', note: 'Facial contour & teeth grinding' },
          { name: 'Extended Neck Bands (Nefertiti)', price: '£370', note: 'Full lower face & neck lift' },
        ],
      },
      {
        title: 'Dermal Fillers (1ml Hyaluronic Acid)',
        description: 'Premium CE-certified hyaluronic acid for volume restoration, projection and contour.',
        items: [
          { name: 'Cheek — Soft Tissue Volumisation', price: '£290', note: 'Mid-face gentle lift' },
          { name: 'Cleavage Lines', price: '£290', note: 'Decollete smoothing' },
          { name: 'Lip Enhancement (1ml)', price: '£290', badge: 'Popular', note: 'Definition & hydration' },
          { name: 'Non-Surgical Rhinoplasty', price: 'from £290', note: 'Dorsal hump & tip refinement' },
          { name: 'Nose to Mouth Lines (Nasolabial)', price: '£290', note: 'Fold softening' },
          { name: 'Tear Trough Rejuvenation', price: '£290', note: 'Under-eye hollows' },
          { name: 'Temples Volumisation', price: '£290', note: 'Upper facial balancing' },
          { name: 'Cheeks — Deep Contouring', price: '£350', note: 'Structural high-cheekbone lift' },
          { name: 'Jaw & Chin — Deep Contouring', price: '£350', note: 'Mandibular line projection' },
          { name: 'Hand Rejuvenation', price: '£470', note: 'Collagen & volume restoration' },
        ],
      },
      {
        title: 'Skin Boosters & Polynucleotides',
        description: 'Deep cellular hydration, extracellular matrix stimulation and collagen induction.',
        items: [
          { name: 'Profhilo (2ml) — Single Session', price: '£350', note: 'High & low molecular HA' },
          { name: 'Profhilo (2ml) — Course of 2', price: '£560', badge: 'Recommended Course', note: 'Standard clinical protocol' },
          { name: 'Salmon Sperm Injection (Rejuran/PDRN)', price: 'from £350', note: 'Regenerative polynucleotides' },
        ],
      },
    ],
  },
  {
    id: 'body-tech',
    title: 'Fat Dissolving & High-Tech Body',
    tagline: 'Aqualyx, Deso, Slimming Pen & Morpheus8',
    subcategories: [
      {
        title: 'Aqualyx Fat Dissolving Injections',
        description: 'Deoxycholic acid solution specifically formulated to target localized subcutaneous fat cells.',
        items: [
          { name: 'Course of 1 — Small Area', price: '£170', note: 'Chin, jowls' },
          { name: 'Course of 1 — Medium Sized Area', price: '£190', note: 'Arms, love handles, bra roll' },
          { name: 'Course of 1 — Large Area', price: '£230', note: 'Abdomen, thighs' },
          { name: 'Course of 3 — Small Area', price: '£408', badge: 'Course Saving', note: 'Complete 3-session protocol' },
          { name: 'Course of 3 — Medium Sized Area', price: '£456', badge: 'Course Saving', note: 'Complete 3-session protocol' },
          { name: 'Course of 3 — Large Area', price: '£552', badge: 'Course Saving', note: 'Complete 3-session protocol' },
        ],
      },
      {
        title: 'Deso Face & Body Fat Dissolving',
        description: 'Next-generation sodium deoxycholate formulated for facial refinement and body slimming.',
        items: [
          { name: 'Course of 1 — Small Area', price: '£150', note: 'Submental / double chin' },
          { name: 'Course of 1 — Medium Sized Area', price: '£170', note: 'Flanks, knees' },
          { name: 'Course of 1 — Large Area', price: '£210', note: 'Full stomach, outer thighs' },
          { name: 'Course of 3 — Small Area', price: '£360', badge: 'Course Saving', note: 'Full 3-session course' },
          { name: 'Course of 3 — Medium Sized Area', price: '£408', badge: 'Course Saving', note: 'Full 3-session course' },
          { name: 'Course of 3 — Large Area', price: '£504', badge: 'Course Saving', note: 'Full 3-session course' },
        ],
      },
      {
        title: 'Medical Weight Loss & Advanced Contouring',
        description: 'Clinically prescribed weight management and body sculpting technologies.',
        items: [
          { name: 'Slimming Pen — 1 Month Course', price: '£155', note: 'Full pen with clinician guide' },
          { name: 'Slimming Pen — 3 Months Course', price: '£450', badge: 'Full Program', note: 'Incl. consultation & monthly online reviews' },
          { name: 'Fat Freezing (Cryo Body Slimming)', price: 'from £95.00', note: 'Controlled cooling apoptosis' },
          { name: 'EMSCULPT Body Sculpt & Tightening', price: 'from £275', note: 'High-intensity electromagnetic toning' },
          { name: 'Body Slimming (Fat Loss & Cellulite)', price: 'from £195', note: 'Targeted ultrasound/RF' },
          { name: 'Morpheus8 Treatment — Facial', price: '£190', note: 'Subdermal fractional RF microneedling' },
          { name: 'Morpheus8 Treatment — Body', price: 'from £200', note: 'Deep tissue contouring' },
          { name: 'Emface Skin Tightening & Lifting', price: 'from £250', note: 'Synchronized RF + HIFES' },
          { name: 'Endolift — Fiber Lift', price: 'from £950', badge: 'Surgical Alternative', note: 'Interstitial sub-dermal laser' },
          { name: 'Tattoo Removal', price: 'from £350', note: 'Q-switch laser pigment shattering' },
        ],
      },
      {
        title: 'Fractional CO2 Laser Therapy',
        description: 'Ablative resurfacing for deep collagen remodeling, acne scarring and skin renewal.',
        items: [
          { name: 'Facial & Neck Resurfacing', price: '£300', note: 'Full ablative renewal' },
          { name: 'Hands Rejuvenation', price: '£200', note: 'Sun damage & age spots' },
          { name: 'Stretch Marks Treatment', price: '£200', note: 'Abdomen / thighs collagen rebuild' },
          { name: 'Scars Targeted Treatment', price: '£100', note: 'Surgical or localized scar revision' },
        ],
      },
    ],
  },
  {
    id: 'facials',
    title: 'Facials & Skin Care',
    tagline: 'Monday & Friday Specials, Aquafacial & Glass Skin',
    subcategories: [
      {
        title: 'Monday & Friday Clinical Specials',
        description: 'Exclusive brochure promotional pricing on our most popular intensive clinical facials.',
        items: [
          { name: 'Gold Facial Special', price: '£95', note: '40 Mins', badge: 'Mon & Fri Special', isSpecial: true },
          { name: 'EGF (Epidermal Growth Factor) Special', price: '£115', note: '40 Mins', badge: 'Mon & Fri Special', isSpecial: true },
          { name: 'Red Carpet Exfoliating Special', price: '£120', note: '45 Mins', badge: 'Mon & Fri Special', isSpecial: true },
          { name: 'Idebenone Antioxidant Facial Special', price: '£105', note: '40 Mins', badge: 'Mon & Fri Special', isSpecial: true },
        ],
      },
      {
        title: 'Targeted Skin Health & High-Tech Facials',
        description: 'Advanced clinical protocols designed to clear acne, rebuild collagen and restore barrier glow.',
        items: [
          { name: 'High Frequency for Acne', price: '£55', note: '30 Mins • Antibacterial ozone' },
          { name: 'Extractions with Scrubber, Steamer & Suction', price: '£55', note: '45 Mins • Deep pore decongestion' },
          { name: 'LED Light Therapy', price: '£25', note: '45 Mins • Red/blue phototherapy' },
          { name: 'Oxygen O2 Dome Facial', price: '£90', note: '45 Mins • 90% hyperbaric oxygen' },
          { name: 'Diamond Tip Microdermabrasion', price: '£60', note: '45 Mins • Mechanical resurfacing' },
          { name: 'Aquafacial Deep Infusion', price: '£150', note: '1 Hour • Vortex extraction & hydration', badge: 'Popular' },
          { name: 'Micro-Needling Collagen Induction Therapy', price: '£150', note: '1 Hour • Dermapen dermal puncture' },
          { name: 'Ultimate Glass Skin Protocol', price: '£250', note: '2 Hours • Multi-stage Korean glass glow', badge: 'Signature' },
          { name: 'Regenerative Scalp Facial Combination', price: '£95', note: '1h 30min • Follicle stimulation & peeling' },
          { name: 'BB Glow Semi-Permanent Facial', price: '£180', note: 'Meso-serum tint radiance' },
        ],
      },
    ],
  },
  {
    id: 'iv-lounge',
    title: 'IV Drip Lounge & PRP',
    tagline: 'Intravenous Micronutrients & Platelet-Rich Plasma',
    subcategories: [
      {
        title: 'IV Drip Lounge — Course of 1',
        description: '100% bioavailable vitamins, minerals and antioxidants infused directly into the bloodstream.',
        items: [
          { name: 'B12 Energy Booster Shot', price: '£45', note: 'Intramuscular methylcobalamin' },
          { name: 'Iron Booster Shot', price: '£75', note: 'Ferritin and cellular replenishment' },
          { name: 'Ginkgo Infusion', price: '£80', note: 'Cognitive focus & circulation' },
          { name: 'Performance Boosting Infusion', price: '£90', note: 'Amino acids & ATP synthesis' },
          { name: 'Pure Vitamin C High-Dose', price: '£100', note: 'Collagen boost & immunity' },
          { name: 'Vitamin Cocktail Comprehensive', price: '£110', note: 'Vital multivitamin complex' },
          { name: 'Detox — Hangover Cure Infusion', price: '£125', note: 'Electrolytes, glutathione & hydration' },
          { name: 'Zinc, Vitamin C & Mineral Blend', price: '£130', note: 'Dual immunity & tissue repair' },
          { name: 'Skinny Drip — Metabolic Boost', price: '£160', note: 'Carnitine & lipotropic agents', badge: 'Popular' },
          { name: 'Cinderella Brightening Infusion', price: '£200', note: 'High-dose glutathione & ascorbic acid', badge: 'Glow' },
          { name: 'Modified Myers — Immune Booster', price: '£200', note: 'Gold-standard wellness blend' },
        ],
      },
      {
        title: 'Platelet-Rich Plasma (PRP Autologous Therapy)',
        description: 'Concentrated growth factors derived from patient’s own plasma for tissue rejuvenation.',
        items: [
          { name: 'PRP for Hair Loss Treatment', price: '£150', note: 'Scalp follicular stimulation' },
          { name: 'PRP Facial ("Vampire Facial")', price: 'from £120', note: 'Collagen matrix remodeling' },
          { name: 'PRP Targeted Cosmetic Injection', price: '£180', note: 'Tear trough or localized deep repair' },
        ],
      },
    ],
  },
  {
    id: 'laser-hair',
    title: 'Laser Hair Removal',
    tagline: 'Alma Soprano Ice Painless Laser & Electrolysis',
    subcategories: [
      {
        title: 'Alma Soprano Laser Hair Removal — Body',
        description: 'Gold-standard Alexandrite/Diode dual wavelength technology with active contact cooling for all skin types.',
        items: [
          { name: 'Full Body Package', price: 'from £250', badge: 'Best Value', note: 'Complete head-to-toe bundle' },
          { name: 'Bikini Line', price: '£40', note: 'Standard panty line' },
          { name: 'High Bikini', price: '£40', note: 'Extended high rise' },
          { name: 'Half Arm', price: '£40', note: 'Forearms or upper arms' },
          { name: 'Underarms', price: '£40', note: 'Both sides' },
          { name: 'Brazilian', price: '£65', note: 'Front strip remaining' },
          { name: 'Chest', price: '£65', note: 'Full pectoral area' },
          { name: 'Full Arm', price: '£65', note: 'Shoulder to wrist' },
          { name: 'Half Leg', price: '£65', note: 'Lower or upper legs' },
          { name: 'Stomach', price: '£65', note: 'Full abdominal zone' },
          { name: 'Full Leg', price: '£85', note: 'Thigh to ankle' },
          { name: 'Back', price: '£85', note: 'Full back & shoulder tops' },
        ],
      },
      {
        title: 'Electrolysis Permanent Hair Removal',
        description: 'FDA-approved 100% permanent hair removal suitable for white, blonde, red and fine hair.',
        items: [
          { name: 'Electrolysis Treatment (1 Hour)', price: '£50', note: 'Precision individual follicle probe' },
        ],
      },
    ],
  },
  {
    id: 'hair-beauty',
    title: 'Hair Salon, Waxing & Brows',
    tagline: 'Cuts, Balayage, Keratin, Waxing & Lash Extensions',
    subcategories: [
      {
        title: 'Hair Cuts & Styling (Ladies & Girls)',
        description: 'Precision cutting, blow-drying and bespoke styling by master salon stylists.',
        items: [
          { name: 'Wash & Cut', price: 'from £20', note: 'Shampoo & cut' },
          { name: 'Cut & Blow Dry', price: 'from £25', note: 'Styling & finish' },
          { name: 'Blow Dry Standard', price: '£35', note: 'Short/medium hair' },
          { name: 'Blow Dry Long / Curly', price: '+£10', note: 'Additional styling time' },
          { name: 'Fringe Trim', price: '£10', note: 'Quick shaping' },
        ],
      },
      {
        title: 'Hair Color & Highlights',
        description: 'Multi-dimensional tones, balayage gradients and ammonia-free glossing.',
        items: [
          { name: 'T-Sections Highlights', price: 'from £70', note: 'Crown & hairline parting' },
          { name: 'Half Head Highlights', price: 'from £90', note: 'Top half & sides dimension' },
          { name: 'Full Head Highlights', price: 'from £110', note: 'Full coverage foil work' },
          { name: 'Balayage Freehand Coloring', price: '£90', note: 'Seamless hand-painted gradient' },
          { name: 'Roots Tint', price: '£50', note: 'Regrowth matching' },
          { name: 'Full Head Color', price: 'from £60', note: 'All-over uniform shade' },
          { name: 'Color In-Between Gloss', price: '£30', note: 'Refresher between services' },
          { name: 'Toner Application', price: 'from £15', note: 'Neutralize brassiness' },
        ],
      },
      {
        title: 'Intensive Hair Treatments',
        description: 'Protein smoothing, bond-building and deep restoration.',
        items: [
          { name: 'Keratin / Brazilian Blowdry', price: 'from £60', note: 'Anti-frizz smoothing treatment' },
          { name: 'Hair Botox Deep Conditioning', price: 'from £65', note: 'Fiber plumping & anti-aging' },
          { name: 'Nourishing / Conditioning Mask', price: '£20', note: 'Intense moisture lock' },
          { name: 'Olaplex Bond Rebuilding Service', price: '£65', note: 'Full standalone structural treatment' },
          { name: 'Olaplex Add-on to Color', price: '£15', note: 'Damage prevention in color bowl' },
        ],
      },
      {
        title: 'Lash, Brow & Semi-Permanent Makeup',
        description: 'Microblading, lash lifts, extensions and precision micro-pigmentation.',
        items: [
          { name: 'Classic Lash Extensions', price: '£55', note: '1:1 natural lash extension' },
          { name: 'Russian Lash Extensions', price: '£65', note: 'Handcrafted volume fans' },
          { name: 'Cluster Lashes', price: '£25', note: 'Quick glam clusters' },
          { name: 'Lash Lift & Perm', price: '£30', note: 'Curl enhancement' },
          { name: 'Lash Tint', price: '£10', note: 'Deep black/brown tint' },
          { name: 'Eyebrow Wax', price: '£8', note: 'Precision shaping' },
          { name: 'Eyebrow Tint', price: '£8', note: 'Color definition' },
          { name: 'Eyebrow Lamination', price: '£30', note: 'Feathery brushed-up brow finish' },
          { name: 'Microblading (Semi-Permanent)', price: '£250', note: 'Hair-stroke brow realism' },
          { name: 'Micro-Pigmentation', price: '£250', note: 'Machine shaded cosmetic brow' },
          { name: 'Ombré Brows', price: '£250', note: 'Soft powdered gradient' },
          { name: 'Semi-Permanent Eyeliner', price: '£200', note: 'Lash line enhancement' },
          { name: 'Lip Blushing', price: '£250', note: 'Aquarelle lip stain tint' },
          { name: 'Powder Brows', price: '£250', note: 'Defined makeup effect' },
        ],
      },
      {
        title: 'Body Waxing & Men/Kids Services',
        description: 'Hygienic warm & hot wax hair removal and barbering services.',
        items: [
          { name: 'Full Leg Wax', price: '£20', note: 'Ankles to upper thighs' },
          { name: 'Half Leg Wax', price: '£15', note: 'Lower or upper legs' },
          { name: 'Full Arm Wax', price: '£15', note: 'Wrist to shoulders' },
          { name: 'Half Arm Wax', price: '£10', note: 'Forearms' },
          { name: 'Underarm Wax', price: '£10', note: 'Both underarms' },
          { name: 'Full Face Wax', price: '£20', note: 'Cheeks, lip, chin, sides' },
          { name: 'Back & Shoulder Wax', price: '£40', note: 'Full back area' },
          { name: 'Bikini Wax', price: '£25', note: 'Standard tidy' },
          { name: 'Brazilian Wax', price: '£25', note: 'Deep intimate wax' },
          { name: "Clipper Buzz / Cut (Men/Kids)", price: '£15', note: 'All-over clipper trim' },
          { name: 'Cut & Finishing (Men/Kids)', price: '£20', note: 'Scissor cut & styled' },
          { name: 'Any Party Make-Up', price: 'from £25', note: 'Evening / event glam' },
          { name: 'Classic Manicure + Gel Polish', price: '£20', note: 'Cuticle care & gel set' },
          { name: 'Hair Extensions Fitting', price: 'from £300', note: 'Consultation required' },
        ],
      },
    ],
  },
];

const BROCHURE_PAGE_1_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD56gYgiDMXjY5hM_ovt-M8s7FPPFtBUdhB-zEtC3FUl8JHhWOAIJ31becBEb7imUW8isajBG_fc_zkfbPJEEVKwonnXglSbg2FAExjfmWOIKb0qCZdLHSRhyMiewovU2W_yVzgFh4jQ7EulCDZSCh_A2OPaPOGpOMEWI37Akoz6jEfeaSbN_VfzyW_hBRWOMvybrORwKgL8QhZWjiQUdVt8bsMTLrHvC4M9l0pdyiVjbmN4mrh160WjzSPojHNjSRWPA';

const BROCHURE_PAGE_2_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA6jNL9n7ZSHyEXlcJ0r0IwqQHuLDTmSB-jzqwVZyf7azj3FFcz0Yh-LxXtNgqsedic9D-vKAIEJ8EpruO6p728UYKHfqkZt5zxOn-2R2Q65Z5usN5zyJ7vlxKgX9DPuixrp_m3iJbkbiYsYbRQaPGyR-EoYGOsVI3wfksikQ8_vKmjXeHn7tQDbjCot_3KvN2lAyNI7hNPx5LXAeT6hwJ6L7iJcUzZAoy4zyo48mqEGRNwePYm13I4j0tdfAwATJQI2A';

interface BrochurePriceDirectoryProps {
  onBookTreatment?: (treatmentName: string) => void;
}

export const BrochurePriceDirectory: React.FC<BrochurePriceDirectoryProps> = ({
  onBookTreatment,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showBrochureModal, setShowBrochureModal] = useState<boolean>(false);
  const [modalBrochurePage, setModalBrochurePage] = useState<1 | 2>(1);

  // Filter categories and subcategories based on active tab & search query
  const filteredCategories = useMemo(() => {
    let result = BROCHURE_CATEGORIES;

    if (activeTab !== 'all') {
      result = result.filter((cat) => cat.id === activeTab);
    }

    if (!searchQuery.trim()) {
      return result;
    }

    const q = searchQuery.toLowerCase().trim();

    return result
      .map((cat) => {
        const matchingSub = cat.subcategories
          .map((sub) => {
            const matchesSub =
              sub.title.toLowerCase().includes(q) ||
              (sub.description && sub.description.toLowerCase().includes(q));

            const filteredItems = sub.items.filter(
              (item) =>
                item.name.toLowerCase().includes(q) ||
                item.price.toLowerCase().includes(q) ||
                (item.note && item.note.toLowerCase().includes(q)) ||
                (item.badge && item.badge.toLowerCase().includes(q))
            );

            if (matchesSub) {
              return sub;
            }
            if (filteredItems.length > 0) {
              return { ...sub, items: filteredItems };
            }
            return null;
          })
          .filter(Boolean) as BrochureSubCategory[];

        return {
          ...cat,
          subcategories: matchingSub,
        };
      })
      .filter((cat) => cat.subcategories.length > 0);
  }, [activeTab, searchQuery]);

  const totalVisibleItems = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => {
      return (
        acc +
        cat.subcategories.reduce((subAcc, sub) => subAcc + sub.items.length, 0)
      );
    }, 0);
  }, [filteredCategories]);

  return (
    <div className="mt-14 sm:mt-20">
      {/* Container with luxury border and subtle cream gradient */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#D8C2A3]/60 shadow-sm overflow-hidden">
        {/* 1. Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-neutral-900 to-[#1e1e1e] text-white px-5 sm:px-8 md:px-12 py-7 sm:py-9 relative overflow-hidden">
          {/* Subtle gold glow overlay */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-luxury-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#D8C2A3]/25 text-[#f4ebe1] border border-[#D8C2A3]/40 tracking-wider uppercase font-sans">
                  <FileText className="w-3 h-3 text-luxury-gold" />
                  Official Medispa Price Directory
                </span>
                <span className="text-[11px] text-stone-400 font-light hidden sm:inline">
                  374 Baring Road, SE12 0EF
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-white tracking-tight">
                Complete Treatment Rate Card
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light mt-2 leading-relaxed">
                Explore our exhaustive printed clinic brochure rate card — including single procedures, multi-session course savings, and exclusive Monday & Friday clinical specials.
              </p>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setModalBrochurePage(1);
                  setShowBrochureModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-medium transition-all cursor-pointer backdrop-blur-xs"
              >
                <Eye className="w-3.5 h-3.5 text-luxury-gold" />
                <span>View Printed Brochure</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onBookTreatment) onBookTreatment('General Aesthetic Consultation');
                }}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-luxury-gold hover:bg-[#c49a6c] text-stone-900 font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book In Clinic</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Controls Bar: Search & Category Pills */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-[#D8C2A3]/30 bg-[#fbf9f6]/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Horizontal Filter Tabs */}
            <div className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-max pb-1 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  All Brochure Sections
                </button>
                {BROCHURE_CATEGORIES.map((cat) => {
                  const isActive = activeTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveTab(cat.id)}
                      className={`px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Directory Search */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rate card (e.g. Aqualyx, B12, Laser)..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-[#D8C2A3]/70 focus:border-stone-900 rounded-full text-xs focus:outline-none transition-all placeholder:text-stone-400 font-light"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                  aria-label="Clear directory search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Results count label */}
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-light">
            <span>
              Showing <strong className="text-stone-900 font-medium">{totalVisibleItems}</strong> verified brochure pricing items
            </span>
            {searchQuery && (
              <span className="text-luxury-gold font-medium">
                Filtering by &quot;{searchQuery}&quot;
              </span>
            )}
          </div>
        </div>

        {/* 3. Brochure Content Grid */}
        <div className="p-4 sm:p-6 md:p-8 space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <p className="text-sm">No treatments found matching &quot;{searchQuery}&quot;.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-3 text-xs text-stone-900 font-semibold underline underline-offset-4 cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <section key={category.id} className="space-y-5">
                {/* Section Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-serif font-medium text-stone-900">
                      {category.title}
                    </h3>
                    <span className="text-xs text-stone-400 font-light hidden md:inline">
                      — {category.tagline}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans text-stone-500 uppercase tracking-wider">
                    Official Brochure Listing
                  </span>
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
                  {category.subcategories.map((sub, idx) => (
                    <div
                      key={idx}
                      className="bg-[#faf8f5]/60 hover:bg-[#faf8f5] rounded-xl sm:rounded-2xl border border-stone-200/90 p-4 sm:p-5 transition-all duration-200"
                    >
                      {/* Subcategory Title */}
                      <div className="mb-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm sm:text-base font-serif font-medium text-stone-900">
                            {sub.title}
                          </h4>
                          <span className="text-[11px] font-mono text-stone-400 shrink-0">
                            {sub.items.length} options
                          </span>
                        </div>
                        {sub.description && (
                          <p className="text-xs text-stone-500 font-light mt-0.5 leading-relaxed">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="divide-y divide-stone-200/70">
                        {sub.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="py-2.5 flex items-center justify-between gap-3 group"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs sm:text-sm font-medium text-stone-900 group-hover:text-black transition-colors">
                                  {item.name}
                                </span>
                                {item.badge && (
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-tight ${
                                      item.isSpecial
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                        : 'bg-stone-900 text-white'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.note && (
                                <p className="text-[11px] text-stone-500 font-light mt-0.5 truncate">
                                  {item.note}
                                </p>
                              )}
                            </div>

                            {/* Price & Book Trigger */}
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs sm:text-sm font-serif font-semibold text-stone-900">
                                {item.price}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onBookTreatment) onBookTreatment(item.name);
                                }}
                                className="opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-stone-200 text-stone-700 hover:text-black cursor-pointer"
                                title={`Book ${item.name}`}
                                aria-label={`Book ${item.name}`}
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        {/* 4. Verified Medispa Brochure Footer Card with Mon & Fri Specials info */}
        <div className="bg-[#f5efe6] border-t border-[#D8C2A3]/60 px-5 sm:px-8 py-5 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-stone-800">
                <span className="inline-flex items-center gap-1 text-luxury-gold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Monday & Friday Facial Specials
                </span>
                <span>•</span>
                <span className="font-light text-stone-600">Gold £95 | EGF £115 | Red Carpet £120 | Idebenone £105</span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                Prices and promotional offers are accurately synchronized with the printed clinic brochure at 374 Baring Road, SE12 0EF.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:02088572000"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#D8C2A3] text-stone-900 text-xs font-medium hover:border-black transition-colors"
              >
                <Phone className="w-3 h-3 text-[#a88d6b]" />
                <span>020 8857 2000</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setModalBrochurePage(1);
                  setShowBrochureModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Eye className="w-3 h-3 text-luxury-gold" />
                <span>View Scans</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Modal: High-Resolution Scanned Brochure Viewer */}
      {showBrochureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-stone-900 text-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/10">
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-stone-800 flex items-center justify-between gap-3 bg-stone-950">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-xs sm:text-sm font-serif font-light text-white tracking-wide">
                  Age Reversal Medispa — Printed Brochure
                </span>
                {/* Page Switcher Tabs */}
                <div className="flex items-center bg-stone-800 rounded-full p-0.5 border border-stone-700">
                  <button
                    type="button"
                    onClick={() => setModalBrochurePage(1)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      modalBrochurePage === 1
                        ? 'bg-luxury-gold text-stone-950 font-semibold'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Page 1: Facials & Salon
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalBrochurePage(2)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      modalBrochurePage === 2
                        ? 'bg-luxury-gold text-stone-950 font-semibold'
                        : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Page 2: Injectables & Tech
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBrochureModal(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close brochure modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="flex-1 overflow-auto bg-stone-950 p-2 sm:p-4 flex items-center justify-center">
              <img
                src={modalBrochurePage === 1 ? BROCHURE_PAGE_1_URL : BROCHURE_PAGE_2_URL}
                alt={
                  modalBrochurePage === 1
                    ? 'Age Reversal Medispa Brochure Page 1'
                    : 'Age Reversal Medispa Brochure Page 2'
                }
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                <span>374 Baring Road, SE12 0EF • Tel: 020 8857 2000</span>
              </div>
              <a
                href={modalBrochurePage === 1 ? BROCHURE_PAGE_1_URL : BROCHURE_PAGE_2_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-luxury-gold hover:underline cursor-pointer"
              >
                <span>Open high-res in new tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
