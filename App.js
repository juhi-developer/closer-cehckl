import React, {useEffect, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  StatusBar,
  StyleSheet,
  View,
  NativeModules,
  AppState,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import RootStackScreen from './src/navigations/routes';
import {Provider} from 'react-redux';

import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import store from './src/redux/store';

import {LogBox} from 'react-native';
import navigationServices from './src/navigations/navigationServices';
import {MOODS_FEELINGS} from './src/utils/constants';
import {NetworkProvider} from './src/components/NetworkContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SocketProvider from './src/utils/socketContext';
import {VariableProvider} from './src/utils/VariablesContext';
import * as Sentry from '@sentry/react-native';
import {AppStateProvider} from './src/utils/AppStateContext';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {EventRegister} from 'react-native-event-listeners';
import ShareSheetModal from './src/components/Modals/ShareSheetModal';
import {SyncProvider} from './src/utils/SyncContext';

import SyncSetup from './src/utils/SyncSetup';
import {Provider as ModalProvider} from 'react-native-js-only-modal';
import {KeyboardProvider} from 'react-native-keyboard-controller';

Sentry.init({
  dsn: 'https://616eca80ad5f01f4d781e6e33e13b417@o4507883214864384.ingest.us.sentry.io/4507883216175104',
  //dsn: 'https://76c1e7e936bba44a607c2d4469c291cd@o4506546830770176.ingest.sentry.io/4506546831949824',
  tracesSampleRate: 1.0,
});

const CleverTap = require('clevertap-react-native');

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const App = () => {
  const [shareSheet, setShareSheet] = useState(false);
  const [shareMedia, setShareMedia] = useState([]);

  useEffect(() => {
    ReceiveSharingIntent.getReceivedFiles(
      files => {
        setShareMedia(files);
        setShareSheet(true);
      },
      error => {},
      'ShareMedia',
    );
    return () => {
      ReceiveSharingIntent.clearReceivedFiles();
    };
  }, []);

  const handleShareFeed = () => {
    //  navigationServices.navigate('Moments', shareMedia);
    setTimeout(() => {
      EventRegister.emit('shareContentFeed', shareMedia);
    }, 200);
  };

  const handleShareChat = () => {
    navigationServices.navigate('Chat', shareMedia);
    setTimeout(() => {
      EventRegister.emit('shareContentChat', shareMedia);
    }, 2000);
  };

  const checkBackupfrequency = async () => {
    const backupFrequency = await AsyncStorage.getItem('backupFrequency');
    if (!backupFrequency) {
      await AsyncStorage.setItem('backupFrequency', 'never');
    }
  };

  useEffect(() => {
    checkBackupfrequency();
    // CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, e => {
    //   console.log('clevertap notification', e);
    // });
  }, []);

  // useEffect(() => {
  //   AppState.addEventListener('change', nextAppState => {
  //     if (nextAppState === 'active') {
  //       NativeModules.NotificationModule.clearAllNotifications();
  //     }
  //   });
  // }, []);
  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        // Clear all notifications
        NativeModules.NotificationModule.clearAllNotifications();
  
        // Check app version
       }
    };
  
    // Add event listener for app st       ate changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    // Cleanup the event listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    ///  CleverTap.registerForPush();
    CleverTap.recordEvent('App Opened');
  }, []);

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor="transparent"
      />

      <Provider store={store}>
        <GestureHandlerRootView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <KeyboardProvider>
              <NetworkProvider>
                <AppStateProvider>
                  <VariableProvider>
                    <SocketProvider>
                      <SyncProvider>
                        <ModalProvider>
                          <NavigationContainer
                            ref={ref =>
                              navigationServices.setTopLevelNavigator(ref)
                            }>
                            <BottomSheetModalProvider>
                              <RootStackScreen />
                            </BottomSheetModalProvider>
                          </NavigationContainer>
                        </ModalProvider>
                        <SyncSetup />
                      </SyncProvider>
                    </SocketProvider>
                  </VariableProvider>
                </AppStateProvider>
              </NetworkProvider>
            </KeyboardProvider>
          </View>
        </GestureHandlerRootView>
      </Provider>

      {shareSheet && (
        <ShareSheetModal
          modalVisible={shareSheet}
          setModalVisible={setShareSheet}
          feedHandler={() => {
            setShareSheet(false);
            setTimeout(() => {
              handleShareFeed();
            }, 500);
          }}
          chatHandler={() => {
            setShareSheet(false);
            setTimeout(() => {
              handleShareChat();
            }, 500);
          }}
          onDismissCard={() => {}}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({});

export default Sentry.wrap(App);
