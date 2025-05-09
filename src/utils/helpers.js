import {Platform, StyleSheet, Text, View, NativeModules} from 'react-native';
import {RNS3} from 'react-native-aws3';
import {KEYCHAIN} from './keychain';

import Share from 'react-native-share';
import moment from 'moment-timezone';
import {VARIABLES} from './variables';
import {ASYNC_STORAGE_KEYS, setData} from './storage';
import RNFS from 'react-native-fs';
import AWS from 'aws-sdk';
import uuid from 'react-native-uuid';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {EncryptedUploader, EncryptedDownloader, EncryptedDownloaderBridge} =
  NativeModules;

var Buffer = require('@craftzdog/react-native-buffer').Buffer;

export const generateID = () => {
  return uuid.v4();
};

const s3 = new AWS.S3();

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});

export const uploadEncryptedToS3 = async (
  filePath,
  filename,
  mimeType,
  storePath,
  onProgress,
) => {
  try {
    console.log('Original file path:', filePath);

    // Remove the 'file://' prefix if it exists
    const cleanFilePath = filePath.replace('file://', '');
    console.log('Cleaned file path:', cleanFilePath);

    // Ensure the file exists before proceeding
    const fileExists = await RNFS.exists(cleanFilePath);
    if (!fileExists) {
      throw new Error('File does not exist at the specified path');
    }

    // Get file stats
    const fileStats = await RNFS.stat(cleanFilePath);
    console.log('File stats:', fileStats);

    const bucket = KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME;
    const key = `production/${storePath}/${filename}`;
    const cognitoPoolId = KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID;
    const cognitoRegion = KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION;

    const recipientPublicKeyBase64 =
      VARIABLES.user?.partnerData?.partner?.publicKey;
    const senderPrivateKeyBase = await AsyncStorage.getItem(
      'privateKeyEncryption',
    );

    const senderPrivateKeyBase64 = senderPrivateKeyBase;

    console.log('Calling native module with file path:', cleanFilePath);

    const nonce = await EncryptedUploader.encryptAndUpload(
      cleanFilePath,
      bucket,
      key,
      cognitoPoolId,
      cognitoRegion,
      recipientPublicKeyBase64,
      senderPrivateKeyBase64,
    );

    console.log('Upload completed, nonce:', nonce);
    return {
      imageName: filename,
      nonce: nonce,
      // Add other necessary return values
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// export const uploadEncryptedToS3 = async (
//   filePath,
//   filename,
//   mimeType,
//   storePath,
// ) => {
//   console.log('file path', filePath, filename, Platform.OS, mimeType);
//   const retrievedEncodedSecretKey = await AsyncStorage.getItem(
//     'privateKeyEncryption',
//   );

//   const senderPrivateSigningKeyBase64 = await AsyncStorage.getItem(
//     'privateKeySigned',
//   );
//   console.log({senderPrivateSigningKeyBase64, retrievedEncodedSecretKey});

//   const senderPrivateSigningKey = naclUtil.decodeBase64(
//     senderPrivateSigningKeyBase64,
//   );

//   const senderPrivateKey = naclUtil.decodeBase64(retrievedEncodedSecretKey);
//   const recipientPublicKey = naclUtil.decodeBase64(
//     VARIABLES.user?.partnerData?.partner?.publicKey,
//   );

//   try {
//     const fileData = await RNFS.readFile(filePath, 'base64');
//     console.log('file dataaaaaaaaaaaaaa', filePath);
//     const fileBytes = naclUtil.decodeBase64(fileData);

//     // Encrypt the file
//     const nonce = nacl.randomBytes(nacl.box.nonceLength);
//     const encryptedFile = nacl.box(
//       fileBytes,
//       nonce,
//       recipientPublicKey,
//       senderPrivateKey,
//     );

//     // Upload the encrypted file to S3
//     const s3Upload = new AWS.S3.ManagedUpload({
//       params: {
//         Bucket: KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME,
//         Key: `production/${storePath}/${filename}`,
//         Body: encryptedFile,
//         ACL: 'public-read',
//         ContentType: mimeType,
//       },
//     });
//     console.log('filename to senddddddddddddddd', filename);
//     const uploadResult = await s3Upload.promise();
//     console.log(uploadResult, 'cndajk');
//     return {
//       ...uploadResult,
//       imageName: filename,
//       nonce: naclUtil.encodeBase64(nonce),
//     };
//   } catch (error) {
//     console.error('Upload failed:', error);
//     throw error;
//   }
// };

/**
 * Downloads an encrypted file from S3, decrypts it, and saves it locally.
 */

export const downloadAndDecryptFromS3 = async (
  filename,
  storePath,
  nonce,
  onProgress,
) => {
  try {
    console.log(
      'EncryptedDownloader module:',
      EncryptedDownloader,
      EncryptedDownloaderBridge,
    );
    if (Platform.OS === 'ios') {
      if (
        !EncryptedDownloaderBridge ||
        !EncryptedDownloaderBridge.downloadAndDecrypt
      ) {
        throw new Error(
          'EncryptedDownloader module or downloadAndDecrypt method not found',
        );
      }
    } else {
      if (!EncryptedDownloader || !EncryptedDownloader.downloadAndDecrypt) {
        throw new Error(
          'EncryptedDownloader module or downloadAndDecrypt method not found',
        );
      }
    }

    const bucket = KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME;
    const key = `production/${storePath}/${filename}`;
    const cognitoPoolId = KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID;
    const cognitoRegion = KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION;

    const recipientPrivateKeyBase64 = await AsyncStorage.getItem(
      'privateKeyEncryption',
    );
    const senderPublicKeyBase64 =
      VARIABLES.user?.partnerData?.partner?.publicKey;

    const nonceBase64 = Buffer.from(nonce).toString('base64');

    console.log('Preparing parameters for native module call', nonceBase64);
    const params = {
      bucket,
      key,
      cognitoPoolId,
      cognitoRegion,
      nonceBase64,
      senderPublicKeyBase64,
      recipientPrivateKeyBase64,
    };
    console.log('Parameters:', JSON.stringify(params));

    console.log('Calling native module for download and decrypt');
    let decryptedFilePath = '';
    if (Platform.OS === 'ios') {
      decryptedFilePath = await EncryptedDownloaderBridge.downloadAndDecrypt(
        params,
      );
    } else {
      decryptedFilePath = await EncryptedDownloader.downloadAndDecrypt(params);
    }

    // console.log('Decrypted file path:', decryptedFilePath);
    // console.log('Native module call completed');

    // if (typeof decryptedBase64 !== 'string') {
    //   console.error('Unexpected result type:', typeof decryptedBase64);
    //   throw new Error('Decryption result is not a string');
    // }

    // // Convert Base64 to string if needed
    // const decryptedString = Buffer.from(decryptedBase64, 'base64').toString(
    //   'utf8',
    // );

    // const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    // console.log('decrypted path', decryptedFilePath, 'local', localFilePath);
    // try {
    //   // Copy the image to the destination directory
    //   await RNFS.copyFile(decryptedFilePath, localFilePath);
    // } catch (error) {
    //   console.log('Error uploading image:', error);
    // }

    // console.log('Download and decryption completed');
    return decryptedFilePath;
  } catch (error) {
    console.error('Download and decryption failed:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

// export const downloadAndDecryptFromS3 = async (
//   filename,
//   storePath,
//   nonceBase64,
//   onProgress,
// ) => {
//   try {
//     const recipientPrivateKeyBase64 = await AsyncStorage.getItem(
//       'privateKeyEncryption',
//     );
//     const recipientPrivateKey = Buffer.from(
//       recipientPrivateKeyBase64,
//       'base64',
//     );

//     const senderPublicKeyBase64 =
//       VARIABLES.user?.partnerData?.partner?.publicKey;
//     const senderPublicKey = Buffer.from(senderPublicKeyBase64, 'base64');

//     // Retrieve the encrypted file from S3
//     const s3 = new AWS.S3();
//     const s3Params = {
//       Bucket: KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME,
//       Key: `production/${storePath}/${filename}`,
//     };

//     const s3Response = await s3.getObject(s3Params).promise();

//     // The data from S3 is already in the correct binary format
//     const encryptedData = new Uint8Array(s3Response.Body);

//     // Use the nonce provided from the upload process
//     const nonce = Buffer.from(nonceBase64, 'base64');

//     // The encrypted message starts after the nonce
//     const encryptedMessage = encryptedData.slice(nonce.length);

//     // Decrypt the data
//     const decryptedData = nacl.box.open(
//       encryptedMessage,
//       nonce,
//       senderPublicKey,
//       recipientPrivateKey,
//     );

//     if (!decryptedData) {
//       throw new Error('Decryption failed');
//     }

//     // Convert decrypted data to a string
//     const decryptedString = Buffer.from(decryptedData).toString('utf8');

//     // Save the decrypted data or process it as needed
//     // ...

//     return decryptedString;
//   } catch (error) {
//     console.error('Download and decryption failed:', error);
//     throw error;
//   }
// };

////////////////////////////////////////////

export const uploadToS3BUCKET = async (image, filename, type, storePath) => {
  const fileData = await RNFS.readFile(image, 'base64');

  const buffer = Buffer.from(fileData, 'base64');

  const imageObj = {
    Bucket: KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `production/${storePath}/${filename}`,
    Body: buffer,
    ACL: 'public-read',
    ContentType: type,
  };

  try {
    const data = await s3.upload(imageObj).promise();

    return {
      statusCode: 201,
      response: data.Key,
    };
  } catch (error) {
    console.log('Upload Error', error);
    return {
      statusCode: 500,
      response: error,
    };
  }
};

export const shareUrlImageStory = imagesPath => {
  const shareImage = {
    url: imagesPath.image.startsWith('file://')
      ? imagesPath.image
      : `file://${imagesPath.image}`,
  };

  console.log('share urll', shareImage);
  // Platform.OS === 'android' && resolve();
  return new Promise((resolve, reject) => {
    Share.open(shareImage)
      .then(res => {
        console.log(res);
        resolve();
      })
      .catch(err => {
        err && console.log(err);
        resolve();
      });
  });
};

export const shareUrlImage = imagesPath => {
  const path = RNFS.DocumentDirectoryPath + '/' + imagesPath.image;

  const shareImage = {
    url: `file://${path}`,
    // urls: [imageUrl, imageUrl], // eg.'http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg',
  };

  console.log('share urll', shareImage);
  // Platform.OS === 'android' && resolve();
  return new Promise((resolve, reject) => {
    Share.open(shareImage)
      .then(res => {
        console.log(res);
        resolve();
      })
      .catch(err => {
        err && console.log(err);
        resolve();
      });
  });
};

export const getStateDataAsync = getStateFunc => {
  return new Promise(resolve =>
    getStateFunc(s => {
      resolve(s);
      return s;
    }),
  );
};

export const delay = async time => {
  return new Promise(resolve => setTimeout(() => resolve(), time));
};

export const updateRecentlyUsedEmoji = item => {
  const index = VARIABLES.recentReactions.findIndex(i => i.id === item.id);
  if (index != -1) {
    VARIABLES.recentReactions.splice(index, 1);
    VARIABLES.recentReactions.unshift(item);
    return;
  }
  VARIABLES.recentReactions.unshift(item);
  if (VARIABLES.recentReactions.length === 6) {
    VARIABLES.recentReactions.pop();
  }
  setData(
    ASYNC_STORAGE_KEYS.recentEmoji,
    JSON.stringify(VARIABLES.recentReactions),
  );
};

export const updateRecentlyUsedSmily = item => {
  // alert(2)
  const index = VARIABLES.recentEmojis.findIndex(i => i === item);
  if (index != -1) {
    VARIABLES.recentEmojis.splice(index, 1);
    VARIABLES.recentEmojis.unshift(item);
    return;
  }
  VARIABLES.recentEmojis.unshift(item);
  if (VARIABLES.recentEmojis.length === 6) {
    VARIABLES.recentEmojis.pop();
  }
  setData(
    ASYNC_STORAGE_KEYS.recentSmily,
    JSON.stringify(VARIABLES.recentEmojis),
  );
};

export function removeExtension(filename) {
  return Platform.OS === 'ios'
    ? filename
    : filename.substring(0, filename.lastIndexOf('.')) || filename;
}

export const containsHttpsLink = str => {
  // Matches http, https, and links starting with www.
  const regex = /((https?:\/\/)|(www\.))\S+/gi;
  return regex.test(str);
};

export const getDateString = time => {
  // Convert both times to IST explicitly
  const now = moment().tz('Asia/Kolkata');
  const date = moment.utc(time).tz('Asia/Kolkata');

  const diff = now.startOf('day').diff(date.startOf('day'), 'days');

  switch (diff) {
    case 0:
      return 'Today';
    case 1:
      return 'Yesterday';
    default:
      return date.format('DD/MM/YYYY');
  }
};

export const downloadFile = async (url, destinationDirectory, fileName) => {
  try {
    // Ensure the destination directory exists or create it if it doesn't.
    console.log({
      url,
      destinationDirectory,
      fileName,
    });
    await RNFS.mkdir(destinationDirectory, {
      NSURLIsExcludedFromBackupKey: true,
    });
    console.log({destinationDirectory});
    const destinationPath = `${destinationDirectory}/${fileName}`;
    const response = await RNFS.downloadFile({
      fromUrl: url,
      toFile: destinationPath,
      discretionary: true,
    });
    RNFS.exists(destinationPath).then(res => {
      alert(`destinationDirectory${res}`);
    });
    console.log(await response.promise);
    // if (response.statusCode === 200) {
    //   // File downloaded successfully.
    const exists = await RNFS.exists(destinationPath);

    if (exists) {
      console.log('File exists:', destinationPath);
      return destinationPath;
    } else {
      console.error('File does not exist:', destinationPath);
      return null;
    }
    // } else {
    //   console.error('Download failed with status code:', response.statusCode);
    //   return null;
    // }
  } catch (error) {
    console.error('Error downloading file:', error);
    return null;
  }
};

export const getColorCodeWithOpactiyNumber = (color, transparency) => {
  switch (transparency) {
    case '10':
      return `${color}1A`;
    case '15':
      return `${color}26`;
    case '20':
      return `${color}33`;
    case '25':
      return `${color}40`;
    case '30':
      return `${color}4D`;
    case '35':
      return `${color}59`;
    case '40':
      return `${color}66`;
    case '50':
      return `${color}80`;
    case '60':
      return `${color}99`;
    case '70':
      return `${color}B3`;
    case '80':
      return `${color}c9`;
    case '90':
      return `${color}d4`;
    case '100':
      return color;
    default:
      return color;
  }
};

export const validateEmail = email => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const shouldShowTooltipUserComp = async () => {
  const lastShown = await AsyncStorage.getItem('tooltipLastShownUserComp');
  const profileSet = VARIABLES.user.profilePic; // Assuming this is how you check if the profile picture is set

  if (profileSet) {
    return false;
  }

  if (!lastShown) {
    return true;
  }

  const lastShownDate = new Date(lastShown);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - lastShownDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 3;
};

export const handleTooltipPressUserComp = async () => {
  await AsyncStorage.setItem(
    'tooltipLastShownUserComp',
    new Date().toISOString(),
  );
  //  updateStatus(); // Uncomment if needed
};
