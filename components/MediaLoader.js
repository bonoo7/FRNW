import React, { useEffect } from 'react';
import { Audio } from 'expo-av';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// قائمة بملفات الصوت والفيديو التي تحتاج إلى التحميل المسبق
const audioAssets = [
  require('../assets/audio/sample-question.mp3'),
  require('../assets/audio/sample-answer.mp3'),
  // أضف هنا جميع ملفات الصوت المطلوبة
];

const videoAssets = [
  require('../assets/videos/sample-question.mp4'),
  require('../assets/videos/sample-answer.mp4'),
  // أضف هنا جميع ملفات الفيديو المطلوبة
];

// دالة للحصول على اسم الملف من المسار
const getFileNameFromPath = (path) => {
  return path.split('/').pop();
};

const MediaLoader = () => {
  useEffect(() => {
    const loadMedia = async () => {
      try {
        // تحميل ملفات الصوت والفيديو مسبقاً
        await Promise.all([
          ...audioAssets.map(asset => Asset.loadAsync(asset)),
          ...videoAssets.map(asset => Asset.loadAsync(asset))
        ]);
      } catch (error) {
        console.error('خطأ في تحميل ملفات الصوت أو الفيديو:', error);
      }
    };
    loadMedia();
  }, []);
  return null;
};

export { audioAssets, videoAssets, getFileNameFromPath };
export default MediaLoader;
