/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  View,
  Text,
  FlatList,
  TextInput,
  Platform,
  Button,
  StatusBar,
  StyleSheet,
  Image,
  Pressable,
  Keyboard,
  PermissionsAndroid,
  Alert,
  Linking,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react';
import {VARIABLES} from '../../../utils/variables';
import {API_BASE_URL, AWS_URL_S3, GIF_API_KEY} from '../../../utils/urls';
import ChatItem from './ChatComponents/ChatItem';
import {
  BOTTOM_SPACE,
  SCREEN_WIDTH,
  globalStyles,
} from '../../../styles/globalStyles';
import {scale} from '../../../utils/metrics';
import AppView from '../../../components/AppView';
import SwipeContainer from '../../../components/SwipeContainer';
import {APP_IMAGE, STICKERS, hitSlopProp} from '../../../utils/constants';
import {
  containsHttpsLink,
  delay,
  generateID,
  getStateDataAsync,
  removeExtension,
  updateRecentlyUsedEmoji,
  updateRecentlyUsedSmily,
  uploadBlobToS3,
  uploadEncryptedToS3,
} from '../../../utils/helpers';
import ProfileHeaderSvg from '../../../assets/svgs/profileHeaderSvg';
import SearchIconSvg from '../../../assets/svgs/searchIconSvg';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';
import {fonts} from '../../../styles/fonts';
import {ToastMessage} from '../../../components/toastMessage';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {FlashList} from '@shopify/flash-list';

import EmojiSelector from '../../../localPackages/react-native-emoji-selector';
import AddMediaIconSvg from '../../../assets/svgs/addMediaIconSvg';
import RecordAudioIconSvg from '../../../assets/svgs/recordAudioIconSvg';
import AddLocationIconSvg from '../../../assets/svgs/addLocationIconSvg';
import AddDocumentIconSvg from '../../../assets/svgs/addDocumentIconSvg';
import FastImage from 'react-native-fast-image';
import ImagePickerModal from '../../../components/Modals/imagePickerModal';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import QuotedInputContainer from './ChatComponents/QuotedInputContainer';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImageView from 'react-native-image-viewing';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import {colors} from '../../../styles/colors';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import InitialPauseIconSvg from '../../../assets/svgs/recordAudio/initialPauseAudioIconSvg';
import InitialRecordIconSvg from '../../../assets/svgs/recordAudio/initialRecordIconSvg';
import PlayRecordAudioIconSvg from '../../../assets/svgs/recordAudio/playRecordAudioIconSvg';
import MicrophoneWhiteIconSvg from '../../../assets/svgs/microphoneWhiteIconSvg';
import {useFocusEffect} from '@react-navigation/native';
import OverlayLoader from '../../../components/overlayLoader';
import {KEYCHAIN} from '../../../utils/keychain';
import AWS from 'aws-sdk';
import {NetworkContext} from '../../../components/NetworkContext';
import {getCurrentTab, setCurrentTab} from '../../../utils/appstate';
import {
  onSendMessage,
  onUpdateMessage,
  onUpdateMessage2,
} from '../../../backend/DatabaseOperations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSocket} from '../../../utils/socketContext';
import {createThumbnail} from 'react-native-create-thumbnail';
import {
  decryptAndVerifyMessage,
  encryptAndSignMessage,
} from '../../../e2e/encryptionMethods';
import WelcomeChatModal from '../../../components/Modals/WelcomeChatModal';
import CustomToolTip from '../../../components/CustomToolTip';
import {useAppContext} from '../../../utils/VariablesContext';
import {useIsFocused} from '@react-navigation/native';
import {Image as CompressedImage} from 'react-native-compressor';
import {Video as CompressedVideo} from 'react-native-compressor';
import {useAppState} from '../../../utils/AppStateContext';
import {EventRegister} from 'react-native-event-listeners';
import {useQuery, useRealm} from '@realm/react';
import {scaleNew} from '../../../utils/metrics2';
import LinearGradient from 'react-native-linear-gradient';
import ChatShareMediaTooltip from '../../../components/contextualTooltips/ChatShareMediaTooltip';
import ChatEmojiTooltip from '../../../components/contextualTooltips/ChatEmojiTooltip';
import * as Sentry from '@sentry/react-native';
import API from '../../../redux/saga/request';
import NetInfo from '@react-native-community/netinfo';
import {ProfileAvatar} from '../../../components/ProfileAvatar';

// let socket;
const limit = __DEV__ ? 30 : 30;

const CONTENT = [
  {
    id: 1,
    key: 'Media',
    label: 'Add photo',
    icon: <AddMediaIconSvg />,
  },
  {
    id: 5,
    key: 'video',
    label: 'Add video',
    icon: <AddMediaIconSvg />,
  },
  {
    id: 2,
    key: 'Audio',
    label: 'Record audio note',
    icon: <RecordAudioIconSvg />,
  },
  {
    id: 3,
    key: 'Document',
    label: 'Add document',
    icon: <AddDocumentIconSvg />,
  },
  {
    id: 4,
    key: 'Location',
    label: 'Add location',
    icon: <AddLocationIconSvg />,
  },
];
const audioRecorderPlayer = new AudioRecorderPlayer();

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});

const CleverTap = require('clevertap-react-native');

const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const pageSize = 20; // Number of messages to load per page
let lastIndex = 0; // Keep track of the last index of messages loaded

const Chat = props => {
  const realm = useRealm();

  const isFocused = useIsFocused();
  const appStateGlobal = useAppState();
  const {socket, isSocketConnected, connectSocket} = useSocket();

  const {notifData, updateNotifData, setActiveTab} = useAppContext();

  // REFS

  const searchInputRef = useRef(null);
  const bottomSheetEmojiModalRef = useRef(null);
  const inputRef = useRef(null);
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRecordAudioRef = useRef(null);
  const flatListRef = useRef(null);

  // STATES
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [tooltipState, setTooltipState] = useState('');
  const [welcomeChatModalVisible, setWelcomeChatModalVisible] = useState(false);
  const [chatdata, setchatdata] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isPartnerTyping, setisPartnerTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const wasTyping = useRef(false);

  const [themeColor, setThemeColor] = useState(
    VARIABLES.themeData?.themeColor || '#EFE8E6',
  );
  const [strokeColor, setStrokeColor] = useState(
    VARIABLES.themeData?.strokeColor || '#ECDDD9',
  );
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [repliedText, setRepliedText] = useState('');
  const [quotedMessage, setQuotedMessage] = useState(null);
  const [chatId, setChatId] = useState('');
  const [visible, setVisible] = useState(true);
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);
  const [isVideo, setisVideo] = useState(false);
  const [isRecordingEnabled, setisRecordingEnabled] = useState(false);
  const [icontabs, setIconTabs] = useState([
    {tab: 'Sticker', selected: true},
    {tab: 'Emoji', selected: false},
    {tab: 'Giph', selected: false},
  ]);
  const [loading, setloading] = useState(false);
  const [isReactionEnabled, setIsReactionEnabled] = useState(false); // differentiating if bottom sheet is opened for reactions or just sticker/emoji as a message
  const [viewImage, setViewImage] = useState('');
  const [visibleImage, setVisibleImage] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [isRecordingPause, setIsRecordingPause] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00');
  const [audioFile, setAudioFile] = useState('');
  const [musicFileExtension, setMusicFileExtension] = useState('');
  const [currentActiveAudio, setcurrentActiveAudio] = useState(null);
  const [isInputDisabled, setisInputDisabled] = useState(false);
  const [isNavigation, setisNavigation] = useState(false);
  const [initialNumToRenderProp, setinitialNumToRenderProp] = useState(limit);
  const {isConnected} = useContext(NetworkContext);

  const [Gifs, setGifs] = useState([]);
  const [searchGifs, setsearchGifs] = useState([]);
  const [searchGifQuery, setsearchGifQuery] = useState('');
  const [gifLoading, setgifLoading] = useState(false);

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 1.45 + BOTTOM_SPACE,
      SCREEN_WIDTH / 1.45 + BOTTOM_SPACE,
    ],
    [],
  );
  const snapPointsEmoji = useMemo(() => ['80%', '80%'], []);
  const snapPointsRecordAudio = useMemo(() => ['40%', '40%'], []);
  const [extraInfo, setextraInfo] = useState({});

  const checkToolTipStatus = async () => {
    let tooltipState1 = await AsyncStorage.getItem('toolTipChat');
    setTooltipState(tooltipState1);
  };

  useFocusEffect(
    React.useCallback(() => {
      // Set the current tab when ChatTab is focused
      setActiveTab('chat');
      return () => {
        // Reset the current tab when ChatTab is blurred (not focused)
        //     setActiveTab('');
      };
    }, []),
  );

  /// to listen for share content
  useEffect(() => {
    const refreshOrders = EventRegister.addEventListener(
      'shareContentChat',
      files => {
        files.forEach(file => {
          if (
            file.mimeType &&
            (file.mimeType.includes('jpg') ||
              file.mimeType.includes('jpeg') ||
              file.mimeType.includes('image/jpeg') ||
              file.mimeType.includes('png'))
          ) {
            console.log('Shared Image:', file);
            photoShare(file);
            // Handle image sharing
          } else if (file?.weblink !== undefined && file?.weblink !== null) {
            SendMessageHandler(file.weblink, 'link');
          } else if (
            file.mimeType &&
            (file.mimeType.includes('video/') ||
              file.mimeType.includes('mov') ||
              file.mimeType.includes('mp4'))
          ) {
            videoShare(file);
            // Handle video sharing
            console.log('Shared Video:', file);
          } else if (file.text) {
            // Check if text is a URL/link
            const urlPattern = new RegExp(
              '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
              'i',
            ); // fragment locator
            if (urlPattern.test(file.text)) {
              SendMessageHandler(file.text, 'link');
              // Handle link sharing
              console.log('Shared Link:', file.text);
            } else {
              SendMessageHandler(file.text, 'message');
              // Handle text sharing
              console.log('Shared Text:', file.text);
            }
          } else {
            console.log('Unsupported content type:', file);
          }
        });
      },
    );

    return () => {
      // unsubscribe event

      EventRegister.removeEventListener(refreshOrders);
    };
  }, [socket, isSocketConnected]);

  const photoShare = async image => {
    const path = await CompressedImage.compress(image.filePath);
    const id = generateID();

    const filename =
      id + image.filePath.substring(image.filePath.lastIndexOf('/') + 1);

    let newObj = {
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: filename,
      sender: VARIABLES.user?._id,
      type: 'image',
      chatId: '',
      imageWidth: 0,
      imageHeight: 0,
      mime: image.mimeType,
      orientation: 'HORIZONTAL',
      status: 0,
      quotedMessage: null,
      id,
    };

    const messageDetails = {
      ...newObj,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
    };

    onSendMessage(messageDetails, realm);

    flatListRef.current.scrollToOffset({animated: false, offset: 0});
    ///   StoreLocalImage(image.path, filename);
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(image.filePath, localFilePath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
    setloading(false);

    onSendMediaSocket(messageDetails, path);
  };

  const videoShare = async image => {
    const id = generateID();

    const filename =
      id + image.filePath.substring(image.filePath.lastIndexOf('/') + 1);

    setGalleryAndCameraModal(false);
    //  setloading(true);

    let newObj = {
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: filename,
      sender: VARIABLES.user?._id,
      type: 'video',
      chatId: '',
      imageWidth: 0,
      imageHeight: 0,
      mime: image.mimeType,
      status: 0,
      quotedMessage: null,
      id,
    };

    const thumbnail = await createThumbnail({
      url: `file://${image.filePath}`,
      timeStamp: 1000,
    });

    const thumbnailFilename = generateID() + Date.now();
    const newThumbnailPath = `${RNFS.DocumentDirectoryPath}/${thumbnailFilename}.jpg`;
    await RNFS.copyFile(thumbnail.path, newThumbnailPath);
    const messageDetails = {
      ...newObj,
      _id: id,
      thumbnailImage: `${thumbnailFilename}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
    };

    const messageDetails2 = {
      ...newObj,
      _id: id,
      createdAt: new Date(),
      thumbnailImage: `${thumbnailFilename}.jpg`,
      updatedAt: new Date(),
      messageTime: new Date(),
      message: filename,
    };

    onSendMessage(messageDetails2, realm);

    flatListRef.current.scrollToOffset({animated: false, offset: 0});

    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(image.filePath, localFilePath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }

    //  StoreLocalImage(path, filename);

    setloading(false);
    onSendMediaSocket(messageDetails, image.filePath);
  };

  /// back handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        setsearchGifQuery('');
        bottomSheetEmojiModalRef.current.dismiss();
        bottomSheetModalRef.current.dismiss();
        bottomSheetModalRecordAudioRef.current.dismiss();
      },
    );

    return () => backHandler.remove();
  }, []);

  /// to check tooltip status
  useEffect(() => {
    checkToolTipStatus();
  }, []);

  /// focuss effect to set current tab
  useFocusEffect(
    React.useCallback(() => {
      // Set the current tab when ChatTab is focused
      setCurrentTab('ChatTab');

      return () => {
        updateNotifData({...VARIABLES.appNotifData, chat: 0});
        // Reset the current tab when ChatTab is blurred (not focused)
        setCurrentTab('');
      };
    }, [appStateGlobal]),
  );

  //// debounced search
  const handleIsTyping = debounce(() => {
    if (wasTyping.current) {
      setIsUserTyping(false);

      if (isSocketConnected) {
        socket.emit('isTyping', {
          userId: VARIABLES.user?.partnerData?.partner?._id,
          typing: false,
        });
      }
      wasTyping.current = false;
    }
  }, 1000);

  /// set searched text input
  const handleTextChange = useCallback(
    text => {
      setMessage(text);
      if (!wasTyping.current) {
        setIsUserTyping(true);

        if (isSocketConnected) {
          socket.emit('isTyping', {
            userId: VARIABLES.user?.partnerData?.partner?._id,
            typing: true,
          });
        }
        wasTyping.current = true;
      }
      handleIsTyping();
    },
    [isSocketConnected],
  );

  //// to emit read all messages socket and typing socket false on app enter
  useEffect(() => {
    if (appStateGlobal !== 'background' && isFocused && !realm.isClosed) {
      updateNotifData({...VARIABLES.appNotifData, chat: 0});
      if (isSocketConnected) {
        setTimeout(() => {
          socket?.emit('readAllMessage', {
            sender: VARIABLES.user?.partnerData?.partner?._id,
            receiver: VARIABLES.user?._id,
          });
        }, 600);
      }
    } else {
      VARIABLES?.currentSound?.stop?.();

      if (wasTyping.current) {
        if (isSocketConnected) {
          socket.emit('isTyping', {
            userId: VARIABLES.user?.partnerData?.partner?._id,
            typing: false,
          });
        }
      }
    }
  }, [appStateGlobal, isSocketConnected, isFocused, realm]);

  let messageQueue = [];
  let isProcessingQueue = false;

  // Function to process the queue of received messages
  async function processQueue() {
    if (isProcessingQueue) {
      return;
    }

    isProcessingQueue = true;

    while (messageQueue.length > 0) {
      const message = messageQueue[0];
      try {
        // Decrypt and save the message
        await handleUnreadMessages(message);
        // If successful, remove the message from the queue
        messageQueue = messageQueue.slice(1);
        // Save the updated queue to AsyncStorage
        await AsyncStorage.setItem(
          'messageQueue',
          JSON.stringify(messageQueue),
        );
      } catch (error) {
        console.error('Failed to save message:', error);
        // If there's an error, don't remove the message from the queue
        // so it can be retried later
      }
    }

    isProcessingQueue = false;
  }

  /// to listen for new messages read all socket
  useEffect(() => {
    const initializeQueue = async () => {
      // Load the queue from AsyncStorage when the app starts
      messageQueue =
        JSON.parse(await AsyncStorage.getItem('messageQueue')) || [];

      // Process the queue
      processQueue();
    };

    if (
      appStateGlobal !== 'background' &&
      isSocketConnected &&
      isFocused &&
      !realm.isClosed
    ) {
      initializeQueue();
      socket.on('readAllMessage', async (data, extraData) => {
        if (Array.isArray(data) && data.length > 0) {
          // Add the new messages to the queue
          messageQueue = [...messageQueue, ...data];
          // Save the updated queue to AsyncStorage
          await AsyncStorage.setItem(
            'messageQueue',
            JSON.stringify(messageQueue),
          );

          if (realm.isClosed) {
            return;
          }
          // Process the queue
          processQueue();
        }
        if (data === 'success' || extraData) {
          readAllMessagesSocket();
        }
      });
      // socket.on('readAllMessage', async (data, extraData) => {
      //   console.log('read all messages data', data, extraData);

      //   if (Array.isArray(data) && data.length > 0) {
      //     handleUnreadMessages(data);
      //   }
      //   if (data === 'success' || extraData) {
      //     readAllMessagesSocket();
      //   }
      // });

      socket.on('deleteMessage', async messageDetails => {
        if (messageDetails.isDeleted) {
          onMessageDelete(messageDetails._id);
        }
        // alert('delete');
        console.log('deleted message', messageDetails);
      });

      socket.on('receiveMessage', async messageDetails => {
        if (realm.isClosed) {
          return;
        }
        if (messageDetails.isDeleted) {
          onMessageDelete(messageDetails._id);
        }
        scrollToBottom();

        try {
          if (
            ['image', 'video', 'audio', 'doc'].includes(messageDetails.type)
          ) {
            insertPlaceholderMessage(messageDetails);

            await handleMediaMessage(messageDetails);
            setextraInfo(messageDetails?._id);
          } else {
            await handleTextMessage(messageDetails);
            setextraInfo(messageDetails?._id);
          }
          socket.emit('messageReceived', {
            messageId: messageDetails._id,
            id: VARIABLES.user._id,
          });
        } catch (error) {
          console.error('Error handling received message:', error);
        }
      });
      socket.on('updateMessage', async data => {
        if (data.isDeleted) {
          onMessageDelete(data._id);
        }
        updateReactionQueue(data);
      });
    }

    return () => {
      if (isSocketConnected) {
        socket.off('updateMessage');
        socket.off('receiveMessage');
        socket.off('readAllMessage');
        socket.off('deleteMessage');
      }
    };
  }, [isSocketConnected, isFocused, appStateGlobal, realm]);

  const isTypingTimeout = useRef();

  /// to listen for receinve sender messsage,typing status and message received listener
  useEffect(() => {
    if (
      appStateGlobal !== 'background' &&
      isSocketConnected &&
      socket &&
      isFocused &&
      !realm.isClosed
    ) {
      socket.on('receiveSenderMessage', data => {
        receiveSenderMessages(data);
      });
      socket.on('messageReceived', async data => {
        readAllMessagesSocket();
      });
      socket.on('isTyping', data => {
        clearTimeout(isTypingTimeout.current);
        setisPartnerTyping(data);
        if (data) {
          isTypingTimeout.current = setTimeout(
            () => setisPartnerTyping(false),
            5000,
          ); // 5 seconds
        }
      });
    }

    return () => {
      if (socket && isSocketConnected) {
        socket.off('receiveSenderMessage');
        socket.off('messageReceived');
        ///  socket.removeListener('receiveMessage');
        socket.off('receiveReaction');
        socket.off('isTyping');
      }
    };
  }, [isSocketConnected, socket, isFocused, appStateGlobal, realm]);

  /// useffect to resend offline messages
  const resendOfflineMessages = useCallback(() => {
    const offlineMessages = realm.objects('Message').filtered('status == 0');
    console.log('offline messages', Platform.OS, offlineMessages);
    offlineMessages.forEach(message => {
      if (VARIABLES.user._id === message.sender) {
        sendThroughSocket(message);
      }
    });
  }, [realm, sendThroughSocket]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (
        state.isConnected &&
        !realm.isClosed &&
        state.isInternetReachable &&
        isSocketConnected
      ) {
        resendOfflineMessages();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isSocketConnected, resendOfflineMessages, realm]);

  /// function to handle sheet record audio changes
  const handleSheetRecordAudioChanges = useCallback(index => {
    if (index === -1) {
      setTimeout(async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
      }, 1);
      setisRecordingEnabled(false);
      setIsAudioRecording(false);
      setIsRecordingPause(false);
      setSheetEnabled(false);
      setAudioFile('');
      setRecordTime('00:00');
    }
  }, []);

  /// to fetch giphy data
  useEffect(() => {
    // Define the URL for the Giphy API GET request
    const apiUrl = `https://tenor.googleapis.com/v2/search?q=random&key=${GIF_API_KEY}&client_key=com.closer"`;

    // Make a GET request to the Giphy API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Extract the GIFs from the API response
        const gifData = data.results || [];

        setGifs(gifData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Run this effect only once, when the component mounts

  /// to fetch giphy data
  // useEffect(() => {
  //   // Define the URL for the Giphy API GET request
  //   const apiUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${GIF_API_KEY}`;

  //   // Make a GET request to the Giphy API
  //   fetch(apiUrl)
  //     .then(response => response.json())
  //     .then(data => {
  //       // Extract the GIFs from the API response
  //       const gifData = data.data || [];

  //       setGifs(gifData);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []); // Run this effect only once, when the component mounts

  /// function to search gifs
  useEffect(() => {
    const apiUrl = `https://tenor.googleapis.com/v2/search?q=${searchGifQuery}&key=${GIF_API_KEY}&client_key=com.closer"`;
    searchGifQuery?.length != 0 && setgifLoading(true);
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const gifData = data.results || [];
        setgifLoading(false);
        // Update the state with the GIF data

        setsearchGifs(gifData);
      })
      .catch(error => {
        setgifLoading(false);
        console.error('Error fetching data:', error);
      });

    return () => {};
  }, [searchGifQuery]);

  /// function to handle sheet changes
  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setSheetEnabled(false);
      setVisible(false);
    }
  }, []);

  /// function to handle sheet emoji changes
  const handleSheetEmojiChanges = useCallback(index => {
    if (index === -1) {
      setSheetEnabled(false);
      setVisible(false);
      let tabs = [...icontabs];
      tabs[0].selected = true;
      tabs[1].selected = false;
      tabs[2].selected = false;
      setIconTabs(tabs);
    }
  }, []);

  /// function to handle audio permissions
  const audioPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          onStartRecord();
        } else {
          onStartRecord();
          //  ToastMessage('Please check the device permissions to record audio');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    } else {
      onStartRecord();
    }
  };

  const fileName = `recording${Date.now()}.mp4`;

  const audioSet = {
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };

  const path = Platform.select({
    ios: fileName,
    android: fileName,
  });

  /// function to start recording
  const onStartRecord = async () => {
    setIsAudioRecording(true);

    if (Platform.OS === 'ios') {
      await audioRecorderPlayer.startRecorder(path, audioSet);
    } else {
      await audioRecorderPlayer.startRecorder();
    }

    // await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      if (
        audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)) !==
        '00:00'
      ) {
        setRecordTime(
          audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)),
        );
      }

      if (
        audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)) ===
        '00:30'
      ) {
        onStopRecord();
      }
      return;
    });
  };

  /// function to pause recording
  const onPauseRecorder = async () => {
    try {
      await audioRecorderPlayer.pauseRecorder();
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  };

  /// function to resume recording
  const onResumeRecorder = async () => {
    try {
      await audioRecorderPlayer.resumeRecorder();
    } catch (error) {
      console.error('Error pausing recording:', error);
    }
  };

  /// function to stop recording
  const onStopRecord = async (save = true) => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setMusicFileExtension(result.split('.').pop());
    save && setAudioFile(result);
    setIsAudioRecording(false);
  };

  /// function to handle icon tab changes
  const IconTabHandler = index => {
    const tabUpdated = icontabs.map((item, idx) => {
      return index === idx
        ? {...item, selected: true}
        : {...item, selected: false};
    });

    setIconTabs(tabUpdated);
  };

  /// function to render stickers
  const stickerItem = ({item, containerStyle}) => {
    return (
      <Pressable
        onPress={() => {
          console.log('sticky picked', item);
          ///  Sentry.captureException(JSON.stringify(item));

          //  if (isReactionEnabled) {
          updateRecentlyUsedEmoji(STICKERS[Number(item.id)]);
          //  }
          setSheetEnabled(false);
          setsearchGifQuery('');
          bottomSheetEmojiModalRef.current.dismiss();
          if (isReactionEnabled) {
            SendReactionHandler(item.sticker, 'sticker', undefined, item.id);
          } else {
            console.log('itemmmmmm', item);
            SendMessageHandler(item.id.toString(), 'sticker');
          }
        }}
        style={{width: SCREEN_WIDTH / 5, ...containerStyle}}>
        <FastImage
          source={item.sticker}
          style={{width: 48, height: 44}}
          resizeMode="contain"
        />
      </Pressable>
    );
  };

  /// function to read all messages socket
  const readAllMessagesSocket = async () => {
    if (realm.isClosed) {
      return;
    }
    const newArray = await getStateDataAsync(setchatdata);

    // Open a write transaction to update the status in Realm
    realm.write(() => {
      newArray.forEach(c => {
        if (c.status !== 0 && c.status !== 3) {
          // Find the message in Realm and update its status
          let messageToUpdate = realm.objectForPrimaryKey('Message', c._id);
          if (messageToUpdate) {
            messageToUpdate.status = 3;
          }
        }
      });
    });

    setextraInfo(chatId);
  };

  /// function to handle unread messages
  const handleUnreadMessages = async messageDetails => {
    const existingMessage = realm.objectForPrimaryKey(
      'Message',
      messageDetails._id,
    );

    if (existingMessage !== null) {
      if (messageDetails.isDeleted) {
        onMessageDelete(messageDetails._id);
      } else {
        onUpdateMessage2(messageDetails, existingMessage, realm);
      }
    } else {
      if (messageDetails.isDeleted) {
        return;
      }
      if (messageDetails.message !== '') {
        try {
          if (
            ['image', 'video', 'audio', 'doc'].includes(messageDetails.type)
          ) {
            insertPlaceholderMessage(messageDetails);
            await handleMediaMessage(messageDetails);
          } else {
            await handleTextMessage(messageDetails);
          }
        } catch (error) {
          console.error('Error handling bulk received message:', error);
        }
      } else {
        updateReactionQueue(messageDetails);
      }
    }
  };

  /// function to update reaction queue
  const updateReactionQueue = data => {
    console.log('updat ereaction data', JSON.stringify(data));
    try {
      // Query Realm DB for the message
      let messageToUpdate = realm.objectForPrimaryKey('Message', data.id);

      if (messageToUpdate) {
        // Existing logic to process reactions
        const myReaction = messageToUpdate.reactions.find(
          reaction => reaction.sender || reaction.user === VARIABLES.user._id,
        );
        const otherReactions = data.reactions.filter(
          reaction => reaction.user !== VARIABLES.user._id,
        );
        const updatedReactions = myReaction
          ? [myReaction, ...otherReactions]
          : [...otherReactions];

        // Update the message reactions in Realm
        realm.write(() => {
          messageToUpdate.reactions = updatedReactions;
        });

        // Additional logic if required
        // setextraInfo(arg[0]);
      }
    } catch (e) {
      console.log('Error on reaction update in Realm', e);
    }
  };

  /// function to handle text message
  async function handleTextMessage(messageDetails) {
    const message = await decryptAndVerifyMessage(
      messageDetails.message,
      messageDetails.nonce,
      VARIABLES.user?.partnerData?.partner?.publicKey,
      VARIABLES.user?.partnerData?.partner?.signedPublicKey,
    );

    onSendMessage(
      {
        ...messageDetails,
        message: message,
        chatId: '', // Adjust as needed
      },
      realm,
    );
  }

  function insertPlaceholderMessage(messageDetails) {
    const placeholderMessage = {
      ...messageDetails,
      // Add additional properties for the placeholder
      isPlaceholder: true,
      downloadProgress: 0,
    };
    onSendMessage(placeholderMessage, realm);
  }

  async function handleMediaMessage(messageDetails) {
    if (messageDetails?.isDeleted) {
      realm.write(() => {
        realm.delete(message);
      });
      return;
    }
  }

  const receiveSenderMessages = async data => {
    onUpdateMessage(
      {
        ...data,
        chatId: '',
      },
      realm,
    );
    setextraInfo(data?.id);
  };

  const onLongPressChatItem = item => {
    setIsReactionEnabled(true);
    setChatId(item?._id);
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
    handlePresentEmojiModalPress();
  };

  const handlePress = async pressedChatId => {
    const fullMessageList = realm.objects('Message').sorted('createdAt', true);
    const firstResultIndex = fullMessageList.findIndex(
      m => m._id === pressedChatId,
    );

    if (firstResultIndex >= 0) {
      const messagesToLoad = fullMessageList.slice(0, firstResultIndex + 1);

      if (messagesToLoad.length > chatdata.length) {
        lastIndex = messagesToLoad.length;
        setchatdata([...messagesToLoad]); // Replace existing messages
      }

      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          animated: false,
          index: firstResultIndex,
        });
      }, 1000);

      setCurrentSearchIndex(0); // Set the current index to the first result
    }

    ///  // Find the index of the chat message in the data array
    // const chatData = await getStateDataAsync(setchatdata);
    // const index = chatData.findIndex(currenctMessage => {
    //   return currenctMessage._id === pressedChatId;
    // });
    // console.log(index);

    // // Scroll to the chat message by index
    // if (index >= 0) {
    //   setisNavigation(false);
    //   await delay(20);
    //   flatListRef.current.scrollToIndex({index: index, animated: true});
    // } else {
    //   //// need to fix this on quoted message not navigating to main message
    //   // setinitialNumToRenderProp(chatData.length + limit);
    //   // setisNavigation(pressedChatId);
    // }
  };

  const navigateToQuotedMessage = item => {
    if (item?.quotedMessage?.isDeleted) {
      ToastMessage('The message has been deleted');
      return;
    }
    if (item?.quotedMessage?._id) {
      handlePress(item?.quotedMessage?._id);
    }
  };

  const openFullPageImage = url => {
    setViewImage(url);
    setVisibleImage(true);
  };

  const renderChatItem = ({item, index}) => {
    return (
      <ChatItem
        searchWord={isSearching ? [searchInput] : ['']}
        item={item}
        prevItem={index !== chatdata.length ? chatdata[index + 1] : {}}
        index={index}
        onLongPress={onLongPressChatItem}
        onPress={navigateToQuotedMessage}
        openImage={openFullPageImage}
        setCurrentIndex={setcurrentActiveAudio}
        currentIndec={currentActiveAudio}
        chatDataLength={chatdata.length}
        currentSearchIndex={searchIndexFound}
      />
    );
  };

  const SendReactionHandler = async (reaction, type, id, stickerId) => {
    CleverTap.recordEvent('Sticker reactions added');

    console.log(
      'update sockert reaction new',
      stickerId?.toString(),
      Platform.OS,
      stickerId,
    );

    socket.emit('updateMessage', {
      reaction: reaction,
      reactionNew: stickerId?.toString(),
      chatId: id !== undefined ? id : chatId,
      sender: VARIABLES.user?._id,
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      type: type,
    });

    const obj = {
      reaction: reaction.toString(),
      reactionNew: stickerId?.toString(),
      // reactionNew: reaction.toString(),
      _id: id !== undefined ? id : chatId,
      user: VARIABLES.user?._id,
      type: type,
    };

    try {
      realm.write(() => {
        const updatedChatId = id !== undefined ? id : chatId;
        let messageToUpdate = realm.objectForPrimaryKey(
          'Message',
          updatedChatId,
        );
        if (messageToUpdate) {
          let isReactedIndex = messageToUpdate.reactions.findIndex(
            i => i.user === obj.user,
          );

          if (isReactedIndex !== -1) {
            messageToUpdate.reactions[isReactedIndex] = obj;
          } else {
            messageToUpdate.reactions.push(obj);
          }
        }
      });
    } catch (e) {
      console.log('Error on reaction update', e);
    }

    setextraInfo(chatId);
    setIsReactionEnabled(false);
  };

  const SendMessageHandler = async (message, type, ...args) => {
    if (realm.isClosed) {
      ToastMessage('Something went wrong please close you app and open again');
      return;
    }
    if (VARIABLES.disableTouch) {
      ToastMessage(
        'You can’t send message as you are not connected to any partner yet',
      );
      setTimeout(() => {
        setisInputDisabled(false);
      }, 1000);
      return;
    }
    setSheetEnabled(false);
    if (!VARIABLES.user?.partnerData?.partner) {
      setTimeout(() => {
        setisInputDisabled(false);
      }, 1000);
      return;
    }
    if (type !== 'sticker' && message.trim() === '') {
      setTimeout(() => {
        setisInputDisabled(false);
      }, 1000);
      return;
    }

    const id = generateID();

    const updatedMessage = type === 'message' ? message.trim() : message;

    CleverTap.recordEvent('Total chat msgs');

    if (type === 'audio') {
      CleverTap.recordEvent('Chat voice notes');
    } else if (type === 'gif') {
      CleverTap.recordEvent('Chat GIFs');
    }

    let newObj = {
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: updatedMessage,
      sender: VARIABLES.user?._id,
      type: type,
      chatId: isReply
        ? //&&
          //   (type === 'message' || type === 'sticker' || type === 'emoji')
          quotedMessage._id
        : '',
      lat: args?.[0]?.lat,
      long: args?.[0]?.long,
      imageWidth:
        args.length !== 0 && args?.[0].imageWidth !== undefined
          ? args?.[0].imageWidth
          : 0,
      imageHeight:
        args.length !== 0 && args?.[0].imageHeight !== undefined
          ? args?.[0].imageHeight
          : 0,

      status: 0,
      quotedMessage: quotedMessage,
      id,
    };

    const messageDetails = {
      ...newObj,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
    };
    //// remvoe quotedMessage and status key from socket data and change message and add nonce key after encrypting

    onSendMessage(messageDetails, realm);

    if (
      isReply &&
      (type === 'message' ||
        type === 'sticker' ||
        type === 'emoji' ||
        type === 'gif')
    ) {
      newObj.quotedMessage = quotedMessage;
      setRepliedText('');
      setIsReply(false);
      setQuotedMessage(null);
    }

    setMessage('');

    flatListRef.current.scrollToOffset({animated: false, offset: 0});

    onSendMsgSocket(messageDetails);

    // setTimeout(() => {
    //   setisInputDisabled(false);
    // }, 1000);
  };

  const sendAudioNote = async () => {
    if (recordTime === '00:00') {
      ToastMessage('Please record audio note');
      return;
    }

    if (!VARIABLES.user?.partnerData?.partner) {
      return;
    }

    const newUuid = generateID();
    setIsAudioRecording(false);
    setSheetEnabled(false);
    bottomSheetModalRecordAudioRef.current.dismiss();
    // setAudioLoading(true);

    flatListRef.current.scrollToOffset({animated: false, offset: 0});
    // StoreLocalImage(audioFile, newUuid);
    const filename =
      newUuid + audioFile.substring(audioFile.lastIndexOf('/') + 1);
    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    let newObj = {
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: filename,
      sender: VARIABLES.user?._id,
      type: 'audio',
      recordTime: recordTime,
      mime: musicFileExtension,
      status: 0,
      id: newUuid,
    };

    const messageDetails = {
      ...newObj,
      _id: newUuid,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
    };

    onSendMessage(messageDetails, realm);
    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(audioFile, localFilePath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
    CleverTap.recordEvent('Chat voice notes');
    onSendMediaSocket(messageDetails, audioFile);
    setAudioFile('');
  };

  const handlePresentEmojiModalPress = useCallback(() => {
    if (realm.isClosed) {
      ToastMessage('Something went wrong please close you app and open again');
      return;
    }
    if (VARIABLES.disableTouch) {
      ToastMessage(
        'You can’t send a reaction as you are not connected to any partner yet',
      );
      return;
    }
    Keyboard.dismiss();
    setsearchGifQuery('');
    bottomSheetEmojiModalRef.current.present();
    setSheetEnabled(true);
  }, []);

  const handlePresentModalPress = useCallback(() => {
    if (realm.isClosed) {
      ToastMessage('Something went wrong please close you app and open again');
      return;
    }
    if (VARIABLES.disableTouch) {
      ToastMessage(
        'You can’t send attachment as you are not connected to any partner yet',
      );
      return;
    }
    Keyboard.dismiss();
    bottomSheetModalRef.current.present();
    setSheetEnabled(true);
  }, []);

  const handlePresentModalRecordAudioPress = useCallback(() => {
    bottomSheetModalRecordAudioRef.current.present();
    audioPermissions();
    setSheetEnabled(true);
  }, []);

  const sendThroughSocket = message => {
    if (
      message.type === 'image' ||
      message.type === 'video' ||
      message.type === 'doc' ||
      message.type === 'audio'
    ) {
      const path = `${RNFS.DocumentDirectoryPath}/${message.message}`;
      onSendMediaSocket(message, path);
    } else {
      onSendMsgSocket(message);
    }
  };

  const onSendMediaSocket = async (messageDetails, path) => {
    const messageStringy = JSON.stringify(messageDetails);
    const messgeParse = JSON.parse(messageStringy);

    if (isConnected) {
      try {
        const s3response = await uploadEncryptedToS3(
          path,
          messgeParse.message,
          messgeParse.mime,
          'chat',
        );

        // const s3response = await uploadEncryptedToS3(
        //   path,
        //   messgeParse.message,
        //   messgeParse.mime,
        //   'chat',
        // );

        if (!socket) {
          return;
        }

        console.log('message to send', messgeParse, 's3 response', s3response);

        socket.emit('sendMessage', {
          ...messgeParse,
          message: messgeParse.message,
          nonce: s3response.nonce,
        });
      } catch (error) {
        setloading(false);
        ToastMessage(
          "Sorry media couldn't upload to server due to some error.",
        );
      }
    }
  };

  const onSendMsgSocket = async messageDetails => {
    const messageStringy = JSON.stringify(messageDetails);
    const messgeParse = JSON.parse(messageStringy);
    if (isConnected) {
      try {
        const {encryptedMessage, nonce} = await encryptAndSignMessage(
          messgeParse.message,
        );

        socket.emit('sendMessage', {
          ...messgeParse,
          message: encryptedMessage,
          nonce: nonce,
        });
      } catch (error) {
        // Handle errors
        console.error('Error in sending secure message:', error);
      }
    }
  };

  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const searchDebounceTimer = useRef(null);

  useEffect(() => {
    if (realm.isClosed) {
      ToastMessage('Something went wrong please close your app and open again');
    }
  }, [realm]);

  // Fetch initial messages and set up listeners
  useEffect(() => {
    if (realm.isClosed) {
      return;
    }
    const initializeChat = async () => {
      const initialMessages = realm
        .objects('Message')
        .sorted('createdAt', true)
        .slice(0, pageSize);
      setchatdata(initialMessages);
    };

    initializeChat();

    const messages = realm.objects('Message').sorted('createdAt', true);

    const onChange = (newMessages, changes) => {
      setchatdata(prevChatData => {
        // First, handle deletions by filtering out the invalidated messages
        let updatedChatData = prevChatData;
        //.filter(m => m.isValid());

        // Now handle insertions and modifications
        changes.insertions.concat(changes.modifications).forEach(index => {
          const message = newMessages[index];
          if (message.isValid()) {
            // Ensure the message is still valid
            const existingIndex = updatedChatData.findIndex(
              m => m._id === message._id,
            );

            if (existingIndex !== -1) {
              // Update existing message
              updatedChatData[existingIndex] = message;
            } else {
              // Add new message
              updatedChatData = [message, ...updatedChatData];
            }
          }
        });

        return updatedChatData;
      });

      setextraInfo(true);
    };

    messages.addListener(onChange);

    // Clean-up function
    return () => {
      messages.removeListener(onChange);
    };
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !isLoading && !realm.isClosed) {
      loadMessages();
    }
  };

  const loadMessages = async () => {
    setIsLoading(true);

    // Fetch a slice of the messages
    const sortedMessages = realm
      .objects('Message')
      .sorted('createdAt', true)
      .slice(chatdata.length, chatdata.length + pageSize);

    // const updtatedChat = await getStateDataAsync(setchatdata)

    // Ensure only unique messages are in chatdata
    const updatedChatData = new Map(chatdata.map(msg => [msg._id, msg]));
    sortedMessages.forEach(msg => updatedChatData.set(msg._id, msg));

    setchatdata(Array.from(updatedChatData.values()));
    setIsLoading(false);

    // Update lastIndex for the next load
    lastIndex += sortedMessages.length;
    if (sortedMessages.length === 0) {
      setHasMore(false); // No more messages to load
    }
  };
  const [messageHeights, setMessageHeights] = useState([]);

  const chatSearchMessage = text => {
    setSearchInput(text);
  };

  const onSearchSubmit = () => {
    if (realm.isClosed) {
      return;
    }
    // // Clear the previous timer
    // if (searchDebounceTimer.current) {
    //   clearTimeout(searchDebounceTimer.current);
    // }

    // searchDebounceTimer.current = setTimeout(() => {
    //   if (searchInput.trim() === '') {
    //     setSearchResults([]);
    //   } else {

    const query = `message CONTAINS[c] "${searchInput}" OR sender CONTAINS[c] "${searchInput}"`;
    const results = realm.objects('Message').filtered(query);

    setSearchResults(results);
    if (results.length > 0) {
      //  Keyboard.dismiss();
      searchAndLoadMessage(results);
    }

    setCurrentSearchIndex(0); // Start from the first result
    //   }

    // }, 2000); // Adjust delay as needed
  };

  const searchAndLoadMessage = searchResults => {
    const fullMessageList = realm.objects('Message').sorted('createdAt', true);
    const firstResultIndex = fullMessageList.findIndex(
      m => m._id === searchResults[0]._id,
    );

    if (firstResultIndex >= 0) {
      const messagesToLoad = fullMessageList.slice(0, firstResultIndex + 1);

      if (messagesToLoad.length > chatdata.length) {
        lastIndex = messagesToLoad.length;
        setchatdata([...messagesToLoad]); // Replace existing messages
      }
      setCurrentSearchIndex(0); // Set the current index to the first result
    }
  };

  // Perform the actual search in a useEffect hook
  // useEffect(() => {
  //   if (realm.isClosed) {
  //     return;
  //   }
  //   // Clear the previous timer
  //   if (searchDebounceTimer.current) {
  //     clearTimeout(searchDebounceTimer.current);
  //   }

  //   searchDebounceTimer.current = setTimeout(() => {
  //     if (searchInput.trim() === '') {
  //       setSearchResults([]);
  //     } else {
  //       const query = `message CONTAINS[c] "${searchInput}" OR sender CONTAINS[c] "${searchInput}"`;
  //       const results = realm.objects('Message').filtered(query);

  //       setSearchResults(results);
  //       if (results.length > 0) {
  //         Keyboard.dismiss();
  //         searchAndLoadMessage(results);
  //       }

  //       setCurrentSearchIndex(0); // Start from the first result
  //     }
  //   }, 2000); // Adjust delay as needed

  //   // Cleanup
  //   return () => {
  //     if (searchDebounceTimer.current) {
  //       clearTimeout(searchDebounceTimer.current);
  //     }
  //   };
  // }, [searchInput]);

  useEffect(() => {
    if (searchResults.length > 0) {
      //  setloading(true);
      Keyboard.dismiss();
      setTimeout(() => {
        Keyboard.dismiss();
        navigateToMessage(currentSearchIndex);
      }, 20);
    }
  }, [currentSearchIndex, searchResults]);

  const [searchIndexFound, setSearchIndexFound] = useState(null);

  const navigateToMessage = async index => {
    const messageId = searchResults[index]._id;
    const latestChatData = await getStateDataAsync(setchatdata);
    const messageIndex = latestChatData.findIndex(m => m._id === messageId);

    if (messageIndex !== -1) {
      setSearchIndexFound(messageIndex);
      setTimeout(() => {
        try {
          flatListRef.current.scrollToIndex({
            animated: false,
            index: messageIndex,
          });

          setloading(false);
        } catch (error) {
          alert('error');
        }
      }, 4);
    }
  };

  const goToNextResult = () => {
    if (currentSearchIndex < searchResults.length - 1) {
      //  setloading(true);
      setCurrentSearchIndex(currentSearchIndex + 1);
    }
  };

  const goToPreviousResult = () => {
    if (currentSearchIndex > 0) {
      //  setloading(true);
      setCurrentSearchIndex(currentSearchIndex - 1);
    }
  };

  const AppHeader = () => {
    return (
      <View
        style={{
          backgroundColor: '#FCEEE0',
        }}>
        <View style={{...styles.headerContainer, backgroundColor: '#FCEEE0'}}>
          <View
            style={{
              marginTop:
                Platform.OS === 'android' ? -StatusBar.currentHeight : 0,
              width: '100%',
              borderRadius: 30,
              alignSelf: 'baseline',
              overflow: 'hidden',
            }}>
            <ProfileHeaderSvg themeColor={'#FCEEE0'} strokeColor={'#F4E5D6'} />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: scale(23),
              // backgroundColor: 'red',
              width: '100%',
              // marginHorizontal: 16
            }}>
            {isSearching ? (
              <View style={styles.searchContainer}>
                <SearchIconSvg style={{marginEnd: scale(12)}} />
                <TextInput
                  ref={searchInputRef}
                  placeholder="Search here"
                  placeholderTextColor={'gray'}
                  style={{
                    paddingVertical: scale(12),
                    flex: 1,
                    ...globalStyles.regularLargeText,
                    padding: 0,
                    margin: 0,
                    marginTop: 2,
                  }}
                  value={searchInput}
                  onSubmitEditing={() => {
                    onSearchSubmit();
                  }}
                  onChangeText={text => chatSearchMessage(text)}
                  onBlur={() => {
                    if (searchInput.trim().length === 0) {
                      setIsSearching(false);
                      setSearchInput('');
                      setSearchIndexFound(null);
                      setextraInfo(null);
                      if (
                        typeof flatListRef?.current?.scrollToOffset ===
                        'function'
                      ) {
                        flatListRef?.current?.scrollToOffset?.({
                          animated: false,
                          offset: 0,
                        });
                      }
                    } else {
                      onSearchSubmit();
                    }
                    // setIsSearching(false)
                    // setSearchInput('')
                    // getConversation(0)
                  }}
                  autoFocus
                />

                {searchResults.length > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginEnd: scale(12),
                    }}>
                    <Pressable
                      disabled={currentSearchIndex === 0}
                      onPress={goToPreviousResult}>
                      <Image
                        tintColor={
                          currentSearchIndex === 0 ? 'gray' : colors.blue1
                        }
                        source={require('../../../assets/images/chat-arrow-up.png')}
                      />
                    </Pressable>
                    <Pressable
                      disabled={currentSearchIndex === searchResults.length - 1}
                      onPress={goToNextResult}>
                      <Image
                        style={{marginStart: scale(4)}}
                        tintColor={
                          currentSearchIndex === searchResults.length - 1
                            ? null
                            : colors.blue1
                        }
                        source={require('../../../assets/images/chat-arrow-down.png')}
                      />
                    </Pressable>
                  </View>
                )}

                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    setIsSearching(false);
                    setSearchIndexFound(null);
                    setextraInfo(null);
                    setSearchInput('');
                    if (flatListRef?.current !== null) {
                      flatListRef.current.scrollToOffset({
                        animated: false,
                        offset: 0,
                      });
                    }
                    // setSearchedChatData([]);
                    // getConversation(0)
                  }}>
                  <BlueCloseCircleIconSvg />
                </Pressable>
              </View>
            ) : (
              <View style={styles.userProfileContainer}>
                <Pressable
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    if (realm.isClosed) {
                      ToastMessage(
                        'Something went wrong please close your app and open again',
                      );
                      return;
                    }
                    bottomSheetModalRef.current.dismiss();
                    props.navigation.navigate('profileInfo', {
                      setTheme: setThemeColor,
                      setStroke: setStrokeColor,
                      setRepliedText: setRepliedText,
                      setQuotedMessage: setQuotedMessage,
                      setChatId: setChatId,
                      setIsReply: setIsReply,
                      socket: socket,
                    });
                  }}>
                  <View hitSlop={hitSlopProp}>
                    <ProfileAvatar type="partner" style={styles.userImage} />
                  </View>
                  <View>
                    <Text
                      style={{
                        ...globalStyles.semiBoldLargeText,
                        marginStart: scale(12),
                        fontSize: scale(18),
                        fontWeight: 500,
                      }}>
                      {VARIABLES.user?.partnerData?.partner?.name
                        ? VARIABLES.user?.partnerData?.partner?.name
                        : 'Partner'}
                    </Text>

                    {isPartnerTyping && (
                      <View>
                        <Text
                          style={{
                            fontFamily: fonts.italicFont,
                            marginStart: scale(12),
                            fontSize: scale(14),
                            color: 'black',
                          }}>
                          typing...
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
                <Pressable
                  hitSlop={10}
                  onPress={async () => {
                    setIsSearching(true);
                    setTimeout(() => {
                      searchInputRef.current?.focus?.();
                    }, 2000);
                  }}>
                  <Image
                    source={APP_IMAGE.searchWhiteBack}
                    style={{width: scale(42), height: scale(42)}}
                  />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const handleLocationShare = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always')
        .then(result => {
          if (result === 'granted') {
            Geolocation.getCurrentPosition(
              info => {
                setSheetEnabled(false);
                SendMessageHandler('current location', 'location', {
                  lat: info?.coords?.latitude,
                  long: info?.coords?.longitude,
                });
              },
              error => {
                console.log(error.message);
              },
              {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
            );
          } else {
            // displayToast('in error');
            Alert.alert(
              'Turn on Location Services to allow Closer to determine your location.',
              '',
              [
                {text: 'Go to Settings', onPress: openSetting},
                // {text: "Don't Use Location", onPress: () => {}},
              ],
            );
          }
        })
        .catch(error => console.log(error));
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Device current location permission',
            message: 'Allow app to get your current location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            info => {
              setSheetEnabled(false);
              SendMessageHandler('current location', 'location', {
                lat: info?.coords?.latitude,
                long: info?.coords?.longitude,
              });
            },
            error => {
              console.log(error.message);
            },
            {
              enableHighAccuracy: false,
              timeout: 20000,
              maximumAge: 1000,
              forceLocationManager: true,
              forceRequestLocation: true,
            },
          );
        } else {
          Alert.alert(
            'Turn on Location Services to allow Closer to determine your location.',
            '',
            [{text: 'Go to Settings', onPress: openSetting}],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const addContentItem = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          bottomSheetModalRef.current.dismiss();
          if (item.key === 'Media') {
            setSheetEnabled(false);
            setGalleryAndCameraModal(true);
            setisVideo(false);
            // openGallery()
          } else if (item.key === 'Location') {
            handleLocationShare();
          } else if (item.key === 'Document') {
            VARIABLES.isMediaOpen = true;
            setSheetEnabled(false);
            handleDocumentSelection();
          } else if (item.key === 'Audio') {
            VARIABLES.currentSound?.stop?.();
            setisRecordingEnabled(true);
            setSheetEnabled(true);
            handlePresentModalRecordAudioPress();
          } else if (item.key === 'video') {
            setSheetEnabled(false);
            setGalleryAndCameraModal(true);
            setisVideo(true);
          }
        }}>
        <View>{item.icon}</View>
        <Text
          style={{...globalStyles.regularLargeText, marginStart: scale(16)}}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    EventRegister.on('messageReactionRecent', data => {
      SendReactionHandler(data.sticker, data.type, data._id, data.id);
    });

    return () => {
      EventRegister.removeEventListener('messageReactionRecent');
    };
  }, []);

  useEffect(() => {
    // Listener for reply actions
    const replyListener = data => {
      swipeGestureHandler(data);
    };

    // Listener for delete actions
    const deleteListener = async id => {
      console.log('delete press data', id);
      onDeleteMessageBackend(id);
    };

    EventRegister.on('replyPress', replyListener);
    EventRegister.on('deletePress', deleteListener);

    return () => {
      EventRegister.removeEventListener('replyPress', replyListener);
      EventRegister.removeEventListener('deletePress', deleteListener);
    };
  }, []);

  const onMessageDelete = async id => {
    try {
      realm.write(() => {
        const messageToUpdate = realm.objectForPrimaryKey('Message', id);
        if (messageToUpdate) {
          messageToUpdate.isDeleted = true;

          setextraInfo(id);
        } else {
          console.warn('Message not found in Realm database.');
        }
      });

      // const updatedChatData = realm
      //   .objects('Message')

      //   .sorted('createdAt', true);
      // setchatdata(updatedChatData);
    } catch (error) {
      console.error('Error updating message:', error);
    } finally {
      setextraInfo(id);
    }
  };

  const onDeleteMessageBackend = async id => {
    try {
      const resp = await API('user/home/chat?chatId=' + id, 'DELETE');
      onMessageDelete(id);
      console.log('onDeleteMessageBackend', resp);
    } catch (error) {}
  };

  const swipeGestureHandler = useCallback(
    async data => {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 200);
      const newChatData = await getStateDataAsync(setchatdata);
      console.log('swipeGestureHandler', newChatData[data]);
      setIsReply(true);
      setRepliedText(newChatData[data]?.message);
      setQuotedMessage(newChatData[data]);
      setChatId(newChatData[data]?._id);
    },
    [chatdata, setchatdata],
  );

  const handleDocumentSelection = async () => {
    if (!VARIABLES.user?.partnerData?.partner) {
      return;
    }
    //  setloading(true);
    DocumentPicker.pickSingle({
      presentationStyle: 'fullScreen',
      type: DocumentPicker.types.pdf,
    })
      .then(async res => {
        VARIABLES.isMediaOpen = false;
        if (res.size > 15000000) {
          ToastMessage('Please upload a file under 15 MB');
          return;
        }
        const id = generateID();
        const filename = id + res.name;

        //  setloading(true);
        let newObj = {
          receiver: VARIABLES.user?.partnerData?.partner?._id,
          message: filename,
          sender: VARIABLES.user?._id,
          type: 'doc',
          mime: res.type,
          docName: res.name,
          status: 0,
          id,
        };

        const messageDetails = {
          ...newObj,
          _id: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          messageTime: new Date(),
        };

        // StoreLocalImage(res.uri, filename);
        const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

        try {
          // Copy the image to the destination directory
          await RNFS.copyFile(res.uri, localFilePath);
        } catch (error) {
          console.log('Error uploading image:', error);
        }

        onSendMessage(messageDetails, realm);

        flatListRef.current.scrollToOffset({animated: false, offset: 0});
        setloading(false);
        onSendMediaSocket(messageDetails, res.uri);
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        setloading(false);
        if (DocumentPicker.isCancel(err)) {
          console.log(err);
        } else {
          throw err;
        }
      });
  };

  const itemContentSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: strokeColor,
          width: '100%',
          marginVertical: 10,
        }}
      />
    );
  };

  const handleVideoUpload = async image => {
    if (!VARIABLES.user?.partnerData?.partner) {
      setGalleryAndCameraModal(false);
      return;
    }

    const id = generateID();
    const {path} = image;
    const filename = id + path.substring(image.path.lastIndexOf('/') + 1);

    setGalleryAndCameraModal(false);
    //  setloading(true);

    let newObj = {
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: filename,
      sender: VARIABLES.user?._id,
      type: 'video',
      chatId: '',
      imageWidth: 0,
      imageHeight: 0,
      mime: image.mime,
      status: 0,
      quotedMessage: null,
      id,
    };

    const thumbnail = await createThumbnail({
      url: `file://${path}`,
      timeStamp: 1000,
    });

    const thumbnailFilename = generateID() + Date.now();
    const newThumbnailPath = `${RNFS.DocumentDirectoryPath}/${thumbnailFilename}.jpg`;
    await RNFS.copyFile(thumbnail.path, newThumbnailPath);
    const messageDetails = {
      ...newObj,
      _id: id,
      thumbnailImage: `${thumbnailFilename}.jpg`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
    };

    const messageDetails2 = {
      ...newObj,
      _id: id,
      createdAt: new Date(),
      thumbnailImage: `${thumbnailFilename}.jpg`,
      updatedAt: new Date(),
      messageTime: new Date(),
      message: filename,
    };

    onSendMessage(messageDetails2, realm);

    flatListRef.current.scrollToOffset({animated: false, offset: 0});

    const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(path, localFilePath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }

    //  StoreLocalImage(path, filename);

    setloading(false);
    onSendMediaSocket(messageDetails, path);
  };

  const handleGalleryPicker = () => {
    if (!VARIABLES.user?.partnerData?.partner) {
      setGalleryAndCameraModal(false);
      return;
    }
    //  setloading(true);
    ImagePicker.openPicker({
      compressImageQuality: 1,
      mediaType: isVideo ? 'video' : 'photo',
      compressVideoPreset: 'Passthrough',
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
        'Videos',
        'SlomoVideos',
      ],
    })
      .then(async image => {
        ///  setGalleryAndCameraModal(false);
        VARIABLES.isMediaOpen = false;
        if (isVideo) {
          if (image.size > 30000000) {
            ToastMessage('Please upload a file under 30 MB');
            return;
          }

          handleVideoUpload(image);
          return;
        }

        const path = await CompressedImage.compress(image.path);
        const id = generateID();

        const {width, height} = image;
        const filename =
          id + image.path.substring(image.path.lastIndexOf('/') + 1);

        let newObj = {
          receiver: VARIABLES.user?.partnerData?.partner?._id,
          message: filename,
          sender: VARIABLES.user?._id,
          type: 'image',
          chatId: '',
          imageWidth: 0,
          imageHeight: 0,
          mime: image.mime,
          orientation: width > height ? 'VERTICAL' : 'HORIZONTAL',
          status: 0,
          quotedMessage: null,
          id,
        };

        const messageDetails = {
          ...newObj,
          _id: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          messageTime: new Date(),
        };

        onSendMessage(messageDetails, realm);

        flatListRef.current.scrollToOffset({animated: false, offset: 0});
        ///   StoreLocalImage(image.path, filename);
        const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

        try {
          // Copy the image to the destination directory
          await RNFS.copyFile(image.path, localFilePath);
        } catch (error) {
          console.log('Error uploading image:', error);
        }
        setloading(false);

        onSendMediaSocket(messageDetails, path);
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const handleCameraPicker = () => {
    if (!VARIABLES.user?.partnerData?.partner) {
      setGalleryAndCameraModal(false);
      return;
    }
    ImagePicker.openCamera({
      ///   multiple: false,
      ///  compressImageQuality: 0.7,
      mediaType: isVideo ? 'video' : 'photo',
      compressVideoPreset: 'Passthrough',
    })
      .then(async image => {
        //    setGalleryAndCameraModal(false);
        setTimeout(() => {
          VARIABLES.isMediaOpen = false;
        }, 2000);
        if (isVideo) {
          if (image.size > 30000000) {
            ToastMessage('Please upload a file under 30 MB');
            return;
          }
          handleVideoUpload(image);
          return;
        }

        const path = await CompressedImage.compress(image.path);
        const id = generateID();

        const {width, height} = image;
        const filename =
          id + image.path.substring(image.path.lastIndexOf('/') + 1);

        let newObj = {
          receiver: VARIABLES.user?.partnerData?.partner?._id,
          message: filename,
          mime: image.mime,
          sender: VARIABLES.user?._id,
          type: 'image',
          chatId:
            isReply &&
            (type === 'message' || type === 'sticker' || type === 'emoji')
              ? quotedMessage._id
              : '',
          imageWidth: 0,
          imageHeight: 0,
          orientation: width > height ? 'VERTICAL' : 'HORIZONTAL',
          status: 0,
          quotedMessage: null,
          id,
        };

        const messageDetails = {
          ...newObj,
          _id: id,
          createdAt: new Date(),
          updatedAt: new Date(),
          messageTime: new Date(),
        };

        onSendMessage(messageDetails, realm);
        ///  StoreLocalImage(image.path, filename);

        const localFilePath = `${RNFS.DocumentDirectoryPath}/${filename}`;

        try {
          // Copy the image to the destination directory
          await RNFS.copyFile(image.path, localFilePath);
        } catch (error) {
          console.log('Error uploading image:', error);
        }

        flatListRef.current.scrollToOffset({animated: false, offset: 0});
        onSendMediaSocket(messageDetails, path);
        setloading(false);
      })
      .catch(err => {
        setTimeout(() => {
          VARIABLES.isMediaOpen = false;
        }, 2000);
        console.log('error', err);
      });
  };

  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };

  const [showButton, setShowButton] = useState(false);

  const scrollToBottom = () => {
    flatListRef.current.scrollToOffset(0);
  };

  const handleScroll = event => {
    const offset = event.nativeEvent.contentOffset.y;
    // Check if we've scrolled away from the "bottom" (which is visually the top in an inverted list)
    if (offset > 200) {
      // You can set your own threshold
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleSwipe = useCallback(
    index => {
      swipeGestureHandler(index);
    },
    [swipeGestureHandler],
  );

  const keyExtractor = useCallback((item, i) => `${i}-${item.id}`, []);

  console.log('cuerrent search index outside', searchIndexFound);
  return (
    <View style={{flex: 1}}>
      <KeyboardAvoidingView
        //  enabled={true}
        // keyboardVerticalOffset={100}

        style={{flex: 1}}
        behavior={'padding'}>
        <AppView
          showSafeView={false}
          scrollContainerRequired={false}
          isScrollEnabled={false}
          isLoading={loading}
          customContainerStyle={{
            flex: 1,
            backgroundColor: '#FCEEE0',
          }}
          header={AppHeader}>
          <>
            <LinearGradient
              colors={['#E9FFFE', '#F5F5EB', '#FDEDE0', '#FFEBDB']}
              // start={{x: 0, y: 1}}
              // end={{x: 1, y: 0}}
              // locations={[0, 0.7]}
              // useAngle={true}
              // angle={160}
              style={{
                flex: 1,
              }}>
              <FlashList
                ///   scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                  length: messageHeights[index] || 100,
                  offset: messageHeights
                    .slice(0, index)
                    .reduce((a, b) => a + b, 0),
                  index,
                })}
                //  getItemLayout={getItemLayout}
                onScrollToIndexFailed={info => {
                  console.log('scroll failed ', info.index);
                  const wait = new Promise(resolve => setTimeout(resolve, 500));
                  wait.then(() => {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: false,
                    });
                  });
                }}
                initialScrollIndex={currentSearchIndex}
                estimatedItemSize={155}
                // keyboardShouldPersistTaps
                onScroll={handleScroll}
                ref={flatListRef}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        transform: [{scaleY: -1}], // Add this line to reverse the inversion
                        flexDirection:
                          Platform.OS === 'android' ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        backgroundColor: '#ECDDD9',
                        padding: 12,
                        borderRadius: 21,
                        margin: 20,
                      }}>
                      <Image
                        style={{
                          transform:
                            Platform.OS === 'android'
                              ? [{scaleX: -1}]
                              : undefined,
                        }}
                        source={require('../../../assets/images/lockChatE.png')}
                      />
                      <Text
                        style={{
                          ...globalStyles.regularMediumText,
                          fontSize: scale(12),
                          marginHorizontal: scale(10),
                          flexShrink: 1,
                          transform:
                            Platform.OS === 'android'
                              ? [{scaleX: -1}]
                              : undefined,
                        }}>
                        Chats are end-to-end encrypted. No one outside of this
                        chat (including Closer) can read your chats.
                      </Text>
                    </View>
                  );
                }}
                initialNumToRender={initialNumToRenderProp}
                data={chatdata}
                renderItem={({item, index}) => {
                  console.log('cuerrent search index', searchIndexFound);
                  return (
                    <SwipeContainer
                      onSwipe={() => handleSwipe(index)}
                      isLeft={true}
                      // onSwipe={() => {
                      //   swipeGestureHandler(index);
                      // }}
                    >
                      {renderChatItem({item, index})}
                    </SwipeContainer>
                  );
                }}
                inverted
                keyExtractor={keyExtractor}
                //     keyExtractor={(item, index) => item?.id || item?._id || index}
                // keyExtractor={(item, index) => index}
                keyboardDismissMode="interactive"
                onEndReachedThreshold={0.1}
                leftActivationValue={10}
                extraData={extraInfo}
                onEndReached={handleLoadMore}
                ListFooterComponent={() =>
                  isLoading && (
                    <View>
                      <ActivityIndicator />
                    </View>
                  )
                }
              />
              {showButton && (
                <Pressable
                  onPress={() => scrollToBottom()}
                  style={{position: 'absolute', end: 20, bottom: 90}}>
                  <Image
                    source={require('../../../assets/images/scrollToBottom.png')}
                  />
                </Pressable>
              )}
              {tooltipState === '2' && !VARIABLES.disableTouch && (
                <ChatEmojiTooltip
                  onPress={() => {
                    AsyncStorage.setItem('toolTipChat', '3');
                    setTooltipState('3');
                  }}
                />
              )}
              {tooltipState === null && !VARIABLES.disableTouch && (
                <ChatShareMediaTooltip
                  onPress={() => {
                    AsyncStorage.setItem('toolTipChat', '2');
                    setTooltipState('2');
                  }}
                />
              )}
              <View
                style={{
                  ...styles.replyInputContainer,
                  marginBottom: scale(14),
                }}>
                {isReply && (
                  <QuotedInputContainer
                    onPressCross={() => {
                      setRepliedText('');
                      setIsReply(false);
                      setQuotedMessage(null);
                      //    inputRef.current.blur?.();
                    }}
                    quotedMessage={quotedMessage}
                    repliedText={repliedText}
                    strokeColor={strokeColor}
                    themeColor={themeColor}
                  />
                )}

                <View
                  style={[
                    {
                      ...styles.inputContainer,
                      alignItems: 'center',
                      //  backgroundColor: VARIABLES.themeData.themeColor,
                      backgroundColor: colors.white,
                    },
                    isReply && {
                      borderTopRightRadius: 0,
                      borderTopLeftRadius: 0,
                    },
                  ]}>
                  <TextInput
                    ref={inputRef}
                    placeholder="Message"
                    placeholderTextColor={'#929292'}
                    editable={!VARIABLES.disableTouch}
                    style={{
                      paddingVertical:
                        Platform.OS === 'ios' ? scale(12) : scale(14),
                      flex: 1,
                      ...globalStyles.regularLargeText,
                      fontSize: scale(14),
                      color: colors.text,
                      lineHeight: scale(21),
                      padding: 0,
                      margin: 0,
                      paddingTop: Platform.OS === 'ios' ? scale(14) : scale(12),
                      marginLeft: 2,
                      marginRight: scale(40),
                      maxHeight: scale(100),
                      includeFontPadding: false,
                    }}
                    value={message}
                    onChangeText={handleTextChange}
                    multiline
                  />

                  {message?.length === 0 && (
                    <Pressable
                      testID="emojiMessage"
                      hitSlop={10}
                      onPress={() => {
                        if (realm.isClosed) {
                          ToastMessage(
                            'Something went wrong please close your app and open again',
                          );
                          return;
                        }
                        setIsReactionEnabled(false);
                        handlePresentEmojiModalPress();
                      }}>
                      <Image
                        source={APP_IMAGE.emojiPlaceholder}
                        style={{
                          ...globalStyles.mediumIcon,
                          resizeMode: 'contain',
                          marginRight: scale(22),
                        }}
                      />
                    </Pressable>
                  )}
                  {message?.length === 0 && !quotedMessage && (
                    <Pressable
                      testID="chatPlusIcon"
                      onPress={handlePresentModalPress}>
                      <Image
                        source={APP_IMAGE.addCircle}
                        style={{
                          ...globalStyles.mediumIcon,
                          marginRight: scale(20),
                        }}
                      />
                    </Pressable>
                  )}

                  <Pressable
                    testID="sendMessage"
                    hitSlop={10}
                    disabled={isInputDisabled}
                    onPress={async () => {
                      //  setisInputDisabled(true);
                      //   inputRef.current?.setNativeProps?.({text: ''});
                      setMessage('');
                      if (containsHttpsLink(message)) {
                        SendMessageHandler(message, 'link');
                      } else {
                        SendMessageHandler(message, 'message');
                      }
                    }}>
                    {message === '' ? (
                      <Image
                        source={APP_IMAGE.sendMessage}
                        style={{...globalStyles.mediumIcon}}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={APP_IMAGE.sendMessageActive}
                        style={{...globalStyles.mediumIcon}}
                        resizeMode="contain"
                      />
                    )}
                  </Pressable>
                </View>
              </View>
            </LinearGradient>
          </>

          <View>
            <BottomSheetModal
              accessible={Platform.select({
                // setting it to false on Android seems to cause issues with TalkBack instead
                ios: false,
              })}
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backgroundStyle={{
                backgroundColor: themeColor,
              }}
              // style={{ backgroundColor: themeColor }}
            >
              <BottomSheetFlatList
                data={CONTENT}
                keyExtractor={(i, index) => index}
                renderItem={addContentItem}
                contentContainerStyle={{...styles.contentContainer}}
                ItemSeparatorComponent={itemContentSeparatorComponent}
                style={{
                  marginTop: 20,
                }}
              />
            </BottomSheetModal>
            <BottomSheetModal
              ref={bottomSheetEmojiModalRef}
              index={1}
              snapPoints={snapPointsEmoji}
              keyboardBehavior="extend"
              onChange={handleSheetEmojiChanges}
              backgroundStyle={{
                backgroundColor: themeColor,
              }}
              // style={{ backgroundColor: themeColor }}
            >
              <View
                style={{
                  backgroundColor: 'rgba(212, 202, 203, 0.36)',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  flexDirection: 'row',
                  marginHorizontal: 16,
                  padding: scale(2),
                }}>
                <Pressable
                  hitSlop={10}
                  style={[
                    styles.reactionContainer,
                    icontabs[0].selected && {
                      backgroundColor: colors.white,
                    },
                  ]}
                  onPress={() => IconTabHandler(0)}>
                  {icontabs[0].selected ? (
                    <Image
                      source={APP_IMAGE.stickerActive}
                      style={{
                        width: scale(21),
                        height: scale(21),
                        paddingVertical: 4,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={APP_IMAGE.stickerInactive}
                      style={{
                        width: scale(21),
                        height: scale(21),
                        paddingVertical: 4,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </Pressable>
                <Pressable
                  style={[
                    styles.reactionContainer,
                    icontabs[1].selected && {
                      backgroundColor: colors.white,
                    },
                  ]}
                  hitSlop={10}
                  onPress={() => {
                    setVisible(true);
                    IconTabHandler(1);
                  }}>
                  {icontabs[1].selected ? (
                    <Image
                      source={APP_IMAGE.emojiActive}
                      style={{
                        width: scale(21),
                        height: scale(21),
                        paddingVertical: 4,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={APP_IMAGE.emojiInactive}
                      style={{
                        width: scale(21),
                        height: scale(21),
                        paddingVertical: 4,
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                </Pressable>
                {!isReactionEnabled && (
                  <Pressable
                    hitSlop={10}
                    style={[
                      styles.reactionContainer,
                      icontabs[2].selected && {
                        backgroundColor: colors.white,
                      },
                    ]}
                    onPress={() => {
                      setVisible(true);
                      IconTabHandler(2);
                    }}>
                    {icontabs[2].selected ? (
                      <Image
                        source={APP_IMAGE.gifActive}
                        style={{
                          width: scale(25),
                          height: scale(21),
                          paddingVertical: 4,
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <Image
                        source={APP_IMAGE.gifInactive}
                        style={{
                          width: scale(25),
                          height: scale(21),
                          paddingVertical: 4,
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                  </Pressable>
                )}
              </View>
              {icontabs[1].selected && visible && (
                <View style={{flex: 1}}>
                  {!!VARIABLES.recentEmojis.length && (
                    <View
                      style={{
                        margin: 8,
                      }}>
                      <Text
                        style={{
                          ...globalStyles.standardMediumText,
                          fontSize: scale(18),
                        }}>
                        Recently used
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: scale(16),
                        }}>
                        {VARIABLES.recentEmojis.map(item => {
                          return (
                            <Pressable>
                              <Text
                                style={{
                                  fontSize: 20,
                                  marginRight: 6,
                                  color: '#000',
                                }}>
                                {item.toString()}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: '#EBC9C0',
                          marginTop: scale(24),
                        }}
                      />
                    </View>
                  )}
                  <EmojiSelector
                    onEmojiSelected={emoji => {
                      if (isReactionEnabled) {
                        updateRecentlyUsedSmily(emoji);
                      }

                      setSheetEnabled(false);
                      setsearchGifQuery('');
                      bottomSheetEmojiModalRef.current.dismiss();
                      console.log('emojiiiii to send', emoji);
                      if (isReactionEnabled) {
                        SendReactionHandler(emoji, 'emoji');
                      } else {
                        SendMessageHandler(emoji, 'emoji');
                      }
                    }}
                    showHistory={true}
                    showSearchBar={false}
                    columns={10}
                    placeholder={'Search Emoji'}
                    showSectionTitles={true}
                    showTabs={false}
                  />
                </View>
              )}
              {icontabs[0].selected && (
                <BottomSheetFlatList
                  data={STICKERS}
                  renderItem={stickerItem}
                  keyExtractor={(item, index) => index}
                  numColumns={5}
                  columnWrapperStyle={{
                    // justifyContent: 'space-between',
                    margin: 16,
                  }}
                  ListHeaderComponent={() => {
                    if (VARIABLES.recentReactions.length > 0) {
                      return (
                        <View
                          style={{
                            margin: 16,
                          }}>
                          <Text
                            style={{
                              ...globalStyles.standardMediumText,
                              fontSize: scale(18),
                            }}>
                            Recently used
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: scale(16),
                            }}>
                            {VARIABLES.recentReactions.map(item => {
                              return stickerItem({
                                item,
                                containerStyle: {width: SCREEN_WIDTH / 5 - 2},
                              });
                            })}
                          </View>
                          <View
                            style={{
                              height: 1,
                              backgroundColor: '#EBC9C0',
                              marginTop: scale(24),
                            }}
                          />
                        </View>
                      );
                    }
                    return <View />;
                  }}
                />
              )}
              {icontabs[2].selected && (
                <View style={{flex: 1}}>
                  <View
                    style={{
                      ...styles.searchContainer,
                      marginTop: scale(12),
                      marginBottom: scale(18),
                    }}>
                    <SearchIconSvg style={{marginEnd: scale(12)}} />
                    <TextInput
                      ref={searchInputRef}
                      placeholder="Search here"
                      placeholderTextColor={'#929292'}
                      style={{
                        paddingVertical: scale(12),
                        flex: 1,
                        ...globalStyles.regularLargeText,
                        padding: 0,
                        margin: 0,
                        marginTop: 2,
                      }}
                      value={searchGifQuery}
                      onChangeText={text => setsearchGifQuery(text)}
                      onBlur={() => {}}
                    />
                    <Pressable
                      hitSlop={10}
                      onPress={() => {
                        // setIsSearching(false);
                        setsearchGifQuery('');
                        setsearchGifs([]);
                        // getConversation(0)
                      }}>
                      <BlueCloseCircleIconSvg />
                    </Pressable>
                  </View>
                  {gifLoading && (
                    <View style={{height: 60}}>
                      <ActivityIndicator />
                    </View>
                  )}
                  <BottomSheetFlatList
                    data={searchGifQuery?.length > 0 ? searchGifs : Gifs}
                    style={{
                      flex: 1,
                    }}
                    renderItem={({item}) => (
                      <Pressable
                        onPress={() => {
                          setSheetEnabled(false);
                          bottomSheetEmojiModalRef.current.dismiss();
                          setsearchGifQuery('');
                          SendMessageHandler(
                            item?.media_formats?.mediumgif?.url,
                            'gif',
                            {
                              imageWidth: Number(
                                item?.media_formats?.mediumgif?.dims[0],
                              ),
                              imageHeight: Number(
                                item?.media_formats?.mediumgif?.dims[1],
                              ),
                            },
                          );
                        }}>
                        <Image
                          source={
                            item?.media_formats?.mediumgif?.url
                              ? {
                                  uri: item?.media_formats?.mediumgif?.url,
                                }
                              : APP_IMAGE.placeholderImage
                          }
                          style={{
                            width: (SCREEN_WIDTH - 20) / 2,
                            marginBottom: 10,
                            height: scale(190),
                            backgroundColor: '#ccc',
                          }}
                        />
                      </Pressable>
                    )}
                    keyExtractor={(item, index) => index}
                    numColumns={2}
                    columnWrapperStyle={{
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                    }}
                    refreshing={true}
                  />
                </View>
              )}
            </BottomSheetModal>
            <BottomSheetModal
              accessible={Platform.select({
                // setting it to false on Android seems to cause issues with TalkBack instead
                ios: false,
              })}
              ref={bottomSheetModalRecordAudioRef}
              index={1}
              snapPoints={snapPointsRecordAudio}
              onChange={handleSheetRecordAudioChanges}
              backgroundStyle={{
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
              }}>
              <View style={{alignItems: 'center'}}>
                <View style={{marginVertical: 30, alignItems: 'center'}}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#D4CACB',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MicrophoneWhiteIconSvg />
                  </View>
                  <Text style={{marginTop: 30, color: '#000'}}>
                    {recordTime}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 26,
                }}>
                {isAudioRecording ? (
                  <Pressable
                    onPress={() => {
                      setIsRecordingPause(!isRecordingPause);
                      if (isRecordingPause) {
                        onResumeRecorder();
                      } else {
                        onPauseRecorder();
                      }
                    }}>
                    {!isRecordingPause ? (
                      <InitialPauseIconSvg />
                    ) : (
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={APP_IMAGE.playIcon}
                          style={{
                            width: 20,
                            height: 20,
                            tintColor: '#929292',
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    )}
                  </Pressable>
                ) : (
                  <View />
                )}
                <Pressable
                  testID="onStopRecordingChat"
                  onPress={() => {
                    if (!isAudioRecording) {
                      audioPermissions();
                    } else {
                      onStopRecord();
                    }
                  }}>
                  {audioFile === '' ? (
                    <>
                      {isAudioRecording ? (
                        <InitialRecordIconSvg
                          fill={'rgb(34, 69, 147)'}
                          opacity={1}
                        />
                      ) : (
                        <PlayRecordAudioIconSvg />
                      )}
                    </>
                  ) : (
                    <Pressable
                      testID="sendRecordingChat"
                      onPress={() => {
                        sendAudioNote();
                      }}>
                      <Image
                        source={APP_IMAGE.sendMessageActive}
                        style={{
                          width: scale(40),
                          height: scale(40),
                          marginStart: 32,
                        }}
                        resizeMode="contain"
                      />
                    </Pressable>
                  )}
                </Pressable>
                {isAudioRecording || audioFile !== '' ? (
                  <Pressable
                    onPress={() => {
                      setIsAudioRecording(false);
                      setAudioFile(val => '');
                      setRecordTime('00:00');
                      onStopRecord(false);
                    }}>
                    <DarkCrossIconSvg />
                  </Pressable>
                ) : (
                  <View />
                )}
              </View>
            </BottomSheetModal>
          </View>
        </AppView>
        {/* {InputContainer()} */}
        {sheetEnabled && (
          <Pressable
            style={globalStyles.backgroundShadowContainer}
            onPress={() => {
              // setIsReactionEnabled(false);
              setSheetEnabled(false);
              setVisible(false);
              let tabs = [...icontabs];
              tabs[0].selected = true;
              tabs[1].selected = false;
              setIconTabs(tabs);
              setsearchGifQuery('');
              bottomSheetEmojiModalRef.current.dismiss();
              bottomSheetModalRef.current.dismiss();
              bottomSheetModalRecordAudioRef?.current?.dismiss?.();
            }}
          />
        )}
        {isRecordingEnabled && (
          <Pressable
            style={globalStyles.backgroundShadowContainer}
            onPress={() => {
              setSheetEnabled(false);
              onStopRecord();
              setIsAudioRecording(false);
              setRecordTime('00:00');
              setAudioFile('');
              setsearchGifQuery('');
              bottomSheetEmojiModalRef.current.dismiss();
              bottomSheetModalRef.current.dismiss();
              bottomSheetModalRecordAudioRef.current.dismiss();
            }}
          />
        )}

        {galleryAndCameraModal && (
          <ImagePickerModal
            modalVisible={galleryAndCameraModal}
            setModalVisible={setGalleryAndCameraModal}
            imageHandler={() => {
              setGalleryAndCameraModal(false);
              setTimeout(() => {
                handleGalleryPicker();
              }, 500);
            }}
            cameraHandler={() => {
              setGalleryAndCameraModal(false);
              setTimeout(() => {
                handleCameraPicker();
              }, 500);
            }}
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
        <OverlayLoader visible={!!isNavigation} />

        <WelcomeChatModal
          modalVisible={welcomeChatModalVisible}
          setModalVisible={setWelcomeChatModalVisible}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomStartRadius: scale(30),
    borderBottomEndRadius: scale(30),
    backgroundColor: '#EDFBF7',
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    borderRadius: scale(20),
  },
  userImage: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: colors.backgroundColor,
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: "space-between",
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  replyInputContainer: {
    marginHorizontal: scale(16),

    borderRadius: scale(12),
    // backgroundColor: 'red'
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  messageStatusContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  messageStatusClockImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  reactionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: scale(8),
  },
});

export default Chat;
