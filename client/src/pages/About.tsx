import React from 'react';
import { FaUserMd, FaAward, FaHeartbeat, FaLeaf, FaShieldAlt } from 'react-icons/fa';
import { usePageSEO } from '../hooks/usePageSEO';
import { webPageSchema, breadcrumbSchema } from '../seo/schemas';

const founders = [
  {
    name: 'Dr. K. Sriharsha',
    title: 'Founder & Partner',
    company: 'Julina Candles & Melts',
    image: '/founders/dr-k-sriharsha.jpeg',
    description:
      'Co-founder of Julina Candles & Melts. Dedicated to advancing healthcare and nutrition standards with scientific precision and quality excellence.',
  },
  {
    name: 'Dr. K. Siddarth',
    title: 'Founder & Partner',
    company: 'Julina Candles & Melts',
    image: '/founders/dr-k-siddarth.jpeg',
    description:
      'Co-founder of Julina Candles & Melts. Passionate about empowering healthy lifestyles through research-backed dietary formulations.',
  },
  {
    name: 'Dr. T. Aditya',
    title: 'Founder & Partner',
    company: 'Julina Candles & Melts',
    image: '/founders/dr-t-aditya.jpeg',
    description:
      'Co-founder of Julina Candles & Melts. Driving innovation in preventive health and high-potency nutritional supplements.',
  },
];

const values = [
  {
    icon: <FaUserMd className="w-6 h-6 text-green-600" />,
    title: 'Doctor Formulated',
    description:
      'Our products are conceptualized and formulated by medical doctors to ensure peak safety, bio-availability, and real results.',
  },
  {
    icon: <FaLeaf className="w-6 h-6 text-green-600" />,
    title: 'Pure & Organic Ingredients',
    description:
      'We source only the cleanest, highest-grade raw ingredients free from unnecessary fillers, toxins, or artificial additives.',
  },
  {
    icon: <FaShieldAlt className="w-6 h-6 text-green-600" />,
    title: 'Rigorous Quality Assurance',
    description:
      'Every batch undergoes stringent testing for purity, safety, and nutritional concentration before reaching your hands.',
  },
  {
    icon: <FaHeartbeat className="w-6 h-6 text-green-600" />,
    title: 'Holistic Wellness',
    description:
      'We aim to bridge the gap between clinical science and daily lifestyle nutrition for sustainable long-term health.',
  },
];

const AboutPage: React.FC = () => {
  usePageSEO({
    title: 'About Julina Candles & Melts – Meet Our Doctor Founders | Julina Candles & Melts',
    description:
      'Julina Candles & Melts is built by Dr. K. Sriharsha, Dr. K. Siddarth & Dr. T. Aditya — three doctor-founders of Julina Candles & Melts who created clinically tested Artisanal Candles (GI 51) to combat India\'s diabetes epidemic. Learn our story.',
    canonical: '/about',
    keywords:
      'Julina Candles & Melts founders, Julina Candles & Melts, Dr K Sriharsha, Dr K Siddarth, Dr T Aditya, doctor backed nutrition, ICAR rice India, Artisanal Candles founders, about Julina Candles & Melts',
    schema: [
      webPageSchema({
        url: '/about',
        name: 'About Julina Candles & Melts – Doctor Founders | Julina Candles & Melts',
        description:
          'Meet the three doctor-founders of Julina Candles & Melts — Dr. K. Sriharsha, Dr. K. Siddarth & Dr. T. Aditya — and learn how they created ICAR-tested Artisanal Candles (GI 51) to fight India\'s diabetes epidemic.',
        breadcrumb: [
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ],
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
      ]),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        url: 'https://julinacandles.in/about',
        name: 'About Julina Candles & Melts',
        description: 'About Julina Candles & Melts and the doctor-founders of Julina Candles & Melts Artisanal Candles.',
        about: {
          '@type': 'Organization',
          name: 'Julina Candles & Melts',
          foundingDate: '2024',
          founders: [
            { '@type': 'Person', name: 'Dr. K. Sriharsha', jobTitle: 'Founder & Partner' },
            { '@type': 'Person', name: 'Dr. K. Siddarth', jobTitle: 'Founder & Partner' },
            { '@type': 'Person', name: 'Dr. T. Aditya', jobTitle: 'Founder & Partner' },
          ],
        },
      },
    ],
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 bg-emerald-700/60 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-4 border border-emerald-500/30">
            About Julina Candles & Melts
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Pioneering Science-Backed Wellness
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed">
            At Julina Candles & Melts by Julina Candles & Melts, we blend medical expertise with premium nutrition to create clean, effective, and trustworthy health products for your daily vitality.
          </p>
        </div>
      </section>

      {/* Founders Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-green-700 font-semibold text-sm uppercase tracking-wider mb-2">
            <FaAward className="w-4 h-4" /> Leadership & Vision
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Meet Our Founders
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            The visionary doctors and founders driving Julina Candles & Melts towards excellence in medical-grade nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {founders.map((founder, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="relative pt-[100%] overflow-hidden bg-gray-100 group">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      founder.name
                    )}&background=10b981&color=fff&size=500`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-600/90 rounded-md text-xs font-semibold tracking-wide">
                    {founder.company}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-green-700 font-medium text-sm mb-3">
                    {founder.title}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {founder.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose Myotrix Nutrition?
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Built on clinical trust, purity, and scientific integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research & Institutional Partners Section */}
      <section className="bg-amber-50/50 py-12 border-t border-amber-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
            - Official Partner with IIRR - ICAR -
          </p>
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
            Institutional Research Partnerships
          </h3>
          <div className="flex items-center justify-center gap-8 sm:gap-12">
            {/* IRRI Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full p-2.5 shadow-sm border border-emerald-100 flex items-center justify-center">
                <svg className="w-full h-full text-emerald-800" viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" fill="#185e33" />
                  <text x="50" y="58" fontSize="22" fontWeight="bold" fill="white" textAnchor="middle">IRRI</text>
                </svg>
              </div>
              <span className="text-xs font-semibold text-gray-700">IRRI Partner</span>
            </div>

            {/* ICAR Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full p-2 shadow-sm border border-emerald-100 flex items-center justify-center">
                <img src="/images/icar-logo.png" alt="ICAR Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xs font-semibold text-gray-700">ICAR - IIRR</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="py-12 bg-emerald-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">Experience Doctor-Backed Wellness</h3>
          <p className="text-emerald-100 text-sm mb-6">
            Discover our premium range of natural products crafted by Julina Candles & Melts.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-white text-emerald-900 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-md"
          >
            Explore Products
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

