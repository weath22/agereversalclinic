import { ShopProduct } from '../types/shop';
import { SHOP_PRODUCT_IMAGES, getShopProductMedia } from './shopImages';

export const SHOP_PRODUCTS: ShopProduct[] = [
  // 1. Antioxidant Gel Cleanser
  {
    id: 'st-antioxidant-gel-cleanser',
    name: 'Antioxidant Gel Cleanser',
    slug: 'skin-theory-antioxidant-gel-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['All Skin Types', 'Combination', 'Oily / Blemish-Prone'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Dehydration'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Daily Essential',
    sku: 'ARC-SKU-ANTIOX-CLEANSER-200',
    image: getShopProductMedia('st-antioxidant-gel-cleanser').primary,
    hoverImage: getShopProductMedia('st-antioxidant-gel-cleanser').hoverImage,
    textureImage: getShopProductMedia('st-antioxidant-gel-cleanser').textureImage,
    description: 'A gentle, foaming daily gel cleanser rich in green tea polyphenols and cellular antioxidants to purify pores without stripping the acid mantle.',
    clinicalBenefits: [
      'Removes daily micro-pollution and oxidative impurities without drying',
      'Protects natural lipid barrier and supports skin pH 5.5 balance',
      'Prepares stratum corneum for enhanced active serum absorption'
    ],
    volume: '200ml',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    keyIngredients: ['Green Tea Polyphenols 2%', 'Tocopherol (Vitamin E)', 'Gentle Plant Amino Acid Complex'],
    howToUse: 'Massage 1-2 pumps onto damp face for 60 seconds morning and evening. Rinse thoroughly with lukewarm water.'
  },

  // 2. Antioxidant Matte Day Cream SPF 30
  {
    id: 'st-antioxidant-matte-day-cream',
    name: 'Antioxidant Matte Day Cream SPF 30',
    slug: 'skin-theory-antioxidant-matte-day-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Day Cream',
    skinType: ['Oily / Blemish-Prone', 'Combination', 'All Skin Types'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Redness & Recovery'],
    price: 33.95,
    originalPrice: 44.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Best Seller',
    sku: 'ARC-SKU-MATTE-DAY-50',
    image: getShopProductMedia('st-antioxidant-matte-day-cream').primary,
    hoverImage: getShopProductMedia('st-antioxidant-matte-day-cream').hoverImage,
    description: 'Ultra-lightweight oil-free daytime hydration with broad-spectrum physical SPF 30 defense that leaves a velvet touch matte finish.',
    clinicalBenefits: [
      'Controls excess sebum production throughout the day with silica microspheres',
      'Broad-spectrum UVA/UVB photoprotection against photo-aging',
      'Niacinamide calms post-procedure redness and refines enlarged pores'
    ],
    volume: '50ml',
    rating: 4.8,
    reviewsCount: 98,
    inStock: true,
    keyIngredients: ['Micronized Zinc Oxide 12%', 'Niacinamide 4%', 'Silica Micro-spheres'],
    howToUse: 'Apply evenly across face and neck every morning 15 minutes before sun exposure. Reapply every 2 hours if outdoors.'
  },

  // 3. Antioxidant Mini Matte Day Cream SPF 30
  {
    id: 'st-antioxidant-mini-matte-day-cream',
    name: 'Antioxidant Mini Matte Day Cream SPF 30',
    slug: 'skin-theory-antioxidant-mini-matte-day-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Day Cream',
    skinType: ['Oily / Blemish-Prone', 'Combination'],
    skinConcerns: ['Anti-Aging & Fine Lines'],
    price: 29.95,
    originalPrice: 39.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Travel Size',
    sku: 'ARC-SKU-MATTE-DAY-30-MINI',
    image: getShopProductMedia('st-antioxidant-mini-matte-day-cream').primary,
    description: 'Travel-friendly compact version of our award-winning matte daily shield. Perfect for mid-day touch-ups on the go.',
    clinicalBenefits: [
      'Pocket-sized daily mineral defense for handbag or travel carry-on',
      'Instant shine reduction without chalky white residue',
      'Infuses hyaluronic hydration into moisture-deprived skin'
    ],
    volume: '30ml',
    rating: 4.9,
    reviewsCount: 46,
    inStock: true,
    keyIngredients: ['Zinc Oxide', 'Hyaluronic Acid Micro-molecules', 'Vitamin E'],
    howToUse: 'Dispense a dime-sized amount and gently massage over clean skin or on top of morning serums.'
  },

  // 4. Antioxidant Soothing Serum
  {
    id: 'st-antioxidant-soothing-serum',
    name: 'Antioxidant Soothing Serum',
    slug: 'skin-theory-antioxidant-soothing-serum',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Serum',
    skinType: ['Sensitive', 'Dry / Dehydrated', 'All Skin Types'],
    skinConcerns: ['Redness & Recovery', 'Dehydration', 'Anti-Aging & Fine Lines'],
    price: 54.95,
    originalPrice: 78.50,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Clinical Favorite',
    sku: 'ARC-SKU-SOOTHING-SERUM-30',
    image: getShopProductMedia('st-antioxidant-soothing-serum').primary,
    hoverImage: getShopProductMedia('st-antioxidant-soothing-serum').hoverImage,
    description: 'Clinical grade anti-inflammatory serum that accelerates cellular repair, soothes post-treatment flare-ups, and calms sensitivity.',
    clinicalBenefits: [
      'Rapidly alleviates post-microneedling, laser, and chemical peel erythema',
      'Strengthens the compromised lipid barrier with oat beta-glucan',
      'Neutralizes reactive oxygen species and environmental stressors'
    ],
    volume: '30ml',
    rating: 5.0,
    reviewsCount: 168,
    inStock: true,
    keyIngredients: ['Centella Asiatica (Cica) 5%', 'Oat Beta-Glucan 3%', 'Ferulic Acid Complex 0.5%'],
    howToUse: 'Apply 3-4 drops onto clean skin morning and evening before heavier creams.'
  },

  // 5. Antioxidant Tinted Day Cream SPF 30
  {
    id: 'st-antioxidant-tinted-day-cream',
    name: 'Antioxidant Tinted Day Cream SPF 30',
    slug: 'antioxidant-tinted-day-cream-spf-30',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Day Cream',
    skinType: ['All Skin Types', 'Dry / Dehydrated', 'Combination'],
    skinConcerns: ['Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 44.95,
    originalPrice: 64.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Doctor Pick',
    sku: 'ARC-SKU-TINTED-DAY-50',
    image: getShopProductMedia('st-antioxidant-tinted-day-cream').primary,
    description: 'Adaptive universal mineral pigment that blends seamlessly into all skin tones while delivering hydration and physical solar filter protection.',
    clinicalBenefits: [
      'Smart shade-adapting mineral pigments blur blemishes and diffuse redness',
      '100% physical mineral filters provide non-irritating solar shielding',
      'Plant squalane locks in deep hydration without clogging pores'
    ],
    volume: '50ml',
    rating: 4.9,
    reviewsCount: 114,
    inStock: true,
    keyIngredients: ['Mineral Iron Oxides', 'Titanium Dioxide', 'Plant Squalane 5%'],
    howToUse: 'Smooth over face with fingertips or cosmetic sponge for sheer, luminous coverage.'
  },

  // 6. Antioxidant Triple Peptide Cream
  {
    id: 'st-antioxidant-triple-peptide-cream',
    name: 'Antioxidant Triple Peptide Cream',
    slug: 'skin-theory-antioxidant-triple-peptide-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Night Cream',
    skinType: ['Dry / Dehydrated', 'All Skin Types'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Dehydration'],
    price: 69.95,
    originalPrice: 99.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Prestige Anti-Aging',
    sku: 'ARC-SKU-TRIPLE-PEPTIDE-50',
    image: getShopProductMedia('st-antioxidant-triple-peptide-cream').primary,
    description: 'Intense reconstructive cream formulated with three bio-mimetic peptides to densify collagen, firm jawline contours, and smooth deep wrinkles.',
    clinicalBenefits: [
      'Triggers neo-collagenesis and restores structural dermal elasticity',
      'Tripeptide blend works synergistically to relax dynamic expression lines',
      'Ceramide NP matrix prevents nocturnal transepidermal water loss'
    ],
    volume: '50ml',
    rating: 5.0,
    reviewsCount: 182,
    inStock: true,
    keyIngredients: ['Matrixyl 3000 (3%)', 'Copper Tripeptide-1', 'Ceramide NP Complex'],
    howToUse: 'Warm a pea-sized amount between fingertips and press into face, neck, and décolletage in the evening.'
  },

  // 7. Glycolic Gel Cleanser
  {
    id: 'st-glycolic-gel-cleanser',
    name: 'Glycolic Gel Cleanser',
    slug: 'skin-theory-glycolic-gel-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['Oily / Blemish-Prone', 'Combination', 'All Skin Types'],
    skinConcerns: ['Acne & Breakouts', 'Pigmentation & Brightening'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Resurfacing',
    sku: 'ARC-SKU-GLYCOLIC-CLEANSER-200',
    image: getShopProductMedia('st-glycolic-gel-cleanser').primary,
    description: 'Active 7% AHA resurfacing cleanser that gently dissolves dead keratinocytes to reveal refined skin texture and unclogged pores.',
    clinicalBenefits: [
      'Exfoliates surface dullness to boost cell renewal rates',
      'Fades post-acne dark marks and hyperpigmentation over time',
      'Deeply cleanses congested follicular canals'
    ],
    volume: '200ml',
    rating: 4.8,
    reviewsCount: 88,
    inStock: true,
    keyIngredients: ['Glycolic Acid 7%', 'Lactic Acid 2%', 'Aloe Barbadensis Leaf Juice'],
    howToUse: 'Use 3-4 times weekly in the evening. Massage for 45 seconds and rinse with lukewarm water.'
  },

  // 8. Peptide Eye Cream
  {
    id: 'st-peptide-eye-cream',
    name: 'Peptide Eye Cream',
    slug: 'skin-theory-peptide-eye-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Eye Cream',
    skinType: ['All Skin Types', 'Sensitive', 'Dry / Dehydrated'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Redness & Recovery', 'Dehydration'],
    price: 49.95,
    originalPrice: 69.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Eye Contour Specialist',
    sku: 'ARC-SKU-PEPTIDE-EYE-15',
    image: getShopProductMedia('st-peptide-eye-cream').primary,
    description: 'Targeted periorbital treatment addressing dark circles, puffiness, and crow’s feet with lymphatic stimulants and peptides.',
    clinicalBenefits: [
      'Drains periorbital fluid accumulation with concentrated caffeine',
      'Thickens delicate under-eye epidermis to mask dark vascular circles',
      'Visibly softens fine crow’s feet expression lines'
    ],
    volume: '15ml',
    rating: 4.9,
    reviewsCount: 132,
    inStock: true,
    keyIngredients: ['Eyeseryl Peptide 4%', 'Caffeine 3%', 'Marine Collagen Extract'],
    howToUse: 'Gently pat half a pump around the orbital bone morning and evening using your ring finger.'
  },

  // 9. Peptide Hyaluronic Serum
  {
    id: 'st-peptide-hyaluronic-serum',
    name: 'Peptide Hyaluronic Serum',
    slug: 'skin-theory-peptide-hyaluronic-serum',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Serum',
    skinType: ['Dry / Dehydrated', 'All Skin Types', 'Sensitive'],
    skinConcerns: ['Dehydration', 'Anti-Aging & Fine Lines'],
    price: 54.95,
    originalPrice: 79.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Hyaluronic Hero',
    sku: 'ARC-SKU-HYALURONIC-SERUM-30',
    image: getShopProductMedia('st-peptide-hyaluronic-serum').primary,
    description: 'Multi-molecular weight hyaluronic acid formula that re-plumps dermal layers from within for long-lasting bounce and radiance.',
    clinicalBenefits: [
      'Multi-depth hydration from epidermis down to the papillary dermis',
      'Instantly creates a glass-skin, dewy finish',
      'Promotes post-injection and skin booster longevity'
    ],
    volume: '30ml',
    rating: 5.0,
    reviewsCount: 204,
    inStock: true,
    keyIngredients: ['Multi-Weight Hyaluronic Acid (4 Weights)', 'Palmitoyl Tripeptide-5', 'Pro-Vitamin B5 (Panthenol)'],
    howToUse: 'Apply 3-4 drops to damp skin immediately after cleansing and follow with your preferred moisturizer.'
  },

  // 10. Retinol Night Cream
  {
    id: 'st-retinol-night-cream',
    name: 'Retinol Night Cream',
    slug: 'skin-theory-retinol-night-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Night Cream',
    skinType: ['All Skin Types', 'Combination', 'Dry / Dehydrated'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Pigmentation & Brightening'],
    price: 69.95,
    originalPrice: 99.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Cellular Renewal',
    sku: 'ARC-SKU-RETINOL-NIGHT-50',
    image: getShopProductMedia('st-retinol-night-cream').primary,
    description: 'Encapsulated 0.5% pure retinol suspended in a restorative ceramide base for maximum cellular renewal with zero irritation.',
    clinicalBenefits: [
      'Liposomal encapsulation ensures continuous 8-hour time-released retinol delivery',
      'Minimizes flaking, redness, and typical retinoid dermatitis symptoms',
      'Fades fine lines, photodamage, and age spots over 6-8 weeks'
    ],
    volume: '50ml',
    rating: 4.9,
    reviewsCount: 176,
    inStock: true,
    keyIngredients: ['Encapsulated Retinol 0.5%', 'Ceramides 1, 3, 6-II', 'Plant Squalane'],
    howToUse: 'Introduce gradually (2x weekly for 2 weeks, then nightly). Always wear broad-spectrum SPF the following morning.'
  },

  // 11. Retinol Retinaldehyde Serum
  {
    id: 'st-retinol-retinaldehyde',
    name: 'Retinol Retinaldehyde Serum',
    slug: 'skin-theory-retinol-retinaldehyde',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Serum',
    skinType: ['All Skin Types', 'Oily / Blemish-Prone'],
    skinConcerns: ['Anti-Aging & Fine Lines', 'Acne & Breakouts', 'Pigmentation & Brightening'],
    price: 59.95,
    originalPrice: 85.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'High-Potency Vitamin A',
    sku: 'ARC-SKU-RETINALDEHYDE-30',
    image: getShopProductMedia('st-retinol-retinaldehyde').primary,
    description: 'Next-generation Vitamin A derivative working 11x faster than standard retinol with direct antibacterial and anti-aging efficacy.',
    clinicalBenefits: [
      'Only 1 metabolic conversion away from Retinoic Acid for near-prescription results',
      'Exerts direct antibacterial action against Cutibacterium acnes',
      'Dramatically accelerates cellular turnover and collagen renewal'
    ],
    volume: '30ml',
    rating: 4.9,
    reviewsCount: 156,
    inStock: true,
    keyIngredients: ['Retinaldehyde 0.1%', 'Hyaluronic Acid Micro-spheres', 'Vitamin E'],
    howToUse: 'Smooth 2 pumps over clean face in the evening only. Follow with an intensive barrier cream.'
  },

  // 12. Salicylic Gel Cleanser
  {
    id: 'st-salicylic-gel-cleanser',
    name: 'Salicylic Gel Cleanser',
    slug: 'skin-theory-salicylic-gel-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['Oily / Blemish-Prone', 'Combination'],
    skinConcerns: ['Acne & Breakouts', 'Redness & Recovery'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Clarifying BHA',
    sku: 'ARC-SKU-SALICYLIC-CLEANSER-200',
    image: getShopProductMedia('st-salicylic-gel-cleanser').primary,
    description: 'Maximum strength 2% BHA oil-soluble cleanser that clears congested pores, dissolves sebum plugs, and minimizes blackheads.',
    clinicalBenefits: [
      'Oil-soluble Salicylic acid penetrates inside the sebaceous follicles',
      'Dissolves dead skin cell buildup that causes blackheads and comedones',
      'Tea tree oil provides natural antimicrobial purification'
    ],
    volume: '200ml',
    rating: 4.8,
    reviewsCount: 92,
    inStock: true,
    keyIngredients: ['Salicylic Acid 2%', 'Organic Tea Tree Leaf Oil', 'Zinc PCA 1%'],
    howToUse: 'Lather onto wet skin, concentrating on T-zone and congested areas. Rinse thoroughly with water.'
  },

  // 13. Vitamin C AHA/BHA Cleanser
  {
    id: 'st-vitamin-c-aha-bha-cleanser',
    name: 'Vitamin C AHA/BHA Cleanser',
    slug: 'skin-theory-vitamin-c-aha-bha-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['All Skin Types', 'Combination'],
    skinConcerns: ['Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 39.95,
    originalPrice: 56.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Triple Action Glow',
    sku: 'ARC-SKU-VITC-AHABHA-CLEANSER-200',
    image: getShopProductMedia('st-vitamin-c-aha-bha-cleanser').primary,
    description: 'Triple-action exfoliating and brightening cleanser that sweeps away dull surface buildup while infusing stabilized Vitamin C.',
    clinicalBenefits: [
      'Dual chemical exfoliation with Glycolic and Salicylic acids',
      'Infuses 3-O-Ethyl Ascorbic Acid to inhibit tyrosinase activity',
      'Leaves skin immediately refreshed, smooth, and radiant'
    ],
    volume: '200ml',
    rating: 4.9,
    reviewsCount: 118,
    inStock: true,
    keyIngredients: ['3-O-Ethyl Ascorbic Acid 3%', 'Glycolic & Salicylic Acid Complex', 'Citrus Fruit Botanical Extracts'],
    howToUse: 'Use once daily. Gently massage onto face in circular motions for 60 seconds, then rinse.'
  },

  // 14. Vitamin C Cream Cleanser
  {
    id: 'st-vitamin-c-cream-cleanser',
    name: 'Vitamin C Cream Cleanser',
    slug: 'skin-theory-vitamin-c-cream-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['Dry / Dehydrated', 'Sensitive', 'All Skin Types'],
    skinConcerns: ['Pigmentation & Brightening', 'Dehydration'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Comfort Cleansing',
    sku: 'ARC-SKU-VITC-CREAM-CLEANSER-200',
    image: getShopProductMedia('st-vitamin-c-cream-cleanser').primary,
    description: 'Rich, comforting cream cleanser designed for dehydrated and compromised skin that melts makeup and SPF without drying.',
    clinicalBenefits: [
      'Dissolves waterproof makeup, sunscreen, and daily grime',
      'Nourishing shea butter and jojoba seed oil cushion the lipid barrier',
      'Ascorbyl glucoside delivers gentle, continuous antioxidant support'
    ],
    volume: '200ml',
    rating: 4.9,
    reviewsCount: 79,
    inStock: true,
    keyIngredients: ['Ascorbyl Glucoside 2%', 'Organic Shea Butter', 'Cold-Pressed Jojoba Seed Oil'],
    howToUse: 'Apply to dry or damp skin, massage in gentle circular motions, and remove with a warm clinical washcloth.'
  },

  // 15. Vitamin C Day Cream SPF 30
  {
    id: 'st-vitamin-c-day-cream',
    name: 'Vitamin C Day Cream SPF 30',
    slug: 'skin-theory-vitamin-c-day-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Day Cream',
    skinType: ['All Skin Types', 'Dry / Dehydrated'],
    skinConcerns: ['Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 44.95,
    originalPrice: 64.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Daily Radiance',
    sku: 'ARC-SKU-VITC-DAY-50',
    image: getShopProductMedia('st-vitamin-c-day-cream').primary,
    description: 'Luminous anti-pollution day moisturizer that boosts collagen synthesis and neutralizes free radicals with active Vitamin C.',
    clinicalBenefits: [
      'Lipid-soluble THD Ascorbate penetrates 50x better than standard ascorbic acid',
      'Broad-spectrum SPF 30 prevents future UV-induced pigmentation',
      'Restores healthy luminous radiance to tired, sallow skin'
    ],
    volume: '50ml',
    rating: 5.0,
    reviewsCount: 147,
    inStock: true,
    keyIngredients: ['Tetrahexyldecyl (THD) Ascorbate 5%', 'Broad Spectrum SPF 30', 'Low Molecular Weight Hyaluronic Acid'],
    howToUse: 'Apply every morning over clean skin or following your antioxidant serum.'
  },

  // 16. Vitamin C Mini AHA/BHA Cleanser
  {
    id: 'st-vitamin-c-mini-aha-bha-cleanser',
    name: 'Vitamin C Mini AHA/BHA Cleanser',
    slug: 'skin-theory-vitamin-c-mini-aha-bha-cleanser',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Cleanser',
    skinType: ['All Skin Types', 'Combination'],
    skinConcerns: ['Pigmentation & Brightening'],
    price: 24.95,
    originalPrice: 35.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Travel Size',
    sku: 'ARC-SKU-VITC-CLEANSER-50-MINI',
    image: getShopProductMedia('st-vitamin-c-mini-aha-bha-cleanser').primary,
    description: 'Mini deluxe 50ml size of our best-selling triple brightening facial cleanser for travel and weekend getaways.',
    clinicalBenefits: [
      'Compact TSA-approved luxury travel size',
      'Maintains consistent clinical exfoliation routine while traveling',
      'Gently brightens and clarifies skin texture'
    ],
    volume: '50ml',
    rating: 4.8,
    reviewsCount: 39,
    inStock: true,
    keyIngredients: ['Vitamin C Complex', 'AHA/BHA Synergy', 'Panthenol'],
    howToUse: 'Lather between palms with lukewarm water and cleanse thoroughly.'
  },

  // 17. Vitamin C Night Cream
  {
    id: 'st-vitamin-c-night-cream',
    name: 'Vitamin C Night Cream',
    slug: 'skin-theory-vitamin-c-night-cream',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Night Cream',
    skinType: ['All Skin Types', 'Dry / Dehydrated'],
    skinConcerns: ['Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 69.95,
    originalPrice: 99.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Intense Nocturnal Repair',
    sku: 'ARC-SKU-VITC-NIGHT-50',
    image: getShopProductMedia('st-vitamin-c-night-cream').primary,
    description: 'High-potency nocturnal brightening treatment that evens out age spots, sun damage, and melasma during your sleep cycle.',
    clinicalBenefits: [
      '15% concentrated lipid-soluble Vitamin C suppresses nocturnal melanin synthesis',
      'Alpha-arbutin fades stubborn age spots and post-inflammatory pigmentation',
      'Bakuchiol stimulates collagen production without retinol-induced sensitivity'
    ],
    volume: '50ml',
    rating: 4.9,
    reviewsCount: 163,
    inStock: true,
    keyIngredients: ['15% Lipid-Soluble Vitamin C (THD)', 'Alpha-Arbutin 2%', 'Bakuchiol 1%'],
    howToUse: 'Massage over face, neck, and décolletage every evening following your serums.'
  },

  // 18. Vitamin C Enzyme Mask
  {
    id: 'st-vitamin-c-enzyme-mask',
    name: 'Vitamin C Enzyme Mask',
    slug: 'skin-theory-vitamin-c-enzyme-mask',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Mask',
    skinType: ['All Skin Types', 'Sensitive', 'Dry / Dehydrated'],
    skinConcerns: ['Pigmentation & Brightening', 'Dehydration'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Enzyme Polish',
    sku: 'ARC-SKU-VITC-MASK-75',
    image: getShopProductMedia('st-vitamin-c-enzyme-mask').primary,
    description: 'Papaya and pineapple fruit enzyme treatment infused with active bio-flavonoids that gently dissolves dead cells for instant glass-skin glow.',
    clinicalBenefits: [
      'Non-abrasive proteolytic enzymatic digestion of dead keratinocytes',
      'Kakadu plum provides exceptionally rich organic Vitamin C bio-infusion',
      'Leaves skin silky smooth, deeply hydrated, and instantly luminous'
    ],
    volume: '75ml',
    rating: 5.0,
    reviewsCount: 121,
    inStock: true,
    keyIngredients: ['Papain & Bromelain Enzymes', 'Kakadu Plum Vitamin C Extract', 'Colloidal White Kaolin Clay'],
    howToUse: 'Apply generous layer to clean face. Leave on for 10-15 minutes, then rinse with warm water.'
  },

  // 19. Glycolic Exfoliating Mask
  {
    id: 'st-glycolic-exfoliating-mask',
    name: 'Glycolic Exfoliating Mask',
    slug: 'skin-theory-glycolic-exfoliating-mask',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Mask',
    skinType: ['Oily / Blemish-Prone', 'Combination', 'All Skin Types'],
    skinConcerns: ['Acne & Breakouts', 'Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 34.95,
    originalPrice: 49.95,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Pro-Strength Peel',
    sku: 'ARC-SKU-GLYCOLIC-MASK-75',
    image: getShopProductMedia('st-glycolic-exfoliating-mask').primary,
    description: 'Professional-strength 10% Glycolic Acid weekly peeling mask that minimizes pore size, refines texture, and fades post-blemish marks.',
    clinicalBenefits: [
      '10% AHA peel concentration unglues stubborn dead skin cell deposits',
      'Purifying bentonite clay draws out deep follicular impurities and oil',
      'Refines rough dermal texture and smooths fine textural lines'
    ],
    volume: '75ml',
    rating: 4.8,
    reviewsCount: 96,
    inStock: true,
    keyIngredients: ['Glycolic Acid 10%', 'Salicylic Acid 1%', 'Volcanic Bentonite Clay'],
    howToUse: 'Use 1-2 times weekly. Apply a thin layer to clean dry skin, leave for 8-10 minutes, and rinse thoroughly.'
  },

  // 20. Antioxidant Brightening Serum
  {
    id: 'st-antioxidant-brightening-serum',
    name: 'Antioxidant Brightening Serum',
    slug: 'antioxidant-brightening-serum',
    range: 'Skin Theory',
    brand: 'Skin Theory',
    type: 'Serum',
    skinType: ['All Skin Types', 'Combination', 'Dry / Dehydrated'],
    skinConcerns: ['Pigmentation & Brightening', 'Anti-Aging & Fine Lines'],
    price: 54.95,
    originalPrice: 78.50,
    currency: 'GBP',
    discountBadge: '30%\nOFF!',
    badge: 'Clinically Proven',
    sku: 'ARC-SKU-BRIGHTENING-SERUM-30',
    image: getShopProductMedia('st-antioxidant-brightening-serum').primary,
    description: 'Synergistic formulation of Vitamin C, Ferulic Acid, and Tranexamic Acid delivering photoprotection and stubborn dark spot lightening.',
    clinicalBenefits: [
      '3% Tranexamic acid actively inhibits plasmin-mediated melanogenesis',
      '15% L-Ascorbic Acid neutralizes free radicals and restores firmness',
      'Ferulic acid doubles antioxidant longevity and UV protection'
    ],
    volume: '30ml',
    rating: 5.0,
    reviewsCount: 198,
    inStock: true,
    keyIngredients: ['Tranexamic Acid 3%', 'L-Ascorbic Acid 15%', 'Ferulic Acid 0.5%'],
    howToUse: 'Apply 4 drops to dry face every morning prior to moisturizer and sunscreen.'
  },

  // 21. Post Laser Soothing Gel
  {
    id: 'laser-post-soothing-gel',
    name: 'Post Laser Soothing Gel',
    slug: 'post-laser-soothing-gel',
    range: 'Laser Care',
    brand: 'Laser Care',
    type: 'Serum',
    skinType: ['Sensitive', 'All Skin Types', 'Dry / Dehydrated'],
    skinConcerns: ['Redness & Recovery'],
    price: 12.95,
    currency: 'GBP',
    badge: 'Post-Treatment Essential',
    sku: 'ARC-SKU-POST-LASER-GEL-100',
    image: getShopProductMedia('laser-post-soothing-gel').primary,
    description: 'Instant cooling gel formulated with medical-grade pure Aloe, Panthenol, and Allantoin to alleviate heat and erythema post-laser and peeling.',
    clinicalBenefits: [
      'Instantly drops skin surface temperature to relieve post-laser heat sensation',
      'Accelerates tissue re-epithelialization with high-potency D-Panthenol',
      'Free from fragrances, alcohol, parabens, and essential oils'
    ],
    volume: '100ml',
    rating: 4.9,
    reviewsCount: 175,
    inStock: true,
    keyIngredients: ['Medical Pure Aloe Vera 98%', 'D-Panthenol (Pro-Vitamin B5) 5%', 'Allantoin'],
    howToUse: 'Reapply liberally to treated zones as often as needed to maintain comfortable hydration.'
  },

  // 22. Laser After Care Bundle
  {
    id: 'laser-after-care-bundle',
    name: 'Laser After Care Bundle',
    slug: 'laser-after-care-bundle',
    range: 'Laser Care',
    brand: 'Laser Care',
    type: 'Bundle',
    skinType: ['Sensitive', 'All Skin Types'],
    skinConcerns: ['Redness & Recovery', 'Dehydration'],
    price: 39.95,
    originalPrice: 59.95,
    currency: 'GBP',
    discountBadge: '33%\nOFF!',
    badge: 'Complete Protocol Set',
    sku: 'ARC-SKU-LASER-BUNDLE-SET',
    image: getShopProductMedia('laser-after-care-bundle').primary,
    description: 'Complete 3-step recovery regimen comprising Post Laser Soothing Gel, Gentle Barrier Cleanser, and Mineral SPF 50 Physical Shield.',
    clinicalBenefits: [
      'Comprehensive 360-degree post-procedure clinical care in one protocol box',
      'Saves 33% compared to purchasing individual medical-grade items separately',
      'Guarantees safe healing and optimizes aesthetic procedure outcome'
    ],
    volume: 'Full Protocol Box Set (3 Items)',
    rating: 5.0,
    reviewsCount: 139,
    inStock: true,
    keyIngredients: ['Post Laser Soothing Gel (100ml)', 'Gentle Barrier Cleanser (150ml)', 'Mineral Physical SPF 50 Shield (50ml)'],
    howToUse: 'Follow protocol morning and evening for 7-10 days following aesthetic laser, microneedling, or peel procedures.'
  },

  // 23. Luxury Gift Voucher
  {
    id: 'gift-voucher',
    name: 'Prestige Clinic Gift Voucher (e-Voucher)',
    slug: 'gift-voucher',
    range: 'Gifts & Vouchers',
    brand: 'Age Reversal Signature',
    type: 'Voucher',
    skinType: ['All Skin Types'],
    skinConcerns: ['Anti-Aging & Fine Lines'],
    price: 50.00,
    currency: 'GBP',
    badge: 'Prestige Gift Experience',
    sku: 'ARC-SKU-GIFT-VOUCHER-50',
    image: getShopProductMedia('gift-voucher').primary,
    description: 'The ultimate luxury gift for loved ones. Redeemable towards any clinic doctor consultation, aesthetic procedure, or medical skincare formulation.',
    clinicalBenefits: [
      'Redeemable across Harley Street, Devonshire Place, and online skincare boutique',
      'Delivered instantly via digital e-card or physical gold-foil gift box upon request',
      'Valid for 12 months with priority doctor consultation booking reservation'
    ],
    volume: 'Digital e-Voucher / Gold Foil Card',
    rating: 5.0,
    reviewsCount: 84,
    inStock: true,
    keyIngredients: ['Redeemable for all medical injectables, exosome therapies, Morpheus8, and active skincare.'],
    howToUse: 'Present voucher code upon consultation check-in or checkout in-clinic or online.'
  }
];

export const FILTER_OPTIONS = {
  ranges: ['All Products', 'Skin Theory', 'Laser Care', 'Gifts & Vouchers'],
  types: ['Cleanser', 'Day Cream', 'Night Cream', 'Serum', 'Mask', 'Eye Cream', 'Bundle', 'Voucher'],
  skinTypes: ['All Skin Types', 'Dry / Dehydrated', 'Oily / Blemish-Prone', 'Sensitive', 'Combination'],
  skinConcerns: ['Anti-Aging & Fine Lines', 'Pigmentation & Brightening', 'Acne & Breakouts', 'Redness & Recovery', 'Dehydration']
};

/**
 * Fast helper functions for lookups and component consumption
 */
export const getProductById = (id: string): ShopProduct | undefined => {
  return SHOP_PRODUCTS.find((p) => p.id.toLowerCase() === id.toLowerCase() || p.slug.toLowerCase() === id.toLowerCase());
};

export const getProductsByConcern = (concern: string): ShopProduct[] => {
  return SHOP_PRODUCTS.filter((p) => p.skinConcerns.some((c) => c.toLowerCase().includes(concern.toLowerCase())));
};

export const getProductsByRange = (range: string): ShopProduct[] => {
  return SHOP_PRODUCTS.filter((p) => p.range.toLowerCase() === range.toLowerCase());
};
