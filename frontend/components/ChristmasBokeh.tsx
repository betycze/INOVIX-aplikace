import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = require('react-native').Dimensions.get('window');

interface BokehParticleProps {
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  startX: number;
  startY: number;
  color: string;
}

const BokehParticle: React.FC<BokehParticleProps> = ({ 
  size, 
  opacity, 
  delay, 
  duration, 
  startX, 
  startY,
  color 
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in/out animation
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacityAnim, {
          toValue: opacity,
          duration: duration * 0.4,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: duration * 0.6,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scale pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bokeh,
        {
          width: size,
          height: size,
          left: startX,
          top: startY,
          backgroundColor: color,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

const ChristmasBokeh: React.FC = () => {
  const bokehParticles = [];
  
  // ONLY CORNERS - completely avoid center area where logo and content is
  
  // Top-left corner
  for (let i = 0; i < 2; i++) {
    bokehParticles.push({
      key: `top-left-${i}`,
      size: 40 + Math.random() * 50,
      opacity: 0.03 + Math.random() * 0.04,
      delay: Math.random() * 5000,
      duration: 4000 + Math.random() * 4000,
      startX: Math.random() * 150,
      startY: Math.random() * 100,
      color: i % 2 === 0 ? '#FEC11B' : '#FFF7C4',
    });
  }
  
  // Top-right corner
  for (let i = 0; i < 2; i++) {
    bokehParticles.push({
      key: `top-right-${i}`,
      size: 40 + Math.random() * 50,
      opacity: 0.03 + Math.random() * 0.04,
      delay: Math.random() * 5000,
      duration: 4000 + Math.random() * 4000,
      startX: SCREEN_WIDTH - 150 + Math.random() * 150,
      startY: Math.random() * 100,
      color: i % 2 === 0 ? '#FEC11B' : '#FFF7C4',
    });
  }

  // Bottom-left corner
  for (let i = 0; i < 2; i++) {
    bokehParticles.push({
      key: `bottom-left-${i}`,
      size: 40 + Math.random() * 50,
      opacity: 0.03 + Math.random() * 0.04,
      delay: Math.random() * 5000,
      duration: 4000 + Math.random() * 4000,
      startX: Math.random() * 150,
      startY: SCREEN_HEIGHT - 150 + Math.random() * 150,
      color: i % 2 === 0 ? '#FEC11B' : '#FFFFFF',
    });
  }
  
  // Bottom-right corner
  for (let i = 0; i < 2; i++) {
    bokehParticles.push({
      key: `bottom-right-${i}`,
      size: 40 + Math.random() * 50,
      opacity: 0.03 + Math.random() * 0.04,
      delay: Math.random() * 5000,
      duration: 4000 + Math.random() * 4000,
      startX: SCREEN_WIDTH - 150 + Math.random() * 150,
      startY: SCREEN_HEIGHT - 150 + Math.random() * 150,
      color: i % 2 === 0 ? '#FEC11B' : '#FFFFFF',
    });
  }

  return (
    <View style={styles.container}>
      {bokehParticles.map((particle) => (
        <BokehParticle
          key={particle.key}
          size={particle.size}
          opacity={particle.opacity}
          delay={particle.delay}
          duration={particle.duration}
          startX={particle.startX}
          startY={particle.startY}
          color={particle.color}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  bokeh: {
    position: 'absolute',
    borderRadius: 100,
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
});

export default ChristmasBokeh;
