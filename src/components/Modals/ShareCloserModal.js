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
  Share,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';

const CleverTap = require('clevertap-react-native');

export default function ShareCloserModal(props) {
  const {setModalVisible, modalVisible} = props;

  const onDismiss = async () => {
    await updateContextualTooltipState('shareCloser', true);
    setModalVisible(false);
  };

  const onShare = async () => {
    await updateContextualTooltipState('shareCloser', true);

    CleverTap.recordEvent('Sharing link generated');
    if (Platform.OS === 'android') {
      Share.share({
        message:
          'Closer, a modern love experience ✨. Just found a new place for love! Closer lets me create my own new experience with my partner, give it a try! ❤️     https://onelink.to/x8mhax',
        url: 'https://onelink.to/x8mhax',
      });
    } else {
      Share.share({
        message:
          'Closer, a modern love experience ✨. Just found a new place for love! Closer lets me create my own new experience with my partner, give it a try! ❤️',
        url: 'https://onelink.to/x8mhax',
      });
    }
    setModalVisible(false);
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      onCloseRequest={() => {
        onDismiss();
      }}
      style={styles.viewModal}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            onDismiss();
          }}
          style={styles.viewCross}>
          <Image source={require('../../assets/images/closeWhiteBg.png')} />
        </Pressable>
        <Image
          style={styles.imageStyle}
          source={require('../../assets/images/shareCloserIcon.png')}
        />

        <Text style={styles.title}>
          share Closer with{'\n'}your friends? 💛
        </Text>

        <Text style={styles.subtitle}>
          We’d be very grateful if you can share{`\n`}Closer with your friends
          in love :)
        </Text>

        <Pressable
          onPress={() => {
            onShare();
          }}
          style={styles.viewButton}>
          <Text style={styles.textButton}>Share Closer</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewModal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    backgroundColor: '#F9F1E6',
    padding: scaleNew(26),
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),
    paddingBottom: scaleNew(60),
  },
  viewCross: {
    width: scaleNew(27),
    height: scaleNew(27),
    alignSelf: 'flex-end',
  },
  imageStyle: {
    width: scaleNew(83),
    height: scaleNew(83),
    alignSelf: 'center',
    marginTop: scaleNew(14),
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(26),
    color: '#595959',

    textAlign: 'center',
    marginTop: scaleNew(24),
    lineHeight: scaleNew(30),
  },
  subtitle: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: '#595959',
    textAlign: 'center',

    marginTop: scaleNew(12),
  },
  viewButton: {
    marginTop: scaleNew(50),
    backgroundColor: '#124698',
    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scaleNew(10),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.white,

    includeFontPadding: false,
  },
});
