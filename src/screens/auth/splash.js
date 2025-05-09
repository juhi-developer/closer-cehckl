import {ImageBackground, View} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VARIABLES} from '../../utils/variables';
import {ASYNC_STORAGE_KEYS, getData, setData} from '../../utils/storage';
import {EventRegister} from 'react-native-event-listeners';
import {useSocket} from '../../utils/socketContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import RNExitApp from 'react-native-exit-app';
import API from '../../redux/saga/request';
import {safeGetItem, safeSetItem} from '../../utils/utils';

export default function Splash(props) {
  const {connectSocket} = useSocket();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  useEffect(() => {
    // props.navigation.replace('App');
    // return;
    async function initializeApp() {
      try {
        const token = await safeGetItem('TOKEN');
        const jsonUser = await safeGetItem('USER');

        if (token && jsonUser) {
          VARIABLES.token = token;
          VARIABLES.user = jsonUser;
          if (
            jsonUser._id !== undefined &&
            jsonUser._id !== '' &&
            jsonUser._id !== null
          ) {
            await AsyncStorage.setItem('CURRENT_USER_ID', jsonUser._id);
            await AsyncStorage.setItem('CURRENT_USER_EMAIL', jsonUser.email);
          }
          VARIABLES.disableTouch = !jsonUser.partnerCodeVerified;

          connectSocket(token);

          if (!jsonUser.personalizeFilled) {
            const resp = await API('user/profile', 'GET', null, null, 5000);
            const userProfile = resp.body.data;
            if (userProfile) {
              VARIABLES.user = userProfile;
              await safeSetItem('USER', userProfile);
              onNavigate(userProfile);
            } else {
              onNavigate(jsonUser);
            }
          } else {
            onNavigate(jsonUser);
          }
        } else {
          props.navigation?.replace('Auth', {screen: 'Onboarding1'});
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        props.navigation?.replace('Auth', {screen: 'Onboarding1'});
      } finally {
        EventRegister.emit('splashComplete');
      }
    }
    initializeApp();
  }, []);

  const onNavigate = async user => {
    // props.navigation?.replace('Auth', {
    //   screen: 'Signup',
    // });
    // return;

    const backupState = await AsyncStorage.getItem('backupInProgress');
    setTimeout(() => {
      if (user.isReported) {
        props.navigation.replace('App');
        return;
      }
      // if (!user.isVerified) {
      //   props.navigation?.replace('Auth', {
      //     screen: 'Signup',
      //   });
      //   return;
      // } else
      if (!user.emailVerified) {
        props.navigation?.replace('Auth', {
          screen: 'Signup',
        });
        return;
        // } else if (user.profilePic === '') {
        //   props.navigation?.replace('Auth', {
        //     screen: 'Signup',
        //   });
        //   return;
      } else if (!user.personalizeFilled) {
        props.navigation?.replace('Auth', {
          screen: 'PersonliseQuestions',
        });
        return;
      }
      if (backupState === 'true') {
        props.navigation?.replace('Auth', {
          screen: 'restoreBackup',
        });
      } else {
        checkBiometricKey();
      }
    }, 1200);
  };

  async function checkBiometricKey() {
    try {
      const resultObject = await rnBiometrics.biometricKeysExist();
      const {keysExist} = resultObject;

      if (keysExist) {
        try {
          const promptResult = await rnBiometrics.simplePrompt({
            promptMessage: 'Confirm fingerprint',
          });
          const {success} = promptResult;
          if (success) {
            props.navigation.replace('App');
            console.log('Successful biometrics provided');
          } else {
            console.log('User cancelled biometric prompt');
            RNExitApp.exitApp(); // Consider handling this more gracefully
          }
        } catch (error) {
          console.log('Biometrics failed:', error);
          RNExitApp.exitApp(); // Consider handling this more gracefully
        }
      } else {
        props.navigation.replace('App');
      }
    } catch (error) {
      console.error('Error checking biometric keys:', error);
      props.navigation.replace('App'); // Fallback navigation
    }
  }

  return (
    <View testID="splash-screen" style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/splashBg.png')}
        style={{flex: 1}}>
        {/* <LinearGradient
        colors={['#F5F1F0', '#8F8D8C']}
        style={{
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
          justifyContent: 'center',
          alignItems: 'center',
        }}> */}

        {/*         
      </LinearGradient> */}
      </ImageBackground>
    </View>
  );
}
