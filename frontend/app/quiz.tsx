import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

interface Question {
  question: { cs: string; en: string };
  options: { cs: string[]; en: string[] };
  correctIndex: number;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: {
      cs: 'Jaká jednotka měří elektrický odpor?',
      en: 'Which unit measures electrical resistance?'
    },
    options: {
      cs: ['Volt', 'Ampér', 'Ohm', 'Watt'],
      en: ['Volt', 'Ampere', 'Ohm', 'Watt']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Co se stane, když připojíte LED diodu obráceně?',
      en: 'What happens if you connect an LED backwards?'
    },
    options: {
      cs: ['Vybuchne', 'Svítí jasněji', 'Nebude svítit', 'Bude blikat'],
      en: ['It explodes', 'Shines brighter', 'Won\'t light up', 'Will blink']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Tři baterie 1,5 V zapojené v sérii dají dohromady kolik voltů?',
      en: 'Three 1.5 V batteries in series give how many volts?'
    },
    options: {
      cs: ['1,5 V', '3 V', '4,5 V', '6 V'],
      en: ['1.5 V', '3 V', '4.5 V', '6 V']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'Který prvek se nejvíce používá v polovodičích?',
      en: 'Which element is most used in semiconductors?'
    },
    options: {
      cs: ['Měď', 'Křemík', 'Zlato', 'Uhlík'],
      en: ['Copper', 'Silicon', 'Gold', 'Carbon']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Jaký je klíčový rozdíl mezi SSD a HDD?',
      en: 'What\'s the key difference between SSD and HDD?'
    },
    options: {
      cs: ['SSD je levnější', 'SSD má větší kapacitu', 'SSD je rychlejší a nemá pohyblivé části', 'HDD je rychlejší'],
      en: ['SSD is cheaper', 'SSD has larger capacity', 'SSD is faster and has no moving parts', 'HDD is faster']
    },
    correctIndex: 2
  },
  {
    question: {
      cs: 'V sériovém obvodu, když se rozbije jedna žárovka, ostatní...',
      en: 'In a series circuit, if one bulb breaks, the others...'
    },
    options: {
      cs: ['Zhasnou', 'Svítí dál', 'Svítí jasněji', 'Blikají'],
      en: ['Turn off', 'Keep shining', 'Shine brighter', 'Blink']
    },
    correctIndex: 0
  },
  {
    question: {
      cs: 'Co dělá tranzistor?',
      en: 'What does a transistor do?'
    },
    options: {
      cs: ['Ukládá energii', 'Zesiluje nebo spíná signál', 'Měří teplotu', 'Generuje světlo'],
      en: ['Stores energy', 'Amplifies or switches a signal', 'Measures temperature', 'Generates light']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Kolik bitů je v jednom bajtu?',
      en: 'How many bits are in one byte?'
    },
    options: {
      cs: ['4', '8', '16', '32'],
      en: ['4', '8', '16', '32']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Zvýšení impedance sluchátek znamená...',
      en: 'Increasing headphone impedance means...'
    },
    options: {
      cs: ['Horší kvalita zvuku', 'Potřebuje více energie pro stejnou hlasitost', 'Levnější sluchátka', 'Automatické vypnutí'],
      en: ['Worse sound quality', 'Needs more power for same volume', 'Cheaper headphones', 'Automatic shutdown']
    },
    correctIndex: 1
  },
  {
    question: {
      cs: 'Pokud se napětí zdvojnásobí, ale odpor zůstane stejný, proud...',
      en: 'If voltage doubles but resistance stays the same, current...'
    },
    options: {
      cs: ['Zůstane stejný', 'Zdvojnásobí se', 'Sníží se na polovinu', 'Ztrojnásobí se'],
      en: ['Stays the same', 'Doubles', 'Halves', 'Triples']
    },
    correctIndex: 1
  },
];

export default function QuizScreen() {
  const { language, t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [percentile, setPercentile] = useState(0);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

  const handleSelectAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === QUIZ_QUESTIONS[index].correctIndex) {
        correct++;
      }
    });
    return {
      correct,
      percentage: Math.round((correct / QUIZ_QUESTIONS.length) * 100)
    };
  };

  const handleFinish = async () => {
    setSubmitting(true);
    const { correct, percentage } = calculateScore();

    try {
      const apiUrl = BACKEND_URL ? `${BACKEND_URL}/api/quiz/submit` : '/api/quiz/submit';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: percentage,
          total_questions: QUIZ_QUESTIONS.length,
          correct_answers: correct,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPercentile(data.percentile);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setShowCorrectAnswers(false);
    setPercentile(0);
  };

  const getFeedbackMessage = (percentage: number) => {
    if (percentage >= 80) return t('excellent');
    if (percentage >= 60) return t('goodJob');
    return t('tryAgain');
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const { correct, percentage } = calculateScore();

  if (showResults) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.resultsContainer}>
          <Ionicons 
            name={percentage >= 80 ? 'trophy' : percentage >= 60 ? 'checkmark-circle' : 'refresh-circle'}
            size={80} 
            color="#FEC11B" 
          />
          <Text style={styles.resultsTitle}>{getFeedbackMessage(percentage)}</Text>
          <Text style={styles.scoreText}>{t('yourScore')}</Text>
          <Text style={styles.scoreValue}>{percentage}%</Text>
          <Text style={styles.correctCount}>{correct} / {QUIZ_QUESTIONS.length} {t('correct')}</Text>
          
          {percentile > 0 && (
            <View style={styles.percentileContainer}>
              <Text style={styles.percentileText}>
                {t('betterThan')} {percentile}% {t('ofPlayers')}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.showAnswersButton}
            onPress={() => setShowCorrectAnswers(!showCorrectAnswers)}
          >
            <Ionicons name={showCorrectAnswers ? 'eye-off' : 'eye'} size={20} color="#FEC11B" />
            <Text style={styles.showAnswersText}>
              {showCorrectAnswers ? t('hideAnswers') : t('showAnswers')}
            </Text>
          </TouchableOpacity>

          {showCorrectAnswers && (
            <View style={styles.answersReview}>
              {QUIZ_QUESTIONS.map((q, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isCorrect = userAnswer === q.correctIndex;
                return (
                  <View key={idx} style={styles.reviewItem}>
                    <Text style={styles.reviewQuestion}>
                      {idx + 1}. {q.question[language]}
                    </Text>
                    <Text style={[styles.reviewAnswer, isCorrect ? styles.correctAnswer : styles.wrongAnswer]}>
                      {t('yourAnswer')}: {q.options[language][userAnswer]}
                    </Text>
                    {!isCorrect && (
                      <Text style={styles.correctAnswerText}>
                        {t('correct')}: {q.options[language][q.correctIndex]}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Ionicons name="refresh" size={24} color="#1B1B1B" />
            <Text style={styles.restartButtonText}>{t('playAgain')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>INOVIX Quiz Arena</Text>
        <Text style={styles.questionCounter}>
          {t('question')} {currentQuestion + 1} / {QUIZ_QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question[language]}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {question.options[language].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswers[currentQuestion] === index && styles.optionButtonSelected,
              ]}
              onPress={() => handleSelectAnswer(index)}
            >
              <View style={styles.optionCircle}>
                {selectedAnswers[currentQuestion] === index && (
                  <View style={styles.optionCircleInner} />
                )}
              </View>
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestion] === index && styles.optionTextSelected,
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentQuestion > 0 && (
          <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
            <Ionicons name="chevron-back" size={24} color="#FEC11B" />
            <Text style={styles.navButtonText}>{t('back')}</Text>
          </TouchableOpacity>
        )}
        
        <View style={{flex: 1}} />
        
        {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, !selectedAnswers[currentQuestion] && styles.navButtonDisabled]}
            onPress={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            <Text style={styles.navButtonText}>{t('nextQuestion')}</Text>
            <Ionicons name="chevron-forward" size={24} color="#FEC11B" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.finishButton, selectedAnswers.length < QUIZ_QUESTIONS.length && styles.finishButtonDisabled]}
            onPress={handleFinish}
            disabled={submitting || selectedAnswers.length < QUIZ_QUESTIONS.length}
          >
            {submitting ? (
              <ActivityIndicator color="#1B1B1B" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#1B1B1B" />
                <Text style={styles.finishButtonText}>{t('finishQuiz')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
  },
  header: {
    backgroundColor: '#232426',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 3,
    borderBottomColor: '#FEC11B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionCounter: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#232426',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FEC11B',
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionText: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 28,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2b2d',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#3a3b3d',
  },
  optionButtonSelected: {
    backgroundColor: '#3a3210',
    borderColor: '#FEC11B',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEC11B',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FEC11B',
  },
  optionText: {
    fontSize: 16,
    color: '#CCCCCC',
    flex: 1,
  },
  optionTextSelected: {
    color: '#FEC11B',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#232426',
    borderTopWidth: 2,
    borderTopColor: '#FEC11B',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    color: '#FEC11B',
    fontWeight: '600',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEC11B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  finishButtonDisabled: {
    opacity: 0.5,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
  resultsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginTop: 24,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  correctCount: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 8,
  },
  percentileContainer: {
    backgroundColor: '#232426',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  percentileText: {
    fontSize: 16,
    color: '#FEC11B',
    fontWeight: '600',
  },
  showAnswersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    gap: 8,
  },
  showAnswersText: {
    fontSize: 16,
    color: '#FEC11B',
    textDecorationLine: 'underline',
  },
  answersReview: {
    width: '100%',
    marginTop: 16,
    gap: 16,
  },
  reviewItem: {
    backgroundColor: '#232426',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3b3d',
  },
  reviewQuestion: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewAnswer: {
    fontSize: 14,
    marginBottom: 4,
  },
  correctAnswer: {
    color: '#4CAF50',
  },
  wrongAnswer: {
    color: '#FF6B6B',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEC11B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
    gap: 12,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B1B1B',
  },
});
