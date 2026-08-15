/**
 * Seed Script: Insert all 20 Julina Candle products into Supabase via API
 * Run once: node seed_products.js
 * 
 * This uses the admin API endpoint which bypasses RLS.
 * You must first login as admin to get a token, or we'll auto-login.
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lzsjohnscesymlkuvmng.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c2pvaG5zY2VzeW1sa3V2bW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDA0MzQsImV4cCI6MjEwMjM3NjQzNH0.qwxY5OJtvprwTC_TJ8806Nl2G-qF0hdWrmlrNLaSleY';

// Use the service_role key to bypass RLS for seeding
// The anon key is blocked by RLS for product inserts (by design)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c2pvaG5zY2VzeW1sa3V2bW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjgwMDQzNCwiZXhwIjoyMTAyMzc2NDM0fQ.ywgq8iG-UWSfeqBCqGgsX_aOt9ZiN5Dav2n4zN1aLlU';

// Optional event id to attach to inserted products (set via env var EVENT_ID)
const VALID_EVENT_ID = process.env.EVENT_ID || null;

const PRODUCTS = [
  {
    name: "Kesari Kripa Urli Candle", category: "Festive Urli Candles",
    description: "Inspired by vibrant hues of Marigold flowers. Handcrafted natural soy wax candle in brass-style decorative urli. Customisation available.",
    price: 299, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389845/julina_candles/products/handicraf_lotus_pond.png",
    featured: true, is_active: true,
    variants: [
      { id: "1_45", name: "4.5 inch", label: "4.5 inch", price: 299, salePrice: 299, mrp: 350, stock: 50, inStock: true, bulkPrice: 254, bulkMOQ: 12 },
      { id: "1_55", name: "5.5 inch", label: "5.5 inch", price: 339, salePrice: 339, mrp: 399, stock: 50, inStock: true, bulkPrice: 288, bulkMOQ: 12 },
      { id: "1_65", name: "6.5 inch", label: "6.5 inch", price: 379, salePrice: 379, mrp: 449, stock: 50, inStock: true, bulkPrice: 322, bulkMOQ: 12 }
    ],
  },
  {
    name: "Sakora Bloom Urli Candle", category: "Festive Urli Candles",
    description: "Handcrafted decorative urli candle topped with vibrant floral blooms and leaves. Customisation available.",
    price: 289, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389855/julina_candles/products/lotus_pond_urli.png",
    featured: true, is_active: true,
    variants: [
      { id: "2_45", name: "4.5 inch", label: "4.5 inch", price: 289, salePrice: 289, mrp: 330, stock: 50, inStock: true, bulkPrice: 246, bulkMOQ: 12 },
      { id: "2_55", name: "5.5 inch", label: "5.5 inch", price: 329, salePrice: 329, mrp: 380, stock: 50, inStock: true, bulkPrice: 280, bulkMOQ: 12 },
      { id: "2_65", name: "6.5 inch", label: "6.5 inch", price: 369, salePrice: 369, mrp: 420, stock: 50, inStock: true, bulkPrice: 314, bulkMOQ: 12 }
    ],
  },
  {
    name: "Vasant Leela Urli Candle", category: "Festive Urli Candles",
    description: "Traditional urli candle embellished with handcrafted daisy flowers and pearl beads. Customisation available.",
    price: 289, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389857/julina_candles/products/lotus_urli_scented.png",
    featured: true, is_active: true,
    variants: [
      { id: "3_45", name: "4.5 inch", label: "4.5 inch", price: 289, salePrice: 289, mrp: 330, stock: 50, inStock: true, bulkPrice: 246, bulkMOQ: 12 },
      { id: "3_55", name: "5.5 inch", label: "5.5 inch", price: 329, salePrice: 329, mrp: 380, stock: 50, inStock: true, bulkPrice: 280, bulkMOQ: 12 },
      { id: "3_65", name: "6.5 inch", label: "6.5 inch", price: 369, salePrice: 369, mrp: 420, stock: 50, inStock: true, bulkPrice: 314, bulkMOQ: 12 }
    ],
  },
  {
    name: "Sunflower Bliss Urli Candle", category: "Festive Urli Candles",
    description: "Golden sunflower urli candle adorned with hand-poured sunflower embeds and golden sparkle.",
    price: 149, stock: 60, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389880/julina_candles/products/soy_wax_sunflower_urli.png",
    featured: true, is_active: true,
    variants: [
      { id: "4_35", name: "3.5 inch", label: "3.5 inch", price: 149, salePrice: 149, mrp: 180, stock: 60, inStock: true, bulkPrice: 127, bulkMOQ: 12 },
      { id: "4_45", name: "4.5 inch", label: "4.5 inch", price: 199, salePrice: 199, mrp: 240, stock: 60, inStock: true, bulkPrice: 169, bulkMOQ: 12 },
      { id: "4_55", name: "5.5 inch", label: "5.5 inch", price: 259, salePrice: 259, mrp: 300, stock: 60, inStock: true, bulkPrice: 220, bulkMOQ: 12 }
    ],
  },
  {
    name: "Peacock Urli Candle", category: "Festive Urli Candles",
    description: "Royal peacock decorative urli frame filled with scented soy wax and floral highlights. Customisation available.",
    price: 279, stock: 40, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389862/julina_candles/products/peacock_pink_wax_urli.png",
    featured: true, is_active: true,
    variants: [
      { id: "5_6", name: "6 inch", label: "6 inch", price: 279, salePrice: 279, mrp: 320, stock: 40, inStock: true, bulkPrice: 237, bulkMOQ: 12 },
      { id: "5_8", name: "8 inch", label: "8 inch", price: 319, salePrice: 319, mrp: 370, stock: 40, inStock: true, bulkPrice: 271, bulkMOQ: 12 },
      { id: "5_10", name: "10 inch", label: "10 inch", price: 359, salePrice: 359, mrp: 420, stock: 40, inStock: true, bulkPrice: 305, bulkMOQ: 12 }
    ],
  },
  {
    name: "Round Urli Candles", category: "Festive Urli Candles",
    description: "Classic round metallic urli candle embedded with vibrant orange marigolds. Customisation available.",
    price: 359, stock: 45, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389884/julina_candles/products/sunflower_decorative_urli.png",
    featured: false, is_active: true,
    variants: [
      { id: "6_4", name: "4 inch", label: "4 inch", price: 359, salePrice: 359, mrp: 400, stock: 45, inStock: true, bulkPrice: 305, bulkMOQ: 12 },
      { id: "6_5", name: "5 inch", label: "5 inch", price: 399, salePrice: 399, mrp: 450, stock: 45, inStock: true, bulkPrice: 339, bulkMOQ: 12 },
      { id: "6_6", name: "6 inch", label: "6 inch", price: 449, salePrice: 449, mrp: 500, stock: 45, inStock: true, bulkPrice: 382, bulkMOQ: 12 }
    ],
  },
  {
    name: "Diya Urli Candle", category: "Festive Urli Candles",
    description: "Multi-diya urli candle featuring a centerpiece of white flowers framed by golden wax diyas. Customisation available.",
    price: 249, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389889/julina_candles/products/sunflower_urli_candle.png",
    featured: false, is_active: true,
    variants: [
      { id: "7_8", name: "8 inch", label: "8 inch", price: 249, salePrice: 249, mrp: 299, stock: 50, inStock: true, bulkPrice: 212, bulkMOQ: 12 },
      { id: "7_10", name: "10 inch", label: "10 inch", price: 329, salePrice: 329, mrp: 399, stock: 50, inStock: true, bulkPrice: 280, bulkMOQ: 12 }
    ],
  },
  {
    name: "Moon Sun Urli Candle", category: "Festive Urli Candles",
    description: "Artistic brass bowl candle featuring sculpted celestial Sun & Moon design with gold leaf accents.",
    price: 199, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389866/julina_candles/products/peacock_white_wax_urli.png",
    featured: true, is_active: true,
    variants: [{ id: "8_35", name: "3.5 inch", label: "3.5 inch", price: 199, salePrice: 199, mrp: 249, stock: 50, inStock: true }],
  },
  {
    name: "Laksh Siddhi Urli Candles", category: "Festive Urli Candles",
    description: "Set of 2 golden glass jar candles featuring Lord Ganesha and Goddess Lakshmi motifs. Customisation available.",
    price: 299, stock: 40, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389849/julina_candles/products/laddu_shot_glass.png",
    featured: true, is_active: true,
    variants: [{ id: "9_2", name: "Pack of 2 (3.5 inch)", label: "Pack of 2", price: 299, salePrice: 299, mrp: 350, stock: 40, inStock: true }],
  },
  {
    name: "Wooden Dough Bowl Candle", category: "Wooden Dough Bowl Candles",
    description: "Rustic hand-carved wooden bowl filled with natural soy wax and scented spices like cinnamon & dried orange slice. Customisation available.",
    price: 229, stock: 40, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389873/julina_candles/products/soy_wax_concrete_shankh.png",
    featured: true, is_active: true,
    variants: [
      { id: "10_4", name: "4 inch", label: "4 inch", price: 229, salePrice: 229, mrp: 280, stock: 40, inStock: true, bulkPrice: 195, bulkMOQ: 12 },
      { id: "10_5", name: "5 inch", label: "5 inch", price: 269, salePrice: 269, mrp: 320, stock: 40, inStock: true, bulkPrice: 229, bulkMOQ: 12 },
      { id: "10_6", name: "6 inch", label: "6 inch", price: 309, salePrice: 309, mrp: 360, stock: 40, inStock: true, bulkPrice: 263, bulkMOQ: 12 }
    ],
  },
  {
    name: "Mithai Candles", category: "Mithai Candles",
    description: "Dessert-inspired candles shaped like Motichoor Laddus and Modaks with silver leaf detailing. Available in Pack of 4 & Pack of 6.",
    price: 119, stock: 60, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389859/julina_candles/products/modak_shaped_scented.png",
    featured: true, is_active: true,
    variants: [
      { id: "11_4", name: "Pack of 4", label: "Pack of 4", price: 119, salePrice: 119, mrp: 150, stock: 60, inStock: true },
      { id: "11_6", name: "Pack of 6", label: "Pack of 6", price: 279, salePrice: 279, mrp: 330, stock: 60, inStock: true }
    ],
  },
  {
    name: "Peony Candles", category: "Floral Candles",
    description: "Sculpted peony flower candles infused with delicate floral aromatherapy notes. Size: 8.5cm width, 4.5cm height.",
    price: 109, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389843/julina_candles/products/daisy_scented_soy_wax.png",
    featured: true, is_active: true,
    variants: [{ id: "12_1", name: "Single piece", label: "Single piece", price: 109, salePrice: 109, mrp: 140, stock: 50, inStock: true }],
  },
  {
    name: "Daisy Candle", category: "Floral Candles",
    description: "Pack of 4 vibrant daisy flower candles. Size: 5.8cm width, 1.2cm height. Customisation available.",
    price: 119, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389840/julina_candles/products/daisy_flower_jar.png",
    featured: false, is_active: true,
    variants: [{ id: "13_4", name: "Pack of 4", label: "Pack of 4", price: 119, salePrice: 119, mrp: 150, stock: 50, inStock: true, bulkPrice: 99, bulkMOQ: 15, pack: "Pack of 4" }],
  },
  {
    name: "Rose Bud Candle", category: "Floral Candles",
    description: "Pack of 4 rose bud candles infused with romantic rose essential oil. Size: 4cm width, 5cm height.",
    price: 100, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389869/julina_candles/products/rose_heart_candle.png",
    featured: true, is_active: true,
    variants: [{ id: "14_4", name: "Pack of 4", label: "Pack of 4", price: 100, salePrice: 100, mrp: 130, stock: 50, inStock: true, bulkPrice: 80, bulkMOQ: 12, pack: "Pack of 4" }],
  },
  {
    name: "Rose Heart Candles", category: "Floral Candles",
    description: "Pack of 2 heart-shaped rose candles. Size: 6.5cm width, 4.5cm height. Customisation available.",
    price: 109, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389871/julina_candles/products/scented_glass_jar.png",
    featured: true, is_active: true,
    variants: [{ id: "15_2", name: "Pack of 2", label: "Pack of 2", price: 109, salePrice: 109, mrp: 140, stock: 50, inStock: true, bulkPrice: 89, bulkMOQ: 15, pack: "Pack of 2" }],
  },
  {
    name: "Kumud Jyot", category: "Floral Candles",
    description: "Lotus flower candle set on a traditional brass stand. Size: 9cm width, 4.5cm height. Customisation available.",
    price: 129, stock: 45, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389834/julina_candles/products/caramel_coffee_cream.png",
    featured: false, is_active: true,
    variants: [{ id: "16_1", name: "Single piece", label: "Single piece", price: 129, salePrice: 129, mrp: 160, stock: 45, inStock: true, bulkPrice: 109, bulkMOQ: 12, pack: "Single piece" }],
  },
  {
    name: "Sunflower Blossom Candle", category: "Glass Jar Candles",
    description: "Ribbed glass bowl filled with natural soy wax and a hand-poured sunflower top. Size: 8.5cm diameter, 4.5cm height.",
    price: 209, stock: 40, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389837/julina_candles/products/coffee_beans_candles.png",
    featured: true, is_active: true,
    variants: [{ id: "17_1", name: "Single piece", label: "Single piece", price: 209, salePrice: 209, mrp: 260, stock: 40, inStock: true, bulkPrice: 189, bulkMOQ: 12, pack: "Single piece" }],
  },
  {
    name: "Daisy Bloom Candles", category: "Glass Jar Candles",
    description: "Clear glass jar with lid containing a blooming daisy candle. Size: 8.5cm diameter, 4.5cm height.",
    price: 209, stock: 40, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389840/julina_candles/products/daisy_flower_jar.png",
    featured: true, is_active: true,
    variants: [{ id: "18_1", name: "Single piece", label: "Single piece", price: 209, salePrice: 209, mrp: 260, stock: 40, inStock: true, bulkPrice: 189, bulkMOQ: 12, pack: "Single piece" }],
  },
  {
    name: "Frost Glass Candles", category: "Glass Jar Candles",
    description: "Luxury matte frost glass jar candle (220ml) with custom label & box. Customisation available.",
    price: 199, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389871/julina_candles/products/scented_glass_jar.png",
    featured: true, is_active: true,
    variants: [{ id: "19_220", name: "220ml", label: "220ml", price: 199, salePrice: 199, mrp: 250, stock: 50, inStock: true, bulkPrice: 159, bulkMOQ: 15, pack: "220ml" }],
  },
  {
    name: "Tinted Jar Candle", category: "Glass Jar Candles",
    description: "Cut-glass tinted jar candle (150ml) with matching glass lid. Customisation available.",
    price: 129, stock: 50, photo: "https://res.cloudinary.com/bzykgznp/image/upload/v1786389840/julina_candles/products/daisy_flower_jar.png",
    featured: false, is_active: true,
    variants: [{ id: "20_150", name: "150ml", label: "150ml", price: 129, salePrice: 129, mrp: 160, stock: 50, inStock: true, bulkPrice: 99, bulkMOQ: 12, pack: "150ml" }],
  },
];

async function seed() {
  // Determine which key to use
  let supabaseKey = SUPABASE_SERVICE_KEY || SUPABASE_KEY;
  let usingServiceRole = !!SUPABASE_SERVICE_KEY;

  // If no service key, add a temporary RLS policy using the anon key approach
  if (!usingServiceRole) {
    console.log('⚠️  Please run the following SQL snippet in Supabase SQL Editor once before seeding:');
    console.log('');
    console.log('   -- 1. Ensure required columns and policies exist');
    console.log('   ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;');
    console.log('   ALTER TABLE public.products ALTER COLUMN event_id DROP NOT NULL;');
    console.log('   ALTER TABLE public.products ALTER COLUMN title DROP NOT NULL;');
    console.log('   CREATE POLICY "Temp Seed Insert Products" ON public.products FOR INSERT WITH CHECK (true);');
    console.log('');
    console.log('   Then re-run this script: node seed_products.js');
    console.log('');
  }

  const supabase = createClient(SUPABASE_URL, supabaseKey);

  console.log('🌱 Starting product seed...');

  // Delete all existing products first to ensure fresh seed with variants and updated prices
  console.log('🗑️ Deleting existing products to perform a fresh seed...');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

  if (deleteError) {
    console.error('❌ Failed to delete existing products:', deleteError.message);
    // Proceeding anyway just in case it's an RLS issue we bypass
  } else {
    console.log('✅ Successfully deleted existing products.');
  }

  const toInsert = PRODUCTS.map(p => {
    const item = {
      ...p,
    };
    return item;
  });

  if (toInsert.length === 0) {
    console.log('✅ No products to insert.');
    return;
  }

  // Fetch existing product names to report duplicates (if any)
  let existingNames = new Set();
  try {
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('name');
    if (!fetchError && Array.isArray(existingProducts)) {
      existingNames = new Set(existingProducts.map(p => p.name));
    }
  } catch (e) {
    // ignore fetch errors and proceed with insert
  }

  console.log(`📦 Inserting ${toInsert.length} new products (${existingNames.size} already exist)...`);

  // Insert in batches of 5 to avoid timeout
  for (let i = 0; i < toInsert.length; i += 5) {
    const batch = toInsert.slice(i, i + 5);
    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert(batch)
      .select('id, name');

    if (insertError) {
      console.error(`❌ Insert error (batch ${Math.floor(i/5) + 1}):`, insertError.message);
      if (insertError.message.includes('row-level security')) {
        console.log('\n💡 RLS is blocking inserts. Please run the SQL shown above in Supabase SQL Editor.');
      }
      process.exit(1);
    }

    inserted.forEach(p => console.log(`   ✅ ${p.name} (${p.id})`));
  }

  console.log(`\n✅ Successfully seeded ${toInsert.length} products!`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
