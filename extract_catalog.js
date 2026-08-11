import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const PDF_PATH = './catalog.pdf';
const OUT_JSON = './catalog_parsed.json';
const OUT_TEXT = './catalog_text.txt';
const SEED_FILE = './seed_products.js';

function findPrices(block) {
  const priceRe = /₹\s*[\d,]+|Rs\.?\s*[\d,]+|INR\s*[\d,]+/g;
  const matches = block.match(priceRe) || [];
  return [...new Set(matches.map(s => s.replace(/[ ,]/g, '').replace(/Rs\.?|₹|INR/gi, '').trim()))];
}

function findSizes(block) {
  const sizeRe = /\b\d+(?:\.\d+)?\s*(?:inch|in|cm|mm|ml|g|kg)\b|Pack of \d+|Pack of \d+ pieces/gi;
  const matches = block.match(sizeRe) || [];
  return [...new Set(matches.map(s => s.trim()))];
}

function parseBlocks(text) {
  const cleaned = text.replace(/\r/g, '\n');
  const blocks = cleaned.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const items = blocks.map(block => {
    const lines = block.split(/\n+/).map(l => l.trim()).filter(Boolean);
    const name = lines[0] || '';
    const prices = findPrices(block);
    const sizes = findSizes(block);
    return { name, sizes, prices, raw: block.slice(0, 800) };
  });
  return items.filter(it => it.name || it.prices.length || it.sizes.length);
}

async function extract() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error('catalog.pdf not found at', PDF_PATH);
    process.exit(2);
  }

  const dataBuffer = fs.readFileSync(PDF_PATH);
  const loadingTask = getDocument({ data: new Uint8Array(dataBuffer) });
  const pdfDoc = await loadingTask.promise;
  let fullText = '';
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str).join(' ');
    fullText += '\n\n' + strings;
  }
  fs.writeFileSync(OUT_TEXT, fullText, 'utf8');
  const parsed = parseBlocks(fullText);

  // Read seed product names from seed_products.js for comparison
  let seedNames = [];
  try {
    const seedSrc = fs.readFileSync(SEED_FILE, 'utf8');
    const nameRe = /name:\s*"([^"]+)"/g;
    let m; while ((m = nameRe.exec(seedSrc)) !== null) seedNames.push(m[1]);
  } catch (e) {
    // ignore
  }

  const seedSet = new Set(seedNames);
  const catalogNames = parsed.map(p => p.name).filter(Boolean);
  const catalogSet = new Set(catalogNames);

  const missingInSeed = catalogNames.filter(n => !seedSet.has(n));
  const missingInCatalog = seedNames.filter(n => !catalogSet.has(n));

  const output = { parsedCount: parsed.length, parsed, seedCount: seedNames.length, missingInSeed, missingInCatalog };
  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2), 'utf8');

  console.log('Parsed blocks:', parsed.length);
  console.log('Seed products:', seedNames.length);
  console.log('Missing in seed (in catalog but not seed):', missingInSeed.length);
  console.log('Missing in catalog (in seed but not catalog):', missingInCatalog.length);
  console.log('Wrote', OUT_TEXT, 'and', OUT_JSON);
}

extract().catch(err => { console.error(err); process.exit(1); });
