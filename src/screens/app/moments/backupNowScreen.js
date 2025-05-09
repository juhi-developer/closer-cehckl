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
import AppView from '../../../components/AppView';
import {colors} from '../../../styles/colors';

import {scale} from '../../../utils/metrics';
import {fonts} from '../../../styles/fonts';
import RestoreModal from '../../../components/Modals/RestoreModal';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import CenteredHeader from '../../../components/centeredHeader';
import {
  backgroundActionOptions,
  backupEmailUpdateApi,
  fetchDirectoryContents,
  formatBytes,
  getFileNameApi,
  getMimeType,
  getTotalSize,
  listAppdata,
  listAvailableLocalFiles,
  listLocalFiles,
  removePersistentNotification,
  showPersistentNotification,
  uploadFile,
  veryIntensiveTask,
} from '../../../backup/utils';
import BackgroundService from 'react-native-background-actions';
import BackgroundFetch from 'react-native-background-fetch';
import {backupPath, backupRealm} from '../../../backend/realm';
import notifee from '@notifee/react-native';
import {
  MessageSchema,
  QuotedMessages,
  ReactionSchema,
} from '../../../backend/schemas';
import {useRealm} from '@realm/react';
import {useSync} from '../../../utils/SyncContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../../../redux/saga/request';
import {globalStyles} from '../../../styles/globalStyles';

export default function BackupNowScreen(props) {
  const realm = useRealm();

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

  const {route, navigation} = props;
  const accessToken = route.params?.accessToken;
  const email = route.params?.email;
  const [restoreModal, setRestoreModal] = useState(false);

  // useEffect(() => {
  //   const startBackup = async () => {
  //     if (!isSyncing && !isBackupCompleted) {
  //       updateProgress(0);
  //       await BackgroundService.stop();

  //       startSync();
  //       syncFiles(accessToken);
  //     } else {
  //     }
  //   };
  //   startBackup();
  // }, [isSyncing, startSync, isBackupCompleted]);

  useEffect(() => {
    return () => {
      setIsBackupCompleted(false);
    };
  }, []);

  async function syncFiles(accessToken) {
    try {
      await backupRealm();
      const driveFiles = await listAppdata(accessToken);
      const chatFileNames = await listAvailableLocalFiles(realm);
      const localFiles = await listLocalFiles();
      const fileNames = await getFileNameApi();

      let data = {
        email: email,
      };
      console.log('emaillllll', email);
      await backupEmailUpdateApi(data);

      const allFileNames = [
        ...new Set([...localFiles, ...chatFileNames, ...fileNames]),
      ];

      const driveFileNames = new Set(driveFiles.map(file => file.name));

      const filesToUpload = allFileNames.filter(
        file => !driveFileNames.has(file.name) || file.name.endsWith('.realm'),
      );

      const totalSizeDrive = driveFiles.reduce(
        (acc, file) => acc + (parseInt(file.size, 10) || 0),
        0,
      );

      // Calculate total size of files to be uploaded
      const totalSizeLocal = filesToUpload.reduce(
        (acc, file) => acc + file.size,
        0,
      );

      // Combine total sizes
      const combinedTotalSize = totalSizeDrive + totalSizeLocal;

      setTotalDataSize(formatBytes(totalSizeLocal));

      const totalFiles = filesToUpload.length;
      let uploadedCount = 0;

      await BackgroundService.start(veryIntensiveTask, backgroundActionOptions);

      console.log('files to upload', JSON.stringify(fileNames));

      for (let file of filesToUpload) {
        await uploadFile(file.path, file.name, accessToken, () => {
          uploadedCount++;
          updateProgress((uploadedCount / totalFiles) * 100);
        });
      }

      // Task finished, save current date and time and total size
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem('lastBackupDate', currentDate);

      // Save combined total size to AsyncStorage
      if (combinedTotalSize !== 0) {
        await AsyncStorage.setItem(
          'lastBackupSize',
          combinedTotalSize.toString(),
        );
      }

      stopSync();
      await BackgroundService.stop();
      //   removePersistentNotification();
      setIsBackupCompleted(true);
      console.log('Sync complete. Files uploaded:', filesToUpload.length);
    } catch (error) {
      await BackgroundService.stop();
      reportError();
      console.error('Error syncing files:', error);
    }
  }

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        title={isSyncing ? 'Backup in progress!' : 'Backup data'}
        //  rightIcon={<View style={styles.icon} />}
        // rightPress={() => props.navigation.navigate('notification')}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  return (
    <AppView
      header={AppHeader}
      customContainerStyle={styles.container}
      scrollContainerRequired={true}
      isScrollEnabled={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
        }}>
        <View
          style={{
            marginTop: scale(10),
            paddingHorizontal: scale(16),
          }}>
          {/* <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scale(24),
              color: colors.text,
            }}>
            Backup in progress!
          </Text> */}
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.black,
              marginTop: scale(8),
            }}>
            Your data is important. By backing it up, you ensure that you don't
            lose data if your device crashes or gets lost.
          </Text>

          <>
            {!isBackupCompleted ? (
              <>
                <View
                  style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: scale(20),
                    paddingVertical: scale(30),
                    borderRadius: scale(20),
                    marginTop: scale(20),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBoldFont,
                      fontSize: scale(16),
                      color: colors.text,
                      textAlign: 'center',
                    }}>
                    {isSyncing ? 'Backing up your data...' : 'Backup data'}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(16),
                      color: colors.text,
                      marginTop: scale(10),
                      textAlign: 'center',
                    }}>
                    {!isSyncing
                      ? 'Please press the button below to start the backup process.'
                      : 'We are backing up your data, please wait while the process is going on!'}
                  </Text>
                  {isSyncing && (
                    <>
                      {totalDataSize === 0 ? (
                        <Text
                          style={{
                            fontFamily: fonts.regularFont,
                            fontSize: scale(16),
                            color: colors.blue1,
                            marginTop: scale(10),
                          }}>
                          Calculating size of data...
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontFamily: fonts.regularFont,
                            fontSize: scale(16),
                            color: colors.blue1,
                            marginTop: scale(10),
                          }}>
                          Total Size - {totalDataSize}
                        </Text>
                      )}
                    </>
                  )}

                  <View
                    style={{
                      alignItems: 'center',
                    }}>
                    {!isSyncing && (
                      <Pressable
                        style={{
                          height: 40,
                          backgroundColor: colors.blue1,
                          paddingHorizontal: scale(20),
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: scale(20),
                          borderRadius: scale(300),
                          flexShrink: 1,
                          //  maxWidth: scale(160),
                        }}
                        onPress={async () => {
                          await BackgroundService.stop();

                          startSync();
                          syncFiles(accessToken);
                        }}>
                        <Text
                          style={{
                            fontFamily: fonts.semiBoldFont,
                            fontSize: scale(14),
                            color: colors.white,
                          }}>
                          Backup now
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  {totalDataSize !== 0 && (
                    <>
                      <View style={styles.progressBar}>
                        <View
                          style={
                            ([StyleSheet.absoluteFill],
                            {
                              backgroundColor: '#7984EA',
                              width: `${percentageUploaded}%`,
                            })
                          }
                        />
                      </View>

                      <Text
                        style={{
                          fontFamily: fonts.standardFont,
                          fontSize: scale(14),
                          color: colors.text,
                        }}>
                        {percentageUploaded}% complete
                      </Text>
                    </>
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: scale(16),
                    color: colors.black,
                    marginTop: scale(20),
                    textAlign: 'center',
                  }}>
                  Please do not shut the app!
                </Text>
              </>
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: colors.white,
                    paddingHorizontal: scale(20),
                    paddingBottom: scale(30),
                    paddingTop: scale(20),
                    borderRadius: scale(20),
                    marginTop: scale(20),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../../assets/images/greenTick.png')}
                  />
                  <Text
                    style={{
                      fontFamily: fonts.semiBoldFont,
                      fontSize: scale(16),
                      color: colors.text,
                      textAlign: 'center',
                    }}>
                    Backup completed
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(16),
                      color: colors.text,
                      marginTop: scale(10),
                      textAlign: 'center',
                    }}>
                    Your backup has been successfully completed!
                  </Text>
                </View>
                <Pressable
                  onPress={() => props.navigation.popToTop()}
                  style={{
                    // flex: 1,
                    height: scale(50),
                    borderWidth: 1,
                    borderColor: colors.blue1,
                    backgroundColor: colors.blue1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(10),
                    marginTop: scale(30),
                    alignSelf: 'center',
                    width: scale(234),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.standardFont,
                      fontSize: scale(18),
                      color: colors.white,
                    }}>
                    Done
                  </Text>
                </Pressable>
              </>
            )}
          </>
        </View>
      </View>
      <RestoreModal
        modalVisible={restoreModal}
        setModalVisible={setRestoreModal}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    // flex: 1
  },
  progressBar: {
    height: 12,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.grey1,
    overflow: 'hidden',
    borderRadius: 40,
    marginTop: 12,
    marginBottom: 14,
  },
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    fontWeight: 600,
    // color: colors.blue1
  },
});
