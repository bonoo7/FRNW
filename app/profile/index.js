import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    totalWins: 0,
    totalPoints: 0,
    winRate: 0,
    avgScore: 0,
    bestScore: 0,
    recentGames: []
  });

  useEffect(() => {
    if (currentUser?.uid) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const gamesQuery = query(
        collection(db, 'gameResults'),
        where('userId', '==', currentUser.uid),
        orderBy('completedAt', 'desc')
      );
      
      const gamesSnapshot = await getDocs(gamesQuery);
      const games = gamesSnapshot.docs.map(doc => doc.data());

      const totalGames = games.length;
      const totalWins = games.filter(g => g.position === 1).length;
      const totalPoints = games.reduce((sum, g) => sum + (g.score || 0), 0);
      const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
      const avgScore = totalGames > 0 ? Math.round(totalPoints / totalGames) : 0;
      const bestScore = games.length > 0 ? Math.max(...games.map(g => g.score || 0)) : 0;

      const recentGames = games.slice(0, 5);

      setGameStats({
        totalGames,
        totalWins,
        totalPoints,
        winRate,
        avgScore,
        bestScore,
        recentGames
      });

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const RecentGameCard = ({ game, index }) => (
    <View style={styles.recentGameCard}>
      <View style={styles.recentGameHeader}>
        <Text style={styles.recentGamePosition}>#{game.position || '-'}</Text>
        <Text style={styles.recentGameScore}>{game.score || 0} نقطة</Text>
      </View>
      <Text style={styles.recentGameDate}>
        {game.completedAt?.toDate ? game.completedAt.toDate().toLocaleDateString('ar-SA') : (game.completedAt ? new Date(game.completedAt).toLocaleDateString('ar-SA') : '-')}
      </Text>
      {game.position === 1 && (
        <Ionicons name="trophy" size={16} color="#FFD700" style={styles.trophyIcon} />
      )}
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
        <Text style={styles.headerTitle}>الملف الشخصي</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        {currentUser?.photoURL ? (
          <Image source={{ uri: currentUser.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
        )}
        <Text style={styles.displayName}>{currentUser?.displayName || 'لاعب'}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        
        {/* Credits Badge */}
        <View style={styles.creditsBadge}>
          <Ionicons name="game-controller" size={20} color="#4A90E2" />
          <Text style={styles.creditsText}>{userProfile?.gameCredits || 0} ألعاب متبقية</Text>
        </View>
      </View>

      {/* Statistics Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="game-controller-outline"
          title="إجمالي الألعاب"
          value={gameStats.totalGames}
          color="#4A90E2"
        />
        <StatCard
          icon="trophy-outline"
          title="الانتصارات"
          value={gameStats.totalWins}
          color="#FFD700"
        />
        <StatCard
          icon="star-outline"
          title="إجمالي النقاط"
          value={gameStats.totalPoints}
          color="#FF6B6B"
        />
        <StatCard
          icon="trending-up-outline"
          title="معدل الفوز"
          value={`${gameStats.winRate}%`}
          color="#51CF66"
        />
        <StatCard
          icon="analytics-outline"
          title="متوسط النقاط"
          value={gameStats.avgScore}
          color="#9B59B6"
        />
        <StatCard
          icon="flame-outline"
          title="أعلى نقاط"
          value={gameStats.bestScore}
          color="#FF9F43"
        />
      </View>

      {/* Recent Games */}
      {gameStats.recentGames.length > 0 && (
        <View style={styles.recentGamesSection}>
          <Text style={styles.sectionTitle}>الألعاب الأخيرة</Text>
          {gameStats.recentGames.map((game, index) => (
            <RecentGameCard key={index} game={game} index={index} />
          ))}
        </View>
      )}

      {/* Account Info */}
      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>معلومات الحساب</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            تاريخ الانضمام: {userProfile?.createdAt?.toDate ? userProfile.createdAt.toDate().toLocaleDateString('ar-SA') : (userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('ar-SA') : 'غير متوفر')}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#51CF66" />
          <Text style={styles.infoText}>
            الحساب نشط
          </Text>
        </View>
      </View>
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  creditsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  creditsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statsGrid: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 4,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
  },
  recentGamesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recentGameCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    position: 'relative',
  },
  recentGameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentGamePosition: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  recentGameScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentGameDate: {
    fontSize: 12,
    color: '#999',
  },
  trophyIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  accountSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});
