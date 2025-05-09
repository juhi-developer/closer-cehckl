import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function WelcomeChatModal(props) {
  const {setModalVisible, modalVisible} = props;

  const onSubmit = () => {
    AsyncStorage.setItem('welcomeChatModal', 'true');
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
        //   setModalVisible(false);
      }}
      onBackdropPress={() => {
        ///  setModalVisible(false);
      }}
      style={{
        margin: 0,
        alignItems: 'center',
        flex: 1,
      }}>
      <View>
        <Pressable
          style={styles.viewCross}
          onPress={() => {
            onSubmit();
          }}>
          <Image source={require('../../assets/images/crossBlueBg.png')} />
        </Pressable>
        <View
          style={{
            backgroundColor: colors.white,
            width: scale(362),
            //   height: scale(461),
            borderRadius: scale(20),
            alignItems: 'center',
            paddingHorizontal: scale(20),
            paddingVertical: scale(26),
          }}>
          <Text
            style={{
              fontFamily: fonts.semiBoldFont,
              fontSize: scale(16),
              color: colors.black,
            }}>
            Welcome to Closer chat
          </Text>

          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.blue2,
              textAlign: 'center',
              lineHeight: scale(27),
              marginTop: scale(32),
            }}>
            Reply to chat, Add GIFs,{`\n`}stickers & reactions,{`\n`} Swipe
            right on a text to reply,{`\n`} long press to react with stickers &
            emoji
          </Text>

          <Text
            style={{
              fontFamily: fonts.regularFont,
              fontSize: scale(16),
              color: colors.blue2,
              textAlign: 'center',
              lineHeight: scale(27),
              marginTop: scale(50),
            }}>
            And don’t worry, we have end to end{`\n`}encryption and your chats
            are safe{`\n`}and secure!
          </Text>

          <Pressable
            onPress={() => {
              onSubmit();
            }}
            style={styles.viewButton}>
            <Text style={styles.textButton}>Let's get started</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    backgroundColor: colors.blue1,
    height: scale(50),
    width: scale(293),
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
    //  position: 'absolute',
    // bottom: scale(4),
  },
  textButton: {
    color: colors.white,
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
  },
  viewCross: {
    alignSelf: 'flex-end',
    marginEnd: scale(4),
    marginBottom: scale(4),
    width: scale(35),
    height: scale(35),
  },
});
