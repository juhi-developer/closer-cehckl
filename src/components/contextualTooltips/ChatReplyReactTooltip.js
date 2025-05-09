/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';

export default function ChatReplyReactTooltip({sentByUser, onPress}) {
  return (
    <CustomToolTipNew
      hornyMode={false}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      bottomToolkit
      // topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        onPress();
      }}
      title={'Reply & react to msgs'}
      subTitle={
        'Swipe left to reply to a msg, and\nlong press to react with stickers &\nemoji!'
      }
      buttonText={'Okay'}
      shadowContainerStyle={{
        overflow: 'hidden',
      }}
      viewToolTip={{
        height: scaleNew(97),
        maxHeight: scaleNew(97),
        width: scaleNew(260),
        marginStart: sentByUser ? scaleNew(100) : scaleNew(20),
        marginEnd: sentByUser ? 0 : scaleNew(100),
      }}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? -scaleNew(8) : -scaleNew(14),
      }}
      viewStyle={{
        alignSelf: 'center',

        // position: 'absolute',
        // top: scaleNew(60),
        // end: scaleNew(24),
        zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: sentByUser ? 'flex-end' : 'flex-start',
        marginEnd: sentByUser ? scaleNew(54) : 0,
        marginStart: sentByUser ? 0 : scaleNew(54),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
