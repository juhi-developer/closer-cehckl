/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View, Pressable, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import {Modal} from 'react-native-js-only-modal';
import {removeData} from '../../utils/storage';
import {CommonActions} from '@react-navigation/native';
import {useSocket} from '../../utils/socketContext';

import {VARIABLES} from '../../utils/variables';
import API from '../../redux/saga/request';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRealm} from '@realm/react';
import OverlayLoader from '../overlayLoader';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';

export default function UnpairAccountPartnerSideModal(props) {
  const {setModalVisible, modalVisible, navigation} = props;

  const realm = useRealm();
  const {disconnectSocket} = useSocket();
  const [loading, setLoading] = useState(false);

  const onDismiss = async () => {
    await updateContextualTooltipState('unpairPartnerModalShown', true);
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
    try {
      setLoading(true);
      const resp = await API('user/auth/logout', 'POST');
      console.log('resp unpair', JSON.stringify(resp));
      if (resp.body.statusCode === 200) {
        disconnectSocket();
        setModalVisible(false);
        await updateContextualTooltipState('unpairPartnerModalShown', true);
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
        //   deleteChatDb();
        // onAction();
      } else {
        setLoading(false);
        alert('Error unpairing account');
      }
    } catch (error) {
      setLoading(false);
      console.log('error unpair partner', error);
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
          Sorry, Your partner has unpaired
        </Text>

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(8),
          }}>
          How this affects your Closer experience
        </Text>

        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(4),
          }}>
          {`We’re sorry to share that ${VARIABLES.user?.partnerData?.partner?.name} has unpaired with you and has left Closer.  While you can view the app, you will not be able to perform any activity, and there will be no new quiz cards or any other activity on the app.`}
        </Text>

        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(16),
          }}>
          Our recommendation on next steps
        </Text>

        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(16),
            color: '#595959',
            marginTop: scaleNew(4),
          }}>
          {
            'While you can remain on the app as long as you’d like, you can also choose to logout. Your basic contact details are still saved, so can still log in to the app and try pairing again, if and whenever you’d want to experience Closer again with a new partner.'
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
            onDismiss();
          }}
          style={{
            ...styles.viewButton,
            borderWidth: 1,
            borderColor: colors.blue1,
            backgroundColor: 'transparent',
            marginTop: scaleNew(4),
          }}>
          <Text style={{...styles.textButton, color: colors.blue1}}>
            I will do it later
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
