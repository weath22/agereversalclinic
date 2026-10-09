/**
 * ============================================================================
 * SHOP PRODUCTS MEDIA & IMAGE REGISTRY
 * ============================================================================
 * Dedicated configuration file for all medical skincare products, bottle shots,
 * texture swatches, category banners, and skincare brand logos.
 *
 * Supports mapping by:
 * 1. Product ID: 'st-antioxidant-gel-cleanser', 'st-retinol-retinaldehyde', etc.
 * 2. Sequential Number / Order: 'product1', 'product2', 'product1_img', etc.
 * 3. Local asset file imports (e.g. src/assets/images/shop/...) or direct HTTPS URLs
 * ============================================================================
 */

export interface ShopProductMedia {
  primary: string;
  alt: string;
  hoverImage?: string;
  textureImage?: string;
  gallery?: string[];
}

export interface ShopRangeMedia {
  name: string;
  logo: string;
  banner?: string;
  tagline: string;
}

/**
 * 1. Skincare Product Visual Media Registry
 */
export const SHOP_PRODUCT_IMAGES: Record<string, ShopProductMedia> = {
  // 1. Antioxidant Gel Cleanser
  'st-antioxidant-gel-cleanser': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Gel Cleanser 200ml Bottle',
    hoverImage: 'https://images.unsplash.com/photo-1556228722-d0b73c4d5d9b?auto=format&fit=crop&w=800&q=80',
    textureImage: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ]
  },
  'product1': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Gel Cleanser'
  },
  'product1_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Gel Cleanser'
  },

  // 2. Antioxidant Matte Day Cream SPF 30
  'st-antioxidant-matte-day-cream': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Matte Day Cream SPF 30 50ml Jar',
    hoverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
    ]
  },
  'product2': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Matte Day Cream SPF 30'
  },
  'product2_img': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Matte Day Cream SPF 30'
  },

  // 3. Antioxidant Mini Matte Day Cream SPF 30
  'st-antioxidant-mini-matte-day-cream': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Mini Matte Day Cream SPF 30 30ml Travel Size'
  },
  'product3': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Mini Matte Day Cream'
  },
  'product3_img': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Mini Matte Day Cream'
  },

  // 4. Antioxidant Soothing Serum
  'st-antioxidant-soothing-serum': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Soothing Serum 30ml Dropper',
    hoverImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'
  },
  'product4': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Soothing Serum'
  },
  'product4_img': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Soothing Serum'
  },

  // 5. Antioxidant Tinted Day Cream SPF 30
  'st-antioxidant-tinted-day-cream': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Tinted Mineral Day Cream SPF 30'
  },
  'product5': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Tinted Day Cream'
  },
  'product5_img': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Tinted Day Cream'
  },

  // 6. Antioxidant Triple Peptide Cream
  'st-antioxidant-triple-peptide-cream': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Antioxidant Triple Peptide Reconstructive Night Cream 50ml'
  },
  'product6': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Triple Peptide Cream'
  },
  'product6_img': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Triple Peptide Cream'
  },

  // 7. Glycolic Gel Cleanser
  'st-glycolic-gel-cleanser': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Glycolic Gel Cleanser 7% AHA 200ml'
  },
  'product7': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Glycolic Gel Cleanser'
  },
  'product7_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Glycolic Gel Cleanser'
  },

  // 8. Peptide Eye Cream
  'st-peptide-eye-cream': {
    primary: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Peptide Eye Cream 15ml Targeted Dispenser'
  },
  'product8': {
    primary: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    alt: 'Peptide Eye Cream'
  },
  'product8_img': {
    primary: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    alt: 'Peptide Eye Cream'
  },

  // 9. Peptide Hyaluronic Serum
  'st-peptide-hyaluronic-serum': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Peptide Hyaluronic Hydration Serum 30ml'
  },
  'product9': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Peptide Hyaluronic Serum'
  },
  'product9_img': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Peptide Hyaluronic Serum'
  },

  // 10. Retinol Night Cream
  'st-retinol-night-cream': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Encapsulated Retinol 0.5% Night Cream 50ml'
  },
  'product10': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Retinol Night Cream'
  },
  'product10_img': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Retinol Night Cream'
  },

  // 11. Retinol Retinaldehyde Serum
  'st-retinol-retinaldehyde': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Retinaldehyde 0.1% Next-Gen Vitamin A Serum'
  },
  'product11': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Retinol Retinaldehyde Serum'
  },
  'product11_img': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Retinol Retinaldehyde Serum'
  },

  // 12. Salicylic Gel Cleanser
  'st-salicylic-gel-cleanser': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory 2% BHA Salicylic Clarifying Gel Cleanser 200ml'
  },
  'product12': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Salicylic Gel Cleanser'
  },
  'product12_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Salicylic Gel Cleanser'
  },

  // 13. Vitamin C AHA/BHA Cleanser
  'st-vitamin-c-aha-bha-cleanser': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Vitamin C AHA BHA Exfoliating Cleanser 200ml'
  },
  'product13': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C AHA/BHA Cleanser'
  },
  'product13_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C AHA/BHA Cleanser'
  },

  // 14. Vitamin C Cream Cleanser
  'st-vitamin-c-cream-cleanser': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Vitamin C Comforting Cream Cleanser 200ml'
  },
  'product14': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Cream Cleanser'
  },
  'product14_img': {
    primary: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Cream Cleanser'
  },

  // 15. Vitamin C Day Cream SPF 30
  'st-vitamin-c-day-cream': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Vitamin C Brightening Day Cream SPF 30 50ml'
  },
  'product15': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Day Cream'
  },
  'product15_img': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Day Cream'
  },

  // 16. Vitamin C Mini AHA/BHA Cleanser
  'st-vitamin-c-mini-aha-bha-cleanser': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Vitamin C Mini AHA BHA Cleanser 50ml'
  },
  'product16': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Mini Cleanser'
  },
  'product16_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Mini Cleanser'
  },

  // 17. Vitamin C Night Cream
  'st-vitamin-c-night-cream': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory 15% Vitamin C Restorative Night Cream 50ml'
  },
  'product17': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Night Cream'
  },
  'product17_img': {
    primary: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Night Cream'
  },

  // 18. Vitamin C Enzyme Mask
  'st-vitamin-c-enzyme-mask': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory Papaya and Pineapple Vitamin C Enzyme Mask 75ml'
  },
  'product18': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Enzyme Mask'
  },
  'product18_img': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin C Enzyme Mask'
  },

  // 19. Glycolic Exfoliating Mask
  'st-glycolic-exfoliating-mask': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory 10% Glycolic Exfoliating Clay Mask 75ml'
  },
  'product19': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Glycolic Exfoliating Mask'
  },
  'product19_img': {
    primary: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    alt: 'Glycolic Exfoliating Mask'
  },

  // 20. Antioxidant Brightening Serum
  'st-antioxidant-brightening-serum': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Skin Theory 15% Vitamin C and 3% Tranexamic Acid Brightening Serum 30ml'
  },
  'product20': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Brightening Serum'
  },
  'product20_img': {
    primary: 'https://images.unsplash.com/photo-1608248597359-00f7223e7cb4?auto=format&fit=crop&w=800&q=80',
    alt: 'Antioxidant Brightening Serum'
  },

  // 21. Post Laser Soothing Gel
  'laser-post-soothing-gel': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Laser Care Medical-Grade Pure Aloe and Panthenol Post-Laser Soothing Gel 100ml'
  },
  'product21': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Post Laser Soothing Gel'
  },
  'product21_img': {
    primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    alt: 'Post Laser Soothing Gel'
  },

  // 22. Laser After Care Bundle
  'laser-after-care-bundle': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Laser Care 3-Step Recovery Regimen Protocol Box'
  },
  'product22': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Laser After Care Bundle'
  },
  'product22_img': {
    primary: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    alt: 'Laser After Care Bundle'
  },

  // 23. Luxury Gift Voucher
  'gift-voucher': {
    primary: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Age Reversal Clinics Gold Foil Digital and In-Clinic Gift Voucher'
  },
  'product23': {
    primary: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury Gift Voucher'
  },
  'product23_img': {
    primary: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
    alt: 'Luxury Gift Voucher'
  }
};

/**
 * 2. Brand & Range Media Logos
 */
export const SHOP_RANGE_LOGOS: Record<string, ShopRangeMedia> = {
  'Skin Theory': {
    name: 'Skin Theory',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    tagline: 'Cellular Science & Active Bio-Dermatology'
  },
  'Laser Care': {
    name: 'Laser Care',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    tagline: 'Post-Procedure Cooling & Barrier Regeneration'
  },
  'Gifts & Vouchers': {
    name: 'Age Reversal Signature',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIxAPtwy25dyVaUdCDMYgFKwhE87Ovw-EQQpOpj1EMTR7CQdyctDfqvQxDE22j7SIGXlp65-55VaX1H_vRg7QzE0dfAPOlIveAIws39eS3n5H7bTh7s_kv7EZlEzstimdS26vu-ZS5ykgnEtm0q8DHvJZ_56xRttx7wsonwk4kIRJriAvRNSXj9NBvWwwOS3aoDkgn56aaLE0eky8ykHKvBJGZMXcvo6mW8VmnrrQYA4vM-ePWKApLHIc4H3lQEi2itJRHDA8s6XWJ',
    tagline: 'Prestige Clinical Gift Cards & Experiences'
  }
};

/**
 * 3. Helper: Look up product media by ID or numeric order with fallback
 */
export const getShopProductMedia = (identifier: string | number): ShopProductMedia => {
  const key = typeof identifier === 'number' ? `product${identifier}` : identifier;
  return (
    SHOP_PRODUCT_IMAGES[key] || {
      primary: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      alt: 'Medical Grade Skincare Product'
    }
  );
};
