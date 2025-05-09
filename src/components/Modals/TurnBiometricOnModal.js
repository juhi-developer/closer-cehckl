/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';

export default function TurnBiometricOnModal(props) {
  const {setModalVisible, modalVisible, onPress} = props;

  console.log('modal visible jsss', modalVisible);

  const onDismiss = async () => {
    await updateContextualTooltipState('biometricShown', true);
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
      <View
        style={{
          backgroundColor: '#F9F1E6',
          padding: scaleNew(16),
          borderTopEndRadius: scaleNew(20),
          borderTopStartRadius: scaleNew(20),
          paddingBottom: scaleNew(60),
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
            width: scaleNew(180),
            height: scaleNew(83),
            alignSelf: 'center',
            marginTop: scaleNew(14),
          }}
          source={require('../../assets/images/biometricOnIcon.png')}
        />

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(26),
            color: '#595959',

            textAlign: 'center',
            marginTop: scaleNew(28),
          }}>
          turn biometrics on?
        </Text>

        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            textAlign: 'center',

            marginTop: scaleNew(8),
          }}>
          Use biometrics to securely open your app{`\n`}and prevent unauthorized
          access
        </Text>

        <Pressable
          onPress={() => {
            onPress();
          }}
          style={styles.viewButton}>
          <Text style={styles.textButton}>Set biometrics in profile</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    marginTop: scaleNew(40),
    backgroundColor: '#124698',
    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleNew(10),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.white,

    includeFontPadding: false,
  },
});
