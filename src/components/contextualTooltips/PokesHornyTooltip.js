/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function PokesHornyTooltip() {
  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('hornyModeFirstTime');

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('hornyModeFirstTime', true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CustomToolTipNew
      hornyMode={true}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      // topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        updateStatus();
      }}
      title={'Pokes just got spicy 🔥'}
      subTitle={'Hot pokes are at your disposal! Use\nresponsibly 😎'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      bottomToolkit={true}
      viewButtonTooltip={{
        marginTop: -scaleNew(6),
      }}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        top: -scaleNew(102),
        end: scaleNew(0),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: scaleNew(18),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
