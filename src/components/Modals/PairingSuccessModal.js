import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import {VARIABLES} from '../../utils/variables';
import LottieView from 'lottie-react-native';

export default function PairingSuccessModal(props) {
  const {setModalVisible, modalVisible, onPress} = props;

  return (
    <Modal
      backdropTransitionOutTiming={20}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      // avoidKeyboard={true}
      // animationIn="slideInUp"
      // animationOut="slideOutDown"
      animationOutTiming={10}
      animationInTiming={10}
      onBackButtonPress={() => {
        //    setModalVisible(false);
      }}
      onBackdropPress={() => {
        //  setModalVisible(false);
      }}
      style={{margin: 0, alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: colors.white,
          margin: scale(20),
          alignItems: 'center',
          borderRadius: 20,
          paddingHorizontal: scale(34),
          paddingBottom: scale(32),
          width: scale(362),
        }}>
        <Image
          style={{marginTop: -scale(30)}}
          source={require('../../assets/images/closerIconBlueBgRound.png')}
        />

        <LottieView
          style={{
            width: scale(460),
            height: scale(400),
            position: 'absolute',
            top: scale(-30),
          }}
          source={require('../../assets/images/gifs/confetti.json')}
          autoPlay
          loop
        />
        <Text style={{...styles.title, marginTop: scale(18)}}>
          Hi {VARIABLES.user?.name}!
        </Text>
        <Text style={{...styles.title, marginTop: scale(33)}}>
          Congrats on pairing with {VARIABLES.user?.partnerData?.partner?.name},
          and welcome again to Closer ✨
        </Text>

        <Text style={{...styles.subTitle, marginTop: scale(33)}}>
          Let us take you on a quick tour of features in Moments. Feel free to
          try these features as we go along :)
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scale(33),
          }}>
          <Image source={require('../../assets/images/clockIcon.png')} />
          <Text style={{...styles.subTitle, marginStart: 4}}>
            Will take less than 2 min
          </Text>
        </View>

        <Pressable onPress={onPress} style={{...styles.viewButtonTooltip}}>
          <Text style={styles.textButtonTooltip}>Explore Moments</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    lineHeight: 24,
    color: colors.blue2,

    textAlign: 'center',

    lineHeight: 24,
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: colors.blue2,
    textAlign: 'center',
    lineHeight: 24,
  },
  viewButtonTooltip: {
    backgroundColor: colors.blue1,
    borderRadius: 50,
    width: scale(293),
    //  width: scale(293),
    height: scale(47),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonTooltip: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16.62),
    color: colors.white,
  },
});
