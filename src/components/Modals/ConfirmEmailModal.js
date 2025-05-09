/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {OtpInput} from 'react-native-otp-entry';
// import Modal from 'react-native-modal';
import OverlayLoader from '../overlayLoader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {ToastMessage} from '../toastMessage';
import {validateEmail} from '../../utils/helpers';
import API from '../../redux/saga/request';
import TimerComp from '../TimerComp';
import {globalStyles} from '../../styles/globalStyles';
import {setData} from '../../utils/storage';
import {VARIABLES} from '../../utils/variables';

export default function ConfirmEmailModal(props) {
  const {setModalVisible, modalVisible} = props;

  const inputEmailRef = useRef(null);
  const inputOtpRef = useRef(null);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [startTimer, setstartTimer] = useState(false);
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [timer, settimer] = useState(60);

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

  const onConfirmEmail = async step => {
    try {
      setLoading(true);
      const params = {
        email: email,
      };
      const resp = await API('user/auth/reverfiyEmail', 'POST', params);

      if (resp.body.statusCode === 200) {
        const res = resp.body.data;
        console.log('resp body', res);
        settimer(60);
        setstartTimer(true);
        if (step === 2) {
          inputOtpRef.current?.clear();
          setCode('');
        } else {
          setStep(2);
          setTimeout(() => {
            inputOtpRef.current?.focus();
          }, 500);
        }
      } else {
        setCode('');
        ToastMessage(resp.body.Message);
      }

      console.log('resp login', JSON.stringify(resp));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onVerifyOtp = async otp => {
    if (otp === '') {
      ToastMessage('Please enter OTP');
      return;
    } else if (otp.length !== 4) {
      ToastMessage('Please fill all OTP inputs');
      return;
    }

    try {
      let params = {
        otp: otp,
      };

      setLoading(true);
      const resp = await API('user/auth/reverfiyEmailOtp', 'PUT', params);
      setLoading(false);
      console.log('resp', resp);
      if (resp.status === 200) {
        const res = resp.body.data;
        setData('USER', JSON.stringify(res));
        VARIABLES.user = res;
        setStep(3);

        console.log('resp body', res);
      } else {
        inputOtpRef.current?.clear();
        setCode('');
        ToastMessage(resp.body.Message);
      }
    } catch (err) {
      inputOtpRef.current?.clear();
      setCode('');
      setLoading(false);
      console.error('err verify otp', err);
    }
  };

  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        setModalVisible(false);
      }, 1500);
    }
  }, [step]);

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      style={styles.modal}
      onCloseRequest={() => {}}>
      <OverlayLoader visible={loading} />
      <View
        style={{
          ...styles.container,
          minHeight: step === 3 ? '40%' : '50%',
          height: step === 3 ? '40%' : 'auto',
        }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          enabled
          contentContainerStyle={styles.scrollViewContent}>
          {step === 1 ? (
            <>
              <Text style={styles.title}>
                {VARIABLES.user?.name}, we need to confirm your email ID
              </Text>

              <Text style={styles.boldText}>
                We need you to confirm your id again, we promise this is the
                last time 🙃
              </Text>
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
                    onConfirmEmail();
                  }}
                />
              </View>
            </>
          ) : (
            <>
              {step === 2 ? (
                <>
                  <Pressable
                    style={{
                      marginBottom: scaleNew(10),
                    }}
                    onPress={async () => {
                      setStep(1);
                    }}>
                    <Image
                      style={{
                        height: scaleNew(14),
                      }}
                      source={require('../../assets/images/ic_back.png')}
                    />
                  </Pressable>
                  <Text style={styles.title}>We’ve sent an OTP</Text>

                  <Text style={styles.boldText}>
                    Please check for OTP on your mail
                  </Text>

                  <View
                    style={{
                      marginTop: scaleNew(16),
                    }}>
                    <OtpInput
                      ref={inputOtpRef}
                      autoFocus={false}
                      numberOfDigits={4}
                      onTextChange={text => setCode(text)}
                      focusColor={colors.blue1}
                      onFilled={otp => {
                        onVerifyOtp(otp);
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
                      <Pressable
                        disabled={!!timer}
                        onPress={() => {
                          onConfirmEmail(2);
                        }}>
                        <Text
                          style={{
                            ...globalStyles.regularMediumText,
                            color: !!timer ? colors.blueInactive : colors.blue1,
                          }}>
                          Resend OTP
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: scaleNew(10),
                    }}>
                    <Image
                      source={require('../../assets/images/greenTickIcon.png')}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.semiBoldFont,
                        fontSize: scaleNew(26),
                        color: '#595959',

                        textAlign: 'center',
                        marginTop: scaleNew(10),
                      }}>
                      Thank you for{`\n`}confirming your email 🫶🏻
                    </Text>
                  </View>
                </>
              )}
            </>
          )}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    //  flex: 1,

    backgroundColor: '#F9F1E6',
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),
    paddingTop: scaleNew(25),
    paddingBottom: scaleNew(8),
    paddingHorizontal: scaleNew(20),
  },

  scrollViewContent: {
    paddingBottom: scaleNew(60),
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(26),
    color: '#595959',
    lineHeight: scaleNew(31),
  },

  boldText: {
    fontFamily: fonts.regularFont,
    color: '#808491',
    fontSize: scaleNew(16),
    marginTop: scaleNew(14),
  },
  textInputContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: scaleNew(16),
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
  resendOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});
