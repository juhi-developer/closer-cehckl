/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import MoreVerticleIconSvg from '../assets/svgs/moreVerticleIconSvg';
import {APP_IMAGE, STICKERS} from '../utils/constants';
import {scale, verticalScale} from '../utils/metrics';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../styles/colors';
import {VARIABLES} from '../utils/variables';
import RNFS from 'react-native-fs';
import {downloadAndDecryptFromS3} from '../utils/helpers';
import FastImage from 'react-native-fast-image';
import naclUtil from 'tweetnacl-util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaginationDotComp from './PaginationDotComp';
import {scaleNew} from '../utils/metrics2';
import MemoryFirstReactionTooltip from './contextualTooltips/MemoryFirstReactionTooltip';
import {getTimeAgo} from '../utils/utils';
import {ProfileAvatar} from './ProfileAvatar';

const {width: screenWidth} = Dimensions.get('window');

export default function FeedCard({
  index,
  item,
  navigation,
  onPressMore,
  onSubmit,
  onPressReaction,
  onPressCommentDelete,
}) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [images, setImages] = useState(
    item?.images?.map(img => ({
      url: img.url,
      renderType: img.renderType,
      nonce: img.nonce,
      uri: null,
      loading: false,
      progress: 0,
      retry: false,
    })),
  );

  const [askPartnerInput, setAskPartnerInput] = useState('');
  const [feedToolTipShown, setFeedToolTipShown] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    toCheckTooltip();
  }, []);

  function isMoreThanAnHourOld(createdAt) {
    const createdAtDate = new Date(createdAt);
    const currentTime = new Date();
    const oneHour = 3600000; // milliseconds in one hour

    return currentTime - createdAtDate > oneHour;
  }

  const toCheckTooltip = async () => {
    if (index === 0) {
      const firstPostTime = item.createdAt;
      console.log('item created at', item.createdAt);
      const tooltipAcknowledged = await AsyncStorage.getItem(
        'tooltipAcknowledged',
      );
      const currentTime = new Date().getTime();

      if (!tooltipAcknowledged && isMoreThanAnHourOld(item.createdAt)) {
        setFeedToolTipShown(true);
      }
    }
  };

  useEffect(() => {
    item?.images?.forEach((_, index) => loadFile(index));
    return () => {};
  }, [item?.images, loadFile]);

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
            updateImageState(index, {retry: true, loading: false});
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
    <>
      <View style={{zIndex: 100}}>
        <View style={{flex: 1, zIndex: 100}}>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'row-reverse',
              top: 10,
              end: 10,
              zIndex: 100,
            }}>
            <Pressable
              hitSlop={20}
              style={styles.moreIcon}
              onPress={() => {
                onPressMore(visibleIndex);
              }}>
              <MoreVerticleIconSvg fill={'#fff'} />
            </Pressable>
          </View>
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
                        source={require('../assets/images/retry_icon.png')}
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
                    onPress={() =>
                      navigation.navigate('comments', {item: item})
                    }>
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
              zIndex: 100,
            }}>
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: scale(2),
                  justifyContent: 'space-between',
                  width: scale(100),

                  //   marginLeft: scale(4),
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
                          // source={STICKERS[Number(r.reaction)]?.sticker}
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
                          id: item?._id,
                        };
                        onPressReaction(obj);
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
                      onPressReaction(obj);
                      // setReactionData(obj);
                      // handlePresentEmojiModalPress();
                    }}
                    hitSlop={{
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
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
              {feedToolTipShown && (
                <MemoryFirstReactionTooltip
                  onPress={() => {
                    AsyncStorage.setItem('tooltipAcknowledged', 'true');
                    setFeedToolTipShown(false);
                  }}
                />
              )}
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
            <View
              style={{
                alignItems: 'flex-end',
                width: scale(100),
              }}>
              <Text
                style={{
                  ...globalStyles.regularSmallText,
                  opacity: 0.5,
                }}>
                {getTimeAgo(item?.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{marginHorizontal: scaleNew(16), marginTop: scale(20)}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            //   marginTop: scale(25),
          }}>
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

        {item?.comments.length > 0 ? (
          <>
            <View style={{}} />
            <View style={styles.commentUserContainer}>
              <ProfileAvatar
                type={
                  item?.comments[0]?.user?._id === VARIABLES.user?._id
                    ? 'user'
                    : 'partner'
                }
                style={styles.commentUserImage}
              />

              <View style={styles.commentContainer}>
                <View style={{flex: 1}}>
                  <Text style={styles.comment} numberOfLines={2}>
                    {item?.comments[0]?.comment}
                  </Text>
                  <Text style={styles.commentTimeStamp}>
                    {getTimeAgo(item?.comments[0].createdAt)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: scale(10),
                    }}>
                    {/* // {item?.comments[0]?.reactions.map(item => {
                      return (
                        <View style={{marginEnd: scale(4)}}>
                          {item?.type === 'sticker' ? (
                            <Image
                              source={item.reaction}
                              style={globalStyles.emojiIcon}
                            />
                          ) : (
                            <Text style={globalStyles.emojiIcon}>
                              {item.reaction}
                            </Text>
                          )}
                        </View>
                      );
                    })} */}

                    {/*  */}

                    {item?.comments[0]?.reactions?.length > 0 ? (
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
                        onPress={() => {
                          let obj = {
                            type: 'comment',
                            id: item?.comments[0]._id,
                            postId: item._id,
                          };
                          onPressReaction(obj);
                        }}
                        hitSlop={{
                          top: 20,
                          left: 20,
                          bottom: 20,
                        }}>
                        {item?.comments[0]?.reactions.map(r => {
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
                            <Image
                              source={
                                r?.reactionNew !== undefined &&
                                r?.reactionNew !== null
                                  ? STICKERS[Number(r.reactionNew)]?.sticker
                                  : {
                                      uri:
                                        Platform.OS === 'android'
                                          ? r.reaction
                                          : `${r.reaction}.png`,
                                    }
                              }
                              // source={{
                              //   uri:
                              //     Platform.OS === 'android'
                              //       ? r.reaction
                              //       : `${r.reaction}.png`,
                              // }}
                              style={{
                                width: scale(20),
                                height: scale(20),
                                resizeMode: 'contain',
                              }}
                            />
                          );
                        })}
                        <Pressable
                          style={{flexDirection: 'row'}}
                          onPress={() => {
                            let obj = {
                              type: 'comment',
                              id: item?.comments[0]._id,
                              postId: item._id,
                            };
                            onPressReaction(obj);
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
                            type: 'comment',
                            id: item?.comments[0]._id,
                            postId: item._id,
                          };
                          onPressReaction(obj);
                        }}
                        hitSlop={{
                          top: 20,
                          left: 20,
                          bottom: 20,
                        }}>
                        {/* <EmojiPlaceholderIconSvg style={{ marginEnd: scale(6), }} /> */}
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
                  {item?.comments[0].user?._id === VARIABLES.user._id && (
                    <Pressable
                      style={{
                        marginLeft: 10,
                      }}
                      onPress={onPressCommentDelete}
                      hitSlop={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                      }}>
                      <MoreVerticleIconSvg
                        style={{marginTop: scale(-7)}}
                        fill={'#000'}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('comments', {item: item})}
              hitSlop={{
                top: 20,
                bottom: 20,
              }}>
              <Text style={styles.viewMoreCommment}>View more comments</Text>
            </Pressable>
          </>
        ) : (
          <View
            style={{
              ...styles.inputContainer,
              backgroundColor: '#EFE8E6',
              marginTop: scale(16),
            }}>
            <TextInput
              ref={inputRef}
              placeholder="Add a comment"
              onSubmitEditing={() => {
                let params = {
                  postId: item._id,
                  comment: askPartnerInput,
                };
                onSubmit(params);
                setAskPartnerInput('');
              }}
              placeholderTextColor={colors.grey9}
              style={{
                color: '#000',
                paddingVertical: scale(16),
                flex: 1,
                ...globalStyles.regularLargeText,
              }}
              value={askPartnerInput}
              onChangeText={text => setAskPartnerInput(text)}
              // autoFocus
            />

            <Pressable
              hitSlop={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}>
              {askPartnerInput === '' ? (
                <Image
                  source={APP_IMAGE.sendMessage}
                  style={{...globalStyles.mediumIcon}}
                  resizeMode="contain"
                />
              ) : (
                <Pressable
                  onPress={() => {
                    let params = {
                      postId: item._id,
                      comment: askPartnerInput,
                    };
                    inputRef?.current?.blur?.();
                    onSubmit(params);

                    setAskPartnerInput('');
                  }}
                  hitSlop={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
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
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  postImage: {
    width: screenWidth,
    height: verticalScale(488),
    backgroundColor: 'gray',
  },
  moreIcon: {},
  userContainer: {
    flexDirection: 'row',
    flex: 1,

    marginBottom: scale(15),
    // alignItems: 'center',
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
    backgroundColor: colors.grey10,
  },
  commentUserContainer: {
    flexDirection: 'row',
    backgroundColor: colors.red2,
    padding: scale(12),
    borderRadius: scale(10),
    alignItems: 'center',
    //  marginVertical: scale(10),
    marginBottom: scale(10),
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
    // marginTop: scale(16),
    marginEnd: scale(6),
  },
  commentTimeStamp: {
    ...globalStyles.regularSmallText,
    opacity: 0.5,
    marginTop: scale(2),
  },
  emojiIcon: {
    width: scale(22),
    height: scale(22),
  },
  viewMoreCommment: {
    ...globalStyles.regularMediumText,
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
  },
  retryText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(4),
  },
});
