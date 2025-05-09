/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },

  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },

  resolver: {
    blacklistRE: exclusionList([
      /clevertap-react-native\/android\/build\/kotlin\/compileDebugKotlin\/caches-jvm\/inputs/,
      /android\/app\/build\/intermediates\/stripped_native_libs\/debug\/out\/lib\/arm64-v8a\/libreact_render_animations\.so\.temp-stream-.*/,
      /react-native-reanimated\/android\/build\/intermediates\/cxx\/Debug\/.*\/libreanimated\.so\.tmp.*/,
      /react-native-keyboard-controller\/android\/build\/kotlin\/compileDebugKotlin\/caches-jvm\/.*/, // Add this line
    ]),
  },
};