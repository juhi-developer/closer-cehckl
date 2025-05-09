/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function AutoBackupError(props) {
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
          padding: scale(20),
          paddingVertical: scale(24),
          borderRadius: scale(20),
          margin: scale(33),
        }}>
        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scale(16),
            color: '#444444',
            textAlign: 'center',
          }}>
          Are you sure you don’t want to set auto backup for your data?
        </Text>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scale(14),
            color: '#808491',
            marginTop: scale(20),
          }}>
          • You might lose all data if you switch{`\n`}
          {'   '}device or uninstall Closer
        </Text>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scale(14),
            color: '#808491',
            //   marginTop: scale(20),
          }}>
          • You can still set it up from your Profile{`\n`}
          {'   '}later on
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: scale(20),
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
              Close
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onSubmit();
              setModalVisible(false);
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
    marginEnd: scale(36),
    marginBottom: scale(-20),
    width: scale(35),
    height: scale(35),
  },
});
