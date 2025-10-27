#!/usr/bin/env node

/**
 * أداة تقليل حجم الصور البسيطة
 * تحلل أحجام الصور وتعطي توصيات
 */

const fs = require('fs');
const path = require('path');

function getFileSizeKB(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      bytes: stats.size,
      kb: Math.round(stats.size / 1024),
      mb: (stats.size / (1024 * 1024)).toFixed(2)
    };
  } catch {
    return null;
  }
}

function analyzeImages() {
  const assetsDir = path.join(process.cwd(), 'assets');
  let imagesByCategory = {
    'categories': [],
    'questions': [],
    'icons': [],
    'other': []
  };
  
  let totalSize = 0;
  let totalFiles = 0;
  let gifs = [];
  let largeImages = [];

  function scanDir(dir, category) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          let nextCategory = category;
          if (file.includes('categories')) nextCategory = 'categories';
          else if (file.includes('questions')) nextCategory = 'questions';
          else if (file.includes('icons')) nextCategory = 'icons';
          
          scanDir(filePath, nextCategory);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
            const size = getFileSizeKB(filePath);
            if (size) {
              totalSize += size.bytes;
              totalFiles++;

              if (ext === '.gif') {
                gifs.push({ file, ...size, path: filePath });
              }

              if (size.kb > 500) {
                largeImages.push({ file, ...size, category, path: filePath });
              }

              if (!imagesByCategory[category]) imagesByCategory[category] = [];
              imagesByCategory[category].push({ file, ...size });
            }
          }
        }
      });
    } catch (error) {
      console.error(`خطأ في قراءة ${dir}:`, error.message);
    }
  }

  scanDir(assetsDir, 'other');

  return {
    totalFiles,
    totalSize: {
      bytes: totalSize,
      kb: Math.round(totalSize / 1024),
      mb: (totalSize / (1024 * 1024)).toFixed(2)
    },
    categories: imagesByCategory,
    gifs,
    largeImages
  };
}

function printReport(analysis) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║             📊 تقرير تحليل حجم الصور                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`📈 الإحصائيات العامة:`);
  console.log(`  إجمالي الملفات: ${analysis.totalFiles} صورة`);
  console.log(`  إجمالي الحجم: ${analysis.totalSize.mb} MB (${analysis.totalSize.kb} KB)\n`);

  console.log(`📁 توزيع حسب الفئة:`);
  Object.entries(analysis.categories).forEach(([category, images]) => {
    if (images.length > 0) {
      const categorySize = images.reduce((sum, img) => sum + img.bytes, 0);
      console.log(`  ${category}: ${images.length} ملف (${(categorySize / (1024*1024)).toFixed(2)} MB)`);
    }
  });

  if (analysis.gifs.length > 0) {
    console.log(`\n⚠️ ملفات GIF (تحتاج معالجة يدوية):`);
    analysis.gifs.forEach(gif => {
      console.log(`  • ${gif.file}: ${gif.mb} MB`);
    });
  }

  if (analysis.largeImages.length > 0) {
    console.log(`\n🔴 صور كبيرة جداً (> 500 KB):`);
    analysis.largeImages.slice(0, 15).forEach(img => {
      const estimatedSaving = Math.round(img.kb * 0.4);
      console.log(`  • ${img.file}: ${img.kb}KB → ~${img.kb - estimatedSaving}KB (-${Math.round((estimatedSaving/img.kb)*100)}%)`);
    });
    if (analysis.largeImages.length > 15) {
      console.log(`  ... و ${analysis.largeImages.length - 15} صور أخرى`);
    }
  }

  // حساب التوفير المتوقع
  const savingEstimate = analysis.largeImages.reduce((sum, img) => {
    return sum + Math.round(img.kb * 0.4);
  }, 0);

  console.log(`\n💾 التوفير المتوقع:`);
  console.log(`  من المكن توفير: ~${(savingEstimate / 1024).toFixed(1)} MB`);
  console.log(`  من الحجم الأصلي: ${analysis.totalSize.mb} MB`);
  console.log(`  النسبة: ${Math.round((savingEstimate / analysis.totalSize.kb) * 100)}%\n`);
}

// تشغيل التحليل
const analysis = analyzeImages();
printReport(analysis);

module.exports = { analyzeImages, printReport };
