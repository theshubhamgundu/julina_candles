import React from 'react';

const customerReviews = [
  {
    name: 'Amulya Kulkarni',
    location: 'Mumbai, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'The Lotus Pond Urli Candle elevated our festive decor completely! The fragrance is soothing and lasts for hours without any smoke.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389816/julina_candles/avatars/Amulaya.webp',
  },
  {
    name: 'Ajay Deshmukh',
    location: 'Ulhasnagar, Maharashtra',
    metric: '⭐ Wholesale Buyer',
    review: 'Ordered Caramel Coffee Cream & Coffee Beans candles in bulk for corporate gifting. Everyone loved the realistic coffee aroma!',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389815/julina_candles/avatars/Ajay_Reddy.webp',
  },
  {
    name: 'Shridhar Sawant',
    location: 'Solapur, Maharashtra',
    metric: '⭐ Exporter Partner',
    review: 'Julina Candles & Melts delivered our bulk export order on time with exquisite custom packaging. Premium Indian soy wax quality!',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389829/julina_candles/avatars/Shridhar_Reddy.webp',
  },
  {
    name: 'Bhargavi Joshi',
    location: 'Nagpur, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'The Peacock Pink Wax Urli Candle is a masterpiece. The floral fragrance fills the living room beautifully.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389821/julina_candles/avatars/Bhargavi.webp',
  },
  {
    name: 'Avinash Patil',
    location: 'Pune, Maharashtra',
    metric: '⭐ Event Decorator',
    review: 'We used Julina Modak and Shankh candles for a luxury wedding event. The guests were enchanted by the fragrance and craftsmanship.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389818/julina_candles/avatars/Avinash.webp',
  },
  {
    name: 'Harshini Katta',
    location: 'Nashik, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'Love the Daisy Scented Soy Wax Jars! Clean burn with zero soot. Will definitely order again.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389823/julina_candles/avatars/Harshini_katta.webp',
  },
  {
    name: 'Sai Kiran Wagh',
    location: 'Ulhasnagar, Maharashtra',
    metric: '⭐ Bulk Customer',
    review: 'Hand-poured candles with amazing finish and scent throw. Very fast delivery and top quality packaging.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389828/julina_candles/avatars/Sai_Kiran.webp',
  },
  {
    name: 'Suma Mahajan',
    location: 'Thane, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'The Rose Heart Candle smells heavenly. It creates such a serene and pleasant vibe in our home.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389831/julina_candles/avatars/Suma.webp',
  },
  {
    name: 'Prafful More',
    location: 'Kolhapur, Maharashtra',
    metric: '⭐ Event Decorator',
    review: 'Outstanding traditional urli design candles for Diwali. Highly recommended for wholesale buyers.',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389827/julina_candles/avatars/Prafful.webp',
  },
  {
    name: 'Pavani Gawde',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: '100% natural soy wax candles with zero smoke pollution. Safe for kids and pets!',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389826/julina_candles/avatars/Pavani.webp',
  },
  {
    name: 'Jalender Shinde',
    location: 'Navi Mumbai, Maharashtra',
    metric: '⭐ Corporate Gifter',
    review: 'Extremely polite customer support and exceptional quality decorative candles. Very satisfied!',
    avatar: 'https://res.cloudinary.com/bzykgznp/image/upload/v1786389824/julina_candles/avatars/Jalender.webp',
  },
];

// Duplicate for continuous seamless marquee loop
const marqueeItems = [...customerReviews, ...customerReviews];

const CustomerReviews: React.FC = () => {
  return (
    <section className="py-12 bg-[#FBF6ED] border-y border-[#E6DACB] overflow-hidden w-full">
      <div className="max-w-6xl mx-auto px-6 mb-8 text-center">
        <p className="text-[11px] font-sans font-bold text-[#C79A56] uppercase tracking-[0.25em]">
          CLIENT TESTIMONIALS
        </p>
        <h2 className="text-2xl font-serif font-bold text-[#2A1C22] mt-1">
          What Customers & Exporters Say About Julina Candles & Melts
        </h2>
      </div>

      {/* Moving Marquee Single Row */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee gap-5 px-4 flex">
          {marqueeItems.map((customer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-[#E6DACB] shadow-xs flex flex-col justify-between w-[300px] md:w-[340px] flex-shrink-0 hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-block text-[11px] font-semibold text-[#5C2333] bg-[#5C2333]/10 px-2.5 py-1 rounded-md mb-3">
                  {customer.metric}
                </span>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-3 italic">
                  "{customer.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100">
                <img
                  src={encodeURI(customer.avatar)}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#C79A56] flex-shrink-0 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=5C2333&color=fff`;
                  }}
                />
                <div>
                  <p className="text-xs font-bold text-[#2A1C22] leading-snug">{customer.name}</p>
                  <p className="text-[10px] text-gray-500">{customer.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
