#!/usr/bin/env node

/**
 * سكريبت توصيات ضغط الصور بدون اعتماديات
 * يحلل الصور ويعطي توصيات للضغط اليدوي أو باستخدام أدوات أخرى
 */

const fs = require('fs');
const path = require('path');

function analyzeAndRecommend() {
  const assetsDir = path.join(process.cwd(), 'assets');
  let images = [];
  let totalSize = 0;

  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDir(filePath);
      } else {
        const ext = path.extname(file).toLowerCase();
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const sizeKB = Math.round(stat.size / 1024);
          images.push({
            name: file,
            path: filePath,
            size: stat.size,
            sizeKB,
            ext
          });
          totalSize += stat.size;
        }
      }
    });
  }

  scanDir(assetsDir);
  images.sort((a, b) => b.size - a.size);

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        📊 توصيات ضغط الصور - استخدم أداة خارجية        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('🔧 الأدوات الموصى بها:');
  console.log('  • TinyPNG/TinyJPG (أون لاين) - https://tinypng.com');
  console.log('  • ImageOptim (Mac) - https://imageoptim.com');
  console.log('  • PNGCrush أو OptiPNG (أوامر)');
  console.log('  • FFmpeg - لتحويل الملفات\n');

  console.log('📋 الصور التي تحتاج ضغط (أكثر من 500 KB):\n');

  let recommendations = [];
  images.forEach((img, i) => {
    if (img.sizeKB > 500) {
      const estimatedSaving = Math.round(img.sizeKB * 0.4);
      const newSize = img.sizeKB - estimatedSaving;
      recommendations.push({
        name: img.name,
        current: img.sizeKB,
        estimated: newSize,
        saving: estimatedSaving
      });

      console.log(`${i + 1}. ${img.name}`);
      console.log(`   الحجم الحالي: ${img.sizeKB} KB`);
      console.log(`   الحجم المتوقع: ~${newSize} KB`);
      console.log(`   التوفير: -${estimatedSaving} KB (-40%)\n`);
    }
  });

  // الملخص
  const totalRecommended = recommendations.length;
  const totalSavingKB = recommendations.reduce((sum, r) => sum + r.saving, 0);
  const totalSavingMB = (totalSavingKB / 1024).toFixed(2);

  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                       📊 الملخص                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`📈 الإحصائيات:`);
  console.log(`  • إجمالي الصور: ${images.length}`);
  console.log(`  • الحجم الكلي: ${(totalSize / (1024*1024)).toFixed(2)} MB`);
  console.log(`  • الصور التي تحتاج ضغط: ${totalRecommended}`);
  console.log(`  • التوفير المتوقع: ~${totalSavingMB} MB\n`);

  console.log('💡 نصائح:');
  console.log(`  1. استخدم TinyPNG لضغط PNG: أرفع الصور وحمل المضغوطة`);
  console.log(`  2. استخدم TinyJPG لضغط JPG: نفس الطريقة`);
  console.log(`  3. يمكن أيضاً استخدام imagemin في npm:\n`);

  console.log('   npm install --save-dev imagemin imagemin-pngquant imagemin-mozjpeg');
  console.log('   ثم أنشئ سكريبت يستخدمها\n');

  // إنشاء ملف توصيات
  const recommendationsJSON = JSON.stringify({
    generated: new Date().toISOString(),
    totalImages: images.length,
    totalSize: (totalSize / (1024*1024)).toFixed(2),
    imagesToCompress: recommendations,
    totalSavingKB,
    estimatedSavingPercentage: '35-40%'
  }, null, 2);

  fs.writeFileSync(
    path.join(process.cwd(), 'image-compression-recommendations.json'),
    recommendationsJSON
  );

  console.log('✅ تم حفظ التوصيات في: image-compression-recommendations.json\n');
}

analyzeAndRecommend();
