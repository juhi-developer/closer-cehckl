import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import SwipeButton from '../SwipeButton';
import LinearGradient from 'react-native-linear-gradient';
import {HapticFeedbackHeavy} from '../../utils/HapticFeedback';
import LottieView from 'lottie-react-native';
import {VARIABLES} from '../../utils/variables';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {EventRegister} from 'react-native-event-listeners';
import {AWS_URL_S3} from '../../utils/urls';
import FastImage from 'react-native-fast-image';
import {useAppContext} from '../../utils/VariablesContext';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function RestoreModal(props) {
  const {setModalVisible, modalVisible, onSubmit} = props;

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
        //   setModalVisible(false);
      }}
      onBackdropPress={() => {
        ///  setModalVisible(false);
      }}
      style={{
        margin: 0,

        justifyContent: 'center',
        flex: 1,
      }}>
      <Pressable
        style={styles.viewCross}
        onPress={() => {
          setModalVisible(false);
        }}>
        <Image source={require('../../assets/images/crossBlueBg.png')} />
      </Pressable>
      <View
        style={{
          backgroundColor: colors.white,
          padding: 20,
          paddingVertical: 24,
          borderRadius: scale(20),
          margin: 20,
        }}>
        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scale(16),
            color: colors.text,
            textAlign: 'center',
          }}>
          Are you sure you don’t want to{`\n`}restore your backed up data?
        </Text>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scale(16),
            color: '#808491',
            marginTop: scale(24),
            textAlign: 'center',
          }}>
          You will not be able to restore your data later
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(24),
          }}>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={{
              flex: 1,
              height: scale(40),
              borderWidth: 1,
              borderColor: colors.blue1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: scale(10),
              marginEnd: scale(7),
            }}>
            <Text
              style={{
                fontFamily: fonts.standardFont,
                fontSize: scale(14),
                color: colors.blue1,
              }}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            testID="yesSure"
            onPress={() => {
              setModalVisible(false);
              onSubmit();
            }}
            style={{
              flex: 1,
              height: scale(40),
              borderWidth: 1,
              borderColor: '#E6515D',
              backgroundColor: '#E6515D',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: scale(10),
              marginStart: scale(7),
            }}>
            <Text
              style={{
                fontFamily: fonts.standardFont,
                fontSize: scale(14),
                color: colors.white,
              }}>
              Yes I'm sure
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewCross: {
    alignSelf: 'flex-end',
    marginEnd: scale(24),
    marginBottom: scale(-10),
    width: scale(35),
    height: scale(35),
  },
});
