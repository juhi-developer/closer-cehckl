/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function WellbeingEmotionTooltip() {
  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('firstWellbeingOpenEmotion');
    console.log('first story react tooltip', sticky, Platform.OS);

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('firstWellbeingOpenEmotion', true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CustomToolTipNew
      horyMode={false}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      topToolkit
      onPresLeft={() => {}}
      onPress={() => {
        updateStatus();
      }}
      title={'Labelling emotions is helpful 🤗'}
      subTitle={
        'Select up to 2 emotions that most\nresonate with you in the moment'
      }
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(92),
        maxHeight: scaleNew(92),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        bottom: scaleNew(-90),
        // end: scaleNew(16),
        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'center',
        //   marginEnd: scaleNew(22),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
