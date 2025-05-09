import Foundation
import React

@objc(EncryptedDownloaderBridge)
class EncryptedDownloaderBridge: NSObject {
    
    @objc(downloadAndDecrypt:withResolver:withRejecter:)
    func downloadAndDecrypt(_ options: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        EncryptedDownloader.downloadAndDecrypt(options as! [String: Any], resolver: resolve, rejecter: reject)
    }
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
}