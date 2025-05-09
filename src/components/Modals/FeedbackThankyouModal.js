/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';

export default function FeedbackThankyouModal(props) {
  const {setModalVisible, modalVisible} = props;

  const onDismiss = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setModalVisible(false);
    }, 2500);
  }, []);

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
        style={{
          backgroundColor: '#F9F1E6',
          padding: scaleNew(20),
          borderTopEndRadius: scaleNew(20),
          borderTopStartRadius: scaleNew(20),
          paddingBottom: scaleNew(85),
        }}>
        <View
          style={{
            alignItems: 'center',
            marginTop: scaleNew(10),
          }}>
          <Image source={require('../../assets/images/greenTickIcon.png')} />
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scaleNew(26),
              color: '#595959',

              textAlign: 'center',
              marginTop: scaleNew(10),
            }}>
            Thank you for the{`\n`}feedback 🫶🏻
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            textAlign: 'center',

            marginTop: scaleNew(21),
          }}>
          We’ll promptly reach out to you on e-mail,{`\n`}to address your issues
        </Text>
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
