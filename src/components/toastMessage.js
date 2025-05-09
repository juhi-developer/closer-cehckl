import Toast from 'react-native-simple-toast';

export const ToastMessage = message =>
  Toast.showWithGravity(message, Toast.SHORT, Toast.TOP, [
    'RCTModalHostViewController',
    'UIAlertController',
  ]);

export const ToastMessageBottom = message =>
  Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM, [
    'RCTModalHostViewController',
    'UIAlertController',
  ]);

// Toast.show(message, Toast.TOP, [
//   'RCTModalHostViewController',
//   'UIAlertController',
// ]);
