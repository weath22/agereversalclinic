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
    "id": "pair-1793264833765",
    "title": "Eyebrow Wax Transformation",
    "category": "Facial Rejuvenation",
    "tag": "lash & eyebrow",
    "patientInfo": "lash & eyebrow",
    "duration": "20 mins 3 Sessions",
    "sessions": 3,
    "concern": "Eyebrow Wax Before & After Results (6 Weeks • 3 Sessions) | Age Reversal Clinics London",
    "beforeImage": "/assets/transformations/ba-eyebrow-wax-before-1793264989514.webp?v=1793264989600",
    "afterImage": "/assets/transformations/ba-eyebrow-wax-after-1793265001438.webp?v=1793265001447",
    "galleryImages": [
      "/assets/transformations/ba-eyebrow-wax-before-1793264989514.webp?v=1793264989600",
      "/assets/transformations/ba-eyebrow-wax-after-1793265001438.webp?v=1793265001447"
    ],
    "recommendedTreatmentIds": [
      "eyebrow-wax"
    ],
    "recommendedProductIds": [
      "st-antioxidant-soothing-serum",
      "st-antioxidant-matte-day-cream"
    ],
    "treatmentGroupId": "lash-eyebrow",
    "linkedTreatmentId": "eyebrow-wax",
    "beforeAltText": "Before Eyebrow Wax treatment at Age Reversal Clinics London — baseline clinical photography",
    "afterAltText": "After Eyebrow Wax treatment result (6 Weeks • 3 Sessions) at Age Reversal Clinics London — verified transformation",
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
    "updatedAt": 1793265005264
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


