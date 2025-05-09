import RNFS from 'react-native-fs';
import {PermissionsAndroid, Platform} from 'react-native';

export async function copyFilesToPublicStorage() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);

    console.log('granteddddddddd', granted);

    // if (
    //   granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
    //   PermissionsAndroid.RESULTS.GRANTED
    // ) {
    const files = await RNFS.readDir(RNFS.DocumentDirectoryPath);
    const publicDir = `${RNFS.ExternalStorageDirectoryPath}/Closer`;

    await RNFS.mkdir(publicDir);

    for (let file of files) {
      const newPath = `${publicDir}/${file.name}`;
      await RNFS.copyFile(file.path, newPath);
      // Optionally notify the media scanner here
    }

    alert('Files copied to public storage!');
    // } else {
    //   alert('Storage Permission Denied');
    // }
  } catch (error) {
    console.error('Failed to copy files:', error);
  }
}
