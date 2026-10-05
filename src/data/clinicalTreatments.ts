import { TreatmentPricingItem } from './treatmentPricing';
import { getHybridTreatmentPricing } from '../lib/treatmentResolver';

export interface TreatmentItem {
  id: string;
  name: string;
  price: string;
  time: string;
  desc: string;
  badge?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  items: TreatmentItem[];
}

export interface AreaItem {
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
          { id: 'exosome', name: 'Exosome Regenerative Therapy', price: '£650', time: '45 - 60 Mins', desc: 'Cellular-level skin rejuvenation using pure clinical-grade exosomes.' },
          { id: 'migraines', name: 'Migraines Treatment', price: '£450', time: '30 Mins', desc: 'Targeted clinical neurotoxin therapy to alleviate chronic migraine pain.' },
          { id: 'profhilo', name: 'Profhilo Injectable Hydration', price: '£450', time: '30 Mins', desc: 'Hyaluronic acid tissue remodeling for deep dermis hydration & firmness.' },
          { id: 'polynucleotide', name: 'Polynucleotide Bio-Regeneration', price: '£490', time: '40 Mins', desc: 'DNA-level cell repair and under-eye renewal using purified nucleotides.' },
          { id: 'jaw-reduction', name: 'Non-Surgical Jaw Reduction', price: '£480', time: '30 Mins', desc: 'Masseter muscle relaxation to slim the lower third of the face.' },
          { id: 'gummy-smile', name: 'Gummy Smile Treatment', price: '£220', time: '15 Mins', desc: 'Subtle neurotoxin adjustments to lower the upper lip and balance smiles.' },
          { id: 'eyebrow-lifting', name: 'Eyebrow Lifting', price: '£280', time: '20 Mins', desc: 'Non-surgical brow elevation to open and refresh the gaze.' },
          { id: 'smoothing', name: 'Lines & Wrinkles Smoothing', price: '£350', time: '30 Mins', desc: 'Expert dynamic smoothing targeting forehead, frown lines, and crows feet.' },
          { id: 'collagen-stimulator', name: 'Collagen Stimulator (Sculptra/Lanluma)', price: '£750', time: '45 Mins', desc: 'Deep poly-L-lactic acid stimulus to rebuild facial volume naturally.' }
        ]
      },
      {
        id: 'fillers',
        name: 'DERMAL FILLERS FOR FACE',
        items: [
          { id: 'temple-filler', name: 'Temple Filler', price: '£420', time: '30 Mins', desc: 'Rebuilding temporal support to soften shadows and smooth lateral brows.' },
          { id: 'forehead-filler', name: 'Forehead Filler', price: '£480', time: '45 Mins', desc: 'Premium structural hydration to smooth forehead contouring.' },
          { id: 'earlobe-filler', name: 'Earlobe Filler', price: '£250', time: '20 Mins', desc: 'Restoring volume to stretched or drooping lobes for support.' },
          { id: 'frown-treatment', name: 'Frown Line Filler', price: '£350', time: '20 Mins', desc: 'Direct precision filling for set-in glabella lines.' },
          { id: 'jawline-contouring', name: 'Contouring the Jaw Line', price: '£580', time: '45 Mins', desc: 'Sculpting mandibular angles to build a sleek, refined jaw profile.' },
          { id: 'chin-enhancement', name: 'Chin Enhancement', price: '£390', time: '30 Mins', desc: 'Proportional chin projection to restore profile alignment.' },
          { id: 'cheek-enhancement', name: 'Cheek Enhancement', price: '£480', time: '30 Mins', desc: 'Midface lateral support restoring soft feminine or masculine contours.' },
          { id: 'teartrough-darkcircles', name: 'Eye Bag, Dark Circles & Tear Trough', price: '£550', time: '45 Mins', desc: 'Extremely precise micro-filler placement to correct under-eye shadow lines.' },
          { id: 'nasolabial-folds', name: 'Nose to Mouth Lines, Folds & Wrinkles', price: '£390', time: '30 Mins', desc: 'Hydrating deep nasolabial creases to soften shadow casting.' },
          { id: 'rhinoplasty', name: 'Non-Surgical Rhinoplasty', price: '£650', time: '45 Mins', desc: 'Liquid nose contouring using high-cohesivity fillers to smooth bridges.' },
          { id: 'lip', name: 'Precision Lip Enhancement', price: '£380', time: '30 - 45 Mins', desc: 'Bespoke lip shaping emphasizing proportion, border, and vermillion hydration.' },
          { id: 'filler-dissolving', name: 'Dermal Filler Dissolving', price: '£250', time: '30 Mins', desc: 'Safe hyaluronidase dissolution to correct migrated or over-filled areas.' }
        ]
      },
      {
        id: 'rejuvenation',
        name: 'SKIN REJUVENATION',
        items: [
          { id: 'facetite', name: 'FaceTite Radiofrequency', price: '£1,800', time: '90 Mins', desc: 'Subdermal tightening combining RF energy with internal tissue coagulation.' },
          { id: 'morpheus8', name: 'Morpheus8 RF Microneedling', price: '£850', time: '60 - 90 Mins', desc: 'Fractional remodeling utilizing RF-infused microneedles.' },
          { id: 'ultherapy', name: 'Ultherapy Non-Surgical Lift', price: '£1,200', time: '60 - 120 Mins', desc: 'Deep SMAS layer micro-focused ultrasound tightening.' },
          { id: 'pdo-threads', name: 'PDO Thread Lift', price: '£950', time: '60 Mins', desc: 'Polydioxanone structural suture suspension to counter deep sagging.' },
          { id: 'skin-tightening', name: 'Skin Tightening Treatment', price: '£400', time: '45 Mins', desc: 'Non-invasive heating sessions stimulating quick fiber contraction.' },
          { id: 'men-treatments', name: 'Treatments For Men', price: '£380', time: '45 Mins', desc: 'Targeted masculine dermal and structural contouring protocols.' },
          { id: 'mesotherapy', name: 'Mesotherapy Cocktail Infusion', price: '£290', time: '45 Mins', desc: 'Superficial micro-droplets of rich vitamins, amino acids, and hydration.' },
          { id: 'prx-peel', name: 'PRX-T33 No-Needle Biorejuvenation', price: '£250', time: '30 Mins', desc: 'Intense dermis renewal peel that bypasses epidermal shedding completely.' },
          { id: 'skinpen', name: 'SkinPen Microneedling', price: '£280', time: '45 Mins', desc: 'Medical-grade mechanical collagen induction therapy.' },
          { id: 'hyperpigmentation', name: 'Hyperpigmentation Care', price: '£320', time: '45 Mins', desc: 'Clinical depigmenting solutions targetting melasma and dark spots.' },
          { id: 'cosmelan', name: 'Cosmelan Depigmentation Protocol', price: '£850', time: '60 Mins', desc: 'The gold standard clinical peel mask program for severe melasma.' },
          { id: 'skin-peels', name: 'Medical-Grade Skin Peels', price: '£180', time: '30 Mins', desc: 'Advanced chemical resurfacing tailored to active acne, texture, or tone.' },
          { id: 'obagi', name: 'Obagi Nu-Derm Skin System', price: '£390', time: '30 Mins', desc: 'Clinical setup for cellular transformation using prescription lines.' },
          { id: 'zo-health', name: 'ZO Skin Health Protocol', price: '£250', time: '30 Mins', desc: 'High-potency skin health regimens configured for barrier repair.' }
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
          { id: 'hand-rejuve', name: 'Hydrating Hand Rejuvenation', price: '£390', time: '30 Mins', desc: 'Hyaluronic dermal hydration to restore crepey, dehydrated dorsal hand skin.' },
          { id: 'radiesse-hands', name: 'Radiesse Hand Restoration', price: '£550', time: '30 Mins', desc: 'Calcium hydroxylapatite bio-stimulation to mask prominent veins.' }
        ]
      },
      {
        id: 'body-non-surgical',
        name: 'NON SURGICAL TREATMENTS',
        items: [
          { id: 'body-exosome', name: 'Body Exosome Tissue Repair', price: '£750', time: '45 Mins', desc: 'Cellular growth signaling factors focused on body scarring or laxity.' },
          { id: 'hyperhidrosis', name: 'Excessive Sweating (Hyperhidrosis) Treatment', price: '£490', time: '30 Mins', desc: 'Neurotoxin injections to underarms or palms to eliminate hyperhidrosis.' },
          { id: 'cellulite-treatment', name: 'Effective Cellulite Treatment', price: '£450', time: '45 Mins', desc: 'Integrated dynamic tissue breakdown targeting cellulite dimples.' },
          { id: 'port-wine', name: 'Port Wine Stain Reduction', price: '£350', time: '30 Mins', desc: 'Clinical vascular targeting of deep capillary malformations.' },
          { id: 'nail-fungus', name: 'Nail Fungus Laser Therapy', price: '£150', time: '15 Mins', desc: 'High-intensity thermal eradication of deep nail-bed fungal infections.' },
          { id: 'leg-veins', name: 'Leg Veins Laser / Sclerotherapy', price: '£320', time: '30 Mins', desc: 'Chemical or thermal occlusion of spider veins on legs.' },
          { id: 'vascular', name: 'Vascular & Hyperpigmentation Clearing', price: '£290', time: '30 Mins', desc: 'Clinical clearing of broken capillaries, cherry angiomas, and spot lesions.' },
          { id: 'hayfever', name: 'Hay Fever Treatment', price: '£180', time: '15 Mins', desc: 'Intramuscular therapeutic alleviation of seasonal hayfever symptoms.' }
        ]
      },
      {
        id: 'female-intimate',
        name: 'FEMALE INTIMATE TREATMENTS',
        items: [
          { id: 'labia-enhance', name: 'Labia Enhancement (Volume Restoration)', price: '£650', time: '45 Mins', desc: 'Hyaluronic acid sculpting to restore youthful volume and protect structures.' },
          { id: 'vaginal-dryness', name: 'Vaginal Dryness PRP/Profhilo', price: '£480', time: '30 Mins', desc: 'Intense hydration bio-stimulation to restore tissue lubrication and comfort.' }
        ]
      },
      {
        id: 'male-intimate',
        name: 'MALE INTIMATE TREATMENTS',
        items: [
          { id: 'penoplasty', name: 'Non-Surgical Penoplasty', price: '£1,900', time: '60 Mins', desc: 'Symmetrical structural girth enhancement utilizing specialized high-density bio-fillers.' }
        ]
      },
      {
        id: 'fat-reduction',
        name: 'FAT REDUCTION',
        items: [
          { id: 'aqualyx', name: 'Aqualyx Fat Dissolving Injection', price: '£350', time: '30 - 45 Mins', desc: 'Targeted specialized localized fat lipolysis via deoxycholic acid formulation.' },
          { id: 'desoface-desobody', name: 'Desoface® And Desobody® Injections', price: '£380', time: '30 - 45 Mins', desc: 'Second-generation localized fat dissolving with enhanced client comfort.' }
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
          { id: 'buttock', name: 'Non-Surgical Buttock Lift', price: '£1,500', time: '60 Mins', desc: 'Gluteal projection and volume shaping using bio-stimulators.' },
          { id: 'lanluma', name: 'Lanluma Volume Contouring', price: '£1,800', time: '60 Mins', desc: 'PLLA-based body sculpting formulation to restore deep structural volume.' },
          { id: 'sculptra-butt', name: 'Sculptra Butt Lift', price: '£1,900', time: '60 Mins', desc: 'Deep poly-L-lactic acid stimulus to lift, smooth, and round gluteal arches.' }
        ]
      },
      {
        id: 'contour-refine',
        name: 'CONTOURING & REFINEMENT',
        items: [
          { id: 'hip-dip', name: 'Hip Dip Correction', price: '£1,600', time: '60 Mins', desc: 'Targeted lateral depression filling to sculpt a seamless curvy silhouette.' },
          { id: 'asymmetry-butt', name: 'Asymmetry Correction', price: '£1,400', time: '60 Mins', desc: 'Restoring volumetric balance between gluteal hemispheres.' },
          { id: 'non-surg-sculpt', name: 'Non-Surgical Sculpting', price: '£1,200', time: '45 Mins', desc: 'Sleek muscle-toning and skin-tightening aesthetic integration.' }
        ]
      },
      {
        id: 'cellulite-texture',
        name: 'CELLULITE & TEXTURE',
        items: [
          { id: 'cellulite-smooth', name: 'Cellulite Smoothing', price: '£550', time: '45 Mins', desc: 'Injectable and radiofrequency remodeling targeting cell chambers.' },
          { id: 'subcision', name: 'Deep-tissue Subcision', price: '£750', time: '60 Mins', desc: 'Clinical release of fibrous septae pulling skin down to smooth deep dimples.' },
          { id: 'rf-buttock', name: 'Radiofrequency Therapy', price: '£350', time: '30 Mins', desc: 'Deep thermal collagen remodeling to tighten gluteal fold crepiness.' }
        ]
      }
    ]
  },
  {
    id: 'hair-scalp',
    name: 'Hair & Scalp',
    categories: [
      {
        id: 'scalp-trichology',
        name: 'TRICHOLOGY & SCALP RESTORATION',
        items: [
          { id: 'prp-hair', name: 'PRP Hair Restoration Therapy', price: '£450', time: '45 Mins', desc: 'Autologous platelet concentration injected into scalp to stimulate dormant follicles.' },
          { id: 'exosome-scalp', name: 'Exosome Scalp Regeneration', price: '£790', time: '45 Mins', desc: 'Biotech growth factors and signaling exosomes promoting thick hair matrix rebuilding.' },
          { id: 'meso-hair', name: 'Scalp Mesotherapy Cocktail', price: '£290', time: '30 Mins', desc: 'Direct micro-dosing of vitamins, biotin, and peptides to hair roots.' },
          { id: 'polynucleotide-hair', name: 'Polynucleotide Hair Rejuvenation', price: '£490', time: '40 Mins', desc: 'DNA fractions restoring scalp microcirculation and follicular vitality.' }
        ]
      }
    ]
  },
  {
    id: 'skin-dermatology',
    name: 'Skin & Dermatology',
    categories: [
      {
        id: 'clinical-dermatology',
        name: 'CLINICAL DERMATOLOGY',
        items: [
          { id: 'acne-protocol', name: 'Advanced Acne Clearing Protocol', price: '£280', time: '45 Mins', desc: 'Multi-modal clinical approach combining clarifying peels, blue light, and medical extraction.' },
          { id: 'rosacea-vascular', name: 'Rosacea & Erythema Laser Treatment', price: '£320', time: '30 Mins', desc: 'Vascular targeting to calm diffuse facial redness and visible capillaries.' },
          { id: 'melasma-depigment', name: 'Targeted Melasma Clearing', price: '£420', time: '45 Mins', desc: 'Precision pigment inhibition protocols suppressing active melanogenesis.' }
        ]
      },
      {
        id: 'medical-peels',
        name: 'ADVANCED MEDICAL PEELS',
        items: [
          { id: 'vi-peel', name: 'VI Peel Precision Plus', price: '£350', time: '30 Mins', desc: 'Medium-depth pharmaceutical peel for hyperpigmentation, texture, and tone.' },
          { id: 'tca-cross', name: 'TCA Cross Ice-Pick Scar Treatment', price: '£280', time: '30 Mins', desc: 'High-strength focal trichloroacetic acid application for deep scar contraction.' }
        ]
      }
    ]
  },
  {
    id: 'longevity',
    name: 'Longevity & Wellness',
    categories: [
      {
        id: 'cellular-wellness',
        name: 'CELLULAR LONGEVITY & INFUSIONS',
        items: [
          { id: 'nad-infusion', name: 'NAD+ Cellular Vitality Therapy', price: '£450', time: '60 - 90 Mins', desc: 'Intravenous coenzyme infusion to boost mitochondrial function, energy, and cellular repair.' },
          { id: 'glutathione-glow', name: 'Glutathione Master Antioxidant Drip', price: '£180', time: '30 Mins', desc: 'Intense systemic detox and skin luminosity via medical-grade glutathione.' },
          { id: 'vitamin-cocktail', name: 'Executive Myers Cocktail', price: '£220', time: '45 Mins', desc: 'Comprehensive micronutrient and electrolyte replenishment.' }
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
          { id: 'mole-removal', name: 'Mole & Lesion Removal', price: '£290', time: '30 Mins', desc: 'Safe clinical removal of moles with aesthetic suture closure.' },
          { id: 'cyst-removal', name: 'Cyst Removal', price: '£380', time: '45 Mins', desc: 'Surgical excision of epidermal or sebaceous cysts including sac extraction.' },
          { id: 'scarfree-excision', name: 'Precision Scar-free Excision', price: '£450', time: '45 Mins', desc: 'Feather-light surgical removal of cutaneous lesions to minimize marking.' },
          { id: 'lobe-correction', name: 'Lobe Correction', price: '£350', time: '45 Mins', desc: 'Reconstructing torn or heavily stretched earlobes under local block.' }
        ]
      },
      {
        id: 'facial-rejuve-cat',
        name: 'FACIAL REJUVENATION',
        items: [
          { id: 'blepharoplasty', name: 'Plasma Blepharoplasty (Non-Surgical)', price: '£750', time: '45 - 60 Mins', desc: 'Plasma arc upper or lower eyelid skin contraction & sublimation.' },
          { id: 'upper-eye', name: 'Upper Eyelid Rejuvenation', price: '£450', time: '40 Mins', desc: 'Non-surgical targetting of eyelid skin crepeyness and mild sagging.' },
          { id: 'lower-eye', name: 'Lower Eyelid Rejuvenation', price: '£450', time: '40 Mins', desc: 'Correcting dark circles, puffiness, and skin laxity beneath eyes.' }
        ]
      },
      {
        id: 'scar-revision-cat',
        name: 'SCAR REVISION',
        items: [
          { id: 'co2-laser', name: 'Fractional CO2 Laser', price: '£590', time: '45 Mins', desc: 'Ablative laser resurfacing targetting deep acne pitting and burn scars.' },
          { id: 'subcision-therapy', name: 'Subcision Therapy', price: '£350', time: '30 Mins', desc: 'Mechanical release of bound fibrous tissue anchors to lift depressed scars.' },
          { id: 'steroid-scar', name: 'Steroid Scar Flattening', price: '£120', time: '15 Mins', desc: 'Micro-dose triamcinolone injections to reduce hypertrophic or keloid scars.' }
        ]
      },
      {
        id: 'collagen-therapy-cat',
        name: 'COLLAGEN THERAPY',
        items: [
          { id: 'prp-needling', name: 'PRP Microneedling', price: '£380', time: '60 Mins', desc: 'Platelet-rich plasma combined with medical needling for scar healing.' },
          { id: 'growth-factor', name: 'Growth Factor Therapy', price: '£290', time: '45 Mins', desc: 'Infusing pure active bio-engineered growth signals for deep cell repair.' }
        ]
      }
    ]
  }
];

/**
 * Helper to search the clinical catalog by ID or keyword
 */
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

/**
 * Helper to find a specific TreatmentItem by ID
 */
export const findTreatmentItemInDB = (id: string): TreatmentItem | null => {
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      const found = cat.items.find((i) => i.id === id);
      if (found) return found;
    }
  }
  return null;
};

/**
 * Returns a flat list of all treatments across all clinical areas
 */
export const getAllClinicalTreatments = (): TreatmentItem[] => {
  const treatments: TreatmentItem[] = [];
  for (const area of CLINICAL_AREAS_DB) {
    for (const cat of area.categories) {
      treatments.push(...cat.items);
    }
  }
  return treatments;
};

/**
 * Hybrid resolver that links any catalog treatment to bespoke pricing packages
 * or synthesizes smart standardized packages on demand.
 */
export const resolveTreatmentToPricingItem = (
  treatmentItem: TreatmentItem,
  catName?: string
): TreatmentPricingItem => {
  return getHybridTreatmentPricing(treatmentItem, catName);
};

export { getHybridTreatmentPricing };

