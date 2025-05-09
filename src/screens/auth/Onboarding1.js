/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {scaleNew} from '../../utils/metrics2';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import TypewriterText from '../../components/TypeWriterText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginModal from '../../components/Modals/LoginModal';

export default function Onboarding1(props) {
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial position off screen
  const [onboarding, setOnboarding] = useState(false);

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    checkState();
  }, []);

  const checkState = async () => {
    const OnboardingState = await AsyncStorage.getItem('onboardingState');

    setOnboarding(OnboardingState);
  };

  useEffect(() => {
    if (step === 1) {
      // Wait for the first text to "delete" itself before showing the second
      const timer = setTimeout(() => setStep(2), 500); // adjust time as needed
      return () => clearTimeout(timer);
    } else if (step === 3) {
      setStep(4);
      // Wait a bit after the last text shows, then navigate

      //    props.navigation.navigate('Onboarding2'); // Change 'NextScreen' to your specific route name
      // Show 'Maybe.' for 2 seconds before navigating
      // return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }
  }, [step, slideAnim]);

  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0], // Adjust these values based on your screen size
        }),
      },
    ],
  };

  return (
    <ImageBackground
      source={require('../../assets/images/onboardingBg.png')}
      style={{
        flex: 1,
        marginHorizontal: -2,
      }}>
      {step !== 4 ? (
        <View
          style={{
            flex: 1,

            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {step === 0 && (
            <TypewriterText
              text="A new place for love?"
              typingDelay={100}
              deletingDelay={200}
              onFinish={() => setStep(1)}
            />
          )}
          {step === 2 && (
            <TypewriterText
              text="Maybe."
              typingDelay={100}
              deletingDelay={200} // Long delay to essentially never delete
              onFinish={() => setStep(3)}
            />
          )}
        </View>
      ) : (
        <Animated.View style={[styles.container, slideUpStyle]}>
          <View>
            <Text style={styles.title}>Welcome to Closer</Text>
            <Text style={styles.subtitle}>A modern love experience</Text>
            <Pressable
              onPress={() => {
                if (onboarding === 'true') {
                  // props.navigation.navigate('WelcomeToCloser');
                  // return;
                  props.navigation.navigate('Signup');
                } else {
                  props.navigation.navigate('WelcomeToCloser');
                }
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>
            <Pressable
              style={styles.link}
              onPress={() => {
                props.navigation.navigate('Login');
              }}>
              <Text style={styles.linkText}>I have an account</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: fonts.playFairMedium,
    fontSize: scaleNew(33),
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: scaleNew(30),
    marginTop: scaleNew(6),
  },
  button: {
    width: scaleNew(255),
    height: scaleNew(50),
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: scaleNew(50),
  },
  buttonText: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(18),
    color: '#0A070A',
    marginHorizontal: scaleNew(30),
    includeFontPadding: false,
  },
  link: {
    marginHorizontal: scaleNew(30),
    marginBottom: scaleNew(50),
    marginTop: scaleNew(12),
  },
  linkText: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.white,
    textAlign: 'center',
  },
});
