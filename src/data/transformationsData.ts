import { TreatmentPricingItem, TreatmentCategory } from './treatmentPricing';
import { getHybridTreatmentPricing } from '../lib/treatmentResolver';
import { ShopProduct } from '../types/shop';
import { SHOP_PRODUCTS } from './shopProducts';
import { ExistingTreatmentGroupId } from '../types';
import { ALL_SPECIALIST_TREATMENTS, TransformationCategoryType, ParentPricingCategory } from './specialistTreatments';

export interface ExistingBeforeAfterTreatmentGroup {
  id: ExistingTreatmentGroupId;
  name: string;
  transformationCategory: TransformationCategoryType;
  pricingCategory: ParentPricingCategory | TreatmentCategory;
  defaultKeywords: string[];
}

/**
 * Master Before & After Treatment Groups generated directly from the 24 specialist services.
 */
export const EXISTING_BEFORE_AFTER_TREATMENT_GROUPS: ExistingBeforeAfterTreatmentGroup[] =
  ALL_SPECIALIST_TREATMENTS.map((item) => ({
    id: item.id as ExistingTreatmentGroupId,
    name: item.title,
    transformationCategory: item.transformationCategory,
    pricingCategory: item.pricingCategory,
    defaultKeywords:
      item.seoKeywords && item.seoKeywords.length > 0
        ? item.seoKeywords
        : [
            `${item.title.toLowerCase()} before and after`,
            'age reversal clinics london',
            item.pricingCategory.toLowerCase(),
          ],
  }));

export interface TransformationCase {
  id: string;
  title: string;
  category:
    | 'All'
    | 'Facial Rejuvenation'
    | 'Skin Texture & Scars'
    | 'Lifting & Contouring'
    | 'Regenerative Biotech'
    | 'Hair Density'
    | string;
  tag: string;
  patientInfo: string;
  duration: string;
  sessions: number;
  concern: string;
  beforeImage: string;
  afterImage: string;
  singleFrameImage?: string;
  singleFrameAltText?: string;
  galleryImages: string[];
  recommendedTreatmentIds: string[];
  recommendedProductIds: string[];
  treatmentGroupId?: ExistingTreatmentGroupId | string;
  linkedTreatmentId?: string;
  beforeAltText?: string;
  afterAltText?: string;
  seoTitle?: string;
  seoKeywords?: string[];
  featured?: boolean;
  hidden?: boolean;
  updatedAt?: number | string;
}

export const CLINICAL_TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: 'case-laser-skincare',
    title: 'Co@ Laser from',
    category: 'Skin Texture & Scars',
    tag: 'Co@ Laser from',
    treatmentGroupId: 'co2-laser-from',
    linkedTreatmentId: 'co2-laser-from',
    patientInfo: 'Clinical Series',
    duration: '12 Weeks',
    sessions: 3,
    concern: 'Sun damage, pigmentation, enlarged pores, and uneven dermal texture.',
    beforeImage: 'https://lexaesthetics.com/storage/2024/01/1.webp',
    afterImage: 'https://lexaesthetics.com/storage/2025/07/Laser-Skincare-Services-1.webp',
    galleryImages: [
      'https://lexaesthetics.com/storage/2024/01/1.webp',
      'https://lexaesthetics.com/storage/2025/07/Laser-Skincare-Services-1.webp',
      'https://lexaesthetics.com/storage/2024/01/1-5.png',
      'https://lexaesthetics.com/storage/2023/07/2.png',
      'https://lexaesthetics.com/storage/2024/01/4-1.jpg',
      'https://lexaesthetics.com/storage/2024/01/3-2.jpg',
      'https://lexaesthetics.com/storage/2024/01/Laser-Skincare-Services-1.jpeg',
      'https://lexaesthetics.com/storage/2024/01/Laser-Skincare-Services-2.jpeg'
    ],
    recommendedTreatmentIds: ['co2-laser-from', 'facial-skin-care'],
    recommendedProductIds: ['st-antioxidant-gel-cleanser', 'st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream']
  },
  {
    id: 'case-exosome-rejuvenation',
    title: 'Profhilo 2ml',
    category: 'Regenerative Biotech',
    tag: 'Profhilo 2ml',
    treatmentGroupId: 'profhilo-2ml',
    linkedTreatmentId: 'profhilo-2ml',
    patientInfo: 'Female, 44 Years',
    duration: '12 Weeks',
    sessions: 3,
    concern: 'Photo-damage, periorbital fine lines, loss of dermal bounce and skin dehydration.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO',
      'https://lexaesthetics.com/storage/2024/01/1.webp',
      'https://lexaesthetics.com/storage/2025/07/Laser-Skincare-Services-1.webp'
    ],
    recommendedTreatmentIds: ['profhilo-2ml', 'salmon-sperm-injection'],
    recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream']
  },
  {
    id: 'case-morpheus8-tightening',
    title: 'Morpheus8 treatment',
    category: 'Lifting & Contouring',
    tag: 'Morpheus8 treatment',
    treatmentGroupId: 'morpheus8-treatment',
    linkedTreatmentId: 'morpheus8-treatment',
    patientInfo: 'Female, 51 Years',
    duration: '16 Weeks',
    sessions: 3,
    concern: 'Lower face laxity, jowling along the mandibular angle, and neck dermal creping.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW',
      'https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM',
      'https://lexaesthetics.com/storage/2024/01/4-1.jpg',
      'https://lexaesthetics.com/storage/2024/01/3-2.jpg'
    ],
    recommendedTreatmentIds: ['morpheus8-treatment', 'endolift-fiber-lift'],
    recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-gel-cleanser']
  },
  {
    id: 'case-polynucleotide-eyes-skin',
    title: 'Salmon sperm injection',
    category: 'Regenerative Biotech',
    tag: 'Salmon sperm injection',
    treatmentGroupId: 'salmon-sperm-injection',
    linkedTreatmentId: 'salmon-sperm-injection',
    patientInfo: 'Female, 36 Years',
    duration: '8 Weeks',
    sessions: 3,
    concern: 'Dark under-eye circles, periorbital hollows, and post-inflammatory erythema.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
    afterImage: 'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX',
      'https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY',
      'https://lexaesthetics.com/storage/2024/01/1-5.png',
      'https://lexaesthetics.com/storage/2023/07/2.png'
    ],
    recommendedTreatmentIds: ['salmon-sperm-injection', 'profhilo-2ml'],
    recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-matte-day-cream']
  },
  {
    id: 'case-facial-harmony-contouring',
    title: 'Dermal Fillers-1ml',
    category: 'Facial Rejuvenation',
    tag: 'Dermal Fillers-1ml',
    treatmentGroupId: 'dermal-fillers-1ml',
    linkedTreatmentId: 'dermal-fillers-1ml',
    patientInfo: 'Female, 33 Years',
    duration: 'Single Stage + Review',
    sessions: 1,
    concern: 'Mild retrognathia (weak chin projection), thinning lips, and mild tear-trough depression.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le',
      'https://lexaesthetics.com/storage/2024/01/Laser-Skincare-Services-1.jpeg',
      'https://lexaesthetics.com/storage/2024/01/Laser-Skincare-Services-2.jpeg'
    ],
    recommendedTreatmentIds: ['dermal-fillers-1ml', 'anti-wrinkles-injection'],
    recommendedProductIds: ['st-antioxidant-matte-day-cream', 'st-antioxidant-mini-matte-day-cream']
  },
  {
    id: 'case-hair-restoration',
    title: 'Platelet-Rich Plasma (PRP)',
    category: 'Hair Density',
    tag: 'Platelet-Rich Plasma (PRP)',
    treatmentGroupId: 'platelet-rich-plasma-prp',
    linkedTreatmentId: 'platelet-rich-plasma-prp',
    patientInfo: 'Male, 38 Years',
    duration: '20 Weeks',
    sessions: 4,
    concern: 'Androgenetic crown thinning, widening part line, and miniaturised hair follicles.',
    beforeImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
    afterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd',
      'https://lexaesthetics.com/storage/2024/01/1.webp',
      'https://lexaesthetics.com/storage/2025/07/Laser-Skincare-Services-1.webp'
    ],
    recommendedTreatmentIds: ['platelet-rich-plasma-prp', 'salmon-sperm-injection'],
    recommendedProductIds: ['st-antioxidant-soothing-serum', 'st-antioxidant-gel-cleanser']
  }
];

export const ADMIN_SYNCED_TRANSFORMATION_CASES: TransformationCase[] = [
  {
    "id": "pair-1793724383033",
    "title": "Clinical Transformation",
    "category": "Skin Texture & Scars",
    "tag": "Facial skin care",
    "patientInfo": "Facial skin care",
    "duration": "8 Weeks",
    "sessions": 1,
    "concern": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "beforeImage": "/assets/transformations/ba-eyebrow-wax-before-1793670395086.webp?v=1793670395089",
    "afterImage": "/assets/transformations/ba-eyebrow-wax-after-1793670407456.webp?v=1793670407457",
    "singleFrameImage": "/assets/transformations/pair-1793724383033-single.webp?v=1793724446928",
    "galleryImages": [
      "/assets/transformations/pair-1793724383033-single.webp?v=1793724446928"
    ],
    "recommendedTreatmentIds": [
      "facial-skin-care"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "facial-skin-care",
    "linkedTreatmentId": "facial-skin-care",
    "linkedTreatmentTitle": "Facial skin care",
    "beforeAltText": "Before Eyebrow Wax treatment at Age Reversal Clinics London — baseline clinical photography",
    "afterAltText": "After Eyebrow Wax treatment result (6 Weeks • 3 Sessions) at Age Reversal Clinics London — verified transformation",
    "singleFrameAltText": "Clinical Transformation Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "seoKeywords": [
      "before and after eyebrow wax london",
      "eyebrow wax before and after",
      "age reversal clinics eyebrow wax results",
      "lash & eyebrow results london",
      "anti-aging clinic london",
      "hair & beauty",
      "lash & eyebrow",
      "clinical aesthetic treatments"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1794059759619
  },
  {
    "id": "pair-1793724538573",
    "title": "Clinical Transformation",
    "category": "Skin Texture & Scars",
    "tag": "Facial skin care",
    "patientInfo": "Facial skin care",
    "duration": "8 Weeks",
    "sessions": 1,
    "concern": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "beforeImage": "/assets/transformations/pair-1793724538573-before.webp?v=1793724556260",
    "afterImage": "/assets/transformations/pair-1793724538573-after.webp?v=1793724565773",
    "galleryImages": [
      "/assets/transformations/pair-1793724538573-before.webp?v=1793724556260",
      "/assets/transformations/pair-1793724538573-after.webp?v=1793724565773"
    ],
    "recommendedTreatmentIds": [
      "facial-skin-care"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "facial-skin-care",
    "linkedTreatmentId": "facial-skin-care",
    "linkedTreatmentTitle": "Facial skin care",
    "beforeAltText": "Before Eyebrow Wax treatment at Age Reversal Clinics London — baseline clinical photography",
    "afterAltText": "After Eyebrow Wax treatment result (6 Weeks • 3 Sessions) at Age Reversal Clinics London — verified transformation",
    "singleFrameAltText": "Clinical Transformation Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "seoKeywords": [
      "before and after eyebrow wax london",
      "eyebrow wax before and after",
      "age reversal clinics eyebrow wax results",
      "lash & eyebrow results london",
      "anti-aging clinic london",
      "hair & beauty",
      "lash & eyebrow",
      "clinical aesthetic treatments"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1794059764677
  },
  {
    "id": "pair-1793719815460",
    "title": "Clinical Transformation",
    "category": "Skin Texture & Scars",
    "tag": "Facial skin care",
    "patientInfo": "Facial skin care",
    "duration": "8 Weeks",
    "sessions": 1,
    "concern": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "beforeImage": "/assets/transformations/pair-1793719815460-before.webp?v=1793719827879",
    "afterImage": "/assets/transformations/pair-1793719815460-after.webp?v=1793719837247",
    "galleryImages": [
      "/assets/transformations/pair-1793719815460-before.webp?v=1793719827879",
      "/assets/transformations/pair-1793719815460-after.webp?v=1793719837247"
    ],
    "recommendedTreatmentIds": [
      "facial-skin-care"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "facial-skin-care",
    "linkedTreatmentId": "facial-skin-care",
    "linkedTreatmentTitle": "Facial skin care",
    "beforeAltText": "Before Eyebrow Wax treatment at Age Reversal Clinics London — baseline clinical photography",
    "afterAltText": "After Eyebrow Wax treatment result (6 Weeks • 3 Sessions) at Age Reversal Clinics London — verified transformation",
    "singleFrameAltText": "Clinical Transformation Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "seoKeywords": [
      "before and after eyebrow wax london",
      "eyebrow wax before and after",
      "age reversal clinics eyebrow wax results",
      "lash & eyebrow results london",
      "anti-aging clinic london",
      "hair & beauty",
      "lash & eyebrow",
      "clinical aesthetic treatments"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1794059769815
  },
  {
    "id": "pair-1",
    "title": "Facial skin care",
    "category": "Skin Texture & Scars",
    "tag": "Facial skin care",
    "patientInfo": "Facial skin care",
    "duration": "12 Weeks",
    "sessions": 3,
    "concern": "Skin Treatment - 12 Wks — Before & After Result | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu",
    "afterImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6YRX4oWEimDRlPfT4ZvP49QVjagike9HlAOT7FsLhwf61UL4dCKCGWr1FS7SmMqMhd9VheV3RuR4bKmR_H3dRMFEAxUvuwj56dIFiriv8niGvOiz7XVef6Gjx4h3iHxaFayLl_g4p2ViKYOGEKxMw4bAR7W5VL-rkDMyy7LQjrabplnGUsrY6j9fECzUiFYmk_OZ_-hBZJAePOaKJjK0lqqjd7ahusnbsXJYKmIG5Rs5lmafypBuU_b9wqYQQG0v8O8BfCz2mokhu",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtnTWTfvtjmgPs1n1Q2b5gdUnZqNuGV3e-_ZLF0KZFSWWrFhA3eAIX2iTTuaY-hDvVwQ5PKReB6fFMP3tq1WnzmcGJr11CXLsLkYmYd8zLGLdL5zETq6wohVWzqLcykLevZUPnJ_LG55HukqRiTUllO8pE80UJFXvPUytiYATX5fbzVCDVz_cqX20l_6dKdFzb4UaffXMlUAbDiZwQL531mZiVM9lUuSozSA_-uLXJhit8mpHzT04T8XOmmy7yIYQyPOkWqJTIqPfO"
    ],
    "recommendedTreatmentIds": [
      "facial-skin-care"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "facial-skin-care",
    "linkedTreatmentId": "facial-skin-care",
    "linkedTreatmentTitle": "Facial skin care",
    "beforeAltText": "Skin Treatment - 12 Wks Before Anti-Aging Rejuvenation Treatment at Age Reversal Clinics London",
    "afterAltText": "Skin Treatment - 12 Wks After Anti-Aging Rejuvenation Treatment Result at Age Reversal Clinics London",
    "singleFrameAltText": "Facial skin care Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Skin Treatment - 12 Wks — Before & After Result | Age Reversal Clinics",
    "seoKeywords": [
      "skin treatment - 12 wks before and after",
      "anti-aging rejuvenation london",
      "age reversal clinics results"
    ],
    "featured": false,
    "hidden": false,
    "updatedAt": 1793722234602
  },
  {
    "id": "pair-4",
    "title": "Vertical Comparison",
    "category": "Hair Density",
    "tag": "Platelet-Rich Plasma (PRP)",
    "patientInfo": "Platelet-Rich Plasma (PRP)",
    "duration": "20 Weeks",
    "sessions": 4,
    "concern": "Vertical Comparison — Before & After Result | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR",
    "afterImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAt4dLQWWadBxtTzBpplagu2J9MUvwKtNJkgViQjChgH82bAH_iO6gF6p-TSVCSZ2jViPeml_xgEZ7Iq6F_NEVjRCtxJ7KhPFDOYT5byV1VJXaplQwCg6QybxEWi8wHT_QpGlWU8xBqFyhtpBZao172mEYVtF0UVKABJBqCwM5SU30IS2ON1eLnGldXQRWwBGjBQU7aTfniH71oyqdfhnTK_-tGbm5YfhUmEG8QjW9Nsh3NLL2fC3UAJ83TDu-VoVMkNkLRQQdclSVR",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkakM8tbhNmtYeKmoQBAAzTei0SDwQVg3jf4IfrTGNP8I8WmzYu8BL-eZUD6ccSBm9fY3UgWCvjrJX1rBeyzCvPpnD3Fa7-r7rI5pw8wP459wQIwtGxvpKIrc7paJJ_LgbbcH6SrOD3cwg6mM0x7ZahhhPNgqR7PkR4wXem9rqOpBJQQq8lP3Zmij233vHOLihq3N7Pxxs00WXjWevFzHxFsHzlNU6_pv9H7yfM-0JpAPd-C0UGYVLJ7BZ6WyP8HWAt41DR1q8v6Hd"
    ],
    "recommendedTreatmentIds": [
      "platelet-rich-plasma-prp"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "platelet-rich-plasma-prp",
    "linkedTreatmentId": "platelet-rich-plasma-prp",
    "linkedTreatmentTitle": "Platelet-Rich Plasma (PRP)",
    "beforeAltText": "Vertical Comparison Before Clinical Hair Restoration Treatment at Age Reversal Clinics London",
    "afterAltText": "Vertical Comparison After Clinical Hair Restoration Treatment Result at Age Reversal Clinics London",
    "singleFrameAltText": "Vertical Comparison Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Vertical Comparison — Before & After Result | Age Reversal Clinics",
    "seoKeywords": [
      "vertical comparison before and after",
      "clinical hair restoration london",
      "age reversal clinics results"
    ],
    "featured": false,
    "hidden": false,
    "updatedAt": 1792683065640
  },
  {
    "id": "pair-2",
    "title": "Co@ Laser from",
    "category": "Skin Texture & Scars",
    "tag": "Co@ Laser from",
    "patientInfo": "Co@ Laser from",
    "duration": "12 Weeks",
    "sessions": 3,
    "concern": "Laser Therapy & Skin Revision — Before & After Result | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk",
    "afterImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKPf3nijQRz9NaEd_b-5EiczAejYyrgh_dwMC6S-1-7Hi8EJJnt8_x2x-i1qG-qJ0BxvXbk_PeIeusHvMggQrPf2ijjCJ-yYtr-Ur19sJw4_NIIAlLMv1S2ct_OUVp3CJNba1hCLXrrPOcfhQAQUcgqZJFcuUL6Q4KXUwM1ALRAeo6Bb79xdI4FoLRUFAP9_MlbZ8tUedBAnuVrheDWpnRtLnB17gtdOx3OFGMbTVs5jhXXnZD6b-y7OCBnlBNOtqOPMcKxAdzDKRk",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFNbqNx3wVVcZoA9IP87KJkDnMZI-8uRSd-RL2-LhuxC6ADEkgMcpBDJ22CU3U7a_ZOllNge5XasdFvVaBYUhCDohAZdRi0HT1ymJ1s_FMyiXt8pJl7NGhaLkKATrZlXl3B2mFW01fD4Mzp3ixyyLcDfCdjXdPi58MzBZ-GTgGk7w7Ks96hydwAbc4rURmQ3Pel8YEcOvxIX5UbwIKvB4OdEuyDc-z_RnH-USDoP7hJ2AJkw4zTdCS7FDF6Vo4RFbWikgnECIa4gKP"
    ],
    "recommendedTreatmentIds": [
      "co2-laser-from"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "co2-laser-from",
    "linkedTreatmentId": "co2-laser-from",
    "linkedTreatmentTitle": "Co@ Laser from",
    "beforeAltText": "Laser Therapy & Skin Revision Before Acne & Scarring Treatment at Age Reversal Clinics London",
    "afterAltText": "Laser Therapy & Skin Revision After Acne & Scarring Treatment Result at Age Reversal Clinics London",
    "singleFrameAltText": "Co@ Laser from Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Laser Therapy & Skin Revision — Before & After Result | Age Reversal Clinics",
    "seoKeywords": [
      "laser therapy & skin revision before and after",
      "acne & scarring london",
      "age reversal clinics results"
    ],
    "featured": false,
    "hidden": false,
    "updatedAt": 1793722234603
  },
  {
    "id": "pair-6",
    "title": "Salmon sperm injection",
    "category": "Regenerative Biotech",
    "tag": "Salmon sperm injection",
    "patientInfo": "Salmon sperm injection",
    "duration": "8 Weeks",
    "sessions": 3,
    "concern": "Salmon sperm injection Before & After | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX",
    "afterImage": "https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8w5MUbCUhigRp4G10Px53i8pM5LlPXvGok1IMI9tfPVLc1vPbTXcVizuY0a7FUgMrFcm5L98Xs08D0hvgofos7jAy5TEpvRQ5GUJujJE3GWRiouw0s3B4jpkYJR1db0qtpsv5PiCal39YMEe8CP8Li6KnJE7SBhxHHvQI0MpV_RQ_WsP_BgTECwTD-00SRwlUlXxGleuIxhDX_blQ-Ag2NwFFNL2KuDaxg70V9SPTKSLIA4t_0TiZoJNr76f5Abg9KOBOgS9YLhX",
      "https://lh3.googleusercontent.com/aida/AP1WRLvqxcEGQQ_IhoxgMvHSmKkYhPqRrkLJbd4aNWGnzzPwueuS6A3G74wZmnU_Hszij8lbZ_G-BM7TofkWvfNmxb5v-n6NZKTD2y6YJX9HJIGyfX7RFL06HUfYV1tHDe31Ik1sCKpcTGj8y7wMb2ffsYOi9avp82xO6uR5VoFRJumpJ84CAuwDKN60xo7T90ejJ_ZZ09Y-n7t90lzl3KlWyHZMF26scGeieRwTxo7LbSa6ilxXfJcles_mHZY"
    ],
    "recommendedTreatmentIds": [
      "salmon-sperm-injection"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "salmon-sperm-injection",
    "linkedTreatmentId": "salmon-sperm-injection",
    "linkedTreatmentTitle": "Salmon sperm injection",
    "beforeAltText": "Salmon sperm injection Before Treatment at Age Reversal Clinics London",
    "afterAltText": "Salmon sperm injection After Treatment at Age Reversal Clinics London",
    "singleFrameAltText": "Salmon sperm injection Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Salmon sperm injection Before & After | Age Reversal Clinics",
    "seoKeywords": [
      "salmon sperm injection before and after",
      "polynucleotides london",
      "skin texture repair"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1793900426645
  },
  {
    "id": "pair-7",
    "title": "Morpheus8 treatment",
    "category": "Lifting & Contouring",
    "tag": "Morpheus8 treatment",
    "patientInfo": "Morpheus8 treatment",
    "duration": "12 Weeks",
    "sessions": 3,
    "concern": "Morpheus8 treatment Before & After | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ",
    "afterImage": "https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ",
      "https://lh3.googleusercontent.com/aida/AP1WRLv5evIx7Bexs-9iJGxOP9dKFElgqCjw3duyD5PU_MlEubT0SyTO7PuZhJtmqUZf6JcUhS8jDhV8HW0kBhWUb4MYYalT72IO5pVBeVZs2593mjjAC6tI1ZOA1a9xGgg-M5J5waWMYO9uVD4zle9guZj31tQOME7032wvttEoahsd7HhWFooW0oUTyDgrytGK4oKIN0d2mGO5oLnx-NQ5sF7-OZHtA3a9_sCrUegKiXGZwpy_05469C2zVgo"
    ],
    "recommendedTreatmentIds": [
      "morpheus8-treatment"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "morpheus8-treatment",
    "linkedTreatmentId": "morpheus8-treatment",
    "linkedTreatmentTitle": "Morpheus8 treatment",
    "beforeAltText": "Morpheus8 treatment Before Treatment at Age Reversal Clinics London",
    "afterAltText": "Morpheus8 treatment After Treatment at Age Reversal Clinics London",
    "singleFrameAltText": "Morpheus8 treatment Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Morpheus8 treatment Before & After | Age Reversal Clinics",
    "seoKeywords": [
      "morpheus8 treatment before and after london",
      "jawline tightening results",
      "rf microneedling london"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1793900430694
  },
  {
    "id": "pair-8",
    "title": "Emface skin tightening and lifting",
    "category": "Lifting & Contouring",
    "tag": "Emface skin tightening and lifting",
    "patientInfo": "Emface skin tightening and lifting",
    "duration": "16 Weeks",
    "sessions": 3,
    "concern": "Emface skin tightening and lifting Before & After | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW",
    "afterImage": "https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXfD3Ny6lT_nplOKArSn9UMyYjV0kJxgwTv9M46cSVVZDZx4FzrO_KNbY_f56HXoovg-u_7fjsySFcPxQ7aeoCXyvpaZ8HoTR8WN4CJkI3i-hDY4Lls42VtrUVSEPHmoxhgjLGWk4dRU-Qmj_2OwZBLCiE32cpKU8YYbUtLJDGZAXTURhZpoMdkpSlRNh0lSS9O8ggHCc2_L8UEMkieEVJ-m29SbD9ArZaSF8SJeSBfmidviqvhTE9kC6xU0258PUF2vcEPwtX8tXW",
      "https://lh3.googleusercontent.com/aida/AP1WRLvjSZco1dx7hVrPVVTpQCccko7If_cqC5uOFd2CXxLocZ1Oun9i5J-udXlCHNTRIGovtFU3pvvKxN6bGyBSymSOknWQSay0i9Yvs1QU_Ia9uCO5XIIvfi777lZLw3-q6LKf1n2pC8dBD3PP9G8Hn786rtUIjnDvBWn9TLNxvKzeXiqTpQjDapVzgPYwprK0lTqb8Rum95xgsa5gryXO4p2TwfrF4HD3T449sGZQOwQ5uYmWyZPyjK2xozM"
    ],
    "recommendedTreatmentIds": [
      "emface-skin-tightening-and-lifting"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "emface-skin-tightening-and-lifting",
    "linkedTreatmentId": "emface-skin-tightening-and-lifting",
    "linkedTreatmentTitle": "Emface skin tightening and lifting",
    "beforeAltText": "Emface skin tightening and lifting Before Treatment at Age Reversal Clinics London",
    "afterAltText": "Emface skin tightening and lifting After Treatment at Age Reversal Clinics London",
    "singleFrameAltText": "Emface skin tightening and lifting Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Emface skin tightening and lifting Before & After | Age Reversal Clinics",
    "seoKeywords": [
      "emface skin tightening and lifting before and after london",
      "non-surgical facelift results",
      "facial lifting clinic"
    ],
    "featured": false,
    "hidden": true,
    "updatedAt": 1793900437440
  },
  {
    "id": "pair-3",
    "title": "Dermal Fillers-1ml",
    "category": "Facial Rejuvenation",
    "tag": "Dermal Fillers-1ml",
    "patientInfo": "Dermal Fillers-1ml",
    "duration": "Single Session",
    "sessions": 1,
    "concern": "Advanced Aesthetics — Before & After Result | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV",
    "afterImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD20NLhroXmHS02eweFz9RBF-OhZ1RaQuMYe3uKrQ3iyvZ-roWLw57bJ33sw80W5DRjj47x5XfDBbMjHImuC7GRyDB99DirCCEbVZV8CTtkxIlVvsv3muJIAVMTHXiXqyc5zkYEu_ONKT40va6LO1TTmuJIgnYDdf4IauNPrqGL0pqV8S7wijzbRu89PlKh7cdxVcMqll1kYNG8e8Oy-dy4Ftdm6rYT9ZMn2IlwhqOYW0ekq6d9NnIYN_xGqSaNcN5s4N1iiVJMk3GV",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDccMXAIYxuO2yvwTqN8m4d8QLiy48sfir-uvPIXURN6mHE9KnhgzWARsOBlK9Mr7YK53ev5SNz0PPuGxVRLSblgomVrpZxwnyuJUkmY-Ozf1hCAotsXBatMbvNCyS04ZJlkaYgvTJNROZ-js6VboTaV_3ll-A3k6pNoAAipu9StjstMbS0Laznf_O50IKrmUFaecZ-yeGpZtc8RnmuWeJ_Qsqe53K1Vl0UbckdWbcqY249cXQYBmdHpG1v0uiCq0Ly6hPEjF90b3le"
    ],
    "recommendedTreatmentIds": [
      "dermal-fillers-1ml"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "dermal-fillers-1ml",
    "linkedTreatmentId": "dermal-fillers-1ml",
    "linkedTreatmentTitle": "Dermal Fillers-1ml",
    "beforeAltText": "Advanced Aesthetics Before Facial Harmony & Injectables Treatment at Age Reversal Clinics London",
    "afterAltText": "Advanced Aesthetics After Facial Harmony & Injectables Treatment Result at Age Reversal Clinics London",
    "singleFrameAltText": "Dermal Fillers-1ml Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Advanced Aesthetics — Before & After Result | Age Reversal Clinics",
    "seoKeywords": [
      "advanced aesthetics before and after",
      "facial harmony & injectables london",
      "age reversal clinics results"
    ],
    "featured": false,
    "hidden": false,
    "updatedAt": 1793722234605
  },
  {
    "id": "pair-5",
    "title": "Profhilo 2ml",
    "category": "Regenerative Biotech",
    "tag": "Profhilo 2ml",
    "patientInfo": "Profhilo 2ml",
    "duration": "8 Weeks",
    "sessions": 2,
    "concern": "Anti-Aging - 8 Wks — Before & After Result | Age Reversal Clinics",
    "beforeImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w",
    "afterImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0",
    "galleryImages": [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQHcq9zpePKkMqtIMFzx_zJA6A2MHoEn6csMvjhOOX7ANTgntEGIHbHHzkJdrRGuvr_rnNYa6j_vcZm7V9bkSv83qNQwd18XJJA14YTUOLU2diwqx3hP_e-l8axRA5ZOsfN1xGiRO0pPe2sb4cNQEz8psyAxBRjvefn1MvexT-2iAwkVKIyT8R_56LKMScwW7_sMvuBzMGXxdp0I1cFNoqfp7K5RhhrtrwcfrUPw1dRPmX60Zc0esbeUgaFqwO959IBqnu8sf8OA4w",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZoLjpjMEmJNM6EwzVC9AzZEWfQUVa-TmVyM-NgPL8ONCjzwY7nZ6rFqOxJ9jyK0OMnlIij8h8SOt93jaHfSglwGqtwAN3uabUuoux0yNyPzieFFX7iyB4YhjLSsBzd2BRDjEDVB1RlXcG4VC8SswApL8QbBnPLshzCzMX8LSdFYZsa0PRI6MM6b7I67HIl-B6YLhZAH5ZI9mcghNQsybRemIqmq4LWl9BCKjn5KaTyU1RyMrHYkwMgx1ABZOJ1-OJiLkjF-5mIKY0"
    ],
    "recommendedTreatmentIds": [
      "profhilo-2ml"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "profhilo-2ml",
    "linkedTreatmentId": "profhilo-2ml",
    "linkedTreatmentTitle": "Profhilo 2ml",
    "beforeAltText": "Anti-Aging - 8 Wks Before Anti-Aging Rejuvenation Treatment at Age Reversal Clinics London",
    "afterAltText": "Anti-Aging - 8 Wks After Anti-Aging Rejuvenation Treatment Result at Age Reversal Clinics London",
    "singleFrameAltText": "Profhilo 2ml Before & After Transformation at Age Reversal Clinics London",
    "seoTitle": "Anti-Aging - 8 Wks — Before & After Result | Age Reversal Clinics",
    "seoKeywords": [
      "anti-aging - 8 wks before and after",
      "anti-aging rejuvenation london",
      "age reversal clinics results"
    ],
    "featured": false,
    "hidden": false,
    "updatedAt": 1793722234605
  }
];

export function getRecommendedTreatmentsForCase(caseItem: TransformationCase): TreatmentPricingItem[] {
  return caseItem.recommendedTreatmentIds
    .map(id => getHybridTreatmentPricing(id))
    .filter((t): t is TreatmentPricingItem => !!t);
}

export function getRecommendedProductsForCase(caseItem: TransformationCase): ShopProduct[] {
  return caseItem.recommendedProductIds
    .map(id => SHOP_PRODUCTS.find(p => p.id === id))
    .filter((p): p is ShopProduct => !!p);
}


