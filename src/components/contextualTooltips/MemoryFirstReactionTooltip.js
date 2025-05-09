/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {useAppContext} from '../../utils/VariablesContext';

export default function MemoryFirstReactionTooltip({onPress}) {
  const {hornyMode} = useAppContext();

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
      title={'Introducing reaction stickers!'}
      subTitle={'You can react with cool stickers\nacross Moments!'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',
        position: 'absolute',
        top: scaleNew(22),
        start: scaleNew(0),
        zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-start',
        marginStart: scaleNew(8),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
