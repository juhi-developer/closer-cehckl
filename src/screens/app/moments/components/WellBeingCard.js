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
import {scaleNew} from '../../../../utils/metrics2';
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
import {EventRegister} from 'react-native-event-listeners';
import {fonts} from '../../../../styles/fonts';
import {scale} from '../../../../utils/metrics';
import {useAppContext} from '../../../../utils/VariablesContext';
import MoodCardFirstTooltip from '../../../../components/contextualTooltips/MoodCardFirstTooltip';
import MoodCardMoreCardTooltip from '../../../../components/contextualTooltips/MoodCardMoreCardTooltip';
import MoodCardExpandTooltip from '../../../../components/contextualTooltips/MoodCardExpandTooltip';
import ReactionComp from '../../../../components/ReactionComp';
import {checkContextualTooltip} from '../../../../utils/contextualTooltips';

import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const CleverTap = require('clevertap-react-native');

const firstEmoji = '😣';
const secondEmoji = '😵‍💫';
const thirdEmoji = '🙂';
const fourthEmoji = '😇';
const fifthEmoji = '😎';

const COLOR_SET = {
  [firstEmoji]: {
    background: '#FFECE4',
    textColor: '#F37948',
  },
  [secondEmoji]: {
    background: '#FFF8F5',
    textColor: '#F79269',
  },
  [thirdEmoji]: {
    background: '#FFF9E9',
    textColor: '#E0C11E',
  },
  [fourthEmoji]: {
    background: '#F1F4FF',
    textColor: '#87A1FF',
  },
  [fifthEmoji]: {
    background: '#E4EBFF',
    textColor: '#5E80FA',
  },
};

export default function WellBeingCard({
  onLayout,
  feelingsCheckArray,
  setFeelingsCheckArray,
  setFeelingsCheckPartnerArray,
  profileData,
  feelingsCheckPartnerArray,
  loading,
  setLoading,
  onPressFeelingsCard,
  onDismissCard,
  setMoodsDataSocket,
  setMoodsReactionSocket,
}) {
  const netInfo = useNetInfo();
  const [key, setkey] = useState(1);
  const {hornyMode} = useAppContext();

  useEffect(() => {
    setkey(val => val + 1);
    return () => {};
  }, [hornyMode]);

  const carouselRef = useRef();
  const [currentHeight, setCurrentHeight] = useState(0);

  const [stickersBottomSheetVisible, setStickersBottomSheetVisible] =
    useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visibleIndexPartner, setVisibleIndexPartner] = useState(0);

  const [emotion, setEmotion] = useState('Bleh');

  const [feelingModalVisible, setFeelingModalVisible] = useState(false);
  const [reactionData, setReactionData] = useState('');

  const [firstMoodCardAdded, setFirstMoodCardAdded] = useState(false);
  const [thirdMoodCardAdded, setThirdMoodCardAdded] = useState(false);

  useEffect(() => {
    const checkAndSetTooltip = async () => {
      // Check first tooltip
      const firstAdded = await checkContextualTooltip('firstMoodCardAdded');

      console.log('first toolti padded', firstAdded);

      setFirstMoodCardAdded(firstAdded);

      // Only check second if first is acknowledged
      if (firstAdded) {
        const thirdAdded = await checkContextualTooltip('thirdMoodCardAdded');
        setThirdMoodCardAdded(thirdAdded);
      }
    };

    checkAndSetTooltip();
  }, []);
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
  const feelingItem = (item, index, type) => {
    return (
      <WellBeingItem
        feelingsCheckArray={feelingsCheckArray}
        feelingsCheckPartnerArray={feelingsCheckPartnerArray}
        handlePresentEmojiModalPress={() => {
          let obj = {
            type: 'feelings',
            id: item?._id,
          };

          setReactionData(obj);

          handlePresentEmojiModalPress();
        }}
        index={index}
        item={item}
        setFeelingsCheckArray={setFeelingsCheckArray}
        setFeelingsCheckPartnerArray={setFeelingsCheckPartnerArray}
        setReactionData={setReactionData}
        setStickersBottomSheetVisible={setStickersBottomSheetVisible}
        setVisibleIndex={setVisibleIndex}
        setVisibleIndexPartner={setVisibleIndexPartner}
        type={type}
        visibleIndex={visibleIndex}
        visibleIndexPartner={visibleIndexPartner}
      />
    );
  };

  const SendReactionHandler = (reaction, type, id) => {
    CleverTap.recordEvent('Sticker reactions added');
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (reactionData.type === 'feelings') {
      addReactionFeelings(reaction, type, id);
    }
  };

  const addReactionFeelings = async (reaction, type, id) => {
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    try {
      setLoading(true);
      let payload = {
        reaction: reaction,
        reactionNew: id.toString(),
        id: reactionData.id,
        type: type,
      };
      const resp = await API('user/moments/feelingsCheckV2', 'POST', payload);
      console.log('resppppppp', resp);
      if (resp?.body?.statusCode === 200) {
        CleverTap.recordEvent('Reactions on well-being');
        setMoodsReactionSocket(resp.body.data);
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

  const [tooltipShownStatus, setTooltipShownStatus] = useState(0);
  const [toolTipShownMore, setToolTipShownMore] = useState(0);

  useEffect(() => {
    // Check if feelingsCheckArray has more than one entry
    if (feelingsCheckArray.length > 1) {
      setToolTipShownMore(1);
    }
    // Check if feelingsCheckPartnerArray has more than two entries
    else if (feelingsCheckPartnerArray.length > 1) {
      setToolTipShownMore(2);
    }
    // If neither condition is met, set the key to 0
    else {
      setToolTipShownMore(0);
    }
  }, [feelingsCheckArray, feelingsCheckPartnerArray]);

  useEffect(() => {
    // Check if any object in the user array has a non-empty answer
    const userHasAnswer = feelingsCheckArray.some(item => item?.answer !== '');

    // Check if any object in the partner array has a non-empty answer
    const partnerHasAnswer = feelingsCheckPartnerArray.some(
      item => item?.answer !== '',
    );

    if (userHasAnswer) {
      setTooltipShownStatus(1);
    } else if (partnerHasAnswer) {
      setTooltipShownStatus(2);
    } else {
      setTooltipShownStatus(0);
    }
  }, [feelingsCheckArray, feelingsCheckPartnerArray]);

  return (
    <View
      style={{...globalStyles.apphorizontalSpacing, zIndex: 100}}
      key={MOMENT_KEY.feelings}
      onLayout={onLayout}>
      <Text
        style={[
          {
            ...globalStyles.semiBoldLargeText,
            includeFontPadding: false,
            fontSize: scaleNew(18),
            marginTop: scaleNew(20),
            marginBottom: scaleNew(3),
            color: colors.textSecondary,
          },
          hornyMode ? {color: '#E0E0E0'} : {},
        ]}>
        Wellbeing
      </Text>

      {feelingsCheckArray.length !== 0 && (
        <View style={{zIndex: 100}}>
          <View
            style={[
              {
                borderRadius: scaleNew(12),
                //  overflow: 'hidden',
                width: SCREEN_WIDTH - scaleNew(30),
              },
            ]}>
            <Carousel
              key={`WELL_BEING_CARD_${key}`}
              ref={carouselRef}
              useScrollView={true}
              pagingEnabled={true}
              maxScrollVelocity={2}
              activeSlideAlignment="center"
              tappable={true}
              removeClippedSubviews={false}
              lockScrollWhileSnapping={true}
              //    decelerationRate="fast"
              decelerationRate={0.9} // Adjusted for smoother scrolling
              enableMomentum={false}
              onSnapToItem={async props => {
                if (props !== undefined) {
                  setVisibleIndex(props);
                }
              }}
              data={feelingsCheckArray}
              renderItem={({item, index}) => (
                <View
                  style={{
                    opacity: index === visibleIndex ? 1 : 1,
                    position: index === visibleIndex ? 'relative' : 'absolute',
                    width: SCREEN_WIDTH - scaleNew(30), // Ensure each item has full width
                  }}>
                  {feelingItem(item, index, 'user')}
                </View>
              )}
              sliderWidth={SCREEN_WIDTH - scaleNew(30)}
              itemWidth={SCREEN_WIDTH - scaleNew(30)}
            />

            <MoodCardFirstTooltip />
            {firstMoodCardAdded === true && toolTipShownMore === 1 && (
              <MoodCardMoreCardTooltip />
            )}

            {thirdMoodCardAdded === true && tooltipShownStatus === 1 && (
              <MoodCardExpandTooltip />
            )}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: scaleNew(22),
              start: scale(100),
              end: scale(100),
            }}>
            <>
              {feelingsCheckArray.length > 1 ? (
                <PaginationDot
                  activeDotColor={'#808491'}
                  curPage={visibleIndex}
                  maxPage={feelingsCheckArray.length}
                  sizeRatio={0.4}
                />
              ) : (
                <View style={{marginVertical: 0}} />
              )}
            </>
          </View>
        </View>
      )}

      {feelingsCheckPartnerArray?.length !== 0 && (
        <View
          style={{
            borderRadius: scaleNew(12),

            //   overflow: 'hidden',
            //  marginTop: feelingsCheckArray.length !== 0 ? scaleNew(8) : 0,
          }}>
          <View
            style={{
              borderRadius: scaleNew(12),
              //  overflow: 'hidden',
              width: SCREEN_WIDTH - scaleNew(30), // Ensure container has full width
            }}>
            <Carousel
              useScrollView={true}
              pagingEnabled={true}
              maxScrollVelocity={2}
              activeSlideAlignment="center"
              tappable={true}
              lockScrollWhileSnapping={true}
              decelerationRate={0.9} // Adjusted for smoother scrolling
              enableMomentum={false}
              onSnapToItem={async props => {
                setVisibleIndexPartner(props);
              }}
              data={feelingsCheckPartnerArray}
              renderItem={({item, index}) => (
                <View
                  style={{
                    opacity: index === visibleIndexPartner ? 1 : 1,
                    position:
                      index === visibleIndexPartner ? 'relative' : 'absolute',
                    width: SCREEN_WIDTH - scaleNew(30), // Ensure each item has full width
                  }}>
                  {feelingItem(item, index, 'partner')}
                </View>
              )}
              sliderWidth={SCREEN_WIDTH - scaleNew(30)}
              itemWidth={SCREEN_WIDTH - scaleNew(30)}
              style={{
                backgroundColor: '#FAE5EB',
              }}
            />

            {feelingsCheckArray.length === 0 && <MoodCardFirstTooltip />}

            {firstMoodCardAdded === true && toolTipShownMore === 2 && (
              <MoodCardMoreCardTooltip />
            )}

            {thirdMoodCardAdded === true && tooltipShownStatus === 2 && (
              <MoodCardExpandTooltip />
            )}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: scaleNew(22),
              start: scale(100),
              end: scale(100),
            }}>
            <>
              {feelingsCheckPartnerArray.length > 1 ? (
                <PaginationDot
                  activeDotColor={'#808491'}
                  curPage={visibleIndexPartner}
                  maxPage={feelingsCheckPartnerArray.length}
                  sizeRatio={0.4}
                />
              ) : (
                <View style={{marginVertical: 0}} />
              )}
            </>
          </View>
        </View>
      )}

      {stickersBottomSheetVisible && (
        <StickersBottomSheet
          bottomSheetVisible={stickersBottomSheetVisible}
          setBottomSheetVisible={setStickersBottomSheetVisible}
          SendReactionHandler={(name, type, id) => {
            setStickersBottomSheetVisible(false);
            SendReactionHandler(name, type, id);
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

const styles = StyleSheet.create({});

const WellBeingItem = ({
  item,
  type,
  index,
  visibleIndex,
  visibleIndexPartner,
  setReactionData,
  handlePresentEmojiModalPress,
  setStickersBottomSheetVisible,
  feelingsCheckArray,
  setFeelingsCheckArray,
  setVisibleIndex,
  setFeelingsCheckPartnerArray,
  setVisibleIndexPartner,
  feelingsCheckPartnerArray,
}) => {
  const {hornyMode} = useAppContext();
  return (
    <View
      style={{
        backgroundColor: hornyMode
          ? '#331A4F'
          : COLOR_SET[item?.text]?.background === undefined
          ? COLOR_SET[firstEmoji]?.background
          : COLOR_SET[item?.text]?.background,
        paddingVertical: scaleNew(14),
        borderRadius: scaleNew(12),
        marginTop: scaleNew(12),
      }}>
      <View
        style={{
          paddingHorizontal: scaleNew(14),
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              //   marginBottom: scaleNew(10),
              alignItems: 'center',
            }}>
            <ProfileAvatar
              type={type}
              style={{
                width: scaleNew(16),
                height: scaleNew(16),
                borderRadius: 21,

                marginEnd: scaleNew(8),
              }}
            />

            <Text
              style={{
                fontSize: scaleNew(14),
                fontFamily: fonts.regularFont,
                color: hornyMode ? 'rgba(189, 189, 189, 0.9)' : '#595959',
                includeFontPadding: false,
                marginTop: Platform.OS === 'android' ? 1 : 0,
              }}>
              {getLabelForDate(item?.timeStamps)},{' '}
              {moment(item?.timeStamps).format('ha')}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              //  backgroundColor: 'blue',
              marginTop: scaleNew(-6),
            }}>
            <Text
              style={{
                fontSize: scaleNew(16),
                fontFamily: fonts.standardFont,
                color:
                  COLOR_SET[item?.text]?.textColor === undefined
                    ? COLOR_SET[firstEmoji]?.textColor
                    : COLOR_SET[item?.text]?.textColor,
                maxWidth: '80%',

                marginEnd: 4,
                includeFontPadding: false,
              }}>
              {item?.tags?.join(', ')}
            </Text>
            <Text
              style={{
                fontSize: scaleNew(38),
                fontFamily: fonts.standardFont,
                color: '#000',
                includeFontPadding: false,
                marginEnd: scaleNew(11),
              }}>
              {item?.text}
            </Text>
          </View>
        </View>
      </View>
      {item?.answer && (
        <View
          style={{
            marginHorizontal: scaleNew(14),
            //  marginBottom: scaleNew(10),
            marginTop: scaleNew(-10),
          }}>
          {index === visibleIndex && type === 'user' && (
            <Text
              style={[
                {
                  fontSize: scaleNew(14),
                  fontFamily: fonts.regularFont,
                  color: '#808491',
                  includeFontPadding: false,
                },
                hornyMode ? {color: '#E0E0E0'} : {},
              ]}>
              {item?.answer}
            </Text>
          )}
          {index === visibleIndexPartner && type === 'partner' && (
            <Text
              style={{
                fontSize: scaleNew(14),
                fontFamily: fonts.regularFont,
                color: '#808491',
                includeFontPadding: false,
              }}>
              {item?.answer}
            </Text>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: scaleNew(14),
          height: scaleNew(30),
          //   marginTop: scaleNew(-10),
        }}>
        <ReactionComp
          item={item}
          type={'feelings'}
          setReactionData={setReactionData}
          handlePresentEmojiModalPress={handlePresentEmojiModalPress}
          hornyMode={hornyMode}
          setStickersBottomSheetVisible={setStickersBottomSheetVisible}
        />
      </View>
    </View>
  );
};
