import React, { useState, useRef, useEffect } from 'react';
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
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');
const CATALOG_URL = 'https://customer-assets.emergentagent.com/job_6b820d1c-1449-49e6-ad5b-db28ee6bd9c9/artifacts/96v7mst8_KATALOG%20PRODUKT%C5%AW%20%281%29.pdf';

export default function CatalogScreen() {
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const pdfRef = useRef<any>(null);

  const goToNextPage = () => {
    if (currentPage < totalPages && pdfRef.current) {
      const nextPage = currentPage + 1;
      pdfRef.current.setPage(nextPage);
      setCurrentPage(nextPage);
      
      // Show end message when reaching last page
      if (nextPage === totalPages) {
        setShowEndMessage(true);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1 && pdfRef.current) {
      const prevPage = currentPage - 1;
      pdfRef.current.setPage(prevPage);
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
        {Platform.OS === 'web' ? (
          // Web fallback - use iframe
          <iframe
            src={`${CATALOG_URL}#page=${currentPage}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#232426',
            }}
            title="Product Catalog"
          />
        ) : (
          // Native PDF viewer
          <Pdf
            ref={pdfRef}
            source={{ uri: CATALOG_URL, cache: true }}
            page={currentPage}
            horizontal={false}
            onLoadComplete={(numberOfPages) => {
              setTotalPages(numberOfPages);
              setLoading(false);
            }}
            onPageChanged={(page) => {
              setCurrentPage(page);
              if (page === totalPages) {
                setShowEndMessage(true);
              } else {
                setShowEndMessage(false);
              }
            }}
            onError={(error) => {
              console.error('PDF Error:', error);
              setLoading(false);
            }}
            style={styles.pdf}
            trustAllCerts={false}
            enablePaging={true}
            spacing={0}
            fitPolicy={0}
          />
        )}

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
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FEC11B',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEC11B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232426',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FEC11B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEC11B',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a3b3d',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#CCCCCC',
  },
});
