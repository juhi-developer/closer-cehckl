/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '../../styles/fonts';
import {colors} from '../../styles/colors';
import {scaleNew} from '../../utils/metrics2';
import PagerView from 'react-native-pager-view';
import AppView from '../../components/AppView';
import image1 from '../../assets/images/firstCardOnboard.png';
import image2 from '../../assets/images/secondCardOnboard.png';
import image3 from '../../assets/images/thirdCardOnboarding.png';
import image4 from '../../assets/images/fourthCardOnboarding.png';
import image5 from '../../assets/images/fifthCardOnboarding.png';
import image6 from '../../assets/images/sixthCardOnboarding.png';
import image7 from '../../assets/images/sevenCardOnboarding.png';
import image8 from '../../assets/images/eightCardOnboarding.png';
import image9 from '../../assets/images/nineCardOnboarding.png';
import AppButton from '../../components/appButton';
import PaginationDot from 'react-native-animated-pagination-dot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TermsAndconditions from '../../components/TermsAndconditions';
import {API_BASE_URL} from '../../utils/urls';
import PaginationDotComp from '../../components/PaginationDotComp';
import {ToastMessage} from '../../components/toastMessage';

const images = [
  {uri: image1, style: {top: scaleNew(24), left: scaleNew(0)}},
  {
    uri: image2,
    style: {top: scaleNew(25), right: scaleNew(0)},
  },
  {
    uri: image3,
    style: {top: scaleNew(210), left: scaleNew(0)},
  },
  {
    uri: image4,
    style: {top: scaleNew(190), right: scaleNew(0)},
  },
  {
    uri: image5,
    style: {top: scaleNew(420), right: scaleNew(0)},
  },
  {
    uri: image6,
    style: {top: scaleNew(450), left: scaleNew(0)},
  },
  {
    uri: image7,
    style: {top: scaleNew(550), right: scaleNew(0)},
  },
  {
    uri: image8,
    style: {top: scaleNew(630), left: scaleNew(0)},
  },
  {
    uri: image9,
    style: {top: scaleNew(660), right: scaleNew(0)},
  },
];

const colorsModern = [
  '#FCE3A6',
  '#D9F2CE',
  '#FFE4CE',
  '#D9EAFC',
  '#ECDDD9',
  '#D9F2CE',
  '#FCE3A6',
  '#FCE3A6',
  '#808491',
];

export default function WelcomeToCloser(props) {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1);
  const pageRef = useRef(null);

  const [privacyPolicy, setprivacyPolicy] = useState(false);
  const [termsConditions, setTermsConditions] = useState(false);
  const [termsPrivacyAccepted, setTermsPrivacyAccepted] = useState(false);

  const [animationStarted, setAnimationStarted] = useState(true);

  const animations = useRef(images.map(() => new Animated.Value(0))).current;
  const [colorIndex, setColorIndex] = useState(null);

  let currentColor = '#808491';

  useEffect(() => {
    if (step === 1 && colorIndex !== 8) {
      //   animations.forEach(anim => anim.setValue(0));

      setTimeout(() => {
        animations.forEach((anim, index) => {
          setTimeout(() => {
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }).start();
            setColorIndex(index);
          }, index * 1000); // Delay by 200ms for each image
        });
      }, 200);
    }
  }, [step]);

  useEffect(() => {
    if (step === 1) {
      if (colorIndex === 0) {
        setAnimationStarted(true);
      }
      if (colorIndex === 8) {
        setAnimationStarted(false);
      }
    }
  }, [step, colorIndex]);

  const secondView = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: insets.top,
        }}>
        {step === 1 && (
          <>
            {images.map((image, index) => (
              <Animated.View
                key={index}
                style={[
                  image.style,
                  {opacity: animations[index], position: 'absolute'},
                ]}>
                <Image source={image.uri} />
              </Animated.View>
            ))}
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Text
                style={{
                  fontFamily: fonts.playFairSemiBold,
                  fontSize: scaleNew(30),
                  color: '#808491',
                  // color: colorIndex === null ? '#808491' : currentColor,
                }}>
                More ways to love
              </Text>
            </View>
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (termsPrivacyAccepted) {
      pageRef.current?.setPage(2);
    }
  }, [termsPrivacyAccepted]);

  const thirdView = () => {
    return (
      <>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              marginTop: Platform.OS === 'ios' ? 0 : insets.top,
            }}>
            <View
              style={{
                //  justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  marginHorizontal: scaleNew(20),
                  //   marginStart: scaleNew(-20),
                }}>
                <Text
                  style={{
                    color: '#444444',
                    fontFamily: fonts.regularFont,
                    fontSize: scaleNew(14),
                  }}>
                  We’ll always be
                </Text>
                <Text
                  style={{
                    color: '#444444',
                    fontFamily: fonts.semiBoldFont,
                    fontSize: scaleNew(25),
                    marginTop: scaleNew(2),
                  }}>
                  Privacy-first
                </Text>
              </View>
              <View>
                <Image
                  source={require('../../assets/images/onboardingLockBlue.png')}
                />
              </View>
            </View>
            <LinearGradient
              colors={['#FFEFE3', '#F9F5ED']}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              locations={[0, 0.7]}
              //  useAngle={true}
              //  angle={160}
              style={{
                flex: 1,
                //  backgroundColor: colors.white,
                borderTopStartRadius: 20,
                borderTopEndRadius: 20,
                marginTop: scaleNew(-10),
                paddingHorizontal: scaleNew(20),
                paddingTop: scaleNew(30),
                backgroundColor: '#F9F5ED',
                shadowColor: colors.shadow,
                shadowOffset: {
                  width: 0,
                  height: scaleNew(-1),
                },
                shadowOpacity: 0.1,
                shadowRadius: scaleNew(1),
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.semiBoldFont,
                    fontSize: scaleNew(18),
                    color: '#737373',
                  }}>
                  End-to-end encryption
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    marginTop: scaleNew(8),
                    fontSize: scaleNew(16),
                    color: '#808491',
                  }}>
                  Your chats and photos are end-to-end encrypted and only
                  visible to you and your partner. Nobody (including us) can
                  access them.
                </Text>

                <Text
                  style={{
                    fontFamily: fonts.semiBoldFont,
                    fontSize: scaleNew(18),
                    color: '#737373',
                    marginTop: scaleNew(35),
                  }}>
                  Your data stays on your phone
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    marginTop: scaleNew(8),
                    fontSize: scaleNew(16),
                    color: '#808491',
                  }}>
                  Your chats and photos stay on your device, and can be backed
                  up & restored
                </Text>
                <View
                  style={{
                    marginBottom: scaleNew(70),
                    marginTop: scaleNew(34),

                    flexWrap: 'wrap',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // alignItems: 'center',
                    }}>
                    <Pressable
                      hitSlop={20}
                      onPress={() => {
                        setTermsPrivacyAccepted(!termsPrivacyAccepted);
                      }}>
                      {termsPrivacyAccepted ? (
                        <Image
                          style={{
                            width: scaleNew(20),
                            height: scaleNew(20),
                            resizeMode: 'contain',
                            //  marginTop: scaleNew(2.5),
                          }}
                          source={require('../../assets/images/checkboxSelect.png')}
                        />
                      ) : (
                        <Image
                          style={{
                            width: scaleNew(20),
                            height: scaleNew(20),
                            resizeMode: 'contain',
                            //   marginTop: scaleNew(0),
                          }}
                          source={require('../../assets/images/checkBoxUnselect.png')}
                        />
                      )}
                    </Pressable>
                    <Text
                      style={{
                        fontFamily: fonts.standardFont,
                        marginStart: scaleNew(4),
                        //
                        fontSize: scaleNew(14),
                        color: '#808491',

                        //  textAlign: 'center',
                      }}>
                      I accept the{' '}
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setprivacyPolicy(true);
                        }}>
                        <Text style={{textDecorationLine: 'underline'}}>
                          Privacy Policy
                        </Text>
                      </TouchableWithoutFeedback>{' '}
                      and{' '}
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setTermsConditions(true);
                        }}>
                        <Text style={{textDecorationLine: 'underline'}}>
                          Terms & Conditions
                        </Text>
                      </TouchableWithoutFeedback>
                      .
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          <TermsAndconditions
            isVisible={privacyPolicy}
            setIsVisible={setprivacyPolicy}
            redirectUrl={`${API_BASE_URL}privacyPolicy`}
          />
          <TermsAndconditions
            isVisible={termsConditions}
            setIsVisible={setTermsConditions}
          />
        </SafeAreaView>
        <SafeAreaView style={{backgroundColor: '#FFEFE3'}} />
      </>
    );
  };

  const fourthView = () => {
    return (
      <ImageBackground
        source={require('../../assets/images/onboardingPatternBg.png')}>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flex: 1,
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBoldFont,
                fontSize: scaleNew(25),
                color: '#444444',
                textAlign: 'center',
                marginBottom: scaleNew(33),
                marginTop: scaleNew(60),
              }}>
              Couples love Closer!
            </Text>
            <Image
              style={{
                width: scaleNew(393),
                height: scaleNew(510),
                //    backgroundColor: 'green',
                resizeMode: 'cover',
              }}
              source={require('../../assets/images/conversationImgOnboard.png')}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              //  backgroundColor: 'red',
              flex: 0.2,
            }}>
            <AppButton
              onPress={() => {
                AsyncStorage.setItem('onboardingState', 'true');
                props.navigation.navigate('Signup');
              }}
              style={{
                marginHorizontal: scaleNew(21.5),
              }}
              text="Get started"
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  };

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}
      locations={[0, 0.7]}
      useAngle={true}
      angle={160}
      style={styles.container}>
      <PagerView
        ref={pageRef}
        style={{flex: 1}}
        scrollEnabled={step === 2 && !termsPrivacyAccepted ? false : true}
        onPageScroll={e => {
          Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
            useNativeDriver: false,
          });
        }}
        onPageSelected={e => {
          setStep(e.nativeEvent.position + 1);
        }}>
        {/* {firstView()} */}
        {secondView()}
        {thirdView()}
        {fourthView()}
      </PagerView>
      {step !== 3 && !animationStarted && (
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: scaleNew(30),
          }}>
          <PaginationDotComp
            currentIndex={step - 1}
            totalDots={3}
            activeColor="#808491"
            inactiveColor="#D8C7BB"
            size={scaleNew(7)}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textWelcomeCloser: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(33),
    color: colors.black,
    textAlign: 'center',
  },
  textStressLess: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#808491',
    marginHorizontal: scaleNew(33),
    marginTop: scaleNew(8),
  },
  container1: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  textBox: {
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  animatedText: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
});
