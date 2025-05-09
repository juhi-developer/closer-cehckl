/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {CommonActions} from '@react-navigation/native';
import {VARIABLES} from '../../utils/variables';
import {removeData} from '../../utils/storage';
import {useSocket} from '../../utils/socketContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRealm} from '@realm/react';

export default function DeleteAccountModal(props) {
  const {setModalVisible, modalVisible, navigation, onAction} = props;

  const {disconnectSocket} = useSocket();
  const realm = useRealm();
  const [loading, setLoading] = useState(false);

  const onDismiss = async () => {
    setModalVisible(false);
  };

  const deleteChatDb = async () => {
    realm.write(() => {
      // Select all objects of the 'Message' type
      let allMessages = realm.objects('Message');
      // Delete them all
      realm.delete(allMessages);
    });
    AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'false');
    AsyncStorage.setItem('CURRENT_USER_ID', VARIABLES.user?._id);
  };

  const onConfirm = async () => {
    setLoading(true);
    try {
      const resp = await API('user/auth/delete', 'DELETE');

      console.log('resp delete account', JSON.stringify(resp));
      if (resp.body.statusCode === 200) {
        disconnectSocket();
        setModalVisible(false);
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'Auth',
                },
              ],
            }),
          );
        }, 100);
        VARIABLES.user = {};
        VARIABLES.token = null;
        AsyncStorage.setItem('CURRENT_USER_ID', '12345');
        await removeData('TOKEN');
        await removeData('USER');
        //  deleteChatDb();
      } else {
        setLoading(false);
        alert('Error deleting account');
      }
    } catch (error) {
      setLoading(false);
      alert('Error deleting account');
      console.log('error delete account', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={modalVisible}
      onCloseRequest={() => {
        onDismiss();
      }}
      style={{
        margin: 0,
        flex: 1,
        justifyContent: 'flex-end',

        width: '100%',
      }}>
      <OverlayLoader visible={loading} />
      <View
        style={{
          backgroundColor: '#F9F1E6',
          padding: scaleNew(24),
          borderTopEndRadius: scaleNew(20),
          borderTopStartRadius: scaleNew(20),
          paddingBottom: scaleNew(60),
        }}>
        <Pressable
          onPress={() => {
            onDismiss();
          }}
          style={{
            width: scaleNew(27),
            height: scaleNew(27),
            alignSelf: 'flex-end',
          }}>
          <Image source={require('../../assets/images/closeWhiteBg.png')} />
        </Pressable>

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(26),
            color: '#444444',
            marginTop: scaleNew(12),
            lineHeight: scaleNew(33),
          }}>
          Are you sure, you want to delete your profile?
        </Text>

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(8),
          }}>
          You will not be able to undo this
        </Text>

        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(4),
          }}>
          {
            'You will not be able to come back to your paired experience with your partner on Closer. You will also lose access to all chats and photos in Memories and saved stories, since they’re not stored in your gallery or phone storage.'
          }
        </Text>

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(16),
          }}>
          What this means for your profile
        </Text>

        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(4),
          }}>
          {
            'Your basic contact details will also be deleted. You can try signing up and pairing again, if and whenever you’d want to experience Closer again with a new partner.'
          }
        </Text>

        <Pressable
          onPress={() => {
            onConfirm();
          }}
          style={styles.viewButton}>
          <Text style={styles.textButton}>Yes, unpair & log out</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setModalVisible(false);
          }}
          style={{
            ...styles.viewButton,
            borderWidth: 1,
            borderColor: colors.blue1,
            backgroundColor: 'transparent',
            marginTop: scaleNew(4),
          }}>
          <Text style={{...styles.textButton, color: colors.blue1}}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    marginTop: scaleNew(40),
    backgroundColor: '#E6515D',
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
