/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import React from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

export default function ForceUpdateModal(props) {
  const {setModalVisible, modalVisible} = props;

  const handleUpdate = () => {
    // URLs for your app on the app stores
    const androidURL =
      'https://play.google.com/store/apps/details?id=com.closer.application';
    const iosURL =
      'https://apps.apple.com/us/app/closer-relationship-couples/id6467502209';

    const url = Platform.OS === 'ios' ? iosURL : androidURL;

    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      style={styles.modal}
      onCloseRequest={() => {}}>
      <View
        style={{
          ...styles.container,
          minHeight: '45%',
        }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          enabled
          contentContainerStyle={styles.scrollViewContent}>
          <View>
            <Image
              source={require('../../assets/images/closer_logo.png')}
              style={{
                width: scaleNew(80),
                height: scaleNew(80),
                alignSelf: 'center',
              }}
            />
            <Text style={styles.title}>Closer is better{`\n`}than ever 🧡</Text>
            <Text style={styles.description}>
              We’ve made some bug fixes &{`\n`}improvements, please update the
              app
            </Text>

            <Pressable
              onPress={() => {
                handleUpdate();
              }}
              style={styles.viewButton}>
              <Text style={styles.textButton}>Update app now</Text>
            </Pressable>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
  },
  container: {
    //  flex: 1,

    backgroundColor: '#F9F1E6',
    borderTopEndRadius: scaleNew(20),
    borderTopStartRadius: scaleNew(20),
    paddingTop: scaleNew(25),
    paddingBottom: scaleNew(8),
    paddingHorizontal: scaleNew(26),
  },

  scrollViewContent: {
    paddingBottom: scaleNew(60),
  },
  title: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(26),
    color: '#595959',
    textAlign: 'center',
    lineHeight: scaleNew(29),
    marginTop: scaleNew(19),
  },
  description: {
    fontFamily: fonts.regularFont,
    color: '#595959',
    fontSize: scaleNew(16),
    marginTop: scaleNew(14),
    lineHeight: scaleNew(24),
    textAlign: 'center',
  },
  viewButton: {
    marginTop: scaleNew(30),
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
