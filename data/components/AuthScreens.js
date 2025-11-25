import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import BackgroundSelector from './BackgroundSelector';
import { SPACING, FONTS } from '../styles/theme';

const { width, height } = Dimensions.get('window');

export const LoginScreen = ({ onSwitchToRegister }) => {
  const { theme } = useTheme();
  const { signin, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await signin(email, password);
      // Navigation will be handled by AuthContext
    } catch (error) {
      let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'لا يوجد حساب بهذا البريد الإلكتروني';
          break;
        case 'auth/wrong-password':
          errorMessage = 'كلمة المرور غير صحيحة';
          break;
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صالح';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'تم محاولة تسجيل الدخول مرات كثيرة. يرجى المحاولة لاحقاً';
          break;
      }
      
      Alert.alert('خطأ في تسجيل الدخول', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.type === 'success') {
        // Success will be handled by AuthContext useEffect
        // No need to show anything here
        console.log('Google login successful, waiting for auth state change');
      }
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول بجوجل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <LinearGradient colors={["#1E40AF", "#3B82F6", "#1E40AF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container} style={{ zIndex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.formContainer, { backgroundColor: `${theme.colors.background.surface}E6` }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              مرحباً بك في فكّر
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              سجل دخولك لحفظ تقدمك والتنافس مع الأصدقاء
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="email" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="lock" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  paddingRight: 50,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="كلمة المرور"
                placeholderTextColor={theme.colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border?.primary }]} />
              <Text style={[styles.dividerText, { color: theme.colors.text.secondary }]}>أو</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border?.primary }]} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              style={[styles.googleButton, { 
                borderColor: theme.colors.border?.primary || theme.colors.primary,
                backgroundColor: 'transparent'
              }]}
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <MaterialIcons name="account-circle" size={24} color="#4285F4" />
              <Text style={[styles.googleButtonText, { color: theme.colors.text.primary }]}>
                تسجيل الدخول بجوجل
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
                ليس لديك حساب؟ 
              </Text>
              <TouchableOpacity onPress={onSwitchToRegister}>
                <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                  إنشاء حساب جديد
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export const RegisterScreen = ({ onSwitchToLogin }) => {
  const { theme } = useTheme();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, displayName);
      Alert.alert('نجح التسجيل', 'تم إنشاء حسابك بنجاح!');
    } catch (error) {
      let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'يوجد حساب بهذا البريد الإلكتروني مسبقاً';
          break;
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صالح';
          break;
        case 'auth/weak-password':
          errorMessage = 'كلمة المرور ضعيفة جداً';
          break;
      }
      
      Alert.alert('خطأ في التسجيل', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <LinearGradient colors={["#1E40AF", "#3B82F6", "#1E40AF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }} />
      </View>
      <ScrollView contentContainerStyle={styles.container} style={{ zIndex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.formContainer, { backgroundColor: `${theme.colors.background.surface}E6` }]}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              إنشاء حساب جديد
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              انضم إلى مجتمع فكّر واحفظ إنجازاتك
            </Text>

            {/* Display Name Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="person" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="الاسم الكامل"
                placeholderTextColor={theme.colors.text.secondary}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="email" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="lock" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  paddingRight: 50,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="كلمة المرور (6 أحرف على الأقل)"
                placeholderTextColor={theme.colors.text.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons 
                name="lock-outline" 
                size={24} 
                color={theme.colors.text.secondary} 
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text.primary,
                  borderColor: theme.colors.border?.primary || theme.colors.primary,
                  paddingRight: 50,
                  backgroundColor: theme.colors.background?.input || 'rgba(255, 255, 255, 0.9)'
                }]}
                placeholder="تأكيد كلمة المرور"
                placeholderTextColor={theme.colors.text.secondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>إنشاء الحساب</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: theme.colors.text.secondary }]}>
                لديك حساب بالفعل؟ 
              </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                  تسجيل الدخول
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    minHeight: height,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    borderRadius: 20,
    padding: SPACING.xl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  inputContainer: {
    marginBottom: SPACING.md,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 50,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: SPACING.lg,
  },
  googleButtonText: {
    fontSize: 16,
    marginLeft: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
    fontFamily: FONTS.bold,
  },
});

export default { LoginScreen, RegisterScreen };







