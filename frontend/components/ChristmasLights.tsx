import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChristmasLightsProps {
  numberOfLights?: number;
  mini?: boolean;
}

const ChristmasLights: React.FC<ChristmasLightsProps> = ({ 
  numberOfLights = 18,
  mini = false 
}) => {
  const lights = Array.from({ length: numberOfLights }, (_, i) => i);

  return (
    <View style={[styles.container, mini && styles.miniContainer]}>
      {/* Cable/Wire */}
      {!mini && <View style={styles.cable} />}
      
      {/* Lights */}
      <View style={styles.lightsContainer}>
        {lights.map((index) => (
          <Light key={index} index={index} total={numberOfLights} mini={mini} />
        ))}
      </View>
    </View>
  );
};

interface LightProps {
  index: number;
  total: number;
  mini: boolean;
}

const Light: React.FC<LightProps> = ({ index, total, mini }) => {
  const opacity = useSharedValue(0.6);
  const scale = useSharedValue(1);
  
  // Alternate colors
  const colors = ['#FEC11B', '#FFF7C4'];
  const color = colors[index % 2];
  
  useEffect(() => {
    // Staggered animation start for each light
    const delay = (index / total) * 2000;
    
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 3000 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
    
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 3000 + Math.random() * 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Calculate position along a catenary curve (arch)
  const calculatePosition = () => {
    const progress = index / (total - 1);
    const x = progress * 100; // Percentage across width
    
    // Catenary curve formula for natural hanging effect
    // y = a * cosh(x/a) - creates natural sag
    const a = 20; // Controls depth of curve
    const normalizedX = (progress - 0.5) * 4; // Center around 0
    const y = a * Math.cosh(normalizedX / a) - a;
    
    return {
      left: `${x}%`,
      top: mini ? 0 : y * 0.3, // Scale down the sag
    };
  };

  const position = calculatePosition();
  const size = mini ? 3 : 5;

  return (
    <Animated.View
      style={[
        styles.lightWrapper,
        {
          left: position.left,
          top: position.top,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.light,
          {
            width: size,
            height: size,
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: mini ? 4 : 8,
            elevation: 10,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1000,
  },
  miniContainer: {
    position: 'relative',
    height: 20,
    width: '100%',
  },
  cable: {
    position: 'absolute',
    top: 5,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: '#4a4a4a',
    opacity: 0.5,
  },
  lightsContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  lightWrapper: {
    position: 'absolute',
  },
  light: {
    borderRadius: 50,
  },
});

export default ChristmasLights;
