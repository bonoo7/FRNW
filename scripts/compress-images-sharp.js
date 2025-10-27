#!/usr/bin/env node

/**
 * سكريبت تقليل حجم الصور باستخدام sharp
 * أداة خفيفة وسريعة لضغط الصور
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImage(inputPath, quality = 85) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    const originalSize = fs.statSync(inputPath).size;
    
    if (ext === '.gif') {
      console.log(`⚠️  ${path.basename(inputPath)}: GIF - تحتاج معالجة يدوية`);
      return 0;
    }
    
    const tempPath = inputPath + '.tmp';
    
    // ضغط الصورة
    await sharp(inputPath)
      .resize(2000, 2000, { withoutEnlargement: true })
      .jpeg({ quality: quality, progressive: true })
      .toFile(tempPath);
    
    const newSize = fs.statSync(tempPath).size;
    const saved = originalSize - newSize;
    const percent = Math.round((saved / originalSize) * 100);
    
    if (saved > 0) {
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);
      console.log(`  ✓ ${path.basename(inputPath)}: ${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB (-${percent}%)`);
      return saved;
    }
    
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    return 0;
  } catch (error) {
    console.error(`  ❌ خطأ: ${error.message}`);
    return 0;
  }
}

async function compressAll() {
  const assetsDir = path.join(process.cwd(), 'assets');
  let totalSaved = 0;
  let filesProcessed = 0;
  let totalFiles = 0;
  
  function findImages(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findImages(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          totalFiles++;
        }
      }
    });
  }
  
  findImages(assetsDir);
  
  console.log(`\n🔍 وجدت ${totalFiles} صورة`);
  console.log('⏳ جاري الضغط...\n');
  
  async function processImages(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await processImages(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          let quality = 85;
          if (filePath.includes('categories')) quality = 90;
          if (filePath.includes('questions')) quality = 80;
          
          const saved = await compressImage(filePath, quality);
          if (saved > 0) {
            totalSaved += saved;
            filesProcessed++;
          }
        }
      }
    }
  }
  
  await processImages(assetsDir);
  
  console.log(`\n✅ اكتمل الضغط!`);
  console.log(`📈 الملفات المعالجة: ${filesProcessed}/${totalFiles}`);
  console.log(`💾 المساحة المحفوظة: ${(totalSaved/(1024*1024)).toFixed(2)} MB\n`);
}

if (require.main === module) {
  compressAll().catch(console.error);
}

module.exports = { compressImage, compressAll };
