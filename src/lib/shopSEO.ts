import { CLINIC_DATA } from '../data/clinicInfo';
import { SHOP_PRODUCTS } from '../data/shopProducts';
import { ShopProduct } from '../types/shop';

/**
 * 1. Generates Google Shopping-compliant Schema.org Product structured data for a single item
 */
export const generateSingleProductSchema = (product: ShopProduct) => {
  const images = [product.image];
  if (product.hoverImage && product.hoverImage !== product.image) {
    images.push(product.hoverImage);
  }
  if (product.textureImage) {
    images.push(product.textureImage);
  }

  const sku = product.sku || `ARC-SKU-${product.id.toUpperCase()}`;
  const brandName = product.brand || product.range || CLINIC_DATA.name;
  const ratingValue = product.rating || 4.9;
  const reviewsCount = product.reviewsCount || 64;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${CLINIC_DATA.canonicalUrl}/#product-${product.id}`,
    name: product.name,
    image: images,
    description: product.description,
    sku: sku,
    mpn: sku,
    brand: {
      '@type': 'Brand',
      name: brandName,
      logo: CLINIC_DATA.logo.icon
    },
    category: `Health & Beauty > Personal Care > Cosmetics > Skin Care > ${product.type}`,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Volume / Size',
        value: product.volume || 'Standard'
      },
      {
        '@type': 'PropertyValue',
        name: 'Target Skin Concerns',
        value: product.skinConcerns.join(', ')
      },
      {
        '@type': 'PropertyValue',
        name: 'Skin Types',
        value: product.skinType.join(', ')
      },
      ...(product.keyIngredients
        ? [
            {
              '@type': 'PropertyValue',
              name: 'Key Active Ingredients',
              value: product.keyIngredients.join(', ')
            }
          ]
        : [])
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: ratingValue.toString(),
      reviewCount: reviewsCount.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    offers: {
      '@type': 'Offer',
      url: `${CLINIC_DATA.canonicalUrl}/#product-${product.id}`,
      priceCurrency: product.currency || CLINIC_DATA.currency || 'GBP',
      price: product.price.toFixed(2),
      priceValidUntil: '2027-12-31',
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'MedicalOrganization',
        name: CLINIC_DATA.name,
        url: CLINIC_DATA.canonicalUrl
      }
    }
  };
};

/**
 * 2. Generates an array of Schema.org Product structured data for all catalog products
 */
export const generateAllProductsSchema = () => {
  return SHOP_PRODUCTS.map((product) => generateSingleProductSchema(product));
};

/**
 * 3. Generates an ItemList Schema representing the full Skincare Collection catalog
 */
export const generateProductCatalogItemListSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${CLINIC_DATA.name} - Medical Skincare & Prescribed Formulations`,
    description: 'Physician-curated active medical skincare, barrier recovery creams, and post-procedure serums.',
    url: `${CLINIC_DATA.canonicalUrl}/#shop`,
    numberOfItems: SHOP_PRODUCTS.length,
    itemListElement: SHOP_PRODUCTS.map((product, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: generateSingleProductSchema(product)
    }))
  };
};
