import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const GlowBar: React.FC = () => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const opacityInterpolate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.45],
  });

  return (
    <Animated.View
      style={[
        styles.glowBar,
        {
          opacity: opacityInterpolate,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  glowBar: {
    height: 2.5,
    backgroundColor: '#FEC11B',
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 2,
    shadowColor: '#FEC11B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
  },
});

export default GlowBar;
