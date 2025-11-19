#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIcon() {
  try {
    // استخدام اللوجو بدلاً من الأيقونة القديمة
    const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
    const iconPath = path.join(__dirname, '..', 'assets', 'icon.png');
    const adaptiveIconPath = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
    
    // قراءة اللوجو
    const logoImage = sharp(logoPath);
    
    // إنشاء خلفية زرقاء احترافية مع تدرج (1024x1024)
    const blueIcon = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 30, g: 64, b: 175, alpha: 1 } // #1E40AF - الأزرق الداكن
      }
    })
    .composite([
      {
        input: await logoImage.resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
        left: 162,
        top: 162
      }
    ])
    .png()
    .toFile(iconPath);
    
    console.log('✅ تم إنشاء الأيقونة بنجاح:', iconPath);
    
    // إنشاء نسخة adaptive icon للأندرويد (نفس التصميم)
    const adaptiveIcon = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 } // الخلفية البيضاء للخصم
      }
    })
    .composite([
      {
        input: await logoImage.resize(600, 600, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(),
        left: 212,
        top: 212
      }
    ])
    .png()
    .toFile(adaptiveIconPath);
    
    console.log('✅ تم إنشاء adaptive icon بنجاح:', adaptiveIconPath);
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

createIcon();
