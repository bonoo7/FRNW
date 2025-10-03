import { StyleSheet, Platform } from 'react-native';
import { SPACING, FONTS, SHADOWS } from './theme';

export const createGlobalStyles = (theme) => StyleSheet.create({
  // أنماط الحاويات المشتركة
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  // أنماط البطاقات المشتركة
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: SPACING.md,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }
    })
  },
  
  // أنماط الأزرار المشتركة
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  // أنماط النصوص المشتركة
  text: {
    fontFamily: FONTS.families.primary,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  
  textBold: {
    fontFamily: FONTS.families.secondary,
    fontWeight: FONTS.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
  },
  
  title: {
    fontFamily: FONTS.families.secondary,
    fontSize: FONTS.sizes.title,
    fontWeight: FONTS.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'right',
    marginBottom: SPACING.sm,
  },
  
  subtitle: {
    fontFamily: FONTS.families.secondary,
    fontSize: FONTS.sizes.subtitle,
    fontWeight: FONTS.weights.semibold,
    color: theme.colors.text.secondary,
    textAlign: 'right',
    marginBottom: SPACING.xs,
  },
  
  // أنماط القوائم المشتركة
  list: {
    padding: SPACING.md,
  },
  
  // أنماط الإدخال المشتركة
  input: {
    borderRadius: 8,
    padding: SPACING.sm,
    borderWidth: 1,
  },
});

// أنماط مساعدة للثيم
export const withThemeStyles = (styles, theme) => {
  return typeof styles === 'function' ? styles(theme) : styles;
}; 