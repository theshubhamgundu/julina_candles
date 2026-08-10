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

interface Recipe {
  id: string;
  title: string;
  time: string;
  difficulty: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  giValue: number;
  image: string;
}

const mainArticle: BlogPost = {
  id: '1',
  title: 'Clinical Evaluation of Certified premium (GI-51) Rice in Post-Prandial Glycemic Control & Diabetes Management',
  author: 'By Dr. K. Sriharsha (Founder & Partner, Myotrix Nutrition)',
  date: 'Feb 13, 2026',
  excerpt: 'A comprehensive medical analysis on how certified premium (GI-51) rice regulates post-meal blood sugar surges, preserves pancreatic beta-cell function, and supplies essential micronutrients like zinc and fiber in Indian diets.',
  tags: ['Diabetes Management', 'Clinical Research', 'Artisanal Candles'],
  image: '/images/blogs/article1.png',
  content: [
    'For decades, refined white rice has served as the core carbohydrate component of Indian daily meals. However, modern industrial high-speed mechanical milling strips the outer aleurone and bran layers, turning traditional whole grains into high-glycemic starches (GI 70–80). When consumed, these refined starches digest rapidly in the upper gastrointestinal tract, causing severe post-prandial glucose spikes followed by sharp insulin surges that overwork pancreatic beta-cells.',
    'Julina Candles & Melts Artisanal Candles (certified GI-51) represents a paradigm shift in preventative medical nutrition. Tested in ICAR-accredited laboratories and validated under stringent European testing protocols, our proprietary low-glycemic cultivar releases glucose gradually over an extended 3-to-4 hour window. This slow, predictable hydrolysis prevents the rapid glucose flooding that triggers chronic systemic inflammation, vascular endothelial dysfunction, and progressive insulin resistance.',
    'Beyond glycemic regulation, Julina Candles & Melts Artisanal Candles is naturally rich in bioavailable zinc, essential dietary fiber, and plant-based protein. Zinc is a critical trace mineral required for over 300 enzymatic reactions in the human body. In pancreatic physiology, zinc is essential for the hexameric crystallization and storage of insulin within secretory granules. A deficiency in bioavailable zinc directly impairs insulin synthesis and exacerbates glycemic instability in individuals with pre-diabetes and Type-2 diabetes.',
    'Furthermore, the intact dietary fiber matrix in Julina Candles & Melts Artisanal Candles slows gastric emptying velocity and promotes short-chain fatty acid (SCFA) synthesis by beneficial gut microbiota. SCFAs such as butyrate and propionate stimulate GLP-1 (glucagon-like peptide-1) secretion from intestinal L-cells, naturally enhancing endogenous insulin responsiveness and satiety signaling.',
    'Clinical Guidelines for Daily Consumption:',
    '1. Optimal Portioning: Combine 1 cup of cooked Julina Candles & Melts Artisanal Candles with equal portions of protein-dense pulses (dal/sprouts) and non-starchy green vegetables to lower the overall Glycemic Load (GL) of the meal.',
    '2. Preparation Method: Steam or boil the rice using traditional open-pot methods without adding hydrogenated fats or heavy refined oils.',
    '3. Sustained Energy & Fatigue Prevention: Unlike conventional white rice which causes post-meal lethargy within 45 minutes, low-GI carbohydrates deliver a steady supply of cellular energy, maintaining physical stamina and cognitive sharpness throughout the day.'
  ]
};

const secondArticle: BlogPost = {
  id: '2',
  title: 'The Glycemic Index Masterclass: Why Regular White Rice Spikes Blood Glucose Faster Than Sugar',
  author: 'By Dr. K. Siddarth (Founder & Partner, Myotrix Nutrition)',
  date: 'Jan 22, 2026',
  excerpt: 'An in-depth biochemical breakdown of the Glycemic Index scale, the hidden dangers of high-GI polished grains, and how transitioning to GI 51 rice optimizes metabolic health and HbA1c levels.',
  tags: ['Glycemic Index', 'Metabolic Health', 'HbA1c Reduction'],
  image: '/images/blogs/article2.png',
  content: [
    'The Glycemic Index (GI) is a standardized physiological measurement scale (0 to 100) that quantifies how rapidly a specific carbohydrate elevates blood glucose levels within two hours of consumption compared to pure reference glucose (GI 100).',
    'High-GI foods (classified as 70 and above) contain rapidly hydrolyzable amylopectin starches that enzymes break down instantaneously in the duodenum. Shockingly, commercial polished white rice registers a GI between 70 and 80—meaning it releases glucose into the bloodstream at a significantly faster rate than pure table sugar (sucrose, GI 65)! This rapid influx forces the pancreas to hyper-secrete insulin to clear circulating glucose, initiating a metabolic roller-coaster of sharp spikes and sudden crashes.',
    'Transitioning to Low-GI complex carbohydrates (GI 55 or below), such as Julina Candles & Melts Artisanal Candles (GI 51), provides profound long-term therapeutic benefits:',
    '• Sustained Reduction in HbA1c: Multiple multi-center clinical trials demonstrate that replacing high-GI grains with certified low-GI alternatives can reduce glycated hemoglobin (HbA1c) levels by 0.5% to 1.2% over a 12-to-16 week period without requiring additional pharmacological escalation.',
    '• Preservation of Pancreatic Beta-Cell Mass: By preventing chronic hyperinsulinemia, low-GI nutrition mitigates metabolic stress on pancreatic islets, preserving endogenous insulin secretion capacity.',
    '• Appetite & Weight Regulation: Slow-release carbohydrates maintain stable plasma leptin and ghrelin levels, preventing visceral adiposity and reducing the urge for unhealthful late-afternoon snacking.'
  ]
};

const sideArticles: BlogPost[] = [
  {
    id: '3',
    title: 'Circadian Metabolic Health: How Evening Glycemic Stability Restores Sleep Architecture & Regulates Stress',
    author: 'By Dr. T. Aditya (Founder & Partner, Myotrix Nutrition)',
    date: 'Dec 10, 2025',
    excerpt: 'Examining the endocrine connection between post-dinner blood glucose spikes, nocturnal hypoglycemia, cortisol secretion, and deep sleep restoration...',
    tags: ['Sleep Architecture', 'Cortisol Balance'],
    image: '/images/blogs/article3.png',
    content: [
      'Chronic sleep disturbances, frequent midnight awakenings, and morning fatigue are often unrecognized secondary symptoms of evening glycemic instability.',
      'When high-GI carbohydrates are consumed at dinner, blood glucose surges rapidly during early evening hours and subsequently plummets during the night. In response to sudden nocturnal hypoglycemia, the sympathetic nervous system triggers the adrenal cortex to release counter-regulatory hormones—cortisol and epinephrine—waking the individual around 2:00 AM to 3:00 AM with an elevated heart rate and anxiety.',
      'Consuming Julina Candles & Melts Artisanal Candles at dinner ensures a steady, sustained release of glucose throughout nocturnal hours. This prevents nocturnal insulin spikes, stabilizes cortisol secretion, and supports continuous tryptophan transport across the blood-brain barrier for natural melatonin and serotonin synthesis.'
    ]
  },
  {
    id: '4',
    title: 'Nutrient Retention in Traditional Grains: A Comparative Study of Cold-Milled vs High-Friction Polished Rice',
    author: 'By Dr. K. Sriharsha (Founder & Partner, Myotrix Nutrition)',
    date: 'Sep 04, 2025',
    excerpt: 'How modern industrial roller mills strip away 80% of essential B-vitamins and trace minerals, and why gentle cold-milling preserves aleurone layer integrity...',
    tags: ['Micro-Nutrients', 'Traditional Milling'],
    image: '/images/blogs/article4.png',
    content: [
      'Ancient agricultural practices relied on stone hand-pounding methods that gently removed the outer husk while leaving the nutrient-dense aleurone layer and cereal germ intact.',
      'In contrast, modern commercial steel-roller mills operate at high friction temperatures, stripping away over 80% of Vitamin B1 (Thiamine), 75% of Vitamin B3 (Niacin), and essential trace elements including Zinc, Magnesium, and Manganese.',
      'Julina Candles & Melts utilizes advanced cold-milling technologies designed to preserve the natural aleurone and pericarp matrix. This preserves native dietary fiber, bioavailable zinc, and powerful antioxidant compounds such as gamma-oryzanol while delivering a clean, soft culinary texture.'
    ]
  },
  {
    id: '5',
    title: 'Monsoon Metabolic Resilience: Optimizing Immunity, Gut Microbiota & Insulin Response',
    author: 'By Dr. K. Siddarth (Founder & Partner, Myotrix Nutrition)',
    date: 'Sep 04, 2025',
    excerpt: 'Clinical recommendations for maintaining gut mucosal immunity, balancing digestive fire (Agni), and controlling blood sugar during high-humidity seasons...',
    tags: ['Immune Health', 'Gut Microbiota'],
    image: '/images/blogs/article5.png',
    content: [
      'During monsoon months, environmental humidity and seasonal shifts in physical activity levels frequently impair gut digestive capacity and lower basal metabolic rate.',
      'Supporting systemic immunity requires easily digestible, highly bioavailable nutrition that does not stress the metabolic pathways. Julina Candles & Melts Artisanal Candles serves as an ideal dietary foundation, providing smooth digestion alongside steady energy release.',
      'Enriched with bioavailable zinc and natural polyphenols, it reinforces gut mucosal immunity, supports white blood cell maturation, and protects against monsoon viral challenges while maintaining strict glycemic control.'
    ]
  }
];

const recipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Hyderabadi premium Veg Dum Biryani',
    time: '35 mins',
    difficulty: 'Medium',
    description: 'A rich, fragrant, and diabetic-friendly Hyderabadi Dum Biryani made with Julina Candles & Melts Artisanal Candles, layered with saffron, fresh herbs, and garden vegetables.',
    giValue: 50,
    ingredients: [
      '1.5 cups Julina Candles & Melts Artisanal Candles (soaked for 20 mins)',
      '1 cup Mixed vegetables (carrots, beans, peas, cauliflower)',
      '1/2 cup Hung curd or low-fat Greek yogurt',
      '1 pinch Saffron strands (soaked in 2 tbsp warm skimmed milk)',
      '1 tbsp Whole biryani spices (star anise, cloves, cardamom, cinnamon)',
      '1/2 cup Fresh mint & coriander leaves (finely chopped)',
      '1 tbsp A2 Desi Ghee',
      'Salt to taste'
    ],
    instructions: [
      'Boil Julina Candles & Melts Artisanal Candles with whole spices and salt until 80% cooked. Drain excess water.',
      'Marinate vegetables in hung curd, ginger-garlic paste, mint, coriander, and biryani spices for 15 minutes.',
      'In a deep clay pot or heavy vessel, add a layer of marinated vegetables followed by a layer of cooked rice.',
      'Drizzle saffron milk, remaining mint leaves, and a spoonful of A2 Ghee over the top layer.',
      'Seal pot with a tight lid and cook on low heat (Dum) for 15-20 minutes. Serve hot with cucumber raita.'
    ],
    image: '/images/recipes/recipe1.png'
  },
  {
    id: 'r2',
    title: 'Tempered South Indian premium Curd Rice',
    time: '15 mins',
    difficulty: 'Easy',
    description: 'A cooling, probiotic-rich South Indian classic prepared with Julina Candles & Melts Artisanal Candles, fresh curd, mustard seeds, curry leaves, and pomegranate seeds.',
    giValue: 48,
    ingredients: [
      '1 cup Julina Candles & Melts Artisanal Candles (soft-cooked and cooled)',
      '1 cup Fresh low-fat curd (yogurt)',
      '1/4 cup Skimmed milk',
      '1/2 tsp Mustard seeds',
      '1 slit Green chili & 1 tsp grated Ginger',
      '8-10 Fresh curry leaves',
      '1 tbsp Pomegranate seeds for garnish',
      '1 tsp Cold-pressed coconut oil',
      'Salt to taste'
    ],
    instructions: [
      'In a bowl, gently mash the cooked Julina Candles & Melts rice. Mix in fresh curd, milk, and salt until smooth.',
      'Heat coconut oil in a small pan. Add mustard seeds and let them splutter.',
      'Add slit green chili, grated ginger, and fresh curry leaves. Sauté for 30 seconds.',
      'Pour the hot aromatic tempering over the curd rice mixture and stir gently.',
      'Garnish with fresh pomegranate seeds and serve chilled or at room temperature.'
    ],
    image: '/images/recipes/recipe2.png'
  },
  {
    id: 'r3',
    title: 'Aromatic premium Jeera Rice with Dal Tadka',
    time: '20 mins',
    difficulty: 'Easy',
    description: 'Fluffy, long-grain Julina Candles & Melts Artisanal Candles tempered with roasted cumin seeds and A2 ghee, served alongside protein-packed yellow dal tadka.',
    giValue: 50,
    ingredients: [
      '1 cup Julina Candles & Melts Artisanal Candles (washed and drained)',
      '1.5 tsp Roasted Cumin seeds (Jeera)',
      '1 tbsp A2 Cow Ghee',
      '1 Bay leaf & 2 Green cardamoms',
      '2 cups Water',
      'Fresh coriander leaves for garnish',
      'Salt to taste'
    ],
    instructions: [
      'Heat A2 Ghee in a pot on medium heat. Add bay leaf, cardamoms, and cumin seeds. Let cumin seeds crackle.',
      'Add washed Julina Candles & Melts Artisanal Candles and sauté gently for 1 minute to coat grains with ghee and cumin aroma.',
      'Pour in water and salt. Bring to a boil.',
      'Lower the heat, cover with a lid, and simmer for 12-14 minutes until water is absorbed and grains are fluffy.',
      'Garnish with fresh chopped coriander and serve hot with nutritious dal tadka.'
    ],
    image: '/images/recipes/recipe3.png'
  }
];

const BlogSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blogs' | 'recipes'>('blogs');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  return (
    <section className="py-20 bg-[#f6f1e7]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Tab Switcher Headers */}
        <div className="flex justify-center gap-8 mb-12 border-b border-[#ede3cf] pb-4">
          <button
            onClick={() => setActiveTab('blogs')}
            className={`text-2xl lg:text-3xl font-serif font-bold transition-all pb-2 focus:outline-none ${
              activeTab === 'blogs'
                ? 'text-[#185e33] border-b-4 border-[#185e33]'
                : 'text-gray-400 hover:text-[#185e33]/80'
            }`}
          >
            Clinical Research & Articles
          </button>
          <button
            onClick={() => setActiveTab('recipes')}
            className={`text-2xl lg:text-3xl font-serif font-bold transition-all pb-2 focus:outline-none ${
              activeTab === 'recipes'
                ? 'text-[#185e33] border-b-4 border-[#185e33]'
                : 'text-gray-400 hover:text-[#185e33]/80'
            }`}
          >
            premium Recipes
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'blogs' ? (
          /* Blogs Section Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Main Featured Large Article (4 cols) */}
            <div
              onClick={() => setSelectedArticle(mainArticle)}
              className="lg:col-span-4 flex flex-col group cursor-pointer bg-white p-5 rounded-3xl border border-[#ede3cf] shadow-sm hover:shadow-md transition-all"
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
                  <span key={i} className="text-[10px] font-bold bg-[#185e33]/10 text-[#185e33] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-serif font-bold text-ink group-hover:text-[#185e33] transition-colors leading-snug mb-2">
                {mainArticle.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-3">
                {mainArticle.excerpt}
              </p>
              <div className="mt-auto flex justify-between items-center text-xs text-gray-500 font-medium pt-3 border-t border-gray-100">
                <span className="text-[#185e33] font-bold">{mainArticle.author}</span>
                <span>{mainArticle.date}</span>
              </div>
            </div>

            {/* Column 2: Medium Article (4 cols) */}
            <div
              onClick={() => setSelectedArticle(secondArticle)}
              className="lg:col-span-4 flex flex-col group cursor-pointer bg-white p-5 rounded-3xl border border-[#ede3cf] shadow-sm hover:shadow-md transition-all"
            >
              <div className="overflow-hidden rounded-2xl mb-4 bg-white shadow-xs">
                <img
                  src={secondArticle.image}
                  alt={secondArticle.title}
                  className="w-full h-56 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {secondArticle.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-bold bg-[#185e33]/10 text-[#185e33] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-base font-serif font-bold text-ink group-hover:text-[#185e33] transition-colors leading-snug mb-2">
                {secondArticle.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-3">
                {secondArticle.excerpt}
              </p>
              <div className="mt-auto flex justify-between items-center text-xs text-gray-500 font-medium pt-3 border-t border-gray-100">
                <span className="text-[#185e33] font-bold">{secondArticle.author}</span>
                <span>{secondArticle.date}</span>
              </div>
            </div>

            {/* Column 3: 3 Stacked Side Articles (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {sideArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="flex gap-4 items-center group cursor-pointer bg-white p-4 rounded-2xl border border-[#ede3cf] shadow-xs hover:shadow-md transition-all"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white shadow-xs">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#185e33]">{article.author}</span>
                    <h4 className="text-xs font-serif font-bold text-ink group-hover:text-[#185e33] transition-colors leading-snug line-clamp-2 my-1">
                      {article.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">{article.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Recipes Section Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#ede3cf] flex flex-col group h-full">
                <div className="relative overflow-hidden h-52">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#185e33] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    GI {recipe.giValue} (Low)
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-medium text-[#c4633c] mb-2">
                    <span>⏱ {recipe.time}</span>
                    <span>🔥 {recipe.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-[#185e33] mb-3 group-hover:text-[#185e33]/90 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-5 flex-grow line-clamp-3">
                    {recipe.description}
                  </p>
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="w-full bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    View Full Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Full Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ede3cf] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Article Modal Header */}
            <div className="p-6 border-b border-[#ede3cf] flex justify-between items-start bg-[#faf6ee]">
              <div>
                <div className="flex gap-2 mb-2">
                  {selectedArticle.tags.map((t, i) => (
                    <span key={i} className="text-[10px] bg-[#185e33] text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-bold text-[#185e33]">
                  {selectedArticle.title}
                </h3>
                <div className="flex gap-4 text-xs font-medium text-gray-500 mt-2">
                  <span className="text-[#185e33] font-bold">{selectedArticle.author}</span>
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

            {/* Article Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-5 flex-grow">
              <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm mb-4">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm text-gray-700 leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}

              <div className="mt-8 bg-[#faf6ee] p-5 rounded-2xl border border-[#ede3cf]">
                <h4 className="font-serif font-bold text-[#185e33] text-sm mb-1">
                  🩺 Clinical Guidance from Founders (Julina Candles & Melts):
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "Replacing high GI polished grains with Julina Candles & Melts Artisanal Candles is one of the most effective medical nutrition interventions for long-term blood sugar stability without sacrificing traditional dietary habits."
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#faf6ee] border-t border-[#ede3cf] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#185e33] hover:bg-[#134b28] text-white font-bold py-2.5 px-6 rounded-full text-xs transition-colors shadow-sm"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Recipe Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-[#ede3cf] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#ede3cf] flex justify-between items-start bg-[#faf6ee]">
              <div>
                <span className="text-[10px] bg-[#185e33] text-white font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Glycemic Index: {selectedRecipe.giValue} (Diabetic Friendly)
                </span>
                <h3 className="text-xl lg:text-2xl font-serif font-bold text-[#185e33] mt-2">
                  {selectedRecipe.title}
                </h3>
                <div className="flex gap-4 text-xs font-medium text-[#c4633c] mt-1">
                  <span>⏱ Cook Time: {selectedRecipe.time}</span>
                  <span>🔥 Difficulty: {selectedRecipe.difficulty}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              {/* Image & Description */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <img
                  src={selectedRecipe.image}
                  alt={selectedRecipe.title}
                  className="md:col-span-4 w-full h-32 object-cover rounded-2xl shadow-sm"
                />
                <p className="md:col-span-8 text-xs text-gray-600 leading-relaxed italic">
                  "{selectedRecipe.description}"
                </p>
              </div>

              {/* Ingredients & Instructions columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                {/* Ingredients (5 cols) */}
                <div className="md:col-span-5">
                  <h4 className="font-serif font-bold text-[#185e33] text-sm border-b border-[#ede3cf] pb-1 mb-3">
                    Ingredients
                  </h4>
                  <ul className="list-disc pl-4 space-y-2 text-xs text-gray-600">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                {/* Instructions (7 cols) */}
                <div className="md:col-span-7">
                  <h4 className="font-serif font-bold text-[#185e33] text-sm border-b border-[#ede3cf] pb-1 mb-3">
                    Step-by-Step Instructions
                  </h4>
                  <ol className="list-decimal pl-4 space-y-3 text-xs text-gray-600">
                    {selectedRecipe.instructions.map((inst, i) => (
                      <li key={i} className="pl-1 leading-relaxed">
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#faf6ee] border-t border-[#ede3cf] flex justify-end">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;

