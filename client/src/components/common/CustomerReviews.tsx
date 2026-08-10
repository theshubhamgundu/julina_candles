import React from 'react';

const customerReviews = [
  {
    name: 'Shridhar Reddy',
    location: 'Hayathnagar, Hyderabad',
    metric: 'Fasting sugar: 210 → 138',
    review: 'My fasting blood sugar dropped significantly in three months. Eating real rice again without anxiety!',
    avatar: '/images/avatars/Shridhar_Reddy.webp',
  },
  {
    name: 'Sai Kiran',
    location: 'BN Reddy, Hyderabad',
    metric: 'HbA1c: 8.2 → 6.7',
    review: 'Giving up rice felt like losing my culture. Julina Candles & Melts gave me back my staple food while improving my HbA1c.',
    avatar: '/images/avatars/Sai Kiran.webp',
  },
  {
    name: 'Harshini Katta',
    location: 'LB Nagar, Hyderabad',
    metric: 'Post-meal sugar < 150',
    review: 'Bought this for my diabetic father. He was skeptical, but the taste won him over! Cooks just like Sona Masoori.',
    avatar: '/images/avatars/Harshini katta.webp',
  },
  {
    name: 'Avinash Rao',
    location: 'Madhapur, Hyderabad',
    metric: 'Medication dosage reduced',
    review: 'As a software engineer with erratic sugar levels, switching to this Artisanal Candles helped stabilize my readings completely.',
    avatar: '/images/avatars/Avinash.webp',
  },
  {
    name: 'Pavani Sharma',
    location: 'Gachibowli, Hyderabad',
    metric: 'Weight: -4.5 kg in 2 mos',
    review: 'Excellent Artisanal Candles! Perfect for weight management and keeps us full without feeling heavy or sluggish.',
    avatar: '/images/avatars/Pavani.webp',
  },
  {
    name: 'Prafful Kumar',
    location: 'Kukatpally, Hyderabad',
    metric: 'Sugar spike controlled',
    review: 'Doctor recommended Artisanal Candles for my mother. Julina Candles & Melts taste is premium and 100% natural.',
    avatar: '/images/avatars/Prafful.webp',
  },
  {
    name: 'Bhargavi R.',
    location: 'Jubilee Hills, Hyderabad',
    metric: 'Energy levels improved',
    review: 'No afternoon sluggishness after lunch! The rice is light, fragrant, and genuine doctor-backed quality.',
    avatar: '/images/avatars/Bhargavi.webp',
  },
  {
    name: 'Jalender V.',
    location: 'Dilsukhnagar, Hyderabad',
    metric: 'Fasting sugar: 185 → 124',
    review: 'Best health decision for our entire household. Great texture and delicious with sambar and curry.',
    avatar: '/images/avatars/Jalender.webp',
  },
  {
    name: 'Amulya K.',
    location: 'Banjara Hills, Hyderabad',
    metric: 'HbA1c: 7.9 → 6.5',
    review: 'Organic, pesticide-free, and recommended by our clinical nutritionist. My family loves it!',
    avatar: '/images/avatars/Amulaya.webp',
  },
  {
    name: 'Ajay Reddy',
    location: 'Ameerpet, Hyderabad',
    metric: 'Post-meal sugar stable',
    review: 'Super fast delivery and authentic Artisanal Candles. ICAR partnership gives total confidence in quality.',
    avatar: '/images/avatars/Ajay_Reddy.webp',
  },
  {
    name: 'Suma Latha',
    location: 'Secunderabad, Hyderabad',
    metric: 'Sugar levels consistent',
    review: 'Finally a healthy rice option that doesn\'t compromise on traditional Indian taste and texture!',
    avatar: '/images/avatars/Suma.webp',
  },
];

// Duplicate for continuous seamless marquee loop
const marqueeItems = [...customerReviews, ...customerReviews];

const CustomerReviews: React.FC = () => {
  return (
    <section className="py-8 bg-cream/30 border-y border-cream2/60 overflow-hidden w-full">
      <div className="max-w-6xl mx-auto px-6 mb-5 text-center">
        <p className="text-[11px] font-sans font-semibold text-secondary uppercase tracking-[0.25em]">
          REAL RESULTS & IMPACT
        </p>
        <h2 className="text-2xl font-serif font-bold text-primary mt-0.5">
          What Families Say About Julina Candles & Melts
        </h2>
      </div>

      {/* Moving Marquee Single Row */}
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee gap-5 px-4 flex">
          {marqueeItems.map((customer, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between w-[300px] md:w-[340px] flex-shrink-0 hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-block text-[11px] font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-md mb-3">
                  {customer.metric}
                </span>
                <p className="text-xs text-ink leading-relaxed line-clamp-3">
                  "{customer.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100">
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary/20 flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold text-ink leading-snug">{customer.name}</p>
                  <p className="text-[10px] text-muted">{customer.location}</p>
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

