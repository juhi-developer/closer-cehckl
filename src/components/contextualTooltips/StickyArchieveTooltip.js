/* eslint-disable react-native/no-inline-styles */
import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomToolTipNew from '../CustomToolTipNew';
import {scaleNew} from '../../utils/metrics2';
import {fonts} from '../../styles/fonts';
import {useAppContext} from '../../utils/VariablesContext';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../utils/contextualTooltips';

export default function StickyArchieveTooltip() {
  const {hornyMode} = useAppContext();

  const [isVisible, setsVisible] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const sticky = await checkContextualTooltip('firstStickyNoteAdded');

    if (sticky !== true) {
      setsVisible(true);
    }
  };

  const updateStatus = async () => {
    setsVisible(false);
    await updateContextualTooltipState('firstStickyNoteAdded', true);
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
      title={'Archive for stickies'}
      subTitle={'You can access your past stickies from the archive'}
      buttonText={'Okay'}
      viewButtonTooltip={{
        marginTop: Platform.OS === 'ios' ? -scaleNew(0) : -scaleNew(4),
      }}
      viewToolTip={{
        height: scaleNew(89),
        maxHeight: scaleNew(89),
        width: scaleNew(260),
      }}
      viewStyle={{
        alignSelf: 'center',
        position: 'absolute',
        top: scaleNew(22),
        end: -scaleNew(4),
        zIndex: 1000000,
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
