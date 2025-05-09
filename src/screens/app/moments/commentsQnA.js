/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import AppView from '../../../components/AppView';
import CornerHeader from '../../../components/cornerHeader';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import {STICKERS} from '../../../utils/constants';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import {APP_IMAGE, APP_STRING} from '../../../utils/constants';
import EmojiPlaceholderIconSvg from '../../../assets/svgs/emojiPlaceholderIconSvg';
import {colors} from '../../../styles/colors';
import SendMessageIconSvg from '../../../assets/svgs/sendMessageIconSvg';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboard} from '@react-native-community/hooks';
import {scale, verticalScale} from '../../../utils/metrics';
import {API_BASE_URL, AWS_URL_S3} from '../../../utils/urls';
import {useDispatch, useSelector} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  AddComment,
  AddReaction,
  ClearAction,
  DeleteComment,
} from '../../../redux/actions';
import ImageView from 'react-native-image-viewing';

import * as actions from '../../../redux/actionTypes';
import AddDocumentIconSvg from '../../../assets/svgs/addDocumentIconSvg';
import {VARIABLES} from '../../../utils/variables';
import FastImage from 'react-native-fast-image';
import EmojiSelector from 'react-native-emoji-selector';
import API from '../../../redux/saga/request';
import {
  getStateDataAsync,
  updateRecentlyUsedEmoji,
} from '../../../utils/helpers';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';

import {useSocket} from '../../../utils/socketContext';
import {EventRegister} from 'react-native-event-listeners';
import {fonts} from '../../../styles/fonts';
import {scaleNew} from '../../../utils/metrics2';
import {useAppContext} from '../../../utils/VariablesContext';
import {getTimeAgo} from '../../../utils/utils';
import StickersBottomSheet from '../../../components/bottomSheet/StickersBottomSheet';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {ProfileAvatar} from '../../../components/ProfileAvatar';

const CONTENT_MESSAGE = [
  {
    id: 1,
    key: 'Delete',
    label: 'Delete comment',
    icon: <DeleteIconSvg />,
  },
];

const CleverTap = require('clevertap-react-native');

export default function CommentsQnA(props) {
  const {socket, isSocketConnected} = useSocket();
  const {hornyMode} = useAppContext();

  const {route} = props;
  /// const comments = route.params.item.comments;
  const disabled = route.params.disabled;
  //  let item = route.params.item;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  const [visibleImage, setVisibleImage] = useState(false);
  const [item, setItem] = useState(route.params.item);
  const [comments, setComments] = useState(route.params.item.comments);
  const [message, setMessage] = useState('');
  const [commentId, setCommentId] = useState('');
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const cardColor = item?.colorcode;

  let titleColor, descriptionColor, buttonColor, bottomBg, bgColor;

  switch (cardColor) {
    case 'green':
      titleColor = colors.golden;
      descriptionColor = colors.warmWhite;
      buttonColor = colors.quizTextGreen;
      bottomBg = colors.commentBgQuiz;
      bgColor = colors.greenBgQuiz;
      break;
    case 'golden':
      titleColor = colors.greenBgQuiz;
      descriptionColor = colors.black;
      buttonColor = '#E1AE5C';
      bottomBg = '#FCD18A';

      bgColor = '#FDC56B';
      break;
    case 'orange':
      titleColor = colors.warmWhite;
      descriptionColor = colors.black;
      buttonColor = '#CD875F';
      bottomBg = '#F8B88F';

      bgColor = '#F8A271';
      break;
    case 'pink':
      titleColor = colors.greenBgQuiz;
      descriptionColor = colors.black;
      buttonColor = '#DAB7AF';
      bottomBg = '#FCDFD4';

      bgColor = '#FDD8D0';
      break;
    default:
      titleColor = colors.golden;
      descriptionColor = colors.warmWhite;
      buttonColor = colors.quizTextGreen;
      bottomBg = colors.commentBgQuiz;

      bgColor = colors.greenBgQuiz;
  }

  if (hornyMode) {
    bgColor = '#3C1859';
    descriptionColor = 'rgba(189, 189, 189, 1)';
    buttonColor = '#4D2777';
    bottomBg = 'rgb(86, 48, 138)';
    titleColor = 'rgba(224, 224, 224, 1)';
  }
  const inputRef = useRef(null);

  // ref
  const bottomSheetModalCommentRef = useRef(null);

  const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
    useState(false);

  const [reactionData, setReactionData] = useState('');

  useEffect(() => {
    // if (route.params.input) {
    //   setMessage(route.params?.input);
    // }
    getQnaDetails();
  }, []);

  const getQnaDetails = async () => {
    const resp = await API('user/moments/QnA', 'GET');
    setRefreshing(false);
    if (resp.body.statusCode === 200) {
      if (hornyMode) {
        setComments(resp.body.data?.hornyCard?.comments);
      } else {
        setComments(resp.body.data?.QnA?.comments);
      }
    }
  };

  useEffect(() => {
    if (isSocketConnected && socket) {
      socket.on('commentsQnA', data => {
        setUpdatedComments(data);
      });
      socket.on('deleteQnaComment', data => {
        setDeleteComments(data);
      });

      socket.on('QnAReactions', data => {
        setReactionData('');
        setLoading(false);

        console.log('dta QnAReactions reaction ', data);
        updateCommentData(data);
      });
    }

    return () => {
      if (isSocketConnected && socket) {
        socket.off('QnAReactions');
        socket.off('commentsQnA');
        socket.off('deleteQnaComment');
      }
    };
  }, [isSocketConnected, socket]);

  const updateCommentData = async response => {
    console.log('console response reaction comments qa', response);
    // Fetch the current state of comments
    const prevComments = await getStateDataAsync(setComments); // I'm assuming getStateDataAsync works with setComments too

    const {_id, commentId, reaction} = response;

    // Clone comments state for immutability
    const newComments = [...prevComments];

    // Find the index of the comment with the given commentId
    const commentIndex = newComments.findIndex(
      comment => comment._id === commentId,
    );

    if (commentIndex !== -1) {
      const comment = newComments[commentIndex];

      // Find the index of the reaction with the given user id
      const reactionIndex = comment.reactions.findIndex(
        r => r.user === reaction.user,
      );

      if (reactionIndex !== -1) {
        // User has reacted before, update the reaction
        newComments[commentIndex].reactions[reactionIndex] = reaction;
      } else {
        // This is a new reaction from the user, add it to the array
        newComments[commentIndex].reactions.push(reaction);
      }

      // Update the state
      setComments(newComments);
    }
  };

  const setDeleteComments = async data => {
    setLoading(true); // Assuming you want to show loading at the beginning

    try {
      // Fetch the current state of comments
      const prevArray = await getStateDataAsync(setComments);

      // Filter out the comment with the matching _id
      const newArray = prevArray.filter(item => item._id !== data.commentId);

      // Update the state with the new array of comments
      setComments(newArray);

      // Reset other state variables as needed
      setMessage('');
      setCommentId('');
    } catch (error) {
      // Handle any errors that occur during the fetch or state update
      console.error('Error updating comments:', error);
    } finally {
      setCommentId('');
      setLoading(false); // Hide loading indicator after the operation is complete
    }
  };

  const setUpdatedComments = async data2 => {
    const prevArray = await getStateDataAsync(setComments);
    setComments([...prevArray, data2.comment]);
    setMessage('');
    setLoading(false);

    setCommentId('');

    // setTimeout(() => {
    //   flatlistref.current?.scrollToEnd({animated: true});
    // }, 1000);
  };

  // callbacks
  const handlePresentEmojiModalPress = useCallback(() => {
    Keyboard.dismiss();

    setStickersBottomSheetVisible(true);
  }, []);

  const SendReactionHandler = (reaction, type, id) => {
    setStickersBottomSheetVisible(false);
    CleverTap.recordEvent('Sticker reactions added');
    let params = {
      commentId: reactionData.id,
      type: reactionData.type,
      reaction: reaction,
      reactionNew: id?.toString(),

      reactionType: type,
    };

    setLoading(true);
    addReaction(params);
  };

  const addReaction = async payload => {
    let params = {
      commentId: payload.commentId,
      type: payload.reactionType,
      reaction: payload.reaction,
      reactionNew: payload.reactionNew,
    };

    console.log('paramsmmssm 1', payload);
    try {
      const resp = await API('user/moments/commentQnA', 'PUT', params);
      setLoading(false);
      if (resp.body.statusCode === 200) {
        console.log(
          'received reaction ressssssssssss',
          JSON.stringify(resp.body.data),
        );
        updateCommentData(resp.body.data);
      } else {
        alert(resp.body.message);

        setReactionData('');
      }
      console.log('resp feelings add', resp);
    } catch (error) {
      setLoading(false);
      console.log(error);

      setReactionData('');
      alert('Something went wrong');
    }
  };

  // variables
  // const snapPointsNote = useMemo(() => ["20%", "20%",], []);
  const snapPointsComment = useMemo(
    () => [SCREEN_WIDTH / 6 + BOTTOM_SPACE, SCREEN_WIDTH / 6 + BOTTOM_SPACE],
    [],
  );

  // callbacks
  const handlePresentModalCommentPress = useCallback(() => {
    bottomSheetModalCommentRef.current.present();
    setSheetEnabled(true);
  }, []);

  const handleSheetCommentChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      setCommentId('');
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  const AppHeader = () => {
    return (
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => props.navigation.goBack()}
        titleBox={<Text style={{...globalStyles.cornerHeaderTitle}}></Text>}
        // titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderCommentItem = ({item, index}) => {
    return (
      <>
        <View style={styles.commentUserContainer}>
          <ProfileAvatar
            type={item?.user?._id === VARIABLES.user?._id ? 'user' : 'partner'}
            style={styles.commentUserImage}
          />

          <View
            style={[
              {marginStart: scale(10), flex: 1},
              index !== comments.length - 1 && {
                borderBottomWidth: 1,
                borderColor: colors.red4,
              },
            ]}>
            <View style={styles.commentContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.comment}>{item?.comment}</Text>
                <Text style={styles.commentTimeStamp}>
                  {getTimeAgo(item?.createdAt)}
                </Text>
              </View>

              {item?.user?._id === VARIABLES.user._id && (
                <Pressable
                  onPress={() => {
                    if (disabled) {
                      return;
                    }
                    setCommentId(item._id);
                    handlePresentModalCommentPress();
                  }}
                  hitSlop={20}>
                  <MoreVerticleIconSvg fill={'#000'} />
                </Pressable>
              )}
            </View>
            <View
              pointerEvents={disabled ? 'none' : 'auto'}
              style={{
                marginTop: scale(16),
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {item?.reactions?.length ? (
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      borderWidth: 1,
                      borderColor: colors.white,
                      padding: 4,
                      borderRadius: 100,
                      marginBottom: scale(2),
                      backgroundColor: 'rgba(0,0,0,0.05)',
                    }}
                    onPress={() => {
                      let obj = {
                        type: 'post',
                        id: item._id,
                      };
                      setReactionData(obj);
                      handlePresentEmojiModalPress();
                    }}>
                    {item?.reactions.map(r => {
                      if (r.type === 'emoji') {
                        return (
                          <View
                            style={{
                              ...globalStyles.emojiIcon,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text>{r.reaction}</Text>
                          </View>
                        );
                      }
                      return (
                        <FastImage
                          resizeMode="contain"
                          style={{
                            width: scale(20),
                            height: scale(20),
                            resizeMode: 'contain',
                            marginRight: 6,
                          }}
                          source={
                            r?.reactionNew !== undefined &&
                            r?.reactionNew !== null
                              ? STICKERS[Number(r.reactionNew)]?.sticker
                              : {
                                  uri:
                                    Platform.OS === 'android'
                                      ? r.reaction
                                      : `${r.reaction}.png`,
                                  priority: FastImage.priority.high,
                                }
                          }
                          //  source={STICKERS[Number(r.reactionNew)]?.sticker}
                          // source={{
                          //   uri:
                          //     Platform.OS === 'android'
                          //       ? r.reaction
                          //       : `${r.reaction}.png`,
                          //   priority: FastImage.priority.high,
                          // }}
                        />
                      );
                    })}
                    <Pressable
                      style={{flexDirection: 'row'}}
                      onPress={() => {
                        let obj = {
                          type: 'post',
                          id: item._id,
                        };
                        setReactionData(obj);
                        handlePresentEmojiModalPress();
                      }}>
                      <View
                        style={{
                          width: 1,
                          backgroundColor: colors.seperator,
                          margin: 3,
                          marginRight: 5,
                        }}
                      />
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={APP_IMAGE.plusWithoutBack}
                          style={{
                            width: scale(12),
                            height: scale(12),
                            resizeMode: 'contain',
                            marginRight: 4,
                          }}
                        />
                      </View>
                    </Pressable>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      // setReactionData(item);
                      // handlePresentEmojiModalPress();
                      let obj = {
                        type: 'post',
                        id: item._id,
                      };
                      setReactionData(obj);
                      handlePresentEmojiModalPress();
                    }}
                    style={{
                      marginBottom: 5,
                    }}>
                    <Image
                      source={APP_IMAGE.emojiPlaceholder}
                      style={{
                        width: scale(20),
                        height: scale(20),
                        resizeMode: 'contain',
                      }}
                    />
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const deleteComment = async payload => {
    setLoading(true);
    try {
      const resp = await API(
        `user/moments/QnA?commentId=${payload.id}`,
        'DELETE',
      );

      setLoading(false);
      console.log('resp feelings delete', resp, payload);

      if (resp.body.statusCode === 200) {
        EventRegister.emit('QnARefresh');
        //    EventRegister.emit('deleteQnaComment', resp.body.data);
        setDeleteComments(resp.body.data);
      } else {
        setLoading(false);
        alert(resp.body.Message);
        setCommentId('');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

      setCommentId('');
      alert('Something went wrong');
    }
  };

  const deleteCommentContent = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          bottomSheetModalCommentRef.current.dismiss();
          if (item.key === 'Delete') {
            // setGalleryAndCameraModal(true)

            let params = {
              id: commentId,
            };
            setLoading(true);
            deleteComment(params);
            setSheetEnabled(false);
          }
        }}>
        <View>{item.icon}</View>
        <Text style={{...globalStyles.regularLargeText, marginStart: 16}}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const Header = () => {
    return (
      <View
        style={{
          marginHorizontal: scale(16),
          backgroundColor: bgColor,
          overflow: 'hidden',

          borderRadius: 16,
          padding: scale(24),
          marginBottom: scale(24),
        }}>
        <View style={{flex: 1, marginBottom: scale(24)}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.titleText, {color: titleColor}]}>
              Couch Conversations
            </Text>
            <Text
              style={{
                ...styles.titleText,
                marginTop: Platform.OS === 'ios' ? -scaleNew(1) : -scaleNew(2),
              }}>
              {' '}
              🛋️
            </Text>
          </View>
          <Text style={{...styles.questionText, color: descriptionColor}}>
            {item?.question}
          </Text>
        </View>
      </View>
    );
  };

  const onPressAddComment = () => {
    let params = {
      comment: message,
      type: hornyMode ? 'Horny' : 'QnA',
    };
    setLoading(true);
    addComment(params);
  };

  const addComment = async payload => {
    Keyboard.dismiss();
    try {
      const resp = await API('user/moments/QnA', 'POST', payload);
      if (resp.body.statusCode === 200) {
        if (hornyMode) {
          CleverTap.recordEvent('Hm Quiz answered: open ended');
          CleverTap.recordEvent('Hm quiz cards answered');
        } else {
          CleverTap.recordEvent('Quiz cards answered');
          CleverTap.recordEvent('Quiz answered: open ended');
        }
        setUpdatedComments(resp.body.data);
        EventRegister.emit('QnARefresh');
        //   EventRegister.emit('addQnaComment', resp.body.data);
        //  item.comments = resp.body.data.QnA.comments;
        setMessage('');
        setLoading(false);

        setCommentId('');
      } else {
        setMessage('');
        setLoading(false);
        alert(resp.body.message);

        setCommentId('');
      }
      console.log('resp feelings add', resp);
    } catch (error) {
      setMessage('');
      setLoading(false);
      console.log(error);

      setCommentId('');

      alert('Something went wrong');
    }
  };

  const InputContainer = () => {
    return (
      <View
        style={{
          ...styles.replyInputContainer,
          backgroundColor: colors.red2,
          marginBottom: insets.bottom === 0 ? 12 : insets.bottom - 14,
        }}>
        <View style={{...styles.inputContainer, backgroundColor: colors.red2}}>
          <TextInput
            editable={!disabled}
            ref={inputRef}
            placeholder="Add a comment"
            placeholderTextColor={colors.grey9}
            style={{
              ...globalStyles.regularLargeText,
              paddingVertical: scale(16),
              flex: 1,
              color: colors.text,
            }}
            value={message}
            onChangeText={text => setMessage(text)}
            // autoFocus
          />
          <Pressable hitSlop={10}>
            {message === '' ? (
              <Image
                source={APP_IMAGE.sendMessage}
                style={{...globalStyles.mediumIcon}}
                resizeMode="contain"
              />
            ) : (
              <Pressable
                onPress={() => {
                  if (loading) {
                    return;
                  }

                  onPressAddComment();
                }}>
                <Image
                  source={APP_IMAGE.sendMessageActive}
                  style={{...globalStyles.mediumIcon}}
                  resizeMode="contain"
                />
              </Pressable>
            )}
          </Pressable>
        </View>
      </View>
    );
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

  return (
    <KeyboardAvoidingView // if input container stays at bottom
      style={{flex: 1}}
      behavior={'padding'}
      ///  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // keyboardVerticalOffset={keyboardHeight}
    >
      <AppView
        shouldRefresh={true}
        scrollContainerRequired={true}
        isScrollEnabled={true}
        handleRefresh={() => {
          setRefreshing(true);

          getQnaDetails();
        }}
        refreshing={refreshing}
        isLoading={loading}
        header={AppHeader}>
        {Header()}
        <View style={{marginBottom: scale(16)}}>
          <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{marginHorizontal: scale(16)}}
            // ListHeaderComponent={Header}
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: colors.red2,
              marginHorizontal: 12,
              borderRadius: 10,
            }}
          />
        </View>
      </AppView>
      {InputContainer()}
      <ImageView
        images={[{uri: `${AWS_URL_S3}${item.url}`}]}
        imageIndex={0}
        visible={visibleImage}
        onRequestClose={() => setVisibleImage(false)}
        doubleTapToZoomEnabled={true}
      />

      <BottomSheetModal
        ref={bottomSheetModalCommentRef}
        index={1}
        snapPoints={snapPointsComment}
        onChange={handleSheetCommentChanges}
        backgroundStyle={{
          backgroundColor: colors.primary,
        }}
        // style={{ backgroundColor: themeColor }}
      >
        <BottomSheetFlatList
          data={CONTENT_MESSAGE}
          keyExtractor={(i, index) => index}
          renderItem={deleteCommentContent}
          contentContainerStyle={{...styles.contentContainer}}
          ItemSeparatorComponent={itemContentSeparatorComponent}
          style={{
            marginTop: 5,
          }}
        />
      </BottomSheetModal>

      {stickersBottomSheetVisible && (
        <StickersBottomSheet
          bottomSheetVisible={stickersBottomSheetVisible}
          setBottomSheetVisible={setStickersBottomSheetVisible}
          SendReactionHandler={(name, type, id) => {
            setStickersBottomSheetVisible(false);

            SendReactionHandler(name, type, id);
            setReactionData('');
          }}
        />
      )}

      {sheetEnabled && (
        <Pressable
          style={globalStyles.backgroundShadowContainer}
          onPress={() => {
            setSheetEnabled(false);
            bottomSheetModalCommentRef.current.dismiss();
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: verticalScale(488),
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
    lineHeight: 21,
  },
  userImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
  },

  commentUserContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    // borderRadius: 10,
    // alignItems: 'center',
    // marginVertical: 10
  },
  commentUserImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
  },
  commentContainer: {
    flexDirection: 'row',
    // marginStart: 10,
    // flex: 1
  },
  comment: {
    ...globalStyles.regularMediumText,
    // marginTop: 16,
    marginEnd: scale(6),
    lineHeight: 21,
  },
  commentTimeStamp: {
    ...globalStyles.regularSmallText,
    opacity: 0.5,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
  },
  replyInputContainer: {
    marginHorizontal: scale(16),
    marginBottom: scale(12),
    borderRadius: scale(12),
    // backgroundColor: 'red'
  },

  knowBetterLabel: {
    ...globalStyles.regularLargeText,
    color: colors.blue9,
    marginTop: scale(8),
    fontSize: scale(18),
  },

  callsMoreLabel: {
    ...globalStyles.semiBoldLargeText,
    color: colors.white,
    marginTop: scale(14),
    fontSize: scale(18),
    //  width: scale(230),
    lineHeight: scale(31),
    flexShrink: 1,
    marginEnd: 12,
  },
  titleText: {
    fontFamily: fonts.regularSerif,
    fontSize: scale(20),
  },
  questionText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: colors.white,
    marginTop: scale(10),
  },
});
