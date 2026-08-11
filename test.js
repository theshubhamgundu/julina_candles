import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dpcdscfhdqctlcwfzoue.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwY2RzY2ZoZHFjdGxjd2Z6b3VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMzgzNzcsImV4cCI6MjEwMTkxNDM3N30.apNfacogIt10mKo4vEVRUwut99_xyOAeMKFUux4BzAU');
supabase.from('products').select('id, name, variants').limit(2).then(res => console.log(JSON.stringify(res, null, 2)));
