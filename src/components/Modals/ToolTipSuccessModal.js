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

export default function ToolTipSuccessModal(props) {
  const {setModalVisible, modalVisible, onPress} = props;

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
        //  setModalVisible(false);
      }}
      onBackdropPress={() => {
        //  setModalVisible(false);
      }}
      style={{margin: 0, alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: colors.white,
          margin: 20,
          alignItems: 'center',
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          width: scale(362),
          //   height: scale(225),
        }}>
        <Image
          style={{marginTop: -scale(30)}}
          source={require('../../assets/images/closerIconBlueBgRound.png')}
        />

        <Text style={{...styles.title, marginTop: scale(18)}}>
          All done!! 🥳
        </Text>

        <Text
          style={{
            ...styles.subTitle,
            marginBottom: scale(14),
            marginTop: scale(14),
          }}>
          You’re all set to make Closer{`\n`}your own now 🙂
        </Text>

        <Pressable onPress={onPress} style={{...styles.viewButtonTooltip}}>
          <Text style={styles.textButtonTooltip}>Let’s go!</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    lineHeight: 20,
    color: colors.blue2,

    textAlign: 'center',

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
    width: scale(212),
    //  width: scale(293),
    height: scale(47),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blue1,
  },
  textButtonTooltip: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16.62),
    color: colors.white,
  },
});
