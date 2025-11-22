import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    overview: {
      totalGames: 0,
      totalWins: 0,
      totalPoints: 0,
      bestScore: 0,
      winRate: 0,
      avgScore: 0,
    },
    categoryStats: [],
    recentPerformance: [],
    achievements: [],
  });

  useEffect(() => {
    if (currentUser?.uid) {
      loadStatistics();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadStatistics = async () => {
    try {
      setLoading(true);

      // جلب جميع نتائج الألعاب
      const gamesQuery = query(
        collection(db, 'gameResults'),
        where('userId', '==', currentUser.uid),
        orderBy('completedAt', 'desc')
      );
      
      const gamesSnapshot = await getDocs(gamesQuery);
      const games = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // حساب الإحصائيات العامة
      const totalGames = games.length;
      const totalWins = games.filter(g => g.position === 1).length;
      const totalPoints = games.reduce((sum, g) => sum + (g.score || 0), 0);
      const bestScore = games.length > 0 ? Math.max(...games.map(g => g.score || 0)) : 0;
      const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
      const avgScore = totalGames > 0 ? Math.round(totalPoints / totalGames) : 0;

      // إحصائيات حسب الفئة
      const categoryMap = {};
      games.forEach(game => {
        if (game.categories && Array.isArray(game.categories)) {
          game.categories.forEach(cat => {
            if (!categoryMap[cat]) {
              categoryMap[cat] = { games: 0, wins: 0, totalScore: 0 };
            }
            categoryMap[cat].games++;
            if (game.position === 1) categoryMap[cat].wins++;
            categoryMap[cat].totalScore += game.score || 0;
          });
        }
      });

      const categoryStats = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        games: data.games,
        wins: data.wins,
        winRate: ((data.wins / data.games) * 100).toFixed(1),
        avgScore: Math.round(data.totalScore / data.games),
      })).sort((a, b) => b.games - a.games);

      // الأداء الأخير (آخر 10 ألعاب)
      const recentPerformance = games.slice(0, 10).map((game, index) => ({
        gameNumber: totalGames - index,
        score: game.score || 0,
        position: game.position || '-',
        date: game.completedAt?.toDate ? game.completedAt.toDate().toLocaleDateString('ar-SA') : (game.completedAt ? new Date(game.completedAt).toLocaleDateString('ar-SA') : '-'),
      }));

      // الإنجازات
      const achievements = [];
      if (totalGames >= 1) achievements.push({ icon: 'game-controller', title: 'أول لعبة', desc: 'لعبت أول لعبة' });
      if (totalGames >= 10) achievements.push({ icon: 'flame', title: 'لاعب نشط', desc: 'لعبت 10 ألعاب' });
      if (totalGames >= 50) achievements.push({ icon: 'star', title: 'لاعب محترف', desc: 'لعبت 50 لعبة' });
      if (totalWins >= 1) achievements.push({ icon: 'trophy', title: 'أول فوز', desc: 'فزت في أول لعبة' });
      if (totalWins >= 10) achievements.push({ icon: 'medal', title: 'بطل', desc: 'فزت في 10 ألعاب' });
      if (bestScore >= 100) achievements.push({ icon: 'ribbon', title: 'نقاط عالية', desc: 'حصلت على 100+ نقطة' });

      setStats({
        overview: {
          totalGames,
          totalWins,
          totalPoints,
          bestScore,
          winRate,
          avgScore,
        },
        categoryStats,
        recentPerformance,
        achievements,
      });

    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const OverviewCard = ({ icon, title, value, color, subtitle }) => (
    <View style={[styles.overviewCard, { backgroundColor: color }]}>
      <Ionicons name={icon} size={32} color="#fff" style={styles.cardIcon} />
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-forward" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإحصائيات</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Overview Cards */}
      <View style={styles.overviewGrid}>
        <OverviewCard
          icon="game-controller"
          title="إجمالي الألعاب"
          value={stats.overview.totalGames}
          color="#4A90E2"
        />
        <OverviewCard
          icon="trophy"
          title="الانتصارات"
          value={stats.overview.totalWins}
          color="#FFD700"
        />
        <OverviewCard
          icon="trending-up"
          title="معدل الفوز"
          value={`${stats.overview.winRate}%`}
          color="#51CF66"
        />
        <OverviewCard
          icon="star"
          title="إجمالي النقاط"
          value={stats.overview.totalPoints}
          color="#FF6B6B"
        />
        <OverviewCard
          icon="analytics"
          title="متوسط النقاط"
          value={stats.overview.avgScore}
          color="#9B59B6"
        />
        <OverviewCard
          icon="flame"
          title="أعلى نقاط"
          value={stats.overview.bestScore}
          color="#FF9F43"
        />
      </View>

      {/* Category Statistics */}
      {stats.categoryStats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإحصائيات حسب الفئة</Text>
          {stats.categoryStats.map((cat, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{cat.category}</Text>
                <Text style={styles.categoryGames}>{cat.games} لعبة</Text>
              </View>
              <View style={styles.categoryStats}>
                <View style={styles.categoryStat}>
                  <Ionicons name="trophy-outline" size={16} color="#FFD700" />
                  <Text style={styles.categoryStatText}>{cat.wins} فوز</Text>
                </View>
                <View style={styles.categoryStat}>
                  <Ionicons name="trending-up-outline" size={16} color="#51CF66" />
                  <Text style={styles.categoryStatText}>{cat.winRate}% معدل فوز</Text>
                </View>
                <View style={styles.categoryStat}>
                  <Ionicons name="analytics-outline" size={16} color="#4A90E2" />
                  <Text style={styles.categoryStatText}>{cat.avgScore} متوسط</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Recent Performance */}
      {stats.recentPerformance.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الأداء الأخير</Text>
          <View style={styles.performanceTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>اللعبة</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>النقاط</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>المركز</Text>
            </View>
            {stats.recentPerformance.map((game, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 1 }]}>#{game.gameNumber}</Text>
                <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold', color: '#4A90E2' }]}>
                  {game.score}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {game.position === 1 ? '🏆' : `#${game.position}`}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Achievements */}
      {stats.achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإنجازات</Text>
          <View style={styles.achievementsGrid}>
            {stats.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Ionicons name={achievement.icon} size={30} color="#FFD700" />
                </View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 20,
  },
  overviewCard: {
    width: (width - 40) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryGames: {
    fontSize: 14,
    color: '#666',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryStatText: {
    fontSize: 12,
    color: '#666',
  },
  performanceTable: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    padding: 12,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    textAlign: 'center',
    color: '#333',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    width: (width - 50) / 3,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});
