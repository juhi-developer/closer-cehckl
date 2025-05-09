/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  PermissionsAndroid,
  Keyboard,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  AppState,
  StatusBar,
  BackHandler,
  Dimensions,
  Share,
  Alert,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
  withSequence,
  interpolate,
  withDelay,
  Extrapolate,
} from 'react-native-reanimated';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import LottieView from 'lottie-react-native';
import AppView from '../../../components/AppView';
import {
  BOTTOM_SPACE,
  CARD_HEIGHT,
  globalStyles,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import { colors } from '../../../styles/colors';
import { APP_IMAGE, APP_STRING, MOMENT_KEY } from '../../../utils/constants';
import CopyIconSvg from '../../../assets/svgs/copyIconSvg';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import Clipboard from '@react-native-clipboard/clipboard';
import ImagePicker from 'react-native-image-crop-picker';
import ImagePickerModal from '../../../components/Modals/imagePickerModal';
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import AddDocumentIconSvg from '../../../assets/svgs/addDocumentIconSvg';
import RecordAudioIconSvg from '../../../assets/svgs/recordAudioIconSvg';
import AppButton from '../../../components/appButton';
import MicrophoneWhiteIconSvg from '../../../assets/svgs/microphoneWhiteIconSvg';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from '../../../utils/metrics';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSelector, useDispatch } from 'react-redux';
import {
  AddReaction,
  ClearAction,
  Deactivate,
  DeletePost,
  GetStories,
  GetUserProfile,
  addCommentPostSuccess,
  deleteCommentPostSuccess,
  deletePostSuccess,
} from '../../../redux/actions';
import messaging from '@react-native-firebase/messaging';
import { VARIABLES } from '../../../utils/variables';
import { ASYNC_STORAGE_KEYS, removeData, setData } from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import DeactivateAccountModal from '../../../components/Modals/deactivateAccountModal';
import { EventRegister } from 'react-native-event-listeners';
import { AWS_URL_S3 } from '../../../utils/urls';
import moment from 'moment-timezone';
import FastImage from 'react-native-fast-image';
import API from '../../../redux/saga/request';
import { fonts } from '../../../styles/fonts';
import {
  delay,
  downloadAndDecryptFromS3,
  generateID,
  getStateDataAsync,
  shareUrlImageStory,
  updateRecentlyUsedEmoji,
  uploadEncryptedToS3,
} from '../../../utils/helpers';
import RNFS from 'react-native-fs';
import OverlayLoader from '../../../components/overlayLoader';
import {
  ToastMessage,
  ToastMessageBottom,
} from '../../../components/toastMessage';
import { cloneDeep } from 'lodash';
import AWS from 'aws-sdk';
import { KEYCHAIN } from '../../../utils/keychain';
import Highlightcomponent from '../../../components/Highlightcomponent';
import { Card, Feelings, MomentLoader, Sticky } from '../notifications/Loader';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import NotesComp from './components/NotesComp';
import { NetworkContext } from '../../../components/NetworkContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import naclUtil from 'tweetnacl-util';
import { useSocket } from '../../../utils/socketContext';
import CustomToolTip from '../../../components/CustomToolTip';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../../../utils/VariablesContext';
import { Image as CompressedImage } from 'react-native-compressor';
import { useAppState } from '../../../utils/AppStateContext';
import { FeedCardGrid } from '../../../components/FeedCardGrid';
import { getMomentsData } from '../../../redux/saga/handlers';
import FloatingEmojis from '../../../components/FloatingEmojis';
import QuizCardComp from './components/QuizCardComp';

import EmojiSelector from './components/EmojiSelector';
import UserComp from './components/UserComp';
import StoriesComp from './components/StoriesComp';
import WellBeingCard from './components/WellBeingCard';
import { scaleNew } from '../../../utils/metrics2';
import Tooltip from 'react-native-walkthrough-tooltip';
import ImageUploadCard from './components/ImageUploadCard';
import TextCardComp from './components/TextCardComp';
import CloserJourneyModal from '../../../components/Modals/CloserJourneyModal';
import BeginJourney from './components/BeginJourney';
import HornyModeOn from './components/HornyModeOn';
import DatingTimeModal from '../../../components/Modals/DatingTimeModal';
import { useRealm } from '@realm/react';

import RNShake from 'react-native-shake';
import {
  checkContextualTooltip,
  ensureTooltipsInitialized,
  initializeTooltipStates,
  initialTooltipStates,
  updateContextualTooltipState,
} from '../../../utils/contextualTooltips';
import TurnBiometricOnModal from '../../../components/Modals/TurnBiometricOnModal';
import HornyModeBottomSheet from '../../../components/Modals/HornyModeBottomSheet';
import PokesHornyTooltip from '../../../components/contextualTooltips/PokesHornyTooltip';
import EmojiSelectorHorny from './components/EmojiSelectorHorny';
import { HapticFeedbackHeavy } from '../../../utils/HapticFeedback';
import EveningModeModal from '../../../components/Modals/EveningModeModal';
import CTAComp from './components/CTAComp';
import HornyModeDialog from './components/HornyModeDialog';
import PairingComp from './components/PairingComp';
import UnpairAccountPartnerSideModal from '../../../components/Modals/UnpairAccountPartnerSideModal';
import DeleteAccountPartnerSideModal from '../../../components/Modals/DeleteAccountPartnerSideModal';
import ShareCloserModal from '../../../components/Modals/ShareCloserModal';
import ShareFeedbackModal from '../../../components/Modals/ShareFeedbackModal';
import FeedbackThankyouModal from '../../../components/Modals/FeedbackThankyouModal';
import MismatchAnswersModal from '../../../components/Modals/MismatchAnswersModal';
import { copyFilesToPublicStorage } from '../../../utils/copyAppDataToPublicStorage';
import { getKeyFromStorage, getKeyPair, safeGetItem } from '../../../utils/utils';
import ItemSeparatorComponentFeed from './components/ItemSeparatorComponentFeed';
import QuickCrypto from 'react-native-quick-crypto';
import ReportLogoutModal from '../../../components/Modals/ReportLogoutModal';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import InAppReview from 'react-native-in-app-review';
import ConfirmEmailModal from '../../../components/Modals/ConfirmEmailModal';
import DeviceInfo from 'react-native-device-info';
import { compareVersions } from '../../../backup/utils';
import ForceUpdateModal from '../../../components/Modals/ForceUpdateModal';
import * as Sentry from '@sentry/react-native';

const { width, height } = Dimensions.get('window');

import ShowInAppReviewModel from './ShowInAppReviewModel';

import quizTypeConfig from '../play/quizTypeConfig'; // Assuming this is the correct path to your config file




const CleverTap = require('clevertap-react-native');

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});



export default function Moments(props) {
  const { isConnected } = useContext(NetworkContext);
  const { socket, isSocketConnected } = useSocket();
  const appStateGlobal = useAppState();

  const [appState, setAppState] = useState(AppState.currentState);

  const [multiQuizCard, setMultiQuizCard] = useState([]);
  const [multiQuizDetail, setMultiQuizDetail] = useState([]);

  const {
    nudgeArray,
    updateNotifData,
    addNudgeArray,
    notifData,
    hornyMode,
    sethornyMode,
    activeTab,
    setActiveTab,
  } = useAppContext();

  const notesCompRef = useRef(null);

  const [wellbeingAddCardShown, setWellbeingAddCardShown] = useState(false);
  const [eveningMode, setEveningMode] = useState(false);
  const [confirmEmailModalVisible, setConfirmEmailModalVisible] =
    useState(false);

  const [shareFeedbackModalVisible, setShareFeedbackModalVisible] =
    useState(false);
  const [shareCloserModalVisible, setShareCloserModalVisible] = useState(false);
  const [hornyModeDialog, setHornyModeDialog] = useState(false);
  const [turnBiometricOnModalVisible, setTurnBiometricOnModalVisible] =
    useState(false);
  const [
    deleteAccountPartnerModalVisible,
    setDeleteAccountPartnerModalVisible,
  ] = useState(false);
  const [
    unpairAccountPartnerModalVisible,
    setUnpairAccountPartnerModalVisible,
  ] = useState(false);
  const [reportLogoutModalVisible, setReportLogoutModalVisible] =
    useState(false);
  const [reportLogoutModalType, setReportLogoutModalType] = useState('');

  const [mismatchAnswersData, setMismatchAnswersData] = useState('');
  const [mismatchAnswersModalVisible, setMismatchAnswersModalVisible] =
    useState(false);

  const isFocused = useIsFocused();

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const realm = useRealm();

  const hornyAnimationRef = useRef(null);

  const [emojiVisible, setEmojiVisible] = useState(false);
  const [profileData, setProfileData] = useState('');
  const [loading, setLoading] = useState(false);
  const [StoryImageUploading, setStoryImageUploading] = useState(false);

  const [hook, setHook] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);

  const snapPointsEmoji = useMemo(() => ['80%', '80%'], []);
  const [notes, setNotes] = useState([]);

  const [allNotes, setallNotes] = useState([]);

  const [eveningModeModalVisible, setEveningModeModalVisible] = useState(false);
  const [hornyModeDialogShow, setHornyModeDialogShow] = useState(false);
  const [hornyModeAnimmationActivated, setHornyModeAnimmationActivated] =
    useState(false);
  const [pairingModeActivated, setPairingModeActivated] = useState(false);

  const [focusedNoteIndex, setFocusedNoteIndex] = useState(null);

  const [pickerType, setPickerType] = useState('user');
  const [isUserStoryUploaded, setIsUserStoryUploaded] = useState(false);
  const [isPartnerStoryUploaded, setIsPartnerStoryUploaded] = useState(false);

  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [otherUserLastActive, setOtherUserLastActive] = useState('');

  const [weeksTogether, setWeeksTogether] = useState(0);
  const [day, setDay] = useState('');

  const [nudgeModalVisible, setNudgeModalVisible] = useState(false);

  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [askPartnerInput, setAskPartnerInput] = useState('');

  const [userStory, setUserStory] = useState([]);
  const [partnerStory, setPartnerStory] = useState([]);
  const [userStorySeen, setuserStorySeen] = useState(false);
  const [partnerStorySeen, setpartnerStorySeen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [timezone, setTimezone] = useState(false);
  const [closerCurrentDate, setCloserCurrentDate] = useState('');
  const [closerCurrentTime, setCloserCurrentTime] = useState('');
  const [closerPartOfDay, setCloserPartOfDay] = useState('');

  const [closerPartnerCurrentDate, setCloserPartnerCurrentDate] = useState('');
  const [closerPartnerCurrentTime, setCloserPartnerCurrentTime] = useState('');
  const [closerPartnerPartOfDay, setCloserPartnerPartOfDay] = useState('');

  const [stories, setStories] = useState([]);

  const [feelingsCheckArray, setFeelingsCheckArray] = useState([]);
  const [feelingsCheckPartnerArray, setFeelingsCheckPartnerArray] = useState(
    [],
  );

  const [reactionData, setReactionData] = useState('');
  const [isStoryUploaded, setIsStoryUploaded] = useState(false);

  const [icontabs, setIconTabs] = useState([
    { tab: 'Sticker', selected: true },
    { tab: 'Emoji', selected: false },
  ]);
  const [currentAudioPlayingIndex, setcurrentAudioPlayingIndex] = useState(-1);
  const [dataSourceCords, setDataSourceCords] = useState({});
  const [initialApi, setinitialApi] = useState(true);

  const scrollref = useRef(null);
  const scrollref1 = useRef(null);

  const [journeyModalVisible, setJourneyModalVisible] = useState(false);
  const [closerJourney, setcloserJourney] = useState({});

  const [toolTipCurrentState, setToolTipCurrentState] = useState('');
  const [delaAfterTooltipEmoji, setDelaAfterTooltipEmoji] = useState(true);
  const [imageQuestonCard, setimageQuestonCard] = useState({});

  const [questionCard, setQuestionCard] = useState('');
  const [showMeetUpDateModal, setshowMeetUpDateModal] = useState(false);
  const [showMeetUpDateTooltip, setshowMeetUpDateToolTip] = useState(false);
  const [feedbackThankyouModalVisible, setFeedbackThankyouModalVisible] =
    useState(false);

  const [showPokeAnimation, setShowPokeAnimation] = useState(false);
  const [pokeEmoji, setPokeEmoji] = useState('');
  const progress = useSharedValue(0);
  const scaleValue = Platform.OS === 'ios' ? scaleNew(165) : scale(130);
  const scaleAnim = useSharedValue(1);
  const emojiSelectorScale = useSharedValue(1);
  const [forceUpdateModal, setForceUpdateModal] = useState(false);

  const {
    posts: postData,
    hasMore,
    currentPage,
    error,
    loading: isLoading,
    footerLoader,
  } = useSelector(state => state.moments);

  const fetchRecentEmojis = async () => {
    const recentEmoji = await safeGetItem(ASYNC_STORAGE_KEYS.recentEmoji);
    if (recentEmoji?.length) {
      VARIABLES.recentReactions = recentEmoji;
    }

    const recentSmily = await safeGetItem(ASYNC_STORAGE_KEYS.recentSmily);
    if (recentSmily?.length) {
      VARIABLES.recentEmojis = recentSmily;
    }
  };

  const checkCurrentUser = async () => {
    const clearDbKey = await AsyncStorage.getItem('CLEAR_CHAT_DB_KEY');
    if (clearDbKey === 'true') {
      deleteChatDb();
    }
  };

  const deleteChatDb = async () => {
    // return;
    realm.write(() => {
      // Select all objects of the 'Message' type
      let allMessages = realm.objects('Message');
      // Delete them all
      realm.delete(allMessages);
    });
    AsyncStorage.setItem('CLEAR_CHAT_DB_KEY', 'false');
    AsyncStorage.setItem('CURRENT_USER_ID', VARIABLES.user?._id);
  };

  useEffect(() => {
    // deleteChatDb();
    if (!delaAfterTooltipEmoji) {
      setTimeout(() => {
        setDelaAfterTooltipEmoji(true);
      }, 3000);
    }
  }, [delaAfterTooltipEmoji]);

  const showInAppReview = async () => {
    const checkInAppReview = await checkContextualTooltip('inAppReviewShown');

    if (checkInAppReview === null || checkInAppReview === undefined) {
      await updateContextualTooltipState('inAppReviewShown', '0');
    }
    if (checkInAppReview === '2') {
      InAppReview.RequestInAppReview()
        .then(async hasFlowFinishedSuccessfully => {

          if (hasFlowFinishedSuccessfully) {
            await updateContextualTooltipState('inAppReviewShown', '3');
          }
        })
        .catch(error => {
          console.log('in app error', error);
        });
    }
  };

  const handleAppOpenAppStateChange = () => {
    const data = {
      userId: VARIABLES.user?._id,
    };
    setTimeout(() => {
      if (socket && socket.connected) {
        socket.emit('appOpenCount', data);
      }
    }, 2000);
  };


  const [appReviewModalVisible, setAppReviewModalVisible] = useState(false);


  useEffect(() => {
    const checkAndShowAppReviewModal = async () => {
      const hasShownModal = await AsyncStorage.getItem('hasShownAppReviewModal');
      if (!hasShownModal && VARIABLES.user?.howMuchTimeOpen > 5 && VARIABLES.user?.scoreMoments > 15) {
        setTimeout(() => {
          setAppReviewModalVisible(true);
          AsyncStorage.setItem('hasShownAppReviewModal', 'true'); // Mark as shown
        }, 2000);
      }
    };

    checkAndShowAppReviewModal();
  }, [VARIABLES.user?.howMuchTimeOpen, VARIABLES.user?.scoreMoments]);


  const handleAppReviewYesPress = async () => {
    console.log("Starting in-app review...");

    try {
      // Check if the platform supports in-app reviews
      if (InAppReview.isAvailable()) {
        const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview();
        // openStoreReviewPage(); // fallback to store page

        console.log("In-app review finished:", hasFlowFinishedSuccessfully);
      } else {
        console.log("In-app review is not available on this device.");
      }
    } catch (error) {
      console.log('In-app review error:', error);
    } finally {
      setAppReviewModalVisible(false); // Close the modal regardless of success or error
    }
  };

  const openStoreReviewPage = () => {
    const appStoreUrl = Platform.select({
      ios: 'itms-apps://itunes.apple.com/app/idYOUR_APP_ID?action=write-review',
      android: 'market://details?id=com.closer.application',
    });

    if (appStoreUrl) {
      Linking.openURL(appStoreUrl);
    }
  };
  const handleAppRevaaaaaiewYesPress = async () => {
    console.log("okay ababy");
    try {
      InAppReview.RequestInAppReview()
        .then(async (hasFlowFinishedSuccessfully) => {

          console.log("ddddd")
        })
        .catch((error) => {
          console.log('in app error', error);
        });

      setAppReviewModalVisible(false); // Close the modal
    } catch (error) {
      console.log('In-app review error:', error);
    }
  };


  const handleAppReviewNoPress = () => {
    setAppReviewModalVisible(false); // Close the modal
  };



  useEffect(() => {
    EventRegister.addEventListener('inAppReviewShown', () => {
      showInAppReview();
    });
    return () => {
      EventRegister.removeEventListener('inAppReviewShown');
    };
  }, []);

  const checkEmailVerified = async () => {
    const jsonUser = await safeGetItem('USER');
    if (jsonUser?.email === undefined) {
      setConfirmEmailModalVisible(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      toCheckVersion();
      return () => { };
    }, []),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppOpenAppStateChange()

    );
    return () => {
      subscription.remove();
    };
  }, [VARIABLES.user?._id, isSocketConnected]);

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      toCheckVersion();
    }
  };

  useEffect(() => {
    showInAppReview();
    checkEmailVerified();

    // setTimeout(() => {
    //   setReportLogoutModalType('user');
    //   setReportLogoutModalVisible(true);
    // }, 2000);
    /// clearContextualTooltips();

    //initializeTooltipStates();
    /// need to uncomment
    checkCurrentUser();
    // deleteChatDb();

    //  copyFilesToPublicStorage();
    ensureTooltipsInitialized();

    fetchRecentEmojis();

    updateFcmToken();
    updateEncryptionKeys();
    checkMeetUpDateTooltip();
  }, []);

  const toCheckVersion = async () => {
    try {
      const resp = await API('user/auth/version', 'GET');
      const res = resp?.body;
      const androidVersionCode = res?.data?.android?.versionCode;
      const androidVersionName = res?.data?.android?.versionName;

      const iosVersioncode = res?.data?.ios?.versionCode;
      const iosBuildNumber = res?.data?.ios?.buildNumber;

      const localVersionCode = DeviceInfo.getVersion();
      const localBuildNumber = DeviceInfo.getBuildNumber();

      if (Platform.OS === 'android') {
        if (Number(localBuildNumber) < Number(androidVersionCode)) {
          setForceUpdateModal(true);
        } else {
          setForceUpdateModal(false);
        }
      }

      if (Platform.OS === 'ios') {
        //  setForceUpdateModal(true);
        if (compareVersions(localVersionCode, iosVersioncode) < 0) {
          setForceUpdateModal(true);
        } else {
          setForceUpdateModal(false);
        }
      }
    } catch (error) {
      console.log('error force update', error);
    }
  };

  // Main function to update keys if they do not match
  const updateEncryptionKeys = async () => {
    const storedPublicKeyEncryption = await getKeyFromStorage(
      'publicKeyEncryption',
    );
    const storedPublicKeySigned = await getKeyFromStorage('publicKeySigned');

    if (
      VARIABLES.user?.publicKey !== storedPublicKeyEncryption ||
      VARIABLES.user?.signedPublicKey !== storedPublicKeySigned
    ) {
      const encryptionKeyPair = await getKeyPair('Encryption');
      const signingKeyPair = await getKeyPair('Signed');

      // Prepare data for backend
      let data = {
        publicKey: encryptionKeyPair.publicKey,
        signedPublicKey: signingKeyPair.publicKey,
      };

      const respp = await API('user/auth/updateKeys', 'PUT', data);

      console.log('respppp update encrypion keyss', respp);
    } else {
    }
  };

  // const updateEncryptionKeys = async () => {
  //   if (
  //     VARIABLES.user?.publicKey === '' ||
  //     VARIABLES.user?.publicKey === undefined ||
  //     VARIABLES?.user?.publicKey === null
  //   ) {
  //     const encryptionKeyPair = await getKeyPair('Encryption');
  //     const signingKeyPair = await getKeyPair('Signed');

  //     // Prepare data for backend
  //     let data = {
  //       publicKey: encryptionKeyPair.publicKey,
  //       signedPublicKey: signingKeyPair.publicKey,
  //     };

  //     await API('user/auth/updateKeys', 'PUT', data);
  //   }
  // };

  const updateFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    const updateToken = await API('user/moments/updateToken', 'POST', {
      deviceToken: fcmToken,
    });

  };

  const checkMeetUpDateTooltip = async () => {
    let meetingPopupState = await AsyncStorage.getItem(
      'setshowMeetUpDateToolTip',
    );
    if (meetingPopupState === 'true') {
      setshowMeetUpDateToolTip(true);
    }
  };
  //// hrony mmode on shake
  React.useEffect(() => {
    const subscription = RNShake.addListener(async () => {
      if (
        hornyMode === false &&
        !VARIABLES.disableTouch &&
        isFocused &&
        (appStateGlobal === 'active' || appStateGlobal === null)
      ) {
        setLoading(true);
        HapticFeedbackHeavy();

        try {
          const res = await API('user/moments/hornyMode', 'POST', {
            type: 'normal',
          });

          if (res.body.statusCode === 200) {
            CleverTap.recordEvent('Hm activated');

            setHornyModeAnimmationActivated(true);
            hornyAnimationRef.current?.play?.();
            setTimeout(() => {
              setTimeout(() => {
                setHornyModeAnimmationActivated(false);
                setHornyModeDialog(true);
                sethornyMode(true);
                momentData();
              }, 2000);
              setTimeout(() => {
                setHornyModeDialog(false);
              }, 5000);
            }, 200);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [hornyMode, isFocused, appStateGlobal]);

  const setCurrentDay = () => {
    const today = moment();

    const weekday = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];

    const currentDay = weekday[today.day()];

    setDay(currentDay);
  };

  useEffect(() => {
    setCurrentDay();

    momentData();
  }, []);

  const momentData = async () => {
    try {
      const newData = await dispatch(getMomentsData(0));

      if (newData !== undefined) {
        updateMomentsData2(newData);
      } else {
        setToolTipCurrentState(5);

        setIsRefreshing(false);
        setTimeout(() => {
          setinitialApi(false);
        }, 500);
      }
    } catch (error) {
      setToolTipCurrentState(5);

      console.log('get moments error', error);
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        setinitialApi(false);
      }, 500);
    }
  };

  const updateMomentsData2 = async newData => {
    try {
      handleHornyMode(newData);
      await handleContextualTooltips(newData);
      handlePairingTimeActions(newData);
      updateUserDataAndRelated(newData);
    } catch (error) {
      setToolTipCurrentState(5);

      console.error('Error updating moments data:', error);
    }
  };

  const checkEveningStatus = async () => {
    const eveningModeCheck = await checkContextualTooltip('eveningModeSwitch');

    if (eveningModeCheck) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      // Check if the current time is between 6 PM (18:00) and 6 AM (06:00)
      if (currentHour >= 18 || currentHour < 6) {
        setEveningMode(true);
      } else {
        setEveningMode(false);
      }
    }
  };

  const updateUserDataAndRelated = newData => {
    try {


      setUserData(newData?.user);
      setWellbeingAddCardShown(newData?.user?.wellbeingPopup);

      setStories(newData?.highlights);
      setimageQuestonCard(newData?.user?.nudgeCard);
      setQuestionCard(newData?.user?.quoteCard);
      setMultiQuizCard(newData?.playData);
      setMultiQuizDetail(newData?.playDataDetail);
      setStoriesDataFirstTime(newData?.stories?.stories);
      setPartnerStoriesData(newData?.stories?.partnerData?.partner?.stories);
      setFeelingsCheckPartnerArray(
        newData.moods?.partnerData?.partner?.feelingsCheckNew || [],
      );
      setcloserJourney(newData?.user?.journeyCompletion);

      setFunctionForUserFeelingsCheck(newData?.moods?.feelingsCheckNew);
      handleNotes(newData);
    } catch (error) {
      setToolTipCurrentState(5);

      console.error('Error updating user data and related items:', error);
    }
  };

  const handleNotes = newData => {
    try {
      if (!newData?.notes?.length) {
        // Clear notes if new data is empty
        setNotes([]);
        setallNotes([]);
        return;
      }

      const newNotesInfo = newData.notes;
      // .map(note => {
      //   // Assuming `timeStamps` is the property with the timestamp of the note
      //   // Check if the note was created within the last 24 hours
      //   if (
      //     moment(moment.now()).diff(moment(note.timeStamps), 'hours') < 24
      //   ) {
      //     return {
      //       ...note,
      //       isExpanded: false, // Setting default state for UI purposes
      //     };
      //   }
      //   return null;
      // })
      // .filter(note => note != null); // Filter out any null entries that didn't meet the time condition

      ///  const newNotesInfo = newData.notes;
      // if (newNotesInfo.length) {
      //   setNotes(newNotesInfo); // Set the state with filtered and mapped notes
      updateNotes(newNotesInfo); // Potentially another function that might handle other note-related updates
      //  }
    } catch (error) {
      console.error('Error handling notes:', error);
    }
  };

  // Update the updateNotes function as well
  const updateNotes = newData => {
    if (!Array.isArray(newData)) return;

    const updatedNotes = newData.map(newNote => {
      const existingNote = notes.find(n => n._id === newNote._id);
      return existingNote
        ? {
          ...newNote,
          isLayoutCalculated: existingNote.isLayoutCalculated,
          numberOfLines: existingNote.numberOfLines,
        }
        : newNote;
    });

    // Use functional updates to ensure we're working with latest state
    setallNotes(prevAllNotes => {
      if (JSON.stringify(prevAllNotes) !== JSON.stringify(updatedNotes)) {
        return [...updatedNotes];
      }
      return prevAllNotes;
    });

    setNotes(prevNotes => {
      if (JSON.stringify(prevNotes) !== JSON.stringify(updatedNotes)) {
        return [...updatedNotes];
      }
      return prevNotes;
    });
  };

  // const updateNotes = newData => {
  //   const updatedNotes = newData.map(newNote => {
  //     const existingNote = notes.find(n => n._id === newNote._id); // Assuming each note has a unique 'id'
  //     return existingNote
  //       ? {
  //           ...newNote,
  //           isLayoutCalculated: existingNote.isLayoutCalculated,
  //           numberOfLines: existingNote.numberOfLines,
  //         }
  //       : newNote;
  //   });
  //   setallNotes(updatedNotes);

  //   let newNotesInfo = newData;
  //   newNotesInfo = newNotesInfo.filter(val => !!val);
  //   newNotesInfo?.length && setNotes(newNotesInfo);

  //   //  setNotes(updatedNotes);
  // };

  const handleHornyMode = newData => {
    try {
      if (newData?.user?.hornyModeActive) {
        const currentTime = moment.utc();
        const givenTime = moment
          .unix(newData.user.hornyModeExpiresAt)
          .local()
          .subtract(30, 'minutes');
        const differenceInMinutes = currentTime.diff(givenTime, 'minutes');

        if (differenceInMinutes < 30) {
          sethornyMode(true, givenTime.toISOString());
        } else {
          sethornyMode(false);
        }
      }
    } catch (error) {
      console.error('Error handling horny mode:', error);
    }
  };

  const handleContextualTooltips = async newData => {
    try {
      const biometricKey = await checkContextualTooltip('biometricShown');
      const hornyModeDialogKey = await checkContextualTooltip(
        'hornyModeDialogShown',
      );
      const eveningModeDialogKey = await checkContextualTooltip(
        'eveningModeDialogShown',
      );
      const backupNowScreen = await checkContextualTooltip(
        'backupNowScreenVisited',
      );
      const shareCloserKey = await checkContextualTooltip('shareCloser');
      const shareFeedbackKey = await checkContextualTooltip('shareFeedback');

      const deleteAccountPartnerModalKey = await checkContextualTooltip(
        'deleteAccountPartnerModalShown',
      );
      const unpairPartnerModalKey = await checkContextualTooltip(
        'unpairPartnerModalShown',
      );

      setModalVisibilities(newData, {
        biometricKey,
        hornyModeDialogKey,
        eveningModeDialogKey,
        backupNowScreen,
        shareCloserKey,
        shareFeedbackKey,
        deleteAccountPartnerModalKey,
        unpairPartnerModalKey,
      });
    } catch (error) {
      setToolTipCurrentState(5);

      console.error('Error handling contextual tooltips:', error);
    }
  };

  const setModalVisibilities = (newData, keys) => {
    try {
      const {
        biometricKey,
        hornyModeDialogKey,
        eveningModeDialogKey,
        backupNowScreen,
        shareCloserKey,
        shareFeedbackKey,
        deleteAccountPartnerModalKey,
        unpairPartnerModalKey,
      } = keys;
      const pairingTime = newData?.user?.partnerData?.pairingTime;
      const pairingDate = new Date(pairingTime);
      const currentDate = new Date();
      const timeDiff = currentDate - pairingDate; // Difference in milliseconds
      const hoursPassed = timeDiff / (1000 * 60 * 60); // Convert ms to hours

      const nextDaySixPm = new Date(pairingDate);
      nextDaySixPm.setDate(pairingDate.getDate() + 1);
      nextDaySixPm.setHours(18, 0, 0, 0); // Set time to 6:00 PM the next day

      if (
        newData?.user?.partnerData?.partnerUnpair &&
        newData.user?.partnerData?.isLoggedIn &&
        unpairPartnerModalKey !== true &&
        unpairAccountPartnerModalVisible === false
      ) {
        setUnpairAccountPartnerModalVisible(true);
      }

      // if (
      //   newData?.user?.partnerData?.partnerUnpair &&
      //   newData.user?.partnerData?.isLoggedIn &&
      //   deleteAccountPartnerModalKey !== true &&
      //   deleteAccountPartnerModalVisible === false
      // ) {
      //   setDeleteAccountPartnerModalVisible(true);
      // }

      handleTimedModals(hoursPassed, currentDate, nextDaySixPm, {
        biometricKey,
        hornyModeDialogKey,
        eveningModeDialogKey,
        backupNowScreen,
        shareCloserKey,
        shareFeedbackKey,
      });
      checkEveningStatus(currentDate, pairingDate);
    } catch (error) {
      console.error('Error setting modal visibilities:', error);
    }
  };

  const handleTimedModals = (hoursPassed, currentDate, nextDaySixPm, keys) => {
    const {
      biometricKey,
      hornyModeDialogKey,
      eveningModeDialogKey,
      backupNowScreen,
      shareCloserKey,
      shareFeedbackKey,
    } = keys;

    if (
      currentDate >= nextDaySixPm &&
      !eveningModeModalVisible &&
      eveningModeDialogKey !== true
    ) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();

      // Check if the current time is between 6 PM (18:00) and 6 AM (06:00)
      if (currentHour >= 18 || currentHour < 6) {
        updateContextualTooltipState('eveningModeSwitch', true);
        setEveningModeModalVisible(true);
      }
    }

    try {
      // Check conditions for the biometric modal
      if (
        hoursPassed > 24 &&
        biometricKey !== true &&
        !eveningModeModalVisible &&
        !turnBiometricOnModalVisible
      ) {
        setTurnBiometricOnModalVisible(true);
        updateContextualTooltipState('biometricShown', true);
      }

      // Check conditions for the horny mode dialog
      if (
        hoursPassed > 48 &&
        hornyModeDialogKey !== true &&
        biometricKey === true &&
        !hornyModeDialogShow
      ) {
        setHornyModeDialogShow(true);
        updateContextualTooltipState('hornyModeDialogShown', true);
      }

      // Check conditions for the backup now screen
      if (
        hoursPassed > 72 &&
        backupNowScreen !== true &&
        hornyModeDialogKey === true
      ) {
        props.navigation.navigate('backupNow', {
          navigateFrom: 'moments',
        });
        updateContextualTooltipState('backupNowScreenVisited', true);
      }

      // Check conditions for the share closer modal
      if (
        hoursPassed > 96 &&
        shareCloserKey !== true &&
        backupNowScreen === true &&
        shareCloserModalVisible !== true
      ) {
        setShareCloserModalVisible(true);
        updateContextualTooltipState('shareCloser', true);
      }

      // Check conditions for the share feedback modal
      if (
        hoursPassed > 120 &&
        shareFeedbackKey !== true &&
        shareCloserKey === true &&
        shareFeedbackModalVisible !== true
      ) {
        setShareFeedbackModalVisible(true);
        updateContextualTooltipState('shareFeedback', true);
      }

      // Evening mode modal condition is handled in the checkEveningStatus function
    } catch (error) {
      console.error('Error handling timed modals:', error);
    }
  };

  const handlePairingTimeActions = newData => {
    try {
      const pairingTime = newData?.user?.partnerData?.pairingTime;
      if (!pairingTime) return; // Exit if no pairingTime is provided

      const pairingDate = new Date(pairingTime);
      const currentDate = new Date();
      const timeDiff = currentDate - pairingDate; // Difference in milliseconds
      const hoursPassed = timeDiff / (1000 * 60 * 60); // Convert ms to hours

      // Actions based on hours passed
      performTimedActions(hoursPassed, newData);
    } catch (error) {
      setToolTipCurrentState(5);

      console.error('Error handling pairing time actions:', error);
    }
  };

  const performTimedActions = (hoursPassed, newData) => {
    try {
      // Check for the Horny Mode tooltip after 24 hours
      if (hoursPassed > 24 && !newData?.user?.hornyToolTip) {
        EventRegister.emitEvent('hornyMode');
        API('user/toolTip', 'POST', { type: 'horny' });
      }
      if (
        !newData?.user?.toolTip &&
        toolTipCurrentState === '' &&
        newData?.user?.partnerData?.partner?._id !== undefined
      ) {
        checkPairingStatus();
      } else if (newData?.user?.partnerData?.partner?._id !== undefined) {
        setToolTipCurrentState(5); // Assuming '5' is a specific state in your tooltip logic
      }

      // Additional actions could be added here based on other time thresholds
    } catch (error) {
      console.error('Error performing timed actions:', error);
    }
  };

  const onRefreshMomemts = async () => {

    setCurrentDay();
    if (toolTipCurrentState === '' || toolTipCurrentState === 5) {
      setIsRefreshing(true);
      momentData();
      return;
    }
    // try {
    //   const newData = await dispatch(getMomentsData(0));
    //   updateMomentsData2(newData);
    // } catch (error) {
    //   console.log('get moments error', error);
    // } finally {
    //   setIsRefreshing(false);
    // }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      dispatch(getMomentsData(currentPage));
    }
  };

  const checkPairingStatus = async () => {
    setPairingModeActivated(true);
    setTimeout(() => {
      setPairingModeActivated(false);

      scrollref1.current?.scrollToPosition?.(0, 0);
      setTimeout(() => {
        setToolTipCurrentState(null);
      }, 500);
    }, 6000);
  };

  useEffect(() => {
    const refreshOrders = EventRegister.addEventListener(
      'pairingSuccessAnimation',
      files => {
        checkPairingStatus();
      },
    );

    return () => {
      // unsubscribe event

      EventRegister.removeEventListener(refreshOrders);
    };
  }, []);

  useEffect(() => {
    const refreshOrders = EventRegister.addEventListener(
      'pairingSuccess',
      files => {
        onRefreshMomemts();
      },
    );

    return () => {
      // unsubscribe event

      EventRegister.removeEventListener(refreshOrders);
    };
  }, []);

  useEffect(() => {
    const refreshOrders = EventRegister.addEventListener(
      'shareContentFeed',
      files => {
        files.forEach(file => {
          if (
            file.mimeType &&
            (file.mimeType.includes('jpg') ||
              file.mimeType.includes('jpeg') ||
              file.mimeType.includes('image/jpeg') ||
              file.mimeType.includes('png'))
          ) {
            const obj = {
              path: `file://${file.filePath}`, // Assuming 'uri' is used to access the image path
              renderType: 'cover',
              nonce: '',
            };
            props.navigation.navigate('addFeed', {
              imageURI: [obj],
            });

            // Handle image sharing
          } else {
            alert('Unsupported content');
            console.log('Unsupported content type:', file);
          }
        });
      },
    );

    return () => {
      // unsubscribe event

      EventRegister.removeEventListener(refreshOrders);
    };
  }, []);

  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const checkApiAndExecute = () => {
      if (!initialApi && pendingAction !== null) {
        setTimeout(() => {
          scrollHandler(pendingAction);
          setPendingAction(null); // Reset pending action after executing
        }, 1000);
      }
    };

    // Setup listener for event
    const notificationScroll = EventRegister.addEventListener(
      'notificationScrollToEvent',
      data => {
        if (!initialApi) {
          scrollHandler(data);
        } else {
          setPendingAction(data);
        }
      },
    );

    // Check and execute immediately if possible
    checkApiAndExecute();

    // Set up interval to check API readiness if needed
    let intervalId;
    if (initialApi && pendingAction !== null) {
      intervalId = setInterval(checkApiAndExecute, 2000);
    }

    return () => {
      EventRegister.removeEventListener(notificationScroll);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [initialApi, pendingAction]);

  useFocusEffect(
    React.useCallback(() => {
      // Set the current tab when ChatTab is focused
      setActiveTab('moments');
      return () => {
        // Reset the current tab when ChatTab is blurred (not focused)
        ///   setActiveTab('');
      };
    }, []),
  );

  useEffect(() => {
    let timer;

    if (isFocused) {
      timer = setTimeout(() => {
        // Check if initialApi is false and nudgeArray is an array with elements
        if (!initialApi && Array.isArray(nudgeArray) && nudgeArray.length > 0) {
          setNudgeModalVisible(true);
        }
      }, 500);
    }

    return () => {
      clearTimeout(timer);
      if (!isFocused) {
        VARIABLES?.currentSound?.stop?.();
      }
    };
  }, [isFocused, initialApi, nudgeArray]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isFocused
      ) {
        setTimeout(() => {
          if (
            !initialApi &&
            Array.isArray(nudgeArray) &&
            nudgeArray.length > 0
          ) {
            setNudgeModalVisible(true);
          }
        }, 500);
      } else {
        VARIABLES?.currentSound?.stop?.();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, isFocused, nudgeArray, initialApi]);

  useEffect(() => {
    stateHandler();
  }, [state]);

  const setStoriesDataSocket = async data => {
    if (VARIABLES?.user?._id === data._id) {
      setStoriesData(data?.stories);
    } else {
      setPartnerStoriesData(data?.stories);
    }
  };

  ////////////////// SOCKET LISTENERS
  useEffect(() => {
    if (isSocketConnected && socket) {
      socket.on('paired', data => { });

      socket.on('weeks', data => {
        setWeeksTogether(data);
      });
      socket.on('momentsQuiz', data => {
        onRefreshMomemts();
      });
      socket.on('personaliseMismatch', data => {

        setMismatchAnswersData(data);
        setMismatchAnswersModalVisible(true);
      });
      socket.on('deleteProfile', data => {
        setDeleteAccountPartnerModalVisible(true);
        momentData();
      });

      socket.on('unpairPartner', data => {
        setUnpairAccountPartnerModalVisible(true);
        momentData();
      });
      socket.on('isOnline', data => {
        setOtherUserOnline(data?.isOnline);
        if (data?.isOnline === false) {
          const now = new Date();
          const formattedTime = now.toISOString().replace('Z', ''); // Removes the 'Z' timezone designator

          setOtherUserLastActive(formattedTime);
        }
      });
      socket.on('addStory', data => {
        setStoriesDataSocket(data);
      });

      socket.on('addPost', data => {
        dispatch({ type: actions.ADD_POST_SUCCESS, payload: data });
      });

      socket.on('deletePost', data => {
        dispatch(deletePostSuccess(data?.post?._id));
      });
      socket.on('addNotes', data => {
        setAddNotesSocket(data);
      });

      socket.on('deleteNotes', data => { });

      socket.on('editNotes', data => { });

      socket.on('notesReactions', data => {
        setTimeout(async () => {
          setLoading(false);
          const prevNotes = await getStateDataAsync(setNotes);
          const newNotes = updateReactionInArray(prevNotes, data);
          setNotes(newNotes);

          const prevAllNotes = await getStateDataAsync(setallNotes);
          const newAllNotes = updateReactionInArray(prevAllNotes, data);
          setallNotes(newAllNotes);
        }, 1);
      });

      socket.on('deletePostReaction', data => { });
      socket.on('deletePostComment', data => {
        dispatch(deleteCommentPostSuccess(data.commentId, data.postId));
        setLoading(false);
      });

      socket.on('deleteCommentReaction', data => { });

      socket.on('deleteReplyComment', data => {
        setLoading(false);
      });

      //// no need to add code
      socket.on('deleteQnaReplyComment', data => { });
      socket.on('deleteQnaComment', data => { });

      //// no need to add code
      socket.on('replyQna', data => { });
      socket.on('postReaction', data => {
        setLoading(false);

        dispatch({ type: actions.ADD_POST_REACTION_SUCCESS, payload: data });
      });
      socket.on('postComment', data => {
        setLoading(false);

        dispatch(addCommentPostSuccess(data, data));
      });
      socket.on('commentReaction', data => {
        setLoading(false);
        setTimeout(async () => {
          dispatch({ type: actions.ADD_POST_REACTION_SUCCESS, payload: data });
        }, 1);
      });
      socket.on('WellBeing', data => {
        setLoading(false);

        setMoodsDataSocket(data);
      });
      socket.on('momentReactionsV2', data => {
        setLoading(false);

        setMoodsReactionSocket(data);
      });

      socket.on('optionsHorny', data => {
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setProfileData);

          const newData = updateProfileWithQnAHorny(prevArray, data);

          setLoading(false);
          setProfileData(newData);
        }, 1);
        setLoading(false);
      });

      socket.on('optionsQnA', data => {
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setProfileData);

          const newData = updateProfileWithQnA(prevArray, data);

          setLoading(false);
          setProfileData(newData);
        }, 1);
        setLoading(false);
      });

      socket.on('commentsHorny', data => {
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setProfileData);

          const newData = updateProfileQnACommentsHorny(prevArray, data);

          setProfileData(newData);
        }, 1);
        setLoading(false);
      });

      socket.on('commentsQnA', data => {
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setProfileData);

          const newData = updateProfileQnAComments(prevArray, data);

          setProfileData(newData);
        }, 1);
        setLoading(false);
      });

      socket.on('hornyMode', data => {
        if (data === false) {
          ToastMessage('Horny mode has ended');
        }
        if (data === true) {
          setHornyModeAnimmationActivated(true);

          setTimeout(() => {
            setHornyModeAnimmationActivated(false);
          }, 2000);
        }

        sethornyMode(data);
        momentData();
      });

      socket.on('nudgeImages', data => {
        setimageQuestonCard(data);
      });
    }

    return () => {
      if (isSocketConnected && socket) {
        socket.off('addPost');
        socket.off('momentsQuiz');
        socket.off('personaliseMismatch');
        socket.off('deleteProfile');
        socket.off('unpairPartner');
        socket.off('hornyMode');
        socket.off('commentsHorny');
        socket.off('commentsQnA');
        socket.off('optionsQnA');

        socket.off('optionsHorny');
        socket.off('momentReactionsV2');
        socket.off('WellBeing');
        socket.off('addStory');
        socket.off('deletePostComment');

        socket.off('addNotes');
        socket.off('editNotes');
        socket.off('deleteNotes');
        socket.off('notesReactions');

        socket.off('deleteQnaReplyComment');
        socket.off('deleteQnaComment');
        socket.off('replyQna');

        socket.off('nudgeImages');
      }
    };
  }, [isSocketConnected, socket]);

  //// DELETE HIGHLIGHT && story reactions
  useEffect(() => {
    const handleDeleteHighlight = async data => {
      // const prevStoryData = await getStateDataAsync(setStories);
      removeStoryAndUpdateHighlights(data.highlightId, data.storyId);
    };

    const handleStoryReaction = async data => {
      let isMine = VARIABLES?.user?._id === data._id;

      if (isMine) {
        const prevStoryData = await getStateDataAsync(setUserStory);
        const newStoryData = updateStoryReactionInArray(
          prevStoryData,
          data,
          true,
        );
        setUserStory(newStoryData);
      } else {
        const prevPartnerStoryData = await getStateDataAsync(setPartnerStory);

        const newPartnerStoryData = updateStoryReactionInArray(
          prevPartnerStoryData,
          data,
          false,
        );
        setPartnerStory(newPartnerStoryData);
      }
    };

    if (isSocketConnected && socket) {
      socket.on('storyReact', data => {
        setLoading(false);
        handleStoryReaction(data);
      });
      socket.on('deleteHighlightStory', data => {
        setLoading(false);
        handleDeleteHighlight(data);
      });
      socket.on('addNewHighlight', data => {
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setStories);
          const updatedStories = updateStoriesWithHighlight(
            prevArray,
            data.highlight,
            data.story,
          );

          setStories(updatedStories);
        }, 1);
      });
    }

    return () => {
      if (isSocketConnected && socket) {
        socket.off('storyReact');
        socket.off('deleteHighlightStory');
        socket.off('addNewHighlight');
      }
    };
  }, [isSocketConnected, socket]);

  const removeStoryAndUpdateHighlights = async (highlightId, storyId) => {
    // Fetch the current state
    const prevStoryData = await getStateDataAsync(setStories);

    // Deep clone the existing data
    const clonedData = JSON.parse(JSON.stringify(prevStoryData));

    // Perform the removal operation
    for (let i = 0; i < clonedData.length; i++) {
      const highlight = clonedData[i];

      if (highlight._id === highlightId) {
        for (let j = 0; j < highlight.stories.length; j++) {
          const story = highlight.stories[j];

          if (story._id === storyId) {
            // Remove the story
            highlight.stories.splice(j, 1);

            // If there are no more stories in the highlight, remove the highlight
            if (highlight.stories.length === 0) {
              clonedData.splice(i, 1);
            }

            // Break out of the loop as we found our match
            break;
          }
        }
      }
    }

    // Update the state using setStories
    setStories(clonedData);
  };

  /// from here move to a new file and export them
  function updateStoryReactionInArray(array, data, isMine) {
    // Clone the array for immutability
    const newArray = [...array];

    // Find the index of the story with the given _id
    const itemIndex = newArray.findIndex(
      item => item.story_id === data.storyId,
    );

    if (itemIndex !== -1) {
      const item = newArray[itemIndex];

      // Find the index of the reaction with the given user id
      const reactionIndex = item.reactions.findIndex(
        r => r.user === data.reaction.user,
      );

      if (reactionIndex !== -1) {
        // User has reacted before, update the reaction
        newArray[itemIndex].reactions[reactionIndex] = data.reaction;
      } else {
        // This is a new reaction from the user, add it to the array
        newArray[itemIndex].reactions.push(data.reaction);
      }
    }

    return newArray;
  }

  const updateProfileQnACommentsHorny = (profileData, data) => {
    // Initialize or copy existing QnA object
    const newQnA = profileData.hornyCard ? { ...profileData.hornyCard } : {};

    // Initialize or copy existing comments array
    newQnA.comments = Array.isArray(newQnA.comments)
      ? [...newQnA.comments]
      : [];

    // Add the new comment if it exists
    if (data.comment) {
      newQnA.comments.push(data.comment);
    }

    // Return the updated profileData
    const updatedProfileData = {
      ...profileData,
      hornyCard: newQnA,
    };

    return updatedProfileData;
  };

  const updateProfileQnAComments = (profileData, data) => {
    // Initialize or copy existing QnA object
    const newQnA = profileData.QnA ? { ...profileData.QnA } : {};

    // Initialize or copy existing comments array
    newQnA.comments = Array.isArray(newQnA.comments)
      ? [...newQnA.comments]
      : [];

    // Add the new comment if it exists
    if (data.comment) {
      newQnA.comments.push(data.comment);
    }

    // Return the updated profileData
    const updatedProfileData = {
      ...profileData,
      QnA: newQnA,
    };

    return updatedProfileData;
  };

  const updateProfileWithQnAHorny = (profileData, data) => {
    const newQnA = { ...profileData.hornyCard };

    if (data.user1) {
      newQnA.user1 = data.user1;
    }

    if (data.user2) {
      newQnA.user2 = data.user2;
    }

    const updatedProfileData = {
      ...profileData,
      hornyCard: newQnA,
    };

    return updatedProfileData;
  };

  const updateProfileWithQnA = (profileData, data) => {
    const newQnA = { ...profileData.QnA };

    if (data.user1) {
      newQnA.user1 = data.user1;
    }

    if (data.user2) {
      newQnA.user2 = data.user2;
    }

    const updatedProfileData = {
      ...profileData,
      QnA: newQnA,
    };

    return updatedProfileData;
  };

  const updateStoriesWithHighlight = (stories, newHighlight, story1) => {
    let isMatchFound = false;

    const updatedStories = stories.map(story => {
      if (story._id === newHighlight._id) {
        isMatchFound = true;
        return {
          ...story,
          stories: [story1, ...story.stories],
        };
      }
      return story;
    });

    if (!isMatchFound) {
      // Add the newHighlight object at the beginning if no match is found
      updatedStories.unshift(newHighlight);
    }

    return updatedStories;
  };

  function updateReactionInArray(array, data) {
    // Clone the array for immutability
    const newArray = [...array];

    // Find the index of the post/note with the given _id
    const itemIndex = newArray.findIndex(
      item => item._id === data.noteId || item._id === data.postId,
    );

    if (itemIndex !== -1) {
      const item = newArray[itemIndex];

      // Find the index of the reaction with the given user id
      const reactionIndex = item.reactions.findIndex(
        r => r.user === data.reaction.user,
      );

      if (reactionIndex !== -1) {
        // User has reacted before, update the reaction
        newArray[itemIndex].reactions[reactionIndex] = data.reaction;
      } else {
        // This is a new reaction from the user, add it to the array
        newArray[itemIndex].reactions.push(data.reaction);
      }
    }

    return newArray;
  }

  //// till here

  const setAddNotesSocket = async data => {
    setLoading(false);
    setUploading(false);
    setFocusedNoteIndex(null);
    const prevArray = await getStateDataAsync(setallNotes);
    const prevArray1 = await getStateDataAsync(setNotes);

    // Filter out objects with type = 'sticky'
    const filteredPrevArray = prevArray.filter(note => note.type !== 'sticky');
    const filteredPrevArray1 = prevArray1.filter(
      note => note.type !== 'sticky',
    );

    // Add new note to the filtered arrays
    setallNotes([data.stickyNotes, ...filteredPrevArray]);
    setNotes([data.stickyNotes, ...filteredPrevArray1]);
  };

  const setMoodsReactionSocket = async data => {
    setLoading(false);

    let prevArray;

    // Determine which state array to use based on userId
    if (data.userId === VARIABLES?.user?._id) {
      prevArray = await getStateDataAsync(setFeelingsCheckArray);
    } else {
      prevArray = await getStateDataAsync(setFeelingsCheckPartnerArray);
    }

    // Destructure the relevant fields from the data
    const { reaction, userId } = data;

    // Clone the state array for immutability
    const newMoodDataArray = [...prevArray];

    // Find the index of the mood with the given momentId
    const moodIndex = newMoodDataArray.findIndex(
      mood => mood._id === data.momentId,
    );

    if (moodIndex !== -1) {
      const mood = newMoodDataArray[moodIndex];

      // Find the index of the reaction with the given user id
      const reactionIndex = mood.reactions.findIndex(r => r.user === data._id);

      if (reactionIndex !== -1) {
        // User has reacted before, update the reaction
        newMoodDataArray[moodIndex].reactions[reactionIndex] = reaction;
      } else {
        // This is a new reaction from the user, add it to the array
        newMoodDataArray[moodIndex].reactions.push(reaction);
      }

      // Update the state using the appropriate state setter
      if (data.userId === VARIABLES?.user?._id) {
        setFeelingsCheckArray(newMoodDataArray);
      } else {
        setFeelingsCheckPartnerArray(newMoodDataArray);
      }
    }
  };

  const setMoodsDataSocket = async data => {
    setLoading(false);
    if (data?.feelingsCheckNew) {
      if (data._id === VARIABLES?.user?._id) {
        const prevArray = await getStateDataAsync(setFeelingsCheckArray);
        setFeelingsCheckArray([data.feelingsCheckNew, ...prevArray]);

        EventRegister.emit('newMoodAdded');
        EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.feelings);
      } else {
        const prevArray = await getStateDataAsync(setFeelingsCheckPartnerArray);
        setFeelingsCheckPartnerArray([data.feelingsCheckNew, ...prevArray]);
      }
    }
  };

  const handleScrollView = ({ nativeEvent }) => {
    const isCloseToBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - 50; // Adjust the threshold value (50) as needed

    // Check if loading is false before calling loadMoreData
    if (isCloseToBottom && !footerLoader) {
      handleLoadMore();
    }
  };

  ///// to handle the expanded arrow

  useEffect(() => {
    const seenStory = EventRegister.addEventListener(
      'seenStoryEmitter',
      data => {
        const updateStorySeenStatus = storyArray => {
          return storyArray.map(story => {
            if (story.story_id === data.storyId) {
              return {
                ...story,
                isSeen: true,
              };
            }
            return story;
          });
        };

        const updateStorySeenStatus1 = storyArray => {
          return storyArray.map(story => {
            if (story.story_id === data.storyId) {
              return {
                ...story,
                isSeen: true,
              };
            }
            return story;
          });
        };

        //   if (data.userId === VARIABLES?.user?._id) {
        // alert('user');
        setUserStory(prevUserStory => {
          const updatedUserStories = updateStorySeenStatus(prevUserStory);

          let userNotStorySeenVal = false;
          updatedUserStories.forEach((s, index) => {
            if (!s.isSeen) {
              userNotStorySeenVal = true;
            }
          });

          setuserStorySeen(userNotStorySeenVal);

          return updatedUserStories;
        });
        // } else {
        //  alert('partner');
        setPartnerStory(prevPartnerStory => {
          const updatedPartnerStories =
            updateStorySeenStatus1(prevPartnerStory);

          let partnerNotStorySeenVal = false;
          updatedPartnerStories.forEach(s => {
            if (!s.isSeen) {
              partnerNotStorySeenVal = true;
            }
          });

          setpartnerStorySeen(partnerNotStorySeenVal);

          return updatedPartnerStories;
        });
        //     }
      },
    );

    return () => {
      EventRegister.removeEventListener(seenStory);
    };
  }, []);

  const setStoriesDataFirstTime = async newData => {
    try {
      // Validate that newData is an array before processing
      if (!Array.isArray(newData)) {
        console.error('Invalid data provided for stories:', newData);
        return; // Exit if newData is not a proper array
      }

      const formattedUserStories = await Promise.all(
        newData.map(async item => {
          // Potentially async operations can be handled here; assuming loadFile() is commented for a reason
          // const storyImage = await loadFile(item); // Uncomment if loadFile needs to be used
          return {
            story_id: item._id,
            story_image: RNFS.DocumentDirectoryPath + `/${item.media}`,
            storyImgPath: `${item.media}`,
            reactions: item.reactions,
            createdAt: item.createdAt,
            isSeen: item.isSeen,
          };
        }),
      );

      // Update state with the formatted stories
      setUserStory(formattedUserStories);
      setIsUserStoryUploaded(formattedUserStories.length > 0);

      // Calculate if there are any stories not seen
      const userNotStorySeenVal = formattedUserStories.some(s => !s.isSeen);
      setuserStorySeen(userNotStorySeenVal);
    } catch (error) {
      console.error('Error processing stories data:', error);
    }
  };

  const setStoriesData = async newData => {
    let localStories = await getStateDataAsync(setUserStory); // Fetch existing local stories


    // Iterate over the newData to find and replace the local stories where isLocal is true
    newData.forEach(newStory => {
      const localStoryIndex = localStories.findIndex(
        local => local.uuid === newStory.uuid && local.isLocal,
      );
      if (localStoryIndex !== -1) {
        // If a matching local story is found, replace it with the new story from newData
        localStories[localStoryIndex] = {
          ...localStories[localStoryIndex], // Keep existing fields
          ...newStory, // Update with new data from the backend
          story_id: newStory._id,
          story_image: RNFS.DocumentDirectoryPath + `/${newStory.media}`,
          storyImgPath: `${newStory.media}`,
          reactions: newStory.reactions,
          createdAt: newStory.createdAt,
          isSeen: newStory.isSeen,
          isLocal: false, // Optionally reset the isLocal flag
        };
      }
    });

    // Update the user story state with the modified localStories array
    setUserStory(localStories);
    if (localStories.length > 0) {
      setIsUserStoryUploaded(true);
    }

    // Determine if there are any unseen stories
    let userNotStorySeenVal = false;
    localStories.forEach(story => {
      if (!story.isSeen) {
        userNotStorySeenVal = true;
      }
    });

    setuserStorySeen(userNotStorySeenVal);
  };

  const setPartnerStoriesData = async newData => {
    const partnerStories = newData || [];

    const formattedPartnerStories = await Promise.all(
      partnerStories.map(async item => {
        return {
          story_id: item._id,
          story_image: await loadFile(item),
          storyImgPath: `${item.media}`,
          reactions: item.reactions,
          createdAt: item.createdAt,
          isSeen: item.partnerSeen,
        };
      }),
    );

    setPartnerStory(formattedPartnerStories);
    if (formattedPartnerStories.length > 0) {
      setIsPartnerStoryUploaded(true);
    }

    let partnerNotStorySeenVal = false;
    partnerStories.forEach(s => {
      if (!s.partnerSeen) {
        partnerNotStorySeenVal = true;
      }
    });

    setpartnerStorySeen(partnerNotStorySeenVal);
  };

  const setUserData = userData => {
    setLoading(false);
    setIsRefreshing(false);

    if (userData?.partnerData?.partner) {
      setOtherUserOnline(userData?.partnerData?.partner?.isOnline);
      setOtherUserLastActive(userData?.partnerData?.partner?.lastOnline);
    }
    if (userData?.personalise) {
      setWeeksTogether(userData.personalise.weeks);
    }

    setProfileData(userData);

    addNudgeArray(userData?.nudges ?? []);

    VARIABLES.disableTouch = !userData?.partnerCodeVerified;
    VARIABLES.user = userData;

    setData('USER', JSON.stringify(userData));

    if (
      userData?.isReported === true &&
      userData?.reportedBy === userData?._id
    ) {
      setReportLogoutModalType('user');
      setReportLogoutModalVisible(true);
    } else if (userData?.isReported === true) {
      setReportLogoutModalType('partner');
      setReportLogoutModalVisible(true);
    }

    // Notification data handling with default values for safety
    const obj = {
      organise: userData?.organizeUnread,
      notification: userData?.notificationsUnread,
      chat: userData?.chatCount,
      nudgeCount: userData?.nudgeCoun,
    };
    updateNotifData(obj);

    handleTimezone(userData);
  };

  const handleTimezone = userData => {
    try {
      const { partnerData, timezone } = userData;
      const partnerTimezone = partnerData?.partner?.timezone;

      const validUserTimezone = timezone && timezone !== '';
      const validPartnerTimezone = partnerTimezone && partnerTimezone !== '';

      if (validPartnerTimezone && validUserTimezone) {
        setTimezone(partnerTimezone !== timezone);

        if (userData.partnerCodeVerified) {
          handleDateTimeComparison(timezone, partnerTimezone);
        }
      } else {
        setTimezone(false);
      }
    } catch (error) {
      console.error('Error in handling timezone:', error);
    }
  };

  const handleDateTimeComparison = (userTimezone, partnerTimezone) => {
    const userDateTime = getCurrentDateTime(userTimezone);
    const partnerDateTime = getCurrentDateTime(partnerTimezone);

    setCloserCurrentDate(userDateTime.date);
    setCloserCurrentTime(userDateTime.time);
    setCloserPartOfDay(userDateTime.partOfDay);

    setCloserPartnerCurrentDate(partnerDateTime.date);
    setCloserPartnerCurrentTime(partnerDateTime.time);
    setCloserPartnerPartOfDay(partnerDateTime.partOfDay);
  };

  const getCurrentDateTime = timezone => {
    const currentTime = moment().tz(timezone);

    const hour = currentTime.hour(); // This gives the hour of the day (0-23)

    let partOfDay;
    if (hour >= 6 && hour < 16) {
      partOfDay = 'morning';
    } else if (hour >= 16 && hour < 20) {
      partOfDay = 'evening';
    } else {
      partOfDay = 'night';
    }
    const formattedTime = currentTime.format('hh:mm');
    const formattedDate = currentTime.format('DD MMM');

    return {
      time: `${formattedTime}`,
      date: formattedDate,
      partOfDay: partOfDay,
      timezone: '', // Including a more readable timezone
    };
  };

  useEffect(() => {
    const addPostSuccess = EventRegister.addEventListener(
      'addPostSuccess',
      data => {
        scrollref1.current?.scrollToPosition?.(
          0,
          dataSourceCords[MOMENT_KEY.highlight],
        );

        setTimeout(() => {
          if (closerJourney?.feed !== true) {
            setcloserJourney({ ...closerJourney, feed: true });
          }
        }, 500);
      },
    );

    return () => {
      EventRegister.removeEventListener(addPostSuccess);
    };
  }, [closerJourney]);

  useEffect(() => {
    EventRegister.on('addQnACard', data => {
      let newProfileData = cloneDeep(profileData);
      newProfileData.QnA = data;
      setProfileData(newProfileData);
    });
  }, []);

  useEffect(() => {
    if (
      appStateGlobal === 'active' &&
      activeTab === 'moments' &&
      isStoryUploaded === false
    ) {
      onRefreshMomemts();
    }
  }, [appStateGlobal, activeTab, isStoryUploaded]);

  const handleSheetEmojiChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      let tabs = [...icontabs];
      tabs[0].selected = true;
      tabs[1].selected = false;
      setIconTabs(tabs);
    }
  }, []);

  const SendReactionHandler = (reaction, type, id, reactionDataNotes) => {
    CleverTap.recordEvent('Reactions on stickies');
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (reaction.type !== undefined) {
      if (
        reaction.type === 'sticker' ||
        reaction.type === 'emoji' ||
        reaction.type === 'post'
      ) {
        let params = {
          id: reactionData.id,
          type: reactionData.type,
          reactionNew: id?.toString(),
          reaction: reaction,
          reactionType: type,
        };

        setLoading(true);
        dispatch(AddReaction(params));
      } else if (reactionData.type === 'feelings') {
        addReactionFeelings(reaction, type);
      } else if (
        reactionData.type === 'message' ||
        reactionData.type === 'audio'
      ) {
        addReactionToStickyNote(reaction, type);
      } else if (reactionData.type === 'comment') {
        sendCommentReaction(reaction, type);
        // SendPostReactionHandler(reaction, type)
      }
    } else {
      if (
        reactionDataNotes.type === 'message' ||
        reactionDataNotes.type === 'audio'
      ) {
        addReactionToStickyNote(reaction, id, type, reactionDataNotes);
      } else if (type === 'sticker' || type === 'emoji' || type === 'post') {
        let params = {
          id: reactionDataNotes !== '' ? reactionDataNotes.id : reactionData.id,
          type:
            reactionDataNotes !== ''
              ? reactionDataNotes.type
              : reactionData.type,
          reaction: reaction,
          reactionType: type,
          reactionNew: id?.toString(),
        };

        setLoading(true);
        dispatch(AddReaction(params));
      } else if (reactionData.type === 'feelings') {
        alert('feelings');
        addReactionFeelings(reaction, type);
      } else if (reactionData.type === 'comment') {
        alert('comment');
        sendCommentReaction(reaction, type);
        // SendPostReactionHandler(reaction, type)
      }
    }
  };

  const sendCommentReaction = async (reaction, type) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    try {
      const resp = await API('user/moments/reaction', 'POST', {
        type: 'comment',
        reactionType: type,
        reaction,
        id: reactionData.id,
      });
      if (resp.body.statusCode === 200) {
      }
    } catch (error) {
      console.log('send comment error', error);
    }
  };

  const addReactionToStickyNote = async (reaction, id, type, reactionData) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    setLoading(true);
    try {
      let payload = {
        reaction: reaction,
        reactionNew: id?.toString(),
        noteId: reactionData._id,
        type: type,
      };
      const resp = await API('user/moments/stickyReaction', 'POST', payload);
      setLoading(false);
      if (resp.body.statusCode === 200) {
        setTimeout(async () => {
          setLoading(false);
          const prevNotes = await getStateDataAsync(setNotes);
          const newNotes = updateReactionInArray(prevNotes, resp.body.data);
          setNotes(newNotes);

          const prevAllNotes = await getStateDataAsync(setallNotes);
          const newAllNotes = updateReactionInArray(
            prevAllNotes,
            resp.body.data,
          );
          setallNotes(newAllNotes);
        }, 1);
      }
    } catch (error) {
      setLoading(false);

      console.log(error);
      // alert('Something went wrong');
    }
  };

  const setFunctionForUserFeelingsCheck = data => {
    try {
      // Check if data is not undefined and is an array
      if (!Array.isArray(data)) {
        console.error('Invalid data provided for feelings check:', data);
        return; // Exit the function if data is not an array
      }

      // Map the data to add an 'isExpanded' property set to false
      const newData = data.map(d => ({
        ...d,
        isExpanded: false, // Ensuring each item has 'isExpanded' set for UI toggling
      }));

      // Update the state with the new data
      setFeelingsCheckArray(newData);
    } catch (error) {
      console.error('Error in setting feelings check data:', error);
    }
  };

  const addReactionFeelings = async (reaction, type) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    try {
      let payload = {
        reaction: reaction,
        id: reactionData.id,
        type: type,
      };
      const resp = await API('user/moments/feelingsCheckV2', 'POST', payload);
      if (resp?.body?.statusCode === 200) {
        setMoodsReactionSocket(resp.body.data);

        // if (resp.body.data._id === VARIABLES?.user?._id) {
        //   setFunctionForUserFeelingsCheck(resp.body.data.feelingsCheck);
        // } else {
        //   console.log(JSON.stringify(resp.body.data?.feelingsCheck), 'dsfvghj');
        //   setFeelingsCheckPartnerArray(resp.body.data?.feelingsCheck || []);
        // }
      } else {
        setLoading(false);
        ToastMessage(resp?.body?.Message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      // alert('Something went wrong');
    }
  };

  const addAudioNote = async (uri, time) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    try {
      setLoading(true);
      setFocusedNoteIndex(null);
      const resp = await API('user/moments/notes', 'POST', {
        type: 'audio',
        text: uri,
        recordTime: time,
      });
      setLoading(false);
      if (resp.body.statusCode === 200) {
        if (closerJourney?.sticky !== true) {
          setcloserJourney({ ...closerJourney, sticky: true });
        }

        setAddNotesSocket(resp.body.data);
        CleverTap.recordEvent('Total stickies');
        CleverTap.recordEvent('Audio sticky added');
      }
    } catch (error) {
      setLoading(false);
      console.log('eroror');
    }
  };

  const addNewNote = async () => {
    if (!notes[focusedNoteIndex]?.input?.trim().length) {
      ToastMessage('Please enter some text to add a note.');
      // alert(notes[focusedNoteIndex]?.input?.length);
      return;
    }
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    try {
      setLoading(true);
      setFocusedNoteIndex(null);
      const resp = await API('user/moments/notes', 'POST', {
        type: 'message',
        text: notes[focusedNoteIndex]?.input,
      });

      setLoading(false);
      if (resp.body.statusCode === 200) {
        if (closerJourney?.sticky !== true) {
          setcloserJourney({ ...closerJourney, sticky: true });
        }

        setAddNotesSocket(resp.body.data);
        CleverTap.recordEvent('Total stickies');
        CleverTap.recordEvent('Textual sticky added');
        const checkInAppReview = await checkContextualTooltip(
          'inAppReviewShown',
        );
        if (checkInAppReview === '0') {
          await updateContextualTooltipState('inAppReviewShown', '1');
        } else if (checkInAppReview === '1') {
          EventRegister.emit('inAppReviewShown');
          await updateContextualTooltipState('inAppReviewShown', '2');
        }
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
      // alert('Something went wrong');
    }
  };

  /// move to a utils file
  // async function requestUserPermission() {
  //   // Request permissions
  //   if (Platform.OS === 'android') {
  //     await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //     );
  //   }

  //   // Request Firebase messaging permission
  //   await messaging().requestPermission();
  // }

  useEffect(() => {
    requestUserPermission();
  }, []);

  async function requestUserPermission() {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } else if (Platform.OS === 'ios') {
        // Then request permission
        const authStatus = await messaging().requestPermission();

        return authStatus;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      setcurrentAudioPlayingIndex(-1);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.reducer.case === actions.GET_FEELINGS_CHECK_SUCCESS) {
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_FEELINGS_CHECK_FAILURE) {
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_FEELINGS_CHECK_SUCCESS) {
      setMoodsDataSocket(state.reducer.feelingsCheck);
      setLoading(false);
      dispatch(ClearAction());
      if (closerJourney?.wellbeing !== true) {
        setcloserJourney({ ...closerJourney, wellbeing: true });
      }
    } else if (state.reducer.case === actions.ADD_FEELINGS_CHECK_FAILURE) {
      setLoading(false);
      console.log('ERROR-FAILURE feelings', state);

      ToastMessage(state.reducer.message);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_POST_SUCCESS) {
      setLoading(false);
    }
  }, [state, closerJourney]);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('transitionStart', () => {
      Keyboard.dismiss();
    });

    return unsubscribe;
  }, [props.navigation]);

  const addComment = async () => {
    if (askPartnerInput.trim() === '') {
      return;
    }
    //  Keyboard.dismiss();
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    let payload = {
      comment: askPartnerInput.trim(),
      type: hornyMode ? 'Horny' : 'QnA',
    };

    setLoading(true);
    /// setUploading(true);

    try {
      const resp = await API('user/moments/QnA', 'POST', payload);

      console.log('*****************************');

      if (resp.body.statusCode === 200) {
        if (hornyMode) {
          CleverTap.recordEvent('Hm Quiz answered: open ended');
          CleverTap.recordEvent('Hm quiz cards answered');
        } else {
          CleverTap.recordEvent('Quiz cards answered');
          CleverTap.recordEvent('Quiz answered: open ended');
        }
        setTimeout(async () => {
          const prevArray = await getStateDataAsync(setProfileData);
          let newData;
          if (resp.body.data?.type === 'Horny') {
            newData = updateProfileQnACommentsHorny(prevArray, resp.body.data);
          } else {
            newData = updateProfileQnAComments(prevArray, resp.body.data);
          }

          setProfileData(newData);
        }, 1);

        setAskPartnerInput('');
        setLoading(false);
        /// setUploading(false);
      } else {
        setLoading(false);
        ///  setUploading(false);
      }
    } catch (error) {
      setLoading(false);
      ///  setUploading(false);
      console.log(error);
    }
  };

  const UploadStoriesHandler = async (imageSet, type, captionAdded) => {
    if (netInfo.isConnected === false) {
      setStoryImageUploading(finalPropsSelectorFactory);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    const item = imageSet[0];
    // let stories = [];
    // imageSet.map(async (item, index) => {
    const id = generateID();
    const filename = id + item.substring(item.lastIndexOf('/') + 1);
    const path = await CompressedImage.compress(item);

    setuserStorySeen(true);
    setUserStory(story => [
      {
        story_id: '',
        story_image: path,
        storyImgPath: ``,
        reactions: [],
        createdAt: null,
        isSeen: false,
        isLocal: true,
        uuid: id,
      },
      ...story,
    ]);

    scrollref1.current?.scrollToPosition?.(
      0,
      dataSourceCords[MOMENT_KEY.stories],
    );

    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(path, localFilePath);
    } catch (error) {
      console.log('Error saving image:', error);
    }

    //    StoreLocalImage(path, filename, 'CloserStories'); // storing locally by creating directory

    try {
      const s3response = await uploadEncryptedToS3(
        path,
        filename,
        'image/jpeg',
        'stories',
      );

      setUploading(false);
      let params = {
        stories: [
          {
            media: filename,
            type: 'image',
            duration: 0,
            nonce: s3response.nonce,
            uuid: id,
          },
        ],
      };

      setStoryImageUploading(true);
      try {
        const resp = await API('user/moments/stories', 'POST', params);
        if (closerJourney?.story !== true) {
          setcloserJourney({ ...closerJourney, story: true });
        }

        if (resp.body.statusCode === 200) {
          CleverTap.recordEvent(`Stories photo ${type}`);
          CleverTap.recordEvent('Stories added');
          if (captionAdded) {
            CleverTap.recordEvent('Stories caption added');
          }

          setStoryImageUploading(false);
          setLoading(false);
          setStoriesDataSocket(resp.body.data);
          setIsStoryUploaded(false);

          const checkInAppReview = await checkContextualTooltip(
            'inAppReviewShown',
          );

          if (checkInAppReview === '0') {
            await updateContextualTooltipState('inAppReviewShown', '1');
          } else if (checkInAppReview === '1') {
            EventRegister.emit('inAppReviewShown');
            await updateContextualTooltipState('inAppReviewShown', '2');
          }
        }
      } catch (error) {
        setIsStoryUploaded(false);
        setStoryImageUploading(false);
        console.log('add story error', error.response);
      }
    } catch (error) {
      setLoading(false);
      setUploading(false);
      //   setStoryImageUploading(false);
      ToastMessage("Sorry story couldn't upload to server due to some error.");
    } finally {
      setLoading(false);
      setUploading(false);
      setStoryImageUploading(false);
      setIsStoryUploaded(false);
    }
    //   });
  };

  const handleGalleryPicker = type => {
    // setGalleryAndCameraModal(false)
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      // cropping: true,
      multiple: false,
      mediaType: 'photo',
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
      //   smartAlbums: ['Favorites'],

      //  compressImageQuality: 0.7,
    })
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        setGalleryAndCameraModal(false);
        if (pickerType === 'feed') {
          setPickerType('user');
          props.navigation.navigate('addFeed', {
            imageObject1: image,
            imageURI: image.path,
            //  posts: postData,
            //   onGoBack: handleDataPost,
          });
        } else {
          const options = {
            path:
              Platform.OS === 'android' ? image.path : `file://${image.path}`,
          };
          setIsStoryUploaded(true);
          setTimeout(async () => {
            props.navigation.navigate('TextOverlayStory', {
              imageUri: options,
              photoAdded: 'gallery',
              onGoBack: handleData,
            });
          }, 50);
        }
        // uploadToS3(image.path, filename, image.mime)
      })
      .catch(error => {
        VARIABLES.isMediaOpen = false;
      });
  };

  function handleData(result, type, captionAdded) {
    setStoryImageUploading(true);
    UploadStoriesHandler([result], type, captionAdded);
    setIsUserStoryUploaded(true);
  }

  const handleCameraPicker = () => {
    // setModalVisible(false)
    // setGalleryAndCameraModal(false)
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      // cropping: true,
      multiple: false,
      mediaType: 'photo',
      compressImageQuality: 1,
    })
      .then(image => {
        VARIABLES.isMediaOpen = false;
        setGalleryAndCameraModal(false);

        if (pickerType === 'feed') {
          setPickerType('user');
          props.navigation.navigate('addFeed', {
            imageURI: image.path,
            //  posts: postData,
            //  onGoBack: handleDataPost,
          });
        } else {
          const options = {
            path:
              Platform.OS === 'android' ? image.path : `file://${image.path}`,
          };
          setIsStoryUploaded(true);
          setTimeout(async () => {
            props.navigation.navigate('TextOverlayStory', {
              imageUri: options,
              photoAdded: 'camera',
              onGoBack: handleData,
            });
          }, 50);
        }
      })

      .catch(err => {
        VARIABLES.isMediaOpen = false;
      });
  };
  const copyToClipboard = () => {
    const message = `Hey, I just downloaded Closer - a new place for love! You can download the app here: https://bit.ly/4eHUlJ7 and use ${VARIABLES?.user?.partnerData?.code} as the pairing code.`;
    Share.share({
      message: message,
    });

    // Clipboard.setString(profileData?.partnerData?.code);
    // ToastMessage('Pairing code copied');
  };

  const CodeRegisteration = () => {
    return (
      <ImageBackground
        source={APP_IMAGE.cardOne}
        style={{
          height: scaleNew(195),
          paddingHorizontal: scale(54),
          paddingVertical: scale(18),
          marginHorizontal: scale(16),
          //  marginBottom: scale(14),
          marginTop: scale(20),
          alignItems: 'center',
        }}
        borderRadius={20}>
        <Text
          style={{
            fontFamily: fonts.standardFont,
            color: colors.text,
            textAlign: 'center',
            lineHeight: scale(26),
            fontSize: scale(18),
          }}>
          {APP_STRING.codeLabelOne}
        </Text>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#CEEAFD',
            paddingVertical: scale(4),
            paddingHorizontal: scale(20),
            borderRadius: scale(5),
            marginVertical: scale(23),
          }}
          onPress={copyToClipboard}>
          <Text
            style={{
              fontFamily: fonts.regularFont,
              color: colors.text,
              lineHeight: scale(31),
              fontSize: scale(18),
              marginRight: scale(6),
              includeFontPadding: false,
            }}>
            {profileData?.partnerData?.code}
          </Text>
          <Pressable onPress={copyToClipboard} hitSlop={20}>
            <Image
              style={{
                tintColor: colors.black,
                width: scaleNew(20),
                height: scaleNew(20),
                resizeMode: 'contain',

                marginTop: scaleNew(-3),
              }}
              source={require('../../../assets/images/screenshotQuiz.png')}
            />
            {/* <CopyIconSvg /> */}
          </Pressable>
        </Pressable>

        <Pressable
          onPress={() => props.navigation.navigate('pairingCode')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: scale(4),
          }}>
          <Text
            style={{
              ...globalStyles.regularLargeText,
              color: colors.blue1,
              textDecorationLine: 'underline',
              lineHeight: scale(20),
            }}>
            Already have a code? Enter here
          </Text>
        </Pressable>
      </ImageBackground>
    );
  };

  const scrollHandler = async key => {
    if (key === MOMENT_KEY.imageCard) {
      scrollref.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.imageCard],
      );
      scrollref1.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.imageCard],
      );
      VARIABLES.momentsNavigationKey = '';
      return;
    }

    if (key === MOMENT_KEY.quotedCard) {
      scrollref.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.quotedCard],
      );
      scrollref1.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.quotedCard],
      );
      VARIABLES.momentsNavigationKey = '';
      return;
    }
    if (key === MOMENT_KEY.quiz) {
      scrollref.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.highlight] - verticalScale(400),
      );
      scrollref1.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.highlight] - verticalScale(400),
      );
      VARIABLES.momentsNavigationKey = '';
      return;
    }
    if (key === MOMENT_KEY.feelings) {
      scrollref.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.feelings] + scale(300),
      );
      scrollref1.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.feelings] + scale(300),
      );
      // scrollref.current?.scrollToPosition?.(
      //   0,
      //   dataSourceCords[MOMENT_KEY.feelings] - verticalScale(100),
      // );
      VARIABLES.momentsNavigationKey = '';
      return;
    }

    if (key === MOMENT_KEY.highlight) {
      scrollref.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.highlight],
      );
      scrollref1.current?.scrollToPosition?.(
        0,
        dataSourceCords[MOMENT_KEY.highlight],
      );
      // scrollref.current?.scrollToPosition?.(
      //   0,
      //   dataSourceCords[MOMENT_KEY.feelings] - verticalScale(100),
      // );
      VARIABLES.momentsNavigationKey = '';
      return;
    }
    scrollref.current?.scrollToPosition?.(0, dataSourceCords[key]);
    scrollref1.current?.scrollToPosition?.(0, dataSourceCords[key]);
    VARIABLES.momentsNavigationKey = '';
  };

  const FeelingsCheck = () => {
    return (
      <View
        style={{
          zIndex: 100,
        }}>
        <WellBeingCard
          loading={loading}
          setLoading={setLoading}
          setMoodsReactionSocket={setMoodsReactionSocket}
          setMoodsDataSocket={setMoodsDataSocket}
          setFeelingsCheckArray={setFeelingsCheckArray}
          setFeelingsCheckPartnerArray={setFeelingsCheckPartnerArray}
          feelingsCheckPartnerArray={feelingsCheckPartnerArray}
          feelingsCheckArray={feelingsCheckArray}
          profileData={profileData}
          onDismissCard={() => { }}
          onPressFeelingsCard={() => { }}
          onLayout={event => {
            const layout = event.nativeEvent.layout;
            dataSourceCords[MOMENT_KEY.feelings] = layout.y; // we store this offset values in an array
          }}
        />
        {/* <MoodCardMoreCardTooltip /> */}
        {/* <MoodCardExpandTooltip /> */}
      </View>
    );
  };

  const renderFeedItem = ({ item, index }) => {
    return (
      <View key={item.id || index}> {/* Ensure a unique key */}
        <FeedCardGrid
          index={index}
          onPressCard={() => {
            props.navigation.navigate('YourFeed', {
              postData,
              index,
            });
          }}
          item={item}
        />
      </View>
    );
  };

  const storyItem = ({ item, index }) => {
    return (
      <Pressable
        key={item._id || index}
        style={{ alignItems: 'center', marginHorizontal: scale(8) }}
        onPress={() => {
          const path = RNFS.DocumentDirectoryPath;
          const stories = item.stories.map(s => {
            const isUserStory = s.user === VARIABLES.user?._id;
            return {
              story_image: `${path}/${s.media}`,
              storyImgPath: `${s.media}`,
              profileName: isUserStory
                ? VARIABLES.user?.name
                : VARIABLES.user?.partnerData?.partner?.name,
              profileImage: isUserStory
                ? VARIABLES.user?.profilePic
                : VARIABLES.user?.partnerData?.partner?.profilePic,
              reactions: s.reactions,
              highlight_id: item._id,
              story_id: s._id,
              createdAt: s.createdAt,
            };
          });
          if (stories.length > 0) {
            props.navigation.navigate('story', {
              story: { title: item.title },
              storyBundle: [
                {
                  user_id: VARIABLES.user?.partnerData?.partner?._id,
                  user_name: VARIABLES.user?.partnerData?.partner?.name,
                  user_image: VARIABLES.user?.partnerData?.partner?.profilePic,
                  stories: stories,
                },
              ],
              type: 'highlight',
              highlightTitle: item.title,
              storyPressIndex: 0,
            });
          } else {
            ToastMessage('Story not present yet.');
          }
        }}>
        <CircularProgressBase
          value={100}
          radius={scale(42)}
          activeStrokeColor={'#124698'}
          activeStrokeSecondaryColor={'#F3BACA'}
          duration={1000}
          activeStrokeWidth={scale(2)}
          inActiveStrokeWidth={scale(2)}>
          {item?.stories ? (
            <Highlightcomponent
              name={item?.stories[item?.stories?.length - 1]?.media}
              styles={styles}
              uri={`${AWS_URL_S3}production/stories/${item?.stories[item?.stories?.length - 1]?.media}`}
            />
          ) : (
            <Image source={APP_IMAGE.profileAvatar} style={styles.userPic} />
          )}
        </CircularProgressBase>
        <Text style={{ ...globalStyles.regularLargeText, marginTop: scale(6) }}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  // Debounce function
  function debounce(func, wait) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Debounced version of your specific logic
  const handleFocusedNoteIndex = debounce(data => {
    if (data === '') {
      setFocusedNoteIndex(null);
    } else {
      setFocusedNoteIndex(0);
    }
  }, 1000); // Adjust the delay as needed

  const NotesContainer = () => {
    return (
      <NotesComp
        key={notes.length}
        ref={notesCompRef}
        setUploading={() => setUploading(true)}
        SendReactionHandler={(name, type, id, reactionData) => {
          SendReactionHandler(name, type, id, reactionData);
        }}
        addNewNote={() => addNewNote()}
        setReactionData={data => setReactionData(data)}
        addAudioNote={(uri, time) => {
          addAudioNote(uri, time);
        }}
        //  handlePresentModalNotePress={handlePresentModalNotePress}
        currentAudioPlayingIndex={currentAudioPlayingIndex}
        setcurrentAudioPlayingIndex={setcurrentAudioPlayingIndex}
        notes={notes}
        setNotes={data => setNotes(data)}
        focusedNoteIndex={focusedNoteIndex}
        setFocusedNoteIndex={data => handleFocusedNoteIndex(data)}
        navigation={props.navigation}
        allNotes={allNotes}
        onLayout={event => {
          const layout = event.nativeEvent.layout;
          dataSourceCords[MOMENT_KEY.notes] = layout.y; // we store this offset values in an array
        }}
      />
    );
  };

  const FeedEmptyState = React.memo(({ onSelectImages }) => {
    return (
      <View
        style={{
          backgroundColor: 'rgba(237, 237, 237, 0.42)',
          padding: scaleNew(10),
          borderRadius: scaleNew(16),
          alignSelf: 'center',
          marginTop: scaleNew(10),
          paddingBottom: scaleNew(55),
          paddingTop: scaleNew(24),
          flex: 1,
          width: scaleNew(350),
        }}>
        <Image
          style={{
            width: scaleNew(293),
            height: scaleNew(204),

            alignSelf: 'center',
          }}
          source={require('../../../assets/images/feedEmpty.png')}
        />

        <Text
          style={{
            fontSize: scaleNew(16),
            color: '#808491',
            marginTop: scaleNew(20),
            fontFamily: fonts.standardFont,
            textAlign: 'center',
          }}>
          A new home for photos from blurry{`\n`}nights and sunset drives! ✨
        </Text>

        <AppButton
          onPress={() => {
            onSelectImages();
          }}
          textStyle={{
            fontSize: scaleNew(14),
          }}
          style={{
            marginTop: scaleNew(22),
            marginHorizontal: scaleNew(64),
            borderRadius: scaleNew(100),
            height: scaleNew(44),
            paddingVertical: 0,
          }}
          text="Add your first memory"
        />
      </View>
    );
  });

  ////  below functions related to poke api call and animations
  let apiCallPromise = null;
  let animationPromise = null;

  const startPokeAnimation = () => {
    return new Promise(resolve => {
      // Reset values
      progress.value = 0;
      scaleAnim.value = 1;

      // Scale up the emoji
      scaleAnim.value = withTiming(2, { duration: 200 });

      // After a delay, start the movement animation
      setTimeout(() => {
        progress.value = withTiming(
          1,
          {
            duration: 1300,
            easing: customEasing,
          },
          finished => {
            if (finished) {
              runOnJS(setShowPokeAnimation)(false);
              //   runOnJS(animateEmojiSelector)();
              runOnJS(resolve)();
            }
          },
        );
        // Call animateEmojiSelector 100ms before the animation ends
        setTimeout(() => {
          runOnJS(animateEmojiSelector)();
        }, 1000); // 1300 - 100 = 1200
      }, 200);
    });
  };

  const customEasing = t => {
    'worklet';
    if (t < 0.5) {
      // First half: slower (ease-out)
      return 4 * t * t * t;
    } else {
      // Second half: faster (ease-in)
      return 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  };
  const makeApiCall = async data => {
    try {
      const resp = await API('user/moments/nudge', 'POST', data);
      return resp.body.statusCode === 200;
    } catch (error) {
      console.log('error on poke', error.response);
      return false;
    }
  };

  const showToastIfBothSuccessful = async () => {
    const [apiSuccess, _] = await Promise.all([
      apiCallPromise,
      animationPromise,
    ]);
    if (apiSuccess) {
      ToastMessageBottom('Poke sent');

      const checkInAppReview = await checkContextualTooltip('inAppReviewShown');

      if (checkInAppReview === '0') {
        await updateContextualTooltipState('inAppReviewShown', '1');
      } else if (checkInAppReview === '1') {
        EventRegister.emit('inAppReviewShown');
        await updateContextualTooltipState('inAppReviewShown', '2');
      }
    }
  };

  const onPoke = async data => {
    setPokeEmoji(data.emoji);
    setShowPokeAnimation(true);

    apiCallPromise = makeApiCall(data);
    animationPromise = startPokeAnimation();

    showToastIfBothSuccessful();
  };

  const emojiStyle = useAnimatedStyle(() => {
    const moveScale = interpolate(
      progress.value,
      [0, 0.2, 0.9, 1], // Added a new keyframe at 0.9
      [scaleAnim.value, scaleAnim.value, 0.4, 0], // Scale to 0 at the end
      Extrapolate.CLAMP,
    );

    const translateX = progress.value * (width - 80 - (width / 2 - 20));
    const translateY =
      progress.value *
      progress.value *
      (height - scaleValue - (height / 2 - 20)) +
      progress.value * (1 - progress.value) * -100;

    return {
      transform: [{ translateX }, { translateY }, { scale: moveScale }],
      opacity: interpolate(
        progress.value,
        [0, 0.95, 1], // Start fading out at 0.9
        [1, 1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  // Add this function to animate the EmojiSelector
  const animateEmojiSelector = () => {
    emojiSelectorScale.value = withSequence(
      withTiming(1.2, { duration: 200 }), // Scale up to 80/60 = 1.33
      withDelay(1, withTiming(1, { duration: 200 })), // Wait for 700ms, then scale back to normal
    );
  };

  const emojiSelectorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: emojiSelectorScale.value }],
    };
  });



  useEffect(() => {
    const refreshMomemtsListener = EventRegister.addEventListener(
      'refreshMomemts',
      data => {
        momentData();
      },
    );

    return () => {
      EventRegister.removeEventListener(refreshMomemtsListener);
    };
  }, []);

  useEffect(() => {
    const QnARefreshListener = EventRegister.addEventListener(
      'QnARefresh',
      data => {
        setLoading(true);
        getUserProfileHandler();
      },
    );

    const deactivateListner = EventRegister.addEventListener(
      'deactivated',
      data => {
        console.log('deactivated-data', data);
        setDeactivateModalVisible(true);
        getUserProfileHandler();
      },
    );

    return () => {
      EventRegister.removeEventListener(QnARefreshListener);
      EventRegister.removeEventListener(deactivateListner);
      ///   EventRegister.removeEventListener(partnerPairedListner);
    };
  }, []);

  const onPressContinue = () => {
    setDeactivateModalVisible(false);
    // ToastMessage('continue')
  };

  const onPressDeactivate = () => {
    setDeactivateModalVisible(false);

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(Deactivate());
  };

  const getUserProfileHandler = () => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    dispatch(GetUserProfile());
  };

  const loadFile = async item => {
    const path = RNFS.DocumentDirectoryPath + `/${item.media}`;

    return RNFS.exists(path)
      .then(async exists => {
        if (exists) {
          // setImage('file://'+path);
          return `file://${path}`;
        } else {
          try {
            const nonce = naclUtil.decodeBase64(item.nonce);
            let data = await downloadAndDecryptFromS3(
              item.media,
              'stories',
              nonce,
              progress => {
                // Optionally handle progress updates
                // updateProgressInDB(newData.posts[0]._id, progress);
              },
            );

            const data2 = 'file://' + RNFS.DocumentDirectoryPath + `/${data}`;

            return data2;
            // Assuming `data` is the decrypted file content
          } catch (error) {
            console.error('Error downloading and decrypting file:', error);
            // Handle error or set a default image
          }
        }
      })
      .catch(err => {
        console.log('eroor', err);
      });
  };

  const stateHandler = async () => {
    // console.log('user-profile=data', state);
    if (state.reducer.case === actions.GET_USER_PROFILE_SUCCESS) {
      // setTimeout(() => {
      //   setinitialApi(false);
      // }, 3000);
      setLoading(false);
      setIsRefreshing(false);
      // console.log('get user data moments', JSON.stringify(state.userData));
      setProfileData(state.reducer.userData);

      VARIABLES.disableTouch = !state.reducer.userData?.partnerCodeVerified;

      VARIABLES.user = state.reducer.userData;
      setData('USER', JSON.stringify(state.reducer.userData));

      let obj = {
        organise: state.reducer?.userData?.organizeUnread,
        notification: state.reducer?.userData?.notificationsUnread,
        chat: state.reducer?.userData?.chatCount,
        nudgeCount: state.reducer?.userData.nudgeCount,
      };

      updateNotifData(obj);

      if (
        state.reducer?.userData?.partnerData?.partner?.timezone !== undefined &&
        state.reducer?.userData?.partnerData?.partner?.timezone !== '' &&
        state.reducer?.userData?.partnerData?.partner?.timezone !== null &&
        state.reducer?.userData?.timezone !== undefined &&
        state.reducer?.userData?.timezone !== '' &&
        state.reducer?.userData?.timezone !== null
      ) {
        if (
          state.reducer?.userData?.partnerData?.partner?.timezone !==
          state.reducer?.userData?.timezone
        ) {
          setTimezone(true);
        } else {
          setTimezone(false);
        }
      }

      const userDateTime = getCurrentDateTime(
        state.reducer?.userData?.timezone,
      );
      setCloserCurrentDate(userDateTime.date);
      setCloserCurrentTime(userDateTime.time);
      setCloserPartOfDay(userDateTime.partOfDay);

      const partnerDateTime = getCurrentDateTime(
        state.reducer?.userData?.partnerData?.partner?.timezone,
      );
      setCloserPartnerCurrentDate(partnerDateTime.date);
      setCloserPartnerCurrentTime(partnerDateTime.time);
      setCloserPartnerPartOfDay(partnerDateTime.partOfDay);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_USER_PROFILE_FAILURE) {
      setLoading(false);
      setIsRefreshing(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ENABLE_BIOMETRIC_SUCCESS) {
      setLoading(false);
      setData('PUBLIC_KEY', JSON.stringify(state?.status?.publicKey));

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ENABLE_BIOMETRIC_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DEACTIVATE_SUCCESS) {
      setLoading(false);
      props.navigation.replace('Auth');
      VARIABLES.user = null;
      VARIABLES.token = null;
      await removeData('TOKEN'), await removeData('USER');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DEACTIVATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.BACKUP_SUCCESS) {
      setLoading(false);
      ToastMessage('Data backed up successfully');
      VARIABLES.user = state.reducer.userData;
      setData('USER', JSON.stringify(state.reducer.userData));
      // props.navigation.navigate('addProfilePic')
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.BACKUP_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.PARTNER_CODE_SUCCESS) {
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.PARTNER_CODE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_POST_SUCCESS) {
      //  setDeletePostDataSocket(state.post);
      setLoading(false);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_POST_FAILURE) {
      console.log('ERROR-FAILURE', state);

      setLoading(false);
      ToastMessage(state.reducer.message);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_COMMENT_FAILURE) {
      console.log('ERROR-FAILURE', state);

      setLoading(false);
      ToastMessage(state.reducer.message);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_COMMENT_FAILURE) {
      console.log('ERROR-FAILURE', state);

      setLoading(false);
      ToastMessage(state.reducer.message);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_REACTION_FAILURE) {
      console.log('ERROR-FAILURE reaction', state);
      setLoading(false);
      setReactionData('');
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_ANSWER_QA_SUCCESS) {
      setTimeout(async () => {
        console.log('state answer qna', state.reducer.answerQa);
        const prevArray = await getStateDataAsync(setProfileData);
        let newData;
        if (state.reducer.answerQa?.type === 'Horny') {
          newData = updateProfileWithQnAHorny(
            prevArray,
            state.reducer.answerQa,
          );
        } else {
          newData = updateProfileWithQnA(prevArray, state.reducer.answerQa);
        }

        setProfileData(newData);
        setLoading(false);
      }, 1);

      CleverTap.recordEvent('Quiz cards answered');
    } else if (state.reducer.case === actions.ADD_ANSWER_QA_FAILURE) {
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_SPECIAL_EVENT_SUCCESS) {
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_SPECIAL_EVENT_FAILURE) {
      setIsRefreshing(false);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.REMOVE_SINGLE_HIGHLIGHT_SUCCESS) {
      setIsRefreshing(false);
      setLoading(false);
      ///   getHighlights();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.REMOVE_SINGLE_HIGHLIGHT_FAILURE) {
      setIsRefreshing(false);
      console.log('ERROR-FAILURE', state);

      setLoading(false);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_HIGHLIGHT_SUCCESS) {
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.CREATE_NEW_HIGHLIGHTS_SUCCESS) {
      /// setStories(state.status);
      dispatch(ClearAction());
    }
  };

  const onSelectImages = async () => {
    if (toolTipCurrentState === 3) {
      return;
    }
    if (VARIABLES.disableTouch) {
      ToastMessage('Please add a partner to continue');
      return;
    }

    try {
      const options = {
        mediaType: 'photo',
        selectionLimit: 8,
        includeExtra: true,
      };

      const res = await launchImageLibrary(options);

      // Navigate with the image data
      props.navigation.navigate('addFeed', {
        imageURI: res.assets.slice(0, 8).map(image => {
          // Limiting the map function to process at most 8 images
          return {
            path: image.uri, // Assuming 'uri' is used to access the image path
            renderType: 'cover',
            nonce: '', // If you need to handle nonce, you might want to add logic here
          };
        }),
      });
    } catch (error) {
      console.error('Failed to pick images:', error);
      // Optionally, handle specific error scenarios
      if (error.code === 'E_NO_LIBRARY_PERMISSION') {
        alert('Please grant access to your photos.');
      }
    }
  };

  const onRemoveTextCard = async () => {
    try {
      //  setUploading(true);
      setQuestionCard('');
      const data = await API('user/moments/hideTextCard', 'PUT');
      if (data.body.statusCode === 200) {
        CleverTap.recordEvent('Nudge cards swiped');
        //ToastMessage('Text card removed');
      }
    } catch (error) {
      console.log('error question card', error);
    } finally {
      // setUploading(false);
    }
  };

  const onPressHornyExit = async () => {
    try {
      setUploading(true);
      const data = await API('user/moments/deactivateHornyMode', 'POST');
      if (data.body.statusCode === 200) {
        console.log('horny exit', data);
        ToastMessage('Horny mode has been turned off');
        sethornyMode(false);
      }
    } catch (error) {
      console.log('error question card', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* <View
        style={{
          backgroundColor: 'red',
          width: 1,
          height: '100%',
          zIndex: 1000,
          position: 'absolute',
          start: scaleNew(29),
        }}
      /> */}
      {showPokeAnimation && (
        <Animated.Text style={[styles.emojiText, emojiStyle]}>
          {pokeEmoji}
        </Animated.Text>
      )}

      <View style={{ flex: 1, flexGrow: 1 }}>
        {pairingModeActivated && <PairingComp pairingModeActivated={true} />}

        {hornyModeAnimmationActivated && (
          <LottieView
            ref={hornyAnimationRef}
            //  speed={0.6}
            renderMode="HARDWARE"
            style={{
              position: 'absolute',
              height: '100%',

              zIndex: 1000,
              width: '102%',
            }}
            resizeMode="cover"
            source={require('../../../assets/json/horny-mode2.json')}
            autoPlay={false}
            loop={false}
          />
        )}

        <OverlayLoader visible={uploading} />

        {nudgeModalVisible &&
          nudgeArray.length > 0 &&
          initialApi === false &&
          delaAfterTooltipEmoji === true &&
          toolTipCurrentState === 5 && (
            <View
              style={{
                zIndex: 1,
                position: 'absolute',
                top: 0,
                end: 0,
                start: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
              }}>
              <FloatingEmojis
                nudgeModalVisible={nudgeModalVisible}
                setNudgeModalVisible={setNudgeModalVisible}
                emojis={nudgeArray}
              />
            </View>
          )}
        <View testID="moments" style={{ flex: 1 }}>
          <View style={{ zIndex: 0, flex: 1 }}>
            <LinearGradient
              key={eveningMode ? 'evening' : 'day'}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 1, y: 0.2 }}
              locations={eveningMode ? [0, 0.75, 0.9] : null}
              style={{ flex: 1 }}
              useAngle
              angle={eveningMode ? 0 : 60}
              colors={
                hornyMode
                  ? ['#211134', '#1F1537', '#1F1537']
                  : eveningMode
                    ? ['#DD949D', '#341F64', '#292C6B']
                    : ['#FFEBDB', '#E9FFFE']
              }>
              {hornyMode && (
                <Image
                  style={{
                    position: 'absolute',
                    top: -scaleNew(0),
                    width: '100%',
                    zIndex: 0,
                    resizeMode: 'cover',
                  }}
                  source={require('../../../assets/images/hornyModeBlurBg.png')}
                />
              )}
              <AppView
                customContainerStyle={{
                  backgroundColor: 'transparent',
                }}
                isScrollEnabled={
                  toolTipCurrentState != null &&
                    [1, 2, 3, 4].includes(toolTipCurrentState)
                    ? false
                    : true
                }
                scrollContainerRequired={true}
                // isScrollEnabled={toolTipCurrentState === 5 ? true : false}
                isLoading={loading}
                //    header={AppHeader}
                refreshing={isRefreshing}
                onScroll={handleScrollView}
                scrollEventThrottle={400}
                handleRefresh={() => {
                  onRefreshMomemts();
                }}
                shouldRefresh={true}
                scrollref={scrollref1}>
                {!isConnected ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <LottieView
                      style={{ width: scale(400), height: scale(400) }}
                      source={require('../../../assets/images/gifs/no_net.json')}
                      autoPlay
                      loop
                    />
                  </View>
                ) : (
                  <>
                    <View>
                      <Pressable
                        hitSlop={15}
                        style={{
                          zIndex: 100,
                          alignSelf: 'flex-end',

                          marginTop:
                            Platform.OS === 'ios' ? scaleNew(0) : scaleNew(4),
                          marginEnd: scaleNew(16),
                          padding: scaleNew(4),
                        }}
                        onPress={() => {
                          CleverTap.recordEvent('Activity section');
                          props.navigation.navigate('notifications');
                        }}>
                        <>
                          {notifData.notification && (
                            <View style={styles.notificationDot} />
                          )}
                          <Image
                            source={APP_IMAGE.notifcationIconMoments}
                            style={{
                              ...styles.icon,
                              tintColor: hornyMode
                                ? '#E0E0E0'
                                : eveningMode
                                  ? colors.white
                                  : '#828282',
                            }}
                          />
                        </>
                      </Pressable>
                      {hornyMode && (
                        <HornyModeOn
                          onPressHornyExit={() => {
                            onPressHornyExit();
                          }}
                        />
                      )}
                      <View
                        style={{
                          zIndex: 100,
                          //   marginTop: -scaleNew(40),
                        }}>
                        <UserComp
                          profileData={profileData}
                          eveningMode={
                            toolTipCurrentState !== 5 ? false : eveningMode
                          }
                          weeksTogether={weeksTogether}
                          otherUserOnline={otherUserOnline}
                          otherUserLastActive={otherUserLastActive}
                          timezone={timezone}
                          closerPartnerPartOfDay={closerPartnerPartOfDay}
                          closerCurrentTime={closerCurrentTime}
                          closerPartnerCurrentTime={closerPartnerCurrentTime}
                          toolTipCurrentState={toolTipCurrentState}
                          isPartnerPaired={
                            VARIABLES?.user?.partnerData?.partner?._id !==
                              undefined
                              ? true
                              : false
                          }
                          onPressWeeks={() => {
                            setshowMeetUpDateModal(true);
                            CleverTap.recordEvent('Weeks tapped');
                          }}
                        />
                        {VARIABLES.user?.partnerData?.partner &&
                          toolTipCurrentState === 5 &&
                          showMeetUpDateTooltip &&
                          weeksTogether === 0 && (
                            <CustomToolTip
                              viewNumberTooltipStyle={{
                                //   paddingBottom: scaleNew(10),
                                paddingTop: scaleNew(16),
                              }}
                              topToolkit
                              onPresLeft={() => {
                                setshowMeetUpDateToolTip(false);
                                AsyncStorage.setItem(
                                  'setshowMeetUpDateToolTip',
                                  'false',
                                );
                              }}
                              onPress={() => {
                                setshowMeetUpDateToolTip(false);
                                setshowMeetUpDateModal(true);
                                AsyncStorage.setItem(
                                  'setshowMeetUpDateToolTip',
                                  'false',
                                );
                              }}
                              title={
                                'Tap here to share when you started dating;\nthis will help us reflect your relationship\ntimeline :)'
                              }
                              buttonText={'Add your special date'}
                              textNumber={'Do it later'}
                              viewToolTip={{
                                height: scaleNew(131),
                                width: scaleNew(362),
                                borderRadius: scaleNew(16),
                              }}
                              viewStyle={{
                                alignSelf: 'center',
                                position: 'absolute',
                                bottom: scaleNew(-140),
                                zIndex: 1000000,
                              }}
                              buttonStyle={{
                                width: 'auto',
                                paddingHorizontal: scaleNew(16),
                              }}
                              textButtonStyle={{
                                fontFamily: fonts.standardFont,
                                includeFontPadding: false,
                              }}
                              textNumberTooltipStyle={{
                                fontFamily: fonts.standardFont,
                                fontWeight: '500',
                                fontSize: scaleNew(14),
                                color: 'rgba(18, 70, 152, 1)',
                              }}
                              textToolTipStyle={{
                                fontFamily: fonts.standardFont,
                                fontSize: scaleNew(14),
                                fontWeight: '500',
                                color: '#4F4F4F',
                                lineHeight: scaleNew(20),
                              }}
                              styleTooltip={{
                                alignSelf: 'center',
                                //   transform: [{rotate: '180deg'}],
                              }}
                            />
                          )}
                      </View>
                      <CTAComp
                        toolTipCurrentState={toolTipCurrentState}
                        setToolTipCurrentState={setToolTipCurrentState}
                        initialApi={initialApi}
                        notesCompRef={notesCompRef}
                        hornyMode={hornyMode}
                        StoryImageUploading={StoryImageUploading}
                        setPickerType={setPickerType}
                        setGalleryAndCameraModal={setGalleryAndCameraModal}
                        onSelectImages={onSelectImages}
                        eveningMode={eveningMode}
                        navigation={props.navigation}
                      />
                      {VARIABLES.user?.partnerData?.partner && (
                        <BeginJourney
                          closerJourney={closerJourney}
                          setJourneyModalVisible={setJourneyModalVisible}
                          eveningMode={eveningMode}
                        />
                      )}

                      <Text
                        key={day}
                        style={{
                          fontFamily: fonts.boldFont,
                          fontSize: scaleNew(56),
                          color: colors.white,
                          textAlign: 'center',
                          marginTop: scale(12),
                          opacity: hornyMode ? 0.3 : eveningMode ? 0.54 : 1,
                        }}>
                        {day}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.viewMainContainer,
                        hornyMode
                          ? {
                            backgroundColor: 'rgb(38, 22,60)',
                          }
                          : {},
                      ]}>
                      {!VARIABLES.user?.partnerData?.partner &&
                        CodeRegisteration()}
                      {wellbeingAddCardShown === true && (
                        <View style={styles.viewWellbeingImageCard}>
                          <ImageBackground
                            source={require('../../../assets/images/wellbeingCard.png')}
                            style={styles.imgBgWellbeing}>
                            <View style={styles.viewInsideWellbeingImageCard}>
                              <Text style={styles.textTitleWellbeingImageCard}>
                                {VARIABLES.user?.name}, feeling something?
                              </Text>
                              <Text
                                style={styles.textSubtitleWellbeingImageCard}>
                                Sharing moods helps you{`\n`}both stay in sync
                              </Text>
                              <Pressable
                                onPress={() => {
                                  props.navigation.navigate('WellBeing');
                                }}>
                                <Text
                                  style={styles.textButtonWellbeingImageCard}>
                                  Share your mood
                                </Text>
                              </Pressable>
                            </View>
                          </ImageBackground>
                        </View>
                      )}
                      <View>{NotesContainer()}</View>

                      {/* stories conntainer need to create a separate comp for this one */}
                      <View
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;
                          dataSourceCords[MOMENT_KEY.stories] = layout.y; // we store this offset values in an array
                        }}>
                        <StoriesComp
                          userStory={userStory}
                          partnerStory={partnerStory}
                          navigation={props.navigation}
                        />
                      </View>

                      {(feelingsCheckArray.length > 0 ||
                        feelingsCheckPartnerArray.length > 0) && (
                          <View
                            style={{
                              zIndex: 100,
                            }}>
                            {FeelingsCheck()}
                          </View>
                        )}


                      {VARIABLES.user?.partnerData?.partner ? (
                        <>
                          {profileData !== undefined &&
                            profileData !== '' &&
                            (hornyMode
                              ? profileData?.hornyCard?.question !== undefined
                              : profileData?.QnA?.question !== undefined || multiQuizCard.length > 0)
                            && (

                              multiQuizDetail && multiQuizDetail.length > 0 && (
                                <View
                                  pointerEvents={
                                    VARIABLES.disableTouch ? 'none' : 'auto'
                                  }>


                                  <View style={styles.header}>
                                    <Text style={styles.title}>Quiz of the day</Text>
                                  </View>

                                  <QuizCardComp
                                    hornyMode={
                                      hornyMode &&
                                        profileData?.hornyCard !== undefined
                                        ? true
                                        : false
                                    }
                                    QnAData={
                                      hornyMode
                                        ? profileData?.hornyCard
                                        : multiQuizCard
                                    }
                                    loading={loading}
                                    setLoading={setLoading}
                                    disabled={false}
                                    //  profileData={profileData}

                                    addComment={() => {
                                      addComment({});
                                    }}
                                    askPartnerInput={askPartnerInput}
                                    setAskPartnerInput={setAskPartnerInput}
                                    navigation={props.navigation}
                                    dataSourceCords={dataSourceCords}
                                  />

                                  {
                                    multiQuizDetail && multiQuizDetail.length > 0 && (
                                      (() => {
                                        // Limit to the first 4 items
                                        const visibleItems = multiQuizDetail.slice(0, 3);
                                        const hiddenCount = multiQuizDetail.length - visibleItems.length;

                                        return (
                                          <View style={styles.turnContainer}>
                                            <Text style={styles.turnLabel}>YOUR TURN</Text>
                                            <Text style={styles.turnNumber}>{multiQuizDetail.length}</Text>
                                            <View style={styles.turnIcons}>

                                              {hiddenCount > 0 && (
                                                <View style={styles.moreIconContainer}>
                                                  <Text style={styles.moreIconText}>+{hiddenCount}</Text>
                                                </View>
                                              )}

                                              <View style={styles.relativeContainer}>

                                                {visibleItems.map((item, index) => {
                                                  if (item) {
                                                    let type = item?.quizId?.type;
                                                    const imgShow = quizTypeConfig[type];
                                                    if (imgShow.icon) {
                                                      return (
                                                        <Pressable
                                                          key={item._id || index} // Use a unique key, fallback to index if no id

                                                          onPress={() => {
                                                            props.navigation.navigate('quizOpen', {
                                                              item: item,
                                                            });
                                                          }}
                                                        >
                                                          <Image
                                                            key={index}
                                                            source={imgShow.icon}
                                                            style={styles.turnIcon}
                                                          />
                                                        </Pressable>
                                                      );
                                                    }
                                                  }
                                                  return null; // Return null if no valid type or icon
                                                })}

                                              </View>
                                              {/* Show a "more" indicator if there are hidden items */}

                                            </View>
                                          </View>
                                        );
                                      })()
                                    )
                                  }
                                </View>
                              )
                            )}
                        </>
                      ) : (
                        <Image
                          style={{ width: '100%', marginTop: scaleNew(20) }}
                          source={require('../../../assets/images/quizTimeCard.png')}
                        />
                      )}

                      <View
                        style={{
                          zIndex: 99,
                        }}
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;
                          dataSourceCords[MOMENT_KEY.imageCard] = layout.y; // we store this offset values in an array
                        }}>
                        {VARIABLES.user?.partnerData?.partner &&
                          imageQuestonCard?.text && (
                            <ImageUploadCard
                              text={imageQuestonCard?.text}
                              images={imageQuestonCard?.images}
                              refreshCardData={data => {
                                setUploading(data);
                              }}
                            />
                          )}
                      </View>

                      <View
                        style={{
                          zIndex: 100,
                        }}
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;

                          dataSourceCords[MOMENT_KEY.quiz] = layout.y; // we store this offset \ues in an array
                        }}
                      />


                      <View
                        style={{
                          zIndex: 100,
                        }}
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;
                          dataSourceCords[MOMENT_KEY.quotedCard] = layout.y; // we store this offset values in an array
                        }}>
                        {VARIABLES.user?.partnerData?.partner &&
                          questionCard?.text !== undefined && (
                            <View>
                              <TextCardComp
                                onRemoveCard={() => {
                                  onRemoveTextCard();
                                }}
                                textData={questionCard}
                                disabled={false}
                              />
                            </View>
                          )}
                      </View>

                      <View
                        style={{
                          ...styles.feedButtonsContainer,
                          marginTop: scale(23),
                          zIndex: 10,
                        }}
                        key={MOMENT_KEY.highlight}
                        onLayout={event => {
                          const layout = event.nativeEvent.layout;
                          dataSourceCords[MOMENT_KEY.highlight] = layout.y; // we store this offset values in an array
                        }}>
                        <Text
                          testID="feedLabel"
                          style={[
                            styles.feedLabel,
                            hornyMode ? { color: '#E0E0E0' } : {},
                          ]}>
                          Memories
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginEnd: scale(8),
                          }}
                        />
                      </View>
                      <>
                        {stories && stories.length > 0 && (
                          <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={stories}
                            renderItem={storyItem}
                            // keyExtractor={(item, index) => index}
                            keyExtractor={(item, index) => item._id?.toString() || index.toString()}

                            contentContainerStyle={{
                              paddingHorizontal: scale(8),
                              marginTop: scale(14),
                            }}
                          />
                        )}
                      </>

                      <LinearGradient
                        locations={[0, 0.4, 0.8, 0.99]}
                        style={{ flex: 1 }}
                        useAngle
                        angle={220}
                        colors={
                          hornyMode
                            ? [
                              'rgb(38, 22,60)',
                              'rgb(38, 22,60)',
                              'rgb(38, 22,60)',
                              'rgb(38, 22,60)',
                            ]
                            : ['#FFFFFF', '#FFFFFF', '#C2E2FF20', '#FFD85020']
                        }>
                        <FlatList
                          onEndReachedThreshold={0.2}
                          data={postData}
                          numColumns={3}
                          renderItem={renderFeedItem}
                          keyExtractor={item => item?._id}
                          ItemSeparatorComponent={ItemSeparatorComponentFeed}
                          contentContainerStyle={{
                            marginTop: scale(15),
                            flex: 1,
                          }}
                          style={{
                            flex: 1,
                          }}
                          ListEmptyComponent={() => {
                            return (
                              <FeedEmptyState onSelectImages={onSelectImages} />
                            );
                          }}
                          keyboardShouldPersistTaps={'always'}
                          scrollEnabled={false}
                        />
                        {footerLoader && (
                          <ActivityIndicator
                            style={{ marginVertical: scale(20) }}
                            size="large"
                          />
                        )}

                        <Image
                          style={{
                            marginBottom: scaleNew(100),
                            marginTop: scale(100),
                            marginStart: scale(10),

                            // backgroundColor: 'red',
                          }}
                          source={require('../../../assets/images/madeForLove.png')}
                        />
                      </LinearGradient>
                    </View>
                  </>
                )}
              </AppView>
            </LinearGradient>
          </View>
        </View>
      </View>

      {toolTipCurrentState === 5 ? (
        <View
          pointerEvents={VARIABLES.disableTouch ? 'none' : 'auto'}
          style={{
            position: 'absolute',
            bottom: scale(14),
            end: scale(18),
            zIndex: emojiVisible ? 101 : 100,
          }}>
          {hornyMode && <PokesHornyTooltip />}

          {hornyMode ? (
            <Animated.View style={emojiSelectorStyle}>
              <EmojiSelectorHorny
                isVisible={emojiVisible}
                setIsVisible={setEmojiVisible}
                onEmojiSelect={emoji => {
                  CleverTap.recordEvent(`Hm poke sent: ${emoji}`);

                  CleverTap.recordEvent('Hm pokes sent');

                  let data = {
                    emoji: emoji,
                  };
                  onPoke(data);
                  //  alert(emoji);
                }}
              />
            </Animated.View>
          ) : (
            <Animated.View style={emojiSelectorStyle}>
              <EmojiSelector
                viewStyle={{
                  width: scaleNew(60),
                  height: scaleNew(60),
                }}
                isVisible={emojiVisible}
                setIsVisible={setEmojiVisible}
                onEmojiSelect={emoji => {
                  CleverTap.recordEvent(`Poke sent: ${emoji}`);
                  CleverTap.recordEvent('Pokes sent');
                  let data = {
                    emoji: emoji,
                  };
                  onPoke(data);
                }}
              />
            </Animated.View>
          )}
        </View>
      ) : (
        <Tooltip
          topAdjustment={
            Platform.OS === 'android' ? -StatusBar.currentHeight : 0
          }
          closeOnChildInteraction={false}
          backgroundColor={'rgba(0,0,0,0.8)'}
          closeOnContentInteraction={false}
          closeOnBackgroundInteraction={false}
          useInteractionManager={true}
          arrowStyle={{
            marginStart: scaleNew(150),
          }}
          //showChildInTooltip={false}
          displayInsets={{ right: 24 }}
          //  horizontalAdjustment={-16}
          //   topAdjustment={-100}
          disableShadow
          childrenWrapperStyle={{
            backgroundColor: '#E9FFFE',
            borderRadius: 12,
          }}
          isVisible={
            toolTipCurrentState === 4 && initialApi === false ? true : false
          }
          tooltipStyle={{
            marginTop: -scaleNew(70),
          }}
          contentStyle={{
            width: !emojiVisible ? scaleNew(334.52) : scaleNew(0),
            height: !emojiVisible ? scaleNew(204.82) : scaleNew(0),
            borderRadius: scaleNew(16),
            padding: scaleNew(15),
            zIndex: 20,
          }}
          content={
            <>
              {!emojiVisible && (
                <View style={{ zIndex: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage5.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage6.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage7.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage8.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage9.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage10.png')}
                    />
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(40.14),
                        height: scaleNew(40.14),
                      }}
                      source={require('../../../assets/images/tooltipImage11.png')}
                    />
                  </View>
                  <Text
                    style={{ ...styles.toolTipText, marginTop: scaleNew(16) }}>
                    Need attention!? Press, hold & release on an emoji to poke
                    your partner!
                  </Text>
                  <Text
                    style={{
                      ...styles.toolTipText,
                      marginTop: scaleNew(10),
                      fontFamily: fonts.semiBoldFont,
                      color: colors.blue1,
                      //   backgroundColor: 'red',
                    }}>
                    To Continue, long press and hold on the circle & emoji, and
                    then release to poke!
                  </Text>

                  <View
                    style={{
                      ...styles.viewTooltipBottom,
                      marginTop:
                        Platform.OS === 'ios' ? scaleNew(16) : scaleNew(10),
                    }}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                        width: scaleNew(54),
                        height: scaleNew(16),
                        //  backgroundColor: 'yellow',
                      }}
                      source={require('../../../assets/images/pageIndicator5.png')}
                    />
                  </View>
                </View>
              )}
            </>
          }
          placement="top"
          onClose={() => { }}>
          <View
            style={{
              position: 'absolute',
              bottom: scale(8),
              end: scale(18),
              zIndex: emojiVisible ? 101 : 100,
            }}>
            <View>
              {toolTipCurrentState === 4 && (
                <LottieView
                  style={{
                    width: scale(120),
                    height: scale(120),
                    position: 'absolute',
                    bottom: scaleNew(-24),
                    end: scaleNew(-24),
                    zIndex: 0,
                  }}
                  source={require('../../../assets/json/pokeTooltipBehind.json')}
                  autoPlay
                  loop
                />
              )}
              <Animated.View style={emojiSelectorStyle}>
                <EmojiSelector
                  viewStyle={{
                    width: scaleNew(60),
                    height: scaleNew(60),
                  }}
                  toolTipCurrentState={toolTipCurrentState}
                  isVisible={toolTipCurrentState === 4 ? emojiVisible : false}
                  setIsVisible={setEmojiVisible}
                  onEmojiSelect={emoji => {
                    API('user/toolTip', 'POST', { type: 'normal' });
                    setToolTipCurrentState(5);
                    setDelaAfterTooltipEmoji(false);

                    CleverTap.recordEvent(`Poke sent: ${emoji}`);

                    CleverTap.recordEvent('Pokes sent');

                    let data = {
                      emoji: emoji,
                    };
                    onPoke(data);

                    setcloserJourney({ ...closerJourney, poke: true });

                    setTimeout(() => {
                      AsyncStorage.setItem('setshowMeetUpDateToolTip', 'true');
                      if (!profileData?.personalise?.weeks) {
                        setshowMeetUpDateToolTip(true);
                      }
                    }, 200);
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </Tooltip>
      )}
      {hornyModeDialog && (
        <HornyModeDialog
          hornyModeDialog={hornyModeDialog}
          setHornyModeDialog={setHornyModeDialog}
        />
      )}

      {emojiVisible && (
        <TouchableWithoutFeedback onPress={() => setEmojiVisible(false)}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)', // Dark overlay
              zIndex: 10,
            }}></View>
        </TouchableWithoutFeedback>
      )}

      {galleryAndCameraModal && (
        <ImagePickerModal
          modalVisible={galleryAndCameraModal}
          setModalVisible={setGalleryAndCameraModal}
          imageHandler={() => {
            setTimeout(() => {
              handleGalleryPicker();
            }, 10);
          }}
          cameraHandler={() => {
            setTimeout(() => {
              handleCameraPicker();
            }, 10);
          }}
          onDismissCard={() => { }}
          header={pickerType === 'feed' ? 'Add to feed' : 'Add to story'}
        />
      )}

      {deactivateModalVisible && (
        <DeactivateAccountModal
          modalVisible={deactivateModalVisible}
          setModalVisible={setDeactivateModalVisible}
          onPressContinue={onPressContinue}
          onPressDeactivate={onPressDeactivate}
        />
      )}

      {hornyModeDialogShow && (
        <HornyModeBottomSheet
          setVisible={setHornyModeDialogShow}
          visible={hornyModeDialogShow}
        />
      )}

      {journeyModalVisible && (
        <CloserJourneyModal
          visible={journeyModalVisible}
          setVisible={setJourneyModalVisible}
          closerJourney={closerJourney}
        />
      )}
      {eveningModeModalVisible && (
        <EveningModeModal
          modalVisible={eveningModeModalVisible}
          setModalVisible={setEveningModeModalVisible}
        />
      )}

      {shareFeedbackModalVisible && (
        <ShareFeedbackModal
          modalVisible={shareFeedbackModalVisible}
          setModalVisible={setShareFeedbackModalVisible}
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

      {mismatchAnswersModalVisible && (
        <MismatchAnswersModal
          modalVisible={mismatchAnswersModalVisible}
          data={mismatchAnswersData}
          setModalVisible={setMismatchAnswersModalVisible}
        />
      )}
      {shareCloserModalVisible && (
        <ShareCloserModal
          modalVisible={shareCloserModalVisible}
          setModalVisible={setShareCloserModalVisible}
        />
      )}
      {turnBiometricOnModalVisible && (
        <TurnBiometricOnModal
          modalVisible={turnBiometricOnModalVisible}
          setModalVisible={setTurnBiometricOnModalVisible}
          onPress={async () => {
            await updateContextualTooltipState('biometricShown', true);
            setTurnBiometricOnModalVisible(false);
            props.navigation.navigate('Profile');
          }}
        />
      )}
      {showMeetUpDateModal && (
        <DatingTimeModal
          visible={showMeetUpDateModal}
          setVisible={setshowMeetUpDateModal}
          onSubmitDate={async date => {
            setshowMeetUpDateModal(false);
            setTimeout(async () => {
              setUploading(true);
              await API('user/dateOfMeet', 'PUT', { date });
              CleverTap.recordEvent('Weeks updated');

              setUploading(false);
            }, 200);
          }}
        />
      )}

      {deleteAccountPartnerModalVisible && (
        <DeleteAccountPartnerSideModal
          modalVisible={deleteAccountPartnerModalVisible}
          setModalVisible={setDeleteAccountPartnerModalVisible}
          navigation={props.navigation}
        />
      )}
      {unpairAccountPartnerModalVisible && (
        <UnpairAccountPartnerSideModal
          modalVisible={unpairAccountPartnerModalVisible}
          setModalVisible={setUnpairAccountPartnerModalVisible}
          navigation={props.navigation}
        />
      )}

      {reportLogoutModalVisible && (
        <ReportLogoutModal
          navigation={props.navigation}
          modalVisible={reportLogoutModalVisible}
          setModalVisible={setReportLogoutModalVisible}
          type={reportLogoutModalType}
        />
      )}

      {confirmEmailModalVisible && (
        <ConfirmEmailModal
          modalVisible={confirmEmailModalVisible}
          setModalVisible={setConfirmEmailModalVisible}
        />
      )}

      {forceUpdateModal && (
        <ForceUpdateModal
          modalVisible={forceUpdateModal}
          setModalVisible={setForceUpdateModal}
        />
      )}

      {appReviewModalVisible && (
        <ShowInAppReviewModel
          modalVisible={appReviewModalVisible}
          setModalVisible={setAppReviewModalVisible}
          handleYesPress={handleAppReviewYesPress}
          handleNoPress={handleAppReviewNoPress}
        />
      )}

      {initialApi && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.primary,
          }}>
          <AppView
            customContainerStyle={{
              backgroundColor: hornyMode ? '#08021E95' : colors.primary,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 48,
                }}>
                <MomentLoader />
              </View>
              <Card />
              <View style={{ height: 32 }} />
              <Sticky />
              <Feelings />
            </View>
          </AppView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    width: 600,
    height: 1000,
    backgroundColor: 'red',
  },

  icon: {
    width: scale(28),
    height: scale(28),
  },
  emojiIcon: {
    width: scale(22),
    height: scale(22),
  },
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(32),
    color: colors.blue1,
  },
  cardContainer: {
    height: CARD_HEIGHT.medium,
    maxHeight: CARD_HEIGHT.medium,
    paddingHorizontal: scale(50),
    paddingVertical: scale(20),
    //justifyContent: 'center',
    marginHorizontal: scale(16),
    marginBottom: scale(14),
    marginTop: scale(20),
  },
  remindLabel: {
    ...globalStyles.semiBoldLargeText,
    textAlign: 'center',
    lineHeight: scale(26),
    // marginBottom:scale(12),
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.red5,
    paddingVertical: scale(4),
    paddingHorizontal: scale(20),
    borderRadius: scale(5),
    marginVertical: scale(20),
  },
  registerCodeLabel: {
    ...globalStyles.regularSmallText,
    textAlign: 'center',
    lineHeight: scale(20),
  },
  userPic: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: 'lightgray',
    // borderWidth: 4,
    // borderColor: '#fff'
  },
  feedButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
    marginTop: -scale(4),
    // marginTop: scale(12),
  },
  feedLabel: {
    ...globalStyles.semiBoldLargeText,
    color: '#595959',
    fontSize: scaleNew(18),
  },
  postImage: {
    width: '100%',
    height: verticalScale(488), // variable
    backgroundColor: 'gray',
  },
  moreIcon: {
    position: 'absolute',
    right: scale(10),
    top: scale(20),
  },
  userContainer: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: scale(12),
  },
  currentUserImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
  },
  userCaption: {
    ...globalStyles.regularMediumText,
    textAlign: 'left',
    marginStart: scale(12),
    flex: 1,
  },
  userImage: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
  },

  userProfileImage: {
    width: scale(82),
    height: scale(82),
    borderRadius: scale(41),
  },

  commentUserContainer: {
    flexDirection: 'row',
    backgroundColor: colors.red2,
    padding: scale(12),
    borderRadius: scale(10),
    alignItems: 'center',
    marginVertical: scale(10),
  },
  commentUserImage: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: colors.grey10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginStart: 10,
    flex: 1,
  },
  comment: {
    ...globalStyles.regularMediumText,
    marginTop: scale(16),
    marginEnd: scale(6),
  },
  commentTimeStamp: {
    ...globalStyles.regularSmallText,
    opacity: 0.5,
  },

  viewMoreCommment: {
    ...globalStyles.regularMediumText,
    textDecorationLine: 'underline',
  },

  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  notePlaceholder: {
    width: scale(174),
    height: scale(160),
    padding: scale(18),
    marginHorizontal: scale(6),
    paddingRight: scale(12),
    paddingBottom: scale(12),
    // padding: scale(24),
    // paddingTop: scale(30),
    // marginHorizontal: scale(8),
  },
  noteInput: {
    // flex:1,
    maxHeight: scale(180),
    marginEnd: scale(20),
    ...globalStyles.regularLargeText,
    color: colors.text,
    textAlignVertical: 'center',
    // padding:0,
    // margin:0,
    flex: 1,
    // includeFontPadding:false
  },
  noteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  knowBetterLabel: {
    ...globalStyles.regularLargeText,
    color: colors.blue9,
    marginTop: scale(8),
    fontSize: scale(18),
  },
  whoAnswered: {
    padding: scale(4),
    paddingHorizontal: scale(6),
    backgroundColor: 'rgba(255,255,255,0.24)',
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    borderRadius: scale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
  },
  callsMoreLabel: {
    ...globalStyles.semiBoldLargeText,
    color: colors.white,
    marginTop: scale(8),
    fontSize: scale(18),
    //  width: scale(230),
    lineHeight: scale(31),
    // marginEnd:40
  },
  partnerFeelingCard: {
    padding: scale(16),
    backgroundColor: colors.red6,
    borderRadius: scale(20),
    flex: 1,
    zIndex: -1,
  },
  feelingEmojiContainer: {
    width: scale(104),
    height: scale(140),
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerImgage: {
    width: scale(20),
    height: scale(20),
    borderRadius: 25,
  },
  partnerDateFeeling: {
    ...globalStyles.regularSmallText,
    //  opacity: 0.7,
    marginStart: scale(6),
    includeFontPadding: false,
  },
  feelingSticker: {
    width: scale(22),
    height: scale(20),
    marginEnd: scale(4),
  },
  userFeelingCard: {
    padding: scale(16),
    backgroundColor: colors.red1,
    borderRadius: scale(20),
    flex: 1,
    flexDirection: 'row',
    // marginTop:12,
    paddingTop: scale(38),
    zIndex: -1,
  },
  feelingInput: {
    height: scale(86),
    backgroundColor: '#F4F4F4',
    padding: scale(10),
    borderRadius: scale(10),
    ...globalStyles.regularMediumText,
    // flex:1
  },
  feelingSendButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(10),
  },
  timezoneImg: {
    width: 22,
    height: 22,
  },
  pairedBannerContainer: {
    padding: scale(14),
    borderRadius: 10,
    backgroundColor: colors.green1,
    flexDirection: 'row',
    marginHorizontal: scale(16),
    paddingVertical: scale(18),
    marginBottom: scale(12),
  },
  viewMainActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: scale(28),
    marginHorizontal: scale(10),
  },
  viewAction: {
    width: scaleNew(82),
    height: scaleNew(82),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: scaleNew(12),
    borderColor: '#EDEDED',
    borderWidth: 1,
  },
  textAction: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: scaleNew(4),
  },
  textDayLarge: {
    fontFamily: fonts.boldFont,
    fontSize: scaleNew(56),
    color: colors.white,
    textAlign: 'center',
    marginTop: scale(12),
  },
  viewMainContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: scale(32),
    borderTopEndRadius: scale(32),
    marginTop: Platform.OS === 'ios' ? -scale(35) : -scale(55),
    //  paddingTop: scale(20),
  },
  notificationDot: {
    position: 'absolute',
    top: scaleNew(5),
    end: scaleNew(6.5),
    width: scaleNew(9),
    height: scaleNew(9),

    borderRadius: 20,
    backgroundColor: '#E58D8D',
    borderWidth: 1,
    borderColor: '#828282',

    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  toolTipText: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: '#808491',
    marginTop: scaleNew(10),
  },
  viewTooltipBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scaleNew(11),
  },
  buttonTooltip: {
    backgroundColor: colors.blue1,
    borderRadius: scaleNew(100),
    height: scaleNew(32),
    paddingHorizontal: scaleNew(18),
    justifyContent: 'center',
  },
  buttonTextTooltip: {
    fontFamily: fonts.standardFont,
    fontSize: scaleNew(14),
    color: colors.white,
  },
  emojiText: {
    position: 'absolute',
    fontSize: 60,
    zIndex: 1000,
    color: '#000',
    left: width / 2 - 20,
    top: height / 2 - 20,
  },
  viewWellbeingImageCard: {
    marginHorizontal: scale(20),
    marginTop: scaleNew(18),
  },
  imgBgWellbeing: {
    width: '100%',
    height: scaleNew(143),
  },
  viewInsideWellbeingImageCard: {
    paddingVertical: scaleNew(21),
    paddingHorizontal: scaleNew(15),
  },
  textTitleWellbeingImageCard: {
    fontFamily: fonts.regularSerif,
    fontSize: scaleNew(18),
    color: colors.textSecondary2,
  },
  textSubtitleWellbeingImageCard: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(14),
    color: colors.textSecondary2,
    marginVertical: scaleNew(10),
  },
  textButtonWellbeingImageCard: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(14),
    color: colors.blue1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#737373",
  },



  turnContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
    padding: 10,
    backgroundColor: "#fff4f1",
    borderRadius: 10,
    color: "#8c8886",
  },
  turnLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    borderRightColor: "#8c8886",
    borderRightWidth: 1,
    paddingRight: 10,
    borderStyle: "dashed",
  },
  turnNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
    color: "#737373",
    fontFamily: "Poppins",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  turnIcons: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 5,

    justifyContent: "center",
    alignItems: "center",

  },
  relativeContainer: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 5,

    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    marginHorizontal: 20,
  },

  moreIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#fffaf8',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff3f0',
    borderWidth: 1,
    position: 'absolute',
    right: -10,
    top: 0,
    zIndex: 1,
  },
  moreIconText: {
    color: '#737373',
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '500',

  },







});
