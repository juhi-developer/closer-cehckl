// android/app/src/main/java/com/yourpackage/EncryptedUploaderModule.java

package com.closer.application;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import android.os.Handler;
import android.os.Looper;
import android.util.Base64;
import android.util.Log;

import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import org.libsodium.jni.NaCl;
import org.libsodium.jni.Sodium;
import org.libsodium.jni.SodiumConstants;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class EncryptedUploaderModule extends ReactContextBaseJavaModule {

    private static final String NAME = "EncryptedUploader";
    private static final String TAG = "EncryptedUploader";
    private final ExecutorService executorService = Executors.newFixedThreadPool(1);
    private final ReactApplicationContext reactContext;

    public EncryptedUploaderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        NaCl.sodium();
    }

    @Override
    public String getName() {
        return NAME;
    }


    @ReactMethod
    public void encryptAndUpload(String filePath, String bucket, String key, String cognitoPoolId, String cognitoRegion,
                                 String publicKeyBase64, String privateKeyBase64, final Promise promise) {
        executorService.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    Log.d(TAG, "Starting encryptAndUpload method");
                    Log.d(TAG, "File path: " + filePath);

                    // Check if file exists
                    File file = new File(filePath);
                    if (!file.exists()) {
                        Log.e(TAG, "File does not exist: " + filePath);
                        throw new FileNotFoundException("File not found: " + filePath);
                    }

                    // Check if file is readable
                    if (!file.canRead()) {
                        Log.e(TAG, "File is not readable: " + filePath);
                        throw new IOException("File is not readable: " + filePath);
                    }

                    // Read file
                    byte[] fileBytes = new byte[(int) file.length()];
                    FileInputStream fis = new FileInputStream(file);
                    int bytesRead = fis.read(fileBytes);
                    fis.close();

                    if (bytesRead != file.length()) {
                        Log.e(TAG, "Failed to read entire file. Read " + bytesRead + " of " + file.length() + " bytes");
                        throw new IOException("Failed to read entire file");
                    }



                    // Generate nonce
                    byte[] nonce = new byte[SodiumConstants.NONCE_BYTES];
                    Sodium.randombytes_buf(nonce, nonce.length);

                    // Decode keys
                    byte[] publicKey = Base64.decode(publicKeyBase64, Base64.DEFAULT);
                    byte[] privateKey = Base64.decode(privateKeyBase64, Base64.DEFAULT);
                    Log.d(TAG, "File read successfully. File size: " + fileBytes.length + " bytes11");
                    // Encrypt
                    byte[] encryptedBytes = new byte[fileBytes.length + SodiumConstants.BOXZERO_BYTES];
                    int result = Sodium.crypto_box_easy(encryptedBytes, fileBytes, fileBytes.length, nonce, publicKey, privateKey);
                        // byte[] encryptedBytes = new byte[fileBytes.length + SodiumConstants.MAC_BYTES];
                        // int result = Sodium.crypto_box(encryptedBytes, fileBytes, fileBytes.length, nonce, publicKey, privateKey);


                    if (result != 0) {
                        Log.e(TAG, "Encryption failed. Result: " + result);
                        throw new RuntimeException("Encryption failed");
                    }else{
                        Log.e(TAG, "Android Encryption Successful: " + result);
                        Log.e(TAG, "Encryption failed. Nonce: " + Base64.encodeToString(nonce, Base64.DEFAULT));
                        Log.e(TAG, "Encryption failed. Public Key: " + Base64.encodeToString(publicKey, Base64.DEFAULT));
                        Log.e(TAG, "Encryption failed. Private Key: " + Base64.encodeToString(privateKey, Base64.DEFAULT));
                        Log.e(TAG, "Encryption failed. Encrypted Data: " + Base64.encodeToString(encryptedBytes, Base64.DEFAULT));


                    }
                    Log.d(TAG, "File encrypted successfully. Encrypted size: " + encryptedBytes.length + " bytes");

                    // Combine nonce and encrypted data
                    byte[] dataToUpload = new byte[nonce.length + encryptedBytes.length];
                    System.arraycopy(nonce, 0, dataToUpload, 0, nonce.length);
                    System.arraycopy(encryptedBytes, 0, dataToUpload, nonce.length, encryptedBytes.length);

                    // Initialize Cognito credentials provider
                    CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
                            reactContext,
                            cognitoPoolId,
                            Regions.fromName(cognitoRegion)
                    );

                    // Initialize S3 client with Cognito credentials
                    AmazonS3Client s3Client = new AmazonS3Client(credentialsProvider);

                    // Prepare and execute upload
                    ObjectMetadata metadata = new ObjectMetadata();
                    metadata.setContentLength(dataToUpload.length);
                    ByteArrayInputStream inputStream = new ByteArrayInputStream(dataToUpload);
                    PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, key, inputStream, metadata);

                    Log.d(TAG, "Starting S3 upload. Bucket: " + bucket + ", Key: " + key);
                    s3Client.putObject(putObjectRequest);
                    Log.d(TAG, "S3 upload completed successfully");

                    // Return the nonce for later decryption
                    String nonceBase64 = Base64.encodeToString(nonce, Base64.NO_WRAP);
                    Log.d(TAG, "Encryption and upload process completed. Returning nonce.");
                    promise.resolve(nonceBase64);
                } catch (FileNotFoundException e) {
                    Log.e(TAG, "File not found: " + e.getMessage(), e);
                    promise.reject("FILE_NOT_FOUND", e.getMessage());
                } catch (IOException e) {
                    Log.e(TAG, "IO error: " + e.getMessage(), e);
                    promise.reject("IO_ERROR", e.getMessage());
                } catch (Exception e) {
                    Log.e(TAG, "Error in encryptAndUpload: " + e.getMessage(), e);
                    promise.reject("UPLOAD_ERROR", e.getMessage());
                }
            }
        });
    }
}