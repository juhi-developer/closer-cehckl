/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  PermissionsAndroid,
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
import AppButton from '../../components/appButton';
import API from '../../redux/saga/requestAuth';
import {ToastMessage} from '../../components/toastMessage';
import {VARIABLES} from '../../utils/variables';
import {generateID, uploadToS3BUCKET, validateEmail} from '../../utils/helpers';
import ImagePickerModal from '../../components/Modals/imagePickerModal';
import ImagePicker from 'react-native-image-crop-picker';
import {Image as CompressedImage} from 'react-native-compressor';
import RNFS from 'react-native-fs';
import {setData} from '../../utils/storage';

import OverlayLoader from '../../components/overlayLoader';
import naclUtil from 'tweetnacl-util';
import nacl from 'tweetnacl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useSocket} from '../../utils/socketContext';
import PaginationDotComp from '../../components/PaginationDotComp';
import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

const CleverTap = require('clevertap-react-native');
const rnBiometrics = new ReactNativeBiometrics();

export default function Signup(props) {
  const {navigation} = props;
  const {connectSocket} = useSocket();

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const inputNameRef = useRef(null);
  const inputAgeRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputEmailOtpRef = useRef(null);

  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState('');
  const [yourAge, setYourAge] = useState('');
  const [email, setEmail] = useState('');

  const [codeEmail, setCodeEmail] = useState('');
  const [startTimerEmail, setstartTimerEmail] = useState(false);
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);

  const [timerEmail, settimerEmail] = useState(60);
  const [imageUri, setimageUri] = useState('');
  const [loader, setloader] = useState(false);

  const pageRef = useRef(null);

  useEffect(() => {
    if (!timerEmail || !startTimerEmail) {
      console.log(timerEmail, startTimerEmail, 'fcyvgubhinjo');
      return;
    }
    const intervalId = setInterval(() => {
      settimerEmail(timerEmail - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timerEmail, startTimerEmail]);

  const signUpStepTwo = async () => {
    try {
      const encryptionKeyPair = await getKeyPair('Encryption');
      const signingKeyPair = await getKeyPair('Signed');

      // Prepare data for backend
      let data = {
        publicKey: encryptionKeyPair.publicKey,
        signedPublicKey: signingKeyPair.publicKey,
      };

      deleteSignature();

      const fcmToken = await messaging().getToken();

      const params = {
        name: fullName.trim(),
        deviceType: Platform.OS?.toUpperCase(),
        email: email.trim(),

        deviceToken: fcmToken === null ? '' : fcmToken,
        age: yourAge.trim(),
        publicKey: data.publicKey,
        signedPublicKey: data.signedPublicKey,
      };
      console.log(params);
      setloader(true);
      const resp = await API('user/auth/emailForm/V3', 'POST', params);
      setloader(false);
      console.log('respppppp email form v3', JSON.stringify(resp));
      if (resp.body.statusCode === 200) {
        VARIABLES.token = resp.body.data.token.token;
        setData('USER', JSON.stringify(resp.body.data.user));
        setData('TOKEN', JSON.stringify(resp.body.data.token.token));
        connectSocket(resp.body.data.token.token);
        pageRef.current?.setPage(3);
        setstartTimerEmail(true);
        settimerEmail(60);
        setStep(4);
      } else {
        ToastMessage(resp?.body?.Message);
      }
    } catch (error) {
      setloader(false);
      ToastMessage('Something went wrong, please try again');
    }
  };

  const verifyEmailOtp = async code => {
    // Keyboard.dismiss();
    try {
      const params = {
        otp: code,
      };
      setloader(true);
      const resp = await API('user/auth/emailVerify', 'POST', params);
      setloader(false);
      console.log(resp);
      if (resp.body.statusCode === 200) {
        AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'true');
        AsyncStorage.setItem('CURRENT_USER_ID', resp.body.data.user._id);
        AsyncStorage.setItem('CURRENT_USER_EMAIL', resp.body.data.user.email);
        AsyncStorage.removeItem('tooltipLastShownUserComp');

        setData('USER', JSON.stringify(resp.body.data.user));
        pageRef.current?.setPage(4);
        setStep(5);
      } else {
        ToastMessage(resp?.body?.Message);
      }
    } catch (error) {
      setloader(false);
      ToastMessage('Something went wrong, please try again');
    }
  };

  const resendOtpHandlerEmail = async () => {
    setloader(true);

    try {
      const resp = await API('user/auth/resendEmailOtp', 'POST');
      setloader(false);

      if (resp.body.statusCode === 200) {
        setCodeEmail('');
        ToastMessage('OTP resent successfully');
        settimerEmail(60);
        setstartTimerEmail(true);
      } else {
        ToastMessage(resp?.body?.Message);
      }
    } catch (err) {
      setloader(false);
      console.error('err verify otp', err);
    }
  };

  const handleGalleryPicker = () => {
    ImagePicker.openPicker({
      compressImageQuality: 1,
      mediaType: 'photo',
      cropping: true,
      smartAlbums: [
        'PhotoStream',
        'Generic',
        'Panoramas',
        'Favorites',
        'AllHidden',
        'RecentlyAdded',
        'UserLibrary',
        'SelfPortraits',
        'Screenshots',
      ],
    })
      .then(async image => {
        setimageUri(image);
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        // alert('Please give photos permission from settings.');
        console.log('error', err.stack);
      });
  };

  const handleCameraPicker = () => {
    ImagePicker.openCamera({
      mediaType: 'photo',
      cropping: true,
    })
      .then(async image => {
        setimageUri(image);
      })
      .catch(err => {
        // alert('Please give camera permission from settings.');
        setTimeout(() => {
          VARIABLES.isMediaOpen = false;
        }, 2000);
        console.log('error', err);
      });
  };

  // const uploadImage = async () => {
  //   try {
  //     setloader(true);
  //     console.log(imageUri.path);
  //     const path = await CompressedImage.compress(imageUri.path);
  //     const id = generateID();

  //     const {width, height} = imageUri;
  //     const filename =
  //       id + imageUri.path.substring(imageUri.path.lastIndexOf('/') + 1);
  //     const s3response = await uploadToS3BUCKET(
  //       path,
  //       filename,
  //       'image/jpeg',
  //       'profiles',
  //     );

  //     await StoreLocalImage(path, filename); // storing locally by creating directory
  //     if (s3response) {
  //       const resp = await API('user/auth/uploadImage', 'POST', {
  //         image: s3response.response,
  //       });

  //       if (resp.body.statusCode === 200) {
  //         setData('USER', JSON.stringify(resp.body.data));
  //         navigation.navigate('PersonliseQuestions');
  //       }
  //     }
  //   } catch (error) {
  //   } finally {
  //     setloader(false);
  //   }
  // };
  const uploadImage = async () => {
    try {
      // Validate image exists
      if (!imageUri?.path) {
        ToastMessage('Please select an image first');
        return;
      }

      setloader(true);

      const path = await CompressedImage.compress(imageUri.path);
      const id = generateID();
      const filename =
        id + imageUri.path.substring(imageUri.path.lastIndexOf('/') + 1);

      // Add error handling for compression
      if (!path) {
        const error = 'Image compression failed';

        Sentry.captureException(error, {
          extra: {
            image: imageUri,
          },
        });
        throw error;
      }

      const s3response = await uploadToS3BUCKET(
        path,
        filename,
        'image/jpeg',
        'profiles',
      );

      // Validate S3 response
      if (!s3response || s3response.statusCode !== 201) {
        const error = 'S3 upload failed: ';

        Sentry.captureException(error, {
          extra: {
            s3response: s3response,
            filename: filename,
          },
        });

        throw error;
      }

      // Store locally only after successful S3 upload
      await StoreLocalImage(path, filename);

      const resp = await API('user/auth/uploadImage', 'POST', {
        image: s3response.response,
      });

      if (resp.body.statusCode === 200) {
        setData('USER', JSON.stringify(resp.body.data));
        navigation.navigate('PersonliseQuestions');
      } else {
        const error = 'API upload failed:';

        Sentry.captureException(error, {
          extra: {
            response: resp,
          },
        });

        throw error;
      }
    } catch (error) {
      console.error('Upload error:', error);

      Sentry.captureException(error, {
        extra: {
          imageUri: imageUri?.path,
          error: error,
        },
      });

      ToastMessage(
        error.message || error || 'Failed to upload image. Please try again.',
      );
    } finally {
      setloader(false);
    }
  };

  async function StoreLocalImage(imageUri, fileName) {
    // Request necessary permissions if needed (e.g., for Android)
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path

    //const directoryPath = `${picturesPath}/${directoryName}`; // Specify the name of your directory
    const directoryPath = picturesPath;
    // Check if the directory exists, and create it if it doesn't
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
    }

    const destinationPath = `${directoryPath}/${fileName}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(imageUri, destinationPath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  }

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => {
        inputNameRef?.current?.focus?.();
      }, 1000);
    } else if (step === 2) {
      setTimeout(() => {
        inputAgeRef?.current?.focus?.();
      }, 500);
    } else if (step === 3) {
      setTimeout(() => {
        inputEmailRef?.current?.focus?.();
      }, 500);
    } else if (step === 4) {
      setTimeout(() => {
        inputEmailOtpRef?.current?.focus?.();
      }, 500);
    }
  }, [step]);

  async function getKeyPair(keyType) {
    // let encodedPublicKey = await AsyncStorage.getItem(`publicKey${keyType}`);
    // let encodedSecretKey = await AsyncStorage.getItem(`privateKey${keyType}`);
    let encodedPublicKey = null;
    let encodedSecretKey = null;

    const keyPair =
      keyType === 'Encryption' ? nacl.box.keyPair() : nacl.sign.keyPair();
    encodedPublicKey = naclUtil.encodeBase64(keyPair.publicKey);
    encodedSecretKey = naclUtil.encodeBase64(keyPair.secretKey);

    await AsyncStorage.setItem(`publicKey${keyType}`, encodedPublicKey);
    await AsyncStorage.setItem(`privateKey${keyType}`, encodedSecretKey);

    return {
      publicKey: encodedPublicKey,
      secretKey: encodedSecretKey,
    };
  }

  const deleteSignature = () => {
    rnBiometrics.deleteKeys().then(resultObject => {
      const {keysDeleted} = resultObject;

      if (keysDeleted) {
        console.log('Successful deletion');
      } else {
        console.log(
          'Unsuccessful deletion because there were no keys to delete',
        );
      }
    });
  };

  return (
    <LinearGradient
      colors={['#E9FFFE', '#FFEBDB']}
      locations={[0, 0.3]}
      useAngle
      angle={190}
      style={styles.container}>
      <OverlayLoader visible={loader} />
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
            {step === 3 || step === 5 ? (
              <View
                style={{
                  width: 20,
                  height: scaleNew(14),
                }}
              />
            ) : (
              <Pressable
                onPress={() => {
                  if (step === 1) {
                    navigation.goBack();
                  } else if (step === 2) {
                    pageRef.current?.setPage(0);
                    setStep(1);
                  } else if (step === 3) {
                    pageRef.current?.setPage(1);
                    setStep(2);
                  } else if (step === 4) {
                    pageRef.current?.setPage(2);
                    setStep(3);
                  } else if (step === 5) {
                    pageRef.current?.setPage(2);
                    setStep(3);
                  }
                }}>
                <Image
                  style={{
                    height: scaleNew(14),
                  }}
                  source={require('../../assets/images/ic_back.png')}
                />
              </Pressable>
            )}

            <PaginationDotComp
              currentIndex={step - 1}
              totalDots={5}
              activeColor="#808491"
              inactiveColor="#D8D8D8"
              size={scaleNew(5)}
              viewStyle={{
                backgroundColor: colors.white,
                borderRadius: scaleNew(100),
                // width: scaleNew(100),
                //  height: scaleNew(100),
                alignItems: 'center',
                justifyContent: 'center',
                padding: scaleNew(4),
                //  marginTop: scaleNew(22),
              }}
            />
          </View>
          <PagerView
            scrollEnabled={false}
            ref={pageRef}
            initialPage={VARIABLES?.user?.emailVerified ? 4 : 0}
            style={{flex: 1}}
            onPageScroll={() => {
              Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver: false,
              });
            }}
            onPageSelected={e => {
              setStep(e.nativeEvent.position + 1);
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.4,
                  marginTop: scaleNew(100),
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.title}>What’s your full name?</Text>
                  <Text style={styles.subTitle}>
                    We’ll use your first name across the app
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      placeholder="First name last name"
                      onSubmitEditing={() => {
                        if (fullName?.trim?.()?.length === 0) {
                          ToastMessage('Please enter your name');
                          return;
                        }
                        pageRef.current?.setPage(1);
                        setStep(2);
                      }}
                      ref={inputNameRef}
                      placeholderTextColor={'#929292'}
                      style={{...styles.textInput}}
                      onChangeText={e => {
                        setFullName(e);
                      }}
                      value={fullName}
                      returnKeyType="done"
                    />
                  </View>
                  <Pressable
                    onPress={() => {
                      if (fullName?.trim?.()?.length === 0) {
                        ToastMessage('Please enter your name');
                        return;
                      }
                      pageRef.current?.setPage(1);
                      setStep(2);
                    }}
                    style={{
                      marginStart: scaleNew(10),
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/arrowRightBg.png')}
                    />
                  </Pressable>
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
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.title}>What’s your age?</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.subTitle}>
                      No existential angst please{' '}
                    </Text>
                    <Text
                      style={{
                        ...styles.subTitle,
                        marginTop:
                          Platform.OS === 'ios' ? scaleNew(6) : scaleNew(9),
                      }}>
                      👀
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      ref={inputAgeRef}
                      placeholder="Your age"
                      maxLength={2}
                      onSubmitEditing={() => {
                        const age = parseInt(yourAge?.trim?.());

                        if (isNaN(age) || age < 18 || age > 100) {
                          ToastMessage(
                            'Please enter a valid age between 18 and 99',
                          );
                          return;
                        }
                        pageRef.current?.setPage(2);
                        setStep(3);
                      }}
                      placeholderTextColor={'#929292'}
                      style={{...styles.textInput}}
                      keyboardType="numeric"
                      onChangeText={e => {
                        setYourAge(e);
                      }}
                      value={yourAge}
                      returnKeyType="done"
                    />
                  </View>
                  <Pressable
                    onPress={() => {
                      const age = parseInt(yourAge?.trim?.());

                      if (isNaN(age) || age < 18 || age > 99) {
                        ToastMessage(
                          'Please enter a valid age between 18 and 99',
                        );
                        return;
                      }
                      pageRef.current?.setPage(2);
                      setStep(3);
                    }}
                    style={{
                      marginStart: scaleNew(10),
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                      }}
                      source={require('../../assets/images/arrowRightBg.png')}
                    />
                  </Pressable>
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
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={styles.title}>Verify your email id</Text>
                  <Text style={{...styles.subTitle, color: 'transparent'}}>
                    This allows you to log in to Closer even when you change
                    your contact
                  </Text>
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
                          signUpStepTwo();
                        }}
                      />
                    </View>
                    <Pressable
                      onPress={() => {
                        if (email?.trim?.()?.length === 0) {
                          ToastMessage('Please enter your email address');
                          return;
                        }
                        if (!validateEmail(email?.trim?.())) {
                          ToastMessage('Please enter a valid email address');
                          return;
                        }
                        signUpStepTwo();
                      }}
                      style={{
                        marginStart: scaleNew(10),
                      }}>
                      <Image
                        style={{
                          resizeMode: 'contain',
                        }}
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
                    ref={inputEmailOtpRef}
                    autoFocus={false}
                    numberOfDigits={4}
                    onTextChange={text => setCodeEmail(text)}
                    focusColor={colors.blue1}
                    onFilled={code => {
                      verifyEmailOtp(code);
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
                    <TimerComp
                      timeVal={timerEmail}
                      startTimer={startTimerEmail}
                    />
                    <View />
                    <Pressable
                      disabled={!!timerEmail}
                      onPress={resendOtpHandlerEmail}>
                      <Text
                        style={{
                          ...globalStyles.regularMediumText,
                          color: !!timerEmail
                            ? colors.blueInactive
                            : colors.blue1,
                        }}>
                        Resend OTP
                      </Text>
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={() => {
                      if (codeEmail?.trim?.()?.length !== 4) {
                        ToastMessage('Please enter the OTP');
                        return;
                      }
                      verifyEmailOtp(codeEmail);
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

            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
              }}>
              <Text style={{...styles.title, textAlign: 'center'}}>
                It’s a better experience with{`\n`}your display picture!
              </Text>
              <Pressable
                style={{
                  alignSelf: 'center',
                }}
                onPress={() => {
                  setGalleryAndCameraModal(true);
                }}>
                <Image
                  source={
                    imageUri
                      ? {uri: imageUri.path}
                      : require('../../assets/images/dummyImgUserLarge.png')
                  }
                  style={{
                    width: 230,
                    height: 230,
                    borderRadius: 230,
                  }}
                />
                <Image
                  style={{
                    position: 'absolute',
                    right: scaleNew(16),
                    bottom: scaleNew(16),
                  }}
                  source={require('../../assets/images/plusBgWhite.png')}
                />
              </Pressable>
              <View
                style={{
                  // flexDirection: 'row',
                  //  alignItems: 'center',
                  paddingVertical: scaleNew(13),
                  paddingHorizontal: scaleNew(11),
                  // paddingEnd: scaleNew(8),
                  borderRadius: 8,
                  backgroundColor: '#FFFAF6',
                  marginBottom: scaleNew(17),
                  shadowColor: colors.shadow,
                  shadowOffset: {width: 4, height: scaleNew(4)},
                  shadowOpacity: 0.1,
                  shadowRadius: scaleNew(4),
                  elevation: scaleNew(2),
                  marginHorizontal: scaleNew(16),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{
                      resizeMode: 'contain',
                    }}
                    source={require('../../assets/images/bulbRound.png')}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.standardFont,
                      fontSize: scaleNew(14),
                      color: '#737373',
                      marginStart: scaleNew(8),
                      includeFontPadding: false,
                      marginTop: scaleNew(2),
                    }}>
                    Little tip!
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: fonts.notoSansRegular,
                    fontSize: scaleNew(14),
                    color: '#808491',
                    marginTop: scaleNew(10),
                  }}>
                  Add a photo where only you’re visible, or it might get
                  confusing with your partner’s dp!
                </Text>
              </View>
              {/* {imageUri !== '' ? ( */}
              <View style={{marginBottom: scaleNew(80)}}>
                {imageUri !== '' ? (
                  <AppButton
                    onPress={() => {
                      if (imageUri !== '') {
                        uploadImage();
                      }
                    }}
                    style={{
                      //  marginHorizontal: scaleNew(50),

                      opacity: imageUri !== '' ? 1 : 0.5,
                    }}
                    text="Continue"
                  />
                ) : (
                  <AppButton
                    onPress={() => {
                      navigation.navigate('PersonliseQuestions');
                    }}
                    style={{
                      //  marginHorizontal: scaleNew(50),
                      backgroundColor: 'transparent',
                      borderWidth: scaleNew(1),
                      borderColor: colors.blue1,
                    }}
                    textStyle={{
                      color: colors.blue1,
                    }}
                    text="Skip for now"
                  />
                )}
              </View>
              {/* ) : (
                <View
                  style={{
                    height: 55,
                  }}
                />
              )} */}
            </View>
          </PagerView>
        </LinearGradient>
      </View>

      {galleryAndCameraModal && (
        <ImagePickerModal
          modalVisible={galleryAndCameraModal}
          setModalVisible={setGalleryAndCameraModal}
          imageHandler={() => {
            setGalleryAndCameraModal(false);
            setTimeout(() => {
              handleGalleryPicker();
            }, 500);
          }}
          cameraHandler={() => {
            setGalleryAndCameraModal(false);
            setTimeout(() => {
              handleCameraPicker();
            }, 500);
          }}
          onDismissCard={() => {}}
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
    includeFontPadding: false,
    color: '#808491',
    padding: 0,
    margin: 0,
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
