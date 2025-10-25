#!/usr/bin/env node

/**
 * سكريبت ضغط الصور
 * يقوم بضغط جميع الصور في المشروع
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// إعدادات الضغط
const COMPRESSION_CONFIG = {
  'categories': { quality: 90 },
  'questions': { quality: 80 },
  'default': { quality: 85 }
};

function getQuality(filePath) {
  if (filePath.includes('categories')) return 90;
  if (filePath.includes('questions')) return 80;
  return 85;
}

function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

function compressImage(inputPath, quality) {
  try {
    const ext = path.extname(inputPath).toLowerCase();
    
    if (ext === '.gif') {
      console.log(`⚠️  ${path.basename(inputPath)}: تحتاج لمعالجة يدوية`);
      return 0;
    }
    
    const originalSize = getFileSizeKB(inputPath);
    const tempPath = inputPath + '.tmp';
    
    const command = `magick "${inputPath}" -quality ${quality} -strip "${tempPath}"`;
    execSync(command, { stdio: 'pipe' });
    
    const newSize = getFileSizeKB(tempPath);
    const saved = originalSize - newSize;
    
    if (saved > 0) {
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);
      const percent = Math.round((saved / originalSize) * 100);
      console.log(`  ✓ ${path.basename(inputPath)}: ${originalSize}KB → ${newSize}KB (-${percent}%)`);
      return saved;
    } else {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      return 0;
    }
  } catch (error) {
    return 0;
  }
}

function compressAll() {
  const assetsDir = path.join(process.cwd(), 'assets');
  let totalSaved = 0;
  let filesProcessed = 0;
  
  function findAndCompress(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findAndCompress(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const quality = getQuality(filePath);
          const saved = compressImage(filePath, quality);
          if (saved > 0) {
            totalSaved += saved;
            filesProcessed++;
          }
        }
      }
    });
  }
  
  console.log('\n🔍 جاري ضغط الصور...\n');
  findAndCompress(assetsDir);
  
  console.log(`\n✅ اكتمل الضغط!`);
  console.log(`📈 الملفات المعالجة: ${filesProcessed}`);
  console.log(`💾 المساحة المحفوظة: ${Math.round(totalSaved / 1024)} MB\n`);
}

if (require.main === module) {
  try {
    execSync('magick --version', { stdio: 'pipe' });
    compressAll();
  } catch (error) {
    console.error('❌ ImageMagick غير مثبت. الرجاء التثبيت أولاً:');
    console.error('   Windows: choco install imagemagick');
    console.error('   Mac: brew install imagemagick');
  }
}

module.exports = { compressImage };
