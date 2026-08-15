import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://lzsjohnscesymlkuvmng.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6c2pvaG5zY2VzeW1sa3V2bW5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MDA0MzQsImV4cCI6MjEwMjM3NjQzNH0.qwxY5OJtvprwTC_TJ8806Nl2G-qF0hdWrmlrNLaSleY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

