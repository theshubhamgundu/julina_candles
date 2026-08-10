const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'bzykgznp',
  api_key: '499172848449522',
  api_secret: '3Lfi2vOoa0HXENIjQo7FLnFrwVU'
});

const publicDir = path.join(__dirname, 'public');
const assetsDir = path.join(__dirname, 'client', 'src', 'assets');

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }
  return arrayOfFiles;
}

async function uploadAll() {
  const publicFiles = getAllFiles(publicDir);
  const assetFiles = getAllFiles(assetsDir);
  const allFiles = [...publicFiles, ...assetFiles];

  console.log(`Found ${allFiles.length} images to upload.`);

  const urlMap = {};

  for (const filePath of allFiles) {
    let relativePath = '';
    if (filePath.startsWith(publicDir)) {
      relativePath = '/' + path.relative(publicDir, filePath).replace(/\\/g, '/');
    } else if (filePath.startsWith(assetsDir)) {
      relativePath = '/src/assets/' + path.relative(assetsDir, filePath).replace(/\\/g, '/');
    }

    const fileName = path.basename(filePath, path.extname(filePath)).replace(/[^a-zA-Z0-9_\-]/g, '_');
    const folder = filePath.includes('avatars') ? 'julina_candles/avatars' : 'julina_candles/products';

    try {
      console.log(`Uploading: ${relativePath} ...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
        public_id: fileName,
        overwrite: true,
        resource_type: 'auto'
      });
      urlMap[relativePath] = result.secure_url;
      console.log(`  SUCCESS -> ${result.secure_url}`);
    } catch (err) {
      console.error(`FAILED to upload ${filePath}:`, err.message);
    }
  }

  const outputDir = path.join(__dirname, 'scratch');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    path.join(outputDir, 'cloudinary_map.json'),
    JSON.stringify(urlMap, null, 2)
  );
  console.log('\nUpload finished! Saved map to scratch/cloudinary_map.json');
}

uploadAll();
