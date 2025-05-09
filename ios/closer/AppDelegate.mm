#import "AppDelegate.h"
#import <Firebase.h>
#import "RNFBMessagingModule.h"

#import <React/RCTBundleURLProvider.h>
#import <CleverTapSDK/CleverTap.h>
#import <React/RCTBridge.h>
#import <React/RCTRootView.h>

//#import <CleverTap-iOS-SDK/CleverTap.h>
#import <CleverTapReact/CleverTapReactManager.h>

//#import <clevertap-react-native/CleverTapReactManager.h>
#import <React/RCTLinkingManager.h>
#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <AWSCore/AWSCore.h>
#import "RNAppAuthAuthorizationFlowManager.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  self.moduleName = @"closer";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:@{} withLaunchOptions:launchOptions];

  // Register BackgroundFetch
  [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  [CleverTap autoIntegrate]; // integrate CleverTap SDK using the autoIntegrate option
  [[CleverTapReactManager sharedInstance] applicationDidLaunchWithOptions:launchOptions];



    // Initialize AWS
    AWSCognitoCredentialsProvider *credentialsProvider = [[AWSCognitoCredentialsProvider alloc] 
        initWithRegionType:AWSRegionAPSouth1 
        identityPoolId:@"ap-south-1:5da29044-25d5-4ad8-b1ea-803d8ddd2bbe"];
    
    AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] 
        initWithRegion:AWSRegionAPSouth1 
        credentialsProvider:credentialsProvider];
    
    [AWSServiceManager defaultServiceManager].defaultServiceConfiguration = configuration;

    NSLog(@"AWS Configuration set up in AppDelegate");



  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = [[RCTRootView alloc] initWithBridge:bridge
                                                     moduleName:@"closer"
                                              initialProperties:self.initialProps];
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler{
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
}


//- (BOOL)application:(UIApplication *)application
//            openURL:(NSURL *)url
//            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
//{
//  return [RCTLinkingManager application:application openURL:url options:options];
//}


 - (BOOL) application: (UIApplication *)application
              openURL: (NSURL *)url
              options: (NSDictionary<UIApplicationOpenURLOptionsKey, id> *) options
 {
   if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
     return YES;
   }
   return [RCTLinkingManager application:application openURL:url options:options];
 }


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
