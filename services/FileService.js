import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// مفتاح لتخزين ما إذا كان التطبيق يعمل على الخادم أو محلياً
const IS_SERVER_KEY = 'isServerEnvironment';

// تحديد عنوان API الصحيح
const getApiBaseUrl = () => {
  // في بيئة التطوير المحلية، نستخدم عنوان الخادم المحلي
  if (__DEV__) {
    return 'http://localhost:3000';
  }
  // في بيئة الإنتاج، نستخدم المسار النسبي
  return '';
};

const FileService = {
  // التحقق مما إذا كان التطبيق يعمل على الخادم
  isServerEnvironment: async () => {
    try {
      const isServer = await AsyncStorage.getItem(IS_SERVER_KEY);
      return isServer === 'true';
    } catch (error) {
      console.error('خطأ في التحقق من بيئة التشغيل:', error);
      return false;
    }
  },

  // تعيين بيئة التشغيل
  setServerEnvironment: async (isServer) => {
    try {
      await AsyncStorage.setItem(IS_SERVER_KEY, isServer ? 'true' : 'false');
      return true;
    } catch (error) {
      console.error('خطأ في تعيين بيئة التشغيل:', error);
      return false;
    }
  },

  // كتابة البيانات إلى ملف
  writeToFile: async (filePath, content) => {
    try {
      // في بيئة الويب، نستخدم واجهة API دائمًا
      if (Platform.OS === 'web') {
        try {
          // استخدام API لكتابة الملف على الخادم
          const apiUrl = `${getApiBaseUrl()}/api/write-file`;
          console.log('Attempting to write file using API:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, content }),
          });
          
          // التحقق من أن الاستجابة صالحة
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API response error:', response.status, errorText);
            return { 
              success: false, 
              message: `خطأ في استجابة الخادم: ${response.status} ${response.statusText}` 
            };
          }
          
          // محاولة تحليل الاستجابة كـ JSON
          try {
            const result = await response.json();
            return result;
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            return { 
              success: false, 
              message: `خطأ في تحليل استجابة الخادم: ${jsonError.message}` 
            };
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          return { 
            success: false, 
            message: `خطأ في الاتصال بالخادم: ${fetchError.message}` 
          };
        }
      } else if (await FileService.isServerEnvironment()) {
        // استخدام API لكتابة الملف على الخادم (للأجهزة المحمولة)
        try {
          const apiUrl = `${getApiBaseUrl()}/api/write-file`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath, content }),
          });
          
          // التحقق من أن الاستجابة صالحة
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API response error:', response.status, errorText);
            return { 
              success: false, 
              message: `خطأ في استجابة الخادم: ${response.status} ${response.statusText}` 
            };
          }
          
          const result = await response.json();
          return result;
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          return { 
            success: false, 
            message: `خطأ في الاتصال بالخادم: ${fetchError.message}` 
          };
        }
      } else {
        // استخدام FileSystem لكتابة الملف محليًا (للأجهزة المحمولة)
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
          const fileUri = `${FileSystem.documentDirectory}${filePath}`;
          await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory, { intermediates: true });
          await FileSystem.writeAsStringAsync(fileUri, content);
          return { success: true, message: 'تم كتابة الملف بنجاح' };
        } else {
          return { success: false, message: 'بيئة غير مدعومة' };
        }
      }
    } catch (error) {
      console.error('خطأ في كتابة الملف:', error);
      return { success: false, message: `خطأ في كتابة الملف: ${error.message}` };
    }
  },

  // قراءة البيانات من ملف
  readFile: async (filePath) => {
    try {
      // التحقق من بيئة التشغيل
      const isServer = await FileService.isServerEnvironment();
      
      if (isServer) {
        // استخدام API لقراءة الملف من الخادم
        const apiUrl = `${getApiBaseUrl()}/api/read-file?path=${encodeURIComponent(filePath)}`;
        try {
          const response = await fetch(apiUrl);
          // التحقق من أن الاستجابة صالحة
          if (!response.ok) {
            const errorText = await response.text();
            console.error('API response error:', response.status, errorText);
            return { 
              success: false, 
              message: `خطأ في استجابة الخادم: ${response.status} ${response.statusText}` 
            };
          }
          const result = await response.json();
          if (result.success) {
            return { success: true, content: result.content };
          } else {
            return { success: false, message: result.message };
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          return { 
            success: false, 
            message: `خطأ في الاتصال بالخادم: ${fetchError.message}` 
          };
        }
      } else {
        // استخدام FileSystem لقراءة الملف محليًا
        if (Platform.OS === 'web') {
          return { success: false, message: 'قراءة الملفات غير متاحة في بيئة الويب' };
        }
        
        const content = await FileSystem.readAsStringAsync(filePath);
        return { success: true, content };
      }
    } catch (error) {
      console.error('خطأ في قراءة الملف:', error);
      return { success: false, message: `خطأ في قراءة الملف: ${error.message}` };
    }
  }
};

export default FileService;
