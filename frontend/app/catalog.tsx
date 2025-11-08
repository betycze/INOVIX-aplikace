import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const CATALOG_URL = 'https://customer-assets.emergentagent.com/job_6b820d1c-1449-49e6-ad5b-db28ee6bd9c9/artifacts/96v7mst8_KATALOG%20PRODUKT%C5%AE%20%281%29.pdf';

export default function CatalogScreen() {
  const { t } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const handleViewPDF = async () => {
    try {
      // Open PDF in browser
      const supported = await Linking.canOpenURL(CATALOG_URL);
      if (supported) {
        await Linking.openURL(CATALOG_URL);
      } else {
        Alert.alert(t('error'), 'Cannot open PDF');
      }
    } catch (error) {
      Alert.alert(t('error'), 'Failed to open PDF');
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const filename = 'INOVIX_Catalog.pdf';
      const fileUri = FileSystem.documentDirectory + filename;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(CATALOG_URL, fileUri);

      if (downloadResult.status === 200) {
        // Check if sharing is available
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert(t('ok'), `File saved to ${fileUri}`);
        }
      } else {
        Alert.alert(t('error'), 'Failed to download catalog');
      }
    } catch (error) {
      Alert.alert(t('error'), 'Failed to download catalog');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="document-text" size={100} color="#FEC11B" style={styles.icon} />
        
        <Text style={styles.title}>{t('productCatalog')}</Text>
        <Text style={styles.description}>{t('catalogDescription')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewPDF}
            disabled={downloading}
          >
            <Ionicons name="eye" size={24} color="#232426" />
            <Text style={styles.primaryButtonText}>{t('viewPDF')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator color="#FEC11B" />
            ) : (
              <Ionicons name="download" size={24} color="#FEC11B" />
            )}
            <Text style={styles.secondaryButtonText}>
              {downloading ? t('downloading') : t('downloadCatalog')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#FEC11B" />
          <Text style={styles.infoText}>
            {t('language') === 'cs'
              ? 'Katalog obsahuje kompletní informace o našich produktech a službách.'
              : 'The catalog contains complete information about our products and services.'}
          </Text>
        </View>
      </View>
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
