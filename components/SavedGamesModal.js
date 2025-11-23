import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SPACING, FONTS } from '../styles/theme';
import SavedGamesService from '../services/savedGamesService';
import { useRouter } from 'expo-router';

const SavedGamesModal = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    if (visible) {
      loadSavedGames();
    }
  }, [visible]);

  const loadSavedGames = async () => {
    try {
      setLoading(true);
      if (!currentUser?.uid) {
        Alert.alert('خطأ', 'يجب تسجيل الدخول لعرض الألعاب المحفوظة');
        return;
      }

      const games = await SavedGamesService.getUserSavedGames(currentUser.uid);
      setSavedGames(games);
    } catch (error) {
      console.error('Error loading saved games:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحميل الألعاب المحفوظة');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = async (game, mode = 'replay') => {
    try {
      let gameData;
      
      if (mode === 'continue') {
        // استكمال اللعبة من حيث توقفت
        gameData = await SavedGamesService.continueGame(game);
        console.log('Continue game data:', {
          isContinuing: gameData.isContinuing,
          savedGameId: gameData.savedGameId,
          hasQuestions: !!gameData.questions
        });
      } else {
        // إعادة تشغيل (من البداية)
        gameData = await SavedGamesService.replayGame(game);
        console.log('Replay game data:', {
          isReplaying: gameData.isReplaying,
          replayFromGameId: gameData.replayFromGameId,
          hasQuestions: !!gameData.questions
        });
      }
      
      router.push({
        pathname: '/game',
        params: {
          gameData: JSON.stringify(gameData),
          isReplay: mode === 'replay',
          isContinuing: mode === 'continue'
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Error starting game:', error);
      Alert.alert('خطأ', 'حدث خطأ في بدء اللعبة');
    }
  };

  const handleDeleteGame = async (gameId) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل تريد حذف هذه اللعبة المحفوظة؟',
      [
        {
          text: 'إلغاء',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'حذف',
          onPress: async () => {
            try {
              await SavedGamesService.deleteSavedGame(gameId);
              setSavedGames(savedGames.filter(g => g.id !== gameId));
              Alert.alert('تم', 'تم حذف اللعبة بنجاح');
            } catch (error) {
              console.error('Error deleting game:', error);
              Alert.alert('خطأ', 'حدث خطأ في حذف اللعبة');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderGameItem = ({ item }) => {
    const createdDate = new Date(item.createdAt);
    const formattedDate = createdDate.toLocaleDateString('ar-SA');
    const formattedTime = createdDate.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <TouchableOpacity
        style={[
          styles.gameCard,
          { backgroundColor: theme.colors.background.surface, borderColor: theme.colors.border.primary }
        ]}
        onPress={() => setSelectedGame(item)}
      >
        <View style={styles.gameHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.gameName, { color: theme.colors.text.primary }]}>
              {item.roundName}
            </Text>
            <Text style={[styles.gameDate, { color: theme.colors.text.secondary }]}>
              {formattedDate} - {formattedTime}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {!item.isCompleted && (
              <View style={[
                styles.badge,
                { backgroundColor: theme.colors.warning + '30' }
              ]}>
                <MaterialIcons name="hourglass-empty" size={14} color={theme.colors.warning} />
                <Text style={[styles.badgeText, { color: theme.colors.warning }]}>غير مكتملة</Text>
              </View>
            )}
            {item.isCompleted && (
              <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
            )}
          </View>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.infoItem}>
            <MaterialIcons name="groups" size={16} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {item.teams.length} فرق
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="category" size={16} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {item.categories.length} فئات
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="quiz" size={16} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {item.selectedQuestions.length} أسئلة
            </Text>
          </View>
        </View>

        {/* عرض الفئات */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: 4, 
          marginTop: 8,
          marginBottom: 8,
          paddingHorizontal: 4
        }}>
          {item.categories.map((cat, index) => (
            <View 
              key={index} 
              style={{
                backgroundColor: theme.colors.primary + '15',
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderWidth: 1,
                borderColor: theme.colors.primary + '30'
              }}
            >
              <Text style={{
                fontSize: 10,
                color: theme.colors.primary,
                fontFamily: FONTS.families.secondary
              }}>
                {cat}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonGroup}>
          {!item.isCompleted && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.secondary, flex: 1, marginRight: SPACING.xs }
              ]}
              onPress={() => handlePlayGame(item, 'continue')}
            >
              <MaterialIcons name="redo" size={18} color="#FFF" />
              <Text style={styles.actionButtonText}>استكمال</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary, flex: 1, marginRight: SPACING.sm }
            ]}
            onPress={() => handlePlayGame(item, 'replay')}
          >
            <MaterialIcons name="replay" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>إعادة تشغيل</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.error, paddingHorizontal: SPACING.md }
            ]}
            onPress={() => handleDeleteGame(item.id)}
          >
            <MaterialIcons name="delete" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ألعابي المحفوظة</Text>
          <View style={styles.closeButton} />
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
              جاري تحميل الألعاب...
            </Text>
          </View>
        ) : savedGames.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="videogame-asset-off" size={64} color={theme.colors.text.secondary} />
            <Text style={[styles.emptyText, { color: theme.colors.text.primary }]}>
              لم تحفظ أي لعبة بعد
            </Text>
            <Text style={[styles.emptySubText, { color: theme.colors.text.secondary }]}>
              ستظهر الألعاب التي تلعبها هنا
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedGames}
            renderItem={renderGameItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
          />
        )}

        {/* Game Details Modal */}
        {selectedGame && (
          <View style={[styles.detailsOverlay]}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setSelectedGame(null)}
            />
            <View style={[
              styles.detailsCard,
              { backgroundColor: theme.colors.background.surface }
            ]}>
              <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => setSelectedGame(null)}>
                  <MaterialIcons name="close" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={[styles.detailsTitle, { color: theme.colors.text.primary }]}>
                  تفاصيل اللعبة
                </Text>
                <View style={{ width: 24 }} />
              </View>

              <ScrollView style={styles.detailsContent}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  اسم الجولة
                </Text>
                <Text style={[styles.sectionValue, { color: theme.colors.text.secondary }]}>
                  {selectedGame.roundName}
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, marginTop: SPACING.lg }]}>
                  الفرق ({selectedGame.teams.length})
                </Text>
                {selectedGame.teams.map((team, index) => (
                  <View key={index} style={styles.tagContainer}>
                    <View style={[
                      styles.tag,
                      { backgroundColor: theme.colors.primary + '20' }
                    ]}>
                      <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                        {team}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, marginTop: SPACING.lg }]}>
                  الفئات ({selectedGame.categories.length})
                </Text>
                {selectedGame.categories.map((category, index) => (
                  <View key={index} style={styles.tagContainer}>
                    <View style={[
                      styles.tag,
                      { backgroundColor: theme.colors.secondary + '20' }
                    ]}>
                      <Text style={[styles.tagText, { color: theme.colors.secondary }]}>
                        {category}
                      </Text>
                    </View>
                  </View>
                ))}

                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, marginTop: SPACING.lg }]}>
                  عدد الأسئلة: {selectedGame.selectedQuestions.length}
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.detailsPlayButton,
                  { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => {
                  handlePlayGame(selectedGame);
                  setSelectedGame(null);
                }}
              >
                <MaterialIcons name="play-arrow" size={24} color="#FFF" />
                <Text style={styles.detailsPlayButtonText}>إعادة تشغيل اللعبة</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.body,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    marginTop: SPACING.md,
  },
  emptySubText: {
    fontSize: FONTS.sizes.body,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  gameCard: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  gameName: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  gameDate: {
    fontSize: FONTS.sizes.caption,
    marginTop: SPACING.xs,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: SPACING.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.bold,
  },
  detailsOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  detailsCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: SPACING.md,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  detailsTitle: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  detailsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
  },
  sectionValue: {
    fontSize: FONTS.sizes.body,
    marginBottom: SPACING.md,
  },
  tagContainer: {
    marginBottom: SPACING.xs,
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
  },
  detailsPlayButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
  },
  detailsPlayButtonText: {
    color: '#FFF',
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
});

export default SavedGamesModal;
