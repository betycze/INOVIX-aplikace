import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function RateScreen() {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('error'), 'Gallery permission is required to select photos');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('error'), t('selectStars'));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stars: rating,
          comment,
          photo,
          company,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        // Reset form
        setRating(0);
        setComment('');
        setPhoto('');
        setCompany('');
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        Alert.alert(t('error'), data.detail || t('ratingError'));
      }
    } catch (error) {
      Alert.alert(t('error'), t('ratingError'));
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
          <Text style={styles.successTitle}>{t('thankYou')}</Text>
          <Text style={styles.successMessage}>{t('ratingSuccess')}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{t('rateUs')}</Text>
        <Text style={styles.subtitle}>{t('selectRating')}</Text>

        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={50}
                color={star <= rating ? '#FEC11B' : '#666'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Company Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('companyName')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('companyPlaceholder')}
            placeholderTextColor="#666"
            value={company}
            onChangeText={setCompany}
          />
        </View>

        {/* Comment */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('addComment')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('commentPlaceholder')}
            placeholderTextColor="#666"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Photo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('addPhoto')}</Text>
          
          {photo ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photo }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => setPhoto('')}
              >
                <Ionicons name="close-circle" size={24} color="#FEC11B" />
                <Text style={styles.removePhotoText}>{t('removePhoto')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleTakePhoto}
              >
                <Ionicons name="camera" size={24} color="#FEC11B" />
                <Text style={styles.photoButtonText}>{t('takePhoto')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.photoButton}
                onPress={handleChooseFromGallery}
              >
                <Ionicons name="images" size={24} color="#FEC11B" />
                <Text style={styles.photoButtonText}>{t('chooseFromGallery')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#232426" />
          ) : (
            <Text style={styles.submitButtonText}>{t('submitRating')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  starButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#FEC11B',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#3a3b3d',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#4a4b4d',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3b3d',
    borderWidth: 2,
    borderColor: '#FEC11B',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  photoButtonText: {
    color: '#FEC11B',
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  removePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removePhotoText: {
    color: '#FEC11B',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FEC11B',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232426',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginTop: 24,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
