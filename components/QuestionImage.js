import React, { useState, useEffect } from 'react';
import { Image, Dimensions, TouchableOpacity, Modal, Pressable, View, PixelRatio, Platform } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getImageFromFileName } from '../utils/imageMapping';
import ImageProxyService from '../services/imageProxyService';

// الصور الافتراضية
const DEFAULT_QUESTION_IMAGE = require('../assets/images/default-question.png');
const DEFAULT_ANSWER_IMAGE = require('../assets/images/default-answer.png');

const QuestionImage = ({ 
  questionImage, 
  answerImage, 
  isAnswerRevealed, 
  style 
}) => {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isLandscape = screenWidth > screenHeight;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  
  // تحديد حجم الصورة المصغرة مع دعم الشاشات عالية الكثافة (Retina)
  const pixelRatio = PixelRatio.get();
  const thumbnailSize = isLandscape ? {
    width: Math.min(screenWidth * 0.3, 240),
    height: Math.min(screenHeight * 0.3, 160)
  } : {
    width: Math.min(screenWidth * 0.6, 300),
    height: Math.min(screenHeight * 0.25, 180)
  };
  // أبعاد الصورة الفعلية (لجودة أعلى)
  const highResThumbnailSize = {
    width: thumbnailSize.width * pixelRatio,
    height: thumbnailSize.height * pixelRatio
  };

  // تحديد حجم الصورة المكبرة
  const modalImageSize = {
    width: Math.min(screenWidth * 0.95, 900),
    height: Math.min(screenHeight * 0.9, 700)
  };

  useEffect(() => {
    // تحديد المسار المطلوب بناءً على حالة الإجابة
    const imagePath = isAnswerRevealed ? answerImage : questionImage;
    setImageError(false);
    
    if (!imagePath) {
      // استخدام الصورة الافتراضية
      setImageSource(isAnswerRevealed ? DEFAULT_ANSWER_IMAGE : DEFAULT_QUESTION_IMAGE);
      return;
    }
    
    // الحصول على الصورة من ملف التعيين
    const image = getImageFromFileName(imagePath);
    
    if (image) {
      setImageSource(image);
    } else {
      console.warn(`Image not found: ${imagePath}`);
      // إذا كانت صورة خارجية، حاول تحميلها مع معالجة الأخطاء
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        setImageSource({ 
          uri: imagePath,
          cache: 'force-cache',
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        });
      } else {
        setImageSource(isAnswerRevealed ? DEFAULT_ANSWER_IMAGE : DEFAULT_QUESTION_IMAGE);
      }
    }
  }, [questionImage, answerImage, isAnswerRevealed]);

  // تحديد مصدر الصورة بدقة عالية للمصغرة والرابط الخارجي
  const getThumbnailImageSource = () => {
    const imagePath = isAnswerRevealed ? answerImage : questionImage;
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return ImageProxyService.getOptimizedImageUrl(imagePath);
    }
    return imageSource;
  };

  // تحديد مصدر الصورة بدقة عالية عند التكبير
  const getModalImageSource = () => {
    // إذا كان المستخدم وضع رابط صورة (وليس من الماب)، استخدم الرابط مباشرة
    const imagePath = isAnswerRevealed ? answerImage : questionImage;
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return ImageProxyService.getOptimizedImageUrl(imagePath);
    }
    return imageSource;
  };

  // دعم عرض الصورة بدقة عالية على الويب باستخدام <img>
  const renderImage = () => {
    const imgSrc = getThumbnailImageSource();
    const src = imgSrc && imgSrc.uri ? imgSrc.uri : undefined;
    if (Platform.OS === 'web' && src) {
      return (
        <img
          src={src}
          alt="question"
          style={{
            width: thumbnailSize.width,
            height: thumbnailSize.height,
            objectFit: 'contain',
            borderRadius: 12,
            display: 'block',
            margin: '0 auto',
            background: 'transparent',
          }}
          draggable={false}
        />
      );
    }
    // الوضع الافتراضي للجوال
    return (
      <Image
        source={imgSrc}
        style={{
          ...thumbnailSize,
          alignSelf: 'center',
          borderRadius: 12
        }}
        resizeMode="contain"
        onError={handleImageError}
        onLoad={() => {
          // التحقق من تحميل الصورة بنجاح
          console.log('Image loaded successfully');
        }}
      />
    );
  };

  // دعم عرض الصورة بدقة عالية على الويب في المودال أيضًا مع حماية من null
  const renderModalImage = () => {
    const modalSrcObj = getModalImageSource();
    const modalSrc = modalSrcObj && modalSrcObj.uri ? modalSrcObj.uri : undefined;
    if (Platform.OS === 'web' && modalSrc) {
      return (
        <img
          src={modalSrc}
          alt="modal"
          style={{
            width: modalImageSize.width,
            height: modalImageSize.height,
            objectFit: 'contain',
            borderRadius: 16,
            display: 'block',
            margin: '0 auto',
            background: 'transparent',
          }}
          draggable={false}
        />
      );
    }
    return (
      <Image
        source={modalSrcObj}
        style={{
          ...modalImageSize,
          borderRadius: 16
        }}
        resizeMode="contain"
        onError={handleImageError}
        onLoad={() => {
          // التحقق من تحميل الصورة بنجاح
          console.log('Modal image loaded successfully');
        }}
      />
    );
  };

  // التعامل مع أخطاء تحميل الصورة
  const handleImageError = (error) => {
    const imagePath = isAnswerRevealed ? answerImage : questionImage;
    console.warn('Error loading image:', imagePath, error);
    
    // محاولة الحصول على رابط بديل
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      const alternativeUrl = ImageProxyService.getAlternativeImageUrl(imagePath);
      if (alternativeUrl) {
        console.log('Trying alternative image URL');
        setImageSource(alternativeUrl);
        return;
      }
    }
    
    // إذا فشلت جميع المحاولات، استخدم الصورة الافتراضية
    setImageError(true);
    setImageSource(isAnswerRevealed ? DEFAULT_ANSWER_IMAGE : DEFAULT_QUESTION_IMAGE);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={[
          style,
          { 
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 12 // إضافة حواف دائرية للحاوية
          }
        ]}
      >
        {renderImage()}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
          onPress={() => setIsModalVisible(false)}
        >
          {renderModalImage()}
        </Pressable>
      </Modal>
    </>
  );
};

export default QuestionImage;
