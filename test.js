import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lzsjohnscesymlkuvmng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c2pvaG5zY2VzeW1sa3V2bW5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjgwMDQzNCwiZXhwIjoyMTAyMzc2NDM0fQ.ywgq8iG-UWSfeqBCqGgsX_aOt9ZiN5Dav2n4zN1aLlU'
);

// Quick connectivity + data check
async function check() {
  console.log('=== Verifying new Supabase project ===\n');

  const tables = ['products', 'orders', 'users', 'coupons'];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    console.log(error ? `❌ ${table}: ${error.message}` : `✅ ${table}: ${count} rows`);
  }

  console.log('\n=== Products ===');
  const { data } = await supabase.from('products').select('name, category, price').order('name');
  (data || []).forEach(p => console.log(`  🕯️ ${p.name} | ${p.category} | ₹${p.price}`));
}

check().catch(err => console.error('Error:', err));
