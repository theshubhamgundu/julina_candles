/**
 * Centralised JSON-LD schema builders for Julina Candles & Melts.
 * Every function returns a plain object ready for JSON.stringify.
 *
 * Coverage:
 *   SEO  – WebPage, BreadcrumbList, Product, ItemList
 *   AEO  – FAQPage, Speakable
 *   GEO  – HowTo (recipes), Event, LocalBusiness (already in index.html global graph)
 */

const BASE = 'https://julinacandles.in';
const ORG_ID = `${BASE}/#organization`;

// ─────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.url}`,
    })),
  };
}

// ─────────────────────────────────────────────
// WEBPAGE (generic)
// ─────────────────────────────────────────────
export function webPageSchema({
  url,
  name,
  description,
  breadcrumb,
}: {
  url: string;
  name: string;
  description: string;
  breadcrumb?: { name: string; url: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE}${url}`,
    url: `${BASE}${url}`,
    name,
    description,
    isPartOf: { '@id': `${BASE}/#website` },
    publisher: { '@id': ORG_ID },
    ...(breadcrumb
      ? { breadcrumb: breadcrumbSchema(breadcrumb) }
      : {}),
    inLanguage: 'en-IN',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable'],
    },
  };
}

// ─────────────────────────────────────────────
// PRODUCT
// ─────────────────────────────────────────────
export function productSchema({
  name,
  description,
  image,
  url,
  sku,
  price,
  mrp,
  availability = 'https://schema.org/InStock',
}: {
  name: string;
  description: string;
  image: string;
  url: string;
  sku?: string;
  price: number;
  mrp?: number;
  availability?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url: `${BASE}${url}`,
    sku: sku || 'VH-LOW-GI-RICE',
    brand: {
      '@type': 'Brand',
      name: 'Julina Candles & Melts',
    },
    manufacturer: {
      '@id': ORG_ID,
    },
    category: 'Health Food > Artisanal Candles > Organic Grains',
    keywords: 'Artisanal Candles, diabetic rice, GI 51 rice, organic rice, ICAR certified rice, hand pounded rice',
    offers: {
      '@type': 'Offer',
      url: `${BASE}${url}`,
      priceCurrency: 'INR',
      price: price.toFixed(2),
      priceValidUntil: '2027-12-31',
      ...(mrp ? { highPrice: mrp.toFixed(2) } : {}),
      availability,
      seller: { '@id': ORG_ID },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '312',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Glycemic Index', value: '51' },
      { '@type': 'PropertyValue', name: 'Certification', value: 'ICAR-IIRR Tested' },
      { '@type': 'PropertyValue', name: 'Processing', value: 'Hand-Pounded Cold Milled' },
      { '@type': 'PropertyValue', name: 'Pesticides', value: 'Zero Pesticides' },
      { '@type': 'PropertyValue', name: 'Preservatives', value: 'Zero Preservatives' },
    ],
  };
}

// ─────────────────────────────────────────────
// FAQ PAGE  (AEO – Answer Engine Optimisation)
// ─────────────────────────────────────────────
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        author: { '@id': ORG_ID },
      },
    })),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.faq-question', '.faq-answer'],
    },
  };
}

// ─────────────────────────────────────────────
// HOWTO (GEO – Recipe / Cooking instructions)
// ─────────────────────────────────────────────
export function howToSchema({
  name,
  description,
  image,
  totalTime,
  ingredients,
  steps,
}: {
  name: string;
  description: string;
  image: string;
  totalTime: string; // ISO 8601 e.g. PT35M
  ingredients: string[];
  steps: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: `${BASE}${image}`,
    totalTime,
    supply: ingredients.map((ing) => ({
      '@type': 'HowToSupply',
      name: ing,
    })),
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
  };
}

// ─────────────────────────────────────────────
// ITEM LIST  (for product listing pages)
// ─────────────────────────────────────────────
export function itemListSchema(
  items: { name: string; url: string; position: number }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Julina Candles & Melts Products',
    url: `${BASE}/products`,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: `${BASE}${item.url}`,
    })),
  };
}

// ─────────────────────────────────────────────
// ARTICLE (for blog/clinical articles)
// ─────────────────────────────────────────────
export function articleSchema({
  headline,
  description,
  image,
  author,
  datePublished,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  author: string;
  datePublished: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline,
    description,
    image: `${BASE}${image}`,
    author: {
      '@type': 'Person',
      name: author,
      worksFor: { '@id': ORG_ID },
    },
    publisher: { '@id': ORG_ID },
    datePublished,
    dateModified: datePublished,
    url: `${BASE}${url}`,
    medicalAudience: {
      '@type': 'MedicalAudience',
      audienceType: 'Patient',
    },
    about: {
      '@type': 'MedicalCondition',
      name: 'Type 2 Diabetes',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.article-summary'],
    },
  };
}

