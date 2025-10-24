// Script لإنشاء صورة نقش
const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

// إنشاء مجلد assets إذا لم يكن موجوداً
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// إعدادات النقش
const width = 100;
const height = 100;
const canvas = Canvas.createCanvas(width, height);
const ctx = canvas.getContext('2d');

// ملء الخلفية بلون أزرق فاتح
ctx.fillStyle = '#E3F2FD';
ctx.fillRect(0, 0, width, height);

// رسم خطوط قطرية
ctx.strokeStyle = '#4285F4';
ctx.lineWidth = 2;
ctx.globalAlpha = 0.3; // شفافية

const spacing = 15;

// خطوط من أعلى اليسار لأسفل اليمين
for (let i = -height; i < width; i += spacing) {
  ctx.beginPath();
  ctx.moveTo(i, 0);
  ctx.lineTo(i + height, height);
  ctx.stroke();
}

// خطوط من أعلى اليمين لأسفل اليسار
for (let i = 0; i < width + height; i += spacing) {
  ctx.beginPath();
  ctx.moveTo(0, i - width);
  ctx.lineTo(height, i);
  ctx.stroke();
}

// حفظ الصورة
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(assetsDir, 'pattern.png'), buffer);

console.log('✅ تم إنشاء صورة النقش: assets/pattern.png');
