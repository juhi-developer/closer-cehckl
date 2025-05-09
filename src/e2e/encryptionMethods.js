import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VARIABLES} from '../utils/variables';
import * as Sentry from '@sentry/react-native';

/// Encrypts and signs a message for secure transmission to a recipient.

export async function encryptAndSignMessage(message) {
  // Retrieve the sender's private signing key
  const senderPrivateSigningKeyBase64 = await AsyncStorage.getItem(
    'privateKeySigned',
  );

  // Retrieve the sender's private encryption key
  const senderPrivateEncryptionKeyBase64 = await AsyncStorage.getItem(
    'privateKeyEncryption',
  );

  const senderPrivateSigningKey = naclUtil.decodeBase64(
    senderPrivateSigningKeyBase64,
  );
  const senderPrivateEncryptionKey = naclUtil.decodeBase64(
    senderPrivateEncryptionKeyBase64,
  );

  // Decode the recipient's public encryption key
  const recipientPublicKey = naclUtil.decodeBase64(
    VARIABLES.user?.partnerData?.partner?.publicKey,
  );

  // Sign the original message
  const signedMessage = nacl.sign(
    naclUtil.decodeUTF8(message),
    senderPrivateSigningKey,
  );

  // Generate a nonce for the encryption
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  // Encrypt the signed message
  const encryptedSignedMessage = nacl.box(
    signedMessage,
    nonce,
    recipientPublicKey,
    senderPrivateEncryptionKey,
  );

  return {
    encryptedMessage: naclUtil.encodeBase64(encryptedSignedMessage),
    nonce: naclUtil.encodeBase64(nonce),
  };
}

// Decryption function
export async function decryptAndVerifyMessage(
  encryptedMessageBase64,
  nonceBase64,
  senderPublicKeyEncryptionBase64,
  senderPublicKeySignedBase64,
) {
  try {
    const privateKeyEncryptionBase64 = await AsyncStorage.getItem(
      'privateKeyEncryption',
    );
    const privateKeyEncryption = naclUtil.decodeBase64(
      privateKeyEncryptionBase64,
    );

    const encryptedMessage = naclUtil.decodeBase64(encryptedMessageBase64);
    const nonce = naclUtil.decodeBase64(nonceBase64);

    const senderPublicKeyEncryption = naclUtil.decodeBase64(
      senderPublicKeyEncryptionBase64,
    );
    const senderPublicKeySigned = naclUtil.decodeBase64(
      senderPublicKeySignedBase64,
    );

    const decryptedSignedMessage = nacl.box.open(
      encryptedMessage,
      nonce,
      senderPublicKeyEncryption,
      privateKeyEncryption,
    );
    if (!decryptedSignedMessage) {
      Sentry.captureException('Could not decrypt message');
      throw new Error('Could not decrypt message');
    }

    const originalMessage = nacl.sign.open(
      decryptedSignedMessage,
      senderPublicKeySigned,
    );
    if (!originalMessage) {
      Sentry.captureException('Signature verification failed');
      throw new Error('Signature verification failed');
    }

    return naclUtil.encodeUTF8(originalMessage);
  } catch (error) {
    Sentry.captureException('Decryption error:', error);
    console.error('Decryption error:', error);
    throw error;
  }
}
