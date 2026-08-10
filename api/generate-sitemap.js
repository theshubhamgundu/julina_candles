// Dynamic Sitemap Generator for Julina Candles & Melts
// Run this script to generate sitemap.xml with all products and blogs
// Usage: node api/generate-sitemap.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase connection
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ygqddtioylsrvgecmmfh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlncWRkdGlveWxzcnZnZWNtbWZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDg5NjA4OSwiZXhwIjoyMTAwNDcyMDg5fQ.s3bO24CLIPJP6_VQorTIYfxAVLBdVrM9zO-9hJwtysQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://julinacandles.in';

// Format date for sitemap (YYYY-MM-DD)
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Escape XML special characters
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateSitemap() {
  console.log('🗺️  Generating dynamic sitemap...');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/products', priority: 0.9, changefreq: 'weekly' },
    { path: '/track-shipment', priority: 0.5, changefreq: 'monthly' },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' },
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
    { path: '/shipping-policy', priority: 0.3, changefreq: 'yearly' },
    { path: '/refund-policy', priority: 0.3, changefreq: 'yearly' },
  ];

  console.log('📄 Adding static pages...');
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // Fetch all products
  console.log('📦 Fetching products from database...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, photo, updated_at')
    .order('created_at', { ascending: false });

  if (products && !productsError) {
    console.log(`✅ Found ${products.length} products`);
    products.forEach(product => {
      const productName = escapeXml(product.name);
      xml += `
  <url>
    <loc>${BASE_URL}/product/${product.id}</loc>
    <lastmod>${formatDate(product.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
      
      if (product.photo) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(product.photo)}</image:loc>
      <image:title>${productName}</image:title>
    </image:image>`;
      }
      
      xml += `
  </url>`;
    });
  } else {
    console.warn('⚠️  No products found or error:', productsError);
  }

  // Fetch all published blogs (if CMS tables exist)
  console.log('📝 Fetching blogs from database...');
  const { data: blogs, error: blogsError } = await supabase
    .from('blogs')
    .select('id, title, slug, image, updated_at')
    .eq('is_published', true)
    .order('date', { ascending: false });

  if (blogs && !blogsError) {
    console.log(`✅ Found ${blogs.length} published blogs`);
    blogs.forEach(blog => {
      const blogTitle = escapeXml(blog.title);
      xml += `
  <url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${formatDate(blog.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`;
      
      if (blog.image) {
        xml += `
    <image:image>
      <image:loc>${escapeXml(blog.image)}</image:loc>
      <image:title>${blogTitle}</image:title>
    </image:image>`;
      }
      
      xml += `
  </url>`;
    });
  } else {
    console.log('ℹ️  No blogs found (CMS tables may not be created yet)');
  }

  xml += `
</urlset>`;

  // Write sitemap to client/public directory
  const sitemapPath = path.join(process.cwd(), 'client', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`🌐 URL: ${BASE_URL}/sitemap.xml`);
  
  // Generate stats
  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`📊 Total URLs: ${urlCount}`);
}

// Run generator
generateSitemap()
  .then(() => {
    console.log('🎉 Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  });

