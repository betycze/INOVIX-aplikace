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
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuestionData {
  question: { cs: string; en: string };
  options: { cs: string[]; en: string[] };
  correctIndex: number;
}

const QUESTIONS_DATA: QuestionData[] = [
  {
    question: {
      cs: 'Který produkt od Applu byl v roce 2024 jedním z nejpopulárnějších vánočních dárků?',
      en: 'Which Apple product was one of the most popular Christmas gifts in 2024?'
    },
    options: {
      cs: ['iPhone', 'AirPods', 'Apple Watch', 'iPad'],
      en: ['iPhone', 'AirPods', 'Apple Watch', 'iPad']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Který člověk založil Microsoft?',
      en: 'Who founded Microsoft?'
    },
    options: {
      cs: ['Steve Jobs', 'Mark Zuckerberg', 'Bill Gates', 'Tim Cook'],
      en: ['Steve Jobs', 'Mark Zuckerberg', 'Bill Gates', 'Tim Cook']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Koupíš si disk s kapacitou 2 TB. Kolik je to přibližně gigabajtů (GB)?',
      en: 'You buy a 2 TB disk. How many gigabytes (GB) is that approximately?'
    },
    options: {
      cs: ['1 000 GB', '1 024 GB', '2 000 GB', '2 048 GB'],
      en: ['1,000 GB', '1,024 GB', '2,000 GB', '2,048 GB']
    },
    correctIndex: 3
  },
  {
    question: {
      cs: 'Jak se jmenuje první video na YouTube vůbec?',
      en: 'What is the name of the very first video on YouTube?'
    },
    options: {
      cs: ['Times Square', 'Me at the Zoo', 'Google Campus', 'San Francisco Pier'],
      en: ['Times Square', 'Me at the Zoo', 'Google Campus', 'San Francisco Pier']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Co je to phishing?',
      en: 'What is phishing?'
    },
    options: {
      cs: ['vysokorychlostní připojení', 'hledání chyb', 'podvodný pokus získat údaje', 'test výkonnosti'],
      en: ['high-speed connection', 'bug hunting', 'fraudulent attempt to obtain data', 'performance test']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Který jazyk slouží ke stylování webu?',
      en: 'Which language is used for web styling?'
    },
    options: {
      cs: ['JavaScript', 'Python', 'CSS', 'HTML'],
      en: ['JavaScript', 'Python', 'CSS', 'HTML']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Co měří Hertz u monitoru?',
      en: 'What does Hertz measure on a monitor?'
    },
    options: {
      cs: ['rozlišení', 'jas', 'kontrast', 'počet překreslení za sekundu'],
      en: ['resolution', 'brightness', 'contrast', 'refresh rate per second']
    },
    correctIndex: 3
  },
  {
    question: {
      cs: 'Které zařízení je výstupní?',
      en: 'Which device is an output device?'
    },
    options: {
      cs: ['Klávesnice', 'Myš', 'Monitor', 'Mikrofon'],
      en: ['Keyboard', 'Mouse', 'Monitor', 'Microphone']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Co znamená cloud?',
      en: 'What does cloud mean?'
    },
    options: {
      cs: ['počítačový virus', 'sdílené online úložiště', 'typ procesoru', 'grafická karta'],
      en: ['computer virus', 'shared online storage', 'processor type', 'graphics card']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Co znamená rychlost „100 Mbps"?',
      en: 'What does "100 Mbps" speed mean?'
    },
    options: {
      cs: ['100 megabajtů za sekundu', '100 megabitů za sekundu včetně overheadu', '100 milionů paketů', '100 MHz frekvence'],
      en: ['100 megabytes per second', '100 megabits per second including overhead', '100 million packets', '100 MHz frequency']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Co označuje open source?',
      en: 'What does open source mean?'
    },
    options: {
      cs: ['uzavřený software', 'veřejně dostupný zdrojový kód', 'placený program', 'antivirový program'],
      en: ['closed software', 'publicly available source code', 'paid program', 'antivirus program']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Který kabel přenáší obraz?',
      en: 'Which cable transmits video?'
    },
    options: {
      cs: ['HDMI', 'USB-C (pouze data)', 'Ethernet', 'Audio jack'],
      en: ['HDMI', 'USB-C (data only)', 'Ethernet', 'Audio jack']
    },
    correctIndex: 0
  },
  {
    question: {
      cs: 'Která firma prodávající reproduktory uvádí obrat cca 10,5 mld USD za rok 2024?',
      en: 'Which speaker company reports approximately $10.5 billion USD revenue for 2024?'
    },
    options: {
      cs: ['Sonos', 'Bose', 'Harman International', 'JBL'],
      en: ['Sonos', 'Bose', 'Harman International', 'JBL']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Kdo vlastní YouTube?',
      en: 'Who owns YouTube?'
    },
    options: {
      cs: ['Facebook', 'Microsoft', 'Google', 'Amazon'],
      en: ['Facebook', 'Microsoft', 'Google', 'Amazon']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Kolik bitů má IPv6 adresa?',
      en: 'How many bits does an IPv6 address have?'
    },
    options: {
      cs: ['32', '64', '128', '256'],
      en: ['32', '64', '128', '256']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Za co byla udělena Nobelova cena související s informatikou?',
      en: 'What was the Nobel Prize related to computer science awarded for?'
    },
    options: {
      cs: ['hardware', 'operační systémy', 'databáze', 'programový kód / neuronové sítě'],
      en: ['hardware', 'operating systems', 'databases', 'code / neural networks']
    },
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
  const { language } = useLanguage();
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
  const glowAnim = useRef(new Animated.Value(1)).current;

  // Get questions based on language
  const QUESTIONS: Question[] = QUESTIONS_DATA.map(q => ({
    question: language === 'cs' ? q.question.cs : q.question.en,
    options: language === 'cs' ? q.options.cs : q.options.en,
    correctIndex: q.correctIndex
  }));

  // Translations
  const t = {
    title: language === 'cs' ? 'INOVIX QUIZ ARENA' : 'INOVIX QUIZ ARENA',
    subtitle: language === 'cs' ? 'Dokážeš odpovědět na všech 15 otázek?' : 'Can you answer all 15 questions?',
    rule1: language === 'cs' ? '15 otázek' : '15 questions',
    rule2: language === 'cs' ? '15 sekund na odpověď' : '15 seconds per answer',
    rule3: language === 'cs' ? 'Buď mezi nejlepšími!' : 'Be among the best!',
    startButton: language === 'cs' ? 'SPUSTIT KVÍZ' : 'START QUIZ',
    question: language === 'cs' ? 'Otázka' : 'Question',
    skipQuestion: language === 'cs' ? 'Přeskočit otázku' : 'Skip Question',
    correct: language === 'cs' ? 'SPRÁVNĚ!' : 'CORRECT!',
    incorrect: language === 'cs' ? 'ŠPATNĚ' : 'INCORRECT',
    correctAnswer: language === 'cs' ? 'Správně:' : 'Correct:',
    completed: language === 'cs' ? 'DOKONČENO!' : 'COMPLETED!',
    correctAnswers: language === 'cs' ? 'Správné odpovědi' : 'Correct Answers',
    averageTime: language === 'cs' ? 'Průměrný čas' : 'Average Time',
    successRate: language === 'cs' ? 'Úspěšnost' : 'Success Rate',
    comparisonTitle: language === 'cs' ? 'Porovnání s ostatními' : 'Comparison with Others',
    medianTime: language === 'cs' ? 'Průměrný čas:' : 'Median Time:',
    fasterThanAverage: language === 'cs' ? '(Jsi rychlejší! 🚀)' : '(You are faster! 🚀)',
    slowerPrompt: language === 'cs' ? '(Můžeš být rychlejší)' : '(You can be faster)',
    averageSuccess: language === 'cs' ? 'Průměrná úspěšnost:' : 'Average Success:',
    betterThanAverage: language === 'cs' ? '(Lepší než průměr! 🎯)' : '(Better than average! 🎯)',
    continue: language === 'cs' ? 'Pokračovat →' : 'Continue →',
    leaderboardTitle: language === 'cs' ? 'Žebříček nejlepších' : 'Best Players',
    enterName: language === 'cs' ? 'Zadej jméno, pokud chceš být v žebříčku' : 'Enter your name to be on the leaderboard',
    yourName: language === 'cs' ? 'Tvoje jméno' : 'Your Name',
    saveResult: language === 'cs' ? 'Uložit výsledek' : 'Save Result',
    skip: language === 'cs' ? 'Přeskočit' : 'Skip',
    topLeaderboard: language === 'cs' ? 'TOP 10 ŽEBŘÍČEK' : 'TOP 10 LEADERBOARD',
    noResults: language === 'cs' ? 'Zatím žádné výsledky' : 'No results yet',
    correctly: language === 'cs' ? 'správně' : 'correct',
    backToHome: language === 'cs' ? 'Zpět na hlavní stránku' : 'Back to Home',
  };

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

  // Animate title on start screen
  useEffect(() => {
    if (screen === 'start') {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      
      // Pulsating glow effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1.3,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [screen]);

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
          <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>{t.title}</Text>
          </Animated.View>
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          
          <View style={styles.rulesBox}>
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="help-circle-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>{t.rule1}</Text>
            </View>
            
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="timer-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>{t.rule2}</Text>
            </View>
            
            <View style={styles.ruleItem}>
              <View style={styles.ruleIconContainer}>
                <Ionicons name="trophy-outline" size={32} color="#FEC11B" />
              </View>
              <Text style={styles.ruleText}>{t.rule3}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Ionicons name="play" size={28} color="#000000" style={{ marginRight: 8 }} />
            <Text style={styles.startButtonText}>{t.startButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // QUIZ SCREEN
  if (screen === 'quiz') {
    const progressPercentage = ((15 - timeLeft) / 15) * 100;
    
    return (
      <View style={styles.container}>
        <View style={styles.quizTopBar}>
          <Text style={styles.quizTitle}>INOVIX QUIZ ARENA</Text>
        </View>
        
        <View style={styles.quizHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.questionNumber}>
              {t.question} {currentQuestion + 1}/{QUESTIONS.length}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.skipButtonTop} 
            onPress={() => handleAnswer(-1)}
          >
            <Ionicons name="play-skip-forward-outline" size={20} color="#FEC11B" />
            <Text style={styles.skipButtonTopText}>{t.skipQuestion}</Text>
          </TouchableOpacity>
          
          <View style={styles.timerBox}>
            <View style={styles.timerCircle}>
              <Ionicons name="time-outline" size={24} color={timeLeft <= 5 ? '#FF0000' : '#FEC11B'} />
              <Text style={[styles.timer, timeLeft <= 5 && styles.timerWarning]}>
                {timeLeft}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` },
                  timeLeft <= 5 && styles.progressWarning
                ]} 
              />
            </View>
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
        <View style={styles.leaderboardHeader}>
          <Ionicons name="trophy" size={48} color="#FEC11B" />
          <Text style={styles.leaderboardTitle}>TOP 10 ŽEBŘÍČEK</Text>
        </View>
        
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
              <View style={[
                styles.rankBadge,
                entry.rank === 1 && styles.rank1Badge,
                entry.rank === 2 && styles.rank2Badge,
                entry.rank === 3 && styles.rank3Badge,
              ]}>
                <Text style={[
                  styles.rankText,
                  entry.rank <= 3 && styles.rankTextTop
                ]}>
                  {entry.rank}
                </Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{entry.name}</Text>
                <Text style={styles.playerStats}>
                  {entry.correct_answers}/{entry.total_questions} správně • {entry.average_time.toFixed(1)}s avg
                </Text>
              </View>
              {entry.rank <= 3 && (
                <View style={styles.crownContainer}>
                  <Ionicons 
                    name="ribbon" 
                    size={32} 
                    color={entry.rank === 1 ? '#FFD700' : entry.rank === 2 ? '#C0C0C0' : '#CD7F32'} 
                  />
                </View>
              )}
            </View>
          ))
        )}
        
        <TouchableOpacity style={styles.homeButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FEC11B" style={{ marginRight: 8 }} />
          <Text style={styles.homeButtonText}>Zpět na hlavní stránku</Text>
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
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: '#FEC11B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  rulesBox: {
    backgroundColor: '#1a1b1d',
    padding: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEC11B',
    marginBottom: 40,
    gap: 24,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ruleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#232426',
    borderWidth: 2,
    borderColor: '#FEC11B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleText: {
    fontSize: 18,
    color: '#FFFFFF',
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#FEC11B',
    paddingVertical: 20,
    paddingHorizontal: 48,
    borderRadius: 50,
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  
  // QUIZ SCREEN
  quizTopBar: {
    paddingTop: 50,
    paddingBottom: 16,
    alignItems: 'center',
    backgroundColor: '#1a1b1d',
    borderBottomWidth: 2,
    borderBottomColor: '#FEC11B',
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    letterSpacing: 2,
    textShadowColor: '#FEC11B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
  },
  headerLeft: {
    flex: 1,
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  timerBox: {
    alignItems: 'center',
    gap: 8,
  },
  timerCircle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1a1b1d',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  timerWarning: {
    color: '#FF0000',
  },
  progressBar: {
    width: 100,
    height: 6,
    backgroundColor: '#1a1b1d',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FEC11B',
  },
  progressWarning: {
    backgroundColor: '#FF0000',
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
  skipButton: {
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#FEC11B',
    textDecorationLine: 'underline',
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
    letterSpacing: 2,
    textShadowColor: '#FEC11B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
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
    letterSpacing: 1,
    textShadowColor: '#FEC11B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
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
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  leaderboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: '#FEC11B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
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
  rankBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1b1d',
    borderWidth: 2,
    borderColor: '#FEC11B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rank1Badge: {
    borderColor: '#FFD700',
    backgroundColor: '#2a2416',
  },
  rank2Badge: {
    borderColor: '#C0C0C0',
    backgroundColor: '#252525',
  },
  rank3Badge: {
    borderColor: '#CD7F32',
    backgroundColor: '#2a2216',
  },
  rankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  rankTextTop: {
    color: '#FFFFFF',
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
  crownContainer: {
    marginLeft: 8,
  },
  homeButton: {
    flexDirection: 'row',
    backgroundColor: '#1a1b1d',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
