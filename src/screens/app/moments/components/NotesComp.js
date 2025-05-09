/* eslint-disable react-native/no-inline-styles */
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  PermissionsAndroid,
  FlatList,
  findNodeHandle,
  UIManager,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  BOTTOM_SPACE,
  SCREEN_WIDTH,
  globalStyles,
} from '../../../../styles/globalStyles';
import {
  APP_IMAGE,
  MOMENT_KEY,
  STICKERS,
  getFeelingsIcon,
} from '../../../../utils/constants';
import {scale} from '../../../../utils/metrics';
import debounce from 'lodash/debounce';

import FastImage from 'react-native-fast-image';
import {AWS_URL_S3} from '../../../../utils/urls';
import {colors} from '../../../../styles/colors';
import moment from 'moment';
import {getLabelForDate} from '../../../../utils/utils';

import {VARIABLES} from '../../../../utils/variables';
import {useNetInfo} from '@react-native-community/netinfo';
import {ToastMessage} from '../../../../components/toastMessage';
import API from '../../../../redux/saga/request';
import AudioPlayer from '../../../../components/AudioPlayer';
import StickersBottomSheet from '../../../../components/bottomSheet/StickersBottomSheet';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import uuid from 'react-native-uuid';
const audioRecorderPlayer = new AudioRecorderPlayer();

import AWS from 'aws-sdk';
import {KEYCHAIN} from '../../../../utils/keychain';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import AddDocumentIconSvg from '../../../../assets/svgs/addDocumentIconSvg';
import RecordAudioIconSvg from '../../../../assets/svgs/recordAudioIconSvg';
import MicrophoneWhiteIconSvg from '../../../../assets/svgs/microphoneWhiteIconSvg';
import {delay, getStateDataAsync} from '../../../../utils/helpers';
import CustomToolTip from '../../../../components/CustomToolTip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fonts} from '../../../../styles/fonts';
import {scaleNew} from '../../../../utils/metrics2';
import {useAppContext} from '../../../../utils/VariablesContext';
import StickyArchieveTooltip from '../../../../components/contextualTooltips/StickyArchieveTooltip';
import ReactionComp from '../../../../components/ReactionComp';
import RNFS from 'react-native-fs';
import {addMediaFile} from '../../../../utils/s3UtilsNew';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

var Buffer = require('@craftzdog/react-native-buffer').Buffer;

AWS.config.update({
  region: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: KEYCHAIN.NEXT_PUBLIC_COGNITO_POOL_ID,
  }),
});

const s3 = new AWS.S3();

const CONTENT_NOTE = [
  {
    id: 1,
    key: 'Sticky',
    label: 'Add a sticky note',
    icon: <AddDocumentIconSvg />,
  },
  {
    id: 2,
    key: 'Audio',
    label: 'Record audio note',
    icon: <RecordAudioIconSvg />,
  },
];

let checkClick;

const NotesComp = forwardRef(
  (
    {
      onLayout,
      notes,
      allNotes,
      navigation,
      setNotes,
      focusedNoteIndex,
      setFocusedNoteIndex,
      SendReactionHandler,
      addAudioNote,
      addNewNote,
      setUploading,
    },
    ref,
  ) => {
    const {hornyMode} = useAppContext();

    const snapPointsNote = useMemo(
      () => [
        SCREEN_WIDTH / 3.2 + BOTTOM_SPACE,
        SCREEN_WIDTH / 3.2 + BOTTOM_SPACE,
      ],
      [],
    );

    const [allNoteToolTipShown, setAllNoteToolTipShown] = useState(false);
    const [numberOfLines1, setNumberOfLines1] = useState(3);
    const notesScrollRef = useRef(null);
    const notesInput = useRef('');
    const bottomSheetModalNoteRef = useRef(null);
    const bottomSheetModalRecordAudioRef = useRef(null);

    const snapPointsRecordAudio = useMemo(() => ['45%', '45%'], []);
    const snapPointsRecordedAudio = useMemo(() => ['35%', '35%'], []);

    const [initialAudioUi, setinitialAudioUi] = useState(false);
    const [currentTime, setcurrentTime] = useState(3);
    const [isRecordingUI, setisRecordingUI] = useState(false);
    const [isStoppedUI, setisStoppedUI] = useState(false);
    const [isPausedUI, setisPausedUI] = useState(false);

    const [isAudioRecording, setIsAudioRecording] = useState(false);

    const [recordTime, setRecordTime] = useState('00:00');
    const [audioFile, setAudioFile] = useState('');
    const [musicFileExtension, setMusicFileExtension] = useState('');
    const [currentAudioPlayingIndex, setcurrentAudioPlayingIndex] =
      useState(-1);

    const [loading, setLoading] = useState(false);
    const [sheetEnabled, setSheetEnabled] = useState(false);

    const [onClickItem, setOnClickItem] = useState(false);

    const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
      useState(false);

    const [reactionData, setReactionData] = useState('');

    const handlePresentModalNoteClick = () => {
      // Function logic here
      if (VARIABLES.disableTouch) {
        ToastMessage('Please add a partner to continue');
        return;
      }
      if (notes.length >= 5) {
        ToastMessage(
          'You have exceeded your limit of 5 stickies today, come back tomorrow',
        );
        return;
      }
      handlePresentModalNotePress();
    };

    useImperativeHandle(ref, () => ({
      externalFunction: handlePresentModalNoteClick,
    }));

    // callbacks
    const handlePresentEmojiModalPress = useCallback(() => {
      Keyboard.dismiss();
      setStickersBottomSheetVisible(true);
    }, []);

    // callbacks
    const handlePresentModalNotePress = useCallback(() => {
      bottomSheetModalNoteRef.current.present();
      setSheetEnabled(true);
    }, []);
    const handleSheetNoteChanges = useCallback(index => {
      setTimeout(async () => {
        setRecordTime('00.00');
        await audioRecorderPlayer.stopRecorder();
      }, 1);

      if (index === -1) {
        if (checkClick !== true) {
          ////mohit conition to check mohit

          // bottomSheetModalRef.current.dismiss()
          setSheetEnabled(false);
          setOnClickItem(false);
        }
      }
    }, []);

    const handlePresentModalRecordAudioPress = useCallback(async () => {
      bottomSheetModalRecordAudioRef.current.present();
      setSheetEnabled(true);
      setinitialAudioUi(true);
      setcurrentTime(3);
      setisRecordingUI(false);
      setisStoppedUI(false);
      setisPausedUI(false);
      setRecordTime('00:00');
      await delay(200);
      const recordingStartIn = setInterval(() => {
        setcurrentTime(time => {
          if (time === 0) {
            setinitialAudioUi(false);
            clearInterval(recordingStartIn);
            setisRecordingUI(true);
            audioPermissions();
            return 0;
          } else {
            return time - 1;
          }
        });
      }, 1000);
    }, []);

    const handleSheetRecordAudioChanges = useCallback(index => {
      // console.log('handleSheetChanges', index);
      if (index === -1) {
        if (checkClick !== true) {
        }

        // bottomSheetModalRef.current.dismiss()
        setSheetEnabled(false);
      }
    }, []);

    const addContentNoteItem = ({item, index}) => {
      return (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={async () => {
            checkClick = true;
            setOnClickItem(true);
            bottomSheetModalNoteRef.current.dismiss();
            if (item.key === 'Sticky') {
              if (
                notes.findIndex(i => {
                  return i.type === 'sticky';
                }) !== -1
              ) {
                notesInput.current?.focus?.();
                notesScrollRef?.current?.scrollTo?.({
                  y: 0,
                  animated: true,
                });
              } else {
                let inputObj = {
                  input: '',
                  stickers: [],
                  type: 'sticky',
                };
                setSheetEnabled(false);
                setNotes(prev => [inputObj, ...prev]);
                await delay(1000);
                notesScrollRef?.current?.scrollTo?.({
                  y: 0,
                  animated: true,
                });
              }
            } else {
              if (Platform.OS === 'android') {
                const audioPermission = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                );
                if (audioPermission === 'granted') {
                  setTimeout(() => {
                    handlePresentModalRecordAudioPress();
                  }, 500);
                }
                return;
              }
              setTimeout(() => {
                handlePresentModalRecordAudioPress();
              }, 500);
            }
          }}>
          {/* <Image source={item.image}/> */}
          <View>{item.icon}</View>
          <Text style={{...globalStyles.regularLargeText, marginStart: 16}}>
            {item.label}
          </Text>
        </Pressable>
      );
    };

    const onStopRecord = async (save = true) => {
      setisRecordingUI(false);
      setisStoppedUI(true);
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();

      console.log('result audio file', result);

      setMusicFileExtension(result.split('.').pop());
      setAudioFile(result);
      setIsAudioRecording(false);
    };

    const sendAudioNote = async () => {
      if (!VARIABLES.user?.partnerData?.partner) {
        return;
      }

      setIsAudioRecording(false);
      setSheetEnabled(false);
      bottomSheetModalRecordAudioRef.current.dismiss();

      try {
        const s3response = await addMediaFile(
          audioFile,
          `production/notes/${fileName}`,
        );
        console.log('s3 repsonse', s3response);
        addAudioNote(fileName, recordTime);
      } catch (error) {
        setAudioFile('');
        ToastMessage(
          "Sorry audio file couldn't upload to server due to some error.",
        );
        setTimeout(() => {
          setUploading(false);
        }, 1500);
      }
    };

    const audioPermissions = async () => {
      onStartRecord();
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

    const onStartRecord = async () => {
      setIsAudioRecording(true);
      if (Platform.OS === 'ios') {
        await audioRecorderPlayer.startRecorder(path, audioSet);
      } else {
        await audioRecorderPlayer.startRecorder();
      }
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

    const onPauseRecorder = async () => {
      try {
        await audioRecorderPlayer.pauseRecorder();
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    };

    const onResumeRecorder = async () => {
      try {
        await audioRecorderPlayer.resumeRecorder();
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    };

    const itemContentSeparatorComponent = () => {
      return (
        <View
          style={{
            height: 1.5,
            backgroundColor: colors.red4,
            width: '100%',
            marginVertical: 10,
          }}
        />
      );
    };

    useEffect(() => {
      toCheckAllNotesToolTip();
    }, []);

    const toCheckAllNotesToolTip = async () => {
      //// AsyncStorage.setItem('allNotesTooltip', new Date().toISOString());
      let tooltipCheck = await AsyncStorage.getItem('momentsToolTipShown');
      let allNotesTooltip = await AsyncStorage.getItem('allNotesTooltip');
      let allNotesTooltipShown = await AsyncStorage.getItem(
        'allNotesTooltipShown',
      );

      if (
        tooltipCheck === 'true' &&
        allNotesTooltip &&
        allNotesTooltipShown !== 'true'
      ) {
        const tooltipDate = new Date(allNotesTooltip);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - tooltipDate);
        const diffHours = diffTime / (1000 * 60 * 60);

        if (diffHours < 24) {
          setAllNoteToolTipShown(true);
        }
      }
    };

    const getImageSource = useCallback((item, notes, hornyMode) => {
      if (hornyMode) {
        return item.isExpanded
          ? APP_IMAGE.stickyHornyExtended
          : APP_IMAGE.stickyHorny;
      }

      let imageSrc = APP_IMAGE.stickerFour;
      const colorMap = {
        '#D4F1DE': [APP_IMAGE.greenExpanded, APP_IMAGE.stickerOne],
        '#FFFFFF': [APP_IMAGE.whiteExpanded, APP_IMAGE.stickerFour],
        '#F4EEE0': [APP_IMAGE.yellowExpanded, APP_IMAGE.stickerTwo],
        '#E9F1F7': [APP_IMAGE.blueExpanded, APP_IMAGE.stickerThree],
      };

      if (item.type === 'sticky' && notes.length > 0) {
        const nextNoteColor = notes[1]?.color;
        const stickyColorMap = {
          '#D4F1DE': [APP_IMAGE.yellowDetails, APP_IMAGE.stickerTwo],
          '#FFFFFF': [APP_IMAGE.greenDetails, APP_IMAGE.stickerOne],
          '#F4EEE0': [APP_IMAGE.blueDetails, APP_IMAGE.stickerThree],
          '#E9F1F7': [APP_IMAGE.whiteDetails, APP_IMAGE.stickerFour],
        };
        imageSrc = item.isExpanded
          ? stickyColorMap[nextNoteColor]?.[0]
          : stickyColorMap[nextNoteColor]?.[1];
      } else {
        imageSrc = item.isExpanded
          ? colorMap[item.color]?.[0]
          : colorMap[item.color]?.[1];
      }

      return imageSrc || APP_IMAGE.stickerOne;
    }, []);

    const getDateString = useCallback(timeStamps => {
      if (!timeStamps) return '';
      const createdDate = moment(timeStamps);
      let dateStr = createdDate.format('ha');
      return dateStr.charAt(0) === '0' ? dateStr.substring(1) : dateStr;
    }, []);

    const renderNoteHeader = useCallback(
      (item, dateStr) => {
        if (item.type === 'sticky') return null;
        return (
          <View style={styles.noteHeader}>
            <ProfileAvatar
              type={
                item?.createdBy?._id === VARIABLES?.user?._id
                  ? 'user'
                  : 'partner'
              }
              style={styles.avatarImage}
            />

            <Text style={[styles.dateText, hornyMode && styles.hornyModeText]}>
              {dateStr}
            </Text>
          </View>
        );
      },
      [hornyMode],
    );

    const renderNoteBody = useCallback(
      (item, index) => {
        if (item?.text) {
          return (
            <>
              <Text
                allowFontScaling={false}
                onTextLayout={event => onTextLayoutHandler(event, index)}
                // onLayout={event => {
                //   const {height} = event.nativeEvent.layout;
                //   const numberOfLines = Math.floor(height / 18);

                //   updateNumberOfLines(index, numberOfLines);
                // }}
                style={{
                  ...globalStyles.regularMediumText,
                  marginTop: scale(6),
                  lineHeight: 18,
                  includeFontPadding: false,
                  marginRight: scale(10),
                  opacity: 0, // Make it invisible
                  color: hornyMode ? 'rgba(224, 224, 224, 1)' : '#2F3A4E',
                  position: 'absolute', // Take it out of the layout flow
                }}>
                {item?.text}
              </Text>
              <Text
                // onTextLayout={event => onTextLayoutHandler(event, index)}
                allowFontScaling={false}
                style={[styles.noteText, hornyMode && styles.hornyModeText]}
                numberOfLines={item.isExpanded ? 12 : 3}>
                {item?.text}
              </Text>
            </>
          );
        } else {
          return (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={
                  notes.length > 1
                    ? 'Add your note here'
                    : 'Leave a note for your partner'
                }
                placeholderTextColor={colors.grey6}
                style={[styles.noteInput, hornyMode && styles.hornyModeText]}
                multiline={true}
                textAlignVertical="top"
                editable={!VARIABLES.disableTouch}
                value={notes[index].input}
                onChangeText={text => handleNoteInputChange(text, index)}
                onFocus={() => setFocusedNoteIndex(index)}
                onBlur={() => setFocusedNoteIndex(notes[index].input)}
                autoFocus={notes.length > 1}
                maxLength={140}
              />
              {renderInputFooter(index)}
            </View>
          );
        }
      },
      [notes, hornyMode, setFocusedNoteIndex],
    );

    const renderInputFooter = useCallback(
      index => {
        if (focusedNoteIndex !== index) return null;
        return (
          <View style={styles.inputFooter}>
            <Text style={[styles.charCount, hornyMode && styles.hornyModeText]}>
              {`${notes[index].input.length}/140`}
            </Text>
            <View style={styles.inputActions}>
              <Pressable
                onPress={() => setNotes(prevNotes => prevNotes.slice(1))}>
                <Image
                  style={styles.actionIcon}
                  source={
                    hornyMode
                      ? require('../../../../assets/images/notesCrossHorny.png')
                      : require('../../../../assets/images/notesCross.png')
                  }
                />
              </Pressable>
              <Pressable onPress={addNewNote}>
                <Image
                  style={styles.actionIcon}
                  source={
                    hornyMode
                      ? require('../../../../assets/images/notesTickHorny.png')
                      : require('../../../../assets/images/notesTick.png')
                  }
                />
              </Pressable>
            </View>
          </View>
        );
      },
      [focusedNoteIndex, notes, hornyMode, addNewNote, setNotes],
    );

    const renderNoteFooter = useCallback(item => {
      if (item.type === 'sticky') return null;
      return (
        <View style={styles.noteFooter}>
          {renderReactions(item)}
          {renderExpandButton(item)}
        </View>
      );
    }, []);

    const renderReactions = useCallback(
      item => {
        if (item?.reactions?.length) {
          return (
            <Pressable
              style={styles.reactionsContainer}
              onPress={() => {
                setReactionData(item);
                handlePresentEmojiModalPress();
              }}>
              {item.reactions.map(renderReaction)}
              {renderAddReactionButton()}
            </Pressable>
          );
        } else {
          return (
            <Pressable
              onPress={() => {
                setReactionData(item);
                handlePresentEmojiModalPress();
              }}>
              <Image
                resizeMode="contain"
                source={APP_IMAGE.emojiPlaceholder}
                style={[
                  styles.emojiPlaceholder,
                  hornyMode && styles.hornyModeIcon,
                ]}
              />
            </Pressable>
          );
        }
      },
      [hornyMode, setReactionData, handlePresentEmojiModalPress],
    );

    const renderReaction = useCallback(r => {
      if (r.type === 'emoji') {
        return (
          <View style={styles.emojiContainer}>
            <Text>{r.reaction}</Text>
          </View>
        );
      }
      return (
        <FastImage
          resizeMode="contain"
          style={styles.reactionImage}
          source={
            r?.reactionNew !== undefined && r?.reactionNew !== null
              ? STICKERS[Number(r.reactionNew)]?.sticker
              : {
                  uri:
                    Platform.OS === 'android'
                      ? r.reaction
                      : `${r.reaction}.png`,
                  priority: FastImage.priority.high,
                }
          }
        />
      );
    }, []);

    const renderAddReactionButton = useCallback(
      () => (
        <Pressable style={styles.addReactionButton}>
          <View style={styles.addReactionSeparator} />
          <Image
            source={APP_IMAGE.plusWithoutBack}
            style={styles.addReactionIcon}
          />
        </Pressable>
      ),
      [],
    );

    const renderExpandButton = useCallback(
      item => {
        if (item?.numberOfLines <= 3) return null;
        return (
          <Image
            source={item.isExpanded ? APP_IMAGE.contract : APP_IMAGE.expand}
            style={[styles.expandIcon, hornyMode && styles.hornyModeIcon]}
          />
        );
      },
      [hornyMode],
    );

    const renderAudioNote = useCallback(
      (item, imageSrc, dateStr) => (
        <ImageBackground source={imageSrc} style={styles.notePlaceholder}>
          <TouchableWithoutFeedback onLongPress={() => handleLongPress(item)}>
            <View style={styles.audioNoteContent}>
              {renderNoteHeader(item, dateStr)}
              <AudioPlayer
                currentIndex={currentAudioPlayingIndex}
                setCurrentIndex={setcurrentAudioPlayingIndex}
                url={item.text}
                messageIndex={item._id}
                color={item.color}
                item={item}
              />
              <View style={styles.noteFooter}>{renderReactions(item)}</View>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
      ),
      [
        currentAudioPlayingIndex,
        setcurrentAudioPlayingIndex,
        renderNoteHeader,
        renderReactions,
      ],
    );

    const handleLongPress = useCallback(
      item => {
        if (VARIABLES.disableTouch) {
          ToastMessage('Please add a partner to continue');
          return;
        }
        setReactionData(item);
        handlePresentEmojiModalPress();
      },
      [setReactionData, handlePresentEmojiModalPress],
    );

    const handleNotePress = useCallback(
      (item, index) => {
        if (VARIABLES.disableTouch) {
          ToastMessage('Please add a partner to continue');
          return;
        }
        if (item?.numberOfLines < 4 || item?.type === 'sticky') return;

        const newNotes = [...notes];
        newNotes[index].isExpanded = !newNotes[index].isExpanded;
        setNotes(newNotes);
      },
      [notes, setNotes],
    );

    const handleNoteInputChange = useCallback(
      (text, index) => {
        if (text.split('\n').length > 3) {
          ToastMessage('Cannot add more lines');
          return;
        }
        const newNotes = [...notes];
        newNotes[index].input = text;
        newNotes[index].isExpanded = false;
        setNotes(newNotes);
      },
      [notes, setNotes],
    );

    const onTextLayoutHandler = useCallback(
      (event, index) => {
        const {lines} = event.nativeEvent;

        if (!notes[index]?.isLayoutCalculated) {
          const newLines = lines.length;
          updateNumberOfLines(index, newLines);
        }
      },
      [notes],
    );

    const updateNumberOfLines = useCallback(
      (index, newNumberOfLines) => {
        const currentNumberOfLines = notes[index]?.numberOfLines;
        if (currentNumberOfLines !== newNumberOfLines) {
          const newNotes = [...notes];
          newNotes[index] = {
            ...newNotes[index],
            numberOfLines: newNumberOfLines,
            isLayoutCalculated: true,
          };
          setNotes(newNotes);
        }
      },
      [notes, setNotes],
    );

    const renderNoteItem = useCallback(
      ({item, index}) => {
        const imageSrc = getImageSource(item, notes, hornyMode);
        const dateStr = getDateString(item.timeStamps);

        if (item.type === 'message' || item.type === 'sticky') {
          return (
            <ImageBackground
              source={imageSrc}
              style={[
                styles.notePlaceholder,
                item.isExpanded && styles.expandedNote,
              ]}>
              <TouchableWithoutFeedback
                style={styles.noteContent}
                onLongPress={() => handleLongPress(item)}
                onPress={() => handleNotePress(item, index)}>
                <View style={styles.noteInnerContent}>
                  {renderNoteHeader(item, dateStr)}
                  {renderNoteBody(item, index)}
                  {renderNoteFooter(item)}
                </View>
              </TouchableWithoutFeedback>
            </ImageBackground>
          );
        } else {
          return renderAudioNote(item, imageSrc, dateStr);
        }
      },
      [
        notes,
        hornyMode,
        renderNoteHeader,
        renderNoteBody,
        renderNoteFooter,
        renderAudioNote,
        handleLongPress,
        handleNotePress,
      ],
    );

    return (
      <>
        {notes.length > 0 && (
          <>
            <View
              style={{
                ...styles.feedButtonsContainer,
                marginTop: scale(23),
                zIndex: 10,
              }}
              key={MOMENT_KEY.notes}
              onLayout={onLayout}>
              {notes.length > 0 && (
                <>
                  <Text
                    style={[
                      styles.feedLabel,
                      hornyMode ? {color: '#E0E0E0'} : {},
                    ]}>
                    Stickies
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable
                      disabled={!allNotes?.length}
                      onPress={() => navigation.navigate('allNotes', allNotes)}>
                      <Image
                        resizeMode="contain"
                        source={require('../../../../assets/images/stickyArchive.png')}
                        style={{
                          tintColor: hornyMode
                            ? '#E0E0E0'
                            : 'rgb(134, 146, 171)',
                        }}
                      />
                    </Pressable>
                    {notes[0]?._id !== undefined && <StickyArchieveTooltip />}
                  </View>
                </>
              )}
            </View>

            <FlatList
              data={notes}
              renderItem={renderNoteItem}
              keyExtractor={(item, index) => item._id || index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.notesContainer}
            />
          </>
        )}

        <BottomSheetModal
          ref={bottomSheetModalNoteRef}
          index={1}
          snapPoints={snapPointsNote}
          onChange={handleSheetNoteChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
          }}
          backdropComponent={({animatedIndex, style}) => (
            <BottomSheetBackdrop
              animatedIndex={animatedIndex}
              style={style}
              //   onPress={() => {
              //     setBottomSheetVisible(false);
              //   }}
            />
          )}
          // style={{ backgroundColor: themeColor }}
        >
          <BottomSheetFlatList
            data={CONTENT_NOTE}
            keyExtractor={(i, index) => index}
            renderItem={addContentNoteItem}
            contentContainerStyle={{
              ...styles.contentContainer,
              marginTop: scale(14),
            }}
            ItemSeparatorComponent={itemContentSeparatorComponent}
          />
        </BottomSheetModal>

        <BottomSheetModal
          backdropComponent={({animatedIndex, style}) => (
            <BottomSheetBackdrop
              animatedIndex={animatedIndex}
              style={style}
              //   onPress={() => {
              //     setBottomSheetVisible(false);
              //   }}
            />
          )}
          ref={bottomSheetModalRecordAudioRef}
          index={1}
          snapPoints={
            isStoppedUI ? snapPointsRecordedAudio : snapPointsRecordAudio
          }
          onChange={handleSheetRecordAudioChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
          }}>
          {initialAudioUi && (
            <View
              style={{
                alignItems: 'center',
                marginTop: scale(12),
              }}>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(18),
                }}>
                The recording will start in 3 secs
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#D4CACB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: scale(50),
                }}>
                <MicrophoneWhiteIconSvg />
              </View>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(26),
                }}>
                {currentTime}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH - scale(100),
                  marginTop: scale(45),
                }}>
                <Image
                  style={{
                    width: scale(32),
                    height: scale(32),
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.pauseFaded}
                />
                <Image
                  style={{
                    width: scale(32),
                    height: scale(32),
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.stopFaded}
                />
                <Image
                  style={{
                    width: scale(32),
                    height: scale(32),
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.XIcon}
                />
              </View>
            </View>
          )}
          {isRecordingUI && (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(18),
                }}>
                You are recording an audio
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#D4CACB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: scale(50),
                }}>
                <MicrophoneWhiteIconSvg />
              </View>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(26),
                }}>
                {recordTime}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH - scale(100),
                  marginTop: scale(45),
                }}>
                <Pressable
                  onPress={() => {
                    setisRecordingUI(false);
                    setisPausedUI(true);
                    onPauseRecorder();
                  }}>
                  <Image
                    style={{
                      width: scale(32),
                      height: scale(32),
                      resizeMode: 'contain',
                    }}
                    source={APP_IMAGE.pauseNormal}
                  />
                </Pressable>

                <Pressable
                  onPress={() => {
                    onStopRecord();
                  }}
                  style={{
                    width: scale(60),
                    height: scale(60),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.blue1,
                    borderRadius: 60,
                  }}>
                  <Image
                    style={{
                      width: scale(32),
                      height: scale(32),
                      resizeMode: 'contain',
                      tintColor: colors.white,
                    }}
                    source={APP_IMAGE.stopNormal}
                  />
                </Pressable>

                <Pressable
                  onPress={() => {
                    onStopRecord();
                    bottomSheetModalRecordAudioRef.current.dismiss();
                  }}>
                  <Image
                    style={{
                      width: scale(32),
                      height: scale(32),
                      resizeMode: 'contain',
                    }}
                    source={APP_IMAGE.XIcon}
                  />
                </Pressable>
              </View>
            </View>
          )}
          {isPausedUI && (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(18),
                }}>
                You are recording an audio
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#D4CACB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: scale(50),
                }}>
                <MicrophoneWhiteIconSvg />
              </View>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(26),
                }}>
                {recordTime}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH - scale(100),
                  marginTop: scale(45),
                }}>
                <Pressable
                  style={{
                    width: scale(60),
                    height: scale(60),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.blue1,
                    borderRadius: 60,
                  }}
                  onPress={() => {
                    setisPausedUI(false);
                    setisRecordingUI(true);
                    onResumeRecorder();
                  }}>
                  <Image
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                      tintColor: colors.white,
                    }}
                    source={APP_IMAGE.playIcon}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setisPausedUI(false);
                    setisStoppedUI(true);
                    onStopRecord();
                  }}
                  style={{
                    width: scale(60),
                    height: scale(60),
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: "blue"
                  }}>
                  <Image
                    style={{
                      width: scale(32),
                      height: scale(32),
                      resizeMode: 'contain',
                      tintColor: colors.text,
                    }}
                    source={APP_IMAGE.stopNormal}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    onStopRecord();
                    bottomSheetModalRecordAudioRef.current.dismiss();
                  }}
                  style={{
                    width: scale(60),
                    height: scale(60),
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: "blue"
                  }}>
                  <Image
                    style={{
                      width: scale(32),
                      height: scale(32),
                      resizeMode: 'contain',
                    }}
                    source={APP_IMAGE.XIcon}
                  />
                </Pressable>
              </View>
            </View>
          )}

          {isStoppedUI && (
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={{
                  ...globalStyles.regularLargeText,
                  fontSize: scale(18),
                }}>
                Your audio has been recorded
              </Text>
              <View
                style={{
                  backgroundColor: '#D4CACB',
                  padding: scale(3),
                  borderRadius: scale(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: scale(30),
                }}>
                <View
                  style={{
                    padding: scale(9),
                    backgroundColor: 'white',
                    borderRadius: scale(10),
                  }}>
                  <MicrophoneWhiteIconSvg stoke="#000" />
                </View>
                <View style={{width: scale(80), marginLeft: scale(12)}}>
                  <Text
                    style={{
                      ...globalStyles.standardLargeText,
                      fontSize: scale(21),
                      color: colors.white,
                    }}>
                    {recordTime}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  marginTop: scale(20),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: SCREEN_WIDTH - scale(32),
                }}>
                <Pressable
                  style={{
                    flex: 1,
                    paddingVertical: scale(12),
                    marginRight: 7,
                    borderWidth: 1,
                    borderColor: colors.text,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    bottomSheetModalRecordAudioRef.current.dismiss();
                  }}>
                  <Text
                    style={{
                      ...globalStyles.semiBoldLargeText,
                      color: colors.text,
                      textAlign: 'center',
                      includeFontPadding: false,
                    }}>
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: colors.blue1,
                    paddingVertical: scale(12),
                    marginLeft: 7,

                    borderRadius: 10,
                  }}
                  onPress={() => {
                    sendAudioNote();
                  }}>
                  <Text
                    style={{
                      ...globalStyles.semiBoldLargeText,
                      color: colors.white,
                      textAlign: 'center',
                      includeFontPadding: false,
                    }}>
                    Post
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </BottomSheetModal>

        {stickersBottomSheetVisible && (
          <StickersBottomSheet
            bottomSheetVisible={stickersBottomSheetVisible}
            setBottomSheetVisible={setStickersBottomSheetVisible}
            SendReactionHandler={(name, type, id) => {
              setStickersBottomSheetVisible(false);
              SendReactionHandler(name, type, id, reactionData);
              setReactionData('');
            }}
          />
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  feedButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(20),
    marginTop: -scale(4),
    // marginTop: scale(12),
  },
  feedLabel: {
    ...globalStyles.semiBoldLargeText,
    color: colors.textSecondary,
    fontSize: scaleNew(18),
  },
  notesContainer: {
    marginTop: scale(16),
    paddingStart: scaleNew(12),
  },
  notePlaceholder: {
    width: scale(174),
    height: scale(157),
    padding: scale(18),
    marginHorizontal: scale(6),
    paddingRight: scale(12),
    paddingBottom: scale(12),
  },
  expandedNote: {
    height: scale(310),
    width: scale(174),
  },
  noteContent: {
    flex: 1,
  },
  noteInnerContent: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: scale(20),
    height: scale(20),
    borderRadius: 20,
    backgroundColor: colors.grey10,
  },
  dateText: {
    ...globalStyles.regularSmallText,
    marginStart: scale(6),
    flex: 1,
    color: '#2F3A4E',
  },
  noteText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(6),
    lineHeight: scale(18),
    marginRight: scale(10),
    color: '#2F3A4E',
    includeFontPadding: false,
  },
  inputContainer: {
    flex: 1,
  },
  noteInput: {
    /// lineHeight: scale(18),
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 6,
    padding: 0,
    margin: 0,
    borderWidth: 0, // important, don't know why

    marginBottom: scale(4),
    maxHeight: scale(180),
    marginEnd: scale(20),
    ...globalStyles.regularMediumText,
    color: colors.text,
    marginTop: scale(-4),
    //  textAlignVertical: 'center',
    // padding:0,
    // margin:0,
    flex: 1,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(4),
  },
  charCount: {
    ...globalStyles.lightSmallText,
    color: colors.text,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: scale(4),
    resizeMode: 'contain',
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  reactionsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.white,
    padding: 4,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  emojiContainer: {
    ...globalStyles.emojiIcon,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionImage: {
    width: scale(20),
    height: scale(20),
    marginRight: 3,
    resizeMode: 'contain',
  },
  addReactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addReactionSeparator: {
    width: 1,
    backgroundColor: colors.seperator,
    margin: 3,
    marginRight: 5,
  },
  addReactionIcon: {
    width: 7,
    height: 7,
    resizeMode: 'contain',
    marginRight: 4,
  },
  emojiPlaceholder: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  expandIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
    marginBottom: -4,
  },
  audioNoteContent: {
    flex: 1,
    marginTop: 0,
  },
  hornyModeText: {
    color: '#E0E0E0',
  },
  hornyModeIcon: {
    tintColor: 'rgba(224, 224, 224, 1)',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(20),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
});

export default NotesComp;
