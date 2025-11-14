import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SnowflakeProps {
  size: number;
  opacity: number;
  delay: number;
  duration: number;
  startX: number;
  color: string;
}

const Snowflake: React.FC<SnowflakeProps> = ({ size, opacity, delay, duration, startX, color }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vertical fall animation
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 100,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Horizontal drift animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 30,
          duration: duration * 0.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -30,
          duration: duration * 0.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: duration * 0.4,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          width: size,
          height: size,
          opacity: opacity,
          backgroundColor: color,
          left: startX,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    />
  );
};

const FallingSnow: React.FC = () => {
  // Generate snowflakes with different sizes and properties
  const snowflakes = [];
  
  // Tiny particles (70% of flakes)
  for (let i = 0; i < 35; i++) {
    snowflakes.push({
      key: `tiny-${i}`,
      size: 1 + Math.random() * 2, // 1-3px
      opacity: 0.04 + Math.random() * 0.03, // 4-7%
      delay: Math.random() * 10000,
      duration: 8000 + Math.random() * 7000, // 8-15s
      startX: Math.random() * SCREEN_WIDTH,
      color: '#FFFFFF',
    });
  }

  // Medium flakes (25% of flakes)
  for (let i = 0; i < 12; i++) {
    snowflakes.push({
      key: `medium-${i}`,
      size: 3 + Math.random() * 3, // 3-6px
      opacity: 0.05 + Math.random() * 0.03, // 5-8%
      delay: Math.random() * 10000,
      duration: 10000 + Math.random() * 8000, // 10-18s
      startX: Math.random() * SCREEN_WIDTH,
      color: '#EBEBEB',
    });
  }

  // Large rare flakes (5% of flakes)
  for (let i = 0; i < 3; i++) {
    snowflakes.push({
      key: `large-${i}`,
      size: 6 + Math.random() * 4, // 6-10px
      opacity: 0.06 + Math.random() * 0.04, // 6-10%
      delay: Math.random() * 15000,
      duration: 12000 + Math.random() * 10000, // 12-22s
      startX: Math.random() * SCREEN_WIDTH,
      color: '#D9D9D9',
    });
  }

  return (
    <View style={styles.container}>
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.key}
          size={flake.size}
          opacity={flake.opacity}
          delay={flake.delay}
          duration={flake.duration}
          startX={flake.startX}
          color={flake.color}
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
  snowflake: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default FallingSnow;
