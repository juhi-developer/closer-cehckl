/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {useAppContext} from '../../utils/VariablesContext';

export default function ChatEmojiTooltip({onPress}) {
  return (
    <CustomToolTipNew
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      hornyMode={false}
      // topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        onPress();
      }}
      title={'Use emojis, stickers & GIFs'}
      subTitle={'Never hold back while chatting!'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(92),
        maxHeight: scaleNew(92),
        width: scaleNew(260),
      }}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? scaleNew(20) : scaleNew(12),
      }}
      bottomToolkit={true}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        bottom: scaleNew(50),
        end: scaleNew(40),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: scaleNew(72),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
