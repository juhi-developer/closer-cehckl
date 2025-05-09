import React, {useEffect, useContext} from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import {useSync} from './SyncContext';
import {shouldStartBackup, showPersistentNotification} from '../backup/utils';
import API from '../redux/saga/request';
import {Platform} from 'react-native';
import {syncFiles} from './SyncFiles';
import {refresh} from 'react-native-app-auth';
import {googleConfig} from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SyncSetup = () => {
  const {
    isSyncing,
    percentageUploaded,
    totalDataSize,
    setTotalDataSize,
    startSync,
    updateProgress,
    stopSync,
    viewType,
    setViewType,
    isBackupCompleted,
    setIsBackupCompleted,
    reportError,
  } = useSync();

  useEffect(() => {
    async function setupBackgroundFetch() {
      await BackgroundFetch.stop()
        .then(() => {
          console.log('Stopped existing background fetch tasks.');
        })
        .catch(err => {
          console.error('Failed to stop existing tasks:', err);
        });

      configureBackgroundFetch();
    }

    setupBackgroundFetch();
  }, []);

  const configureBackgroundFetch = () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // Adjust according to your needs
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
      },
      async taskId => {
        console.log('[BackgroundFetch] taskId: ', taskId);

        const shouldStart = await shouldStartBackup();
        if (shouldStart) {
          try {
            const refreshToken = await AsyncStorage.getItem(
              'savedGoogleRefreshToken',
            );

            const refreshedState = await refresh(googleConfig, {
              refreshToken: refreshToken,
            });
            console.log('success refresh token sync setup.js', refreshedState);
            const accessToken = refreshedState.accessToken;
            if (accessToken) {
              startSync();
              await syncFiles(
                accessToken,
                updateProgress,
                setTotalDataSize,
                stopSync,
                setIsBackupCompleted,
                reportError,
              );
              console.log('[BackgroundSync] Files synced successfully.');
            } else {
              console.log('[BackgroundSync] Failed to sync token:');
            }
          } catch (error) {
            console.error('error', error);
          } finally {
            BackgroundFetch.finish(taskId);
          }
        } else {
          console.log('Backup not required at this time.');
          BackgroundFetch.finish(taskId);
        }
      },
      error => {
        console.error('[BackgroundFetch] Failed to start:', error);
      },
    );
  };

  return null;
};

export default SyncSetup;
