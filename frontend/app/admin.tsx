import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface Rating {
  id: string;
  stars: number;
  comment: string;
  photo: string;
  company: string;
  timestamp: string;
}

interface Stats {
  total_ratings: number;
  average_stars: number;
  star_distribution: {
    [key: string]: number;
  };
}

interface QuizScore {
  id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  timestamp: string;
}

interface QuizStats {
  total_attempts: number;
  average_score: number;
  highest_score: number;
}

export default function AdminScreen() {
  const { t } = useLanguage();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [quizScores, setQuizScores] = useState<QuizScore[]>([]);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch ratings
      const ratingsResponse = await fetch(`${BACKEND_URL}/api/ratings`);
      const ratingsData = await ratingsResponse.json();
      setRatings(ratingsData);

      // Fetch rating stats
      const statsResponse = await fetch(`${BACKEND_URL}/api/ratings/stats`);
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch quiz scores
      const quizScoresResponse = await fetch(`${BACKEND_URL}/api/quiz/scores`);
      const quizScoresData = await quizScoresResponse.json();
      setQuizScores(quizScoresData);

      // Fetch quiz stats
      const quizStatsResponse = await fetch(`${BACKEND_URL}/api/quiz/stats`);
      const quizStatsData = await quizStatsResponse.json();
      setQuizStats(quizStatsData);

      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleDeleteRating = async (ratingId: string) => {
    if (!confirm('Are you sure you want to delete this rating?')) return;
    
    try {
      const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/ratings/${ratingId}` : `/api/ratings/${ratingId}`;
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const handleDeleteAllRatings = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${ratings.length} ratings? This cannot be undone!`)) return;
    
    try {
      const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/ratings` : `/api/ratings`;
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting all ratings:', error);
    }
  };

  const handleDeleteQuizScore = async (scoreId: string) => {
    if (!confirm('Are you sure you want to delete this quiz score?')) return;
    
    try {
      const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/quiz/scores/${scoreId}` : `/api/quiz/scores/${scoreId}`;
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting quiz score:', error);
    }
  };

  const handleDeleteAllQuizScores = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${quizScores.length} quiz scores? This cannot be undone!`)) return;
    
    try {
      const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/quiz/scores` : `/api/quiz/scores`;
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting all quiz scores:', error);
    }
  };

  const renderStars = (count: number) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= count ? 'star' : 'star-outline'}
            size={24}
            color={star <= count ? '#FEC11B' : '#666'}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FEC11B" />
          <Text style={styles.loadingText}>Loading feedback...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FEC11B"
            colors={['#FEC11B']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Ionicons name="analytics" size={40} color="#FEC11B" />
            <View style={styles.clockContainer}>
              <Ionicons name="time" size={16} color="#FEC11B" />
              <Text style={styles.clockText}>{formatTime(currentTime)}</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Feedback Dashboard</Text>
          <Text style={styles.headerSubtitle}>INOVIX Customer Portal</Text>
        </View>

        {/* Statistics */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total_ratings}</Text>
              <Text style={styles.statLabel}>Total Ratings</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.average_stars.toFixed(1)}</Text>
              <View style={styles.starsRow}>
                {renderStars(Math.round(stats.average_stars))}
              </View>
              <Text style={styles.statLabel}>Average</Text>
            </View>
          </View>
        )}

        {/* Star Distribution */}
        {stats && (
          <View style={styles.distributionContainer}>
            <Text style={styles.sectionTitle}>Rating Distribution</Text>
            {[5, 4, 3, 2, 1].map((star) => (
              <View key={star} style={styles.distributionRow}>
                <Text style={styles.distributionStar}>{star} ★</Text>
                <View style={styles.distributionBar}>
                  <View
                    style={[
                      styles.distributionFill,
                      {
                        width: stats.total_ratings > 0
                          ? `${(stats.star_distribution[star] / stats.total_ratings) * 100}%`
                          : '0%',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.distributionCount}>
                  {stats.star_distribution[star]}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Quiz Results Section */}
        {quizStats && quizStats.total_attempts > 0 && (
          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>
              🏆 INOVIX Quiz Arena Results
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{quizStats.total_attempts}</Text>
                <Text style={styles.statLabel}>Total Attempts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{quizStats.average_score}%</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{quizStats.highest_score}%</Text>
                <Text style={styles.statLabel}>Highest Score</Text>
              </View>
            </View>

            <View style={styles.quizScoresContainer}>
              <View style={styles.subsectionHeader}>
                <Text style={styles.subsectionTitle}>Recent Quiz Scores</Text>
                {quizScores.length > 0 && (
                  <TouchableOpacity
                    style={styles.deleteAllButton}
                    onPress={handleDeleteAllQuizScores}
                  >
                    <Ionicons name="trash" size={18} color="#FF6B6B" />
                    <Text style={styles.deleteAllText}>Delete All</Text>
                  </TouchableOpacity>
                )}
              </View>
              {quizScores.slice(0, 10).map((score) => (
                <View key={score.id} style={styles.quizScoreCard}>
                  <View style={styles.quizScoreHeader}>
                    <View style={styles.quizScoreBadge}>
                      <Text style={styles.quizScorePercentage}>{score.score}%</Text>
                    </View>
                    <View style={styles.quizScoreDetails}>
                      <Text style={styles.quizScoreText}>
                        {score.correct_answers} / {score.total_questions} correct
                      </Text>
                      <Text style={styles.quizScoreTime}>
                        {formatDate(score.timestamp)}
                      </Text>
                    </View>
                    <Ionicons
                      name={score.score >= 80 ? 'trophy' : score.score >= 60 ? 'checkmark-circle' : 'close-circle'}
                      size={24}
                      color={score.score >= 80 ? '#FEC11B' : score.score >= 60 ? '#4CAF50' : '#FF6B6B'}
                    />
                    <TouchableOpacity
                      style={styles.deleteIconButton}
                      onPress={() => handleDeleteQuizScore(score.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ratings List */}
        <View style={styles.ratingsContainer}>
          <View style={styles.subsectionHeader}>
            <Text style={styles.sectionTitle}>
              All Feedback ({ratings.length})
            </Text>
            {ratings.length > 0 && (
              <TouchableOpacity
                style={styles.deleteAllButton}
                onPress={handleDeleteAllRatings}
              >
                <Ionicons name="trash" size={18} color="#FF6B6B" />
                <Text style={styles.deleteAllText}>Delete All</Text>
              </TouchableOpacity>
            )}
          </View>

          {ratings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={60} color="#666" />
              <Text style={styles.emptyText}>No feedback yet</Text>
              <Text style={styles.emptySubtext}>
                Ratings will appear here when customers submit them
              </Text>
            </View>
          ) : (
            ratings.map((rating) => (
              <View key={rating.id} style={styles.ratingCard}>
                {/* Rating Header */}
                <View style={styles.ratingHeader}>
                  <View style={styles.ratingHeaderLeft}>
                    {renderStars(rating.stars)}
                    <Text style={styles.ratingDate}>
                      {formatDate(rating.timestamp)}
                    </Text>
                  </View>
                  <View style={styles.ratingHeaderRight}>
                    {rating.comment || rating.photo ? (
                      <TouchableOpacity
                        onPress={() =>
                          setExpandedId(expandedId === rating.id ? null : rating.id)
                        }
                      >
                        <Ionicons
                          name={
                            expandedId === rating.id
                              ? 'chevron-up'
                              : 'chevron-down'
                          }
                          size={24}
                          color="#FEC11B"
                        />
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={styles.deleteIconButton}
                      onPress={() => handleDeleteRating(rating.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Company */}
                {rating.company && (
                  <View style={styles.companyRow}>
                    <Ionicons name="business" size={16} color="#FEC11B" />
                    <Text style={styles.companyText}>{rating.company}</Text>
                  </View>
                )}

                {/* Expanded Content */}
                {expandedId === rating.id && (
                  <View style={styles.expandedContent}>
                    {rating.comment && (
                      <View style={styles.commentSection}>
                        <Text style={styles.commentLabel}>Comment:</Text>
                        <Text style={styles.commentText}>{rating.comment}</Text>
                      </View>
                    )}

                    {rating.photo && (
                      <View style={styles.photoSection}>
                        <Text style={styles.photoLabel}>Photo:</Text>
                        <Image
                          source={{ uri: rating.photo }}
                          style={styles.ratingPhoto}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232426',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#FEC11B',
    marginTop: 16,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#1a1b1d',
    borderBottomWidth: 2,
    borderBottomColor: '#FEC11B',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1B1B1B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEC11B',
  },
  clockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEC11B',
    fontFamily: 'monospace',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#3a3b3d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  statLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
  },
  distributionContainer: {
    padding: 16,
    backgroundColor: '#3a3b3d',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a4b4d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginBottom: 16,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  distributionStar: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 40,
  },
  distributionBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#2a2b2d',
    borderRadius: 10,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    backgroundColor: '#FEC11B',
  },
  distributionCount: {
    fontSize: 14,
    color: '#CCCCCC',
    width: 30,
    textAlign: 'right',
  },
  ratingsContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  ratingCard: {
    backgroundColor: '#3a3b3d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4a4b4d',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingHeaderLeft: {
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  ratingDate: {
    fontSize: 12,
    color: '#999',
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  companyText: {
    fontSize: 14,
    color: '#FEC11B',
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4a4b4d',
  },
  commentSection: {
    marginBottom: 16,
  },
  commentLabel: {
    fontSize: 14,
    color: '#FEC11B',
    fontWeight: '600',
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  photoSection: {
    marginTop: 8,
  },
  photoLabel: {
    fontSize: 14,
    color: '#FEC11B',
    fontWeight: '600',
    marginBottom: 8,
  },
  ratingPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  quizSection: {
    padding: 16,
    backgroundColor: '#1B1B1B',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginBottom: 12,
    marginTop: 16,
  },
  quizScoresContainer: {
    marginTop: 8,
  },
  quizScoreCard: {
    backgroundColor: '#232426',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3b3d',
  },
  quizScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quizScoreBadge: {
    backgroundColor: '#FEC11B',
    borderRadius: 8,
    padding: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  quizScorePercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  quizScoreDetails: {
    flex: 1,
  },
  quizScoreText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quizScoreTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2a2b2d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  deleteAllText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  deleteIconButton: {
    padding: 8,
  },
  ratingHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
