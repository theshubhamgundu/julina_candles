import React from 'react';

const customerReviews = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'The Lotus Pond Urli Candle elevated our Diwali decor completely! The fragrance is soothing and lasts for hours without any smoke.',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=5C2333&color=fff',
  },
  {
    name: 'Rahul Mehta',
    location: 'Pune, Maharashtra',
    metric: '⭐ Wholesale Buyer',
    review: 'Ordered Caramel Coffee Cream & Coffee Beans candles in bulk for corporate gifting. Everyone loved the realistic coffee aroma!',
    avatar: 'https://ui-avatars.com/api/?name=Rahul+Mehta&background=C79A56&color=fff',
  },
  {
    name: 'Ananya Roy',
    location: 'Dubai, UAE',
    metric: '⭐ International Importer',
    review: 'Julina Candles & Melts delivered our bulk export order on time with exquisite custom packaging. Premium Indian soy wax quality!',
    avatar: 'https://ui-avatars.com/api/?name=Ananya+Roy&background=2A1C22&color=fff',
  },
  {
    name: 'Kavita Patel',
    location: 'Surat, Gujarat',
    metric: '⭐ Verified Homeowner',
    review: 'The Peacock Pink Wax Urli Candle is a masterpiece. The floral fragrance fills the living room beautifully.',
    avatar: 'https://ui-avatars.com/api/?name=Kavita+Patel&background=5C2333&color=fff',
  },
  {
    name: 'Vikram Joshi',
    location: 'Delhi NCR',
    metric: '⭐ Event Decorator',
    review: 'We used Julina Modak and Shankh candles for a luxury wedding event. The guests were enchanted by the fragrance and craftsmanship.',
    avatar: 'https://ui-avatars.com/api/?name=Vikram+Joshi&background=C79A56&color=fff',
  },
  {
    name: 'Sneha Kulkarni',
    location: 'Thane, Maharashtra',
    metric: '⭐ Verified Homeowner',
    review: 'Love the Daisy Scented Soy Wax Jars! Clean burn with zero soot. Will definitely order again.',
    avatar: 'https://ui-avatars.com/api/?name=Sneha+Kulkarni&background=2A1C22&color=fff',
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
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#C79A56] flex-shrink-0"
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
