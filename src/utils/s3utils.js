import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {KEYCHAIN} from './keychain';

var Buffer = require('@craftzdog/react-native-buffer').Buffer;

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});

export default async function addPhoto(file, albumName, fileName) {
  console.log('file to upload', file);

  const fileData = await RNFS.readFile(file, 'base64');
  const buffer = new Buffer(fileData, 'base64');

  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `production/profiles/${fileName}`,
      // Key: photoKey,
      Body: buffer,
      ACL: 'public-read',
      ContentType: 'image/jpeg',
      ServerSideEncryption: 'AES256',
    },
  });

  var promise = await upload.promise();
  promise.imageName = fileName;
  return promise;
}

export async function addAudio(blob, albumName) {
  var d = new Date();
  var file = new File([blob], d.valueOf(), {type: 'audio/wav'});
  const fileName = albumName + '/' + file.name;
  var upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ACL: 'public-read',
    },
  });

  var promise = await upload.promise();
  promise.fileName = file.name;
  return promise;
}
