import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import categoryImages from '../assets/categories.js';
import { useTheme } from '../contexts/ThemeContext';
import { withThemeStyles } from '../styles/styles';
import { wp, hp } from '../styles/responsive';

// دالة لحساب حجم الخط بناءً على حجم الشاشة
const getResponsiveFontSize = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isLandscape = screenWidth > screenHeight;
  
  if (screenWidth < 400) return 8;
  if (screenWidth < 600) return isLandscape ? 7 : 9;
  if (screenWidth < 800) return isLandscape ? 8 : 10;
  return isLandscape ? 9 : 11;
};

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
  const responsiveFontSize = getResponsiveFontSize();
  
  const platformStyles = Platform.select({
    web: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    default: {
      elevation: 2,
    }
  });

  return (
    <View style={[
      styles.container, 
      { 
        borderColor: isSelected ? theme.colors.primary : theme.colors.border?.primary || theme.colors.border,
        borderWidth: isSelected ? 2 : 1,
        transform: [{ scale: isSelected ? 1.05 : 1 }],
      },
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
              { 
                color: theme.colors.text.light,
                fontSize: responsiveFontSize,
              }
            ]}>
              {category}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(12), // جعل الحجم متناسباً مع عرض الشاشة
    aspectRatio: 0.75,
    borderRadius: 10,
    margin: 4,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  touchable: {
    flex: 1,
  },
  categoryContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  imageContainer: {
    flex: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
  },
  title: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    textAlign: 'center',
    numberOfLines: 1,
  },
  orderBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 3,
  },
  orderText: {
    fontSize: 8,
    fontWeight: FONTS.weights.bold,
    fontFamily: 'ReadexPro_700Bold',
    color: '#000',
  },
  selectedImage: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
}); 