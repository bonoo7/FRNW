import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories.js';
import { useTheme } from '../contexts/ThemeContext';
import { withThemeStyles } from '../styles/styles';
import { wp } from '../styles/responsive';

// التأكد من وجود الصورة
const getCategoryImage = (category) => {
  const image = categoryImages[category];
  if (!image) {
    console.warn(`No image found for category: ${category}`);
    return categoryImages['معلومات عامة']; // صورة افتراضية
  }
  return image;
};

export const CategoryCard = ({ 
  category, 
  isSelected, 
  order, 
  onPress, 
  onLongPress,
}) => {
  const { theme } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isSelected ? 1.05 : 1) },
    ],
  }));

  const platformStyles = Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    default: {
      elevation: 2,
    }
  });

  return (
    <Animated.View style={[
      styles.container, 
      { 
        borderColor: isSelected ? theme.colors.primary : theme.colors.border?.primary || theme.colors.border,
        borderWidth: isSelected ? 2 : 1,
      },
      animatedStyle
    ]}>
      <TouchableOpacity 
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.touchable}
      >
        {isSelected && (
          <View style={styles.orderBadge}>
            <Text style={styles.orderText}>{order}</Text>
          </View>
        )}
        <View style={styles.categoryContent}>
          {/* صورة الفئة تملأ الجزء العلوي من البطاقة */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.7)',
              theme.colors.background.card,
              'rgba(255, 255, 255, 0.9)'
            ]}
            style={styles.imageContainer}
          >
            <Image 
              source={getCategoryImage(category)}
              style={[styles.image, isSelected && styles.selectedImage]}
              resizeMode="cover"
            />
          </LinearGradient>
          
          {/* عنوان الفئة في الأسفل مع خلفية من لون الثيم */}
          <LinearGradient
            colors={isSelected ? theme.colors.gradient.primary : [theme.colors.primary, theme.colors.primary]}
            style={styles.titleContainer}
          >
            <Text style={[
              styles.title,
              { color: theme.colors.text.light }
            ]}>
              {category}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(10), // تقليل العرض من 12% إلى 10%
    aspectRatio: 0.7, // تعديل النسبة لتناسب التصميم الجديد
    borderRadius: 8, // تقليل نصف قطر الحواف
    margin: 1, // تقليل المسافة بين البطاقات
    overflow: 'hidden',
    borderWidth: 1.5, // زيادة سماكة الإطار
    borderColor: 'transparent', // سيتم تحديد اللون ديناميكيًا في الكود
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  touchable: {
    flex: 1,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 4,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    padding: SPACING.sm, // زيادة الهامش الداخلي من xs إلى sm
    justifyContent: 'center',
    alignItems: 'center',
    height: 40, // تحديد ارتفاع ثابت لخلفية العنوان
  },
  title: {
    fontSize: FONTS.sizes.small, // تصغير حجم الخط من body إلى small
    fontWeight: FONTS.weights.bold, // جعل الخط أكثر سماكة
    fontFamily: 'ReadexPro_700Bold',
    textAlign: 'center',
  },
  orderBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 3,
  },
  orderText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#000',
  },
  selectedImage: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
}); 