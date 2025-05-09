/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Image, Pressable, Platform} from 'react-native';
import React, {useState} from 'react';
import {fonts} from '../styles/fonts';
import {colors} from '../styles/colors';
import {scale} from '../utils/metrics';
import {useAppContext} from '../utils/VariablesContext';

import {Shadow} from 'react-native-shadow-2';
import {scaleNew} from '../utils/metrics2';

export default function CustomToolTipNew({
  title,
  subTitle,
  onPress,
  buttonText,
  viewStyle,
  styleTooltip,
  topToolkit,
  bottomToolkit,
  buttonVisible,
  viewToolTip,
  textToolTipStyle,
  subTitleStyle,
  textButtonStyle,
  viewNumberTooltipStyle,
  viewButtonTooltip,
  hornyMode,
  shadowContainerStyle,
}) {
  return (
    <View
      style={{
        ...styles.tooltipViewMain,
        ...viewStyle,
      }}>
      {topToolkit && (
        <Image
          style={{
            ...styleTooltip,
            marginBottom: -1,
            tintColor: hornyMode ? '#5C2E8F' : '#fff',
            zIndex: 100,
          }}
          source={require('../assets/images/tooltipArrow.png')}
        />
      )}
      <Shadow
        startColor={'#00000008'}
        endColor={'#00000000'}
        distance={10}
        containerStyle={{
          borderRadius: 10,
          ...shadowContainerStyle,
        }}>
        <View
          style={{
            ...styles.tooltipView,
            ...viewToolTip,
            backgroundColor: hornyMode ? '#5C2E8F' : '#fff',
          }}>
          <Text
            style={{
              ...styles.titleTooltip,
              ...textToolTipStyle,
              color: hornyMode ? '#fff' : '#4F4F4F',
            }}>
            {title.trim()}
          </Text>
          <Text
            style={{
              ...styles.subTitle,
              ...subTitleStyle,
              color: hornyMode ? '#fff' : '#4F4F4F',
            }}>
            {subTitle.trim()}
          </Text>

          <View
            style={{
              alignSelf: 'flex-end',
              ...viewButtonTooltip,
            }}>
            {!buttonVisible && (
              <Pressable onPress={onPress}>
                <Text
                  allowFontScaling={false}
                  style={{
                    ...styles.textButtonTooltip,
                    ...textButtonStyle,
                    color: hornyMode ? '#fff' : colors.blue1,
                  }}>
                  {buttonText}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Shadow>
      {bottomToolkit && (
        <Image
          style={{
            ...styleTooltip,
            ...styles.imgTooltip,
            tintColor: hornyMode ? '#5C2E8F' : '#fff',
            zIndex: 100,
          }}
          source={require('../assets/images/tooltipArrow.png')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipViewMain: {
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: Platform.OS === 'ios' ? 0.1 : 1,
    // shadowRadius: 4.32,
    // elevation: 10,
    zIndex: 100,
  },
  tooltipView: {
    backgroundColor: colors.white,
    width: scaleNew(324),
    height: scaleNew(108),
    borderRadius: scaleNew(10),
    padding: scaleNew(11),
    zIndex: 100,
    //  elevation: 3,
  },
  titleTooltip: {
    fontFamily: fonts.semiBoldFont,
    //fontWeight: '700',
    fontSize: scaleNew(12),
    color: '#4F4F4F',
  },
  subTitle: {
    fontFamily: fonts.regularFont,
    fontWeight: '400',
    fontSize: scaleNew(12),
    color: '#4F4F4F',
    lineHeight: 17,

    marginTop: scaleNew(5),
  },

  textButtonTooltip: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(12),
    color: colors.blue1,
    //  fontWeight: '500',
  },
  imgTooltip: {marginTop: -1},
});
