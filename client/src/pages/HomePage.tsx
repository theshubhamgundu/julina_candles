import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import PopularProducts from '../components/PopularProduct';
import { useLatestProductsQuery } from '../redux/api/product.api';
import Banner from '../components/common/Banner';
import CustomerReviews from '../components/common/CustomerReviews';
import FAQSection from '../components/common/FAQSection';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, faqSchema } from '../seo/schemas';

const HOME_FAQS = [
  {
    question: 'What makes Julina Candles & Melts special?',
    answer: 'Julina Candles & Melts is a trusted exporter and supplier of handcrafted decorative candles, scented soy wax candles, and traditional urli candles from Maharashtra, India.',
  },
  {
    question: 'Are your candles safe and non-toxic?',
    answer: 'Yes, 100%. Our candles are made with pure, eco-friendly soy wax which burns soot-free and non-toxic.',
  },
  {
    question: 'Do you accept bulk, wholesale, and global export orders?',
    answer: 'Yes! We supply wholesalers, retailers, event planners, and international buyers with custom packaging.',
  },
  {
    question: 'How long do your scented soy wax candles burn?',
    answer: 'Our jar and urli candles offer extended burn times ranging from 25 to 50+ hours depending on the candle size.',
  },
  {
    question: 'How long does shipping take across India and globally?',
    answer: 'Orders within India are dispatched within 24–48 hours and delivered in 3 to 5 business days.',
  },
  {
    question: 'How can I contact support regarding my order or custom request?',
    answer: 'You can connect with our customer support team directly on WhatsApp or phone at +91 7304888197 or email us at pranita311096@gmail.com.',
  },
];

const HomePage: React.FC = () => {
  const { data: productData, isLoading: productLoading, isError: productError } = useLatestProductsQuery('');
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
      faqSchema(HOME_FAQS),
    ],
  });

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#FBF6ED]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#5C2333]/20 border-t-[#5C2333] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600 font-sans tracking-wide">Loading candle collection…</p>
        </div>
      </div>
    );
  }

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

      {/* ─── Trust Strip ─── */}
      <Banner />

      {/* ─── Craftsmanship Section ─── */}
      <section className="py-16 bg-white border-y border-[#E6DACB]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-sans font-bold text-[#C79A56] uppercase tracking-[0.2em] mb-3">
              Why Julina Candles & Melts
            </p>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#2A1C22] leading-tight mb-6">
              Artisanal Elegance.<br />
              <span className="text-[#5C2333]">Pure Natural Soy Wax.</span>
            </h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-lg">
              We handcraft exquisite decorative candles, lotus pond urlis, coffee bean infused jars, and festive modak candles. Made with 100% natural soy wax and therapeutic aromatherapy essential oils.
            </p>
            <div className="space-y-5">
              {[
                { title: '100% Eco-Friendly Soy Wax', desc: 'Clean, non-toxic, soot-free burn safe for every home environment.' },
                { title: 'Hand-poured in Maharashtra, India', desc: 'Crafted with artistic precision and Indian cultural heritage motifs.' },
                { title: 'Global Bulk Export & Wholesale', desc: 'Custom branding, sturdy packaging, and nationwide/worldwide shipping.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C79A56]/15 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#5C2333]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#2A1C22]">{item.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5C2333]/5 to-[#C79A56]/10 rounded-3xl -rotate-2"></div>
            <img
              src="/images/products/julina candles melts artisanal rituals 1.png"
              alt="Julina Candles & Melts Artisanal Collection"
              className="relative w-full max-w-md object-contain drop-shadow-xl rounded-2xl border-4 border-white"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/logo.png';
              }}
            />
          </div>
        </div>
      </section>

      {/* ─── Products ─── */}
      <PopularProducts products={products} />

      {/* ─── Products ─── */}
      <PopularProducts products={products} />

      {/* ─── Reviews ─── */}
      <CustomerReviews />

      {/* ─── Brand & Service FAQs ─── */}
      <FAQSection />
    </div>
  );
};

export default HomePage;
