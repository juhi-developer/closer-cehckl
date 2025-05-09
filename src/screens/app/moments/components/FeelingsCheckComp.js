/* eslint-disable react-native/no-inline-styles */
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {SCREEN_WIDTH, globalStyles} from '../../../../styles/globalStyles';
import {
  APP_IMAGE,
  MOMENT_KEY,
  STICKERS,
  getFeelingsIcon,
} from '../../../../utils/constants';
import {scale} from '../../../../utils/metrics';
import Carousel from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import {AWS_URL_S3} from '../../../../utils/urls';
import {colors} from '../../../../styles/colors';
import moment from 'moment';
import {getLabelForDate} from '../../../../utils/utils';
import {cloneDeep} from 'lodash';
import PaginationDot from 'react-native-animated-pagination-dot';
import {VARIABLES} from '../../../../utils/variables';
import {useNetInfo} from '@react-native-community/netinfo';
import {ToastMessage} from '../../../../components/toastMessage';
import API from '../../../../redux/saga/request';
import FeelingCardModal from '../../../../components/Modals/feelingCardModal';
import StickersBottomSheet from '../../../../components/bottomSheet/StickersBottomSheet';
import CustomToolTip from '../../../../components/CustomToolTip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EventRegister} from 'react-native-event-listeners';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const CleverTap = require('clevertap-react-native');

export default function FeelingsCheckComp({
  onLayout,
  feelingsCheckArray,
  setFeelingsCheckArray,
  setFeelingsCheckPartnerArray,
  profileData,
  feelingsCheckPartnerArray,

  onPressFeelingsCard,
  onDismissCard,
  setMoodsDataSocket,
  setMoodsReactionSocket,
}) {
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef();

  const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
    useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleIndexPartner, setVisibleIndexPartner] = useState(0);

  const [emotion, setEmotion] = useState('Bleh');
  const [moodIcon, setMoodIcon] = useState(APP_IMAGE.emojiSad);

  const [feelingModalVisible, setFeelingModalVisible] = useState(false);
  const [reactionData, setReactionData] = useState('');

  // callbacks
  const handlePresentEmojiModalPress = useCallback(() => {
    Keyboard.dismiss();
    setStickersBottomSheetVisible(true);
  }, []);

  useEffect(() => {
    const refreshOrders = EventRegister.addEventListener(
      'newMoodAdded',
      data => {
        carouselRef.current.snapToItem(0);
      },
    );

    return () => {
      // unsubscribe event

      EventRegister.removeEventListener(refreshOrders);
    };
  }, []);

  const feelingItem = ({item, index}) => {
    return (
      <Pressable
        onLongPress={() => {
          let obj = {
            type: 'feelings',
            id: item?._id,
          };
          setReactionData(obj);
          handlePresentEmojiModalPress();
        }}
        onPress={() => {
          if (item?.answer !== '') {
            const newCardsArr = [...feelingsCheckArray];
            newCardsArr[index].isExpanded = !newCardsArr[index].isExpanded;
            setFeelingsCheckArray(newCardsArr);

            // ToastMessage(newCardsArr[index].isExpanded)
          }
        }}
        style={{
          width: SCREEN_WIDTH - scale(24),
          marginEnd: scale(16),
          minHeight: scale(117),

          paddingHorizontal: scale(12),
          borderRadius: scale(20),
          paddingVertical: scale(7.4),
          //   paddingBottom: 15,
          // backgroundColor:'red'
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ProfileAvatar
            type="user"
            style={{
              ...styles.partnerImgage,
            }}
          />

          <Text style={styles.partnerDateFeeling}>
            {getLabelForDate(feelingsCheckArray[index]?.timeStamps)},{' '}
            {moment(feelingsCheckArray[index]?.timeStamps).format('ha')}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            marginStart: scale(-5),
            marginTop: scale(-8),
            marginBottom: scale(-4),
          }}>
          <Image
            source={getFeelingsIcon(item.text)}
            style={{width: scale(46), height: scale(46)}}
          />
          <Text
            style={{
              ...globalStyles.regularLargeText,
              includeFontPadding: false,
              marginBottom: scale(8),
            }}>
            {item?.text}
          </Text>
        </View>
        {item?.isExpanded && index === visibleIndex && (
          <Text
            style={{
              ...globalStyles.regularMediumText,
              marginBottom: scale(4),
            }}>
            {item?.answer}
          </Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            {item?.reactions?.length ? (
              <Pressable
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: colors.white,
                  padding: scale(4),
                  borderRadius: 100,
                  // marginBottom: -scale(4),
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  alignSelf: 'baseline',
                }}
                onPress={() => {
                  let obj = {
                    type: 'feelings',
                    id: item?._id,
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
                      source={STICKERS[Number(r.reactionNew)]?.sticker}
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
                  hitSlop={40}
                  onPress={() => {
                    // setReactionData(item);
                    // handlePresentEmojiModalPress();
                    // ToastMessage('red')
                    let obj = {
                      type: 'feelings',
                      id: item?._id,
                    };
                    setReactionData(obj);
                    handlePresentEmojiModalPress();
                  }}>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: colors.seperator,
                      marginVertical: 4,
                      marginStart: 2,
                      marginRight: scale(5),
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
                        width: scale(8),
                        height: scale(8),
                        resizeMode: 'contain',
                        marginRight: 4,
                        marginTop: scale(-0.5),
                      }}
                    />
                  </View>
                </Pressable>
              </Pressable>
            ) : (
              <View
                style={{
                  alignItems: 'flex-start',
                }}>
                <Pressable
                  onPress={() => {
                    let obj = {
                      type: 'feelings',
                      id: item?._id,
                    };
                    setReactionData(obj);

                    setStickersBottomSheetVisible(true);
                  }}
                  style={{
                    // marginBottom: 5,
                    marginTop: scale(6),
                  }}
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}>
                  {/* <EmojiPlaceholderIconSvg/> */}
                  <Image
                    resizeMode="contain"
                    source={APP_IMAGE.emojiPlaceholder}
                    style={{
                      width: scale(20),
                      height: scale(20),
                      resizeMode: 'contain',
                      marginTop: -scale(4),
                    }}
                  />
                </Pressable>
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              //  marginEnd: scale(2),
              marginBottom: scale(-12),
            }}>
            {item?.answer !== '' && (
              <>
                {item?.isExpanded && index === visibleIndex ? (
                  <Pressable
                    style={{paddingEnd: scale(4), paddingBottom: scale(4)}}
                    hitSlop={{
                      top: 20,
                      bottom: 20,
                      right: 20,
                      left: 20,
                    }}
                    onPress={() => {
                      const newCardsArr = [...feelingsCheckArray];
                      newCardsArr[index].isExpanded =
                        !newCardsArr[index].isExpanded;
                      setFeelingsCheckArray(newCardsArr);
                      setVisibleIndex(index);
                    }}>
                    <Image
                      source={require('../../../../assets/images/arrow-right_upward.png')}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    style={{paddingEnd: scale(4), paddingBottom: scale(4)}}
                    hitSlop={{
                      top: 20,
                      bottom: 20,
                      right: 20,
                      left: 20,
                    }}
                    onPress={() => {
                      const newCardsArr = cloneDeep(feelingsCheckArray);
                      newCardsArr[index].isExpanded =
                        !newCardsArr[index].isExpanded;

                      setFeelingsCheckArray(newCardsArr);
                    }}>
                    <Image
                      source={require('../../../../assets/images/arrow-right.png')}
                    />
                  </Pressable>
                )}
              </>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const SendReactionHandler = (reaction, type) => {
    CleverTap.recordEvent('Sticker reactions added');
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (
      reactionData.type === 'sticker' ||
      reactionData.type === 'emoji' ||
      reactionData.type === 'post'
    ) {
      let params = {
        id: reactionData.id,
        type: reactionData.type,
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
      if (resp.body.statusCode === 200) {
        setMoodsReactionSocket(resp.body.data);

        //   setMoodsDataSocket(resp.body.data);
        // if (resp.body.data._id === VARIABLES.user._id) {
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

  const setFunctionForUserFeelingsCheck = data => {
    const newData = data.map(d => ({...d, isExpanded: false}));
    setFeelingsCheckArray(newData);
  };

  return (
    <View
      style={{...globalStyles.apphorizontalSpacing}}
      key={MOMENT_KEY.feelings}
      onLayout={onLayout}>
      <Text
        style={{
          ...globalStyles.semiBoldLargeText,
          includeFontPadding: false,
          fontSize: scale(20),
          marginTop: scale(16),
          marginBottom: scale(21),
        }}>
        How are we doing today?
      </Text>

      {feelingsCheckArray.length !== 0 ? (
        <View
          style={{
            borderRadius: 20,
            shadowColor:
              Platform.OS === 'android' ? '#000' : 'rgba(131, 131, 131, 0.12)',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 1,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: scale(20),
            }}>
            <Carousel
              ref={carouselRef}
              useScrollView={true}
              pagingEnabled={true}
              maxScrollVelocity={2}
              activeSlideAlignment="center"
              tappable={true}
              lockScrollWhileSnapping={true}
              decelerationRate="fast"
              onSnapToItem={async props => {
                if (props !== undefined) {
                  setVisibleIndex(props);
                }
              }}
              data={feelingsCheckArray}
              renderItem={feelingItem}
              sliderWidth={SCREEN_WIDTH - scale(32)}
              itemWidth={SCREEN_WIDTH - scale(32)}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: scale(9),
              start: 0,
              end: 0,
              justifyContent: 'center',
              alignItems: 'center',
              width: 200,
              left: (SCREEN_WIDTH - scale(32)) / 2 - 100,
            }}>
            <>
              {feelingsCheckArray.length > 1 ? (
                <PaginationDot
                  activeDotColor={'black'}
                  curPage={visibleIndex}
                  maxPage={feelingsCheckArray.length}
                  sizeRatio={0.4}
                />
              ) : (
                <View style={{marginVertical: 0}} />
              )}
            </>
          </View>

          <Pressable
            style={{
              position: 'absolute',
              top: scale(11),
              right: scale(10),
              zIndex: 100,
            }}
            onPress={() => {
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              setFeelingModalVisible(true);
              onPressFeelingsCard();
            }}>
            <Image
              source={APP_IMAGE.addCircularBorder}
              style={{...styles.icon}}
            />
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            padding: scale(12),
            backgroundColor: colors.white,
            borderRadius: scale(20),
            shadowColor:
              Platform.OS === 'android' ? '#000' : 'rgba(131, 131, 131, 0.16)',
            shadowOffset: {width: 0, height: 16},
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 2,
          }}>
          <Pressable
            style={{
              position: 'absolute',
              top: scale(15),
              right: scale(10),
              zIndex: 100,
            }}
            onPress={() => {
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              setFeelingModalVisible(true);
              onPressFeelingsCard();
            }}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}>
            <Image
              source={APP_IMAGE.addCircularBorder}
              style={{...styles.icon}}
            />
          </Pressable>

          <View style={{height: scale(117)}}>
            <Text
              style={{
                ...globalStyles.regularLargeText,
                color: colors.grey6,
                lineHeight: 24,
                marginTop: scale(6),

                marginStart: scale(6),
              }}>
              Share what’s on your mind or{`\n`}how you’re feeling!
            </Text>
          </View>
        </View>
      )}

      {feelingsCheckPartnerArray?.length !== 0 && (
        <View
          style={{
            borderRadius: scale(20),
            shadowColor:
              Platform.OS === 'android' ? '#000' : 'rgba(131, 131, 131, 0.13)',

            shadowOffset: {width: 0, height: 3},
            shadowOpacity: 1,
            shadowRadius: 3,
            elevation: 2,
            backgroundColor: '#FAE5EB',

            marginTop: scale(20),
          }}>
          <View style={{}}>
            <Carousel
              useScrollView={true}
              pagingEnabled={true}
              maxScrollVelocity={2}
              activeSlideAlignment="center"
              tappable={true}
              lockScrollWhileSnapping={true}
              decelerationRate="fast"
              onSnapToItem={async props => {
                setVisibleIndexPartner(props);
              }}
              data={feelingsCheckPartnerArray}
              renderItem={({item, index}) => (
                <Pressable
                  onLongPress={() => {
                    let obj = {
                      type: 'feelings',
                      id: item?._id,
                    };
                    setReactionData(obj);
                    handlePresentEmojiModalPress();
                  }}
                  style={{
                    width: SCREEN_WIDTH - scale(24),
                    marginEnd: scale(16),
                    paddingHorizontal: scale(12),
                    borderRadius: scale(20),
                    paddingVertical: scale(7.4),
                    minHeight: scale(117),
                    // backgroundColor:'red'
                  }}
                  onPress={() => {
                    if (item?.answer !== '') {
                      // ToastMessage('yyyy')
                      const newCardsArr = [...feelingsCheckPartnerArray];
                      newCardsArr[index].isExpanded =
                        !newCardsArr[index].isExpanded;
                      setFeelingsCheckPartnerArray(newCardsArr);
                    }
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ProfileAvatar
                      type="partner"
                      style={{
                        ...styles.partnerImgage,
                      }}
                    />

                    <Text style={styles.partnerDateFeeling}>
                      {getLabelForDate(item?.timeStamps)},{' '}
                      {moment(item?.timeStamps).format('ha')}
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      marginStart: scale(-5),
                      marginTop: scale(-8),
                      marginBottom: scale(-4),
                    }}>
                    {item?.text !== undefined && (
                      <Image
                        source={getFeelingsIcon(item.text)}
                        style={{width: scale(46), height: scale(46)}}
                      />
                    )}
                    <Text
                      style={{
                        ...globalStyles.regularLargeText,
                        marginBottom: scale(8),
                      }}>
                      {item?.text}
                    </Text>
                  </View>
                  {item?.isExpanded && index === visibleIndexPartner && (
                    <Text
                      style={{
                        ...globalStyles.regularMediumText,
                        marginBottom: scale(8),
                      }}>
                      {item?.answer}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View style={{flex: 1}}>
                      {item?.reactions?.length ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            borderWidth: 1,
                            borderColor: colors.white,
                            padding: scale(4),
                            borderRadius: 100,
                            // marginBottom: -scale(4),
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            alignSelf: 'baseline',
                          }}>
                          {item?.reactions.map((r, index) => {
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
                                  marginRight:
                                    index === item?.reactions?.length - 1
                                      ? 3
                                      : 6,
                                }}
                                source={
                                  STICKERS[Number(r.reactionNew)]?.sticker
                                }
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
                            hitSlop={{
                              top: 20,
                              bottom: 20,
                              left: 20,
                              right: 20,
                            }}
                            onPress={() => {
                              // setReactionData(item);
                              // handlePresentEmojiModalPress();
                              // ToastMessage('red')
                              let obj = {
                                type: 'feelings',
                                id: item?._id,
                              };
                              setReactionData(obj);
                              handlePresentEmojiModalPress();
                            }}>
                            <View
                              style={{
                                width: 1,
                                backgroundColor: colors.seperator,
                                marginVertical: 4,
                                marginStart: 2,
                                marginRight: scale(5),
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
                                  width: scale(8),
                                  height: scale(8),
                                  resizeMode: 'contain',
                                  marginRight: 4,
                                  marginTop: scale(-0.5),
                                }}
                              />
                            </View>
                          </Pressable>
                        </View>
                      ) : (
                        <View
                          style={{
                            alignItems: 'flex-start',
                          }}>
                          <Pressable
                            onPress={() => {
                              let obj = {
                                type: 'feelings',
                                id: item?._id,
                              };
                              setReactionData(obj);

                              setStickersBottomSheetVisible(true);
                            }}
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}>
                            {/* <EmojiPlaceholderIconSvg/> */}
                            <Image
                              resizeMode="contain"
                              source={APP_IMAGE.emojiPlaceholder}
                              style={{
                                width: scale(20),
                                height: scale(20),
                              }}
                            />
                          </Pressable>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        marginBottom: scale(-12),
                      }}>
                      {item?.answer !== '' && (
                        <>
                          {item?.isExpanded && index === visibleIndexPartner ? (
                            <Pressable
                              onPress={() => {
                                const newCardsArr = [
                                  ...feelingsCheckPartnerArray,
                                ];
                                newCardsArr[index].isExpanded = false;
                                setFeelingsCheckPartnerArray(newCardsArr);
                              }}
                              hitSlop={{
                                top: 40,
                                left: 40,
                                right: 40,
                                bottom: 40,
                              }}
                              style={{
                                paddingEnd: scale(2),
                                paddingBottom: scale(4),
                              }}>
                              <Image
                                source={require('../../../../assets/images/arrow-right_upward.png')}
                              />
                            </Pressable>
                          ) : (
                            <Pressable
                              hitSlop={{
                                top: 40,
                                left: 40,
                                right: 40,
                                bottom: 40,
                              }}
                              onPress={() => {
                                const newCardsArr = [
                                  ...feelingsCheckPartnerArray,
                                ];
                                newCardsArr[index].isExpanded =
                                  !newCardsArr[index].isExpanded;
                                setFeelingsCheckPartnerArray(newCardsArr);
                              }}>
                              <Image
                                source={require('../../../../assets/images/arrow-right.png')}
                              />
                            </Pressable>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                </Pressable>
              )}
              sliderWidth={SCREEN_WIDTH - scale(24)}
              itemWidth={SCREEN_WIDTH - scale(24)}
              style={{
                backgroundColor: '#FAE5EB',
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: scale(9),
              start: 0,
              end: 0,
              justifyContent: 'center',
              alignItems: 'center',
              width: 200,
              left: (SCREEN_WIDTH - scale(32)) / 2 - 100,
            }}>
            <>
              {feelingsCheckPartnerArray.length > 1 ? (
                <PaginationDot
                  activeDotColor={'black'}
                  curPage={visibleIndexPartner}
                  maxPage={feelingsCheckPartnerArray.length}
                  sizeRatio={0.4}
                />
              ) : (
                <View style={{marginVertical: 12}} />
              )}
            </>
          </View>
        </View>
      )}

      {stickersBottomSheetVisible && (
        <StickersBottomSheet
          bottomSheetVisible={stickersBottomSheetVisible}
          setBottomSheetVisible={setStickersBottomSheetVisible}
          SendReactionHandler={(name, type) => {
            setStickersBottomSheetVisible(false);
            SendReactionHandler(name, type);
          }}
        />
      )}

      {feelingModalVisible && (
        <FeelingCardModal
          modalVisible={feelingModalVisible}
          setModalVisible={setFeelingModalVisible}
          emotion={emotion}
          setEmotion={setEmotion}
          setMoodIcon={setMoodIcon}
          onDismissCard={onDismissCard}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  partnerDateFeeling: {
    ...globalStyles.regularSmallText,
    //  opacity: 0.7,
    marginStart: scale(6),
    includeFontPadding: false,
  },
  partnerImgage: {
    width: scale(20),
    height: scale(20),
    borderRadius: 25,
  },
});
