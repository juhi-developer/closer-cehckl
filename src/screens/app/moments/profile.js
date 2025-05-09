/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  TextInput,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Linking,
  Share,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AppView from '../../../components/AppView';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import CenteredHeader from '../../../components/centeredHeader';
import {
  BOTTOM_SPACE,
  BUTTON_WIDTH,
  SCREEN_WIDTH,
  globalStyles,
} from '../../../styles/globalStyles';
import CallIconSvg from '../../../assets/svgs/callIconSvg';
import {colors} from '../../../styles/colors';
import CopyIconSvg from '../../../assets/svgs/copyIconSvg';
import SmallEditIconSvg from '../../../assets/svgs/smallEditIconSvg';
import {APP_IMAGE} from '../../../utils/constants';
import BorderButton from '../../../components/borderButton';

import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-crop-picker';
import {scale} from '../../../utils/metrics';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  ClearAction,
  Logout,
  EditProfile,
  Backup,
  GetUserProfile,
} from '../../../redux/actions';
import {VARIABLES, regEmail} from '../../../utils/variables';
import {removeData, setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import {fonts} from '../../../styles/fonts';
import DropDownIconSvg from '../../../assets/svgs/dropDownIconSvg';

import CountryPicker from 'react-native-country-picker-modal';
import {uploadToS3BUCKET} from '../../../utils/helpers';
import ImagePickerModal from '../../../components/Modals/imagePickerModal';
import AppButton from '../../../components/appButton';
import PlusWhiteBackIcon3Svg from '../../../assets/svgs/plusWhiteBackIcon3Svg';
import {API_BASE_URL, AWS_URL_S3} from '../../../utils/urls';
import BlueTickIconSvg from '../../../assets/svgs/blueTickIconSvg';

import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {ToastMessage} from '../../../components/toastMessage';
import moment from 'moment';
import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
import OverlayLoader from '../../../components/overlayLoader';
import {delay} from 'redux-saga/effects';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import TermsAndconditions from '../../../components/TermsAndconditions';
import NotificationInactiveIconSvg from '../../../assets/svgs/notificationInactiveIconSvg';
import ManageNotificationsModal from '../../../components/Modals/ManageNotificationsModal';
import API from '../../../redux/saga/request';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../../../utils/socketContext';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {Image as CompressedImage} from 'react-native-compressor';
import axios from 'axios';
import {fetchDirectoryContents, formatBytes} from '../../../backup/utils';
import SwitchCustom from '../../../components/SwitchCustom';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {scaleNew} from '../../../utils/metrics2';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../../utils/contextualTooltips';
import LogoutModal from '../../../components/Modals/LogoutModal';
import DeleteAccountModal from '../../../components/Modals/DeleteAccountModal';
import UnpairAccountModal from '../../../components/Modals/UnpairAccountModal';
import ShareCloserModal from '../../../components/Modals/ShareCloserModal';
import ImproveCloserModal from '../../../components/Modals/ImproveCloserModal';
import FeedbackThankyouModal from '../../../components/Modals/FeedbackThankyouModal';
import {useAppContext} from '../../../utils/VariablesContext';
import ReportAbuseModal from '../../../components/Modals/ReportAbuseModal';
import AbuseSuccessModal from '../../../components/Modals/AbuseSuccessModal';
import {ProfileAvatar} from '../../../components/ProfileAvatar';
import {getGoogleUserInfo, googleConfig} from '../../../utils/utils';
import {authorize, refresh} from 'react-native-app-auth';

const CleverTap = require('clevertap-react-native');

export default function Profile(props) {
  const {disconnectSocket} = useSocket();

  const {setActiveTab} = useAppContext();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [termsCond, settermsCond] = useState(false);
  const [privacyPolicy, setprivacyPolicy] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [editingImage, seteditingImage] = useState({});
  const [media, setMedia] = useState('');
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [unpairModal, setUnpairModal] = useState(false);
  const [reportAbuseModal, setReportAbuseModal] = useState(false);
  const [shareCloserModalVisible, setShareCloserModalVisible] = useState(false);
  const [improveCloserModalVisible, setImproveCloserModalVisible] =
    useState(false);
  const [feedbackThankyouModalVisible, setFeedbackThankyouModalVisible] =
    useState(false);
  const [reportAbuseSuccessModalVisible, setReportAbuseSuccessModalVisible] =
    useState(false);

  const [pushNotificationsData, setPushNotificationsData] = useState('');

  const [manageNotificationsModal, setManageNotificationsModal] =
    useState(false);

  const [themeColor, setThemeColor] = useState('#EFE8E6');
  const [strokeColor, setStrokeColor] = useState('#ECDDD9');
  const [selectedPallete, setSelectedPallete] = useState(0);

  const [sheetEnabled, setSheetEnabled] = useState(false);

  const [visibleImage, setVisibleImage] = useState(false);
  const [viewImage, setViewImage] = useState('');

  const [lastBackupDate, setLastBackupDate] = useState('');
  const [lastBackupSize, setLastBackupSize] = useState('');
  const [isBackupOverdue, setIsBackupOverdue] = useState(false);
  const [biometricSwitch, setBiometricSwitch] = useState(false);
  const [eveningModeSwitch, setEveningModeSwitch] = useState(true);

  const [backupFrequency, setBackupFrequency] = useState('never');

  const [showBiometricSwitch, setShowBiometricSwitch] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      // Set the current tab when ChatTab is focused
      setActiveTab('profile');
      return () => {
        // Reset the current tab when ChatTab is blurred (not focused)
        //    setActiveTab('');
      };
    }, []),
  );

  useEffect(() => {
    rnBiometrics.biometricKeysExist().then(resultObject => {
      const {keysExist} = resultObject;

      if (keysExist) {
        setBiometricSwitch(true);
      } else {
        setBiometricSwitch(false);
      }
    });

    checkSensorLogin();
    checkEveningStatus();
  }, []);

  const checkSensorLogin = () => {
    rnBiometrics.isSensorAvailable().then(async resultObject => {
      const {available, biometryType} = resultObject;

      if (available && biometryType === BiometryTypes.TouchID) {
        setShowBiometricSwitch(true);
        console.log('TouchID is supported');
      } else if (available && biometryType === BiometryTypes.FaceID) {
        setShowBiometricSwitch(true);
        console.log('FaceID is supported');
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        setShowBiometricSwitch(true);
        console.log('Biometrics is supported');
      } else {
      }
    });
  };

  let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  let payload = epochTimeSeconds + 'some message';

  const createSignaturePrivateKey = val => {
    console.log('valll', val);
    setBiometricSwitch(val);
    if (!val) {
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
      setLoading(false);
    } else {
      rnBiometrics.createKeys().then(resultObject => {
        const {publicKey} = resultObject;
        console.log('public keyyy', publicKey);
      });
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const date = await AsyncStorage.getItem('lastBackupDate');
        const size = await AsyncStorage.getItem('lastBackupSize');
        const backFreq = await AsyncStorage.getItem('backupFrequency');

        if (date && size) {
          const formattedDate = new Date(date);
          const day = formattedDate.getDate().toString().padStart(2, '0');
          const month = (formattedDate.getMonth() + 1)
            .toString()
            .padStart(2, '0'); // Months are zero-indexed
          const year = formattedDate.getFullYear();
          const hours = formattedDate.getHours();
          const minutes = formattedDate
            .getMinutes()
            .toString()
            .padStart(2, '0');
          const ampm = hours >= 12 ? 'PM' : 'AM';
          const formattedTime = `${
            hours % 12 === 0 ? 12 : (hours % 12).toString().padStart(2, '0')
          }:${minutes} ${ampm}`;

          setLastBackupDate(`${day}.${month}.${year}, ${formattedTime}`);
          setLastBackupSize(formatBytes(parseInt(size)));

          checkBackupOverdue(formattedDate, backFreq);
        }

        // if (date && size) {
        //   const formattedDate = new Date(date);
        //   setLastBackupDate(formattedDate.toLocaleString());
        //   setLastBackupSize(formatBytes(parseInt(size)));
        //   checkBackupOverdue(formattedDate, backFreq);
        // }

        if (backFreq !== null) {
          setBackupFrequency(backFreq);
        }
      }

      fetchData();
    }, []),
  );

  const checkBackupOverdue = (lastBackupDate, frequency) => {
    const now = new Date();
    const lastBackupTime = new Date(lastBackupDate);
    let overdue = false;

    console.log('frequencyy', frequency, lastBackupDate);

    switch (frequency) {
      case 'daily':
        overdue = now - lastBackupTime > 24 * 60 * 60 * 1000;
        break;
      case 'weekly':
        overdue = now - lastBackupTime > 7 * 24 * 60 * 60 * 1000;
        break;
      case 'monthly':
        overdue = now - lastBackupTime > 30 * 24 * 60 * 60 * 1000;
        break;
      case 'never':
        overdue = false;
        break;
    }

    setIsBackupOverdue(overdue);
  };

  useEffect(() => {
    getUserProfileHandler();
  }, []);

  const getUserProfileHandler = () => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    dispatch(GetUserProfile());
  };

  const onPressManageNotifications = async params => {
    setLoading(true);
    try {
      const resp = await API('user/home/managePush', 'PUT', params);

      if (resp.body.statusCode === 200) {
        getUserProfileHandler();
      }
    } catch (error) {
      setLoading(false);
      console.log('error manage notifications', error);
    }
  };

  const [info, setInfo] = useState({
    name: '',
    lastName: '',
    email: '',
  });

  const getName = text => {
    setInfo({
      ...info,
      name: text,
    });
  };

  const onBlurName = () => {
    const temp = info.name;
    setInfo({
      ...info,
      name: temp.trim(),
    });
  };

  const getEmail = text => {
    setInfo({
      ...info,
      email: text,
    });
  };

  const onBlurEmail = () => {
    const temp = info.email;
    setInfo({
      ...info,
      email: temp.trim(),
    });
  };

  const copyToClipboard = () => {
    const message = `Hey, I just downloaded Closer - a new place for love! You can download the app here: https://bit.ly/4eHUlJ7 and use ${VARIABLES?.user?.partnerData?.code} as the pairing code.`;
    Share.share({
      message: message,
    });
    // Clipboard.setString(VARIABLES?.user?.partnerData?.code);
    // ToastMessage('Pairing code copied');
  };

  const onLogout = () => {
    if (!netInfo.isConnected) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
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

    setLoading(true), dispatch(Logout());
  };

  const AppHeader = () => {
    return (
      <CenteredHeader
        //leftIcon={<ArrowLeftIconSvg />}
        //  leftPress={() => props.navigation.goBack()}
        title={'Profile'}
        rightIcon={<View style={styles.icon} />}
        // rightPress={() => props.navigation.navigate('notification')}
        titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const BackupTag = () => {
    return (
      <View>
        {!VARIABLES.user?.isBackup && (
          <View
            style={{
              backgroundColor: colors.red1,
              padding: 20,
              borderRadius: 20,
              // marginVertical:20,
              // marginHorizontal:16
            }}>
            <Text
              style={{
                ...globalStyles.semiBoldLargeText,
                textAlign: 'center',
                marginTop: 20,
                lineHeight: 30,
              }}>
              {
                'The pairing code doesn’t exist. You can take a backup of your data.'
              }
            </Text>
            <View style={{marginTop: 30, alignItems: 'center'}}>
              <AppButton
                text="Backup Data"
                style={{width: BUTTON_WIDTH - 20, marginStart: 6}}
                textStyle={{fontSize: 14}}
                onPress={TakeBackupHandler}
              />
            </View>
          </View>
        )}
        <View
          style={{
            borderWidth: 1,
            borderRadius: 20,
            borderColor: colors.red1,
            padding: 20,
            marginVertical: 20,
          }}>
          <Text
            style={{
              ...globalStyles.regularLargeText,
              textAlign: 'center',
              marginTop: 20,
              lineHeight: 30,
            }}>
            To start fresh, you can deactivate your account and generate a new
            pairing code.
          </Text>

          <Pressable onPress={() => props.navigation.navigate('deactivation')}>
            <Text
              style={{
                ...globalStyles.semiBoldLargeText,
                color: colors.blue1,
                textAlign: 'center',
                marginTop: 8,
                textDecorationLine: 'underline',
              }}>
              Deactivate account
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const handleGalleryPicker = () => {
    // setGalleryAndCameraModal(false)
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      smartAlbums: [
        'PhotoStream',
        'Generic',
        'Panoramas',
        'Favorites',
        'AllHidden',
        'RecentlyAdded',
        'UserLibrary',
        'SelfPortraits',
        'Screenshots',
      ],
    })
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        const path = await CompressedImage.compress(image.path);
        // console.log('path', image.path);
        setProfileImage(path);
        seteditingImage(image);

        return;
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const handleCameraPicker = () => {
    // setModalVisible(false)
    // setGalleryAndCameraModal(false)
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      cropping: true,
    })
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        // console.log('path', image.path);
        // console.log('path', image.path.substring(image.path.lastIndexOf('/') + 1));
        const path = await CompressedImage.compress(image.path);
        setProfileImage(path);
        seteditingImage(image);
        return;
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const TakeBackupHandler = () => {
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(Backup());
  };

  const UpdatePersonalise = async () => {
    if (loading) {
      return;
    }
    if (info.name === '') {
      alert('Please enter name');
      return;
    } else if (info.email === '') {
      alert('Please enter email');
      return;
    } else if (regEmail.test(info.email) === false) {
      alert('Please enter a valid email');
      return;
    }

    let params = {
      profilePic: media,
      name: info.name,
      lastName: info.lastName,
      email: info.email,
    };

    if (!netInfo.isConnected) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
    setLoading(true);
    if (editingImage?.path) {
      const filename = editingImage.path.substring(
        editingImage.path.lastIndexOf('/') + 1,
      );
      setGalleryAndCameraModal(false);

      // uploadToS3(image.path, filename, image.mime)
      let imgUrl = '';

      const s3response = await uploadToS3BUCKET(
        editingImage.path,
        `${moment().format('x')}${filename}`,
        editingImage.mime,
        'profiles',
      );

      if (s3response.statusCode === 201) {
        imgUrl = s3response.response;
        params.profilePic = s3response.response;
        await StoreLocalImage(
          editingImage.path,
          `${moment().format('x')}${filename}`,
        );
      } else if (s3response.statusCode === 500) {
        alert("Sorry profile pic couldn't upload to server due to some error.");
        console.log(s3response.response);
      } else {
        console.log(s3response);
      }
    }

    dispatch(EditProfile(params)); // api calling through redux-saga
  };

  const stateHandler = async () => {
    if (state.reducer.case === actions.LOGOUT_SUCCESS) {
       disconnectSocket();

      setLoading(false);

      setLoading(false);
      await delay(200);
      setTimeout(() => {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Auth',
              },
            ],
          }),
        );
      }, 300);

      if (
        VARIABLES.user?.isPartnerDeleted &&
        VARIABLES.user?.partnerData.partner !== undefined
      ) {
        AsyncStorage.setItem('CURRENT_USER_ID', '12345');
      }
      VARIABLES.user = {};
      VARIABLES.token = null;
      await removeData('TOKEN');
      await removeData('USER');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.LOGOUT_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_PROFILE_SUCCESS) {
      setLoading(false);
      ToastMessage('Updated Successfully');
      await delay(1000);
      VARIABLES.user = state.reducer.userData;

      CleverTap.profileSet({
        Name: state.reducer.userData.name,
        userName: state.reducer.userData.name,

        Email: state.reducer.userData.email,

        Gender: state.reducer.userData.gender,
        DOB: state.reducer.userData?.dob,
        'MSG-push': true,
      });
      CleverTap.registerForPush();

      // CleverTap.createNotificationChannel(
      //   'CtRNS',
      //   'Clever Tap React Native Testing',
      //   'CT React Native Testing',
      //   5,
      //   true,
      // );

      setIsEdit(false);
      // props.navigation.navigate('addProfilePic')
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_PROFILE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      // alert(state.message)
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.BACKUP_SUCCESS) {
      setLoading(false);
      alert('Data backed up Successfully');
      VARIABLES.user = state.reducer.userData;
      // props.navigation.navigate('addProfilePic')
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.BACKUP_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_USER_PROFILE_SUCCESS) {
      setLoading(false);
      setPushNotificationsData(state.reducer.userData.pushNotifications);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_USER_PROFILE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);

      dispatch(ClearAction());
    }
  };

  useEffect(() => {
    stateHandler();
  }, [state]);

  async function StoreLocalImage(imageUri, fileName) {
    // Request necessary permissions if needed (e.g., for Android)
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path

    const directoryPath = `${picturesPath}/CloserImages`; // Specify the name of your directory

    // Check if the directory exists, and create it if it doesn't
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
    }

    const destinationPath = `${directoryPath}/${fileName}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(imageUri, destinationPath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  }

  const loadFile = async uri => {
    const path = RNFS.DocumentDirectoryPath + `/CloserImages/${uri}`;

    const exists = await RNFS.exists(path);

    if (exists) {
      setProfileImage(path);
      // return `file://${path}`;
    } else {
      setProfileImage(AWS_URL_S3 + uri);
    }
  };

  useEffect(() => {
    if (VARIABLES.user?.profilePic) {
      loadFile(VARIABLES.user?.profilePic);
    }
    setInfo({
      ...info,
      name: VARIABLES.user?.name,
      lastName: VARIABLES.user?.lastName,
      email: VARIABLES.user?.email,
    });
  }, []);

  const refreshTokenApi = async (email, refreshToken) => {
    try {
      const refreshedState = await refresh(googleConfig, {
        refreshToken: refreshToken,
      });

      if (refreshedState?.accessToken) {
        props.navigation.navigate('backupNowScreen', {
          accessToken: refreshedState.accessToken,
          email: email,
        });
        console.log('success', refreshedState);
        //  return resp.data;
      } else {
        googleSignIn();
      }
    } catch (error) {
      googleSignIn();
      console.log('error', error);
    }
  };

  const googleSignIn = async () => {
    try {
      const authState = await authorize(googleConfig);
      console.log('authState:', authState);

      const userInfo = await getGoogleUserInfo(authState.accessToken);

      console.log('userInfo:', userInfo);

      props.navigation.navigate('backupNow', {
        accessToken: authState.accessToken,
        email: userInfo.email,
      });

      AsyncStorage.setItem('savedGoogleRefreshToken', authState.refreshToken);
      AsyncStorage.setItem('googleEmail', userInfo.email);
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  const onEveningModeChange = async val => {
    setEveningModeSwitch(val);
    await updateContextualTooltipState('eveningModeSwitch', val);
  };

  const checkEveningStatus = async () => {
    const eveningModeCheck = await checkContextualTooltip('eveningModeSwitch');

    if (eveningModeCheck) {
      setEveningModeSwitch(true);
    } else {
      setEveningModeSwitch(false);
    }
  };

  const onRemoveAccount = async () => {
    disconnectSocket();
    Logout();

    setTimeout(() => {
      props.navigation.dispatch(
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
  };

  return (
    <>
      <AppView
        isLoading={loading}
        scrollContainerRequired={true}
        isScrollEnabled={true}
        header={AppHeader}>
        <View
          style={{
            ...globalStyles.apphorizontalSpacing,
            //   marginTop: scale(20),
            paddingBottom: scale(20),
          }}>
          {VARIABLES.user?.partnerData?.partner &&
            VARIABLES.user?.partnerData?.partner?.isDeactivated &&
            BackupTag()}
          {!isEdit ? (
            <View style={styles.userDetailContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <Pressable
                    onPress={() => {
                      if (profileImage?.length > 0) {
                        setViewImage(profileImage);
                        setVisibleImage(true);
                      }
                    }}>
                    {profileImage?.length === 0 ? (
                      <ProfileAvatar
                        type="user"
                        style={{
                          ...styles.userImg,
                          backgroundColor: 'lightgray',
                        }}
                      />
                    ) : (
                      <FastImage
                        source={
                          profileImage?.length == 0
                            ? APP_IMAGE.profileAvatar
                            : {uri: profileImage}
                        }
                        style={{
                          ...styles.userImg,
                          backgroundColor: 'lightgray',
                        }}
                        defaultSource={APP_IMAGE.profileAvatar}
                      />
                    )}
                  </Pressable>
                  <View style={{flex: 1, marginEnd: scale(16)}}>
                    <Text style={styles.userName} numberOfLines={2}>
                      {VARIABLES.user?.name} {VARIABLES.user?.lastName}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{...styles.contactContainer, flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={APP_IMAGE.email}
                    style={{
                      width: 18,
                      height: 18,
                    }}
                  />
                  <Text
                    style={{...styles.contact, flex: 1, marginStart: scale(8)}}
                    numberOfLines={1}>
                    {VARIABLES.user?.email}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setIsEdit(true)}
                style={{
                  position: 'absolute',
                  top: scale(28),
                  right: scale(20),
                }}>
                <Image source={APP_IMAGE.edit} style={styles.icon} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.userDetailContainer}>
              <View style={{alignItems: 'center'}}>
                {console.log('profile image', profileImage)}
                {profileImage?.length === 0 ? (
                  <ProfileAvatar
                    type="user"
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                      backgroundColor: 'lightgray',
                    }}
                  />
                ) : (
                  <FastImage
                    source={
                      profileImage?.length == 0
                        ? APP_IMAGE.profileAvatar
                        : {uri: profileImage}
                    }
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                      backgroundColor: 'lightgray',
                    }}
                    defaultSource={APP_IMAGE.profileAvatar}
                  />
                )}

                <Pressable
                  style={{marginTop: -30, marginRight: -70}}
                  onPress={() => setGalleryAndCameraModal(true)}>
                  <PlusWhiteBackIcon3Svg />
                </Pressable>
              </View>
              <View style={{}}>
                <Text style={styles.contactLabel}>Full Name</Text>
                <View
                  style={{
                    ...styles.textInputContainer,
                  }}>
                  <TextInput
                    placeholder="Enter full name"
                    placeholderTextColor={colors.grey9}
                    // keyboardType='numeric'
                    style={{...styles.textInput}}
                    onChangeText={getName}
                    onBlur={onBlurName}
                    value={info.name}
                    autoCapitalize="none"
                    // onSubmitEditing={() => alert('hhh')}
                    returnKeyType="done"
                  />
                </View>

                {/* <Text style={styles.contactLabel}>Last Name</Text>
                <View
                  style={{
                    ...styles.textInputContainer,
                  }}>
                  <TextInput
                    placeholder="Enter last name"
                    placeholderTextColor={colors.grey9}
                    // keyboardType='numeric'
                    style={{...styles.textInput}}
                    onChangeText={getLastName}
                    onBlur={onBlurLastName}
                    value={info.lastName}
                    autoCapitalize="none"
                    // onSubmitEditing={() => alert('hhh')}
                    returnKeyType="done"
                  />
                </View> */}

                <Text style={styles.contactLabel}>Email ID</Text>
                <View
                  style={{
                    ...styles.textInputContainer,
                  }}>
                  <TextInput
                    editable={false}
                    placeholder="Enter email id"
                    placeholderTextColor={colors.grey9}
                    // keyboardType='numeric'
                    style={{...styles.textInput}}
                    onChangeText={getEmail}
                    onBlur={onBlurEmail}
                    value={info.email}
                    autoCapitalize="none"
                    // onSubmitEditing={() => alert('hhh')}
                    returnKeyType="done"
                  />
                </View>
              </View>
              <Pressable
                hitSlop={20}
                style={{position: 'absolute', top: 15, right: 15}}
                onPress={() => {
                  setInfo({
                    ...info,
                    name: VARIABLES.user?.name,
                    email: VARIABLES.user?.email,

                    lastName: VARIABLES.user?.lastName,
                  });
                  setIsEdit(false);
                  if (VARIABLES.user?.profilePic) {
                    setProfileImage(AWS_URL_S3 + VARIABLES.user?.profilePic);
                  }
                }}>
                <Image
                  source={APP_IMAGE.XIcon}
                  style={{
                    width: scale(24),
                    height: scale(24),
                  }}
                />
                {/* <Image
                            source={APP_IMAGE.edit}
                            style={styles.icon}
                        /> */}
                {/* <Text style={{color: '#000', fontSize: scale(24)}}>x</Text> */}
              </Pressable>
            </View>
          )}

          {!isEdit && (
            <>
              {VARIABLES.user?.isPartnerDeleted &&
                VARIABLES.user?.partnerData.partner !== undefined && (
                  <View
                    style={{
                      backgroundColor: colors.white,
                      paddingTop: scale(20),
                      paddingBottom: scale(20),
                      /// paddingHorizontal: scale(30),
                      borderRadius: scale(20),
                      marginTop: scale(14),
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.regularFont,
                        color: '#808491',
                        fontSize: scale(14),
                        textAlign: 'center',
                      }}>
                      You can create a new pairing with another{`\n`}partner
                      whenever you’d want, by logging out
                    </Text>
                    <Pressable
                      onPressIn={() => {
                        setLogoutModalVisible(true);
                      }}
                      style={{
                        alignSelf: 'center',
                        marginTop: scale(12),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBoldFont,
                          color: '#E6515D',
                          fontSize: scale(14),
                          textDecorationLine: 'underline',
                        }}>
                        Logout
                      </Text>
                    </Pressable>
                  </View>
                )}
              {VARIABLES.user?.partnerData?.partnerUnpair &&
                VARIABLES.user?.partnerData?.isLoggedIn && (
                  <View
                    style={{
                      backgroundColor: colors.white,
                      paddingTop: scale(20),
                      paddingBottom: scale(20),
                      /// paddingHorizontal: scale(30),
                      borderRadius: scale(20),
                      marginTop: scale(14),
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.regularFont,
                        color: '#808491',
                        fontSize: scale(14),
                        textAlign: 'center',
                      }}>
                      You can create a new pairing with another{`\n`}partner
                      whenever you’d want, by logging out
                    </Text>
                    <Pressable
                      onPressIn={() => {
                        setLogoutModalVisible(true);
                      }}
                      style={{
                        alignSelf: 'center',
                        marginTop: scale(12),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.semiBoldFont,
                          color: '#E6515D',
                          fontSize: scale(14),
                          textDecorationLine: 'underline',
                        }}>
                        Logout
                      </Text>
                    </Pressable>
                  </View>
                )}
              <View style={styles.pairingCodeContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{marginEnd: scale(12)}}
                    source={APP_IMAGE.pairingCodeIcon}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Pairing Code
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={APP_IMAGE.pairingCodeStars}
                    style={{
                      marginRight: 10,
                      width: 50,
                      height: 8,
                      resizeMode: 'contain',
                    }}
                  />
                  <Pressable onPress={copyToClipboard} hitSlop={20}>
                    <Image
                      style={{
                        tintColor: colors.black,
                      }}
                      source={require('../../../assets/images/screenshotQuiz.png')}
                    />
                  </Pressable>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  CleverTap.recordEvent('Personalization tapped');
                  props.navigation.navigate('PersonaliseEdit');
                  // props.navigation.navigate('personalise', {
                  //   prevNavigatingScreen: 'profile',
                  //   editPersonalisation: 2,
                  //   dateOfMeetData: VARIABLES.user?.personalise?.dateOfMeet,
                  //   topicsData: VARIABLES.user?.personalise?.favTopics,
                  //   relationshipDistProp:
                  //     VARIABLES.user?.personalise?.relationshipDistance,
                  //   relationTypeProp:
                  //     VARIABLES.user?.personalise?.relationshipStatus,
                  // });
                }}
                style={styles.pairingCodeContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{marginEnd: scale(12)}}
                    source={APP_IMAGE.personlisationIcon}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Personalisation
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={APP_IMAGE.rightArrow}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </Pressable>

              <View style={styles.pairingCodeContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{marginEnd: scale(12)}}
                    source={APP_IMAGE.biometricIcon}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Use biometrics for app lock
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SwitchCustom
                    value={biometricSwitch}
                    onValueChange={val => {
                      setLoading(true);
                      CleverTap.recordEvent('Biometrics changed');
                      createSignaturePrivateKey(val);
                    }}
                  />
                </View>
              </View>

              <View style={styles.pairingCodeContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{marginEnd: scale(12)}}
                    source={APP_IMAGE.eveningIcon}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Automatic evening colours
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <SwitchCustom
                    value={eveningModeSwitch}
                    onValueChange={val => {
                      CleverTap.recordEvent('Evening colours changed');
                      onEveningModeChange(val);
                    }}
                  />
                </View>
              </View>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(14),
                }}>
                Archive
              </Text>
              <View
                style={{
                  borderRadius: scale(10),
                  backgroundColor: colors.white,
                }}>
                <Pressable
                  onPress={() => {
                    CleverTap.recordEvent('Archive: quiz cards opened');
                    props.navigation.navigate('QuizArchieve');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.quizCardIcon}
                      style={{
                        resizeMode: 'contain',
                        marginEnd: scale(12),
                      }}
                    />
                    <Text
                      style={{
                        ...globalStyles.standardMediumText,
                        includeFontPadding: false,
                      }}>
                      Quiz cards
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.rightArrow}
                      style={{
                        width: scale(20),
                        height: scale(20),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </Pressable>
                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    CleverTap.recordEvent('Archive: nudge cards opened');
                    props.navigation.navigate('ImageCardArchieve');
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.nudgeCardIcon}
                      style={{
                        // width: scale(40),
                        // height: scale(30),
                        resizeMode: 'contain',
                        marginEnd: scale(12),
                      }}
                    />
                    <Text
                      style={{
                        ...globalStyles.standardMediumText,
                        includeFontPadding: false,
                      }}>
                      Nudge cards
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.rightArrow}
                      style={{
                        width: scale(20),
                        height: scale(20),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </Pressable>
              </View>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(-6),
                }}>
                Notifications
              </Text>

              <Pressable
                onPress={() => {
                  CleverTap.recordEvent('Manage notifications opened');
                  setManageNotificationsModal(true);
                }}
                style={{...styles.pairingCodeContainer}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/images/notification.png')}
                    style={{
                      // width: scale(40),
                      // height: scale(30),
                      resizeMode: 'contain',
                      marginEnd: scale(12),
                    }}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Manage Notifications
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={APP_IMAGE.rightArrow}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </Pressable>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(-6),
                }}>
                About Closer
              </Text>

              <Pressable
                onPress={() => {
                  Linking.openURL('https://getcloserapp.co/');
                }}
                style={{...styles.pairingCodeContainer}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/images/learnAboutCloser.png')}
                    style={{
                      // width: scale(40),
                      // height: scale(30),
                      resizeMode: 'contain',
                      marginEnd: scale(6),
                    }}
                  />
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      includeFontPadding: false,
                    }}>
                    Learn more about Closer
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={APP_IMAGE.rightArrow}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </Pressable>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(14),
                }}>
                Share - We love this! 💌
              </Text>
              <View
                style={{
                  borderRadius: scale(10),
                  backgroundColor: colors.white,
                }}>
                <Pressable
                  onPress={() => {
                    CleverTap.recordEvent('Share app tapped');
                    setShareCloserModalVisible(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.shareAppIcon}
                      style={{
                        // width: scale(40),
                        // height: scale(30),
                        resizeMode: 'contain',
                        marginEnd: scale(12),
                      }}
                    />
                    <Text
                      style={{
                        ...globalStyles.standardMediumText,
                        includeFontPadding: false,
                      }}>
                      Share App
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Platform.OS === 'ios' ? 0 : scaleNew(3),
                        marginEnd: scale(2),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.regularFont,
                          fontSize: scaleNew(12),
                          color: '#808491',
                          marginEnd: scale(2),
                        }}>
                        Know more couples?
                      </Text>
                      <Text
                        style={{
                          fontSize: scaleNew(10),
                          color: '#000',
                          marginTop:
                            Platform.OS === 'ios' ? -scaleNew(1) : -scaleNew(4),
                        }}>
                        💟
                      </Text>
                    </View>
                    <Image
                      source={APP_IMAGE.rightArrow}
                      style={{
                        width: scale(20),
                        height: scale(20),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    CleverTap.recordEvent('Share feedback tapped');
                    setImproveCloserModalVisible(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={APP_IMAGE.shareFeedbackIcon}
                      style={{
                        // width: scale(40),
                        // height: scale(30),
                        resizeMode: 'contain',
                        marginEnd: scale(12),
                      }}
                    />
                    <Text
                      style={{
                        ...globalStyles.standardMediumText,
                        includeFontPadding: false,
                      }}>
                      Share feedback
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Platform.OS === 'ios' ? 0 : scaleNew(3),
                      }}>
                      <Text
                        style={{
                          fontFamily: fonts.regularFont,
                          fontSize: scaleNew(12),
                          color: '#808491',
                          marginEnd: scale(2),
                        }}>
                        Bugs? More features?
                      </Text>
                      <Text
                        style={{
                          fontSize: scaleNew(10),
                          color: '#000',
                          marginTop:
                            Platform.OS === 'ios' ? -scaleNew(1) : -scaleNew(4),
                        }}>
                        👂
                      </Text>
                    </View>

                    <Image
                      source={APP_IMAGE.rightArrow}
                      style={{
                        width: scale(20),
                        height: scale(20),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </Pressable>
              </View>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(16),
                  //   marginBottom: scale(4),
                }}>
                Back up
              </Text>

              {VARIABLES.user?.backupEmail !== '' &&
                VARIABLES.user?.backupEmail !== null &&
                VARIABLES.user?.backupEmail !== undefined &&
                lastBackupDate !== '' &&
                lastBackupSize !== '' && (
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(12),
                      color: colors.text,
                      marginTop: scale(2),
                      marginBottom: scale(14),
                    }}>
                    Last backup on {lastBackupDate} | Total Size:{' '}
                    {lastBackupSize}
                  </Text>
                )}

              <View
                style={{
                  borderRadius: scale(10),
                  backgroundColor: colors.white,
                }}>
                <Pressable
                  onPress={async () => {
                    CleverTap.recordEvent('Backup tapped');
                    const email = await AsyncStorage.getItem('googleEmail');
                    const refreshToken = await AsyncStorage.getItem(
                      'savedGoogleRefreshToken',
                    );
                    if (email && refreshToken) {
                      //  props.navigation.navigate('backupNow');
                      refreshTokenApi(email, refreshToken);
                    } else {
                      props.navigation.navigate('backupNow');
                    }
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={require('../../../assets/images/shield-tick.png')}
                    />
                    <Text
                      style={{
                        fontFamily: fonts.semiBoldFont,
                        fontSize: scale(14),
                        color: colors.blue1,
                        marginStart: scale(12),
                        includeFontPadding: false,
                      }}>
                      Backup now
                    </Text>
                  </View>
                  <Image
                    source={APP_IMAGE.rightArrow}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    props.navigation.navigate('AutoBackup', {
                      backupFrequency: backupFrequency,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {isBackupOverdue ? (
                        <Image
                          source={require('../../../assets/images/danger.png')}
                        />
                      ) : (
                        <Image
                          source={require('../../../assets/images/cloud-add.png')}
                        />
                      )}
                      <Text
                        style={{
                          fontFamily: fonts.standardFont,
                          fontSize: scale(14),
                          color: colors.text,
                          marginStart: scale(12),
                          includeFontPadding: false,
                        }}>
                        Auto Backup
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: fonts.regularFont,
                          fontSize: scale(14),
                          color: colors.text,
                          marginEnd: scale(4),
                        }}>
                        {backupFrequency.charAt(0).toUpperCase() +
                          backupFrequency.slice(1)}
                      </Text>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>
                {isBackupOverdue && (
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(12),
                      color: '#424B5D',
                      marginStart: scale(54),
                      marginTop: scale(-16),
                      marginBottom: scale(20),
                      marginEnd: scale(20),
                    }}>
                    Couldn’t complete backup as the app was terminated. Please
                    try the manual back up or we will try automatic backup
                    again.
                  </Text>
                )}
              </View>

              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(16),
                  color: colors.text,
                  marginTop: scale(20),
                  marginBottom: scale(14),
                }}>
                Others
              </Text>

              <View
                style={{
                  borderRadius: scale(10),
                  backgroundColor: colors.white,
                }}>
                <Pressable
                  onPress={() => setprivacyPolicy(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{marginEnd: scale(12)}}
                      source={APP_IMAGE.privacyIcon}
                    />
                    <Text
                      style={{
                        ...globalStyles.standardMediumText,
                        includeFontPadding: false,
                      }}>
                      Privacy policy
                    </Text>
                  </View>
                  <Image
                    source={APP_IMAGE.rightArrow}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                    }}
                  />
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => settermsCond(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{marginEnd: scale(12)}}
                        source={APP_IMAGE.termsIcon}
                      />
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          includeFontPadding: false,
                        }}>
                        Terms & Conditions
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    setReportAbuseModal(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{marginEnd: scale(12)}}
                        source={APP_IMAGE.reportAbuseIcon}
                      />
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          includeFontPadding: false,
                        }}>
                        Report abuse
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    setUnpairModal(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{marginEnd: scale(12)}}
                        source={APP_IMAGE.unpairIcon}
                      />
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          includeFontPadding: false,
                        }}>
                        Unpair with {VARIABLES.user?.partnerData?.partner?.name}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPress={() => {
                    setDeleteAccountModal(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{marginEnd: scale(12)}}
                        source={APP_IMAGE.deactivateIcon}
                      />
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          includeFontPadding: false,
                        }}>
                        Delete my account
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>

                <View
                  style={{
                    height: 1,
                    backgroundColor: colors.backgroundColor,
                    marginStart: scale(54),
                  }}
                />

                <Pressable
                  onPressIn={() => {
                    setLogoutModalVisible(true);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: scale(20),
                  }}>
                  <>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        style={{marginEnd: scale(12)}}
                        source={APP_IMAGE.logoutIcon}
                      />
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          color: '#E6515D',
                          includeFontPadding: false,
                        }}>
                        Log out
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={APP_IMAGE.rightArrow}
                        style={{
                          width: scale(20),
                          height: scale(20),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </>
                </Pressable>
              </View>
            </>
          )}
        </View>

        {galleryAndCameraModal && (
          <ImagePickerModal
            modalVisible={galleryAndCameraModal}
            setModalVisible={setGalleryAndCameraModal}
            imageHandler={handleGalleryPicker}
            cameraHandler={handleCameraPicker}
            onDismissCard={() => {}}
          />
        )}
        <ImageView
          images={[{uri: viewImage}]}
          imageIndex={0}
          visible={visibleImage}
          onRequestClose={() => setVisibleImage(false)}
          doubleTapToZoomEnabled={true}
        />
      </AppView>

      {isEdit && (
        <AppButton
          text={'Save Changes'}
          style={{margin: 16}}
          onPress={UpdatePersonalise}
        />
      )}
      {/* {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={20} color={colors.blue4} />
        </View>
      )} */}
      <TermsAndconditions isVisible={termsCond} setIsVisible={settermsCond} />
      <TermsAndconditions
        isVisible={privacyPolicy}
        setIsVisible={setprivacyPolicy}
        redirectUrl={`${API_BASE_URL}privacyPolicy`}
      />

      {logoutModalVisible && (
        <LogoutModal
          modalVisible={logoutModalVisible}
          setModalVisible={setLogoutModalVisible}
          onSubmit={() => {
            onLogout();
          }}
        />
      )}

      {shareCloserModalVisible && (
        <ShareCloserModal
          modalVisible={shareCloserModalVisible}
          setModalVisible={setShareCloserModalVisible}
        />
      )}

      {improveCloserModalVisible && (
        <ImproveCloserModal
          modalVisible={improveCloserModalVisible}
          setModalVisible={setImproveCloserModalVisible}
          onClose={() => {
            setTimeout(() => {
              setFeedbackThankyouModalVisible(true);
            }, 100);
          }}
        />
      )}

      {feedbackThankyouModalVisible && (
        <FeedbackThankyouModal
          modalVisible={feedbackThankyouModalVisible}
          setModalVisible={setFeedbackThankyouModalVisible}
        />
      )}

      {deleteAccountModal && (
        <DeleteAccountModal
          modalVisible={deleteAccountModal}
          setModalVisible={setDeleteAccountModal}
          navigation={props.navigation}
          onAction={() => {
            onRemoveAccount();
          }}
        />
      )}
      {unpairModal && (
        <UnpairAccountModal
          modalVisible={unpairModal}
          setModalVisible={setUnpairModal}
          navigation={props.navigation}
          onAction={() => {
            onRemoveAccount();
          }}
        />
      )}
      {reportAbuseModal && (
        <ReportAbuseModal
          modalVisible={reportAbuseModal}
          setModalVisible={setReportAbuseModal}
          onClose={() => {
            setTimeout(() => {
              setReportAbuseSuccessModalVisible(true);
            }, 100);
          }}
        />
      )}

      {reportAbuseSuccessModalVisible && (
        <AbuseSuccessModal
          modalVisible={reportAbuseSuccessModalVisible}
          setModalVisible={setReportAbuseSuccessModalVisible}
        />
      )}

      {manageNotificationsModal && pushNotificationsData !== '' && (
        <ManageNotificationsModal
          modalVisible={manageNotificationsModal}
          setModalVisible={setManageNotificationsModal}
          pushNotificationsData={pushNotificationsData}
          setData={data => {
            onPressManageNotifications(data);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontFamily: fonts.standardFont,
    color: '#2F3A4E',
    fontSize: scale(26),
    // color: colors.blue1
  },
  userDetailContainer: {
    padding: scale(20),
    borderRadius: scale(20),
    backgroundColor: colors.red2,
  },
  userImg: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
  },
  userName: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    marginStart: scale(12),
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(16),
  },
  contact: {
    ...globalStyles.regularSmallText,
    marginStart: scale(4),
  },
  pairingCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: scale(20),
    borderRadius: scale(10),
    marginTop: scale(14),
  },
  personalisation: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(20),
    marginTop: scale(22),
    fontFamily: fonts.boldFont,
  },
  personaliseContainer: {
    marginVertical: scale(18),
  },
  personaliseQuestion: {
    ...globalStyles.semiBoldLargeText,
    fontFamily: fonts.standardFont,
  },
  personaliseDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(6),
    flex: 1,
  },
  personaliseDescription: {
    ...globalStyles.lightLargeText,
    fontSize: scale(12),
    opacity: 0.6,
  },
  personaliseEditIcon: {
    marginStart: scale(6),
  },
  mediaContainer: {
    padding: scale(10),
    borderRadius: scale(10),
    backgroundColor: '#fff',
  },
  deactivateContainer: {
    marginVertical: scale(14),
    // borderBottomWidth: 1,
    // borderBottomColor: colors.blue1,
    // alignSelf: 'baseline',
  },
  policyContainer: {},
  policyLink: {
    ...globalStyles.regularSmallText,
    color: colors.blue1,
    textDecorationLine: 'underline',
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    // marginStart: 10,
    marginTop: 8,
  },

  textInput: {
    flex: 1,
    marginHorizontal: scale(16),
    paddingVertical: scale(14),
    paddingHorizontal: 0,
    // height: 16,
    fontSize: scale(16),
    fontFamily: fonts.regularFont,
    // fontWeight: '500',
    color: colors.text,
    padding: 0,
    margin: 0,
  },
  contactLabel: {
    ...globalStyles.regularMediumText,
    marginTop: scale(18),
    marginStart: scale(16),
  },

  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // alignItems: 'center',
  },
});
