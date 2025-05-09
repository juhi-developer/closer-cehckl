import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {KEYCHAIN} from './keychain';
import S3 from 'aws-sdk/clients/s3';

var Buffer = require('@craftzdog/react-native-buffer').Buffer;

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});

const S3_BUCKET = KEYCHAIN.NEXT_PUBLIC_S3_BUCKET_NAME;

const s3 = new S3({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
});

export async function addMediaFile(fileUri, key) {
  console.log('Data to send, Key:', fileUri, key);

  // Determine the content type from the file extension
  const contentType = getContentTypeByFile(fileUri);
  console.log('content type', contentType);
  try {
    console.log('in try block');
    const fileSize = await RNFS.stat(fileUri).then(stat => stat.size);
    console.log('File size:', fileSize, fileUri);

    if (fileSize <= 5 * 1024 * 1024) {
      // Use direct upload for files <= 5MB
      return await directUpload(fileUri, key, contentType);
    } else {
      // Use multipart upload for larger files
      return await multipartUpload(fileUri, key, contentType, fileSize);
    }
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
}

function getContentTypeByFile(fileName) {
  const extension = fileName.split('.').pop();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'm4a':
      return 'audio/mp4';
    default:
      return 'application/octet-stream';
  }
}

async function directUpload(fileUri, key, contentType) {
  console.log('content type', contentType);
  const fileData = await RNFS.readFile(fileUri, 'base64');
  const bufferData = Buffer.from(fileData, 'base64');

  const uploadParams = {
    Bucket: S3_BUCKET,
    Key: key,
    Body: bufferData,
    ContentType: contentType,
    ACL: 'public-read',
  };

  const data = await s3.putObject(uploadParams).promise();

  return {Key: key};
}

async function multipartUpload(fileUri, key, contentType, fileSize) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
  const totalParts = Math.ceil(fileSize / CHUNK_SIZE);

  const createParams = {
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  };
  const multipart = await s3.createMultipartUpload(createParams).promise();
  const uploadId = multipart.UploadId;

  let parts = [];

  for (let i = 0; i < totalParts; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min((i + 1) * CHUNK_SIZE, fileSize);
    const fileChunk = await RNFS.read(fileUri, CHUNK_SIZE, start, 'base64');
    const partData = Buffer.from(fileChunk, 'base64');

    const partParams = {
      Bucket: S3_BUCKET,
      Key: key,
      PartNumber: i + 1,
      UploadId: uploadId,
      Body: partData,
    };

    const uploadedPart = await s3.uploadPart(partParams).promise();
    parts.push({ETag: uploadedPart.ETag, PartNumber: i + 1});

    console.log(`Uploaded part ${i + 1} of ${totalParts}`);
  }

  const completeParams = {
    Bucket: S3_BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {Parts: parts},
  };
  const completedUpload = await s3
    .completeMultipartUpload(completeParams)
    .promise();

  return {Key: key};
}
