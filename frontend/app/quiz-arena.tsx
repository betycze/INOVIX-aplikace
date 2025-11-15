import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    question: 'Který produkt od Applu byl nejprodávanější na Vánoce 2024?',
    options: ['Apple Watch Series 9', 'AirPods (3. generace)', 'iPhone 15', 'Apple TV 4K'],
    correctIndex: 1
  },
  {
    question: 'Který člověk založil Microsoft?',
    options: ['Steve Jobs', 'Mark Zuckerberg', 'Bill Gates', 'Tim Cook'],
    correctIndex: 2
  },
  {
    question: 'Co znamenají jedničky a nuly ve světě elektroniky?',
    options: ['Dvě různé síťové frekvence', 'Reprezentace stavů napětí – zapnuto/vypnuto', 'Počet vodičů v obvodu', 'Typy elektronických čipů'],
    correctIndex: 1
  },
  {
    question: 'Jak se jmenuje první video na YouTube vůbec?',
    options: ['Times Square', 'Me at the Zoo', 'Google Campus', 'San Francisco Pier'],
    correctIndex: 1
  },
  {
    question: 'Co je to phishing?',
    options: ['vysokorychlostní připojení', 'hledání chyb', 'podvodný pokus získat údaje', 'test výkonnosti'],
    correctIndex: 2
  },
  {
    question: 'Který jazyk slouží ke stylování webu?',
    options: ['JavaScript', 'Python', 'CSS', 'HTML'],
    correctIndex: 2
  },
  {
    question: 'Co měří Hertz u monitoru?',
    options: ['rozlišení', 'jas', 'kontrast', 'počet překreslení za sekundu'],
    correctIndex: 3
  },
  {
    question: 'Které zařízení je výstupní?',
    options: ['Klávesnice', 'Myš', 'Monitor', 'Mikrofon'],
    correctIndex: 2
  },
  {
    question: 'Co znamená cloud?',
    options: ['počítačový virus', 'sdílené online úložiště', 'typ procesoru', 'grafická karta'],
    correctIndex: 1
  },
  {
    question: 'Co znamená rychlost „100 Mbps"?',
    options: ['100 megabajtů za sekundu', '100 megabitů za sekundu včetně overheadu', '100 milionů paketů', '100 MHz frekvence'],
    correctIndex: 1
  },
  {
    question: 'Co označuje open source?',
    options: ['uzavřený software', 'veřejně dostupný zdrojový kód', 'placený program', 'antivirový program'],
    correctIndex: 1
  },
  {
    question: 'Který kabel přenáší obraz?',
    options: ['HDMI', 'USB-C (pouze data)', 'Ethernet', 'Audio jack'],
    correctIndex: 0
  },
  {
    question: 'Kdo vlastní YouTube?',
    options: ['Facebook', 'Microsoft', 'Google', 'Amazon'],
    correctIndex: 2
  },
  {
    question: 'Kolik bitů má IPv6 adresa?',
    options: ['32', '64', '128', '256'],
    correctIndex: 2
  },
  {
    question: 'Za co byla udělena Nobelova cena související s informatikou?',
    options: ['hardware', 'operační systémy', 'databáze', 'programový kód / neuronové sítě'],
    correctIndex: 3
  }
];

type Screen = 'start' | 'quiz' | 'feedback' | 'results' | 'name-input' | 'leaderboard';

interface LeaderboardEntry {
  rank: number;
  name: string;
  correct_answers: number;
  total_questions: number;
  average_time: number;
}

export default function QuizArena() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answerTimes, setAnswerTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isCorrect, setIsCorrect] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Timer countdown
  useEffect(() => {
    if (screen === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (screen === 'quiz' && timeLeft === 0) {
      // Time's up - treat as wrong answer
      handleAnswer(-1);
    }
  }, [timeLeft, screen]);

  // Start question timer
  useEffect(() => {
    if (screen === 'quiz') {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, screen]);

  const handleStart = () => {
    setScreen('quiz');
    setCurrentQuestion(0);
    setCorrectAnswers(0);
    setTimeLeft(15);
    setAnswerTimes([]);
  };

  const handleAnswer = (answerIndex: number) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setAnswerTimes([...answerTimes, timeTaken]);
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === QUESTIONS[currentQuestion].correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    // Show feedback
    setScreen('feedback');
    
    // Animate feedback
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Auto advance to next question or results
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(15);
        setSelectedAnswer(null);
        setScreen('quiz');
      } else {
        // Quiz finished - show results
        showResults();
      }
    }, 2000);
  };

  const showResults = async () => {
    setScreen('results');
    
    // Fetch stats for comparison
    try {
      const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/quiz-arena/stats`);
      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmitName = async () => {
    if (!playerName.trim()) {
      alert('Zadej prosím své jméno!');
      return;
    }
    
    const avgTime = answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length;
    
    try {
      const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/quiz-arena/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName.trim(),
          correct_answers: correctAnswers,
          total_questions: QUESTIONS.length,
          average_time: avgTime
        })
      });
      
      if (response.ok) {
        // Fetch leaderboard
        await fetchLeaderboard();
        setScreen('leaderboard');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Chyba při ukládání výsledku');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || '';
      const response = await fetch(`${backendUrl}/api/quiz-arena/leaderboard`);
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const avgAnswerTime = answerTimes.length > 0 
    ? answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length 
    : 0;

  const successRate = ((correctAnswers / QUESTIONS.length) * 100).toFixed(1);

  // START SCREEN
  if (screen === 'start') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FEC11B" />
        </TouchableOpacity>
        
        <View style={styles.startContainer}>
          <View style={styles.titleContainer}>
            <Ionicons name="flash" size={48} color="#FEC11B" />
            <Text style={styles.title}>INOVIX QUIZ ARENA</Text>
            <Ionicons name="flash" size={48} color="#FEC11B" />
          </View>
          <Text style={styles.subtitle}>Dokážeš odpovědět na všech 15 otázek?</Text>
          
          <View style={styles.rulesBox}>
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="help-circle-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>15 otázek</Text>
            </View>
            
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="timer-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>15 sekund na odpověď</Text>
            </View>
            
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="trophy-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>Buď mezi nejlepšími!</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Ionicons name="play" size={28} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.startButtonText}>SPUSTIT KVÍZ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // QUIZ SCREEN
  if (screen === 'quiz') {
    return (
      <View style={styles.container}>
        <View style={styles.quizHeader}>
          <Text style={styles.questionNumber}>
            Otázka {currentQuestion + 1}/{QUESTIONS.length}
          </Text>
          <View style={styles.timerContainer}>
            <Text style={[styles.timer, timeLeft <= 5 && styles.timerWarning]}>
              {timeLeft}s
            </Text>
          </View>
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.question}>{QUESTIONS[currentQuestion].question}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {QUESTIONS[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                index === 0 && styles.option1,
                index === 1 && styles.option2,
                index === 2 && styles.option3,
                index === 3 && styles.option4,
              ]}
              onPress={() => handleAnswer(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // FEEDBACK SCREEN
  if (screen === 'feedback') {
    return (
      <View style={[styles.container, isCorrect ? styles.correctBg : styles.incorrectBg]}>
        <Animated.View style={[styles.feedbackContainer, { transform: [{ scale: scaleAnim }] }]}>
          {isCorrect ? (
            <>
              <Text style={styles.feedbackIcon}>✅</Text>
              <Text style={styles.feedbackText}>SPRÁVNĚ!</Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackIcon}>❌</Text>
              <Text style={styles.feedbackText}>ŠPATNĚ</Text>
              <Text style={styles.correctAnswerText}>
                Správně: {QUESTIONS[currentQuestion].options[QUESTIONS[currentQuestion].correctIndex]}
              </Text>
            </>
          )}
        </Animated.View>
      </View>
    );
  }

  // RESULTS SCREEN
  if (screen === 'results') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>🎉 DOKONČENO! 🎉</Text>
        
        <View style={styles.statsBox}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{correctAnswers}/{QUESTIONS.length}</Text>
            <Text style={styles.statLabel}>Správné odpovědi</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{avgAnswerTime.toFixed(1)}s</Text>
            <Text style={styles.statLabel}>Průměrný čas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{successRate}%</Text>
            <Text style={styles.statLabel}>Úspěšnost</Text>
          </View>
        </View>
        
        {stats && (
          <View style={styles.comparisonBox}>
            <Text style={styles.comparisonTitle}>📊 Porovnání s ostatními</Text>
            <Text style={styles.comparisonText}>
              Průměrný čas: {stats.median_time.toFixed(1)}s
              {avgAnswerTime < stats.median_time ? ' (Jsi rychlejší! 🚀)' : ' (Můžeš být rychlejší)'}
            </Text>
            <Text style={styles.comparisonText}>
              Průměrná úspěšnost: {stats.average_success_rate}%
              {parseFloat(successRate) > stats.average_success_rate ? ' (Lepší než průměr! 🎯)' : ''}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.continueButton} onPress={() => setScreen('name-input')}>
          <Text style={styles.continueButtonText}>Pokračovat →</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // NAME INPUT SCREEN
  if (screen === 'name-input') {
    return (
      <View style={styles.container}>
        <View style={styles.nameInputContainer}>
          <Text style={styles.nameInputTitle}>🏆 Žebříček nejlepších</Text>
          <Text style={styles.nameInputSubtitle}>Zadej jméno, pokud chceš být v žebříčku</Text>
          
          <TextInput
            style={styles.nameInput}
            placeholder="Tvoje jméno"
            placeholderTextColor="#888"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />
          
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitName}>
            <Text style={styles.submitButtonText}>Uložit výsledek</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={async () => {
              await fetchLeaderboard();
              setScreen('leaderboard');
            }}
          >
            <Text style={styles.skipButtonText}>Přeskočit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // LEADERBOARD SCREEN
  if (screen === 'leaderboard') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>🏆 TOP 10 ŽEBŘÍČEK</Text>
        
        {leaderboard.length === 0 ? (
          <Text style={styles.noDataText}>Zatím žádné výsledky</Text>
        ) : (
          leaderboard.map((entry) => (
            <View key={entry.rank} style={[
              styles.leaderboardItem,
              entry.rank === 1 && styles.firstPlace,
              entry.rank === 2 && styles.secondPlace,
              entry.rank === 3 && styles.thirdPlace,
            ]}>
              <Text style={styles.rank}>#{entry.rank}</Text>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{entry.name}</Text>
                <Text style={styles.playerStats}>
                  {entry.correct_answers}/{entry.total_questions} správně • {entry.average_time.toFixed(1)}s avg
                </Text>
              </View>
              {entry.rank <= 3 && (
                <Text style={styles.medal}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </Text>
              )}
            </View>
          ))
        )}
        
        <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
          <Text style={styles.homeButtonText}>← Zpět na hlavní stránku</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232426',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  
  // START SCREEN
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  rulesBox: {
    backgroundColor: '#1a1b1d',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEC11B',
    marginBottom: 40,
  },
  ruleText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#FEC11B',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 50,
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  startButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  
  // QUIZ SCREEN
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  timerContainer: {
    backgroundColor: '#FEC11B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerWarning: {
    color: '#FF0000',
  },
  questionContainer: {
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  optionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  option1: {
    backgroundColor: '#E21B3C',
  },
  option2: {
    backgroundColor: '#1368CE',
  },
  option3: {
    backgroundColor: '#D89E00',
  },
  option4: {
    backgroundColor: '#26890C',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  // FEEDBACK SCREEN
  correctBg: {
    backgroundColor: '#26890C',
  },
  incorrectBg: {
    backgroundColor: '#E21B3C',
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackIcon: {
    fontSize: 120,
    marginBottom: 24,
  },
  feedbackText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  correctAnswerText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 24,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  
  // RESULTS SCREEN
  resultsContainer: {
    padding: 20,
    paddingTop: 60,
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  comparisonBox: {
    backgroundColor: '#1a1b1d',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEC11B',
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginBottom: 16,
  },
  comparisonText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#FEC11B',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  
  // NAME INPUT SCREEN
  nameInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  nameInputTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 16,
  },
  nameInputSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  nameInput: {
    backgroundColor: '#1a1b1d',
    borderWidth: 2,
    borderColor: '#FEC11B',
    borderRadius: 12,
    padding: 20,
    fontSize: 20,
    color: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FEC11B',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#FEC11B',
    textDecorationLine: 'underline',
  },
  
  // LEADERBOARD SCREEN
  leaderboardContainer: {
    padding: 20,
    paddingTop: 60,
  },
  leaderboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 24,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1b1d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3a3b3d',
  },
  firstPlace: {
    borderColor: '#FFD700',
    backgroundColor: '#2a2416',
  },
  secondPlace: {
    borderColor: '#C0C0C0',
    backgroundColor: '#252525',
  },
  thirdPlace: {
    borderColor: '#CD7F32',
    backgroundColor: '#2a2216',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    width: 50,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  playerStats: {
    fontSize: 14,
    color: '#888',
  },
  medal: {
    fontSize: 32,
  },
  homeButton: {
    backgroundColor: '#1a1b1d',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
});
