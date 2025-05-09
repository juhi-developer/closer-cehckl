/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import React from 'react';
import {scale} from '../../../../utils/metrics';
import {AWS_URL_S3} from '../../../../utils/urls';
import {SCREEN_WIDTH, globalStyles} from '../../../../styles/globalStyles';
import {APP_IMAGE, STICKERS} from '../../../../utils/constants';
import BlueCloseCircleIconSvg from '../../../../assets/svgs/blueCloseCircleIconSvg';
import {removeExtension} from '../../../../utils/helpers';
import FastImage from 'react-native-fast-image';
import {VARIABLES} from '../../../../utils/variables';
import RNFS from 'react-native-fs';

const LOCAL_DIRECTORY = '/CloserImages/';

const QuotedInputContainer = ({
  quotedMessage,
  themeColor,
  strokeColor,
  repliedText,
  onPressCross,
}) => {
  const path = RNFS.DocumentDirectoryPath + `/${quotedMessage?.message}`;

  console.log('pathhhh', path);

  return (
    <View
      style={{
        ...styles.replyInputContainer,
        backgroundColor: '#FFFFFF',
      }}>
      <View
        style={{
          borderBottomWidth: 2,
          borderColor: '#E6E8EE',
          paddingVertical: scale(12),
          marginHorizontal: scale(16),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // backgroundColor: 'red'
        }}>
        {quotedMessage && quotedMessage.type === 'message' ? (
          <Text
            style={{
              ...globalStyles.regularMediumText,
              flex: 1,
              marginEnd: scale(4),
            }}
            numberOfLines={1}>
            {repliedText}
          </Text>
        ) : (
          <>
            {quotedMessage &&
            (quotedMessage.type === 'image' ||
              quotedMessage.type === 'story') ? (
              <View style={{flexDirection: 'row'}}>
                <FastImage
                  source={{
                    uri:
                      quotedMessage.type === 'story'
                        ? `file://${RNFS.DocumentDirectoryPath}/${quotedMessage.storyImage}`
                        : `file://${path}`,
                  }}
                  style={{
                    width: scale(60),
                    height: scale(40),
                    backgroundColor: 'lightgrey',
                  }}
                  resizeMode="cover"
                />
                <Text
                  style={{
                    ...globalStyles.regularMediumText,
                    marginStart: 6,
                    width: SCREEN_WIDTH - 150,
                    alignSelf: 'center',
                  }}
                  numberOfLines={1}>
                  {quotedMessage.type === 'story'
                    ? quotedMessage.message
                    : 'Photo'}
                </Text>
              </View>
            ) : (
              <>
                {quotedMessage && quotedMessage.type === 'sticker' ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={STICKERS[Number(quotedMessage.message)]?.sticker}
                      style={{
                        width: scale(40),
                        height: scale(40),
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        ...globalStyles.regularMediumText,
                        marginStart: 6,
                      }}></Text>
                  </View>
                ) : (
                  <>
                    {quotedMessage && quotedMessage.type === 'emoji' ? (
                      <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 40}}>
                          {quotedMessage.message}
                        </Text>
                        <Text
                          style={{
                            ...globalStyles.regularSmallText,
                            marginStart: 6,
                          }}></Text>
                      </View>
                    ) : (
                      <>
                        {quotedMessage && quotedMessage.type === 'doc' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              flex: 1,
                              alignItems: 'center',
                            }}>
                            <Image
                              source={APP_IMAGE.pdfImage}
                              style={{
                                width: 40,
                                height: 45,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 5,
                                resizeMode: 'contain',
                              }}
                            />
                            <Text
                              style={{
                                ...globalStyles.regularMediumText,
                                flex: 1,
                                marginRight: 32,
                              }}
                              numberOfLines={2}>
                              {quotedMessage?.docName}
                            </Text>
                          </View>
                        ) : (
                          <>
                            {quotedMessage && quotedMessage.type === 'link' ? (
                              <View style={{flex: 1}}>
                                <Text
                                  style={{
                                    ...globalStyles.regularMediumText,
                                  }}
                                  numberOfLines={1}>
                                  {quotedMessage.message}
                                </Text>
                              </View>
                            ) : quotedMessage &&
                              quotedMessage.type === 'location' ? (
                              <View style={{flex: 1}}>
                                <Text
                                  style={{
                                    ...globalStyles.regularMediumText,
                                  }}
                                  numberOfLines={1}>
                                  Location
                                </Text>
                              </View>
                            ) : (
                              <>
                                {quotedMessage &&
                                quotedMessage.type === 'audio' ? (
                                  <View style={{flex: 1}}>
                                    <Text
                                      style={{
                                        ...globalStyles.regularMediumText,
                                      }}
                                      numberOfLines={1}>
                                      Audio
                                    </Text>
                                  </View>
                                ) : (
                                  <>
                                    {quotedMessage &&
                                    quotedMessage.type === 'video' ? (
                                      <View style={{flex: 1}}>
                                        <Text
                                          style={{
                                            ...globalStyles.regularMediumText,
                                          }}
                                          numberOfLines={1}>
                                          Video
                                        </Text>
                                      </View>
                                    ) : quotedMessage &&
                                      quotedMessage.type === 'gif' ? (
                                      <View style={{flexDirection: 'row'}}>
                                        <FastImage
                                          source={{
                                            uri: quotedMessage.message,
                                          }}
                                          style={{
                                            width: scale(60),
                                            height: scale(40),
                                            backgroundColor: 'lightgrey',
                                          }}
                                          resizeMode="cover"
                                        />
                                        <Text
                                          style={{
                                            ...globalStyles.regularMediumText,
                                            marginStart: 6,
                                            width: SCREEN_WIDTH - 150,
                                            alignSelf: 'center',
                                          }}
                                          numberOfLines={1}>
                                          Gif
                                        </Text>
                                      </View>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
        <Pressable
          hitSlop={10}
          onPress={() => {
            onPressCross();
          }}>
          <BlueCloseCircleIconSvg />
        </Pressable>
      </View>
    </View>
  );
};

export default QuotedInputContainer;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomStartRadius: scale(30),
    borderBottomEndRadius: scale(30),
    backgroundColor: "'#EFE8E6'",
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
    borderRadius: scale(12),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
});
