import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const SwipeContainer = ({time, isLeft, message, onSwipe, children}) => {
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);

  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {},
    onActive: (event, ctx) => {
      x.value = isLeft ? 100 : -100;
    },
    onEnd: (event, ctx) => {
      x.value = withTiming(startingPosition, {
        duration: 1000,
        easing: Easing.out(Easing.exp),
      });
    },
  });

  const uas = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  return (
    <FlingGestureHandler
      direction={isLeft ? Directions.RIGHT : Directions.LEFT}
      onGestureEvent={eventHandler}
      onHandlerStateChange={({nativeEvent}) => {
        if (nativeEvent.state === State.END) {
          onSwipe(message, isLeft);
        }
      }}>
      <Animated.View style={[styles.container, uas]}>{children}</Animated.View>
    </FlingGestureHandler>
  );
};

export default SwipeContainer;

const styles = StyleSheet.create({
  container: {},
  messageContainer: {
    // backgroundColor: 'transparent',
    maxWidth: '80%',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  messageView: {
    backgroundColor: 'transparent',
    maxWidth: '80%',
  },
  timeView: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingLeft: 10,
  },
  message: {
    color: 'white',
    alignSelf: 'flex-start',
    fontSize: 15,
  },
  time: {
    color: 'lightgray',
    alignSelf: 'flex-end',
    fontSize: 10,
  },
});
