import React, { useState, useEffect } from 'react';
import { saveConsultation, saveInquiry, getOurLocationsConfig } from '../lib/adminStore';
import { MapPin, Clock, ExternalLink, Map, Building2, Send, Check, AlertCircle, Mail, Phone, PhoneCall, Sparkles, Search, DollarSign, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OurLocationsConfig } from '../types';

interface TreatmentItem {
  id: string;
  name: string;
  price: string;
  time: string;
  desc: string;
}

interface CategoryItem {
  id: string;
  name: string;
  items: TreatmentItem[];
}

interface AreaItem {
  id: string;
  name: string;
  categories: CategoryItem[];
}

export const CLINICAL_AREAS_DB: AreaItem[] = [
  {
    id: 'face',
    name: 'Face',
    categories: [
      {
        id: 'injectables',
        name: 'INJECTABLE TREATMENTS',
        items: [
          { id: 'exosome', name: 'Exosome Regenerative Therapy', price: '$650', time: '45 - 60 Mins', desc: 'Cellular-level skin rejuvenation using pure clinical-grade exosomes.' },
          { id: 'migraines', name: 'Migraines Treatment', price: '$450', time: '30 Mins', desc: 'Targeted clinical neurotoxin therapy to alleviate chronic migraine pain.' },
          { id: 'profhilo', name: 'Profhilo Injectable Hydration', price: '$450', time: '30 Mins', desc: 'Hyaluronic acid tissue remodeling for deep dermis hydration & firmness.' },
          { id: 'polynucleotide', name: 'Polynucleotide Bio-Regeneration', price: '$490', time: '40 Mins', desc: 'DNA-level cell repair and under-eye renewal using purified nucleotides.' },
          { id: 'jaw-reduction', name: 'Non-Surgical Jaw Reduction', price: '$480', time: '30 Mins', desc: 'Masseter muscle relaxation to slim the lower third of the face.' },
          { id: 'gummy-smile', name: 'Gummy Smile Treatment', price: '$220', time: '15 Mins', desc: 'Subtle neurotoxin adjustments to lower the upper lip and balance smiles.' },
          { id: 'eyebrow-lifting', name: 'Eyebrow Lifting', price: '$280', time: '20 Mins', desc: 'Non-surgical brow elevation to open and refresh the gaze.' },
          { id: 'smoothing', name: 'Lines & Wrinkles Smoothing', price: '$350', time: '30 Mins', desc: 'Expert dynamic smoothing targeting forehead, frown lines, and crows feet.' },
          { id: 'collagen-stimulator', name: 'Collagen Stimulator (Sculptra/Lanluma)', price: '$750', time: '45 Mins', desc: 'Deep poly-L-lactic acid stimulus to rebuild facial volume naturally.' }
        ]
      },
      {
        id: 'fillers',
        name: 'DERMAL FILLERS FOR FACE',
        items: [
          { id: 'temple-filler', name: 'Temple Filler', price: '$420', time: '30 Mins', desc: 'Rebuilding temporal support to soften shadows and smooth lateral brows.' },
          { id: 'forehead-filler', name: 'Forehead Filler', price: '$480', time: '45 Mins', desc: 'Premium structural hydration to smooth forehead contouring.' },
          { id: 'earlobe-filler', name: 'Earlobe Filler', price: '$250', time: '20 Mins', desc: 'Restoring volume to stretched or drooping lobes for support.' },
          { id: 'frown-treatment', name: 'Frown Line Filler', price: '$350', time: '20 Mins', desc: 'Direct precision filling for set-in glabella lines.' },
          { id: 'jawline-contouring', name: 'Contouring the Jaw Line', price: '$580', time: '45 Mins', desc: 'Sculpting mandibular angles to build a sleek, refined jaw profile.' },
          { id: 'chin-enhancement', name: 'Chin Enhancement', price: '$390', time: '30 Mins', desc: 'Proportional chin projection to restore profile alignment.' },
          { id: 'cheek-enhancement', name: 'Cheek Enhancement', price: '$480', time: '30 Mins', desc: 'Midface lateral support restoring soft feminine or masculine contours.' },
          { id: 'teartrough-darkcircles', name: 'Eye Bag, Dark Circles & Tear Trough', price: '$550', time: '45 Mins', desc: 'Extremely precise micro-filler placement to correct under-eye shadow lines.' },
          { id: 'nasolabial-folds', name: 'Nose to Mouth Lines, Folds & Wrinkles', price: '$390', time: '30 Mins', desc: 'Hydrating deep nasolabial creases to soften shadow casting.' },
          { id: 'rhinoplasty', name: 'Non-Surgical Rhinoplasty', price: '$650', time: '45 Mins', desc: 'Liquid nose contouring using high-cohesivity fillers to smooth bridges.' },
          { id: 'lip', name: 'Precision Lip Enhancement', price: '$380', time: '30 - 45 Mins', desc: 'Bespoke lip shaping emphasizing proportion, border, and vermillion hydration.' },
          { id: 'filler-dissolving', name: 'Dermal Filler Dissolving', price: '$250', time: '30 Mins', desc: 'Safe hyaluronidase dissolution to correct migrated or over-filled areas.' }
        ]
      },
      {
        id: 'rejuvenation',
        name: 'SKIN REJUVENATION',
        items: [
          { id: 'facetite', name: 'FaceTite Radiofrequency', price: '$1,800', time: '90 Mins', desc: 'Subdermal tightening combining RF energy with internal tissue coagulation.' },
          { id: 'morpheus8', name: 'Morpheus8 RF Microneedling', price: '$850', time: '60 - 90 Mins', desc: 'Fractional remodeling utilizing RF-infused microneedles.' },
          { id: 'ultherapy', name: 'Ultherapy Non-Surgical Lift', price: '$1,200', time: '60 - 120 Mins', desc: 'Deep SMAS layer micro-focused ultrasound tightening.' },
          { id: 'pdo-threads', name: 'PDO Thread Lift', price: '$950', time: '60 Mins', desc: 'Polydioxanone structural suture suspension to counter deep sagging.' },
          { id: 'skin-tightening', name: 'Skin Tightening Treatment', price: '$400', time: '45 Mins', desc: 'Non-invasive heating sessions stimulating quick fiber contraction.' },
          { id: 'men-treatments', name: 'Treatments For Men', price: '$380', time: '45 Mins', desc: 'Targeted masculine dermal and structural contouring protocols.' },
          { id: 'mesotherapy', name: 'Mesotherapy Cocktail Infusion', price: '$290', time: '45 Mins', desc: 'Superficial micro-droplets of rich vitamins, amino acids, and hydration.' },
          { id: 'prx-peel', name: 'PRX-T33 No-Needle Biorejuvenation', price: '$250', time: '30 Mins', desc: 'Intense dermis renewal peel that bypasses epidermal shedding completely.' },
          { id: 'skinpen', name: 'SkinPen Microneedling', price: '$280', time: '45 Mins', desc: 'Medical-grade mechanical collagen induction therapy.' },
          { id: 'hyperpigmentation', name: 'Hyperpigmentation Care', price: '$320', time: '45 Mins', desc: 'Clinical depigmenting solutions targetting melasma and dark spots.' },
          { id: 'cosmelan', name: 'Cosmelan Depigmentation Protocol', price: '$850', time: '60 Mins', desc: 'The gold standard clinical peel mask program for severe melasma.' },
          { id: 'skin-peels', name: 'Medical-Grade Skin Peels', price: '$180', time: '30 Mins', desc: 'Advanced chemical resurfacing tailored to active acne, texture, or tone.' },
          { id: 'obagi', name: 'Obagi Nu-Derm Skin System', price: '$390', time: '30 Mins', desc: 'Clinical setup for cellular transformation using prescription lines.' },
          { id: 'zo-health', name: 'ZO Skin Health Protocol', price: '$250', time: '30 Mins', desc: 'High-potency skin health regimens configured for barrier repair.' }
        ]
      }
    ]
  },
  {
    id: 'body',
    name: 'Body',
    categories: [
      {
        id: 'body-fillers',
        name: 'DERMAL FILLERS FOR BODY',
        items: [
          { id: 'hand-rejuve', name: 'Hydrating Hand Rejuvenation', price: '$390', time: '30 Mins', desc: 'Hyaluronic dermal hydration to restore crepey, dehydrated dorsal hand skin.' },
          { id: 'radiesse-hands', name: 'Radiesse Hand Restoration', price: '$550', time: '30 Mins', desc: 'Calcium hydroxylapatite bio-stimulation to mask prominent veins.' }
        ]
      },
      {
        id: 'body-non-surgical',
        name: 'NON SURGICAL TREATMENTS',
        items: [
          { id: 'body-exosome', name: 'Body Exosome Tissue Repair', price: '$750', time: '45 Mins', desc: 'Cellular growth signaling factors focused on body scarring or laxity.' },
          { id: 'hyperhidrosis', name: 'Excessive Sweating (Hyperhidrosis) Treatment', price: '$490', time: '30 Mins', desc: 'Neurotoxin injections to underarms or palms to eliminate hyperhidrosis.' },
          { id: 'cellulite-treatment', name: 'Effective Cellulite Treatment', price: '$450', time: '45 Mins', desc: 'Integrated dynamic tissue breakdown targeting cellulite dimples.' },
          { id: 'port-wine', name: 'Port Wine Stain Reduction', price: '$350', time: '30 Mins', desc: 'Clinical vascular targeting of deep capillary malformations.' },
          { id: 'nail-fungus', name: 'Nail Fungus Laser Therapy', price: '$150', time: '15 Mins', desc: 'High-intensity thermal eradication of deep nail-bed fungal infections.' },
          { id: 'leg-veins', name: 'Leg Veins Laser / Sclerotherapy', price: '$320', time: '30 Mins', desc: 'Chemical or thermal occlusion of spider veins on legs.' },
          { id: 'vascular', name: 'Vascular & Hyperpigmentation Clearing', price: '$290', time: '30 Mins', desc: 'Clinical clearing of broken capillaries, cherry angiomas, and spot lesions.' },
          { id: 'hayfever', name: 'Hay Fever Treatment', price: '$180', time: '15 Mins', desc: 'Intramuscular therapeutic alleviation of seasonal hayfever symptoms.' }
        ]
      },
      {
        id: 'female-intimate',
        name: 'FEMALE INTIMATE TREATMENTS',
        items: [
          { id: 'labia-enhance', name: 'Labia Enhancement (Volume Restoration)', price: '$650', time: '45 Mins', desc: 'Hyaluronic acid sculpting to restore youthful volume and protect structures.' },
          { id: 'vaginal-dryness', name: 'Vaginal Dryness PRP/Profhilo', price: '$480', time: '30 Mins', desc: 'Intense hydration bio-stimulation to restore tissue lubrication and comfort.' }
        ]
      },
      {
        id: 'male-intimate',
        name: 'MALE INTIMATE TREATMENTS',
        items: [
          { id: 'penoplasty', name: 'Non-Surgical Penoplasty', price: '$1,900', time: '60 Mins', desc: 'Symmetrical structural girth enhancement utilizing specialized high-density bio-fillers.' }
        ]
      },
      {
        id: 'fat-reduction',
        name: 'FAT REDUCTION',
        items: [
          { id: 'aqualyx', name: 'Aqualyx Fat Dissolving Injection', price: '$350', time: '30 - 45 Mins', desc: 'Targeted specialized localized fat lipolysis via deoxycholic acid formulation.' },
          { id: 'desoface-desobody', name: 'Desoface® And Desobody® Injections', price: '$380', time: '30 - 45 Mins', desc: 'Second-generation localized fat dissolving with enhanced client comfort.' }
        ]
      }
    ]
  },
  {
    id: 'buttocks',
    name: 'Buttocks',
    categories: [
      {
        id: 'buttock-enhance',
        name: 'BUTTOCK ENHANCEMENT',
        items: [
          { id: 'buttock', name: 'Non-Surgical Buttock Lift', price: '$1,500', time: '60 Mins', desc: 'Gluteal projection and volume shaping using bio-stimulators.' },
          { id: 'lanluma', name: 'Lanluma Volume Contouring', price: '$1,800', time: '60 Mins', desc: 'PLLA-based body sculpting formulation to restore deep structural volume.' },
          { id: 'sculptra-butt', name: 'Sculptra Butt Lift', price: '$1,900', time: '60 Mins', desc: 'Deep poly-L-lactic acid stimulus to lift, smooth, and round gluteal arches.' }
        ]
      },
      {
        id: 'contour-refine',
        name: 'CONTOURING & REFINEMENT',
        items: [
          { id: 'hip-dip', name: 'Hip Dip Correction', price: '$1,600', time: '60 Mins', desc: 'Targeted lateral depression filling to sculpt a seamless curvy silhouette.' },
          { id: 'asymmetry-butt', name: 'Asymmetry Correction', price: '$1,400', time: '60 Mins', desc: 'Restoring volumetric balance between gluteal hemispheres.' },
          { id: 'non-surg-sculpt', name: 'Non-Surgical Sculpting', price: '$1,200', time: '45 Mins', desc: 'Sleek muscle-toning and skin-tightening aesthetic integration.' }
        ]
      },
      {
        id: 'cellulite-texture',
        name: 'CELLULITE & TEXTURE',
        items: [
          { id: 'cellulite-smooth', name: 'Cellulite Smoothing', price: '$550', time: '45 Mins', desc: 'Injectable and radiofrequency remodeling targeting cell chambers.' },
          { id: 'subcision', name: 'Deep-tissue Subcision', price: '$750', time: '60 Mins', desc: 'Clinical release of fibrous septae pulling skin down to smooth deep dimples.' },
          { id: 'rf-buttock', name: 'Radiofrequency Therapy', price: '$350', time: '30 Mins', desc: 'Deep thermal collagen remodeling to tighten gluteal fold crepiness.' }
        ]
      }
    ]
  },
  {
    id: 'minor-surgery-scars',
    name: 'Minor Surgery & Scars',
    categories: [
      {
        id: 'minor-surgery-cat',
        name: 'MINOR SURGERY',
        items: [
          { id: 'mole-removal', name: 'Mole & Lesion Removal', price: '$290', time: '30 Mins', desc: 'Safe clinical removal of moles with aesthetic suture closure.' },
          { id: 'cyst-removal', name: 'Cyst Removal', price: '$380', time: '45 Mins', desc: 'Surgical excision of epidermal or sebaceous cysts including sac extraction.' },
          { id: 'scarfree-excision', name: 'Precision Scar-free Excision', price: '$450', time: '45 Mins', desc: 'Feather-light surgical removal of cutaneous lesions to minimize marking.' },
          { id: 'lobe-correction', name: 'Lobe Correction', price: '$350', time: '45 Mins', desc: 'Reconstructing torn or heavily stretched earlobes under local block.' }
        ]
      },
      {
        id: 'facial-rejuve-cat',
        name: 'FACIAL REJUVENATION',
        items: [
          { id: 'blepharoplasty', name: 'Plasma Blepharoplasty (Non-Surgical)', price: '$750', time: '45 - 60 Mins', desc: 'Plasma arc upper or lower eyelid skin contraction & sublimation.' },
          { id: 'upper-eye', name: 'Upper Eyelid Rejuvenation', price: '$450', time: '40 Mins', desc: 'Non-surgical targetting of eyelid skin crepeyness and mild sagging.' },
          { id: 'lower-eye', name: 'Lower Eyelid Rejuvenation', price: '$450', time: '40 Mins', desc: 'Correcting dark circles, puffiness, and skin laxity beneath eyes.' }
        ]
      },
      {
        id: 'scar-revision-cat',
        name: 'SCAR REVISION',
        items: [
          { id: 'co2-laser', name: 'Fractional CO2 Laser', price: '$590', time: '45 Mins', desc: 'Ablative laser resurfacing targetting deep acne pitting and burn scars.' },
          { id: 'subcision-therapy', name: 'Subcision Therapy', price: '$350', time: '30 Mins', desc: 'Mechanical release of bound fibrous tissue anchors to lift depressed scars.' },
          { id: 'steroid-scar', name: 'Steroid Scar Flattening', price: '$120', time: '15 Mins', desc: 'Micro-dose triamcinolone injections to reduce hypertrophic or keloid scars.' }
        ]
      },
      {
        id: 'collagen-therapy-cat',
        name: 'COLLAGEN THERAPY',
        items: [
          { id: 'prp-needling', name: 'PRP Microneedling', price: '$380', time: '60 Mins', desc: 'Platelet-rich plasma combined with medical needling for scar healing.' },
          { id: 'growth-factor', name: 'Growth Factor Therapy', price: '$290', time: '45 Mins', desc: 'Infusing pure active bio-engineered growth signals for deep cell repair.' }
        ]
      }
    ]
  }
];

export const findTreatmentInDB = (searchKey: string) => {
  const searchLower = searchKey.toLowerCase().trim();
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      for (const item of cat.items) {
        if (
          item.id === searchLower || 
          item.name.toLowerCase().includes(searchLower) || 
          searchLower.includes(item.id)
        ) {
          return { area, category: cat, item };
        }
      }
    }
  }
  return null;
};

interface LocationsAndConsultationProps {
  preselectedService?: string;
  onTreatmentClick?: (name: string) => void;
}

export default function LocationsAndConsultation({ preselectedService, onTreatmentClick }: LocationsAndConsultationProps = {}) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>('face');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('injectables');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(['exosome']);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const addTreatment = (id: string) => {
    if (!selectedTreatments.includes(id)) {
      setSelectedTreatments(prev => [...prev, id]);
    }
  };

  const removeTreatment = (id: string) => {
    if (selectedTreatments.length > 1) {
      setSelectedTreatments(prev => prev.filter(t => t !== id));
    }
  };

  const parsePrice = (priceStr: string): number => {
    const cleaned = priceStr.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  const getSelectedTreatmentsData = () => {
    const list: Array<{ areaName: string, catName: string, id: string, name: string, price: string, time: string, desc: string }> = [];
    selectedTreatments.forEach(tid => {
      for (const area of CLINICAL_AREAS_DB) {
        for (const cat of area.categories) {
          const found = cat.items.find(i => i.id === tid);
          if (found) {
            list.push({
              areaName: area.name,
              catName: cat.name,
              ...found
            });
            break;
          }
        }
      }
    });
    return list;
  };

  // Handle Area Change
  const handleAreaChange = (areaId: string) => {
    setSelectedAreaId(areaId);
    const area = CLINICAL_AREAS_DB.find(a => a.id === areaId);
    if (area && area.categories.length > 0) {
      const firstCat = area.categories[0];
      setSelectedCategoryId(firstCat.id);
      if (firstCat.items.length > 0) {
        setBooking(prev => ({ ...prev, procedure: firstCat.items[0].id }));
      }
    }
  };

  // Handle Category Change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    const area = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
    const cat = area?.categories.find(c => c.id === catId);
    if (cat && cat.items.length > 0) {
      setBooking(prev => ({ ...prev, procedure: cat.items[0].id }));
    }
  };

  // Listen to preselected service changes
  useEffect(() => {
    if (preselectedService) {
      const found = findTreatmentInDB(preselectedService);
      if (found) {
        setSelectedAreaId(found.area.id);
        setSelectedCategoryId(found.category.id);
        setBooking(prev => ({
          ...prev,
          procedure: found.item.id,
          improvement: `Inquiry about ${found.item.name}`
        }));
        setSelectedTreatments([found.item.id]);
      } else {
        setSelectedAreaId('face');
        setSelectedCategoryId('injectables');
        setBooking(prev => ({
          ...prev,
          procedure: 'exosome',
          improvement: `Inquiry about ${preselectedService}`
        }));
        setSelectedTreatments(['exosome']);
      }
    } else {
      setSelectedAreaId('face');
      setSelectedCategoryId('injectables');
      setBooking(prev => ({
        ...prev,
        procedure: 'exosome'
      }));
      setSelectedTreatments(['exosome']);
    }
  }, [preselectedService]);

  const [locationsConfig, setLocationsConfig] = useState<OurLocationsConfig | null>(null);
  const [inquiries, setInquiries] = useState<Record<string, { name: string; email: string; subject: string; message: string }>>({});
  const [submittedInquiries, setSubmittedInquiries] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocationsConfig(getOurLocationsConfig());
  }, []);

  // Main Consultation Booking Form State
  const [booking, setBooking] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    procedure: '',
    improvement: '',
    doctor: '',
    date: '',
    bestTime: 'morning',
    hearAboutUs: 'search',
    stayInTouch: [] as string[],
    notes: '',
    agreePrivacy: false,
    agreeOffers: false
  });

  const toggleStayInTouch = (option: string) => {
    setBooking(prev => {
      const alreadySelected = prev.stayInTouch.includes(option);
      return {
        ...prev,
        stayInTouch: alreadySelected
          ? prev.stayInTouch.filter(item => item !== option)
          : [...prev.stayInTouch, option]
      };
    });
  };
  const [submittedBooking, setSubmittedBooking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'limited'>('idle');

  useEffect(() => {
    if (booking.date) {
      setAvailabilityStatus('checking');
      const timer = setTimeout(() => {
        const dateObj = new Date(booking.date);
        const day = dateObj.getDay();
        // Weekend or Friday afternoons generally limited
        if (day === 0 || day === 6 || (day === 5 && booking.bestTime === 'afternoon')) {
          setAvailabilityStatus('limited');
        } else {
          setAvailabilityStatus('available');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAvailabilityStatus('idle');
    }
  }, [booking.date, booking.bestTime]);

  const handleInquirySubmit = (locationId: string, locationName: string, e: React.FormEvent) => {
    e.preventDefault();
    const inquiry = inquiries[locationId] || { name: '', email: '', subject: '', message: '' };
    saveInquiry({
      location: locationName,
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message
    });
    setSubmittedInquiries(prev => ({ ...prev, [locationId]: true }));
    setTimeout(() => {
      setInquiries(prev => ({
        ...prev,
        [locationId]: { name: '', email: '', subject: '', message: '' }
      }));
    }, 1000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTreatmentsData = getSelectedTreatmentsData().map(item => ({
      id: item.id,
      name: item.name,
      price: item.price
    }));

    saveConsultation({
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      bestTime: booking.bestTime,
      hearAboutUs: booking.hearAboutUs,
      notes: booking.notes,
      improvement: booking.improvement,
      doctor: booking.doctor,
      stayInTouch: booking.stayInTouch,
      agreePrivacy: booking.agreePrivacy,
      agreeOffers: booking.agreeOffers,
      treatments: selectedTreatmentsData
    });

    setSubmittedBooking(true);
  };

  return (
    <div className="w-full">
      {/* 1. Our Locations Section */}
      <section 
        id="locations"
        className="py-20 relative overflow-hidden bg-cover bg-center border-b border-luxury-border/40"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.2)), url("${locationsConfig?.backgroundImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuASZKoKhij5mKIMYIaSVfVDbHCQQhOAHm8VMWFbq2S9QwpVP-JCdU5_c4F2CWomVS7s0nYacWblWSVAmRkM3JF7HYiH8YGA1tQYJ9P4_Wz36RmFZc5TRrU9zSh9sLum6Usm_7XuOGMK7KjFm1bhV-DZ_m8xWC2FrOkjqbzaH29MaU4j4NFRn3lufmvMKk_n5DbqDPwFUbfl7PVHFBiM4oZmy3SaXkVVSPxZPj-hJudGKMUQUMAwsSL-8yF78wwhmkFx6ryzzjEFtw'}")`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
              {locationsConfig?.heading || 'Our Locations'}
            </h2>
            <p className="font-sans text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed">
              {locationsConfig?.description || 'Conveniently located in the heart of London\'s medical district, providing world-class care across multiple specialized facilities.'}
            </p>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locationsConfig?.locations.map((loc) => {
              const inquiry = inquiries[loc.id] || { name: '', email: '', subject: '', message: '' };
              const isSubmitted = submittedInquiries[loc.id] || false;

              return (
                <div key={loc.id} className="flex flex-col bg-luxury-card rounded-[24px] overflow-hidden border border-luxury-border shadow-sm hover:border-luxury-gold transition-all duration-300 animate-fade-in">
                  
                  {/* Map/Image Placeholder Banner */}
                  <div className="aspect-[16/9] bg-luxury-secondary/30 flex flex-col items-center justify-center border-b border-white/40 group relative overflow-hidden">
                    {loc.bannerType === 'Map' ? (
                      <Map className="h-12 w-12 text-luxury-subtext mb-2 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <Building2 className="h-12 w-12 text-luxury-subtext mb-2 group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <span className="text-xs font-bold font-sans tracking-wider text-luxury-subtext uppercase">{loc.imageUrl || 'Interactive Satellite View'}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                  </div>

                  <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-[22px] text-luxury-text mb-4">
                        {loc.name}
                      </h3>
                      
                      <div className="space-y-3.5 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-luxury-text shrink-0 mt-0.5" />
                          <p className="font-sans text-sm text-luxury-subtext leading-relaxed">
                            {loc.address}
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-luxury-text shrink-0 mt-0.5" />
                          <p className="font-sans text-sm text-luxury-subtext">
                            {loc.hours}
                          </p>
                        </div>
                      </div>

                      <a 
                        href={loc.mapsUrl}
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 text-sm text-luxury-text hover:text-luxury-subtext font-bold font-sans transition-colors group"
                      >
                        <span>Get Directions</span>
                        <ExternalLink className="h-4 w-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>

                    {/* Quick Inquiry Form */}
                    <div className="mt-8 pt-8 border-t border-luxury-border/40">
                      <p className="font-sans font-bold text-sm text-luxury-text mb-4">Quick Inquiry</p>
                      
                      <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                          <motion.form 
                            key={`form-${loc.id}`}
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={(e) => handleInquirySubmit(loc.id, loc.name, e)} 
                            className="space-y-3"
                          >
                            <div className="grid grid-cols-2 gap-3">
                              <input 
                                type="text" 
                                required
                                placeholder="Name" 
                                value={inquiry.name}
                                onChange={(e) => setInquiries({
                                  ...inquiries,
                                  [loc.id]: { ...inquiry, name: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-luxury-border bg-luxury-secondary text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all"
                              />
                              <input 
                                type="email" 
                                required
                                placeholder="Email" 
                                value={inquiry.email}
                                onChange={(e) => setInquiries({
                                  ...inquiries,
                                  [loc.id]: { ...inquiry, email: e.target.value }
                                })}
                                className="w-full px-4 py-2.5 rounded-lg border border-luxury-border bg-luxury-secondary text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all"
                              />
                            </div>
                            <input 
                              type="text" 
                              required
                              placeholder="Subject" 
                              value={inquiry.subject}
                              onChange={(e) => setInquiries({
                                ...inquiries,
                                [loc.id]: { ...inquiry, subject: e.target.value }
                              })}
                              className="w-full px-4 py-2.5 rounded-lg border border-luxury-border bg-luxury-secondary text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all"
                            />
                            <textarea 
                              required
                              placeholder="Message" 
                              rows={2}
                              value={inquiry.message}
                              onChange={(e) => setInquiries({
                                ...inquiries,
                                [loc.id]: { ...inquiry, message: e.target.value }
                              })}
                              className="w-full px-4 py-2.5 rounded-lg border border-luxury-border bg-luxury-secondary text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none"
                            />
                            <button 
                              type="submit"
                              className="w-full bg-black hover:bg-black text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>Send Message</span>
                            </button>
                          </motion.form>
                        ) : (
                          <motion.div 
                            key={`success-${loc.id}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 border border-green-200 p-4 rounded-xl text-center"
                          >
                            <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <h4 className="font-bold text-green-900 text-sm">Message Sent Successfully</h4>
                            <p className="text-xs text-green-700 mt-1">We will respond within 24 hours.</p>
                            <button 
                              onClick={() => setSubmittedInquiries(prev => ({ ...prev, [loc.id]: false }))}
                              className="mt-3 text-xs text-luxury-text hover:underline font-bold"
                            >
                              Send another message
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. Book Consultation Form Section */}
      <section id="preferred-consultation" className="py-24 bg-gradient-to-b from-luxury-primary via-[#f7f5f0] to-[#f0eee9] border-b border-luxury-border">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-light text-luxury-text mb-6 tracking-tight leading-tight">
              Book a Preferred Consultation
            </h2>
            <p className="font-sans text-sm md:text-base text-luxury-subtext max-w-2xl mx-auto font-light leading-relaxed">
              Take the first step towards world-class care. Fill out the form below and our team will contact you to finalize your appointment.
            </p>
            <div className="w-12 h-[1px] bg-luxury-gold mx-auto mt-8" />
          </div>

          <AnimatePresence mode="wait">
            {!submittedBooking ? (
              <motion.form 
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleBookingSubmit} 
                className="space-y-6"
              >
                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">First Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your first name"
                      value={booking.firstName}
                      onChange={(e) => setBooking({ ...booking, firstName: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Last Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your last name"
                      value={booking.lastName}
                      onChange={(e) => setBooking({ ...booking, lastName: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      value={booking.email}
                      onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Enter your phone number"
                      value={booking.phone}
                      onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Dynamic 3-Step Selection Flow matching the Navbar Structure */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">
                      Choose from our clinic's categories to locate your preferred specialist treatment.
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1: Area */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <select
                          value={selectedAreaId}
                          onChange={(e) => handleAreaChange(e.target.value)}
                          className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold cursor-pointer"
                        >
                          {CLINICAL_AREAS_DB.map(area => (
                            <option key={area.id} value={area.id}>
                              {area.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Step 2: Category */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <select
                          value={selectedCategoryId}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold cursor-pointer"
                        >
                          {CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId)?.categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          )) || <option value="">Select Category</option>}
                        </select>
                      </div>
                    </div>

                    {/* Step 3: Specific Treatment */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <select
                          value={booking.procedure}
                          onChange={(e) => setBooking({ ...booking, procedure: e.target.value })}
                          className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold cursor-pointer"
                        >
                          {CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId)
                            ?.categories.find(c => c.id === selectedCategoryId)
                            ?.items.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name} ({item.price})
                              </option>
                            )) || <option value="">Select Treatment</option>}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Clean Visual Hierarchy Flow Label matching the user request: "face: INJECTABLE TREATMENTS: Exosome" */}
                  {(() => {
                    const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                    const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                    const itemObj = catObj?.items.find(i => i.id === booking.procedure);
                    if (!areaObj || !catObj || !itemObj) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-1.5 bg-luxury-card/70 border border-luxury-border/50 rounded-xl px-4 py-2.5 text-xs text-luxury-text font-medium font-mono shadow-inner">
                        <span className="text-luxury-gold font-bold uppercase">{areaObj.id}</span>
                        <span className="text-luxury-muted font-normal">:</span>
                        <span className="text-luxury-subtext font-bold uppercase">{catObj.name}</span>
                        <span className="text-luxury-muted font-normal">:</span>
                        <span className="text-luxury-text font-bold">{itemObj.name}</span>
                      </div>
                    );
                  })()}

                  {/* Clean Dynamic UI showing Selected Treatment details */}
                  {(() => {
                    const areaObj = CLINICAL_AREAS_DB.find(a => a.id === selectedAreaId);
                    const catObj = areaObj?.categories.find(c => c.id === selectedCategoryId);
                    const currentTreatment = catObj?.items.find(i => i.id === booking.procedure);
                    if (!currentTreatment) return null;
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        key={currentTreatment.id}
                        className="bg-gradient-to-br from-luxury-secondary/5 to-luxury-secondary/10 border border-luxury-text/20 rounded-2xl p-5 md:p-6 space-y-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                          {/* Title & Category */}
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-luxury-subtext bg-black/10 px-2.5 py-1 rounded-full w-fit inline-block">
                              {catObj.name}
                            </span>
                            <h4 
                              onClick={() => onTreatmentClick?.(currentTreatment.name)}
                              className="text-lg md:text-xl font-serif font-bold text-luxury-text hover:text-luxury-subtext transition-colors leading-snug cursor-pointer block hover:underline decoration-rose-gold decoration-2 underline-offset-4"
                              title="Click to view full clinical details"
                            >
                              {currentTreatment.name}
                            </h4>
                            <p className="text-xs text-luxury-subtext leading-relaxed max-w-xl">
                              {currentTreatment.desc}
                            </p>
                          </div>

                          {/* Info Badges (Time & Price) */}
                          <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0 w-full md:w-auto">
                            {/* Price Card */}
                            <div 
                              onClick={() => onTreatmentClick?.(currentTreatment.name)}
                              title="Click to view treatment details"
                              className="flex-1 md:flex-none flex items-center gap-3 bg-white border border-luxury-border/30 hover:border-luxury-text/60 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md min-w-0 sm:min-w-[150px] cursor-pointer transition-all hover:bg-slate-50/80 active:scale-[0.98]"
                            >
                              <div className="p-2 bg-black text-luxury-gold rounded-lg shrink-0">
                                <DollarSign className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] uppercase tracking-wider text-luxury-subtext/60 block font-bold truncate">Investment</span>
                                <span className="text-sm font-bold text-luxury-text font-serif block truncate">{currentTreatment.price}</span>
                              </div>
                            </div>

                            {/* Duration Card */}
                            <div 
                              onClick={() => onTreatmentClick?.(currentTreatment.name)}
                              title="Click to view treatment details"
                              className="flex-1 md:flex-none flex items-center gap-3 bg-white border border-luxury-border/30 hover:border-luxury-text/60 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md min-w-0 sm:min-w-[150px] cursor-pointer transition-all hover:bg-slate-50/80 active:scale-[0.98]"
                            >
                              <div className="p-2 bg-black text-luxury-gold rounded-lg shrink-0">
                                <Clock className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[9px] uppercase tracking-wider text-luxury-subtext/60 block font-bold truncate">Duration</span>
                                <span className="text-sm font-bold text-luxury-text block truncate">{currentTreatment.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Toggle Add to Selection Button */}
                        <div className="pt-4 border-t border-luxury-text/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <p className="text-xs text-slate-500 font-sans">
                            {selectedTreatments.includes(currentTreatment.id)
                              ? "✓ This treatment is in your consultation plan."
                              : "Would you like to add this treatment to your consultation?"}
                          </p>
                          {selectedTreatments.includes(currentTreatment.id) ? (
                            <button
                              type="button"
                              disabled={selectedTreatments.length <= 1}
                              onClick={() => removeTreatment(currentTreatment.id)}
                              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                selectedTreatments.length <= 1
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-transparent"
                                  : "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-150 cursor-pointer"
                              }`}
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove from Plan
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addTreatment(currentTreatment.id)}
                              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-black hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add to Plan
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })()}

                  {/* Selected Treatments Summary Card (Cart-like Item) */}
                  {selectedTreatments.length > 0 && (
                    <div 
                      onClick={() => setIsDrawerOpen(true)}
                      className="bg-black p-4 sm:p-4.5 rounded-2xl flex items-center justify-between shadow-md hover:shadow-lg hover:from-black hover:to-black transition-all cursor-pointer border border-luxury-text/20 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Clean minimal circular badge for mobile screen only - star-like icon removed */}
                        <div className="sm:hidden flex items-center justify-center w-6 h-6 rounded-full bg-luxury-gold text-luxury-text text-[11px] font-black shrink-0 shadow-sm">
                          {selectedTreatments.length}
                        </div>
                        {/* Desktop badge with Sparkles (star-like icon) */}
                        <div className="hidden sm:block relative p-2.5 bg-luxury-gold/20 rounded-xl text-luxury-gold shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkles className="h-5 w-5" />
                          <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-text text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-luxury-text">
                            {selectedTreatments.length}
                          </span>
                        </div>
                        <div className="text-left min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-slate-300 font-extrabold block">Consultation Plan</span>
                          <span className="text-xs font-bold text-white block truncate">
                            {selectedTreatments.length} Procedure{selectedTreatments.length > 1 ? 's' : ''} Selected
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-luxury-gold/90 block font-extrabold">Total Est.</span>
                          <span className="text-sm font-bold font-serif text-luxury-gold">
                            ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                          </span>
                        </div>
                        {/* Hiding the review button entirely on mobile for a clean minimal layout */}
                        <span className="hidden sm:inline-block bg-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold hover:bg-white/15 transition-all text-white border border-white/5 uppercase tracking-wide shrink-0">
                          Review
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Custom Bottom Mobile Drawer for Selected Treatments */}
                  <AnimatePresence>
                    {isDrawerOpen && (
                      <div className="fixed inset-0 z-50">
                        {/* Backdrop Overlay */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsDrawerOpen(false)}
                          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        {/* Slide-Up Drawer */}
                        <motion.div
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                          className="fixed bottom-0 left-0 right-0 md:max-w-xl md:mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col font-sans z-50 max-h-[85vh] overflow-hidden"
                        >
                          {/* Drag Handle */}
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3.5 shrink-0 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => setIsDrawerOpen(false)} />
                          
                          {/* Header */}
                          <div className="px-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                              <h4 className="font-serif font-bold text-lg text-luxury-text">Your Consultation Plan</h4>
                              <p className="text-xs text-slate-500">Review, add, or prune selected clinical treatments</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-6 overflow-y-auto space-y-4 flex-1">
                            {getSelectedTreatmentsData().map((item) => (
                              <div 
                                key={item.id}
                                className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm hover:border-slate-200 transition-all"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide bg-slate-200/50 px-2 py-0.5 rounded">
                                      {item.areaName}
                                    </span>
                                    <span className="text-[9px] font-bold text-luxury-gold uppercase tracking-wide truncate bg-luxury-gold/10 px-2 py-0.5 rounded">
                                      {item.catName}
                                    </span>
                                  </div>
                                  <h5 className="font-sans font-bold text-sm text-luxury-text">
                                    {item.name}
                                  </h5>
                                  <p className="text-xs text-luxury-subtext/80 leading-relaxed line-clamp-2">
                                    {item.desc}
                                  </p>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold pt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {item.time}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-bold text-luxury-text">
                                      <DollarSign className="h-3 w-3 text-slate-400 shrink-0" /> {item.price}
                                    </span>
                                  </div>
                                </div>

                                {/* Remove button */}
                                {selectedTreatments.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeTreatment(item.id)}
                                    className="p-2.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all border border-slate-200/50 hover:border-rose-100 shrink-0 shadow-sm"
                                    title="Remove treatment"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4 shrink-0 rounded-t-2xl shadow-inner">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-xs uppercase tracking-wider text-slate-500 font-extrabold block">
                                  Estimated Investment Total
                                </span>
                                <span className="text-xs text-slate-400 block font-medium">
                                  {selectedTreatments.length} procedure{selectedTreatments.length > 1 ? 's' : ''} in plan
                                </span>
                              </div>
                              <span className="font-serif font-bold text-xl text-luxury-text">
                                ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => setIsDrawerOpen(false)}
                              className="w-full bg-black hover:bg-black text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                              Confirm Plan & Close Drawer
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Description what to improve */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">What would you like to improve?</label>
                  <textarea 
                    placeholder="Tell us about your concerns..." 
                    rows={3}
                    value={booking.improvement}
                    onChange={(e) => setBooking({ ...booking, improvement: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none font-medium"
                  />
                </div>

                {/* Doctor and Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Preferred Doctor</label>
                    <select 
                      value={booking.doctor}
                      onChange={(e) => setBooking({ ...booking, doctor: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold"
                    >
                      <option value="">Select a specialist (Optional)</option>
                      <option value="dr-smith">Dr. Smith</option>
                      <option value="dr-jones">Dr. Jones</option>
                      <option value="dr-jaipur">Dr. Jaipur</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Preferred Appointment Date</label>
                    <input 
                      type="date" 
                      value={booking.date}
                      onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Best reach time and feedback medium */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Best Time to Reach You</label>
                    <select 
                      value={booking.bestTime}
                      onChange={(e) => setBooking({ ...booking, bestTime: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">How did you hear about us?</label>
                    <select 
                      value={booking.hearAboutUs}
                      onChange={(e) => setBooking({ ...booking, hearAboutUs: e.target.value })}
                      className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all font-semibold"
                    >
                      <option value="search">Search Engine (Google)</option>
                      <option value="social">Social Media</option>
                      <option value="referral">Friend/Family Referral</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Availability Status Display */}
                <AnimatePresence mode="wait">
                  {booking.date && availabilityStatus !== 'idle' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium ${
                        availabilityStatus === 'checking' 
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : availabilityStatus === 'available'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {availabilityStatus === 'checking' && (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Checking clinic availability for selected date...</span>
                          </>
                        )}
                        {availabilityStatus === 'available' && (
                          <>
                            <Check className="h-4 w-4 shrink-0" />
                            <span>Good availability on {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ({booking.bestTime}).</span>
                          </>
                        )}
                        {availabilityStatus === 'limited' && (
                          <>
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>Limited availability on {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ({booking.bestTime}). We'll try our best to accommodate you.</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stay in Touch Preferences Section */}
                <div className="space-y-3">
                  <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text block">
                    Stay in Touch (Preferred Contact Channels)
                  </label>
                  <p className="text-xs text-luxury-subtext/70 font-sans -mt-1">
                    Please select your preferred option(s) for updates, notifications, and future communications:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'email', label: 'Email', icon: Mail },
                      { id: 'phone', label: 'Phone', icon: Phone },
                      { id: 'telephone', label: 'Tel Phone', icon: PhoneCall },
                      { id: 'post', label: 'Post Mail', icon: MapPin },
                    ].map((channel) => {
                      const isSelected = booking.stayInTouch.includes(channel.id);
                      const IconComponent = channel.icon;
                      return (
                        <button
                          key={channel.id}
                          type="button"
                          onClick={() => toggleStayInTouch(channel.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border transition-all duration-200 cursor-pointer text-left ${
                            isSelected
                              ? 'bg-black border-luxury-text text-white shadow-sm'
                              : 'bg-luxury-secondary border-luxury-border text-luxury-text hover:bg-slate-50'
                          }`}
                        >
                          <IconComponent className={`h-4 w-4 shrink-0 ${isSelected ? 'text-luxury-gold' : 'text-luxury-text'}`} />
                          <span className="font-sans text-xs font-semibold tracking-wide">{channel.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional notes */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs tracking-wider uppercase text-luxury-text">Additional Notes</label>
                  <textarea 
                    placeholder="Any other information..." 
                    rows={2}
                    value={booking.notes}
                    onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-luxury-border bg-white text-sm text-luxury-text focus:border-luxury-text focus:ring-1 focus:ring-luxury-text outline-none transition-all resize-none font-medium"
                  />
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4 pt-4 border-t border-luxury-border/40">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      required
                      checked={booking.agreePrivacy}
                      onChange={(e) => setBooking({ ...booking, agreePrivacy: e.target.checked })}
                      className="mt-1 rounded border-luxury-border text-luxury-text focus:ring-luxury-text h-4.5 w-4.5"
                    />
                    <span className="text-sm text-luxury-subtext font-medium leading-relaxed">
                      I agree to the collection and processing of my personal information in accordance with the <a href="#" onClick={(e) => e.preventDefault()} className="text-luxury-text font-bold hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={booking.agreeOffers}
                      onChange={(e) => setBooking({ ...booking, agreeOffers: e.target.checked })}
                      className="mt-1 rounded border-luxury-border text-luxury-text focus:ring-luxury-text h-4.5 w-4.5"
                    />
                    <span className="text-sm text-luxury-subtext font-medium leading-relaxed">
                      I'd like to receive exclusive offers and skincare updates.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-6">
                  <button 
                    type="submit"
                    className="w-full bg-black hover:bg-black text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-md active:scale-[0.99] cursor-pointer"
                  >
                    Book My Consultation
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="bg-luxury-secondary border border-luxury-border/40 p-4 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl text-center max-w-2xl mx-auto shadow-sm"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-4 text-luxury-text">
                  <Check className="h-5 w-5 sm:h-8 sm:w-8 animate-pulse" />
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-2xl text-luxury-text mb-2 px-1 tracking-tight">
                  Consultation Request Received
                </h3>
                <p className="text-xs sm:text-sm text-luxury-subtext/95 mb-5 sm:mb-6 font-medium leading-relaxed max-w-lg mx-auto px-1 sm:px-3 break-words text-slate-600">
                  Thank you, <span className="font-bold text-luxury-text">{booking.firstName}</span>. Our specialist client care team will contact you shortly via email (<span className="font-semibold text-luxury-text break-all inline-block hover:underline">{booking.email}</span>) or phone (<span className="font-semibold text-luxury-text whitespace-nowrap inline-block">{booking.phone}</span>) to finalize your preferred date and time.
                </p>

                {/* Selected Treatments Summary inside success view - highly responsive and clean */}
                <div className="my-5 sm:my-6 bg-white border border-luxury-border/30 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-left max-w-md mx-auto space-y-3.5 shadow-sm">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block border-b border-luxury-border/20 pb-2">
                    Consultation Request Summary ({selectedTreatments.length})
                  </span>
                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    {getSelectedTreatmentsData().map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <span className="font-bold text-luxury-text block truncate text-xs">{item.name}</span>
                          <span className="text-[9px] text-luxury-subtext/60 font-mono tracking-wider uppercase block">{item.areaName} • {item.time}</span>
                        </div>
                        <span className="font-serif font-bold text-luxury-gold shrink-0 text-right text-xs sm:text-sm">{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-luxury-border/20 pt-3 flex justify-between items-center text-xs font-bold text-luxury-text">
                    <span>Total Estimated Investment:</span>
                    <span className="font-serif text-sm sm:text-base text-luxury-gold">
                      ${getSelectedTreatmentsData().reduce((sum, item) => sum + parsePrice(item.price), 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.stayInTouch.length > 0 && (
                  <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-white border border-luxury-border/20 p-2.5 sm:px-4 sm:py-2.5 rounded-xl text-[11px] text-luxury-text max-w-md mx-auto w-full">
                    <span className="font-bold shrink-0 text-xs text-luxury-text">Stay in Touch Via:</span>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {booking.stayInTouch.map(id => {
                        const labelMap: Record<string, string> = {
                          email: 'Email',
                          phone: 'Phone',
                          telephone: 'Tel Phone',
                          post: 'Post Mail'
                        };
                        return (
                          <span key={id} className="bg-black/5 text-luxury-text font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider border border-luxury-text/10">
                            {labelMap[id] || id}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center w-full px-1 sm:px-0 pt-2">
                  <button 
                    onClick={() => {
                      setSubmittedBooking(false);
                      setSelectedTreatments(['exosome']);
                      setBooking({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        procedure: 'exosome',
                        improvement: '',
                        doctor: '',
                        date: '',
                        bestTime: 'morning',
                        hearAboutUs: 'search',
                        stayInTouch: [],
                        notes: '',
                        agreePrivacy: false,
                        agreeOffers: false
                      });
                    }}
                    className="w-full sm:w-auto bg-black hover:bg-black text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                  >
                    Book Another Consultation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </div>
  );
}
