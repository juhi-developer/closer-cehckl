import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import {globalStyles, SCREEN_WIDTH} from '../../../styles/globalStyles';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {APP_STRING} from '../../../utils/constants';
import {colors} from '../../../styles/colors';

import SadSvg from '../../../assets/svgs/sadSvg';
import BorderButton from '../../../components/borderButton';
import AppButton from '../../../components/appButton';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {ClearAction, Backup, Deactivate} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import {removeData, setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import ReactNativeBiometrics from 'react-native-biometrics';
import {useSocket} from '../../../utils/socketContext';

// Equal Button's Width when in horizontal
const APP_MARGIN = 16; // marginHorizontal for screen container
const END_MARGIN = 6; // when applied for marginStart and marginEnd
const BUTTON_WIDTH = SCREEN_WIDTH / 2 - APP_MARGIN - END_MARGIN;

export default function BackupScreen(props) {



  const {disconnectSocket} = useSocket();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const rnBiometrics = new ReactNativeBiometrics();

  const AppHeader = () => {
    return (
      <CenteredHeader
        leftIcon={<ArrowLeftIconSvg />}
        leftPress={() => props.navigation.goBack()}
        title={'Deactivation'}
        rightIcon={<DarkCrossIconSvg />}
        rightPress={() => props.navigation.goBack()}
        titleStyle={globalStyles.titleLabel}
      />
    );
  };

  const TakeBackupHandler = () => {
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(Backup());
  };

  const confirmDeactivation = () => {
    Alert.alert('Deactive Account', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => DeactivateHandler()},
    ]);
  };

  const DeactivateHandler = () => {
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(Deactivate());
  };

  const deleteSignature = () => {
    rnBiometrics.deleteKeys().then(resultObject => {
      const {keysDeleted} = resultObject;

      if (keysDeleted) {
        console.log('Successful deletion');
      } else {
        console.log(
          'Unsuccessful deletion because there were no keys to delete',
        );
      }
    });
  };

  const stateHandler = async () => {
    console.log('deactivated', state);
    if (state.reducer.case === actions.BACKUP_SUCCESS) {
      setLoading(false);
      // alert('Data backed up Successfully');
      VARIABLES.user = state.reducer.userData;
      // props.navigation.navigate('addProfilePic')
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.BACKUP_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      // alert(state.message)
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DEACTIVATE_SUCCESS) {
      disconnectSocket();
      setLoading(false);
      alert('Your account has been deactivated.');
      props.navigation.replace('Auth');
      VARIABLES.user = null;
      VARIABLES.token = null;
      await removeData('TOKEN'),
        await removeData('USER'),
        await removeData('PUBLIC_KEY');
      deleteSignature();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DEACTIVATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      // alert(state.message)
      dispatch(ClearAction());
    }
  };
  useEffect(() => {
    stateHandler();
  }, [state]);

  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        isLoading={loading}
        header={AppHeader}>
        <View style={{marginHorizontal: 16}}>
          <View style={styles.backupContainer}>
            <SadSvg />
            <Text style={styles.sadLabel}>{APP_STRING.sadLabel}</Text>
            <Text style={styles.reconnectLabel}>
              {APP_STRING.reconnectAccountLabel}
            </Text>
          </View>
          <View style={{marginTop: 28, alignItems: 'center'}}>
            <Text style={{...globalStyles.regularMediumText}}>
              {APP_STRING.backupEmail}
            </Text>
            <Pressable style={styles.mailContainer}>
              <Text style={styles.email}>{VARIABLES.user?.email}</Text>
            </Pressable>
          </View>
        </View>
      </AppView>
      <View style={styles.buttonContainer}>
        {!state?.reducer.userData?.isBackup && (
          <BorderButton
            text="Take Backup"
            style={{width: BUTTON_WIDTH, marginEnd: 6}}
            onPress={TakeBackupHandler}
          />
        )}
        <AppButton
          text="Deactivate"
          style={{
            width: state?.reducer.userData?.isBackup ? '100%' : BUTTON_WIDTH,
            marginStart: state?.reducer.userData?.isBackup ? 0 : 6,
          }}
          onPress={confirmDeactivation}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backupContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.red1,
    alignItems: 'center',
    marginTop: 10,
  },
  sadLabel: {
    ...globalStyles.semiBoldMediumText,
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 24,
  },
  reconnectLabel: {
    ...globalStyles.regularMediumText,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 16,
  },
  mailContainer: {
    borderBottomWidth: 1,
    borderColor: colors.blue1,
    marginTop: 4,
  },
  email: {
    ...globalStyles.semiBoldMediumText,
    color: colors.blue1,
  },
});
