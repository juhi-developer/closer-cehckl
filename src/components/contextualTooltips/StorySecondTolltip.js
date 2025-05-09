/* eslint-disable react-native/no-inline-styles */
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {fonts} from '../../styles/fonts';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function StorySecondTolltip({storiesLength}) {
  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('secondStoryAdded');
    console.log('second story react tooltip', sticky, Platform.OS);

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('secondStoryAdded', true);
  };

  if (!isVisible) {
    return null;
  }

  if (storiesLength < 2) {
    return null;
  }
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
        updateStatus();
      }}
      title={'Save & share your stories!'}
      subTitle={'Save stories to Highlights and share\nit with your friends!'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',
        position: 'absolute',
        top: scaleNew(24),
        end: scaleNew(0),
        zIndex: 1000000,
      }}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? -scaleNew(0) : -scaleNew(4),
      }}
      styleTooltip={{
        alignSelf: 'flex-end',
        marginEnd: scaleNew(8),
        //   transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
