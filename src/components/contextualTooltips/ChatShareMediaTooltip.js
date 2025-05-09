/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';

export default function ChatShareMediaTooltip({onPress}) {
  return (
    <CustomToolTipNew
      hornyMode={false}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      // topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        onPress();
      }}
      title={'Share media'}
      subTitle={'Share photos, videos, voice notes,\n& documents'}
      buttonText={'Next'}
      viewToolTip={{
        height: scaleNew(92),
        maxHeight: scaleNew(92),
        width: scaleNew(260),
      }}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? 0 : -scaleNew(4),
      }}
      bottomToolkit={true}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        bottom: scaleNew(50),
        end: scaleNew(16),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: scaleNew(54),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
