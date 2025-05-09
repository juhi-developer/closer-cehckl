import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import {AppRegistry, Platform, NativeModules, Text} from 'react-native';
import './shim.js';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {VARIABLES} from './src/utils/variables';
import {LogBox} from './src/utils/CustomLogBox.js';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import BackgroundFetch from 'react-native-background-fetch';
import syncFiles from './src/utils/SyncFiles.js';
import headlessSyncTask from './src/utils/headlessSyncTask.js';
import {install} from 'react-native-quick-crypto';

install();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs([
  'source.uri should not be an empty string',
  'Selector unknown returned the root state when called. This can lead to unnecessary rerenders',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
  'VirtualizedLists should never be nested inside plain ScrollViews',
  `ViewPropTypes will be removed from React Native`,
]);

global.__IS_TESTING__ = NativeModules?.LaunchArgs?.isTesting === 'true';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  VARIABLES.notificationId = remoteMessage.messageId;
});

notifee.registerForegroundService(notification => {
  return new Promise(() => {
    notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        //   notifee.stopForegroundService();
      }
    });
  });
});

AppRegistry.registerComponent(appName, () => App);

BackgroundFetch.registerHeadlessTask(headlessSyncTask);
