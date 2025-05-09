/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {fonts} from '../../../styles/fonts';
import {colors} from '../../../styles/colors';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {scale} from '../../../utils/metrics';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {set} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
import {backupRealm, restoreRealm} from '../../../backend/realm';
import {useRealm} from '@realm/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../../redux/saga/request';
import BackgroundFetch from 'react-native-background-fetch';
import {
  formatBytes,
  listAppdata,
  listLocalFiles,
  uploadFile,
} from '../../../backup/utils';
import {useSync} from '../../../utils/SyncContext';
import {globalStyles} from '../../../styles/globalStyles';
import {ToastMessage} from '../../../components/toastMessage';
import {updateContextualTooltipState} from '../../../utils/contextualTooltips';
import {getGoogleUserInfo, googleConfig} from '../../../utils/utils';
import {authorize} from 'react-native-app-auth';

export default function BackupNow(props) {
  const {route, navigation} = props;

  console.log('props route', route);

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        title={'Backup your data'}
        //    rightIcon={<View style={styles.icon} />}
        // rightPress={() => props.navigation.navigate('notification')}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  // useEffect(() => {

  //   await AsyncStorage.setItem('backupNowScreenVisited', 'true');
  // }, [])

  useEffect(() => {
    onScreenVisited();
  }, []);

  const onScreenVisited = async () => {
    await updateContextualTooltipState('backupNowScreenVisited', true);
  };

  const sendServerAuth = async authKey => {
    console.log('authh keyyyyy', authKey);
    const payload = {
      serverAuthCode: authKey,
    };
    try {
      const resp = await API(`user/auth/googleAuth`, 'POST', payload);

      console.log('success server auth', resp);
    } catch (error) {
      console.log('error', error.response);
    }
  };

  const googleSignIn = async () => {
    try {
      const authState = await authorize(googleConfig);
      console.log('authState:', authState);

      const userInfo = await getGoogleUserInfo(authState.accessToken);

      console.log('userInfo:', userInfo);

      ToastMessage('Google Drive authenticated successfully');

      if (route?.params?.navigateFrom === 'moments') {
        const backFreq = await AsyncStorage.getItem('backupFrequency');

        props.navigation.navigate('AutoBackup', {
          backupFrequency: backFreq,
        });
      } else {
        props.navigation.navigate('backupNowScreen', {
          accessToken: authState.accessToken,
          email: userInfo?.email,
        });
      }
      AsyncStorage.setItem('savedGoogleRefreshToken', authState.refreshToken);
      AsyncStorage.setItem('googleEmail', userInfo.email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('error google', error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('error google', error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('error google', error);
        // play services not available or outdated
      } else {
        console.log('error google', error);
        // some other error happened
      }
    }
  };

  return (
    <AppView
      customContainerStyle={styles.container}
      scrollContainerRequired={true}
      header={AppHeader}
      isScrollEnabled={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
          //  padding: scale(20),
        }}>
        {/* <Text
          style={{
            fontSize: 24,
            fontFamily: fonts.semiBoldFont,
            color: colors.text,
            marginStart: scale(20),
          }}>
          Keep your data safe!
        </Text> */}

        <Image
          resizeMode="contain"
          style={{
            resizeMode: 'contain',
            // height: scale(350),
            height: scale(329),
            width: '100%',
            //  marginTop: scale(20),
          }}
          source={require('../../../assets/images/backupIllustration.png')}
        />
        {/* <FastImage
          style={{
            width: 200,
            height: 200,
            backgroundColor: 'red',
          }}
          source={{
            uri: 'file:///var/mobile/Containers/Data/Application/4A064FFD-CE4F-4BA4-9ABF-D4DC62873A7E/Documents/6372891f-cf8b-4867-b274-bdb06abcd15d1713251641833.jpg',
          }}
        /> */}
        <View
          style={{
            padding: scale(16),
          }}>
          <Text
            style={{
              fontSize: scale(16),
              fontFamily: fonts.regularFont,
              color: '#3B3B3B',
            }}>
            Due to end-to-end encryption, some data is stored on your device,
            and needs to be backed up, in case of change of device, uninstall,
            etc.
          </Text>
          <Text
            style={{
              fontSize: scale(18),
              fontFamily: fonts.semiBoldFont,
              color: '#444444',
              marginTop: scale(16),
              marginBottom: scale(12),
            }}>
            What's backed up?
          </Text>

          <View
            style={{
              backgroundColor: '#EFE8E6',
              paddingHorizontal: scale(16),
              paddingVertical: scale(12),
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: scale(8),
            }}>
            <Image
              style={{width: scale(48), height: scale(48)}}
              source={require('../../../assets/images/coversationBg.png')}
            />
            <View style={{marginLeft: scale(16)}}>
              <Text
                style={{
                  fontFamily: fonts.standardFont,
                  fontSize: scale(16),
                  color: '#444444',
                }}>
                Chats
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regularFont,
                  fontSize: scale(14),
                  color: '#808491',
                }}>
                Your messages & media shared in chat
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: '#EFE8E6',
              paddingHorizontal: scale(16),
              paddingVertical: scale(12),
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: scale(10),
              borderRadius: scale(8),
            }}>
            <Image
              style={{width: scale(48), height: scale(48)}}
              source={require('../../../assets/images/closerBackupIcon.png')}
            />
            <View style={{marginLeft: scale(16)}}>
              <Text
                style={{
                  fontFamily: fonts.standardFont,
                  fontSize: scale(16),
                  color: '#444444',
                }}>
                Memories
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regularFont,
                  fontSize: scale(14),
                  color: '#808491',
                }}>
                Your photos and saved stories
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              googleSignIn();
            }}
            style={{
              // flex: 1,
              height: scale(50),
              borderWidth: 1,
              borderColor: colors.blue1,
              backgroundColor: colors.blue1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: scale(10),
              marginTop: scale(44),
              marginHorizontal: scale(20),
            }}>
            <Text
              style={{
                fontFamily: fonts.standardFont,
                fontSize: scale(18),
                color: colors.white,
                includeFontPadding: false,
              }}>
              Authenticate Google Drive
            </Text>
          </Pressable>
        </View>
      </View>
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    // flex: 1
  },
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    fontWeight: 600,
    // color: colors.blue1
  },
});
