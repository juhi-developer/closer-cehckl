/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState, useEffect, useRef} from 'react';
import TimeStamp from './TimeStamp';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import Message from './Message';
import Sticker from './Sticker';
import Location from './Location';
import Document from './Document';
import ChatImage from './ChatImage';
import ChatVideo from './ChatVideo';
import ChatLinkPreview from './ChatLinkPreview';
import {ToastMessage} from '../../../../components/toastMessage';
import {APP_IMAGE, STICKERS} from '../../../../utils/constants';
import {colors} from '../../../../styles/colors';
import Emoji from './Emoji';
import {globalStyles} from '../../../../styles/globalStyles';
import ChatAudioMessage from './ChatAudioMessage';
import moment from 'moment';
import {getDateString} from '../../../../utils/helpers';
import ChatStoryReply from './ChatStoryReply';
import Gif from './Gif';
import {fonts} from '../../../../styles/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import {containsOnlyEmojis, isOnlyEmojis} from '../../../../utils/utils';
import {ChatOverlayModal} from './ChatOverlayModal';
import ChatReplyReactTooltip from '../../../../components/contextualTooltips/ChatReplyReactTooltip';

function ChatItem({
  item,
  onLongPress,
  onPress,
  openImage,
  setCurrentIndex,
  currentIndex,
  prevItem,
  searchWord,
  index,
  chatDataLength,
  currentSearchIndex,
}) {
  const sentByUser = item?.sender === VARIABLES?.user?._id;
  const prevUserMsg = prevItem?.sender;
  const currentUserMsg = item?.sender;
  const navigation = useNavigation();

  const [overlayModal, setOverlayModal] = useState(false);

  const [chatToolTipShown, setChatToolTipShown] = useState(false);

  const openMaps = (lat, long) => {
    const daddr = `${lat},${long}`;
    const company = Platform.OS === 'ios' ? 'apple' : 'google';
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  };

  useEffect(() => {
    toCheckTooltip();
  }, []);

  const toCheckTooltip = async () => {
    if (index === 0) {
      const tooltipAcknowledged = await AsyncStorage.getItem(
        'tooltipAcknowledgedChat',
      );
      if (tooltipAcknowledged !== 'true') {
        setChatToolTipShown(true);
      }
    }
  };

  let showTime = false;
  if (!prevItem?.id && !prevItem?._id) {
    showTime = true;
  } else if (
    moment(item.createdAt).format('DD-MM-YY') !==
    moment(prevItem?.createdAt).format('DD-MM-YY')
  ) {
    showTime = true;
  }

  const onPressMoreReactions = () => {
    onLongPress(item);
  };

  const onLongPressHandler = useCallback(() => {
    setOverlayModal(true);
  }, [onLongPress, item]);

  const onPressHandler1 = useCallback(() => {
    switch (item.type) {
      case 'location':
        openMaps(item.lat, item.long);
        break;
      case 'link':
        Linking.openURL(item.message);
        break;
      case 'doc':
        if (!item.message) {
          ToastMessage('document is uploading, please wait');
          return;
        }

        const path = RNFS.DocumentDirectoryPath + `/${item.message}`;

        navigation.navigate('WebviewScreen', {url: `file://${path}`});

        break;
      case 'image':
        openImage(item);
        break;
      default:
        onPress(item);
        break;
    }
  }, [item, openMaps, onPress, Linking, ToastMessage]);

  return (
    <>
      {showTime && (
        <View
          style={{
            alignSelf: 'center',
            paddingVertical: scale(7),
            paddingHorizontal: scale(30),
            backgroundColor: '#EEF2EF',
            borderRadius: 100,
            marginBottom: scale(15),
            marginTop: scale(2),
            borderWidth: 1,
            borderColor: '#FFFFFF',
          }}>
          <Text style={globalStyles.regularMediumText}>
            {getDateString(item.createdAt)}
          </Text>
        </View>
      )}

      {index === 0 && chatToolTipShown && (
        <ChatReplyReactTooltip
          sentByUser={sentByUser}
          onPress={() => {
            AsyncStorage.setItem('tooltipAcknowledgedChat', 'true');
            setChatToolTipShown(false);
          }}
        />
      )}
      <View
        style={{
          backgroundColor:
            currentSearchIndex === index ? colors.blue3 : 'transparent',
        }}>
        <View
          style={{
            ...styles.container,
            alignItems: sentByUser ? 'flex-end' : 'flex-start',
            marginStart: sentByUser ? scale(100) : 0,
            marginEnd: sentByUser ? 0 : scale(100),
            marginTop: prevUserMsg === currentUserMsg ? 0 : scale(6),
            marginBottom: item?.reactions.length > 0 ? scale(28) : scale(2),
          }}>
          <View
            style={{
              paddingStart: scale(12),
              paddingEnd: scale(8),
              borderBottomRightRadius: 0,
            }}>
            {item?.isDeleted ? (
              <View
                style={{
                  ...styles.viewDeleted,
                  backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
                  borderBottomRightRadius: sentByUser ? scale(0) : scale(15),
                  borderBottomLeftRadius: !sentByUser ? scale(0) : scale(15),
                }}>
                <Text style={styles.textDeleted}>This message was deleted</Text>
              </View>
            ) : (
              <Pressable
                style={{
                  //   backgroundColor: colors.primary,
                  flexShrink: 1,
                  borderRadius: scale(12),
                }}
                // onLongPress={() => {
                //   setOverlayModal(true);
                // }}
                onLongPress={onLongPressHandler}
                onPress={onPressHandler1}>
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
                                  itemId={item?._id}
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
                            onLongPress={onLongPressHandler}
                            openImage={openImage}
                            index={index}
                          />
                        );
                      case 'video':
                        return (
                          <ChatVideo
                            sentByUser={sentByUser}
                            item={item}
                            onLongPress={onLongPressHandler}
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
                            onLongPress={onLongPressHandler}
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
                            openImage={openImage}
                            onLongPress={onLongPressHandler}
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
                          backgroundColor: sentByUser
                            ? colors.blue3
                            : '#FAFBF8',
                          // backgroundColor: sentByUser
                          //   ? VARIABLES.themeData.strokeColor
                          //   : VARIABLES.themeData.themeColor,
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
            )}
          </View>
          {item?.reactions && item?.reactions?.length > 0 && (
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
          {overlayModal && (
            <ChatOverlayModal
              modalVisible={overlayModal}
              setModalVisible={setOverlayModal}
              onDismissCard={() => {
                console.log('first');
              }}
              item={item}
              onLongPress={onLongPress}
              onPress={onPress}
              openImage={openImage}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              prevItem={prevItem}
              searchWord={searchWord}
              index={index}
              sentByUser={sentByUser}
              onLongPressHandler={onLongPressHandler}
              onPressMoreReactions={onPressMoreReactions}
            />
          )}
        </View>
      </View>
    </>
  );
}

const ChatItemMemo = React.memo(ChatItem);

export default ChatItemMemo;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    marginBottom: scale(8),
    //  backgroundColor: colors.primary,
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
  textDeleted: {
    fontFamily: fonts.italicFont,
    fontSize: scale(14),
    color: colors.text,
    includeFontPadding: false,
  },
  viewDeleted: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    borderRadius: scale(15),
    marginBottom: scale(2),
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
                  style={styles.reactionImg}
                  source={
                    element?.reactionNew !== undefined &&
                    element?.reactionNew !== null
                      ? STICKERS[Number(element.reactionNew)]?.sticker
                      : {
                          uri:
                            Platform.OS === 'android'
                              ? element.reaction
                              : `${element.reaction}.png`,
                        }
                  }
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
      {/* {item?.reactions && item?.reactions.length > 3 && (
        <View>
          <Text style={{...globalStyles.regularSmallText}}>
            +{item?.reactions.length - 3}
          </Text>
        </View>
      )} */}
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
