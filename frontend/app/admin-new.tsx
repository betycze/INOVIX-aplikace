import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

interface Rating {
  _id: string;
  stars: number;
  comment: string;
  company: string;
  timestamp: string;
}

interface QuizArenaResult {
  _id: string;
  name: string;
  correct_answers: number;
  total_questions: number;
  average_time: number;
  instagram?: string;
  timestamp: string;
}

export default function AdminNewScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ratings' | 'quiz'>('ratings');
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [quizResults, setQuizResults] = useState<QuizArenaResult[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchRatings(), fetchQuizResults()]);
    setLoading(false);
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/ratings`);
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchQuizResults = async () => {
    try {
      // Fetch all quiz arena results directly from database
      const response = await fetch(`${backendUrl}/api/quiz-arena/all`);
      if (!response.ok) {
        // Fallback to leaderboard if /all endpoint doesn't exist
        const leaderboardResponse = await fetch(`${backendUrl}/api/quiz-arena/leaderboard`);
        const data = await leaderboardResponse.json();
        
        // Get all results from a different endpoint or use leaderboard
        const allResponse = await fetch(`${backendUrl}/api/quiz_scores`);
        const allData = await allResponse.json();
        
        setQuizResults(allData.map((item: any) => ({
          _id: item._id || item.id,
          name: item.name || 'Unknown',
          correct_answers: item.correct_answers || 0,
          total_questions: item.total_questions || 15,
          average_time: item.average_time || 0,
          instagram: item.instagram || '',
          timestamp: item.timestamp
        })));
      } else {
        const data = await response.json();
        setQuizResults(data);
      }
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const deleteRating = async (id: string) => {
    Alert.alert(
      'Smazat hodnocení',
      'Opravdu chcete smazat toto hodnocení?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${backendUrl}/api/ratings/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchRatings();
              }
            } catch (error) {
              console.error('Error deleting rating:', error);
            }
          },
        },
      ]
    );
  };

  const deleteQuizResult = async (id: string) => {
    Alert.alert(
      'Smazat výsledek',
      'Opravdu chcete smazat tento výsledek kvízu?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${backendUrl}/api/quiz-arena/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchQuizResults();
              }
            } catch (error) {
              console.error('Error deleting quiz result:', error);
            }
          },
        },
      ]
    );
  };

  const deleteAllRatings = () => {
    Alert.alert(
      'Smazat všechna hodnocení',
      'Opravdu chcete smazat VŠECHNA hodnocení? Tuto akci nelze vrátit!',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat vše',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${backendUrl}/api/ratings`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchRatings();
              }
            } catch (error) {
              console.error('Error deleting all ratings:', error);
            }
          },
        },
      ]
    );
  };

  const deleteAllQuizResults = () => {
    Alert.alert(
      'Smazat všechny výsledky',
      'Opravdu chcete smazat VŠECHNY výsledky kvízu? Tuto akci nelze vrátit!',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat vše',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${backendUrl}/api/quiz_scores`, {
                method: 'DELETE',
              });
              if (response.ok) {
                await fetchQuizResults();
              }
            } catch (error) {
              console.error('Error deleting all quiz results:', error);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FEC11B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#FEC11B" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ratings' && styles.activeTab]}
          onPress={() => setActiveTab('ratings')}
        >
          <Ionicons name="star" size={20} color={activeTab === 'ratings' ? '#000' : '#FEC11B'} />
          <Text style={[styles.tabText, activeTab === 'ratings' && styles.activeTabText]}>
            Hodnocení ({ratings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'quiz' && styles.activeTab]}
          onPress={() => setActiveTab('quiz')}
        >
          <Ionicons name="trophy" size={20} color={activeTab === 'quiz' ? '#000' : '#FEC11B'} />
          <Text style={[styles.tabText, activeTab === 'quiz' && styles.activeTabText]}>
            Quiz Arena ({quizResults.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hodnocení stánku</Text>
              {ratings.length > 0 && (
                <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllRatings}>
                  <Ionicons name="trash" size={18} color="#FF4444" />
                  <Text style={styles.deleteAllText}>Smazat vše</Text>
                </TouchableOpacity>
              )}
            </View>

            {ratings.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="star-outline" size={64} color="#666" />
                <Text style={styles.emptyText}>Zatím žádná hodnocení</Text>
              </View>
            ) : (
              ratings.map((rating) => (
                <View key={rating._id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= rating.stars ? 'star' : 'star-outline'}
                          size={20}
                          color="#FEC11B"
                        />
                      ))}
                    </View>
                    <TouchableOpacity onPress={() => deleteRating(rating._id)}>
                      <Ionicons name="trash-outline" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>

                  {rating.company && (
                    <Text style={styles.company}>{rating.company}</Text>
                  )}

                  {rating.comment && (
                    <Text style={styles.comment}>{rating.comment}</Text>
                  )}

                  <Text style={styles.timestamp}>{formatDate(rating.timestamp)}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Quiz Tab */}
        {activeTab === 'quiz' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Výsledky INOVIX Quiz Arena</Text>
              {quizResults.length > 0 && (
                <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllQuizResults}>
                  <Ionicons name="trash" size={18} color="#FF4444" />
                  <Text style={styles.deleteAllText}>Smazat vše</Text>
                </TouchableOpacity>
              )}
            </View>

            {quizResults.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={64} color="#666" />
                <Text style={styles.emptyText}>Zatím žádné výsledky</Text>
              </View>
            ) : (
              quizResults.map((result, index) => (
                <View key={result._id || index} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.quizInfo}>
                      <Text style={styles.playerName}>{result.name}</Text>
                      {result.instagram && (
                        <Text style={styles.instagram}>@{result.instagram}</Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={() => deleteQuizResult(result._id)}>
                      <Ionicons name="trash-outline" size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.quizStats}>
                    <View style={styles.quizStat}>
                      <Text style={styles.quizStatValue}>
                        {result.correct_answers}/{result.total_questions}
                      </Text>
                      <Text style={styles.quizStatLabel}>Správně</Text>
                    </View>

                    <View style={styles.quizStat}>
                      <Text style={styles.quizStatValue}>{result.average_time.toFixed(1)}s</Text>
                      <Text style={styles.quizStatLabel}>Průměrný čas</Text>
                    </View>

                    <View style={styles.quizStat}>
                      <Text style={styles.quizStatValue}>
                        {((result.correct_answers / result.total_questions) * 100).toFixed(0)}%
                      </Text>
                      <Text style={styles.quizStatLabel}>Úspěšnost</Text>
                    </View>
                  </View>

                  <Text style={styles.timestamp}>{formatDate(result.timestamp)}</Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232426',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1b1d',
    borderBottomWidth: 2,
    borderBottomColor: '#FEC11B',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  refreshButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1b1d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#232426',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FEC11B',
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#FEC11B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEC11B',
  },
  activeTabText: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  deleteAllText: {
    fontSize: 14,
    color: '#FF4444',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1a1b1d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3b3d',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  company: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEC11B',
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  quizInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginBottom: 4,
  },
  instagram: {
    fontSize: 14,
    color: '#888',
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 12,
  },
  quizStat: {
    alignItems: 'center',
  },
  quizStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  quizStatLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});
