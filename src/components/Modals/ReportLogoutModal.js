import {StyleSheet, Text, View, Pressable, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../styles/colors';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import {VARIABLES} from '../../utils/variables';
import {removeData} from '../../utils/storage';
import API from '../../redux/saga/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRealm} from '@realm/react';
import OverlayLoader from '../overlayLoader';
import {CommonActions} from '@react-navigation/native';
import {useSocket} from '../../utils/socketContext';
import {Modal} from 'react-native-js-only-modal';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function ReportLogoutModal(props) {
  const {setModalVisible, modalVisible, navigation, type} = props;

  const realm = useRealm();
  const {disconnectSocket} = useSocket();
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      const resp = await API('user/auth/logout', 'POST');
      console.log('resp unpair', JSON.stringify(resp));
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
        await removeData('TOKEN');
        await removeData('USER');
        AsyncStorage.setItem('CURRENT_USER_ID', '12345');
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
      visible={modalVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}>
      <View style={styles.modalContent}>
        <OverlayLoader visible={loading} />
        <Text style={styles.titleText}>
          {type === 'user'
            ? 'You will be logged out now as your reported content was found to be abusive'
            : 'You will be logged out due to abuse reported by your partner'}
        </Text>
        <Text style={styles.descriptionText}>
          {type === 'user'
            ? 'Basis the abuse report you had submitted, we found that your partner’s behaviour violates our guidelines, and so your pairing has been removed. You can start using Closer again with a new pairing.'
            : 'Your behaviour or content on Closer was reported by your partner and violated our guidelines. You’ll now be logged out of Closer and will be unable to access any data. You can use Closer again with a new pairing.'}
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => {
              onConfirm();
            }}
            style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Log out</Text>
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
    borderColor: '#E6515D',
    backgroundColor: '#E6515D',
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
