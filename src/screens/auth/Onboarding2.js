/* eslint-disable react-native/no-inline-styles */
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {TypeAnimation} from 'react-native-type-animation';
import {scaleNew} from '../../utils/metrics2';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Onboarding2(props) {
  useEffect(() => {
    setTimeout(async () => {
      const OnboardingState = await AsyncStorage.getItem('onboardingState');
    }, 10);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/onboardingBg.png')}
      style={{
        flex: 1,
        marginHorizontal: -2,
        justifyContent: 'flex-end',
      }}>
      <View>
        <Text
          style={{
            fontFamily: fonts.playFairMedium,
            fontSize: scaleNew(33),
            color: colors.white,
            textAlign: 'center',
          }}>
          Welcome to Closer
        </Text>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: colors.white,
            textAlign: 'center',
            marginHorizontal: scaleNew(30),
            marginTop: scaleNew(6),
          }}>
          Stress less. Move more. Sleep soundly. There’s something for everyone.
        </Text>
        <Pressable
          onPress={async () => {
            const OnboardingState = await AsyncStorage.getItem(
              'onboardingState',
            );
            if (OnboardingState === 'true') {
              props.navigation.navigate('WelcomeToCloser');
              //  props.navigation.navigate('Signup');
            } else {
              props.navigation.navigate('WelcomeToCloser');
            }
          }}
          style={{
            width: scaleNew(255),
            height: scaleNew(50),
            backgroundColor: colors.white,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: scaleNew(30),
          }}>
          <Text
            style={{
              fontFamily: fonts.standardFont,
              fontSize: scaleNew(18),
              //     color: colors.black,
              includeFontPadding: false,
              color: 'red',
              marginHorizontal: scaleNew(30),
            }}>
            SIGN UP
          </Text>
        </Pressable>
        <Pressable
          style={{
            marginHorizontal: scaleNew(30),
            marginBottom: scaleNew(50),
            marginTop: scaleNew(12),
          }}
          onPress={() => {
            props.navigation.navigate('login');
          }}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scaleNew(16),
              color: colors.white,
              textAlign: 'center',
            }}>
            I have an account
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({});
