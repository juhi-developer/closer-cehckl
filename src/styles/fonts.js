import {Platform} from 'react-native';

export const fonts = {
  regularFont: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular', // regular dropped fontweight doesn't work for android
  lightFont: Platform.OS === 'ios' ? 'Poppins-Light' : 'Poppins-Light',
  standardFont: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium', //same as regular bcoz fontweight doesn't work for android
  boldFont: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  semiBoldFont: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  italicFont: Platform.OS === 'ios' ? 'Poppins-Italic' : 'Poppins-Italic',
  boldItalicFont:
    Platform.OS === 'ios' ? 'Poppins-BoldItalic' : 'PoppinsBold-Italic',
  extraBold: 'Poppins-ExtraBold',
  regularSerif: 'DMSerifDisplay-Regular',
  italicCaveat: Platform.OS ? 'Caveat-Regular' : 'Caveat-VariableFont_wght',
  italicCaveatAndroid: 'Caveat-VariableFont_wght',
  caveatBold: 'Caveat-Bold',
  playFairSemiBold: 'PlayfairDisplay-SemiBold',
  playFairMedium: 'PlayfairDisplay-Medium',
  notoSansRegular: 'NotoSans-Regular',
  notoSansItalicRegular: 'NotoSans-Italic',
  notoSansItalicLight: 'NotoSans-LightItalic',
};
