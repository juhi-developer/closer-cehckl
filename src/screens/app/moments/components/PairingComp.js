/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {View, Text, Animated} from 'react-native';
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';
import {scaleNew} from '../../../../utils/metrics2';
import {AWS_URL_S3} from '../../../../utils/urls';
import {VARIABLES} from '../../../../utils/variables';
import {colors} from '../../../../styles/colors';
import {APP_IMAGE} from '../../../../utils/constants';
import {fonts} from '../../../../styles/fonts';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const PairingComp = ({pairingModeActivated}) => {
  const imageScale = useRef(new Animated.Value(0)).current;
  const textTranslateY1 = useRef(new Animated.Value(10)).current; // First line starts off-screen
  const textTranslateY2 = useRef(new Animated.Value(10)).current; // Second line starts off-screen

  const textOpacity1 = useRef(new Animated.Value(0)).current;
  const textWidth1 = useRef(new Animated.Value(400)).current; // To mask the text
  const textOpacity2 = useRef(new Animated.Value(0)).current;
  const textWidth2 = useRef(new Animated.Value(400)).current;

  const animationRef = useRef(null);
  const animatioConfettiRef = useRef(null);

  useEffect(() => {
    if (pairingModeActivated) {
      animationRef.current?.play();

      setTimeout(() => {
        // Start the image scaling animation
        Animated.timing(imageScale, {
          toValue: 1,
          useNativeDriver: true,
          duration: 500, // Adjust the timing based on your preference
        }).start(() => {
          // Once the image animation is complete, start the text animations in sequence
          Animated.sequence([
            Animated.parallel([
              Animated.timing(textOpacity1, {
                toValue: 1,
                useNativeDriver: true,
                duration: 500,
              }),
              Animated.timing(textTranslateY1, {
                toValue: 0, // End at the final position
                useNativeDriver: true,
                duration: 500,
              }),
            ]),
            Animated.parallel([
              Animated.timing(textOpacity2, {
                toValue: 1,
                useNativeDriver: true,
                duration: 500,
              }),
              Animated.timing(textTranslateY2, {
                toValue: 0, // End at the final position
                useNativeDriver: true,
                duration: 500,
              }),
            ]),
          ]).start();
          setTimeout(() => {
            animatioConfettiRef.current?.play();
          }, 1000);
        });
      }, 1100);
    }
  }, [
    pairingModeActivated,
    imageScale,
    textOpacity1,
    textTranslateY1,
    textOpacity2,
    textTranslateY2,
  ]);

  //   useEffect(() => {
  //     if (pairingModeActivated) {
  //       animationRef.current?.play();

  //       // Start image scale animation
  //       Animated.timing(imageScale, {
  //         toValue: 1,
  //         useNativeDriver: true,
  //         duration: 500, // Duration set for the image animation
  //       }).start(() => {
  //         // This callback is called after the image animation completes

  //         // Start the first text animation
  //         Animated.spring(textTranslateY1, {
  //           toValue: 0,
  //           useNativeDriver: true,
  //         }).start(() => {
  //           // This callback is called after the first text animation completes

  //           // Start the second text animation
  //           Animated.spring(textTranslateY2, {
  //             toValue: 0,
  //             useNativeDriver: true,
  //           }).start();
  //         });
  //       });

  //       // Delay the start of confetti animation
  //       setTimeout(() => {
  //         animatioConfettiRef.current?.play();
  //       }, 1000);
  //     }
  //   }, [pairingModeActivated, imageScale, textTranslateY1, textTranslateY2]);

  return (
    <View
      style={{
        flex: 1,
        zIndex: 110,
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
      <View
        style={{position: 'absolute', start: 0, end: 0, top: 0, zIndex: 1100}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: scaleNew(60),
              justifyContent: 'center',
            }}>
            <Animated.View style={{transform: [{scale: imageScale}]}}>
              <ProfileAvatar
                type="partner"
                style={{
                  width: scaleNew(126),
                  height: scaleNew(126),
                  borderRadius: scaleNew(120),
                  borderWidth: 1,
                  borderColor: '#DADADA',
                }}
              />
            </Animated.View>

            <Animated.View style={{transform: [{scale: imageScale}]}}>
              <ProfileAvatar
                type="user"
                style={{
                  width: scaleNew(126),
                  height: scaleNew(126),
                  borderRadius: scaleNew(120),
                  backgroundColor: colors.grey10,
                  marginStart: -scaleNew(24),
                  borderWidth: 1,
                  borderColor: '#DADADA',
                }}
              />
            </Animated.View>
          </View>

          <View style={{alignItems: 'center', marginTop: scaleNew(20)}}>
            <Animated.View style={{width: textWidth1, overflow: 'hidden'}}>
              <Animated.Text
                style={{
                  fontFamily: fonts.boldFont,
                  fontSize: scaleNew(21),
                  color: colors.white,
                  opacity: textOpacity1,
                  textAlign: 'center',
                }}>
                Congratulations!
              </Animated.Text>
            </Animated.View>
            <Animated.View style={{width: textWidth2, overflow: 'hidden'}}>
              <Animated.Text
                style={{
                  fontFamily: fonts.standardFont,
                  fontSize: scaleNew(21),
                  color: colors.white,
                  opacity: textOpacity2,
                  textAlign: 'center',
                  marginTop: scaleNew(12),
                  lineHeight: scaleNew(23),
                }}>
                You are now paired with{`\n`}
                {VARIABLES.user?.partnerData?.partner?.name}!
              </Animated.Text>
            </Animated.View>
          </View>
        </View>
      </View>

      <LottieView
        ref={animationRef}
        speed={0.6}
        style={{
          position: 'absolute',
          height: '100%',
          zIndex: 1000,
          width: '102%',
        }}
        resizeMode="cover"
        source={require('../../../../assets/json/pairingModeJson.json')}
        autoPlay={false}
        loop={false}
      />
      <LottieView
        ref={animatioConfettiRef}
        style={{
          position: 'absolute',
          height: '100%',
          zIndex: 1000,
          width: '102%',
        }}
        resizeMode="cover"
        source={require('../../../../assets/json/pairingConfetti.json')}
        autoPlay={false}
        loop={false}
      />
    </View>
  );
};

export default PairingComp;
