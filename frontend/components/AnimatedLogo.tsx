import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet, Platform } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ width = 234, height = 140 }) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

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

    // Continuous bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '0deg'],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  return (
    <View style={styles.container}>
      <AnimatedSvg
        width={width}
        height={height}
        viewBox="0 0 234 140"
        style={{
          transform: [
            { scale: scaleAnim },
            { rotate: rotate },
            { translateY: bounce },
          ],
        }}
      >
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FEC11B" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFD700" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <G>
          {/* INOVIX Logo SVG - Yellow */}
          <Path
            d="M37.5,13.8c-6.7,0-12.4,2.2-17.1,6.5c-4.7,4.3-7.1,9.8-7.1,16.3c0,6.6,2.4,12,7.1,16.4c4.7,4.3,10.4,6.5,17.1,6.5 c6.8,0,12.5-2.2,17.2-6.5c4.7-4.4,7-9.8,7-16.4c0-6.6-2.3-12-7-16.3C50,16,44.3,13.8,37.5,13.8z M50.3,50.1 c-3.5,3.6-7.8,5.4-12.8,5.4c-5,0-9.3-1.8-12.8-5.4c-3.5-3.6-5.2-8.1-5.2-13.5c0-5.4,1.7-9.9,5.2-13.5c3.5-3.6,7.8-5.4,12.8-5.4 c5,0,9.3,1.8,12.8,5.4c3.5,3.6,5.2,8.1,5.2,13.5C55.5,42,53.8,46.5,50.3,50.1z"
            fill="#FEC11B"
          />
          <Path
            d="M37.5,23.7c-3.8,0-6.9,1.3-9.5,3.8c-2.6,2.5-3.9,5.7-3.9,9.5c0,3.8,1.3,7,3.9,9.5c2.6,2.5,5.7,3.8,9.5,3.8 c3.8,0,7-1.3,9.5-3.8c2.5-2.5,3.8-5.7,3.8-9.5c0-3.8-1.3-7-3.8-9.5C44.5,25,41.3,23.7,37.5,23.7z M42.8,42.4 c-1.4,1.4-3.2,2.1-5.3,2.1c-2.1,0-3.8-0.7-5.3-2.1c-1.4-1.4-2.1-3.2-2.1-5.4c0-2.2,0.7-4,2.1-5.4c1.4-1.4,3.2-2.1,5.3-2.1 c2.1,0,3.8,0.7,5.3,2.1c1.4,1.4,2.1,3.2,2.1,5.4C44.9,39.2,44.2,41,42.8,42.4z"
            fill="#232426"
          />
          <Path
            d="M34.6,36.7c0-0.8,0.3-1.5,0.8-2c0.5-0.5,1.2-0.8,2-0.8c0.8,0,1.5,0.3,2,0.8c0.5,0.5,0.8,1.2,0.8,2 c0,0.8-0.3,1.5-0.8,2c-0.5,0.5-1.2,0.8-2,0.8c-0.8,0-1.5-0.3-2-0.8C34.9,38.2,34.6,37.5,34.6,36.7z"
            fill="#FEC11B"
          />
          {/* I */}
          <Path d="M75,15h8v43h-8V15z" fill="#FEC11B" />
          {/* N */}
          <Path d="M95,15h7l15,28h0.1V15h8v43h-7l-15-28H103v28h-8V15z" fill="#FEC11B" />
          {/* O */}
          <Path
            d="M142,13.8c-6.7,0-12.4,2.2-17.1,6.5c-4.7,4.3-7.1,9.8-7.1,16.3c0,6.6,2.4,12,7.1,16.4c4.7,4.3,10.4,6.5,17.1,6.5 c6.8,0,12.5-2.2,17.2-6.5c4.7-4.4,7-9.8,7-16.4c0-6.6-2.3-12-7-16.3C154.5,16,148.8,13.8,142,13.8z M154.8,50.1 c-3.5,3.6-7.8,5.4-12.8,5.4c-5,0-9.3-1.8-12.8-5.4c-3.5-3.6-5.2-8.1-5.2-13.5c0-5.4,1.7-9.9,5.2-13.5c3.5-3.6,7.8-5.4,12.8-5.4 c5,0,9.3,1.8,12.8,5.4c3.5,3.6,5.2,8.1,5.2,13.5C160,42,158.3,46.5,154.8,50.1z"
            fill="#FEC11B"
          />
          {/* V */}
          <Path d="M177,15h8l10,32h0.1l10-32h8l-14,43h-8L177,15z" fill="#FEC11B" />
          {/* I */}
          <Path d="M222,15h8v43h-8V15z" fill="#FEC11B" />
          {/* X */}
          <Path d="M93,78h8l8,14l8-14h8l-12,22l13,21h-8l-9-16l-9,16h-8l13-21L93,78z" fill="#FEC11B" />
        </G>
      </AnimatedSvg>
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
});

export default AnimatedLogo;
