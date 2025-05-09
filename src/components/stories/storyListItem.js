/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  Platform,
  Pressable,
  Text,
  TextInput,
  Keyboard,
} from 'react-native';

import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';

import GestureRecognizer from 'react-native-swipe-gestures';
import MoreVerticleIconSvg from '../../assets/svgs/moreVerticleIconSvg';
import {colors} from '../../styles/colors';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {VARIABLES} from '../../utils/variables';
import {
  APP_IMAGE,
  STORY_EMOJIS_ROW_ONE,
  STORY_EMOJIS_ROW_TWO,
  STORY_STICKERS_ROW_ONE,
  STORY_STICKERS_ROW_TWO,
} from '../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {AWS_URL_S3} from '../../utils/urls';
import FastImage from 'react-native-fast-image';
import {scale} from '../../utils/metrics';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  globalStyles,
} from '../../styles/globalStyles';
import API from '../../redux/saga/request';
import {cloneDeep} from 'lodash';
import {ToastMessage} from '../toastMessage';
import moment from 'moment';
import SendMessageIconSvg from '../../assets/svgs/sendMessageIconSvg';
import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {fonts} from '../../styles/fonts';
import {EventRegister} from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nacl from 'tweetnacl';
import naclUtil, {decodeBase64, encodeBase64} from 'tweetnacl-util';
import {onSendMessage} from '../../backend/DatabaseOperations';
import {generateID} from '../../utils/helpers';
import {encryptAndSignMessage} from '../../e2e/encryptionMethods';
import * as Sentry from '@sentry/react-native';
import {useRealm} from '@realm/react';
import StorySecondTolltip from '../contextualTooltips/StorySecondTolltip';
import StoryReactTooltip from '../contextualTooltips/StoryReactTooltip';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {ProfileAvatar} from '../ProfileAvatar';

const {width, height} = Dimensions.get('window');

const REACTION_TYPE = [
  {
    type: 'sticker',
  },
  {
    type: 'emoji',
  },
];

const CleverTap = require('clevertap-react-native');

export const StoryListItem = props => {
  // const stories = props.stories;
  const navigation = useNavigation();
  const realm = useRealm();

  const {
    stories,
    onPressMore,
    socket,
    demo,
    singleStory,
    setshowRepl,
    textInputRef,
    selectedData,
    selectedStoryIndex,
    setselectedStoryIndex,
    user_id,
  } = props;
  const onPressMoreFunc = () => {
    pauseAnimation();
    onPressMore(startAnimation, current);
  };

  const pauseAnimation = () => {
    progress.stopAnimation(val => {
      progress.setValue(val);
      duration.current = (1 - val) * props.duration;
    });
  };

  const insets = useSafeAreaInsets();

  // const bottomSheetModalRef = useRef(null);
  // const extraLargeSnapPoints = useMemo(
  //   () => [SCREEN_HEIGHT / 1.3, SCREEN_HEIGHT / 1.3],
  //   [],
  // );

  // const handleSheetChanges = useCallback(index => {
  //   // console.log('handleSheetChanges', index);
  //   if (index === -1) {
  //     console.log('close modal');
  //     // bottomSheetModalRef.current.dismiss()
  //     // setSheetEnabled(false);
  //   }
  // }, []);

  const [replyText, setreplyText] = useState('');
  const [load, setLoad] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [shareReaction, setshareReaction] = useState(false);
  const [reactionType, setreactionType] = useState('sticker');
  const [content, setContent] = useState(
    stories.map((x, index) => {
      return {
        image: x?.story_image,
        onPress: x.onPress,
        swipeText: x.swipeText,
        finish: index < selectedStoryIndex ? 1 : 0,
        profileImage: x?.profileImage,
        profileName: x?.profileName,
        story_id: x?.story_id,
        highlight_id: x?.highlight_id,
        reaction: x?.reactions || [],
        createdAt: x?.createdAt,
      };
    }),
  );

  const [current, setCurrent] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  const duration = useRef(props.duration);

  useEffect(() => {
    if (shareReaction) {
      setTimeout(() => {
        textInputRef?.current?.focus?.();
      }, 100);
    }
  }, [shareReaction]);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  function isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) {
      return true;
    }

    return input.toString().replace(/\s/g, '').length < 1;
  }

  const prevCurrentPage = usePrevious(props.currentPage);

  useEffect(() => {
    let isPrevious = prevCurrentPage > props.currentPage;
    if (isPrevious) {
      setCurrent(content.length - 1);
    } else {
      setCurrent(selectedStoryIndex);
    }

    let data = [...content];
    data.map((x, i) => {
      if (isPrevious) {
        x.finish = 1;
        if (i == content.length - 1) {
          //   x.finish = 0;
        }
      } else {
        // x.finish = 0
      }
    });
    setContent(data);
  }, [props.currentPage]);

  console.log('curent index story', current);

  const prevCurrent = usePrevious(current);

  useEffect(() => {
    setselectedStoryIndex(current);
  }, [current]);

  useEffect(() => {
    if (!isNullOrWhitespace(prevCurrent)) {
      if (
        current > prevCurrent &&
        content[current - 1]?.image == content[current]?.image
      ) {
        start();
      } else if (
        current < prevCurrent &&
        content[current + 1]?.image == content[current]?.image
      ) {
        start();
      }
    }
  }, [current]);

  const toggleStickerFunction = type => {
    type ? pauseAnimation() : startAnimation();
    setshareReaction(type);
  };

  useEffect(() => {
    console.log('stories current', stories[current]);
    if (
      stories[current]?.story_id !== undefined &&
      stories[current]?.story_id !== ''
    ) {
      let dataToSend = {
        storyId: stories[current]?.story_id,
        userId: VARIABLES.user?._id,
      };
      socket.emit('seenStory', dataToSend);
      EventRegister.emit('seenStoryEmitter', dataToSend);

      if (
        stories[current]?.highlight_id !== undefined &&
        stories[current]?.highlight_id !== ''
      ) {
        CleverTap.recordEvent('Story viewed highlights');
      } else {
        CleverTap.recordEvent('Story viewed');
      }
    }
  }, [current]);

  function start() {
    setLoad(false);
    progress.setValue(0);
    startAnimation();
  }

  function stopAnimation() {
    progress.stopAnimation();
  }

  function startAnimation() {
    console.log(progress, duration.current);
    Animated.timing(progress, {
      toValue: 1,
      duration: duration.current,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        next();
      }
    });
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function next() {
    // check if the next content is not empty
    setLoad(true);
    if (current !== content.length - 1) {
      let data = [...content];
      console.log('dataaa', data);
      data[current].finish = 1;
      setContent(data);
      socket.emit('seenStory', {
        storyId: stories[current + 1]?.story_id,
        userId: VARIABLES.user?._id,
      });
      setCurrent(current + 1);
      progress.setValue(0);
      duration.current = props.duration;
    } else {
      // the next content is empty
      close('next');
    }
  }

  function previous() {
    // checking if the previous content is not empty
    if (current > 0) {
      setLoad(true);
      if (current - 1 >= 0 || current + 1 !== content.length) {
        let data = [...content];
        data[current].finish = 0;
        setContent(data);
        setCurrent(current - 1);
        progress.setValue(0);
      } else {
        // the previous content is empty
        close('previous');
      }
    } else {
      navigation.goBack();
    }
  }

  function close(state) {
    let data = [...content];
    data.map(x => (x.finish = 0));
    setContent(data);
    progress.setValue(0);
    if (props.currentPage == props.index) {
      if (props.onFinish) {
        props.onFinish(state);
      }
    }
  }

  function formatTimeSinceUploaded(uploadTime) {
    const now = moment();
    const uploadMoment = moment(uploadTime);

    const minutesDiff = now.diff(uploadMoment, 'minutes');

    if (minutesDiff < 2) {
      return '1m';
    } else if (minutesDiff < 60) {
      return `${minutesDiff}m`;
    } else {
      const hoursDiff = now.diff(uploadMoment, 'hours');
      if (`${hoursDiff}h` === `NaNh`) {
        return 'Uploading...';
      } else if (hoursDiff < 24) {
        return `${hoursDiff}h`;
      } else {
        const daysDiff = now.diff(uploadMoment, 'days');
        if (daysDiff < 7) {
          return `${daysDiff}d`;
        } else if (now.year() === uploadMoment.year()) {
          return uploadMoment.format('D MMMM');
        } else {
          return uploadMoment.format('D MMMM YYYY');
        }
      }
    }
  }

  const sendReactionForStory = async sticker => {
    try {
      const resp = await API('user/moments/stories', 'PUT', {
        storyId: content[current]?.story_id,
        type: reactionType,
        reaction: sticker?.id,
      });
      if (resp.body.statusCode === 200) {
        CleverTap.recordEvent('Reactions on stories');
        const newStoryDetails = cloneDeep(content);
        const reactionIndex = newStoryDetails[current].reaction.findIndex(
          r => r.user === VARIABLES.user._id,
        );
        if (reactionIndex === -1) {
          newStoryDetails[current].reaction.push({
            reaction: sticker.id,
            type: reactionType,
            user: VARIABLES.user._id,
          });
        } else {
          newStoryDetails[current].reaction[reactionIndex] = {
            reaction: sticker.id,
            type: reactionType,
            user: VARIABLES.user._id,
          };
        }
        setContent(newStoryDetails);
        ToastMessage('Reaction Sent');
      } else {
        ToastMessage('Something went wrong');
      }
    } catch (error) {
      ToastMessage('Something went wrong');
    }
  };

  const sendReactionForHighlight = async sticker => {
    try {
      const resp = await API('user/moments/highlights', 'PUT', {
        highlightId: content[current]?.highlight_id,
        storyId: content[current]?.story_id,
        type: reactionType,
        reaction: sticker.id,
      });
      if (resp.body.statusCode === 200) {
        const newStoryDetails = cloneDeep(content);
        const reactionIndex = newStoryDetails[current].reaction.findIndex(
          r => r.user === VARIABLES.user._id,
        );
        if (reactionIndex === -1) {
          newStoryDetails[current].reaction.push({
            reaction: sticker.id,
            type: reactionType,
            user: VARIABLES.user._id,
          });
        } else {
          newStoryDetails[current].reaction[reactionIndex] = {
            reaction: sticker.id,
            type: reactionType,
            user: VARIABLES.user._id,
          };
        }
        setContent(newStoryDetails);
        ToastMessage('Reaction Sent');
      } else {
        ToastMessage('Something went wrong');
      }
    } catch (error) {
      ToastMessage('Something went wrong');
    }
  };

  const sendReaction = sticker => async () => {
    toggleStickerFunction(false);
    if (singleStory) {
      sendReactionForStory(sticker);
    } else {
      sendReactionForHighlight(sticker);
    }
  };

  const onSendMessageStory = async () => {
    const id = generateID();
    console.log(
      'selectedData[0].stories[current].storyImgPath',
      selectedData[0].stories[current].storyImgPath,
      selectedData[0].stories[current].story_image,
    );
    const messageDetails = {
      _id: id,
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),

      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: replyText,
      sender: VARIABLES.user?._id,
      type: 'story',
      storyImage: selectedData[0].stories[current].storyImgPath,
    };

    onSendMessage(messageDetails, realm);

    try {
      const {encryptedMessage, nonce} = await encryptAndSignMessage(replyText);

      socket.emit('sendMessage', {
        receiver: VARIABLES.user?.partnerData?.partner?._id,
        message: encryptedMessage,
        nonce: nonce,
        sender: VARIABLES.user?._id,
        type: 'story',
        storyImage: selectedData[0].stories[current].storyImgPath,
      });

      CleverTap.recordEvent('Stories reply in chat');
    } catch (error) {
      console.log('erorr unable to encrypt message', error);
    }
  };

  return (
    <>
      <GestureRecognizer
        onSwipeUp={state => {
          if (
            !demo &&
            formatTimeSinceUploaded(moment(content[current]?.createdAt)) !==
              'Uploading...'
          ) {
            toggleStickerFunction(true);
          }
        }}
        onSwipeDown={state => {
          if (shareReaction) {
            toggleStickerFunction(false);
          } else {
            navigation.goBack();
          }
        }}
        config={config}
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          zIndex: -1,
        }}>
        <View style={styles.backgroundContainer}>
          {!demo ? (
            <>
              <FastImage
                // onProgress={event => {
                //   console.log(
                //     'on progress event',
                //     event,
                //     content[current]?.image,
                //   );
                // }}
                onLoadEnd={() => {
                  start();
                }}
                //  onLoadStart={() => alert('load start')}
                onLoad={event => {}}
                onError={() => {
                  console.log(
                    'Error loading image || path',
                    demo
                      ? content[current]?.image
                      : {uri: `file://${content[current]}`},
                  );
                }}
                source={
                  demo
                    ? content[current]?.image
                    : {
                        uri: `file://${content[current]?.image}`,
                        priority: FastImage.priority.high,
                      }
                }
                resizeMode={'contain'}
                style={{
                  ...styles.image,
                  height: singleStory
                    ? height - insets.bottom
                    : height / 1.15 - insets.bottom,
                }}
              />
            </>
          ) : (
            <FastImage
              onLoadEnd={() => start()}
              source={
                demo ? content[current]?.image : {uri: content[current]?.image}
              }
              resizeMode={'cover'}
              style={{
                ...styles.image,
                height: singleStory
                  ? height - insets.bottom
                  : height / 1.15 - insets.bottom,
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              left: 20,
              bottom: 30,
              flexDirection: 'row',
            }}>
            {content[current]?.reaction?.map(r => {
              console.log(r, 'reactionData');
              if (r.type === 'sticker') {
                const renderSticker = [
                  ...STORY_STICKERS_ROW_ONE,
                  ...STORY_STICKERS_ROW_TWO,
                ].find(i => i.id === r.reaction);
                console.log(renderSticker, 'renderSticker');
                return (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 35,
                        height: 35,
                        resizeMode: 'contain',
                      }}
                      source={renderSticker.sticker}
                    />
                  </View>
                );
              } else {
                const renderSticker = [
                  ...STORY_EMOJIS_ROW_ONE,
                  ...STORY_EMOJIS_ROW_TWO,
                ].find(i => i.id === r.reaction);
                console.log(renderSticker, 'renderSticker');
                return (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        resizeMode: 'contain',
                        color: 'black',
                        lineHeight: 40,
                      }}>
                      {renderSticker.emoji}
                    </Text>
                  </View>
                );
              }
            })}
          </View>
          {load && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color={'white'} />
            </View>
          )}
        </View>
        <View style={{flexDirection: 'column', flex: 1, paddingHorizontal: 12}}>
          <View style={styles.animationBarContainer}>
            {content.map((index, key) => {
              return (
                <View key={key} style={styles.animationBackground}>
                  <Animated.View
                    style={{
                      flex: current == key ? progress : content[key].finish,
                      height: 4,
                      backgroundColor: 'white',
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.userContainer}>
            {!demo ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ProfileAvatar
                  type={user_id === VARIABLES.user?._id ? 'user' : 'partner'}
                  style={styles.avatarImage}
                />
                {/* <Image
                  style={styles.avatarImage}
                  source={{
                    uri: singleStory
                      ? `${AWS_URL_S3}${props.profileImage}`
                      : `${AWS_URL_S3}${content[current]?.profileImage}`,
                  }}
                /> */}
                <Text style={styles.avatarText}>
                  {/* {Math.floor(
                  moment
                    .duration(moment() - moment(content[current]?.createdAt))
                    .asHours(),
                )}h */}
                  {formatTimeSinceUploaded(moment(content[current]?.createdAt))}
                  {/* {moment(content[current].createdAt).fromNow()} */}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <View />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!demo &&
                formatTimeSinceUploaded(moment(content[current]?.createdAt)) !==
                  'Uploading...' && (
                  <View>
                    <Pressable
                      style={{marginEnd: scale(4)}}
                      onPress={() => {
                        if (VARIABLES.disableTouch) {
                          ToastMessage('Please add a partner to continue');
                          return;
                        }
                        onPressMoreFunc();
                      }}>
                      <MoreVerticleIconSvg fill={'#fff'} />
                    </Pressable>

                    {/* <StorySecondTolltip storiesLength={stories?.length} /> */}
                  </View>
                )}
              {singleStory && (
                <Pressable
                  style={{}}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    source={APP_IMAGE.smallCross}
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: colors.white,
                      marginLeft: 8,
                    }}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.pressContainer}>
            <TouchableWithoutFeedback
              // onPressIn={() => )}
              onLongPress={() => setPressed(true)}
              onPressOut={() => {
                setPressed(false);
                startAnimation();
              }}
              onPress={() => {
                if (!pressed && !load) {
                  previous();
                }
              }}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPressIn={() => progress.stopAnimation()}
              onLongPress={() => setPressed(true)}
              onPressOut={() => {
                setPressed(false);
                startAnimation();
              }}
              onPress={() => {
                if (!pressed && !load) {
                  next();
                }
              }}>
              <View style={{flex: 1}} />
            </TouchableWithoutFeedback>
          </View>
        </View>
        {shareReaction && (
          <Modal
            style={{margin: 0}}
            avoidKeyboard={false}
            isVisible={shareReaction}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'always'}
              contentContainerStyle={{
                justifyContent: 'flex-end',
                flex: 1,
              }}
              enabled>
              <Pressable
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  toggleStickerFunction(false);
                  setreplyText('');
                }}>
                <View
                  style={{
                    //  paddingBottom: height * 0.1,
                    flex: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: '#DAE7E8',
                      padding: 3,
                      borderRadius: 100,
                      alignSelf: 'center',
                    }}>
                    {REACTION_TYPE.map(r => {
                      return (
                        <Pressable
                          style={{
                            paddingHorizontal: scale(27),
                            paddingVertical: scale(7),
                            backgroundColor:
                              reactionType === r.type ? colors.text : '#DAE7E8',
                            borderRadius: 100,
                          }}
                          onPress={() => setreactionType(r.type)}>
                          <Text
                            style={{
                              ...globalStyles.standardMediumText,
                              color:
                                reactionType === r.type
                                  ? colors.white
                                  : colors.text,
                            }}>
                            {r.type}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {reactionType === 'sticker' ? (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          //  paddingHorizontal: 25,
                          //  justifyContent: 'space-around',
                          marginTop: scale(32),
                        }}>
                        {STORY_STICKERS_ROW_ONE.map((sticker, index) => {
                          return (
                            <Pressable
                              style={{
                                marginHorizontal: index === 1 ? scale(24) : 0,
                              }}
                              onPress={sendReaction(sticker)}>
                              <Image
                                source={sticker.sticker}
                                style={{
                                  width: scale(60),
                                  height: scale(60),
                                  // width: width / 3 - 70,
                                  // height: width / 3 - 70,
                                  resizeMode: 'contain',
                                }}
                              />
                            </Pressable>
                          );
                        })}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          ///   flexWrap: 'wrap',
                          alignItems: 'center',
                          marginTop: scale(20),
                          // paddingHorizontal: 25,
                          // justifyContent: 'space-around',
                          // width: SCREEN_WIDTH - 50,
                        }}>
                        {STORY_STICKERS_ROW_TWO.map((sticker, index) => {
                          return (
                            <Pressable
                              style={{
                                marginHorizontal: index === 1 ? scale(24) : 0,
                              }}
                              onPress={sendReaction(sticker)}>
                              <Image
                                source={sticker.sticker}
                                style={{
                                  width: scale(60),
                                  height: scale(60),
                                  resizeMode: 'contain',
                                }}
                              />
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          // flexWrap: 'wrap',
                          alignItems: 'center',
                          // paddingHorizontal: 40,
                          // backgroundColor:'red',
                          marginTop: scale(32),
                        }}>
                        {STORY_EMOJIS_ROW_ONE.map((emoji, index) => {
                          return (
                            <Pressable
                              style={{
                                marginHorizontal: index === 1 ? scale(28) : 0,
                                // padding: 10,
                              }}
                              onPress={sendReaction(emoji)}>
                              <Text
                                style={{
                                  fontSize:
                                    Platform.OS === 'ios'
                                      ? scale(40)
                                      : scale(32),
                                  textAlign: 'center',
                                  color: 'black',
                                }}>
                                {emoji.emoji}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginTop: scale(12),
                        }}>
                        {STORY_EMOJIS_ROW_TWO.map((emoji, index) => {
                          return (
                            <Pressable
                              style={{
                                // width: width / 3 - 60,
                                // height: width / 3 - 60,
                                marginHorizontal: index === 1 ? scale(28) : 0,
                                // padding: 10,
                              }}
                              onPress={sendReaction(emoji)}>
                              <Text
                                style={{
                                  fontSize:
                                    Platform.OS === 'ios'
                                      ? scale(40)
                                      : scale(32),
                                  textAlign: 'center',
                                  color: 'black',
                                }}>
                                {emoji.emoji}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: colors.backgroundColor,
                    flex: 1,
                    borderTopEndRadius: scale(20),
                    borderTopStartRadius: scale(20),
                    paddingTop: scale(16),
                    paddingHorizontal: scale(16),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      // borderWidth:1,
                      borderRadius: 10,
                      // borderColor:colors.blue1,

                      paddingHorizontal: scale(16),

                      backgroundColor: '#EFE8E6',
                      alignItems: 'center',
                      height: scale(50),
                    }}>
                    <TextInput
                      ref={textInputRef}
                      placeholder="Send a reply"
                      placeholderTextColor={'#929292'}
                      style={{
                        marginEnd: 10,
                        flex: 1,
                        ...globalStyles.regularLargeText,
                        color: colors.black,
                      }}
                      // maxLength={10}
                      onChangeText={val => {
                        setreplyText(val);
                      }}
                      value={replyText}
                    />
                    <Pressable
                      hitSlop={10}
                      onPress={() => {
                        if (replyText.trim() === '') {
                          ToastMessage('Please enter message');
                          return;
                        }
                        onSendMessageStory();
                        setreplyText('');
                        toggleStickerFunction(false);
                      }}>
                      <Image
                        style={{...globalStyles.mediumIcon}}
                        source={
                          replyText?.trim() === ''
                            ? APP_IMAGE.sendMessage
                            : APP_IMAGE.sendMessageActive
                        }
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </KeyboardAwareScrollView>
          </Modal>
        )}
        {content.length < 10 && (
          <>
            {!demo && (
              <View style={{marginBottom: scale(40), alignItems: 'center'}}>
                <StoryReactTooltip />
                <Image
                  source={APP_IMAGE.arrowUp}
                  style={{
                    width: scale(22),
                    height: scale(22),
                  }}
                />
                <Text style={styles.swipeUpLabel}>
                  {'Swipe up to react & reply'}
                </Text>
              </View>
            )}
          </>
        )}
      </GestureRecognizer>
    </>
  );
};

export default StoryListItem;

StoryListItem.defaultProps = {
  duration: 10000,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  image: {
    width: '100%',

    resizeMode: 'cover',
    backgroundColor: colors.black,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.black,
    // marginBottom:20
    // zIndex:-1
  },
  spinnerContainer: {
    zIndex: 100,
    position: 'absolute',
    justifyContent: 'center',
    // backgroundColor: 'black',
    alignSelf: 'center',
    width: width,
    height: height,
  },
  animationBarContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'center',
    // position:'absolute',
    // top:0
  },
  animationBackground: {
    height: 4,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(117, 117, 117, 0.5)',
    marginHorizontal: 2,
    // borderRadius:4
  },
  userContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: 15,
    alignItems: 'center',
  },
  avatarImage: {
    height: 30,
    width: 30,
    borderRadius: 100,
  },
  avatarText: {
    fontWeight: 'bold',
    color: 'white',
    paddingLeft: 8,
  },
  closeIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 15,
  },
  pressContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  swipeUpBtn: {
    position: 'absolute',
    right: 0,
    left: 0,
    alignItems: 'center',
    bottom: Platform.OS == 'ios' ? 20 : 50,
    // zIndex:100,
    // backgroundColor:'red'
  },
  swipeUpLabel: {
    textAlign: 'center',
    ...globalStyles.standardLargeText,
    color: '#fff',
  },
});
