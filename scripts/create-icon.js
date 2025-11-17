#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  try {
    // الأيقونة الأصلية
    const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
    const outputPath = path.join(__dirname, '..', 'assets', 'icon.png');
    
    // قراءة الأيقونة الأصلية
    const image = sharp(iconPath);
    
    // إنشاء خلفية زرقاء (1024x1024)
    const blueIcon = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: { r: 30, g: 64, b: 175 } // #1E40AF - الأزرق الداكن
      }
    })
    .composite([
      {
        input: await image.resize(900, 900).toBuffer(),
        left: 62,
        top: 62
      }
    ])
    .png()
    .toFile(outputPath);
    
    console.log('✅ تم إنشاء الأيقونة بنجاح:', blueIcon);
    
    // إنشاء نسخة adaptive icon للأندرويد
    const adaptiveIconPath = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 3,
        background: { r: 30, g: 64, b: 175 }
      }
    })
    .composite([
      {
        input: await image.resize(800, 800).toBuffer(),
        left: 112,
        top: 112
      }
    ])
    .png()
    .toFile(adaptiveIconPath);
    
    console.log('✅ تم إنشاء adaptive icon بنجاح');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

createIcon();
