import React, {Component, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';

import Modal from 'react-native-modal';
import CameraIconSvg from '../../assets/svgs/CameraIconSvg';
import GalleryIconSvg from '../../assets/svgs/GalleryIconSvg';
import {fonts} from '../../styles/fonts';
import {colors} from '../../styles/colors';
import {VARIABLES} from '../../utils/variables';

const ShareSheetModal = props => {
  const {
    setModalVisible,
    modalVisible,
    chatHandler,
    feedHandler,
    header = 'Share Media',
    onDismissCard,
  } = props;

  // useEffect(() => {
  //   VARIABLES.isMediaOpen = true;
  // }, []);

  const onDismiss = () => {
    // VARIABLES.isMediaOpen = false;
    onDismissCard();
    setModalVisible(false);
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={10}
      animationOutTiming={10}
      isVisible={modalVisible}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <View style={styles.parent}>
        <View style={styles.child}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginVertical: 16,
              // marginBottom:25
            }}>
            <Text style={styles.textStyle}>{header}</Text>
            <Pressable onPress={() => onDismiss()} hitSlop={10}>
              <Image
                style={{width: 14, height: 14}}
                source={require('../../assets/images/cross.png')}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginHorizontal: 10,
              marginBottom: 40,
            }}>
            <TouchableOpacity
              style={{
                width: '45%',
                height: '100%',
                backgroundColor: '#F4F4F5',
                padding: 25,
                borderRadius: 10,
              }}
              onPress={() => {
                // chatHandler()
                setModalVisible(false);
                setTimeout(() => {
                  chatHandler();
                }, 1000);
              }}>
              <View style={{alignItems: 'center'}}>
                <CameraIconSvg style={{width: 50, height: 50}} />
                <Text style={styles.text}>Chat</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              testID="openImagePickerButton"
              style={{
                width: '45%',
                height: '100%',
                backgroundColor: '#F4F4F5',
                padding: 25,
                borderRadius: 10,
              }}
              onPress={() => {
                setModalVisible(false);
                setTimeout(() => {
                  feedHandler();
                }, 1000);
              }}>
              <View style={{alignItems: 'center'}}>
                <GalleryIconSvg style={{width: 50, height: 50}} />
                <Text style={styles.text}>Feed</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  parent: {
    // height: '27%',
    width: '100%',
    // transform: [{scaleX: 2.0}],
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  child: {
    width: '100%',
    // transform: [{scaleX: 0.5}],
    backgroundColor: '#fff',
    //  alignItems : 'flex-end',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  textTitle: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontFamily: fonts.standardFont,
  },
  text: {
    fontSize: 14,
    marginTop: 8,
    color: '#000',
    textAlign: 'center',
    fontFamily: fonts.regularFont,
  },
  row: {flexDirection: 'row'},

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {fontFamily: fonts.regularFont, fontSize: 16, color: colors.text},
});

export default ShareSheetModal;
