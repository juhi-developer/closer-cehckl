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
import AppView from '../../components/AppView';
import {colors} from '../../styles/colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  globalStyles,
} from '../../styles/globalStyles';
import {CommonActions} from '@react-navigation/native';
import BackgroundService from 'react-native-background-actions';

import {scale} from '../../utils/metrics';
import {fonts} from '../../styles/fonts';
import RestoreModal from '../../components/Modals/RestoreModal';
import {VARIABLES} from '../../utils/variables';
import FastImage from 'react-native-fast-image';
import {APP_IMAGE} from '../../utils/constants';
import {AWS_URL_S3} from '../../utils/urls';
import axios from 'axios';
import RNFS from 'react-native-fs';
import {
  formatBytes,
  listLocalFiles,
  listLocalFilesAll,
} from '../../backup/utils';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {restoreRealm} from '../../backend/realm';
import {useRealm} from '@realm/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ProfileAvatar} from '../../components/ProfileAvatar';
import {getGoogleUserInfo, googleConfig} from '../../utils/utils';
import {authorize} from 'react-native-app-auth';

export default function RestoreBackup(props) {
  const {navigation} = props;

  const [restoreModal, setRestoreModal] = useState(false);

  const [viewType, setViewType] = useState(1);
  const [percentageUploaded, setPercentageUploaded] = useState(0);
  const [totalDataSize, setTotalDataSize] = useState(0);
  const [googleToken, setGoogleToken] = useState('');
  const [googleMail, setGoogleMail] = useState('');

  const sleep = time =>
    new Promise(resolve => setTimeout(() => resolve(), time));

  const veryIntensiveTask = async taskDataArguments => {
    // Example of an infinite loop task
    const {delay} = taskDataArguments;
    await new Promise(async resolve => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log(i);
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'Closer',
    taskTitle: 'Closer Backup Task',
    taskDesc: '',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#4191f4',
    //linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
      delay: 1000,
    },
  };

  const googleSignIn = async () => {
    try {
      const authState = await authorize(googleConfig);
      console.log('authState:', authState);

      const userInfo = await getGoogleUserInfo(authState.accessToken);

      console.log('userInfo:', userInfo);

      setGoogleToken(authState.accessToken);
      setGoogleMail(userInfo?.email);
      console.log('back up email', userInfo?.email);
      console.log('vairble email', VARIABLES.user.backupEmail);
      if (VARIABLES.user.backupEmail !== userInfo?.email) {
        GoogleSignin.signOut();
        alert(
          'Email address mismatch: The backup was created using a different email account.',
        );
        return;
      }
      downloadAllFiles(authState.accessToken, updateProgress);
    } catch (error) {
      alert('Failed to sign in with Google.');
    }
  };

  useEffect(() => {
    AsyncStorage.setItem('backupInProgress', 'true');
    setViewType(1);
  }, []);

  async function getTotalSizeAndFiles(accessToken) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await axios.get(
        'https://www.googleapis.com/drive/v3/files',
        {
          headers: headers,
          params: {
            spaces: 'appDataFolder',
            fields:
              'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
            pageSize: 1000,
            q: 'trashed = false', // Generic filter to avoid deleted files, adjust as necessary
          },
        },
      );
      const files = response.data.files;
      const totalSize = files.reduce(
        (acc, file) => acc + (file.size ? parseInt(file.size) : 0),
        0,
      );

      // Find the latest `closer_backup.realm` file
      const realmFiles = files.filter(
        file => file.name === 'closer_backup.realm',
      );
      const latestRealmFile = realmFiles.sort(
        (a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime),
      )[0];

      // Filter to include all files except non-latest .realm files
      const filteredFiles = files
        .map(file => ({
          ...file,
          isLatest: latestRealmFile ? file.id === latestRealmFile.id : false,
        }))
        .filter(file => file.name !== 'closer_backup.realm' || file.isLatest);

      console.log(
        "Latest 'closer_backup.realm' file ID:",
        latestRealmFile ? latestRealmFile.id : null,
      );
      console.log('Filtered files:', filteredFiles);

      return {files: filteredFiles, totalSize};
    } catch (err) {
      console.error('Error listing appdata files:', err);
      throw err;
    }
  }

  function adjustFileSizes(driveFiles, localFiles) {
    // Create a Set of names of local files for quick lookup
    const localFileNames = new Set(localFiles.map(file => file.name));

    // Filter out drive files that are also present locally
    const uniqueDriveFiles = driveFiles.filter(
      file => !localFileNames.has(file.name),
    );

    // Calculate the total size of unique Drive files

    const totalDriveSizeUnique = uniqueDriveFiles.reduce(
      (acc, file) => acc + (parseInt(file.size, 10) || 0),
      0,
    );
    const totalSizeLocal = localFiles.reduce(
      (acc, file) => acc + (parseInt(file.size, 10) || 0),
      0,
    );
    // Calculate the total size of local files (for local files we assume it's already calculated)

    console.log('Unique Drive File Sizes:', totalDriveSizeUnique);
    console.log('Local File Sizes:', totalSizeLocal);

    return {
      uniqueDriveFiles,
      totalDriveSizeUnique,
      totalSizeLocal,
    };
  }

  async function downloadAllFiles(accessToken, updateProgress) {
    try {
      const {files: driveFiles, totalSize} = await getTotalSizeAndFiles(
        accessToken,
      );

      const localFiles = await listLocalFilesAll();

      const {uniqueDriveFiles, totalDriveSizeUnique, totalSizeLocal} =
        adjustFileSizes(driveFiles, localFiles);

      console.log('local filesssss', totalSizeLocal, localFiles);
      console.log(
        'filessssssssssss',
        totalDriveSizeUnique,
        totalSize,
        uniqueDriveFiles,
      );
      let totalDownloaded = 0;

      setTotalDataSize(formatBytes(totalDriveSizeUnique));
      setViewType(2);

      await BackgroundService.start(veryIntensiveTask, options);
      for (const file of uniqueDriveFiles) {
        const filePath = await downloadFileFromDrive(
          file.id,
          file.name,
          accessToken,
        );
        totalDownloaded += parseInt(file.size || 0);
        updateProgress(totalDownloaded, totalSize);
        console.log(`Downloaded ${file.name} to ${filePath}`);
      }

      await BackgroundService.stop();
      setViewType(3);
      await restoreRealm();
      AsyncStorage.setItem('backupInProgress', 'false');
      AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'false');

      console.log('All files have been downloaded and saved locally.');
    } catch (error) {
      alert('Failed to restore.');
      console.error('Failed to download files:', error);
    }
  }

  async function downloadFileFromDrive(fileId, fileName, accessToken) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

    try {
      const response = await axios({
        url,
        method: 'GET',
        headers: headers,
        //  responseType: 'arraybuffer',
      });

      //   console.log('responseeee', JSON.stringify(response));
      let path = (path = `${RNFS.DocumentDirectoryPath}/${fileName}`);
      try {
        await RNFS.writeFile(path, response.data, 'base64');
        console.log(`File downloaded successfully: ${path}`);
      } catch (error) {
        console.log('writng file error');
      }

      // await RNFS.writeFile(path, response.request._response, 'base64');

      return path;
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  }

  function updateProgress(downloaded, totalSize) {
    const percentComplete = (downloaded / totalSize) * 100;
    setPercentageUploaded(percentComplete.toFixed(2));
    console.log(
      `Download progress: ${percentComplete.toFixed(
        2,
      )}% (${downloaded} of ${totalSize} bytes)`,
    );
    // Here you might update a React state or a progress bar in your app's UI
  }

  return (
    <AppView
      customContainerStyle={styles.container}
      scrollContainerRequired={true}
      isScrollEnabled={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: scale(24),
              color: '#444444',
              marginTop: scale(30),
              fontFamily: fonts.semiBoldFont,
            }}>
            Welcome Back {VARIABLES.user?.name}!
          </Text>

          <ImageBackground
            source={require('../../assets/images/profilePicFrame.png')}
            style={{
              width: scale(121),
              height: scale(121),
              resizeMode: 'contain',
              marginTop: scale(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ProfileAvatar
              type="user"
              style={{
                width: scale(94),
                height: scale(94),
                borderRadius: 100,
                backgroundColor: 'lightgray',
              }}
            />
          </ImageBackground>
        </View>

        <View
          style={{
            marginTop: scale(30),
            paddingHorizontal: scale(16),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scale(18),
              color: '#444444',
            }}>
            Restore Backup!
          </Text>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: '#595959',
              marginTop: scale(8),
            }}>
            You can restore your backed up chats and memories right now, to pick
            up from where you left Closer last :)
          </Text>

          {viewType === 2 && (
            <View
              style={{
                backgroundColor: '#EFE8E6',
                paddingHorizontal: scale(16),
                paddingVertical: scale(12),
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: scale(8),
                marginTop: scale(10),
              }}>
              <Image
                source={require('../../assets/images/coversationBg.png')}
              />

              <View style={{marginLeft: scale(10)}}>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: scale(14),
                    color: '#444444',
                  }}>
                  {totalDataSize} data to be restored from
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: scale(14),
                    color: colors.black,
                  }}>
                  {googleMail}
                </Text>
              </View>
            </View>
          )}

          {viewType === 1 ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: scale(20),
                }}>
                <Pressable
                  onPress={() => setRestoreModal(true)}
                  style={{
                    flex: 1,
                    height: scale(50),
                    borderWidth: 1,
                    borderColor: colors.blue1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(10),
                    marginEnd: scale(7),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.standardFont,
                      fontSize: scale(18),
                      color: colors.blue1,
                    }}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    googleSignIn();
                  }}
                  style={{
                    flex: 1,
                    height: scale(50),
                    borderWidth: 1,
                    borderColor: colors.blue1,
                    backgroundColor: colors.blue1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(10),
                    marginStart: scale(7),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.standardFont,
                      fontSize: scale(18),
                      color: colors.white,
                    }}>
                    Restore Now
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {viewType === 2 ? (
                <>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      paddingHorizontal: scale(16),
                      paddingVertical: scale(30),
                      borderRadius: scale(20),
                      marginTop: scale(20),
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.semiBoldFont,
                        fontSize: scale(16),
                        color: '#444444',
                        textAlign: 'center',
                      }}>
                      Restoring your data...
                    </Text>
                    <Text
                      style={{
                        fontFamily: fonts.regularFont,
                        fontSize: scale(16),
                        color: colors.text,
                        marginTop: scale(10),
                      }}>
                      We are backing up your data, please wait while the process
                      is going on!
                    </Text>

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
                      color: '#0D141C',
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
                      paddingHorizontal: scale(16),
                      paddingBottom: scale(30),
                      paddingTop: scale(20),
                      borderRadius: scale(20),
                      marginTop: scale(20),
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/images/greenTick.png')}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.semiBoldFont,
                        fontSize: scale(16),
                        color: '#444444',
                        textAlign: 'center',
                      }}>
                      Restore completed
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
                    onPress={() => {
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'App',
                            },
                          ],
                        }),
                      );
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
                      marginTop: scale(30),
                      alignSelf: 'center',
                      width: scale(234),
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.standardFont,
                        fontSize: scale(18),
                        color: colors.white,
                        includeFontPadding: false,
                      }}>
                      Continue with Closer
                    </Text>
                  </Pressable>
                </>
              )}
            </>
          )}
        </View>
      </View>
      <RestoreModal
        onSubmit={() => {
          setRestoreModal(false);
          setTimeout(() => {
            AsyncStorage.setItem('backupInProgress', 'false');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'App',
                  },
                ],
              }),
            );
          }, 500);
        }}
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
});
