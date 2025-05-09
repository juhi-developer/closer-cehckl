import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {fonts} from '../styles/fonts';
import {scale} from '../utils/metrics';
import {colors} from '../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

const SwipeButton = ({onSuccess, viewStyles, buttonName}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const buttonWidth = Dimensions.get('window').width - 100; // Assuming some padding or margin
  const swipeThreshold = buttonWidth / 1.1; // Middle of the button
  const [bgColor, setBgColor] = useState('#147CE1'); // Initial color blue

  // Interpolating the background color with opacity
  const backgroundColor = translateX.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: ['rgba(0, 122, 255, 1)', 'rgba(227, 234, 249, 1)'], // Full opacity to 50% as you swipe
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Calculate 90% of the button width
        const dragLimit = buttonWidth * 0.75;

        // Check if the current translation is less than the limit
        const newTranslation =
          gestureState.dx < dragLimit ? gestureState.dx : dragLimit;
        translateX.setValue(newTranslation);
      },
      onPanResponderRelease: () => {
        if (translateX._value >= swipeThreshold - 50) {
          setBgColor('green'); // Change the background color to green
          onSuccess && onSuccess(); // Call the onSuccess callback if provided
        }
        // Animate the button back to the starting position
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const incomingTextStyle = {
    transform: [
      {
        // Incoming text should move twice as slow to stay in the center until midpoint
        translateX: translateX.interpolate({
          inputRange: [0, swipeThreshold, swipeThreshold + 1],
          outputRange: [-swipeThreshold, 0, 1],
          //   extrapolateLeft: 'clamp', // clamp so that it doesn't go beyond the left boundary
          extrapolateRight: 'extend', // continue moving right after the midpoint
        }),
      },
    ],
    opacity: translateX.interpolate({
      inputRange: [0, swipeThreshold / 2, swipeThreshold],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    }),
  };

  const animatedStyle = {
    transform: [{translateX}],
  };

  return (
    <View testID="custom-swipe-button" style={{...viewStyles}}>
      {bgColor === 'green' ? (
        <Animatable.View animation="bounceIn" duration={2000}>
          <Image
            style={{
              marginStart: scale(60),
              height: scale(67),
              resizeMode: 'contain',
            }}
            source={require('../assets/images/stars-button-above.png')}
          />
        </Animatable.View>
      ) : (
        <View style={{height: scale(67)}} />
      )}
      <View style={{...styles.container}}>
        {bgColor === 'green' ? (
          <Animatable.View
            animation="pulse"
            easing="ease-out"
            iterationCount={1}
            style={{
              width: scale(325),
              height: scale(56),
              borderRadius: 30,

              shadowColor: colors.shadow,
              shadowOffset: {width: 0, height: scale(4)},
              shadowOpacity: 1,
              shadowRadius: scale(4),
              elevation: scale(4),
              //  overflow: 'hidden',
            }}>
            <LinearGradient
              colors={['#12A533', '#22A839']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'green',
                height: scale(56),
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 30,

                width: scale(325),
              }}>
              <Image
                style={{tintColor: 'transparent'}}
                source={require('../assets/images/chevron-button-green-tick.png')}
              />
              <Text style={styles.text}>Woo!</Text>
              <Image
                style={{resizeMode: 'contain'}}
                source={require('../assets/images/chevron-button-green-tick.png')}
              />
            </LinearGradient>
          </Animatable.View>
        ) : (
          <Animated.View
            style={[
              styles.button,
              {
                width: buttonWidth,
                backgroundColor: bgColor,
                backgroundColor: backgroundColor,
              },
            ]}>
            <Animated.View
              style={[styles.animatedContainer, animatedStyle]}
              {...panResponder.panHandlers}>
              <Image
                style={{resizeMode: 'contain'}}
                source={require('../assets/images/chevron-button-right.png')}
              />
              <Text style={{...styles.text, marginStart: scale(50)}}>
                Poke {buttonName}
              </Text>
            </Animated.View>
            <Animated.Text style={[styles.incomingText, incomingTextStyle]}>
              Alrighty
            </Animated.Text>
          </Animated.View>
        )}
      </View>
      {bgColor === 'green' ? (
        <Animatable.View animation="bounceIn" duration={2000}>
          <Image
            style={{
              marginStart: scale(20),
              height: scale(67),
              resizeMode: 'contain',
            }}
            source={require('../assets/images/stars-bottom-button.png')}
          />
        </Animatable.View>
      ) : (
        <View style={{height: scale(67)}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // You might want to center the button or set specific dimensions
    justifyContent: 'center',
    alignItems: 'center',
    //  flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: scale(56),

    // Remove the width here if using 'Dimensions' to set it dynamically
  },
  animatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: fonts.semiBoldFont,
    marginLeft: 10,
    fontSize: scale(18),
  },
  incomingText: {
    color: colors.blue1,
    fontFamily: fonts.semiBoldFont,
    marginLeft: 10,
    position: 'absolute',
    left: 150,
    paddingLeft: 10,
  },
});

export default SwipeButton;
