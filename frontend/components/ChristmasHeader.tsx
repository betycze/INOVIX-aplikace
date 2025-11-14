import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ChristmasHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Christmas lights image as header decoration */}
      <Image
        source={require('../assets/christmas-lights-header.png')}
        style={styles.lightsImage}
        resizeMode="cover"
      />
      
      {/* Fade to dark gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(17, 17, 17, 0.8)', '#111111']}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 999,
    overflow: 'hidden',
  },
  lightsImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
});

export default ChristmasHeader;
