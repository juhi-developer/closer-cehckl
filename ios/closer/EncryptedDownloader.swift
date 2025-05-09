import Foundation
import React
import AWSCore
import AWSS3
import Sodium

@objc class EncryptedDownloader: NSObject {
    static func getAWSRegionType(from string: String) -> AWSRegionType? {
        switch string.lowercased() {
        case "us-east-1": return .USEast1
        case "us-east-2": return .USEast2
        case "us-west-1": return .USWest1
        case "us-west-2": return .USWest2
        case "eu-west-1": return .EUWest1
        case "eu-west-2": return .EUWest2
        case "eu-central-1": return .EUCentral1
        case "ap-southeast-1": return .APSoutheast1
        case "ap-southeast-2": return .APSoutheast2
        case "ap-northeast-1": return .APNortheast1
        case "ap-northeast-2": return .APNortheast2
        case "sa-east-1": return .SAEast1
        case "cn-north-1": return .CNNorth1
        case "ca-central-1": return .CACentral1
        case "ap-south-1": return .APSouth1
        default: return nil
        }
    }

    @objc static func downloadAndDecrypt(_ options: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        print("EncryptedDownloader: Starting downloadAndDecrypt")
        print("EncryptedDownloader: Received options: \(options)")


      
        guard let bucket = options["bucket"] as? String,
              let key = options["key"] as? String,
              let cognitoPoolId = options["cognitoPoolId"] as? String,
              let cognitoRegion = options["cognitoRegion"] as? String,
              let nonceBase64 = options["nonceBase64"] as? String,
              let senderPublicKeyBase64 = options["senderPublicKeyBase64"] as? String,
              let recipientPrivateKeyBase64 = options["recipientPrivateKeyBase64"] as? String else {
            print("EncryptedDownloader: Invalid parameters provided")
            rejecter("INVALID_PARAMS", "Invalid parameters provided", nil)
            return
        }
        
        print("EncryptedDownloader: Parameters validated successfully")
        print("EncryptedDownloader: Bucket: \(bucket), Key: \(key), CognitoPoolId: \(cognitoPoolId), CognitoRegion: \(cognitoRegion)")
        
        // Configure AWS
        guard let regionType = getAWSRegionType(from: cognitoRegion) else {
            print("EncryptedDownloader: Invalid AWS region provided: \(cognitoRegion)")
            rejecter("INVALID_REGION", "Invalid AWS region provided", nil)
            return
        }
        
        let credentialsProvider = AWSCognitoCredentialsProvider(regionType: regionType, identityPoolId: cognitoPoolId)
        let configuration = AWSServiceConfiguration(region: regionType, credentialsProvider: credentialsProvider)
        AWSServiceManager.default().defaultServiceConfiguration = configuration
        
        print("EncryptedDownloader: AWS configuration set up")
        
        // Download from S3
        let s3 = AWSS3.default()
        let getObjectRequest = AWSS3GetObjectRequest()
        getObjectRequest?.bucket = bucket
        getObjectRequest?.key = key
        
        print("EncryptedDownloader: Starting S3 download")
        
        s3.getObject(getObjectRequest!).continueWith { (task) -> Any? in
            if let error = task.error as NSError? {
                let errorMessage = "Failed to download file: \(error.localizedDescription). Error code: \(error.code), Domain: \(error.domain)"
                print("EncryptedDownloader: AWS Error: \(errorMessage)")
                print("EncryptedDownloader: Full error: \(error)")
                
                if let cognitoError = AWSCognitoIdentityErrorType(rawValue: error.code) {
                    print("EncryptedDownloader: Cognito Error Type: \(cognitoError)")
                }
                
                rejecter("DOWNLOAD_ERROR", errorMessage, error)
                return nil
            }
            
            guard let result = task.result, let body = result.body as? Data else {
                print("EncryptedDownloader: Failed to retrieve data from S3")
                rejecter("DOWNLOAD_ERROR", "Failed to retrieve data from S3", nil)
                return nil
            }
            
             print("EncryptedDownloader: S3 download successful")

                 guard let encryptedData = result.body as? Data else {
        print("EncryptedDownloader: Failed to retrieve data from S3 result body")
        if let body = result.body {
            print("EncryptedDownloader: Result body type: \(type(of: body))")
        } else {
            print("EncryptedDownloader: Result body is nil")
        }
        rejecter("DOWNLOAD_ERROR", "Failed to retrieve data from S3 result body", nil)
        return nil
    }
    

        guard let senderPublicKey = Data(base64Encoded: senderPublicKeyBase64),
              let recipientSecretKey = Data(base64Encoded: recipientPrivateKeyBase64) else {
            print("EncryptedDownloader: Failed to decode keys")
            rejecter("INVALID_KEYS", "Failed to decode keys", nil)
            return nil
        }
        
       print("EncryptedDownloader: Retrieved encrypted data from S3")
print("EncryptedDownloader: Encrypted data size: \(encryptedData.count) bytes")
print("EncryptedDownloader: First 24 bytes (possible nonce): \(Array(encryptedData.prefix(24)))")
print("EncryptedDownloader: Next 32 bytes (possible encrypted data start): \(Array(encryptedData.dropFirst(24).prefix(32)))")


       let sodium = Sodium()

// Use the provided nonce instead of extracting it from data
guard let nonceData = Data(base64Encoded: nonceBase64) else {
    print("EncryptedDownloader: Failed to decode nonce from base64")
    rejecter("INVALID_NONCE", "Failed to decode nonce", nil)
    return nil
}
let expectedNonce = Array(nonceData)

// Check if the encrypted data starts with the expected nonce
let firstBytes = Array(encryptedData.prefix(24))
let cipherText: [UInt8]

if firstBytes == expectedNonce {
    print("EncryptedDownloader: Found prefixed nonce (Android format), removing it")
    cipherText = Array(encryptedData.dropFirst(24))
} else {
    print("EncryptedDownloader: No prefixed nonce found (iOS format), using full data")
    cipherText = Array(encryptedData)
}

print("EncryptedDownloader: Nonce from params: \(expectedNonce)")
print("EncryptedDownloader: CipherText length: \(cipherText.count)")

guard let decryptedData = sodium.box.open(
    authenticatedCipherText: cipherText,
    senderPublicKey: [UInt8](senderPublicKey),
    recipientSecretKey: [UInt8](recipientSecretKey),
    nonce: expectedNonce
) else {
    print("EncryptedDownloader: Decryption failed")
    print("EncryptedDownloader: Sender Public Key (bytes): \([UInt8](senderPublicKey))")
    print("EncryptedDownloader: Recipient Secret Key (bytes): \([UInt8](recipientSecretKey))")
    rejecter("DECRYPTION_ERROR", "Failed to decrypt data", nil)
    return nil
}

// At this point, decryptedData contains the complete, original file contents
// No bytes are removed from the decrypted data
print("EncryptedDownloader: Decryption successful")
print("EncryptedDownloader: Decrypted Data Size: \(decryptedData.count) bytes")

    // Extract just the file name from the key
    guard let key = options["key"] as? String else {
        rejecter("INVALID_KEY", "Invalid or missing key", nil)
        return
    }
    
       let fileName = (key as NSString).lastPathComponent
        print("EncryptedDownloader: File name: \(fileName)")

        guard let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
            rejecter("FILE_PATH_ERROR", "Unable to access document directory", nil)
            return
        }
        
        let filePath = documentsDirectory.appendingPathComponent(fileName).path
        
        do {
            try Data(decryptedData).write(to: URL(fileURLWithPath: filePath))
            print("EncryptedDownloader: Decrypted file saved successfully at: \(filePath)")
            
            // Delete the file from S3
            deleteFileFromS3(bucket: options["bucket"] as? String ?? "", key: key) { success in
                if success {
                    print("EncryptedDownloader: File successfully deleted from S3")
                } else {
                    print("EncryptedDownloader: Failed to delete file from S3")
                }
                resolver(fileName)  // Return just the file name, regardless of S3 deletion result
            }
    } catch {
        print("EncryptedDownloader: Failed to write decrypted data to file: \(error.localizedDescription)")
        rejecter("FILE_WRITE_ERROR", "Failed to write decrypted data to file", error)
    }
        
        return nil
        }
    }

        private static func deleteFileFromS3(bucket: String, key: String, completion: @escaping (Bool) -> Void) {
        let deleteRequest = AWSS3DeleteObjectRequest()!
        deleteRequest.bucket = bucket
        deleteRequest.key = key

        AWSS3.default().deleteObject(deleteRequest).continueWith { (task) -> Any? in
            if let error = task.error {
                print("EncryptedDownloader: Error deleting file from S3: \(error.localizedDescription)")
                completion(false)
            } else {
                print("EncryptedDownloader: File deleted from S3 successfully")
                completion(true)
            }
            return nil
        }
    }
}
