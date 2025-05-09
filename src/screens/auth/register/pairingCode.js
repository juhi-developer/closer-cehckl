/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Pressable,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AppView from '../../../components/AppView';
import {globalStyles} from '../../../styles/globalStyles';
import AppButton from '../../../components/appButton';
import {colors} from '../../../styles/colors';
import {fonts} from '../../../styles/fonts';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import ConfettiIconSvg from '../../../assets/svgs/confettiIconSvg';
import {APP_STRING} from '../../../utils/constants';
import {scale} from '../../../utils/metrics';
import {OtpInput} from 'react-native-otp-entry';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  ClearAction,
  PartnerCode,
  ResendPartnerCode,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import {setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import API from '../../../redux/saga/request';
import LinearGradient from 'react-native-linear-gradient';
import {scaleNew} from '../../../utils/metrics2';
import {EventRegister} from 'react-native-event-listeners';
import {ToastMessage} from '../../../components/toastMessage';

export default function PairingCode(props) {
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const otpInputRef = useRef(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    setTimeout(() => {
      otpInputRef.current?.focus?.();
    }, 1000);
  }, []);

  const submit = code => {
    Keyboard.dismiss();
    if (code === '') {
      ToastMessage('Please enter code');
      return;
    } else if (code.length !== 4) {
      ToastMessage('Please fill all code inputs');
      return;
    }

    let params = {
      code: code,
    };
    console.log('info', params);

    if (!netInfo.isConnected) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(PartnerCode(params)); // api calling through redux-saga
  };

  const resendCode = () => {
    if (!netInfo.isConnected) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(ResendPartnerCode()); // api calling through redux-saga
  };

  useEffect(() => {
    console.log('PARTNER_CODE LOGS...', state);

    if (state.reducer.case === actions.PARTNER_CODE_SUCCESS) {
      setLoading(false);
      props.navigation.goBack();
      EventRegister.emit('pairingSuccess');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.PARTNER_CODE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.RESEND_PARTNER_CODE_SUCCESS) {
      setLoading(false);
      ToastMessage('Pairing code sent successfully.');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.RESEND_PARTNER_CODE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    }
  }, [state]);

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={
          <Image source={require('../../../assets/images/ic_back.png')} />
        }
        leftPress={() => props.navigation.goBack()}
      />
    );
  };

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      locations={[0, 0.3]}
      useAngle
      angle={190}
      style={{
        flex: 1,
      }}>
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
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            //   paddingHorizontal: scaleNew(20),
            //   paddingTop: scaleNew(20),
          }}>
          <AppView
            customContainerStyle={{
              backgroundColor: 'transparent',
            }}
            scrollContainerRequired={true}
            isScrollEnabled={false}
            isLoading={loading}
            header={AppHeader}>
            <View style={styles.welcomeHeader}>
              <View>
                <Text
                  style={{
                    fontFamily: fonts.standardFont,
                    color: '#444444',
                    fontSize: scaleNew(21),
                    lineHeight: scaleNew(29),
                    //   textAlign: 'center',
                    //  marginHorizontal: scale(30),
                  }}>
                  You’re all set to connect with{`\n`}your partner
                </Text>
                <Text style={styles.message}>
                  Please enter your 4 digit pairing code
                </Text>
              </View>
            </View>
            <View style={{marginHorizontal: scaleNew(20)}}>
              <OtpInput
                textInputProps={{
                  keyboardType: 'email-address',
                  inputMode: 'email',
                  autoCapitalize: 'characters',
                }}
                ref={otpInputRef}
                autoFocus={false}
                numberOfDigits={4}
                onTextChange={text => setCode(text.toUpperCase())}
                focusColor={colors.blue1}
                onFilled={code => {
                  submit(code);
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

              {/* <OTPInputView
                ref={otpInputRef}
                style={{height: scale(60)}}
                pinCount={4}
                code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={e => setCode(e.toUpperCase())}
                autoFocusOnLoad={false}
                
                // autoCapitalize = 'characters'
                // placeholderCharacter={"0"}
                // placeholderTextColor="black"
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={code => {
                  submit(code);
                  console.log(`Code is ${code}, you are good to go!`);
                }}
                keyboardType="default"
              /> */}

              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  fontFamily: fonts.notoSansItalicLight,

                  textAlign: 'center',
                  color: '#808491',
                  marginTop: scaleNew(60),
                }}>
                This is an exclusive code, so make sure to keep it safe
              </Text>
            </View>
          </AppView>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  welcomeHeader: {
    //  alignItems: 'center',
    // backgroundColor: 'red',
    //  justifyContent: 'space-between',
    //  flexDirection: 'column',
    marginStart: scaleNew(20),
    marginTop: scaleNew(70),
  },
  contactLabel: {
    ...globalStyles.regularMediumText,
    marginStart: scale(16),
  },
  underlineStyleBase: {
    width: scale(76),
    height: scale(60),
    backgroundColor: colors.white,
    borderWidth: 0,
    color: '#808491',
    borderRadius: 10,
    // opacity: 0.12,
  },

  underlineStyleHighLighted: {
    // borderColor: '#03DAC6',
    borderWidth: 0,
  },
  resendOtpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(12),
  },
  message: {
    // ...globalStyles.regularMediumText,
    fontFamily: fonts.regularFont,
    marginTop: scaleNew(10),
    fontSize: scaleNew(14),
    marginEnd: scaleNew(40),
    color: '#808491',
    // textAlign: 'center',
    //    marginHorizontal: scale(40),
    marginBottom: scaleNew(70),
  },
});
