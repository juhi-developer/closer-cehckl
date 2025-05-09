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

export default function AutoBackupModal(props) {
  const {setModalVisible, modalVisible, backupFrequency, setBackupFrequency} =
    props;
  const [selectedFrequency, setSelectedFrequency] = useState(backupFrequency);

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
          paddingHorizontal: scale(16),
          paddingVertical: scale(24),
          borderRadius: scale(20),
          margin: 20,
        }}>
        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scale(16),
            color: '#444444',
            textAlign: 'center',
          }}>
          Auto Backup
        </Text>

        <Pressable
          onPress={() => setSelectedFrequency('daily')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(20),
          }}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.black,
            }}>
            Daily
            {/* | <Text style={{color: colors.text}}>3AM</Text> */}
          </Text>
          {selectedFrequency === 'daily' ? (
            <Image
              style={{resizeMode: 'contain'}}
              source={require('../../assets/images/activeRadiobutton.png')}
            />
          ) : (
            <Image
              style={styles.radioInactive}
              source={require('../../assets/images/inactiveRadioButton.png')}
            />
          )}
        </Pressable>
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.grey1,
            marginTop: scale(6),
          }}
        />
        <Pressable
          onPress={() => setSelectedFrequency('weekly')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(10),
          }}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.black,
            }}>
            Weekly
            {/* | <Text style={{color: colors.text}}>Monday 3AM</Text> */}
          </Text>
          {selectedFrequency === 'weekly' ? (
            <Image
              style={{resizeMode: 'contain'}}
              source={require('../../assets/images/activeRadiobutton.png')}
            />
          ) : (
            <Image
              style={styles.radioInactive}
              source={require('../../assets/images/inactiveRadioButton.png')}
            />
          )}
        </Pressable>
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.grey1,
            marginTop: scale(6),
          }}
        />

        <Pressable
          onPress={() => setSelectedFrequency('monthly')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(10),
          }}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: '#000000',
            }}>
            Monthly
            {/* | <Text style={{color: colors.text}}>1st day 3AM</Text> */}
          </Text>
          {selectedFrequency === 'monthly' ? (
            <Image
              style={{resizeMode: 'contain'}}
              source={require('../../assets/images/activeRadiobutton.png')}
            />
          ) : (
            <Image
              style={styles.radioInactive}
              source={require('../../assets/images/inactiveRadioButton.png')}
            />
          )}
        </Pressable>
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.grey1,
            marginTop: scale(6),
          }}
        />

        <Pressable
          onPress={() => setSelectedFrequency('never')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(10),
          }}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.black,
            }}>
            Never
          </Text>
          {selectedFrequency === 'never' ? (
            <Image
              style={{resizeMode: 'contain'}}
              source={require('../../assets/images/activeRadiobutton.png')}
            />
          ) : (
            <Image
              style={styles.radioInactive}
              source={require('../../assets/images/inactiveRadioButton.png')}
            />
          )}
        </Pressable>
        <Pressable
          onPress={() => {
            setModalVisible(false);
            setBackupFrequency(selectedFrequency);
          }}
          style={{
            // flex: 1,
            height: scale(50),
            borderWidth: 1,
            borderColor: colors.blue1,
            backgroundColor: colors.blue1,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scale(10),
            marginTop: scale(30),
            alignSelf: 'center',
            width: scale(191),
          }}>
          <Text
            style={{
              fontFamily: fonts.standardFont,
              fontSize: scale(18),
              color: colors.white,
              includeFontPadding: false,
            }}>
            Save
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewCross: {
    alignSelf: 'flex-end',
    marginEnd: scale(30),
    marginBottom: scale(-10),
    width: scale(35),
    height: scale(35),
  },
  radioInactive: {
    resizeMode: 'contain',
    marginBottom: 1,
    width: scale(20),
    height: scale(20),
  },
});
