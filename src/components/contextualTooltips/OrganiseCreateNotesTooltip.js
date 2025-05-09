/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';

export default function OrganiseCreateNotesTooltip({onPress}) {
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
      title={'Create notes & to dos'}
      subTitle={'You can also tag yourself and your\npartner in to dos!'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      bottomToolkit={true}
      viewStyle={{
        alignSelf: 'center',

        //   position: 'absolute',
        top: Platform.OS === 'ios' ? -scaleNew(74) : -scaleNew(84),
        // end: -scaleNew(4),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: Platform.OS === 'ios' ? scaleNew(32) : scaleNew(40),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
