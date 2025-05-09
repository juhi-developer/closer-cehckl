/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
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
  Dimensions,
  ActivityIndicator,
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
import {APP_IMAGE} from '../../../utils/constants';
import {colors} from '../../../styles/colors';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from '../../../utils/metrics';
import {AWS_URL_S3} from '../../../utils/urls';
import {useDispatch, useSelector} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {AddReaction} from '../../../redux/actions';
import ImageView from 'react-native-image-viewing';

import {VARIABLES} from '../../../utils/variables';
import FastImage from 'react-native-fast-image';
import EmojiSelector from 'react-native-emoji-selector';
import {
  delay,
  downloadAndDecryptFromS3,
  updateRecentlyUsedEmoji,
} from '../../../utils/helpers';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import RNFS from 'react-native-fs';
import naclUtil from 'tweetnacl-util';
import {
  addCommentToPost,
  addReactionToPost,
  deleteCommentPost,
} from '../../../redux/saga/handlers';
import * as Progress from 'react-native-progress';
import Carousel from 'react-native-snap-carousel';
import PaginationDotComp from '../../../components/PaginationDotComp';
import {scaleNew} from '../../../utils/metrics2';
import {getTimeAgo} from '../../../utils/utils';
import StickersBottomSheet from '../../../components/bottomSheet/StickersBottomSheet';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {ProfileAvatar} from '../../../components/ProfileAvatar';

const {width: screenWidth} = Dimensions.get('window');

const CONTENT_MESSAGE = [
  {
    id: 1,
    key: 'Delete',
    label: 'Delete comment',
    icon: <DeleteIconSvg />,
  },
];

const CleverTap = require('clevertap-react-native');

export default function Comments(props) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const {route} = props;
  const {loading: isLoading} = useSelector(state => state.moments);
  const item = useSelector(state =>
    state.moments.posts.find(p => p._id === route.params.item._id),
  );
  const comments = item?.comments;

  // ref
  const flatlistref = useRef(null);
  const scrollref1 = useRef(null);
  const inputRef = useRef(null);
  const bottomSheetModalCommentRef = useRef(null);

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [images, setImages] = useState(
    item.images.map(img => ({
      url: img.url,
      renderType: img.renderType,
      nonce: img.nonce,
      uri: null,
      loading: false,
      progress: 0,
      retry: false,
    })),
  );

  const [reactionData, setReactionData] = useState('');

  const [loading, setLoading] = useState(false);
  const [visibleImage, setVisibleImage] = useState(false);
  const [message, setMessage] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [commentId, setCommentId] = useState('');
  const [repliedText, setRepliedText] = useState('');
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
    useState(false);

  useEffect(() => {
    CleverTap.recordEvent('Memories posts viewed');
  }, []);

  // callbacks
  const handlePresentEmojiModalPress = useCallback(() => {
    Keyboard.dismiss();
    setStickersBottomSheetVisible(true);
  }, []);

  const SendReactionHandler = (reaction, id, type) => {
    let params = {
      id: reactionData.id,
      type: reactionData.type,
      reaction: reaction,
      reactionNew: id?.toString(),
      reactionType: type,
    };

    CleverTap.recordEvent('Reactions on posts');

    dispatch(addReactionToPost(params));
    //  dispatch(AddReaction(params));
  };

  const snapPointsComment = useMemo(
    () => [
      SCREEN_WIDTH / 4.2 + BOTTOM_SPACE,
      SCREEN_WIDTH / 4.2 + BOTTOM_SPACE,
    ],
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
        titleBox={
          <Text style={{...globalStyles.cornerHeaderTitle}}>Comments</Text>
        }
      />
    );
  };

  const renderCommentItem = ({item, index}) => {
    return (
      <>
        <View style={[styles.commentUserContainer]}>
          <ProfileAvatar
            type={item?.user?._id === VARIABLES.user?._id ? 'user' : 'partner'}
            style={styles.commentUserImage}
          />

          <View
            style={[
              {marginStart: scale(10), flex: 1, flexShrink: 1},
              index !== comments.length - 1 && {
                // borderBottomWidth: 1,
                borderColor: colors.red4,
              },
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 1,
              }}>
              <View style={styles.commentContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.comment}>{item?.comment}</Text>
                  <Text style={styles.commentTimeStamp}>
                    {getTimeAgo(item?.createdAt)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  //     marginTop: scale(4),
                  flexDirection: 'row',
                  //  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginBottom: scale(8),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    //     marginEnd: scale(10),
                  }}>
                  {item?.reactions?.length ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderColor: colors.white,
                        padding: 4,
                        borderRadius: 100,
                        backgroundColor: 'rgba(0,0,0,0.05)',
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
                          />
                        );
                      })}
                      <Pressable
                        style={{flexDirection: 'row'}}
                        onPress={() => {
                          let obj = {
                            type: 'comment',
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
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        let obj = {
                          type: 'comment',
                          id: item._id,
                        };
                        setReactionData(obj);
                        handlePresentEmojiModalPress();
                      }}
                      style={{
                        marginBottom: 2,
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

                  {item?.user?._id === VARIABLES.user._id && (
                    <Pressable
                      onPress={() => {
                        setCommentId(item._id);
                        handlePresentModalCommentPress();
                      }}>
                      <MoreVerticleIconSvg fill={'#000'} />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  };

  const deleteCommentContent = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          setCommentId('');
          bottomSheetModalCommentRef.current.dismiss();
          if (item.key === 'Delete') {
            dispatch(deleteCommentPost(commentId));
            setCommentId('');
            // dispatch(DeleteComment(params));
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

  const onPressAddComment = () => {
    dispatch(addCommentToPost(message, item._id));
    setMessage('');
    setTimeout(() => {
      scrollref1.current.scrollToEnd();
    }, 2000);

    CleverTap.recordEvent('Memories comments added');
  };

  const InputContainer = () => {
    return (
      <View
        style={{
          ...styles.replyInputContainer,
          backgroundColor: colors.red2,
          marginBottom: insets.bottom === 0 ? 12 : insets.bottom - 14,
        }}>
        {isReply && (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: colors.red4,
              paddingVertical: scale(12),
              marginHorizontal: scale(16),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              // backgroundColor: 'red'
            }}>
            <Text
              style={{
                ...globalStyles.regularMediumText,
                flex: 1,
                marginEnd: scale(4),
              }}>
              {repliedText}
            </Text>
            <Pressable
              hitSlop={10}
              onPress={() => {
                setRepliedText('');
                setIsReply(false);
              }}>
              <BlueCloseCircleIconSvg />
            </Pressable>
          </View>
        )}
        <View style={{...styles.inputContainer, backgroundColor: colors.red2}}>
          <TextInput
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
            onFocus={async () => {
              await delay(1000);
              flatlistref.current.scrollToEnd();
            }}
          />
          <Pressable hitSlop={30}>
            {message === '' ? (
              <Image
                source={APP_IMAGE.sendMessage}
                style={{...globalStyles.mediumIcon}}
                resizeMode="contain"
              />
            ) : (
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  if (loading) {
                    return;
                  }
                  // setLoading(true);
                  if (commentId === '') {
                    onPressAddComment();
                  }
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

  useEffect(() => {
    item.images.forEach((_, index) => loadFile(index));
    return () => {};
  }, [item.images, loadFile]);

  const loadFile = useCallback(
    async index => {
      console.log('image based in index', images, index);
      const image = images[index];
      const sentByUser = item?.user?._id === VARIABLES?.user?._id; // Check if sent by the current user
      const path = RNFS.DocumentDirectoryPath + `/${image.url}`;
      // Update state function to avoid repeating code
      const updateImageState = (idx, newState) => {
        setImages(prevImages =>
          prevImages.map((img, i) => (i === idx ? {...img, ...newState} : img)),
        );
      };

      if (sentByUser) {
        // If the image is sent by the user, directly assign the URI without checking existence
        updateImageState(index, {uri: 'file://' + path});
      } else {
        const exists = await RNFS.exists(path);
        if (exists) {
          updateImageState(index, {uri: 'file://' + path});
        } else {
          updateImageState(index, {loading: true, progress: 0});
          console.log('going to download', image.url, 'profiles', image.nonce);

          try {
            const nonce = naclUtil.decodeBase64(image.nonce);
            await downloadAndDecryptFromS3(
              image.url,
              'profiles',
              nonce,
              progress => {
                updateImageState(index, {progress});
                console.log('progress', index, progress);
              },
            );
            updateImageState(index, {uri: 'file://' + path, loading: false});
          } catch (error) {
            const exists = await RNFS.exists(path);
            if (exists) {
              updateImageState(index, {uri: 'file://' + path});
            } else {
              updateImageState(index, {retry: true, loading: false});
            }
            console.error(
              'Error downloading and decrypting file:',
              image.url,
              error,
            );
          }
        }
      }
    },
    [images],
  );

  return (
    <KeyboardAvoidingView // if input container stays at bottom
      style={{flex: 1}}
      behavior={'padding'}
      // keyboardVerticalOffset={keyboardHeight}
    >
      <AppView
        scrollref={scrollref1}
        scrollContainerRequired
        isScrollEnabled
        isLoading={isLoading}
        header={AppHeader}>
        <View>
          <View>
            <View>
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                  const newIndex = Math.round(
                    event.nativeEvent.contentOffset.x / screenWidth,
                  );
                  setVisibleIndex(newIndex);
                }}
                renderItem={({item: image, index}) => (
                  <View style={styles.postImage}>
                    {image.retry ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <Pressable
                          onPress={() => {
                            setImages(prevImages =>
                              prevImages.map((img, idx) =>
                                idx === index ? {...img, retry: false} : img,
                              ),
                            );
                            setTimeout(() => {
                              loadFile(index);
                            }, 200);
                          }}>
                          <Image
                            resizeMode="contain"
                            style={{
                              width: scale(24),
                              height: scale(24),
                              alignSelf: 'center',
                            }}
                            source={require('../../../assets/images/retry_icon.png')}
                          />
                          <Text style={styles.retryText}>Download</Text>
                        </Pressable>
                      </View>
                    ) : image.loading ? (
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}>
                        <ActivityIndicator size="large" />
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => {
                          setVisibleImage(true);
                        }}>
                        <FastImage
                          source={{uri: image.uri}}
                          style={styles.postImage}
                          resizeMode={image.renderType || 'cover'}
                          onError={e =>
                            console.log(`Error loading image: ${image.uri}`)
                          }
                        />
                      </Pressable>
                    )}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: scaleNew(11),
                  marginHorizontal: scaleNew(16),
                }}>
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: scale(2),
                      justifyContent: 'space-between',
                      ///   marginLeft: scale(4),
                      width: scale(100),
                    }}>
                    {item?.reactions && item?.reactions.length > 0 ? (
                      <Pressable
                        style={{
                          flexDirection: 'row',
                          borderWidth: 1,
                          borderColor: colors.white,
                          padding: 4,
                          borderRadius: 100,
                          // marginBottom: 5,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                        }}
                        hitSlop={{
                          top: 20,
                          bottom: 20,
                          left: 20,
                          right: 20,
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
                            />
                          );
                        })}
                        <Pressable
                          style={{flexDirection: 'row'}}
                          onPress={() => {
                            let obj = {
                              type: 'post',
                              id: item?._id,
                            };
                            setReactionData(obj);
                            handlePresentEmojiModalPress();
                          }}
                          hitSlop={{
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20,
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
                          let obj = {
                            type: 'post',
                            id: item._id,
                          };
                          setReactionData(obj);
                          handlePresentEmojiModalPress();
                          // setReactionData(obj);
                          // handlePresentEmojiModalPress();
                        }}>
                        {/* <EmojiPlaceholderIconSvg/> */}
                        <Image
                          source={APP_IMAGE.emojiPlaceholder}
                          style={{
                            width: scale(20),
                            height: scale(20),
                            resizeMode: 'contain',
                            tintColor: '#7E838F',
                          }}
                        />
                      </Pressable>
                    )}
                  </View>
                </>
                {images?.length > 1 && (
                  <PaginationDotComp
                    currentIndex={visibleIndex}
                    totalDots={images?.length}
                    activeColor="#808491"
                    inactiveColor="#D8D8D8"
                    size={scaleNew(5)}
                    viewStyle={{}}
                  />
                )}

                <View style={{alignItems: 'flex-end', width: scale(100)}}>
                  <Text
                    style={{...globalStyles.regularSmallText, opacity: 0.5}}>
                    {getTimeAgo(item?.createdAt)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.userContainer}>
              {item?.user?.name === undefined ? (
                <FastImage
                  source={APP_IMAGE.appIcon}
                  style={{
                    ...styles.userImage,
                    backgroundColor: 'transparent',
                  }}
                  resizeMode="contain"
                />
              ) : (
                <ProfileAvatar
                  type={
                    item?.user?._id === VARIABLES.user?._id ? 'user' : 'partner'
                  }
                  style={styles.userImage}
                />
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flex: 1,
                  alignItems: item.title ? null : 'center',
                }}>
                <Text style={styles.userCaption}>
                  <Text
                    style={{
                      ...globalStyles.semiBoldMediumText,
                    }}>
                    {`${
                      item?.user?.name === undefined
                        ? item?.name
                        : item?.user?.name
                    } `}
                  </Text>
                  {item?.title}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <FlatList
          ref={flatlistref}
          data={comments}
          //  ListHeaderComponent={renderHeader}
          renderItem={renderCommentItem}
          keyExtractor={(item, index) => index}
          //   ItemSeparatorComponent={itemSeparatorComponent}
          // ListHeaderComponent={Header}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            //     marginHorizontal: 12,
            marginBottom: scale(8),
            marginTop: scale(19),
          }}
          ListFooterComponent={() => {
            return <View style={{height: 16}} />;
          }}
        />
      </AppView>
      {InputContainer()}

      <ImageView
        images={images}
        imageIndex={visibleIndex}
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
        }}>
        <BottomSheetFlatList
          data={CONTENT_MESSAGE}
          keyExtractor={(i, index) => index}
          renderItem={deleteCommentContent}
          contentContainerStyle={{...styles.contentContainer}}
          ItemSeparatorComponent={itemContentSeparatorComponent}
        />
      </BottomSheetModal>

      {stickersBottomSheetVisible && (
        <StickersBottomSheet
          bottomSheetVisible={stickersBottomSheetVisible}
          setBottomSheetVisible={setStickersBottomSheetVisible}
          SendReactionHandler={(name, type, id) => {
            setStickersBottomSheetVisible(false);
            SendReactionHandler(name, id, type, reactionData);
            setReactionData('');
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
    marginTop: scale(18),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  postImage: {
    width: screenWidth,
    height: verticalScale(488),
    backgroundColor: 'lightgray',
  },
  moreIcon: {
    position: 'absolute',
    right: scale(10),
    top: scale(20),
  },
  userContainer: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: scaleNew(16),
    marginTop: scale(20),
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
    backgroundColor: colors.grey10,
  },

  commentUserContainer: {
    marginHorizontal: scaleNew(16),
    flexDirection: 'row',
    backgroundColor: colors.red2,
    paddingTop: scale(15),
    paddingHorizontal: scale(16),
    borderRadius: scale(10),
    marginBottom: scale(10),
    paddingVertical: scale(15),
    // alignItems: 'center',
    // marginVertical: 10
  },
  commentUserImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: colors.grey10,
  },
  commentContainer: {
    flexDirection: 'row',
    flexShrink: 1,
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
    //  marginTop: 4,
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
    marginHorizontal: scaleNew(16),
    marginBottom: scale(12),
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
  retryText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(4),
  },
});
