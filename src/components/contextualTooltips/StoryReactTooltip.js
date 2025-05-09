/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function StoryReactTooltip() {
  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('firstStoryAdded');
    console.log('first story react tooltip', sticky, Platform.OS);

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('firstStoryAdded', true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <CustomToolTipNew
      hornyMode={false}
      viewNumberTooltipStyle={{
        //   paddingBottom: scaleNew(10),
        paddingTop: scaleNew(16),
      }}
      onPress={() => {
        updateStatus();
      }}
      // topToolkit
      onPresLeft={() => {}}
      title={'Reply & react to stories!'}
      subTitle={'You can swipe up to react or reply\nin chat!'}
      buttonText={'Okay'}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      bottomToolkit={true}
      viewStyle={{
        alignSelf: 'center',

        position: 'absolute',
        top: -scaleNew(100),
        // // end: -scaleNew(4),
        // zIndex: 1000000,
      }}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? -scaleNew(0) : -scaleNew(4),
      }}
      styleTooltip={{
        alignSelf: 'center',
        // marginEnd: scaleNew(8),
        transform: [{rotate: '180deg'}],
      }}
    />
  );
}

const styles = StyleSheet.create({});
