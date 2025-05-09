import API from '../redux/saga/request';
import BackgroundFetch from 'react-native-background-fetch';
import {syncFiles} from './SyncFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refresh} from 'react-native-app-auth';
import {googleConfig} from './utils';

const headlessSyncTask = async event => {
  console.log('[BackgroundSync] Start syncing files.');
  try {
    const refreshToken = await AsyncStorage.getItem('savedGoogleRefreshToken');

    const refreshedState = await refresh(googleConfig, {
      refreshToken: refreshToken,
    });
    if (refreshedState?.accessToken) {
      const accessToken = refreshedState.accessToken;
      await syncFiles(accessToken);

      console.log('[BackgroundSync] Files synced successfully.');
    } else {
      console.log('[BackgroundSync] Failed to sync token:');
    }
  } catch (error) {
    console.log('error', error);
  } finally {
    BackgroundFetch.finish(event.taskId);
  }
};

export default headlessSyncTask;
