/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import React, {useState, useRef, useEffect} from 'react';
import Modal from 'react-native-modal';
import Gif from './Gif';
import ChatStoryReply from './ChatStoryReply';
import ChatAudioMessage from './ChatAudioMessage';
import ChatLinkPreview from './ChatLinkPreview';
import ChatVideo from './ChatVideo';
import ChatImage from './ChatImage';
import Document from './Document';

import Emoji from './Emoji';
import Sticker from './Sticker';
import {scale} from '../../../../utils/metrics';
import {colors} from '../../../../styles/colors';
import Message from './Message';
import {containsOnlyEmojis} from '../../../../utils/utils';
import {VARIABLES} from '../../../../utils/variables';
import {SCREEN_WIDTH, globalStyles} from '../../../../styles/globalStyles';
import {updateRecentlyUsedEmoji} from '../../../../utils/helpers';
import FastImage from 'react-native-fast-image';
import {APP_IMAGE, STICKERS} from '../../../../utils/constants';
import TimeStamp from './TimeStamp';
import {fonts} from '../../../../styles/fonts';
import {ToastMessage} from '../../../../components/toastMessage';
import {EventRegister} from 'react-native-event-listeners';
import Location from './Location';

export const ChatOverlayModal = props => {
  const {
    setModalVisible,
    modalVisible,
    onDismissCard,
    item,
    onLongPress,
    onPress,
    openImage,
    setCurrentIndex,
    currentIndex,
    prevItem,
    searchWord,
    index,
    sentByUser,
    onLongPressHandler,
    onPressMoreReactions,
  } = props;

  const animation = useRef(new Animated.Value(0)).current; // Reference to hold the animated value

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      animation.setValue(0); // Reset the animation
    }
  }, [modalVisible, animation]);

  const animatedStyle = {
    transform: [{scale: animation}],
    opacity: animation,
  };

  const copyToClipboard = () => {
    Clipboard.setString(item?.message);
    ToastMessage('Text copied');
    setModalVisible(false);
  };

  const onReplyPress = () => {
    setModalVisible(false);
    EventRegister.emit('replyPress', index);
  };

  const onDeletePress = () => {
    setModalVisible(false);
    EventRegister.emit('deletePress', item._id);
  };

  const onDismiss = () => {
    setModalVisible(false);
  };

  const stickerItem = ({item2, containerStyle}) => {
    return (
      <Pressable
        onPress={() => {
          console.log('item2 sticker', item2);

          updateRecentlyUsedEmoji(item2);
          const obj = {
            sticker: item2?.sticker,
            type: 'sticker',
            _id: item?._id,
            id: item2?.id,
          };
          EventRegister.emit('messageReactionRecent', obj);
          setModalVisible(false);
          //   SendReactionHandler(item2.sticker, 'sticker');
        }}
        style={{marginEnd: scale(8)}}
        //  style={{width: SCREEN_WIDTH / 5, ...containerStyle}}
      >
        <FastImage
          source={STICKERS[Number(item2?.id)]?.sticker}
          // source={{

          //   uri: Platform.OS === 'android' ? item2?.name : `${item2?.name}.png`,
          //   priority: FastImage.priority.high,
          // }}
          style={{width: scale(36), height: scale(36)}}
          resizeMode="contain"
        />
      </Pressable>
    );
  };

  return (
    <Modal
      useNativeDriver
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      animationInTiming={10}
      animationOutTiming={10}
      isVisible={modalVisible}
      onBackButtonPress={() => {
        onDismiss();
      }}
      onBackdropPress={() => {
        onDismiss();
      }}
      style={{
        margin: 0,
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(false);
        }}>
        <Animated.View
          style={[
            styles.container,
            animatedStyle,
            {
              alignItems: sentByUser ? 'flex-end' : 'flex-start',
              marginStart: sentByUser ? 100 : 0,
              marginEnd: sentByUser ? 0 : scale(100),
              marginTop: scale(6),
            },
          ]}
          // style={{
          //   ...styles.container,
          //   alignItems: sentByUser ? 'flex-end' : 'flex-start',
          //   marginStart: sentByUser ? 100 : 0,
          //   marginEnd: sentByUser ? 0 : scale(100),
          //   marginTop: scale(6),
          // }}
        >
          <View
            style={{
              margin: scale(16),
            }}>
            <View style={styles.viewStickers}>
              {VARIABLES.recentReactions.map(item => {
                return stickerItem({
                  item2: item,
                  containerStyle: {width: SCREEN_WIDTH / 5 - 2},
                });
              })}
              <Pressable
                onPress={() => {
                  setModalVisible(false);

                  onPressMoreReactions();
                }}>
                <Image
                  style={{width: scale(36), height: scale(36)}}
                  source={require('../../../../assets/images/appIcons/addCircularBorder.png')}
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.viewMiddle}>
            <Pressable
              style={{
                flexShrink: 1,
                borderRadius: scale(12),
              }}>
              <>
                {(() => {
                  switch (item.type) {
                    case 'message':
                      return (
                        <>
                          <>
                            {containsOnlyEmojis(item.message) ? (
                              <Emoji
                                sentByUser={sentByUser}
                                emoji={item.message}
                                quoteMessage={item?.quotedMessage}
                              />
                            ) : (
                              <Message
                                sentByUser={sentByUser}
                                message={item.message}
                                quoteMessage={item?.quotedMessage}
                                wordMatch={searchWord}
                                index={index}
                              />
                            )}
                          </>
                        </>
                      );
                    case 'sticker':
                      return (
                        <Sticker
                          sentByUser={sentByUser}
                          sticker={item.message}
                          quoteMessage={item?.quotedMessage}
                        />
                      );
                    case 'emoji':
                      return (
                        <Emoji
                          sentByUser={sentByUser}
                          emoji={item.message}
                          quoteMessage={item?.quotedMessage}
                        />
                      );
                    case 'location':
                      return (
                        <Location
                          lat={item.lat}
                          long={item.long}
                          sentByUser={sentByUser}
                        />
                      );
                    case 'doc':
                      return (
                        <Document
                          docLink={item.message}
                          item={item}
                          docName={item.docName}
                          sentByUser={sentByUser}
                        />
                      );
                    case 'image':
                      return (
                        <ChatImage
                          item={item}
                          sentByUser={sentByUser}
                          onLongPress={onLongPress}
                          openImage={openImage}
                          index={index}
                        />
                      );
                    case 'video':
                      return (
                        <ChatVideo
                          sentByUser={sentByUser}
                          item={item}
                          onLongPress={onLongPress}
                        />
                      );
                    case 'link':
                      return (
                        <ChatLinkPreview
                          key={index}
                          sentByUser={sentByUser}
                          url={item.message}
                          item={item}
                        />
                      );
                    case 'audio':
                      return (
                        <ChatAudioMessage
                          audioName={item.message}
                          setCurrentIndex={setCurrentIndex}
                          messageIndex={item._id}
                          currentIndex={currentIndex}
                          sentByUser={sentByUser}
                          item={item}
                        />
                      );
                    case 'story':
                      return (
                        <ChatStoryReply
                          audioName={item.message}
                          setCurrentIndex={setCurrentIndex}
                          messageIndex={item._id}
                          currentIndex={currentIndex}
                          sentByUser={sentByUser}
                          item={item}
                          onLongPress={onLongPress}
                          openImage={openImage}
                        />
                      );
                    case 'gif':
                      return (
                        <Gif
                          sentByUser={sentByUser}
                          sticker={item.message}
                          item={item}
                          quoteMessage={item?.quotedMessage}
                        />
                      );
                    default:
                      break;
                  }
                })()}

                {item.type === 'sticker' ? (
                  <View
                    style={{
                      ...styles.bottomContainer,
                      marginTop: scale(-12),
                      marginBottom: scale(3),
                      flexDirection: sentByUser ? 'row' : 'row-reverse',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        //  position: 'absolute',
                        //   bottom: item.type === 'sticker' ? scale(-4) : scale(4),
                        //   end: scale(4),
                        padding: scale(9),
                        paddingBottom: scale(6),
                        borderBottomRightRadius: sentByUser ? 0 : scale(12),
                        borderBottomStartRadius: sentByUser ? scale(12) : 0,
                        borderRadius: scale(12),
                        backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
                      }}>
                      <TimeStamp time={item.createdAt} align={sentByUser} />
                      {sentByUser && readReceipt(item)}
                    </View>
                  </View>
                ) : (
                  <View style={styles.bottomContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: scale(4),
                        end: scale(4),
                      }}>
                      <TimeStamp time={item.createdAt} align={sentByUser} />
                      {sentByUser && readReceipt(item)}
                    </View>
                  </View>
                )}
              </>
            </Pressable>
            {item?.reactions && item?.reactions.length > 0 && (
              <View
                style={
                  sentByUser
                    ? {
                        position: 'absolute',
                        bottom: -scale(24),
                        end: scale(32),
                        backgroundColor: '#D8D8D8',
                        paddingHorizontal: scale(5),
                        paddingVertical: scale(3),
                        borderRadius: scale(13),
                      }
                    : {
                        position: 'absolute',
                        bottom: -scale(24),
                        start: scale(30),
                        backgroundColor: '#D8D8D8',
                        paddingHorizontal: scale(5),
                        paddingVertical: scale(3),
                        borderRadius: scale(13),
                      }
                }>
                {Stickers(item)}
              </View>
            )}
          </View>

          <View
            style={{
              width: scale(236),
              marginTop:
                item?.reactions && item?.reactions.length > 0
                  ? scale(30)
                  : scale(6),
              backgroundColor: colors.white,
              marginEnd: scale(10),
              borderRadius: scale(13),
              paddingBottom: scale(3),
            }}>
            {item.type === 'message' && (
              <>
                <Pressable
                  onPress={() => {
                    copyToClipboard();
                  }}
                  style={styles.viewRow}>
                  <Text style={styles.textRow}>Copy</Text>
                  <Image
                    style={{width: scale(24), height: scale(24)}}
                    source={require('../../../../assets/images/ic_copy.png')}
                  />
                </Pressable>
                {/* <View style={{height: scale(1), backgroundColor: '#E0E0E0'}} /> */}
              </>
            )}
            <Pressable
              onPress={() => {
                onReplyPress();
              }}
              style={styles.viewRow}>
              <Text style={styles.textRow}>Reply</Text>
              <Image
                style={{width: scale(24), height: scale(24)}}
                source={require('../../../../assets/images/ic_message.png')}
              />
            </Pressable>

            {/* <View style={{height: scale(1), backgroundColor: '#E0E0E0'}} /> */}
            {VARIABLES.user?._id === item?.sender && (
              <Pressable onPress={onDeletePress} style={styles.viewRow}>
                <Text style={styles.textRow}>Delete</Text>
                <Image
                  style={{width: scale(24), height: scale(24)}}
                  source={require('../../../../assets/images/ic_delete.png')}
                />
              </Pressable>
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    padding: 24,
    paddingTop: 28,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  container: {
    paddingHorizontal: scale(16),
    marginBottom: scale(8),
  },
  viewStickers: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: scale(31),
    height: scale(62),
    paddingHorizontal: scale(14),
    alignItems: 'center',
    marginBottom: scale(-4),
  },
  viewMiddle: {
    paddingStart: scale(12),
    paddingEnd: scale(8),
    borderBottomRightRadius: 0,
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: scale(11),
    paddingBottom: scale(8),
    paddingEnd: scale(13),
    paddingStart: scale(13),
  },
  textRow: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.blue2,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: scale(3),
    alignItems: 'center',
  },
  messageStatusClockImg: {
    width: scale(12),
    height: scale(12),
    resizeMode: 'contain',
    marginEnd: scale(2),
  },
  reactionImg: {
    width: scale(24),
    height: scale(24),
    marginEnd: 2,
    resizeMode: 'contain',
  },
  reactionContainer: {
    flexDirection: 'row',
    // marginEnd: 2,
    alignItems: 'center',
  },
});

const Stickers = item => {
  return (
    <View style={styles.reactionContainer}>
      {
        // item?.reactions &&
        //   item?.reactions.length > 0 &&
        item?.reactions.slice(0, 3).map((element, index) => {
          return (
            <View>
              {element.type === 'sticker' ? (
                <Image
                  source={STICKERS[Number(element?.reactionNew)]?.sticker}
                  // source={element?.reaction}
                  style={styles.reactionImg}
                />
              ) : (
                <Text style={{fontSize: scale(20), color: '#000'}}>
                  {element?.reaction}
                </Text>
              )}
            </View>
          );
        })
      }
    </View>
  );
};

const readReceipt = item => {
  switch (item.status) {
    case 0:
      return (
        <Image
          style={styles.messageStatusClockImg}
          source={APP_IMAGE.chatClockImg}
        />
      );
    case 1:
      return (
        <Image
          style={styles.messageStatusClockImg}
          source={APP_IMAGE.chatSingleTickImg}
        />
      );
    case 3:
      return (
        <Image
          style={{
            ...styles.messageStatusClockImg,
            tintColor: colors.blueTick,
          }}
          source={APP_IMAGE.chatDoubleTickImg}
        />
      );
    default:
      break;
  }
};
