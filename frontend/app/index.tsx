import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Fair end date - November 13, 2025, 12:00 PM Prague time (CET/CEST)
// Prague is UTC+1 (CET) in winter, UTC+2 (CEST) in summer
// November 13, 2025 is in winter, so UTC+1
const FAIR_END_DATE = new Date('2025-11-13T11:00:00.000Z'); // 12:00 PM Prague (11:00 UTC)

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [fairEnded, setFairEnded] = useState(false);

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const fairEnd = FAIR_END_DATE.getTime();
    const difference = fairEnd - now;
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    setFairEnded(true);
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'cs' ? 'cs-CZ' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const progressPercentage = () => {
    const totalTime = 7 * 24 * 60 * 60; // 7 days in seconds
    const remainingTime = timeLeft.days * 24 * 60 * 60 + timeLeft.hours * 60 * 60 + timeLeft.minutes * 60 + timeLeft.seconds;
    return ((totalTime - remainingTime) / totalTime) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header with Clock and Countdown */}
      <View style={styles.header}>
        <View style={styles.timeSection}>
          <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
          <Text style={styles.currentDate}>{formatDate(currentTime)}</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage()}%` }]} />
          </View>
          <Text style={styles.countdownText}>KONEC VELETRHU ZA</Text>
        </View>
        
        {fairEnded ? (
          <View style={styles.fairEndedContainer}>
            <Text style={styles.fairEndedText}>Veletrh právě probíhá!</Text>
          </View>
        ) : (
          <View style={styles.countdownContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{timeLeft.days}</Text>
              <Text style={styles.timeLabel}>d</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>h</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>m</Text>
            </View>
            <Text style={styles.timeSeparator}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>s</Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo and Welcome */}
        <View style={styles.welcomeSection}>
          <Image
            source={require('../assets/inovix-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>{t('welcome')}</Text>
          <Text style={styles.portalText}>{t('customerPortal')}</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'cs' && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage('cs')}
          >
            <Text style={styles.languageFlag}>🇨🇿</Text>
            <Text
              style={[
                styles.languageText,
                language === 'cs' && styles.languageTextActive,
              ]}
            >
              Čeština
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.languageButton,
              language === 'en' && styles.languageButtonActive,
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={styles.languageFlag}>🇬🇧</Text>
            <Text
              style={[
                styles.languageText,
                language === 'en' && styles.languageTextActive,
              ]}
            >
              English
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Menu Buttons */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/catalog')}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="book" size={40} color="#FEC11B" />
              <Text style={styles.menuButtonText}>{t('viewCatalog')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/rate')}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="star" size={40} color="#FEC11B" />
              <Text style={styles.menuButtonText}>{t('rateOurBooth')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/faq')}
          >
            <View style={styles.menuButtonContent}>
              <Ionicons name="help-circle" size={40} color="#FEC11B" />
              <Text style={styles.menuButtonText}>{t('faq')}</Text>
            </View>
          </TouchableOpacity>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1a1b1d',
    borderBottomWidth: 2,
    borderBottomColor: '#FEC11B',
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FEC11B',
    fontFamily: 'System',
  },
  currentDate: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  countdownText: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#3a3b3d',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FEC11B',
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 50,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  timeLabel: {
    fontSize: 10,
    color: '#CCCCCC',
    marginTop: 2,
  },
  timeSeparator: {
    fontSize: 24,
    color: '#FEC11B',
    marginHorizontal: 4,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logo: {
    width: width * 0.6,
    height: 120,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  portalText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginTop: 8,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#3a3b3d',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageButtonActive: {
    backgroundColor: '#FEC11B',
    borderColor: '#FEC11B',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '600',
  },
  languageTextActive: {
    color: '#232426',
  },
  menuContainer: {
    gap: 16,
  },
  menuButton: {
    backgroundColor: '#3a3b3d',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FEC11B',
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
});