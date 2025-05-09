// AppStateListener.m
#import "AppStateListener.h"

@implementation AppStateListener

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
    return @[@"AppStateChanged"];
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppStateChange:) name:UIApplicationWillResignActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppStateChange:) name:UIApplicationWillEnterForegroundNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppStateChange:) name:UIApplicationDidEnterBackgroundNotification object:nil];
  
//  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppStateChange:) name:UIApplicationDidBecomeActiveNotification object:nil];

}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleAppStateChange:(NSNotification *)notification {
    NSString *appState;
    if (
//        [notification.name isEqualToString:UIApplicationWillResignActiveNotification] ||
        [notification.name isEqualToString:UIApplicationDidEnterBackgroundNotification]) {
        appState = @"background";
    } else {
        appState = @"active";
    }
    [self sendEventWithName:@"AppStateChanged" body:@{@"appState": appState}];
}

@end
