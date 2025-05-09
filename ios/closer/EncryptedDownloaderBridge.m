#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(EncryptedDownloaderBridge, NSObject)

RCT_EXTERN_METHOD(downloadAndDecrypt:(NSDictionary *)options
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end