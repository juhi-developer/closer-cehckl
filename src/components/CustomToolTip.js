import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {fonts} from '../styles/fonts';
import {colors} from '../styles/colors';
import {scale} from '../utils/metrics';

export default function CustomToolTip({
  title,
  onPress,
  buttonText,
  textNumber,
  viewStyle,
  styleTooltip,
  topToolkit,
  bottomToolkit,
  buttonVisible,
  viewToolTip,
  textToolTipStyle,
  buttonStyle,
  textButtonStyle,
  textNumberTooltipStyle,
  viewNumberTooltipStyle,
  onPresLeft = false,
}) {
  return (
    <View
      style={{
        ...styles.tooltipViewMain,
        ...viewStyle,
      }}>
      {topToolkit && (
        <Image
          style={{...styleTooltip, marginBottom: -1}}
          source={require('../assets/images/tooltipArrow.png')}
        />
      )}
      <View style={{...styles.tooltipView, ...viewToolTip}}>
        <Text style={{...styles.titleTooltip, ...textToolTipStyle}}>
          {title.trim()}
        </Text>
        <View style={{...styles.viewSpaceTooltip, ...viewNumberTooltipStyle}}>
          <Pressable onPress={() => onPresLeft?.()} disabled={!onPresLeft}>
            <Text
              //  allowFontScaling={false}
              style={{...styles.textNumberTooltip, ...textNumberTooltipStyle}}>
              {textNumber}
            </Text>
          </Pressable>
          {!buttonVisible && (
            <Pressable
              onPress={onPress}
              style={{...styles.viewButtonTooltip, ...buttonStyle}}>
              <Text
                allowFontScaling={false}
                style={{...styles.textButtonTooltip, ...textButtonStyle}}>
                {buttonText}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      {bottomToolkit && (
        <Image
          style={{...styleTooltip, ...styles.imgTooltip}}
          source={require('../assets/images/tooltipArrow.png')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipViewMain: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.32,
    elevation: 3,
    zIndex: 100,
  },
  tooltipView: {
    backgroundColor: colors.white,
    width: scale(324),
    height: scale(108),
    borderRadius: scale(8),
    padding: scale(12),
    justifyContent: 'space-between',
    zIndex: 100,
  },
  titleTooltip: {
    fontFamily: fonts.regularFont,
    fontWeight: '400',
    fontSize: scale(14),
    color: colors.black,
    //  lineHeight: scale(19),
  },
  viewSpaceTooltip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textNumberTooltip: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: '#7C808B',
    fontWeight: '400',
  },
  viewButtonTooltip: {
    backgroundColor: colors.blue1,
    borderRadius: 50,
    width: scale(108),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonTooltip: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.white,
    fontWeight: '500',
  },
  imgTooltip: {marginTop: -1},
});
