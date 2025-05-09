import axios from 'axios';
import RNFS, {stat} from 'react-native-fs';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidColor,
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from '@notifee/react-native';
import {MessageSchema} from '../backend/schemas';
import API from '../redux/saga/request';
import {ToastMessage} from '../components/toastMessage';

export function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;

    if (part1 < part2) {
      return -1;
    } else if (part1 > part2) {
      return 1;
    }
  }

  return 0;
}

export async function fetchDirectoryContents() {
  try {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath); // reads the contents of the directory

    // files.forEach(file => {
    //   console.log(file.path); // logs the path of each file
    // });

    return files; // returns the array of file objects
  } catch (error) {
    console.error('Error fetching directory contents:', error);
    throw error; // or handle the error as needed
  }
}

// Helper function to calculate total size of files
export const getTotalSize = files => {
  return files.reduce((total, file) => total + file.size, 0);
};

export function getMimeType(fileUri) {
  const extension = fileUri.split('.').pop().toLowerCase();
  const mimeTypeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    pdf: 'application/pdf',
  };

  return mimeTypeMap[extension] || 'application/octet-stream'; // Default MIME type if unknown
}

// Helper function to format bytes into the most suitable size unit
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function listAppdata(accessToken) {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const response = await axios.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        headers: headers,
        params: {
          spaces: 'appDataFolder',
          fields: 'nextPageToken, files(id, name,size)',
          pageSize: 1000,
        },
      },
    );
    return response.data.files;
  } catch (err) {
    console.error('Error listing appdata files:', err);
    throw err;
  }
}

// async function fetchFileNamesFromDB() {
//   let fileNames = [];
//   const realm = await Realm.open({schema: [MessageSchema]});

//   try {
//     // Start a read transaction
//     realm.read(() => {
//       // Query all Messages
//       let messages = realm.objects('Message');

//       // Iterate over the messages to collect file names based on type
//       messages.forEach(message => {
//         switch (message.type) {
//           case 'image':
//           case 'audio':
//           case 'doc':
//             if (message.message) fileNames.push(message.message);
//             break;
//           case 'video':
//             if (message.message) fileNames.push(message.message);
//             if (message.thumbnailImage) fileNames.push(message.thumbnailImage);
//             break;
//           case 'story':
//             if (message.storyImage) fileNames.push(message.storyImage);
//             break;
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Failed to fetch file names from DB:', error);
//   } finally {
//     // Close the Realm if it is open.
//     if (realm !== null && !realm.isClosed) {
//       realm.close();
//     }
//   }

//   return fileNames;
// }

export async function listAvailableLocalFiles(realm) {
  let fileNames = [];

  // const realm = await Realm.open({schema: [MessageSchema], schemaVersion: 20});
  const localPath = RNFS.DocumentDirectoryPath;

  try {
    // Fetch all the file names from the database based on type
    let messages = realm.objects('Message');
    messages.forEach(message => {
      switch (message.type) {
        case 'image':
        case 'audio':
        case 'doc':
          if (message.message) fileNames.push(message.message);
          break;
        case 'video':
          if (message.message) fileNames.push(message.message);
          if (message.thumbnailImage) fileNames.push(message.thumbnailImage);
          break;
        case 'link':
          if (message.thumbnailImage) fileNames.push(message.thumbnailImage);
        case 'story':
          if (message.storyImage) fileNames.push(message.storyImage);
          break;
      }
    });

    // Check if these files exist in the local file system and filter them
    const files = await RNFS.readDir(localPath);

    console.log('Files to be included:', files);

    const availableFiles = files.filter(file => fileNames.includes(file.name));

    return availableFiles; // Returning the full file object for each available file
  } catch (error) {
    console.error('Error while fetching and checking files:', error);
  } finally {
    // Any cleanup can be performed here
  }
}

export const getFileNameApi = async () => {
  try {
    const resp = await API(`user/moments/media`, 'GET');
    const localPath = RNFS.DocumentDirectoryPath;

    if (resp.body.statusCode === 200) {
      console.log('API File names:', JSON.stringify(resp.body.data));

      // Retrieve list of all files in the local directory
      const files = await RNFS.readDir(localPath);

      // Filter local files to find matches with API file names
      const availableFiles = files.filter(file =>
        resp.body.data.includes(file.name),
      );

      return availableFiles; // Returning the full file object for each available file
    } else {
      console.log('API Response with non-200 status code:', resp.body);
    }
  } catch (error) {
    console.log('Error fetching API files:', error);
  }
};

export const backupEmailUpdateApi = async params => {
  try {
    const resp = await API(`user/auth/backupEmail`, 'POST', params);
    console.log('success gdrive email');
  } catch (error) {
    console.log('Error updating google email:', error);
  }
};

export async function listLocalFilesAll() {
  try {
    const localPath = RNFS.DocumentDirectoryPath; // This path may vary based on your requirements
    const files = await RNFS.readDir(localPath);
    const filteredFiles = files.filter(file => {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();

      return (
        fileName === 'closer_backup.realm' ||
        ['png', 'jpg', 'mp4'].includes(fileExtension)
      );
    });
    return filteredFiles;
  } catch (err) {
    console.error('Error reading local files:', err);
    throw err;
  }
}

export async function listLocalFiles() {
  try {
    const localPath = RNFS.DocumentDirectoryPath; // This path may vary based on your requirements
    const files = await RNFS.readDir(localPath);
    const filteredFiles = files.filter(file => {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop();

      return (
        fileName === 'closer_backup.realm'
        // ||
        // ['png', 'jpg', 'mp4'].includes(fileExtension)
      );
    });
    return filteredFiles;
  } catch (err) {
    console.error('Error reading local files:', err);
    throw err;
  }
}

export async function uploadFile(
  fileUri,
  fileName,
  accessToken,
  onUploadComplete,
) {
  const mimeType = getMimeType(fileName);
  const fileContent = await RNFS.readFile(fileUri, 'base64');

  // Initial metadata setup for a new file upload
  const metadata = {
    name: fileName,
    mimeType,
  };

  let headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': `multipart/related; boundary=boundarystring`,
  };

  let method = 'POST'; // Default method is POST for new files
  let multipartBody =
    `--boundarystring\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--boundarystring\r\nContent-Type: ${mimeType}\r\n\r\n` +
    `${fileContent}\r\n` +
    `--boundarystring--`;

  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(
    fileName,
  )}'&spaces=appDataFolder&fields=files(id)`;

  try {
    const searchResponse = await axios.get(searchUrl, {
      headers: {Authorization: `Bearer ${accessToken}`},
    });
    const files = searchResponse.data.files;
    let apiUrl;

    if (files.length > 0) {
      console.log('filess for closer backup', files);
      // Update existing file
      const fileId = files[0].id;
      method = 'PATCH'; // Change method to PATCH for updates
      apiUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;

      // Update headers to not include parents
      multipartBody =
        `--boundarystring\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify({name: fileName, mimeType})}\r\n` +
        `--boundarystring\r\nContent-Type: ${mimeType}\r\n\r\n` +
        `${fileContent}\r\n` +
        `--boundarystring--`;
    } else {
      // New file upload
      apiUrl =
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      // Include parents field for new files
      metadata.parents = ['appDataFolder'];
      multipartBody =
        `--boundarystring\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--boundarystring\r\nContent-Type: ${mimeType}\r\n\r\n` +
        `${fileContent}\r\n` +
        `--boundarystring--`;
    }

    // Execute the request to upload or update the file
    await axios({
      method,
      url: apiUrl,
      data: multipartBody,
      headers,
    });

    onUploadComplete(); // Notify completion
    console.log('File uploaded or updated successfully:', fileName);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ToastMessage(error.response?.data?.error?.message);
      console.error('Axios error response data:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// export async function uploadFile(
//   fileUri,
//   fileName,
//   accessToken,
//   onUploadComplete,
// ) {
//   const mimeType = getMimeType(fileName);
//   const fileContent = await RNFS.readFile(fileUri, 'base64');
//   const metadata = {
//     name: fileName,
//     parents: ['appDataFolder'],
//     mimeType: mimeType,
//   };

//   const multipartBody =
//     `--boundarystring\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
//     `${JSON.stringify(metadata)}\r\n` +
//     `--boundarystring\r\nContent-Type: ${mimeType}\r\n\r\n` +
//     `${fileContent}\r\n` +
//     `--boundarystring--`;

//   const headers = {
//     Authorization: `Bearer ${accessToken}`,
//     'Content-Type': `multipart/related; boundary=boundarystring`,
//   };

//   try {
//     const initUrl =
//       'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
//     await axios.post(initUrl, multipartBody, {
//       headers,
//     });
//     onUploadComplete(); // Notify that the file has been uploaded
//     console.log('File uploaded successfully:', fileName);
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// }

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

export const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      await sleep(delay);
    }
  });
};

export const backgroundActionOptions = {
  taskName: 'Closer',
  taskTitle: 'Closer Backup Task',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#4191f4',
  parameters: {
    delay: 1000,
  },
};

// Utility function to determine if a new backup should be initiated
export async function shouldStartBackup() {
  const lastBackupDateStr = await AsyncStorage.getItem('lastBackupDate');
  const backupFrequency = await AsyncStorage.getItem('backupFrequency'); // "daily", "weekly", "monthly", "hourly"

  if (backupFrequency === null) {
    return false;
  }
  if (backupFrequency === 'never') {
    return false;
  }

  const lastBackupDate = new Date(lastBackupDateStr);
  const currentDate = new Date();
  const timeElapsed = currentDate - lastBackupDate; // Time difference in milliseconds

  switch (backupFrequency) {
    case 'hourly':
      return timeElapsed > 3600000; // More than 1 hour
    case 'daily':
      //    return timeElapsed > 72000; // More than  72 seconds
      return timeElapsed > 86400000; // More than 24 hours
    case 'weekly':
      return timeElapsed > 604800000; // More than 7 days
    case 'monthly':
      return timeElapsed > 2629800000; // More than 1 month (approx)
    default:
      return false; // If the frequency is not recognized, don't start backup
  }
}

async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'sync',
    name: 'Data Sync',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    vibration: true, // if you want the phone to vibrate when the notification is shown
  });
}

export async function showPersistentNotification() {
  await createNotificationChannel();

  await notifee.displayNotification({
    title: 'Sync in Progress',
    body: 'Your data is currently being synced. Please keep the app open.',
    android: {
      channelId: 'sync',
      asForegroundService: true,

      ongoing: true,
      // color: AndroidColor.RED,
      colorized: true,
      autoCancel: false,

      //   smallIcon: 'name_of_your_icon', // ensure you have this icon in your Android assets
      progress: {
        max: 100,
        current: 0,
        indeterminate: true, // Set to false if you want to show actual progress
      },
    },
  });
}

export async function removePersistentNotification() {
  await notifee.cancelAllNotifications();
}
