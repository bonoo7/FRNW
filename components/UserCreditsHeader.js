import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CreditsService from '../services/creditsService';

/**
 * مكون عرض الرصيد بجانب اسم المستخدم
 * يعرض عدد الألعاب المتبقية مع أيقونة جميلة
 */
const UserCreditsHeader = ({ compact = false, onPressCredits }) => {
  const { theme } = useTheme();
  const { currentUser, userProfile } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadCredits();
      // تحديث الرصيد كل 5 ثوانٍ
      const interval = setInterval(loadCredits, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadCredits = async () => {
    try {
      const userCredits = await CreditsService.getUserCredits(currentUser.uid);
      setCredits(userCredits);
    } catch (error) {
      console.error('Error loading credits:', error);
      setCredits(0);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || !userProfile) {
    return null;
  }

  const displayName = userProfile.displayName || 'المستخدم';

  if (compact) {
    // نسخة مختصرة للهيدر
    return (
      <View style={[styles.compactContainer, { backgroundColor: theme.colors.background.card }]}>
        <TouchableOpacity
          onPress={onPressCredits}
          style={styles.creditsButtonCompact}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <>
              <MaterialIcons name="sports-esports" size={18} color={theme.colors.primary} />
              <Text style={[styles.creditsTextCompact, { color: theme.colors.text.primary }]}>
                {credits}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text
          style={[styles.userNameCompact, { color: theme.colors.text.primary }]}
          numberOfLines={1}
        >
          {displayName}
        </Text>
      </View>
    );
  }

  // نسخة كاملة
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.card }]}>
      <View style={styles.userInfoContainer}>
        <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
          {displayName}
        </Text>
        <Text style={[styles.userEmail, { color: theme.colors.text.secondary }]}>
          {currentUser.email}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onPressCredits}
        style={[
          styles.creditsCard,
          {
            backgroundColor: theme.colors.primary + '15',
            borderColor: theme.colors.primary,
          },
        ]}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <>
            <View style={styles.creditsIconContainer}>
              <MaterialIcons name="sports-esports" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.creditsTextContainer}>
              <Text style={[styles.creditsLabel, { color: theme.colors.text.secondary }]}>
                الألعاب المتبقية
              </Text>
              <Text style={[styles.creditsValue, { color: theme.colors.primary }]}>
                {credits} {credits === 1 ? 'لعبة' : 'ألعاب'}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={theme.colors.primary} />
          </>
        )}
      </TouchableOpacity>

      {/* تحذير إذا كان الرصيد منخفضاً */}
      {credits > 0 && credits <= 2 && (
        <View
          style={[
            styles.warningBox,
            { backgroundColor: theme.colors.accent + '20', borderColor: theme.colors.accent },
          ]}
        >
          <MaterialIcons name="warning" size={16} color={theme.colors.accent} />
          <Text style={[styles.warningText, { color: theme.colors.accent }]}>
            رصيدك على وشك النفاد! قم بشراء المزيد
          </Text>
        </View>
      )}

      {/* تحذير حرج إذا انتهى الرصيد */}
      {credits === 0 && (
        <View
          style={[
            styles.criticalBox,
            { backgroundColor: '#ff3b30' + '20', borderColor: '#ff3b30' },
          ]}
        >
          <MaterialIcons name="error" size={16} color="#ff3b30" />
          <Text style={[styles.criticalText]}>
            لقد انتهى رصيدك! يجب شراء ألعاب للمتابعة
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  userInfoContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'right',
  },
  userEmail: {
    fontSize: 12,
    textAlign: 'right',
  },
  creditsCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  creditsIconContainer: {
    marginRight: 12,
  },
  creditsTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  creditsLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  creditsValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  warningBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  criticalBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  criticalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff3b30',
    flex: 1,
    textAlign: 'right',
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  userNameCompact: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  creditsButtonCompact: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 4,
    minWidth: 50,
    justifyContent: 'center',
  },
  creditsTextCompact: {
    fontSize: 12,
    fontWeight: '700',
  },
});

export default UserCreditsHeader;
