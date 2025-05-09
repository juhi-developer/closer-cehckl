import React from 'react';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {colors} from './colors';
import {fonts} from './fonts';
import {scale} from '../utils/metrics';
import {scaleNew} from '../utils/metrics2';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
// export const INSETS = useSafeAreaInsets()

export const CARD_HEIGHT = {
  extraSmall: scale(150),
  small: scale(184),
  medium: scale(212),
  large: scale(268),
  extraLarge: scale(392),
  doubleExtraLarge: scale(392),
};

export const BOTTOM_SPACE = 24; // space under every bottom sheet

// if two buttons are placed in row;
const APP_MARGIN = 16; // marginHorizontal for screen container
const END_MARGIN = 6; // when applied for marginStart and marginEnd
export const BUTTON_WIDTH = SCREEN_WIDTH / 2 - APP_MARGIN - END_MARGIN;

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  viewContainer: {
    marginHorizontal: scale(20),
  },
  apphorizontalSpacing: {
    marginHorizontal: scaleNew(16),
  },
  icon: {
    width: scale(28),
    height: scale(28),
  },
  emojiIcon: {
    width: scale(16),
    height: scale(17),
    resizeMode: 'contain',
  },
  mediumIcon: {
    width: scale(24),
    height: scale(24),
  },

  // for text
  regularSmallText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: colors.text,
  },
  regularMediumText: {
    fontFamily: fonts.regularFont,
    color: colors.text,
    fontSize: scale(14),
  },
  regularLargeText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: colors.text,
  },
  lightSmallText: {
    fontFamily: fonts.lightFont,
    fontSize: scale(12),
    color: colors.text,
  },
  lightMediumText: {
    fontFamily: fonts.lightFont,
    color: colors.text,
    fontSize: scale(14),
  },
  lightLargeText: {
    fontFamily: fonts.lightFont,
    fontSize: scale(16),
    color: colors.text,
  },

  standardSmallText: {
    fontFamily: fonts.standardFont,
    fontSize: scale(12),
    color: colors.text,
  },
  standardMediumText: {
    fontFamily: fonts.standardFont,
    color: colors.text,
    fontSize: scale(14),
  },
  standardLargeText: {
    fontFamily: fonts.standardFont,
    fontSize: scale(16),
    color: colors.text,
  },

  boldSmallText: {
    fontFamily: fonts.boldFont,
    fontSize: scale(12),
    color: colors.text,
  },
  boldMediumText: {
    fontFamily: fonts.boldFont,
    color: colors.text,
    fontSize: scale(14),
  },
  boldLargeText: {
    fontFamily: fonts.boldFont,
    fontSize: scale(16),
    color: colors.text,
  },

  semiBoldSmallText: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(12),
    color: colors.text,
  },
  semiBoldMediumText: {
    fontFamily: fonts.semiBoldFont,
    color: colors.text,
    fontSize: scale(14),
  },
  semiBoldLargeText: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    color: colors.text,
  },

  italicSmallText: {
    fontFamily: fonts.italicFont,
    fontSize: scale(12),
    color: colors.text,
  },
  italicMediumText: {
    fontFamily: fonts.italicFont,
    color: colors.text,
    fontSize: scale(14),
  },
  italicLargeText: {
    fontFamily: fonts.italicFont,
    fontSize: scale(16),
    color: colors.text,
  },

  boldItalicSmallText: {
    fontFamily: fonts.boldItalicFont,
    fontSize: scale(12),
    color: colors.text,
  },
  boldItalicMediumText: {
    fontFamily: fonts.boldItalicFont,
    color: colors.text,
    fontSize: scale(14),
  },
  boldItalicLargeText: {
    fontFamily: fonts.boldItalicFont,
    fontSize: scale(16),
    color: colors.text,
  },

  titleLabel: {
    fontFamily: fonts.semiBoldFont,
    color: colors.text,
    fontSize: scale(24),
    textAlign: 'center',
    lineHeight: scale(40),
  },
  cornerHeaderTitle: {
    // ...globalStyles.semiBoldLargeText,
    fontFamily: fonts.semiBoldFont,
    color: colors.text,
    marginStart: scale(6),
    fontSize: scale(18),
    fontWeight: 500,
  },

  backgroundShadowContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});
