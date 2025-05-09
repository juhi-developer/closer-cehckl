package com.closer.application;

import android.util.Base64;
import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import org.libsodium.jni.NaCl;
import org.libsodium.jni.Sodium;
import org.libsodium.jni.SodiumConstants;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;

import android.os.Environment;
import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;
import com.amazonaws.services.s3.model.DeleteObjectRequest;


public class EncryptedDownloaderModule extends ReactContextBaseJavaModule {

    private static final String NAME = "EncryptedDownloader";
    private static final String TAG = "EncryptedDownloader";
    private AmazonS3Client s3Client;

    private final ExecutorService executorService = Executors.newFixedThreadPool(1);
    private final ReactApplicationContext reactContext;

    public EncryptedDownloaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        NaCl.sodium();
        Log.d(TAG, "EncryptedDownloaderModule initialized");
    }

    @Override
    public String getName() {
        return NAME;
    }

  @ReactMethod
    public void downloadAndDecrypt(ReadableMap options, Promise promise) {
        Log.d(TAG, "downloadAndDecrypt method called");
          executorService.execute(() -> {
        try {
            String bucket = options.getString("bucket");
            String key = options.getString("key");
            String cognitoPoolId = options.getString("cognitoPoolId");
            String cognitoRegion = options.getString("cognitoRegion");
            String nonceBase64 = options.getString("nonceBase64");
            String senderPublicKeyBase64 = options.getString("senderPublicKeyBase64");
            String recipientPrivateKeyBase64 = options.getString("recipientPrivateKeyBase64");

            Log.d(TAG, "Parameters received: " + options.toString());

            // Decode the Base64 nonce and keys
            byte[] nonce = Base64.decode(nonceBase64, Base64.DEFAULT);
            byte[] senderPublicKey = Base64.decode(senderPublicKeyBase64, Base64.DEFAULT);
            byte[] recipientPrivateKey = Base64.decode(recipientPrivateKeyBase64, Base64.DEFAULT);

            Log.d(TAG, "Nonce length: " + nonce);
            Log.d(TAG, "Sender public key length: " + senderPublicKey.length);
            Log.d(TAG, "Recipient private key length: " + recipientPrivateKey.length);

                // Initialize Cognito credentials provider
                    CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
                            reactContext,
                            cognitoPoolId,
                            Regions.fromName(cognitoRegion)
                    );

            // Download file from S3
             this.s3Client = new AmazonS3Client(credentialsProvider);
           // AmazonS3Client s3Client = new AmazonS3Client(credentialsProvider);
            GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, key);
            S3Object s3Object = s3Client.getObject(getObjectRequest);
            InputStream objectData = s3Object.getObjectContent();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            while ((length = objectData.read(buffer)) != -1) {
                baos.write(buffer, 0, length);
            }
            byte[] encryptedData = baos.toByteArray();
            objectData.close();
            baos.close();

            Log.d(TAG, "File downloaded successfully. Encrypted size: " + nonce + " bytes");

            // Check if nonce is included in the encrypted data
            if (encryptedData.length > nonce.length && Arrays.equals(Arrays.copyOf(encryptedData, nonce.length), nonce)) {
                Log.d(TAG, "Nonce found in encrypted data, extracting...");
                encryptedData = Arrays.copyOfRange(encryptedData, nonce.length, encryptedData.length);
            }

              // Decrypt the data using crypto_box_open_easy
        byte[] decryptedBytes = new byte[encryptedData.length - SodiumConstants.BOXZERO_BYTES];
        int result = Sodium.crypto_box_open_easy(decryptedBytes, encryptedData, encryptedData.length, nonce, senderPublicKey, recipientPrivateKey);

        if (result != 0) {
            Log.e(TAG, "Decryption failed. Result: " + result);
            Log.e(TAG, "Encrypted data length: " + encryptedData.length);
            Log.e(TAG, "Decrypted data length: " + decryptedBytes.length);
            throw new RuntimeException("Decryption failed with result: " + result);
        }

        Log.d(TAG, "File decrypted successfully. Decrypted size: " + decryptedBytes.length + " bytes");

Log.d(TAG, "File decrypted successfully. Decrypted size: " + key + " bytes");

  // Extract file extension from the key or use a default
          String fileExtension = key != null ? getFileExtension(key) : "bin";

        // Generate a unique file name with the correct extension
              String fileName = getFileNameFromKey(key);

            File filesDir = getReactApplicationContext().getFilesDir();
            File outputFile = new File(filesDir, fileName);

            FileOutputStream fos = new FileOutputStream(outputFile);
            fos.write(decryptedBytes);
            fos.close();

            String filePath = outputFile.getAbsolutePath();
            Log.d(TAG, "Decrypted file saved to: " + filePath);

            // Delete the file from S3
      
            deleteFileFromS3(bucket, key, new Callback() {
                @Override
                public void onSuccess() {
                    Log.d(TAG, "File successfully deleted from S3");
                    promise.resolve(fileName);
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, "Failed to delete file from S3: " + e.getMessage());
                    promise.resolve(fileName); // Still resolve with fileName even if S3 deletion fails
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error in downloadAndDecrypt: " + e.getMessage(), e);
            promise.reject("DOWNLOAD_ERROR", e.getMessage(), e);
        }
           });
    }

    private String getFileExtension(String key) {
        // Extract file extension from the key
        int lastDotIndex = key.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "bin"; // Default extension if none is found
        }
        return key.substring(lastDotIndex + 1);
    }


    private void deleteFileFromS3(String bucket, String key, Callback callback) {
        new Thread(() -> {
            try {
                s3Client.deleteObject(new DeleteObjectRequest(bucket, key));
                callback.onSuccess();
            } catch (Exception e) {
                callback.onError(e);
            }
        }).start();
    }

    private interface Callback {
        void onSuccess();
        void onError(Exception e);
    }

    private String getFileNameFromKey(String key) {
        String[] parts = key.split("/");
        return parts[parts.length - 1];
    }

}

