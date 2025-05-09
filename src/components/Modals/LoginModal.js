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
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';

export default function LoginModal(props) {
  const {setModalVisible, modalVisible, onPress} = props;

  const onDismiss = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      backdropTransitionOutTiming={20}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      // avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={10}
      animationInTiming={10}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View
        testID="poke-modal-visible"
        style={{
          backgroundColor: '#F9F1E6',
          padding: scaleNew(20),
          borderTopEndRadius: scaleNew(20),
          borderTopStartRadius: scaleNew(20),
          paddingBottom: scaleNew(60),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: scaleNew(27),
              height: scaleNew(27),
            }}
          />
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scaleNew(26),
              color: '#595959',

              textAlign: 'center',
            }}>
            Log In
          </Text>

          <Pressable
            onPress={() => {
              onDismiss();
            }}
            style={{
              width: scaleNew(27),
              height: scaleNew(27),
              // alignSelf: 'flex-end',
            }}>
            <Image source={require('../../assets/images/closeWhiteBg.png')} />
          </Pressable>
        </View>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(14),
            color: '#808491',
            textAlign: 'center',
            marginBottom: scaleNew(15),
            marginTop: scaleNew(30),
          }}>
          You’ll receive an OTP on your phone{`\n`}number or e-mail basis your
          preference
        </Text>

        <Pressable
          onPress={() => {
            onPress('phone');
          }}
          style={styles.viewButton}>
          <Image source={require('../../assets/images/ic_phone.png')} />
          <Text style={styles.textButton}>Login with phone number</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            onPress('email');
          }}
          style={styles.viewButton}>
          <Image
            // style={{
            //   backgroundColor: 'red',
            // }}
            source={require('../../assets/images/ic_email.png')}
          />
          <Text style={styles.textButton}>Login with e-mail</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    marginTop: scaleNew(15),
    backgroundColor: colors.white,
    borderRadius: scaleNew(100),
    height: scaleNew(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: scaleNew(30),
  },
  textButton: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.blue1,
    marginStart: scaleNew(12),
    includeFontPadding: false,
  },
});
