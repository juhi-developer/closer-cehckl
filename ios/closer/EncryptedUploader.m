#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EncryptedUploader, NSObject)

RCT_EXTERN_METHOD(encryptAndUpload:(NSString *)filePath
                  bucket:(NSString *)bucket
                  key:(NSString *)key
                  cognitoPoolId:(NSString *)cognitoPoolId
                  cognitoRegion:(NSString *)cognitoRegion
                  recipientPublicKeyBase64:(NSString *)recipientPublicKeyBase64
                  senderPrivateKeyBase64:(NSString *)senderPrivateKeyBase64
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
