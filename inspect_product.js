import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dpcdscfhdqctlcwfzoue.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY2RzY2ZoZHFjdGxjd2Z6b3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMzgzNzcsImV4cCI6MjEwMTkxNDM3N30.apNfacogIt10mKo4vEVRUwut99_xyOAeMKFUux4BzAU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const productId = process.argv[2] || '0412f6d7-d717-45d1-a783-6144dcb6c6ae';

(async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    process.exit(1);
  }

  console.log(JSON.stringify(data, null, 2));
})();
