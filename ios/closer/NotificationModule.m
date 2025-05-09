#import "NotificationModule.h"
#import <React/RCTBridgeModule.h>
#import <UserNotifications/UserNotifications.h>

@interface NotificationModule() <RCTBridgeModule>
@end

@implementation NotificationModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(clearAllNotifications)
{
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center removeAllDeliveredNotifications];
}

@end
