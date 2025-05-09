/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {useAppContext} from '../../utils/VariablesContext';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function MoodCardExpandTooltip() {
  const {hornyMode} = useAppContext();

  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('moodCardAddedWithContext');

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('moodCardAddedWithContext', true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CustomToolTipNew
      hornyMode={hornyMode}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        updateStatus();
      }}
      title={'Tap here to expand'}
      subTitle={'Tap anywhere on the card or the\narrow to read the context'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      textButtonStyle={{
        marginTop: -scaleNew(4),
      }}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        bottom: scaleNew(-78),
        end: scaleNew(0),
        zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: scaleNew(22),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
