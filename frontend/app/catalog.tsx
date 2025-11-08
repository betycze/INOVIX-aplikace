import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CATALOG_URL = 'https://customer-assets.emergentagent.com/job_6b820d1c-1449-49e6-ad5b-db28ee6bd9c9/artifacts/96v7mst8_KATALOG%20PRODUKT%C5%AW%20%281%29.pdf';

export default function CatalogScreen() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(12); // Total pages in the catalog
  const [loading, setLoading] = useState(true);
  const [showEndMessage, setShowEndMessage] = useState(false);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      
      // Show end message when reaching last page
      if (nextPage === totalPages) {
        setShowEndMessage(true);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setShowEndMessage(false);
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
