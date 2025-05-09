import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const HapticFeedback = () => {
  ReactNativeHapticFeedback.trigger('impactLight', options);
};

export const HapticFeedbackHeavy = () => {
  ReactNativeHapticFeedback.trigger('impactHeavy', options);
};
