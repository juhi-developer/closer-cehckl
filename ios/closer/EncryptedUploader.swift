import Foundation
import React
import AWSCore
import AWSS3
import Sodium

@objc(EncryptedUploader)
class EncryptedUploader: NSObject {
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
@objc func encryptAndUpload(_ filePath: String,
                            bucket: String,
                            key: String,
                            cognitoPoolId: String,
                            cognitoRegion: String,
                            recipientPublicKeyBase64: String,
                            senderPrivateKeyBase64: String,
                            resolver: @escaping RCTPromiseResolveBlock,
                            rejecter: @escaping RCTPromiseRejectBlock) {
    
    print("EncryptedUploader: Starting encryptAndUpload")
    
    guard let fileData = try? Data(contentsOf: URL(fileURLWithPath: filePath)),
          let recipientPublicKey = Data(base64Encoded: recipientPublicKeyBase64),
          let senderPrivateKey = Data(base64Encoded: senderPrivateKeyBase64) else {
        rejecter("INVALID_INPUT", "Invalid input data", nil)
        return
    }
    
    let sodium = Sodium()
    
    // Generate a random nonce
    guard let nonce = sodium.randomBytes.buf(length: sodium.box.NonceBytes) else {
        rejecter("ENCRYPTION_ERROR", "Failed to generate nonce", nil)
        return
    }
    
    // Encrypt the file data
    guard let encryptedData = sodium.box.seal(
        message: [UInt8](fileData),
        recipientPublicKey: [UInt8](recipientPublicKey),
        senderSecretKey: [UInt8](senderPrivateKey),
        nonce: nonce
    ) else {
        rejecter("ENCRYPTION_ERROR", "Failed to encrypt data", nil)
        return
    }
    
    // Configure AWS
    guard let regionType = EncryptedDownloader.getAWSRegionType(from: cognitoRegion) else {
        rejecter("INVALID_REGION", "Invalid AWS region provided", nil)
        return
    }
    
    let credentialsProvider = AWSCognitoCredentialsProvider(regionType: regionType, identityPoolId: cognitoPoolId)
    let configuration = AWSServiceConfiguration(region: regionType, credentialsProvider: credentialsProvider)
    AWSServiceManager.default().defaultServiceConfiguration = configuration
    
    // Create a temporary file for the encrypted data
    let tempDirectoryURL = URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
    let tempFileURL = tempDirectoryURL.appendingPathComponent(UUID().uuidString)
    
    do {
        try Data(encryptedData).write(to: tempFileURL)
    } catch {
        rejecter("FILE_WRITE_ERROR", "Failed to write encrypted data to temporary file", error)
        return
    }
    
    // Upload to S3
    let uploadRequest = AWSS3TransferManagerUploadRequest()!
    uploadRequest.bucket = bucket
    uploadRequest.key = key
    uploadRequest.body = tempFileURL
    
    let transferManager = AWSS3TransferManager.default()
    
    transferManager.upload(uploadRequest).continueWith { (task) -> Any? in
        // Delete the temporary file
        try? FileManager.default.removeItem(at: tempFileURL)
        
        if let error = task.error {
            print("EncryptedUploader: Upload failed with error: \(error)")
            rejecter("UPLOAD_ERROR", "Failed to upload file", error)
        } else {
            print("EncryptedUploader: Upload completed successfully")
            let nonceBase64 = Data(nonce).base64EncodedString()
            resolver(nonceBase64)
        }
        return nil
    }
}
}
