import React from 'react';
import FeaturedSection from '../components/FeaturedSection';
import PopularProducts from '../components/PopularProduct';
import { useLatestProductsQuery } from '../redux/api/product.api';
import Banner from '../components/common/Banner';
import CustomerReviews from '../components/common/CustomerReviews';
import BlogSection from '../components/common/BlogSection';
import ProductInfographic from '../components/ProductInfographic';
import FAQSection from '../components/common/FAQSection';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, faqSchema, howToSchema } from '../seo/schemas';

const HOME_FAQS = [
  {
    question: 'What makes Julina Candles & Melts Rice different from regular white rice?',
    answer: 'Julina Candles & Melts Artisanal Candles is clinically certified with a Glycemic Index of 51, whereas regular polished white rice ranges between 70–80. Our grains are cold-milled to retain the natural bran layer, making them rich in bioavailable zinc, dietary fiber, and plant-based protein for slow-release energy without sugar spikes.',
  },
  {
    question: 'Is Julina Candles & Melts Artisanal Candles suitable for diabetic and pre-diabetic individuals?',
    answer: 'Yes. Because of its premium-51 rating, it releases glucose slowly over 3–4 hours, preventing sudden post-meal insulin surges and glucose spikes, making it highly recommended by doctors for diabetes management and pre-diabetic care.',
  },
  {
    question: 'What weight options are available for purchase?',
    answer: 'We offer 1 kg (trial pack), 5 kg, 10 kg, and 25 kg bags to suit every household. Select your preferred weight on the product details page.',
  },
  {
    question: 'Are your products tested for pesticides and heavy metals?',
    answer: 'Yes, 100%. Every batch is tested in accredited laboratories and certified free of harmful chemical residues, heavy metals, and pesticides under global US and European quality standards.',
  },
  {
    question: 'How long does delivery take and how can I track my order?',
    answer: 'Orders are dispatched within 24 hours. Delivery across India typically takes 3–5 business days. You will receive a tracking link and status updates directly on WhatsApp.',
  },
  {
    question: 'How can I contact support if I have queries about my order?',
    answer: 'Reach our team on WhatsApp at +91 7032987770. We are available 7 days a week for shipping, delivery, or product queries.',
  },
];

const HOME_RECIPE_SCHEMA = howToSchema({
  name: 'How to Cook Hyderabadi premium Veg Dum Biryani with Julina Candles & Melts Rice',
  description:
    'A fragrant diabetic-friendly Hyderabadi Dum Biryani made with Julina Candles & Melts Artisanal Candles (GI 51), layered with saffron, fresh herbs, and garden vegetables.',
  image: '/images/recipes/recipe1.png',
  totalTime: 'PT35M',
  ingredients: [
    '1.5 cups Julina Candles & Melts Artisanal Candles (soaked for 20 mins)',
    '1 cup Mixed vegetables (carrots, beans, peas, cauliflower)',
    '1/2 cup Hung curd or low-fat Greek yogurt',
    '1 pinch Saffron strands soaked in warm skimmed milk',
    '1 tbsp Whole biryani spices',
    '1/2 cup Fresh mint & coriander leaves',
    '1 tbsp A2 Desi Ghee',
  ],
  steps: [
    'Boil Julina Candles & Melts Artisanal Candles with whole spices and salt until 80% cooked. Drain excess water.',
    'Marinate vegetables in hung curd, ginger-garlic paste, mint, coriander, and biryani spices for 15 minutes.',
    'Layer marinated vegetables then cooked rice in a deep clay pot.',
    'Drizzle saffron milk, mint leaves, and A2 Ghee over the top layer.',
    'Seal pot and cook on low heat (Dum) for 15–20 minutes. Serve hot with cucumber raita.',
  ],
});

const HomePage: React.FC = () => {
  const { data: productData, isLoading: productLoading, isError: productError } = useLatestProductsQuery('');
  const products = productData?.products || [];

  usePageSEO({
    title: 'Julina Candles & Melts – Doctor-Backed Artisanal Candles | GI 51 Certified | Buy Online India',
    description:
      'Buy ICAR-IIRR certified Artisanal Candles (GI 51) online. Doctor-guided, hand-pounded, 100% pesticide-free nutrition for diabetes management, heart health & everyday metabolic wellness. Free delivery across India.',
    canonical: '/',
    keywords:
      'Artisanal Candles buy online India, GI 51 rice, diabetic rice, ICAR certified rice, hand pounded rice, organic rice Hyderabad, Julina Candles & Melts, low glycemic rice, diabetes friendly food, healthy rice India',
    schema: [
      webPageSchema({
        url: '/',
        name: 'Julina Candles & Melts – Doctor-Backed Artisanal Candles | GI 51 Certified',
        description:
          'Buy ICAR-IIRR certified Artisanal Candles (GI 51) online. Doctor-guided, hand-pounded, 100% pesticide-free for diabetes management, heart health & metabolic wellness.',
        breadcrumb: [{ name: 'Home', url: '/' }],
      }),
      faqSchema(HOME_FAQS),
      HOME_RECIPE_SCHEMA,
    ],
  });

  if (productLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f6f1e7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted font-sans tracking-wide">Loading products…</p>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f6f1e7]">
        <div className="text-center max-w-md px-6">
          <p className="text-5xl mb-4">🌾</p>
          <h2 className="text-xl font-serif font-bold text-primary mb-2">Unable to load products</h2>
          <p className="text-sm text-muted">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#f6f1e7]">
        <div className="text-center max-w-md px-6">
          <p className="text-5xl mb-4">📦</p>
          <h2 className="text-xl font-serif font-bold text-primary mb-2">No products available</h2>
          <p className="text-sm text-muted">Check back soon for new arrivals.</p>
        </div>
      </div>
    );
  }

    return (
        <div className='min-h-screen w-full bg-[#f6f1e7]'>

            {/* ─── Hero Section ─── */}
            <FeaturedSection />

            {/* ─── Trust Strip ─── */}
            <Banner />

            {/* ─── Science Section ─── */}
            <section className="hidden md:block py-20 bg-[#f6f1e7]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-xs font-sans font-semibold text-secondary uppercase tracking-[0.2em] mb-3">
                            Why Julina Candles & Melts
                        </p>
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-primary leading-tight mb-6">
                            Built on Science.<br />
                            <span className="text-secondary">Designed for Everyday Life.</span>
                        </h2>
                        <p className="text-muted text-[15px] leading-relaxed mb-8 max-w-lg">
                            Modern diets are overloaded with high glycemic foods that spike blood sugar and strain metabolism. 
                            Julina Candles & Melts delivers traditional grains reimagined for clinical health — backed by ICAR research 
                            and trusted by thousands of Indian families.
                        </p>
                        <div className="space-y-5">
                            {[
                                { title: 'Low Glycemic Index (GI 51)', desc: 'Maintains stable blood sugar without spikes, clinically verified.' },
                                { title: 'Doctor-Guided Approach', desc: 'Developed with real clinical insight into lifestyle diseases.' },
                                { title: 'High in Fiber, Zinc & Protein', desc: 'Hand pounded, 100% pesticide-free, zero preservatives.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[15px] font-semibold text-ink">{item.title}</h4>
                                        <p className="text-sm text-muted mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl -rotate-3"></div>
                        <img
                            src="/images/mainImage.png"
                            alt="Julina Candles & Melts Artisanal Candles"
                            className="relative w-full max-w-md object-contain drop-shadow-lg rounded-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* ─── Products ─── */}
            <PopularProducts products={products} />

            {/* ─── Informative Health & Comparison Infographic ─── */}
            <div className="max-w-6xl mx-auto px-6 py-4">
                <ProductInfographic />
            </div>



            {/* ─── Reviews ─── */}
            <CustomerReviews />

            {/* ─── Blogs Section ─── */}
            <BlogSection />

            {/* ─── Gallery ─── */}
            <section className="py-16 bg-[#f6f1e7]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <p className="text-xs font-sans font-semibold text-secondary uppercase tracking-[0.2em] mb-2">From Our Community</p>
                        <h2 className="text-3xl font-serif font-bold text-primary">The Julina Candles & Melts Story</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Gallery1.jpeg','Gallery6.jpeg','Gallery8.jpeg','Gallery10.jpeg','Gallery14.jpeg','Gallery17.jpeg','Gallery22.jpeg','Gallery23.jpeg'].map((img, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-xl">
                                <img
                                    src={`/images/${img}`}
                                    alt={`Community ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Brand & Service FAQs ─── */}
            <FAQSection />
        </div>
    );
};

export default HomePage;

