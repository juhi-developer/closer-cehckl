/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import LinearGradient from 'react-native-linear-gradient';
import PagerView from 'react-native-pager-view';
import {colors} from '../../styles/colors';
import {scaleNew} from '../../utils/metrics2';
import {fonts} from '../../styles/fonts';
import {globalStyles} from '../../styles/globalStyles';
import TimerComp from '../../components/TimerComp';
import {OtpInput} from 'react-native-otp-entry';
import API from '../../redux/saga/requestAuth';
import {ToastMessage} from '../../components/toastMessage';
import {VARIABLES} from '../../utils/variables';
import {validateEmail} from '../../utils/helpers';
import {removeData, setData} from '../../utils/storage';
import OverlayLoader from '../../components/overlayLoader';
import naclUtil from 'tweetnacl-util';
import nacl from 'tweetnacl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../../utils/socketContext';
import PaginationDotComp from '../../components/PaginationDotComp';
import {useNetInfo} from '@react-native-community/netinfo';
import {CommonActions} from '@react-navigation/native';
import {initializeTooltipStatesOnLogin} from '../../utils/contextualTooltips';
import messaging from '@react-native-firebase/messaging';
import BlockedUserLogin from '../../components/Modals/BlockedUserLogin';

const CleverTap = require('clevertap-react-native');

export default function Signup(props) {
  const {navigation} = props;

  const {connectSocket} = useSocket();
  const netInfo = useNetInfo();

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const inputContactOtpRef = useRef(null);
  const inputEmailRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const [email, setEmail] = useState('');

  const [code, setCode] = useState('');
  const [startTimer, setstartTimer] = useState(false);

  const [blockedUserLoginModal, setBlockedUserLoginModal] = useState(false);

  const [timer, settimer] = useState(60);

  const pageRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (!timer || !startTimer) {
      console.log(timer, startTimer, 'fcyvgubhinjo');
      return;
    }
    intervalId = setInterval(() => {
      settimer(timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, startTimer]);

  // Function to check for keys in AsyncStorage and generate new ones if not found
  async function getKeyPair(keyType, email) {
    let encodedPublicKey;
    let encodedSecretKey;
    //  const savedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
    const emailCheck = await AsyncStorage.getItem('CURRENT_USER_EMAIL');

    if (
      emailCheck &&
      email &&
      emailCheck.toLowerCase() !== email.toLowerCase()
    ) {
      encodedPublicKey = null;
      encodedSecretKey = null;
    } else {
      encodedPublicKey = await AsyncStorage.getItem(`publicKey${keyType}`);
      encodedSecretKey = await AsyncStorage.getItem(`privateKey${keyType}`);
    }

    if (!encodedPublicKey || !encodedSecretKey) {
      const keyPair =
        keyType === 'Encryption' ? nacl.box.keyPair() : nacl.sign.keyPair();
      encodedPublicKey = naclUtil.encodeBase64(keyPair.publicKey);
      encodedSecretKey = naclUtil.encodeBase64(keyPair.secretKey);

      await AsyncStorage.setItem(`publicKey${keyType}`, encodedPublicKey);
      await AsyncStorage.setItem(`privateKey${keyType}`, encodedSecretKey);
    }

    return {
      publicKey: encodedPublicKey,
      secretKey: encodedSecretKey,
    };
  }

  // Main function to handle key generation and backend data preparation
  async function prepareAndSendKeys(email) {
    // Check for existing keys or generate new ones
    const encryptionKeyPair = await getKeyPair('Encryption', email);
    const signingKeyPair = await getKeyPair('Signed', email);

    // Prepare data for backend
    let data = {
      publicKey: encryptionKeyPair.publicKey,
      signedPublicKey: signingKeyPair.publicKey,
    };

    // tooltip local storage keys to be deleted when new user signs up
    setTimeout(async () => {
      await AsyncStorage.setItem('momentsToolTipShown', 'true');
      await AsyncStorage.setItem('toolTipMoments', '50');

      await AsyncStorage.setItem('allNotesTooltip', 'true');
      await AsyncStorage.setItem('allNotesTooltipShown', 'true');
      await AsyncStorage.setItem('toolTipChat', '10');
      await AsyncStorage.setItem('toolTipOrganise', '10');
    }, 1);

    const fcmToken = await messaging().getToken();

    let params = {
      deviceToken: fcmToken === null ? '' : fcmToken,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      publicKey: data.publicKey,
      signedPublicKey: data.signedPublicKey,
    };
    // console.log('info--hectic', params);

    params.email = email;

    if (!netInfo.isConnected) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true);
    try {
      const resp = await API('user/auth/loginEmail', 'POST', params);
      setLoading(false);

      console.log('login response', JSON.stringify(resp));

      if (resp.body.statusCode === 200) {
        const res = resp.body.data;
        setLoading(false);

        // alert('Registered Successfully');
        VARIABLES.user = res.user;
        VARIABLES.token = res.token.token;
        VARIABLES.entryType = 'login';
        // setData('USER', JSON.stringify(state.userData))
        setCode('');
        setStep(step + 1);
        pageRef.current?.setPage(1);
        settimer(60);
        setstartTimer(true);
      } else {
        if (resp.body?.isBlocked === true) {
          setBlockedUserLoginModal(true);
          return;
        }
        ToastMessage(resp.body.Message);
      }
    } catch (err) {
      setLoading(false);
      console.error('err login', err);
    }
  }

  const stepHandler = async code => {
    onEmailVerify(code);
  };

  const onSubmitEmail = email => {
    if (email === '') {
      alert('Please enter email id');
      return;
    }
    prepareAndSendKeys(email.trim());
  };

  const onEmailVerify = async code => {
    if (code === '') {
      alert('Please enter OTP');
      return;
    } else if (code.length !== 4) {
      alert('Please fill all OTP inputs');
      return;
    }

    let params = {
      otp: code,
    };

    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    ///   setLoading(true), dispatch(VerifyOtp(params));
    setLoading(true);
    try {
      const resp = await API('user/auth/emailVerify', 'POST', params);
      setLoading(false);
      console.log('resp', resp);
      if (resp.body.statusCode === 200) {
        const res = resp.body.data;
        console.log('resp body', res);
        onVerifyOtpSuccess(res);
      } else {
        setCode('');
        ToastMessage(resp.body.Message);
      }
    } catch (err) {
      setLoading(false);
      console.error('err verify otp', err);
    }
  };

  const onVerifyOtpSuccess = async res => {
    VARIABLES.user = res.user;

    /// need to uncomment this as well
    const savedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');

    if (savedUserId === null) {
      AsyncStorage.setItem('CURRENT_USER_ID', res.user._id);
      AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'false');
    } else if (savedUserId !== res.user._id) {
      AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'true');
      AsyncStorage.setItem('CURRENT_USER_ID', res.user._id);
    } else {
    }

    initializeTooltipStatesOnLogin();

    console.log('state user dat al ogin', res.user);
    connectSocket(res.token.token);

    AsyncStorage.setItem('CURRENT_USER_EMAIL', res.user.email);

    CleverTap.onUserLogin({
      Name: res.user.name,
      userName: res.user.name,

      Email: res.user.email,

      Gender: res.user.gender,
      DOB: res.user?.dob,

      'MSG-push': true,
    });
    CleverTap.registerForPush();
    if (VARIABLES.deviceToken !== null && VARIABLES.deviceToken !== '') {
      CleverTap.setPushToken(VARIABLES.deviceToken, CleverTap.FCM);
    }

    VARIABLES.disableTouch = !res.user?.partnerCodeVerified;
    setData('USER', JSON.stringify(res.user));
    VARIABLES.token = res.token.token;
    setData('TOKEN', JSON.stringify(res.token.token));

    if (VARIABLES.entryType === 'login') {
      setTimeout(() => {
        if (
          res.user?.backupEmail !== '' &&
          res.user?.backupEmail !== null &&
          res.user?.backupEmail !== undefined
        ) {
          props.navigation.navigate('restoreBackup');
        }
        // else if (!res.user.isVerified) {
        //   props.navigation?.replace('Auth', {
        //     screen: 'Signup',
        //   });
        //   return;
        // }
        else if (!res.user.emailVerified) {
          props.navigation?.replace('Auth', {
            screen: 'Signup',
          });
          return;
        } else if (!res.user.personalizeFilled) {
          props.navigation?.replace('Auth', {
            screen: 'PersonliseQuestions',
          });
          return;
        } else {
          AsyncStorage.setItem('backupFrequency', 'never');
          AsyncStorage.setItem('lastBackupDate', '');
          AsyncStorage.setItem('lastBackupSize', '');
          //   updateContextualTooltipState('backupNowScreenVisited', false);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'App',
                },
              ],
            }),
          );
        }
      }, 300);
    }
  };

  const resendOtpHandler = async () => {
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true);

    try {
      const resp = await API('user/auth/resendEmailOtp', 'POST');
      setLoading(false);
      console.log('resp', resp);
      if (resp.body.statusCode === 200) {
        setCode('');
        ToastMessage('OTP resent successfully');

        settimer(60);
      } else {
        alert(resp.body.Message);
      }
    } catch (err) {
      setLoading(false);
      console.error('err verify otp', err);
    }
  };

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        inputEmailRef?.current?.focus?.();
      }, 1000);
    } else if (step === 2) {
      setTimeout(() => {
        inputContactOtpRef?.current?.focus?.();
      }, 500);
    }
  }, [step]);

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      locations={[0, 0.3]}
      useAngle
      angle={190}
      style={styles.container}>
      <OverlayLoader visible={loading} />
      <View
        style={{
          shadowColor: colors.shadow,
          shadowOffset: {width: -4, height: scaleNew(-4)},
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
          shadowRadius: scaleNew(4),
          elevation: scaleNew(24),
          flex: 1,
          marginTop: scaleNew(100),
        }}>
        <LinearGradient
          colors={['#E9FFFE', '#FFEBDB']}
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          locations={[0, 0.7]}
          useAngle={true}
          angle={160}
          style={{
            ...styles.container,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleNew(20),
            paddingTop: scaleNew(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Pressable
              onPress={async () => {
                await removeData('TOKEN');
                await removeData('USER');
                VARIABLES.token = '';
                VARIABLES.user = null;
                console.log('stepppppp', step);
                //  return;
                if (step === 2) {
                  setStep(1);
                  pageRef.current?.setPage(0);
                } else {
                  navigation.goBack();
                }
              }}>
              <Image
                style={{
                  height: scaleNew(14),
                }}
                source={require('../../assets/images/ic_back.png')}
              />
            </Pressable>

            <PaginationDotComp
              currentIndex={step - 1}
              totalDots={2}
              activeColor="#808491"
              inactiveColor="#D8D8D8"
              size={scaleNew(5)}
              viewStyle={{
                backgroundColor: colors.white,
                borderRadius: scaleNew(100),
                alignItems: 'center',
                justifyContent: 'center',
                padding: scaleNew(4),
              }}
            />
          </View>
          <PagerView
            scrollEnabled={false}
            ref={pageRef}
            initialPage={0}
            style={{flex: 1}}
            onPageScroll={() => {
              Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver: false,
              });
            }}
            onPageSelected={e => {
              console.log('indexx', e.nativeEvent.position);
              setStep(e.nativeEvent.position + 1);
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.44,
                  marginTop: scaleNew(100),
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.title}>Please enter your e-mail</Text>
                </View>

                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={styles.textInputContainer}>
                      <TextInput
                        ref={inputEmailRef}
                        placeholder="Email ID"
                        placeholderTextColor={'#929292'}
                        style={{...styles.textInput}}
                        keyboardType="email-address"
                        onChangeText={e => {
                          setEmail(e);
                        }}
                        value={email}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          if (email?.trim?.()?.length === 0) {
                            ToastMessage('Please enter your email address');
                            return;
                          }
                          if (!validateEmail(email?.trim?.())) {
                            ToastMessage('Please enter a valid email address');
                            return;
                          }
                          onSubmitEmail(email);
                        }}
                      />
                    </View>
                    <Pressable
                      onPress={() => {
                        if (email?.trim()?.length === 0) {
                          ToastMessage('Please enter your email address');
                          return;
                        }
                        if (!validateEmail(email?.trim())) {
                          ToastMessage('Please enter a valid email address');
                          return;
                        }
                        onSubmitEmail(email);
                      }}
                      style={{
                        marginStart: scaleNew(10),
                      }}>
                      <Image
                        source={require('../../assets/images/arrowRightBg.png')}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.4,
                  marginTop: scaleNew(100),
                  // justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.title}>We’ve sent an OTP</Text>
                  <Text style={styles.subTitle}>Please check your inbox</Text>
                </View>
                <View
                  style={{
                    marginTop: scaleNew(72),
                  }}>
                  <OtpInput
                    ref={inputContactOtpRef}
                    autoFocus={false}
                    numberOfDigits={4}
                    onTextChange={text => setCode(text)}
                    focusColor={colors.blue1}
                    onFilled={code => {
                      setCode(code);
                      stepHandler(code);
                      return;
                    }}
                    theme={{
                      containerStyle: {},
                      pinCodeContainerStyle: {
                        backgroundColor: colors.grey5,
                        height: scaleNew(55),
                        width: scaleNew(74),
                        borderWidth: 0,
                      },
                      pinCodeTextStyle: {
                        fontFamily: fonts.standardFont,
                        fontSize: scaleNew(16),
                        color: '#808491',
                      },
                      focusStickStyle: {
                        color: '#808491',
                      },
                      focusedPinCodeContainerStyle: {
                        //    borderColor: colors.blue1,
                      },
                    }}
                  />
                  <View style={styles.resendOtpContainer}>
                    <TimerComp timeVal={timer} startTimer={startTimer} />
                    <View />
                    <Pressable disabled={!!timer} onPress={resendOtpHandler}>
                      <Text
                        style={{
                          ...globalStyles.regularMediumText,
                          color: !!timer ? colors.blueInactive : colors.blue1,
                        }}>
                        Resend OTP
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() => {
                      if (code?.trim?.()?.length !== 4) {
                        ToastMessage('Please enter the OTP');
                        return;
                      }
                      stepHandler(code);
                    }}
                    style={{
                      alignSelf: 'flex-end',
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        marginTop: scaleNew(10),
                      }}
                      source={require('../../assets/images/arrowRightBg.png')}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </PagerView>
        </LinearGradient>
      </View>

      {blockedUserLoginModal && (
        <BlockedUserLogin
          modalVisible={blockedUserLoginModal}
          setModalVisible={setBlockedUserLoginModal}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    //marginStart: scaleNew(10),
    flex: 1,
  },
  textInput: {
    marginHorizontal: scaleNew(20),
    height: scaleNew(55),
    minHeight: scaleNew(55),
    fontSize: scaleNew(16),
    fontFamily: fonts.regularFont,
    color: '#808491',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
  },
  title: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(21),
    color: '#444444',
  },
  subTitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: '#808491',
    marginTop: scaleNew(10),
  },

  inputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleNew(20),
  },
  underlineStyleHighLighted: {
    // borderColor: '#03DAC6',
    borderWidth: 0,
  },
  resendOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleNew(10),
    marginBottom: scaleNew(35),
    marginHorizontal: scaleNew(26),
  },
});
