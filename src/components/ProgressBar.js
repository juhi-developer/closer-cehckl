import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {colors} from '../styles/colors';
import {SCREEN_WIDTH} from '../styles/globalStyles';

const ProgressBar = ({totalAmount, currentAmount}) => {
  const containerWidth = SCREEN_WIDTH - 40; // Static container width
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (totalAmount > 0) {
      Animated.timing(progress, {
        toValue: (currentAmount / totalAmount) * containerWidth,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  }, [totalAmount, currentAmount, containerWidth]);

  return (
    <View style={[styles.container, {width: containerWidth}]}>
      <Animated.View style={[styles.progressBar, {width: progress}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.blue1,
    borderRadius: 100,
  },
});

export default ProgressBar;
