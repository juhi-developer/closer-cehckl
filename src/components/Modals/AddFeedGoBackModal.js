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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';

export default function AddFeedGoBackModal(props) {
  const {setModalVisible, modalVisible, onPress} = props;

  const onDismiss = () => {
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
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View
        testID="poke-modal-visible"
        style={{
          backgroundColor: '#F9F1E6',
          padding: scaleNew(20),
          borderTopEndRadius: scaleNew(20),
          borderTopStartRadius: scaleNew(20),
          paddingBottom: scaleNew(60),
        }}>
        <Text
          style={{
            fontFamily: fonts.standardFont,
            fontSize: scaleNew(16),
            color: '#595959',

            textAlign: 'center',
            marginBottom: scaleNew(15),

            marginTop: scaleNew(14),
          }}>
          If you go back now, your edits will{`\n`}be discarded
        </Text>

        <Pressable
          onPress={() => {
            onPress();
          }}
          style={{...styles.viewButton, backgroundColor: '#E6515D'}}>
          <Text style={styles.textButton}>Discard</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setModalVisible(false);
          }}
          style={{
            ...styles.viewButton,
            borderWidth: 1,
            borderColor: '#124698',
          }}>
          <Text style={{...styles.textButton, color: '#124698'}}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    marginTop: scaleNew(15),

    borderRadius: scaleNew(10),
    height: scaleNew(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scaleNew(6),
  },
  textButton: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(16),
    color: colors.white,
    inncludeFontPadding: false,
    marginTop: Platform.OS === 'android' ? scaleNew(4) : 0,
  },
});
