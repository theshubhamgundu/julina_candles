import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ygqddtioylsrvgecmmfh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncWRkdGlveWxzcnZnZWNtbWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4OTYwODksImV4cCI6MjEwMDQ3MjA4OX0.KoHWR7r-IHPX_QGvbe7TM8gkNiZ8zT1ChY7fd3Dqtxo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

