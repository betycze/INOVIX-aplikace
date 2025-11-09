import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ width = 200, height = 120 }) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation - scale up with slight rotation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous blinking animation
    const blink = () => {
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Blink every 3 seconds
    const blinkInterval = setInterval(blink, 3000);

    // Continuous glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    return () => clearInterval(blinkInterval);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotate },
            ],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: glowOpacity,
            },
          ]}
        />
        
        {/* Main SVG Logo */}
        <Svg width={width} height={height} viewBox="0 0 200 120">
          {/* Yellow background circle/glow */}
          <Circle cx="40" cy="60" r="45" fill="#FEC11B" opacity="0.2" />
          
          {/* Robot Head */}
          <G>
            <Rect x="20" y="40" width="40" height="40" rx="5" fill="#FEC11B" />
            
            {/* Antenna */}
            <Rect x="37" y="30" width="6" height="10" rx="2" fill="#FEC11B" />
            <Circle cx="40" cy="27" r="4" fill="#FEC11B" />
            
            {/* Robot Eyes with blink animation */}
            <Animated.View style={{ opacity: blinkAnim }}>
              <Circle cx="30" cy="55" r="4" fill="#232426" />
              <Circle cx="50" cy="55" r="4" fill="#232426" />
              {/* Eye shine */}
              <Circle cx="31" cy="54" r="1.5" fill="#FEC11B" />
              <Circle cx="51" cy="54" r="1.5" fill="#FEC11B" />
            </Animated.View>
            
            {/* Eyelids for blink effect */}
            <Animated.View style={{ opacity: Animated.subtract(1, blinkAnim) }}>
              <Rect x="26" y="53" width="8" height="4" fill="#FEC11B" />
              <Rect x="46" y="53" width="8" height="4" fill="#FEC11B" />
            </Animated.View>
            
            {/* Mouth */}
            <Path
              d="M 30 68 Q 40 73 50 68"
              stroke="#232426"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Ears/Side panels */}
            <Rect x="15" y="50" width="5" height="8" rx="2" fill="#FEC11B" />
            <Rect x="60" y="50" width="5" height="8" rx="2" fill="#FEC11B" />
          </G>
          
          {/* INOVIX Text */}
          <G>
            <Path
              d="M85,45 L85,75 M90,45 L90,75 M105,45 L105,75 M105,45 Q115,45 115,55 Q115,65 105,65 M125,75 L125,45 L125,75 L135,45 L135,75 M145,75 L145,45 L155,75 L155,45 M165,45 L175,75 M175,45 L165,75 M190,45 L190,75 M180,45 L200,45"
              stroke="#FEC11B"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEC11B',
    left: -10,
    top: 10,
  },
});

export default AnimatedLogo;
