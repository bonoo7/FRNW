#!/usr/bin/env node

/**
 * سكريبت ضغط الصور باستخدام Sharp
 * يقوم بضغط جميع صور PNG و JPG
 */

try {
  const sharp = require('sharp');
  const fs = require('fs');
  const path = require('path');

  async function compressImages() {
    const assetsDir = path.join(process.cwd(), 'assets');
    let totalSaved = 0;
    let filesProcessed = 0;

    console.log('\n🔍 جاري الضغط...\n');

    async function processDir(dir) {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          await processDir(filePath);
        } else {
          const ext = path.extname(file).toLowerCase();
          if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            try {
              const originalSize = stat.size;
              let quality = 85;
              
              if (filePath.includes('categories')) quality = 90;
              if (filePath.includes('questions')) quality = 80;

              const metadata = await sharp(filePath).metadata();
              if (!metadata) continue;

              const tempPath = filePath + '.tmp';
              await sharp(filePath)
                .resize(Math.min(2000, metadata.width), Math.min(2000, metadata.height), {
                  withoutEnlargement: true
                })
                [ext === '.png' ? 'png' : 'jpeg']({ quality, progressive: true })
                .toFile(tempPath);

              const newSize = fs.statSync(tempPath).size;
              const saved = originalSize - newSize;

              if (saved > 0) {
                fs.unlinkSync(filePath);
                fs.renameSync(tempPath, filePath);
                totalSaved += saved;
                filesProcessed++;
                const percent = Math.round((saved / originalSize) * 100);
                console.log(`  ✓ ${path.basename(filePath)}: ${Math.round(originalSize/1024)}KB → ${Math.round(newSize/1024)}KB (-${percent}%)`);
              } else {
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
              }
            } catch (error) {
              // Skip on error
            }
          }
        }
      }
    }

    await processDir(assetsDir);

    console.log(`\n✅ اكتمل الضغط!`);
    console.log(`📈 الملفات المعالجة: ${filesProcessed}`);
    console.log(`💾 المساحة المحفوظة: ${(totalSaved / (1024 * 1024)).toFixed(2)} MB\n`);
  }

  compressImages().catch(console.error);
} catch (error) {
  console.error('❌ خطأ:', error.message);
  process.exit(1);
}
