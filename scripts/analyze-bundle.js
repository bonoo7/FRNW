#!/usr/bin/env node

/**
 * تحليل حجم الحزم وتحديد الملفات الكبيرة
 */

const fs = require('fs');
const path = require('path');

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  });
  
  return size;
}

function analyzeBundle() {
  const directories = [
    { name: 'node_modules', path: path.join(process.cwd(), 'node_modules') },
    { name: 'assets', path: path.join(process.cwd(), 'assets') },
    { name: 'components', path: path.join(process.cwd(), 'components') },
    { name: 'screens', path: path.join(process.cwd(), 'screens') },
    { name: 'dist', path: path.join(process.cwd(), 'dist') },
  ];
  
  console.log('\n📊 تحليل حجم الحزم:\n');
  
  const results = [];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir.path)) {
      const size = getDirectorySize(dir.path);
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      results.push({ name: dir.name, size, sizeInMB });
      console.log(`  📁 ${dir.name}: ${sizeInMB} MB`);
    }
  });
  
  const totalSize = results.reduce((sum, r) => sum + r.size, 0);
  console.log(`\n  📦 الحجم الكلي: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  
  // تحليل node_modules
  if (fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    console.log('\n\n📦 أكبر المكتبات في node_modules:\n');
    
    const modulesPath = path.join(process.cwd(), 'node_modules');
    const modules = fs.readdirSync(modulesPath)
      .filter(name => {
        const modulePath = path.join(modulesPath, name);
        return !name.startsWith('.') && fs.statSync(modulePath).isDirectory();
      })
      .map(name => {
        const modulePath = path.join(modulesPath, name);
        const size = getDirectorySize(modulePath);
        return { name, size, sizeInMB: (size / (1024 * 1024)).toFixed(2) };
      })
      .sort((a, b) => b.size - a.size)
      .slice(0, 15);
    
    modules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.name}: ${module.sizeInMB} MB`);
    });
  }
  
  console.log('\n');
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { getDirectorySize, analyzeBundle };
