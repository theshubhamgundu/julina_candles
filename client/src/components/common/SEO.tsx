import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  noindex?: boolean;
  ogType?: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

const DOMAIN = 'https://julinacandlesandmelts.in';

const DEFAULT_TITLE = 'Julina Candles & Melts | Luxury Decorative, Scented & Urli Candle Exporter & Supplier from India';
const DEFAULT_DESCRIPTION =
  'Julina Candles & Melts is a trusted exporter and supplier of handcrafted decorative candles, scented candles, soy wax candles, flower candles, urli candles, coffee candles and luxury gift candles from Maharashtra, India.';
const DEFAULT_KEYWORDS =
  'decorative candle exporter india, scented candle supplier india, soy wax candle exporter, urli candle manufacturer india, flower candle supplier, coffee candle exporter, luxury candle exporter, gift candle supplier, handmade candle exporter india, premium candles manufacturer, candle exporter maharashtra, candle supplier india';
const DEFAULT_OG_IMAGE = `${DOMAIN}https://res.cloudinary.com/bzykgznp/image/upload/v1786389852/julina_candles/products/logo.png`;

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '',
  noindex = false,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
}) => {
  const canonicalUrl = canonicalPath
    ? `${DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    : DOMAIN;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots Directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Julina Candles & Melts" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

