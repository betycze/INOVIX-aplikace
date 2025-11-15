import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FEC11B" />
          <Text style={styles.loadingText}>{t('loading')}</Text>
        </View>
      </View>
    );
  }

  if (catalogImages.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="images-outline" size={80} color="#666" />
          <Text style={styles.emptyText}>No catalog images available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Page Counter */}
      <View style={styles.header}>
        <Text style={styles.pageCounter}>
          {t('pageOf')} {currentPage} {t('of')} {totalPages}
        </Text>
      </View>

      {/* Image Viewer */}
      <View style={styles.viewerContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
        >
          {catalogImages.map((image, index) => (
            <View key={image.id} style={styles.imageContainer}>
              <Image
                source={{ uri: `${BACKEND_URL}/api${image.url}` }}
                style={styles.catalogImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
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
      
      {/* Back to Start Button - only show if not on first page */}
      {currentPage > 1 && (
        <TouchableOpacity
          style={styles.backToStartButton}
          onPress={() => {
            setCurrentPage(1);
            setShowEndMessage(false);
            scrollViewRef.current?.scrollTo({
              x: 0,
              animated: true,
            });
          }}
        >
          <Ionicons name="home-outline" size={20} color="#FEC11B" />
          <Text style={styles.backToStartText}>Vrátit se na úvod katalogu</Text>
        </TouchableOpacity>
      )}

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
  viewerContainer: {
    flex: 1,
    backgroundColor: '#232426',
  },
  imageContainer: {
    width: width,
    height: height - 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232426',
  },
  catalogImage: {
    width: width - 40,
    height: height - 240,
  },
  loadingOverlay: {
    flex: 1,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
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
  backToStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1b1d',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FEC11B',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  backToStartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FEC11B',
  },
});
