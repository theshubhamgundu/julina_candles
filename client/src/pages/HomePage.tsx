import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import PopularProducts from '../components/PopularProduct';
import FeaturedVariants from '../components/FeaturedVariants';
import ProductCategories from '../components/ProductCategories';
import { useLatestProductsQuery } from '../redux/api/product.api';
import CustomerReviews from '../components/common/CustomerReviews';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema } from '../seo/schemas';
import { FaHeadset, FaTruckFast, FaGift, FaAward } from 'react-icons/fa6';

const HomePage: React.FC = () => {
  const { data: productData, isError: productError } = useLatestProductsQuery('');
  const products = productData?.products || [];

  usePageSEO({
    title: 'Julina Candles & Melts | Luxury Decorative & Scented Candle Exporter India',
    description:
      'Exporter & supplier of luxury handcrafted decorative candles, soy wax urli candles, flower candles, coffee collection candles, and festive gift sets from Maharashtra, India.',
    canonical: '/',
    keywords:
      'decorative candle exporter india, scented candle supplier, soy wax candles manufacturer, urli candle exporter, luxury candles india, Julina Candles & Melts',
    schema: [
      webPageSchema({
        url: '/',
        name: 'Julina Candles & Melts | Luxury Decorative Candle Exporter',
        description:
          'Handcrafted decorative, scented, and soy wax candle exporter and supplier from Maharashtra, India.',
        breadcrumb: [{ name: 'Home', url: '/' }],
      }),
    ],
  });

  if (productError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#FBF6ED]">
        <div className="text-center max-w-md px-6">
          <p className="text-5xl mb-4">🕯️</p>
          <h2 className="text-xl font-serif font-bold text-[#2A1C22] mb-2">Unable to load products</h2>
          <p className="text-sm text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#FBF6ED]">
      {/* ─── Hero Section ─── */}
      <FeaturedSection />

      {/* ─── Shop by Category ─── */}
      <ProductCategories />

      {/* ─── Design Spotlight (multi-variant & featured) ─── */}
      <FeaturedVariants products={products} />

      {/* ─── Products Collection ─── */}
      <PopularProducts products={products} />

      {/* ─── Customer Reviews ─── */}
      <CustomerReviews />

      {/* ─── Reach Out To Us Callout Banner ─── */}
      <section className="px-6 my-10 max-w-7xl mx-auto">
        <div className="relative rounded-[28px] overflow-hidden shadow-xl bg-[#2A1C22] text-center py-14 px-6 border border-[#C79A56]/30">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none"
            style={{ backgroundImage: "url('/images/reach_out_bg.jpeg')" }}
          />
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Reach Out to Us
            </h2>
            <p className="text-xs sm:text-sm text-[#F4EADA]/80 font-sans font-light">
              If you have any inquiries or concerns, please don't hesitate to reach out to us.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/917304888197"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#5C2333] hover:bg-[#3E1622] text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full transition-all shadow-md border border-[#C79A56]/40"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Trust Pillars Bar ─── */}
      <section className="pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: <FaHeadset />,
              title: 'Post-sale Support',
              subtitle: 'Reach out to us for queries',
            },
            {
              icon: <FaTruckFast />,
              title: 'Pan India Shipping',
              subtitle: 'In 3 to 5 business days',
            },
            {
              icon: <FaGift />,
              title: 'Product Offers',
              subtitle: 'Offers on selective products',
            },
            {
              icon: <FaAward />,
              title: 'Finest Quality Assured',
              subtitle: 'For a premium experience',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-full border border-[#5C2333]/30 px-5 py-3.5 flex items-center gap-3.5 shadow-2xs hover:shadow-md transition-all hover:border-[#5C2333]"
            >
              <div className="text-[#5C2333] text-2xl flex-shrink-0">
                {pillar.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#2A1C22] leading-tight">
                  {pillar.title}
                </h4>
                <p className="text-[11px] text-gray-500 font-sans font-light truncate mt-0.5">
                  {pillar.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
