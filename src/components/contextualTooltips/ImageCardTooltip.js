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

export default function ImageCardTooltip() {
  const {hornyMode} = useAppContext();

  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('firstImageCardAdded');

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('firstImageCardAdded', true);
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
      title={'#Throwback to the good times!'}
      subTitle={
        'Prompts stay for a day and photos\nsync into your Memories feed'
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
        bottom: scaleNew(-110),

        // zIndex: 1000000,
      }}
      styleTooltip={{
        alignSelf: 'center',

        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
