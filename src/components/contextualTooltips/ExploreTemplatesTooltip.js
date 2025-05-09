/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';

export default function ExploreTemplatesTooltip({onPress}) {
  return (
    <CustomToolTipNew
      hornyMode={false}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        onPress();
      }}
      title={'Explore templates'}
      subTitle={'Make instant plans & wish lists with our\npre-made templates!'}
      buttonText={'Next'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',
        position: 'absolute',
        bottom: scaleNew(-20),
        start: scaleNew(0),
        zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-start',
        marginStart: scaleNew(60),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
