// Import necessary utilities and dependencies
import {Platform} from 'react-native';
import {backupRealm} from '../backend/realm';
import {
  backgroundActionOptions,
  backupEmailUpdateApi,
  formatBytes,
  getFileNameApi,
  listAppdata,
  listAvailableLocalFiles,
  listLocalFiles,
  uploadFile,
  veryIntensiveTask,
} from '../backup/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundService from 'react-native-background-actions';

export async function syncFiles(
  accessToken,
  updateProgress = () => {},
  setTotalDataSize = () => {},
  stopSync = () => {},
  setIsBackupCompleted = () => {},
  reportError = error => console.error(error),
) {
  console.log(
    'access token to be defined in syncFiles',
    accessToken,
    Platform.OS,
  );
  try {
    await backupRealm();

    const driveFiles = await listAppdata(accessToken);
    const chatFileNames = await listAvailableLocalFiles(realm);
    const localFiles = await listLocalFiles();
    const fileNames = await getFileNameApi();

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

    // await BackgroundService.start(veryIntensiveTask, backgroundActionOptions);

    for (let file of filesToUpload) {
      await uploadFile(file.path, file.name, accessToken, () => {
        uploadedCount++;
        updateProgress((uploadedCount / totalFiles) * 100);
      });
    }

    //  await BackgroundService.stop();
    stopSync();
    setIsBackupCompleted(true);
    console.log('Sync complete. Files uploaded:', filesToUpload.length);

    const currentDate = new Date().toISOString();
    await AsyncStorage.setItem('lastBackupDate', currentDate);
    if (combinedTotalSize !== 0) {
      await AsyncStorage.setItem(
        'lastBackupSize',
        combinedTotalSize.toString(),
      );
    }
  } catch (error) {
    reportError('Error syncing files: ' + error.toString());
    console.error('Error syncing files:', error);
  }
}
