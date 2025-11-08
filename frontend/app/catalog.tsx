import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

interface CatalogImage {
  id: number;
  filename: string;
  url: string;
}

export default function CatalogScreen() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [catalogImages, setCatalogImages] = useState<CatalogImage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const BACKEND_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL || '';

  useEffect(() => {
    fetchCatalogImages();
  }, []);

  const fetchCatalogImages = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/catalog/images`);
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        setCatalogImages(data.images);
        setTotalPages(data.total);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching catalog images:', error);
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      // Scroll to next page
      scrollViewRef.current?.scrollTo({
        x: (nextPage - 1) * width,
        animated: true,
      });
      
      // Show end message when reaching last page
      if (nextPage === totalPages) {
        setTimeout(() => setShowEndMessage(true), 300);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setShowEndMessage(false);
      
      // Scroll to previous page
      scrollViewRef.current?.scrollTo({
        x: (prevPage - 1) * width,
        animated: true,
      });
    }
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width) + 1;
    
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      
      if (page === totalPages) {
        setTimeout(() => setShowEndMessage(true), 300);
      } else {
        setShowEndMessage(false);
      }
    }
  };

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Page Counter */}
      <View style={styles.header}>
        <Text style={styles.pageCounter}>
          {t('pageOf')} {currentPage} {t('of')} {totalPages || '...'}
        </Text>
      </View>

      {/* PDF Viewer */}
      <View style={styles.pdfContainer}>
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(CATALOG_URL)}&embedded=true#page=${currentPage}`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#232426',
          }}
          title="Product Catalog"
          onLoad={() => setLoading(false)}
        />

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FEC11B" />
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        )}
      </View>

      {/* Navigation Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, currentPage === 1 && styles.controlButtonDisabled]}
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentPage === 1 ? '#666' : '#FEC11B'} 
          />
          <Text style={[styles.controlButtonText, currentPage === 1 && styles.controlButtonTextDisabled]}>
            {t('previousPage')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, currentPage === totalPages && styles.controlButtonDisabled]}
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.controlButtonText, currentPage === totalPages && styles.controlButtonTextDisabled]}>
            {t('nextPage')}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={currentPage === totalPages ? '#666' : '#FEC11B'} 
          />
        </TouchableOpacity>
      </View>

      {/* End of Catalog Modal */}
      <Modal
        visible={showEndMessage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEndMessage(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#FEC11B" />
            <Text style={styles.modalTitle}>{t('catalogEndTitle')}</Text>
            <Text style={styles.modalMessage}>{t('catalogEnd')}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowEndMessage(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232426',
  },
  header: {
    backgroundColor: '#1a1b1d',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FEC11B',
    alignItems: 'center',
  },
  pageCounter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#232426',
    position: 'relative',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height - 200,
    backgroundColor: '#232426',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#232426',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#FEC11B',
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1b1d',
    borderTopWidth: 2,
    borderTopColor: '#FEC11B',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3b3d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FEC11B',
  },
  controlButtonDisabled: {
    backgroundColor: '#2a2b2d',
    borderColor: '#4a4b4d',
    opacity: 0.5,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEC11B',
  },
  controlButtonTextDisabled: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#3a3b3d',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    borderWidth: 3,
    borderColor: '#FEC11B',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FEC11B',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#FEC11B',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232426',
  },
});
