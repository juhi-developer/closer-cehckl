/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';

export default function EveningModeModal(props) {
  const {setModalVisible, modalVisible} = props;

  const onDismiss = async () => {
    await updateContextualTooltipState('eveningModeDialogShown', true);
    setModalVisible(false);
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      onCloseRequest={() => {
        onDismiss();
      }}
      style={{
        margin: 0,
        flex: 1,
        justifyContent: 'flex-end',

        width: '100%',
      }}>
      <ImageBackground
        source={require('../../assets/images/eveningModeBgPopup.png')}
        style={{
          backgroundColor: '#F9F1E6',

          borderTopEndRadius: scaleNew(26),
          borderTopStartRadius: scaleNew(26),
          overflow: 'hidden',
          paddingBottom: scaleNew(60),
          width: '100%',
        }}>
        <View
          style={{
            padding: scaleNew(16),
          }}>
          <Pressable
            onPress={() => {
              onDismiss();
            }}
            style={{
              width: scaleNew(27),
              height: scaleNew(27),
              alignSelf: 'flex-end',
            }}>
            <Image source={require('../../assets/images/closeWhiteBg.png')} />
          </Pressable>
          <Image
            style={{
              //  width: scaleNew(180),
              height: scaleNew(219),
              alignSelf: 'center',
              marginTop: scaleNew(18),
              borderRadius: scaleNew(16),
              width: '100%',
            }}
            source={require('../../assets/images/eveningModeImg.png')}
          />

          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scaleNew(26),
              color: colors.white,

              marginTop: scaleNew(21),
            }}>
            Introducing Evening colors
          </Text>

          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scaleNew(16),
              color: '#C7C7CC',

              marginTop: scaleNew(9),
            }}>
            The top half of your Moments will turn darker post 6 pm, to make it
            easier on your eyes. You can turn off evening mode from profile.
          </Text>

          <Pressable
            onPress={() => {
              onDismiss();
            }}
            style={styles.viewButton}>
            <Text style={styles.textButton}>Okay</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    marginTop: scaleNew(77),
    backgroundColor: colors.white,
    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleNew(10),
    marginHorizontal: scaleNew(10),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.blue1,

    includeFontPadding: false,
  },
});
