import React, { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string[];
  image: string;
  tags: string[];
}

const mainArticle: BlogPost = {
  id: '1',
  title: 'Mastering Candle Care: How to Trim Wicks & Prevent Wax Tunneling for Maximum Burn Time',
  author: 'By Julina Candle Artisans',
  date: 'Feb 10, 2026',
  excerpt: 'Learn the essential candle care rituals that double the burn lifespan of your handcrafted soy wax jars and urlis, while ensuring clean, soot-free aromatics.',
  tags: ['Candle Care', 'Soy Wax Tips', 'Home Decor'],
  image: '/images/productshttps://res.cloudinary.com/bzykgznp/image/upload/v1786389871/julina_candles/products/scented_glass_jar.png',
  content: [
    'Handcrafted soy wax candles are an investment in peace, warmth, and home ambiance. However, proper candle care is essential to ensure your candle burns evenly and lasts for dozens of hours.',
    '1. The First Burn is Critical: Always allow the top layer of wax to melt completely to the edges of the jar on your first burn (usually 2 to 3 hours). This creates a "wax memory" and prevents tunneling.',
    '2. Trim the Wick to 1/4 Inch: Before relighting your candle, trim the cotton or wooden wick. A shorter wick prevents black soot, flickering, and high flames.',
    '3. Avoid Drafts: Keep your candle away from open windows or fans to maintain a calm, stable flame and preserve the delicacy of fragrance notes.',
  ]
};

const secondArticle: BlogPost = {
  id: '2',
  title: 'The Art of Scent Layering: Combining Coffee, Floral & Sandalwood Aromas for Everyday Luxury',
  author: 'By Julina Fragrance Masters',
  date: 'Jan 28, 2026',
  excerpt: 'Discover how pairing rich espresso and caramel coffee candles with serene lotus and rose aromatics transforms living spaces into soothing retreats.',
  tags: ['Aromatherapy', 'Fragrance Layering', 'Luxury Decor'],
  image: '/images/productshttps://res.cloudinary.com/bzykgznp/image/upload/v1786389834/julina_candles/products/caramel_coffee_cream.png',
  content: [
    'Aromatherapy has the power to transform mood, awaken productivity, and induce deep relaxation.',
    'Morning Vitality: Burn Caramel Coffee Cream or Coffee Beans candles near your workspace to stimulate mental clarity and warm focus.',
    'Evening Serenity: Transition to Daisy Scented Soy Wax or Rose Heart candles during sunset to soothe stress and create a tranquil sanctuary.',
    'Festive Ambiance: Light Peacock Urli or Lotus Pond Urli candles in grand hall entryways for authentic Indian heritage luxury.',
  ]
};

const sideArticles: BlogPost[] = [
  {
    id: '3',
    title: 'Festive Urli Decoration Guide: Creating Magical Table Centerpieces for Celebrations',
    author: 'By Julina Decor Team',
    date: 'Dec 15, 2025',
    excerpt: 'Step-by-step styling tips for lotus pond urlis and peacock wax candles during Diwali, Ganesh Chaturthi, and weddings...',
    tags: ['Festive Decor', 'Urli Styling'],
    image: '/images/productshttps://res.cloudinary.com/bzykgznp/image/upload/v1786389862/julina_candles/products/peacock_pink_wax_urli.png',
    content: [
      'Traditional urlis are timeless Indian decor elements symbolizing abundance and light.',
      'Place our handcrafted Lotus Pond Urli on a brass tray floating with fresh marigold petals. Light the soy wax candle center for an unforgettable warm glow.'
    ]
  },
  {
    id: '4',
    title: 'Why 100% Natural Soy Wax Outperforms Paraffin Wax in Indoor Air Purity',
    author: 'By Julina Eco-Lab',
    date: 'Nov 02, 2025',
    excerpt: 'Understanding the clean, non-toxic benefits of eco-friendly soy wax vs petroleum byproduct paraffin candles...',
    tags: ['Eco-Friendly', 'Indoor Air Purity'],
    image: '/images/productshttps://res.cloudinary.com/bzykgznp/image/upload/v1786389873/julina_candles/products/soy_wax_concrete_shankh.png',
    content: [
      'Paraffin wax is a refined byproduct of petroleum that emits toxic black soot and synthetic fumes when burned.',
      'Our 100% natural soy wax is renewable, biodegradable, and burns soot-free, keeping your indoor air pure and clean.'
    ]
  }
];

const BlogSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  return (
    <section className="py-16 bg-[#FBF6ED]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C79A56] uppercase tracking-[0.2em] block mb-2">
            AMBIANCE & CARE GUIDES
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-[#2A1C22]">
            Candle Care & Fragrance Masterclasses
          </h2>
        </div>

        {/* Blogs Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Main Featured Article */}
          <div
            onClick={() => setSelectedArticle(mainArticle)}
            className="lg:col-span-6 flex flex-col group cursor-pointer bg-white p-6 rounded-3xl border border-[#E6DACB] shadow-sm hover:shadow-md transition-all"
          >
            <div className="overflow-hidden rounded-2xl mb-4 bg-white shadow-xs">
              <img
                src={mainArticle.image}
                alt={mainArticle.title}
                className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {mainArticle.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-bold bg-[#5C2333]/10 text-[#5C2333] px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2A1C22] group-hover:text-[#5C2333] transition-colors leading-snug mb-2">
              {mainArticle.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
              {mainArticle.excerpt}
            </p>
            <div className="mt-auto flex justify-between items-center text-xs text-gray-500 font-medium pt-3 border-t border-gray-100">
              <span className="text-[#C79A56] font-bold">{mainArticle.author}</span>
              <span>{mainArticle.date}</span>
            </div>
          </div>

          {/* Column 2: Secondary Article & Side Articles */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div
              onClick={() => setSelectedArticle(secondArticle)}
              className="flex flex-col group cursor-pointer bg-white p-5 rounded-3xl border border-[#E6DACB] shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-wrap gap-1.5 mb-2">
                {secondArticle.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold bg-[#C79A56]/15 text-[#5C2333] px-2.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-base font-serif font-bold text-[#2A1C22] group-hover:text-[#5C2333] transition-colors leading-snug mb-2">
                {secondArticle.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-3">
                {secondArticle.excerpt}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                <span className="text-[#C79A56] font-bold">{secondArticle.author}</span>
                <span>{secondArticle.date}</span>
              </div>
            </div>

            {sideArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="flex gap-4 items-center group cursor-pointer bg-white p-4 rounded-2xl border border-[#E6DACB] shadow-xs hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-xs">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-[#C79A56]">{article.author}</span>
                  <h4 className="text-xs font-serif font-bold text-[#2A1C22] group-hover:text-[#5C2333] transition-colors leading-snug line-clamp-2 my-1">
                    {article.title}
                  </h4>
                  <span className="text-[10px] text-gray-400">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#E6DACB] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#E6DACB] flex justify-between items-start bg-[#FBF6ED]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2A1C22]">
                  {selectedArticle.title}
                </h3>
                <div className="flex gap-4 text-xs font-medium text-gray-500 mt-2">
                  <span className="text-[#C79A56] font-bold">{selectedArticle.author}</span>
                  <span>• {selectedArticle.date}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl font-semibold leading-none p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-sm mb-4">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="text-xs text-gray-700 leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="p-4 bg-[#FBF6ED] border-t border-[#E6DACB] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#5C2333] hover:bg-[#3E1622] text-white font-bold py-2 px-6 rounded-full text-xs transition-colors shadow-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
