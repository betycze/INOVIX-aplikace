import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    { question: t('faqQ1'), answer: t('faqA1') },
    { question: t('faqQ2'), answer: t('faqA2') },
    { question: t('faqQ3'), answer: t('faqA3') },
    { question: t('faqQ4'), answer: t('faqA4') },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="help-circle" size={60} color="#FEC11B" />
          <Text style={styles.title}>{t('frequentlyAsked')}</Text>
        </View>

        <View style={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleExpand(index)}
                activeOpacity={0.7}
              >
                <View style={styles.questionContent}>
                  <Ionicons
                    name="help-circle-outline"
                    size={24}
                    color="#FEC11B"
                    style={styles.questionIcon}
                  />
                  <Text style={styles.questionText}>{item.question}</Text>
                </View>
                <Ionicons
                  name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#FEC11B"
                />
              </TouchableOpacity>

              {expandedIndex === index && (
                <View style={styles.answerContainer}>
                  <View style={styles.answerDivider} />
                  <View style={styles.answerContent}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#4CAF50"
                      style={styles.answerIcon}
                    />
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.contactBox}>
          <Ionicons name="mail" size={32} color="#FEC11B" />
          <Text style={styles.contactTitle}>
            {t('language') === 'cs' ? 'Potřebujete další informace?' : 'Need more information?'}
          </Text>
          <Text style={styles.contactText}>
            {t('language') === 'cs'
              ? 'Navštivte náš stánek nebo kontaktujte naše zástupce na veletrhu.'
              : 'Visit our booth or contact our representatives at the fair.'}
          </Text>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginTop: 16,
  },
  faqContainer: {
    gap: 16,
  },
  faqItem: {
    backgroundColor: '#3a3b3d',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4a4b4d',
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  questionIcon: {
    marginRight: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  answerContainer: {
    paddingTop: 0,
  },
  answerDivider: {
    height: 1,
    backgroundColor: '#4a4b4d',
    marginHorizontal: 16,
  },
  answerContent: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 12,
  },
  answerIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  answerText: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
    flex: 1,
  },
  contactBox: {
    backgroundColor: '#3a3b3d',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginTop: 16,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
