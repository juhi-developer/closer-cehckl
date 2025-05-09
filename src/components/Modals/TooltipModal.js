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

export default function TooltipModal(props) {
  const {setModalVisible, modalVisible, stepCount, title, onPress} = props;

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
        ///   setModalVisible(false);
      }}
      style={{margin: 0, alignItems: 'center'}}>
      <View
        style={{
          backgroundColor: colors.white,
          margin: 20,
          alignItems: 'center',
          borderRadius: 20,
          paddingHorizontal: scale(20),
          paddingBottom: 20,
          width: scale(362),
        }}>
        <Image
          style={{marginTop: -scale(30)}}
          source={require('../../assets/images/closerIconBlueBgRound.png')}
        />

        <Text style={{...styles.title, marginTop: scale(18)}}>
          Yayy!! 🥳 {`\n`}
          {title}
        </Text>

        <Text style={{...styles.subTitle, marginVertical: scale(18)}}>
          Keep exploring Moments,{`\n`} {stepCount} more steps to go!
        </Text>

        <Pressable onPress={onPress} style={{...styles.viewButtonTooltip}}>
          <Text style={styles.textButtonTooltip}>Next</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    lineHeight: 26,
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
    backgroundColor: colors.white,
    borderRadius: 50,
    width: scale(212),
    //  width: scale(293),
    height: scale(47),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2),
    borderColor: colors.blue1,
  },
  textButtonTooltip: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16.62),
    color: colors.blue1,
  },
});
