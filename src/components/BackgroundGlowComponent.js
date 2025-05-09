import {View, Text, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import { colors } from '../styles/colors';
import RadialGradient from 'react-native-radial-gradient';

const animationDuration = 250;

const BackgroundGlowComponent = ({children, containerStyles = {}, toValue = 10, initValue = 0, glowColor = colors.blue1}) => {
  const fadeAnim = useRef(new Animated.Value(initValue)).current;

  useEffect(() => {
    fadeOut();
    return () => {};
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: initValue,
      duration: animationDuration,
    }).start();
    setTimeout(() => {
      fadeOut();
    }, animationDuration + 300);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: toValue,
      duration: animationDuration,
    }).start();
    setTimeout(() => {
      fadeIn();
    }, animationDuration + 300);
  };

  return (
    <Animated.View
      style={{
        padding: fadeAnim,
        ...containerStyles
      }}>
<RadialGradient style = {{
  flex: 1,
  ...containerStyles
}}
colors={['black','green','blue','red']}
                        stops={[0.1,0.4,0.3,0.75]}
                        center={[100,100]}
                        radius={200}
>
        {children}
        </RadialGradient>
    </Animated.View>
  );
};

export default BackgroundGlowComponent;
