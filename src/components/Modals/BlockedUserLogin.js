import {StyleSheet, Text, View, Pressable, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function BlockedUserLogin(props) {
  const {setModalVisible, modalVisible} = props;

  return (
    <Modal
      backdropTransitionOutTiming={20}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={10}
      animationInTiming={10}
      onBackButtonPress={() => {}}
      onBackdropPress={() => {}}
      style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.titleText}>You have been blocked</Text>
        <Text style={styles.descriptionText}>
          Your have been reported twice by your partners for{' '}
          <Text style={{color: '#E6515D'}}>
            abusive behaviour or objectionable content,
          </Text>
          and so your account has been blocked. Please contact{' '}
          <Text style={{fontFamily: fonts.boldFont}}>
            hello@getcloserapp.co
          </Text>{' '}
          for next steps.
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              setModalVisible(false);
            }}
            style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Okay</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    flex: 1,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: scale(17),
    paddingVertical: scale(24),
    borderRadius: scale(20),
    margin: scale(33),
  },
  titleText: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    color: '#444444',
    textAlign: 'center',
    paddingHorizontal: scale(30),
  },
  descriptionText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: '#595959',
    marginTop: scale(18),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(20),
    width: scale(150),
  },
  logoutButton: {
    flex: 1,
    height: scale(40),
    borderWidth: 1,
    borderColor: colors.blue1,
    backgroundColor: colors.blue1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
  },
  logoutButtonText: {
    fontFamily: fonts.standardFont,
    fontSize: scale(14),
    color: colors.white,
  },
  viewCross: {
    alignSelf: 'flex-end',
    marginEnd: scale(36),
    marginBottom: scale(-20),
    width: scale(35),
    height: scale(35),
  },
});
