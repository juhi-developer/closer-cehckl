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

export default function MoodCardFirstTooltip() {
  const {hornyMode} = useAppContext();

  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('firstMoodCardAdded');

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('firstMoodCardAdded', true);
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
      title={'Add multiple cards'}
      subTitle={
        'You can add multiple well-being\ncards; they stay for 2 days :)'
      }
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? -scaleNew(0) : -scaleNew(4),
      }}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(92),
        maxHeight: scaleNew(92),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        bottom: scaleNew(-78),
        // // end: -scaleNew(4),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'center',
        // marginEnd: scaleNew(8),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
