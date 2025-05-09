/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import SwipeButton from '../SwipeButton';
import LinearGradient from 'react-native-linear-gradient';
import {HapticFeedbackHeavy} from '../../utils/HapticFeedback';
import LottieView from 'lottie-react-native';
import {VARIABLES} from '../../utils/variables';
import Carousel from 'react-native-snap-carousel';
import PaginationDot from 'react-native-animated-pagination-dot';
import API from '../../redux/saga/request';
import OverlayLoader from '../overlayLoader';
import {EventRegister} from 'react-native-event-listeners';
import {AWS_URL_S3} from '../../utils/urls';
import FastImage from 'react-native-fast-image';
import {useAppContext} from '../../utils/VariablesContext';

import {ProfileAvatar} from '../ProfileAvatar';

export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;

export default function NudgeModal(props) {
  const {setModalVisible, modalVisible, setData, data, onAction} = props;

  const carouselRef = useRef(null);

  const {notifData, updateNotifData, removeNudgeItem, nudgeArray} =
    useAppContext();

  const [visibleIndex, setVisibleIndex] = useState(0);
  const [items, setItems] = useState(data);
  const [loading, setLoading] = useState(false);

  const userName = VARIABLES.user.partnerData.partner.name;

  useEffect(() => {
    if (items.length === 0) {
      updateNotifData({...VARIABLES.appNotifData, nudgeCount: 0});
      setData();
      setModalVisible(false);
    }
  }, [items]);

  const onButtonPress = async data => {
    // setLoading(true);
    const updatedItems = items.filter(item => item._id !== data);
    setItems(updatedItems);

    // Check the number of remaining items
    if (updatedItems.length === 0) {
      updateNotifData({...VARIABLES.appNotifData, nudgeCount: 0});
      // Close the modal if only one item is left
      setModalVisible(false);
    } else if (updatedItems.length < items.length) {
      // Adjust carousel to previous item
      const newIndex = Math.max(0, visibleIndex - 1);
      setVisibleIndex(newIndex);
      carouselRef.current.snapToItem(newIndex);
    }

    removeNudgeItem(data);
    try {
      if (items[visibleIndex].moment === '1') {
        console.log('items[visibleIndex].moment', items[visibleIndex].moment);
        onAction(items[visibleIndex].moment);
        setModalVisible(false);
      } else if (items[visibleIndex].moment === '2') {
        onAction(items[visibleIndex].moment);
        setModalVisible(false);
      } else if (items[visibleIndex].moment === '3') {
        onAction(items[visibleIndex].moment);
        setModalVisible(false);
      }
      const resp = await API(`user/moments/nudge?id=${data}`, 'GET');
      setLoading(false);
      if (resp.body.statusCode === 200) {
        // console.log('response poke modal', resp);
      } else {
        console.log('error on poke', resp);
      }
    } catch (error) {
      setLoading(false);
      console.log('error on poke', error.response);
    }
  };

  const onPressCross = async id => {
    //  setLoading(true);
    const updatedItems = items.filter(item => item._id !== id);
    setItems(updatedItems);

    // Check the number of remaining items
    if (updatedItems.length === 0) {
      updateNotifData({...VARIABLES.appNotifData, nudgeCount: 0});
      // Close the modal if only one item is left
      setModalVisible(false);
    } else if (updatedItems.length < items.length) {
      // Adjust carousel to previous item
      const newIndex = Math.max(0, visibleIndex - 1);
      setVisibleIndex(newIndex);
      carouselRef.current.snapToItem(newIndex);
    }

    removeNudgeItem(id);
    try {
      const resp = await API(`user/moments/nudge?id=${id}`, 'GET');
      setLoading(false);
      if (resp.body.statusCode === 200) {
        // console.log('response poke modal', resp);
      } else {
        console.log('error on poke', resp);
      }
    } catch (error) {
      setLoading(false);
      console.log('error on poke', error.response);
    }
  };

  const feelingItem = ({item, index}) => {
    const getEmojiView = () => {
      switch (item.emoji) {
        case '👉🏻':
          return {
            text: `${userName} is poking you!`,
            buttonText: 'Okay',
            emoji: '👉🏻',
            gradientColors: ['#FFFFFF', '#BABCF3'],
            imageSource: '',
          };
        case '😡':
          return {
            text: `${userName} is mad at you!`,
            buttonText: 'Oh no!',
            emoji: '😡',
            gradientColors: ['#FFEBEB', '#FF7A7A'],
            imageSource: '',
          };
        case '💋':
          return {
            text: `${userName} has sent kisses!! 💋`,
            buttonText: 'Okay',
            gradientColors: ['#FFFBFE', '#FCECF9'],
            imageSource: require('../../assets/images/imgKiss.png'),
          };
        case '🥰':
          return {
            text: `${userName} has sent love! 🥰`,
            buttonText: 'Okay',
            gradientColors: ['#FFFBFE', '#FCECF9'],
            imageSource: require('../../assets/images/imgLove.png'),
          };
        default:
          return {text: '', imageSource: ''};
      }
    };

    const getMomentView = () => {
      switch (item.moment) {
        case '2':
          return {
            text: `${userName} wants you to add a post\nin the Feed!`,
            buttonText: 'Add a post',
            gradientColors: ['#FFFBFE', '#FCECF9'],
            imageSource: require('../../assets/images/imgFeed.png'),
          };
        case '1':
          return {
            text: `${userName} wants you to add a sticky note`,
            buttonText: 'Add a Sticky Note',
            gradientColors: ['#FFFBFE', '#FCECF9'],
            imageSource: require('../../assets/images/imgFeed.png'),
          };
        case '3':
          return {
            text: `${userName} wants you to update\nyour mood!`,
            buttonText: 'Update mood',
            gradientColors: ['#FFFBFE', '#FCECF9'],
            imageSource: require('../../assets/images/imgFeed.png'),
          };
        default:
          return {text: '', imageSource: ''};
      }
    };

    let pokeView;

    const getViewData = () => {
      if (item?.emoji) {
        pokeView = true;
        return getEmojiView();
      } else if (item?.moment) {
        pokeView = false;
        return getMomentView();
      } else {
        return {text: '', imageSource: ''}; // Default case
      }
    };

    const viewData = getViewData();

    return (
      <View
        style={{
          justifyContent: 'center',

          height: scale(470),
        }}>
        {/* {pokeView ? (
          <View style={styles.viewCross} />
        ) : ( */}
        <Pressable
          style={styles.viewCross}
          onPress={() => {
            onPressCross(item._id);
          }}>
          <Image source={require('../../assets/images/crossBlueBg.png')} />
        </Pressable>
        {/* )} */}

        {!pokeView ? (
          <View style={styles.viewNudge}>
            <ProfileAvatar type="partner" style={styles.profileImg} />

            <View />

            <LinearGradient
              colors={viewData?.gradientColors}
              start={{x: 0, y: 1}}
              end={{x: 1, y: 0}}
              style={{
                ...styles.linearStyle,
                height: scale(243),
                paddingBottom: 0,
                justifyContent: 'flex-end',
              }}>
              <LottieView
                style={styles.viewLottie}
                source={require('../../assets/images/gifs/starsLottie.json')}
                autoPlay
                loop
              />
              <Image source={viewData?.imageSource} />
            </LinearGradient>
            <View style={{height: scale(81), justifyContent: 'center'}}>
              <Text
                numberOfLines={2}
                style={{
                  ...styles.title,
                  alignSelf: 'center',
                  //   marginTop: scale(27),
                }}>
                {viewData?.text}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                onButtonPress(item._id);
              }}
              style={styles.viewButton}>
              <Text style={styles.textButton}>{viewData?.buttonText}</Text>
            </Pressable>
            {items.length > 1 && (
              <View
                style={{
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: scale(8),
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    borderRadius: scale(12),
                    alignSelf: 'baseline',
                    padding: scale(4),
                  }}>
                  <PaginationDot
                    activeDotColor={colors.blue1}
                    curPage={visibleIndex}
                    maxPage={items.length}
                    sizeRatio={1}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          <>
            {viewData?.emoji === undefined ? (
              <View style={styles.viewNudge}>
                <ProfileAvatar
                  type="partner"
                  style={{
                    ...styles.profileImg,
                    borderWidth: scale(2),
                  }}
                />

                <View />

                <LinearGradient
                  colors={viewData.gradientColors}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={{
                    ...styles.linearStyle,
                    height: scale(243),
                    paddingBottom: 0,
                    justifyContent: 'flex-end',
                  }}>
                  <LottieView
                    style={styles.viewLottie}
                    source={require('../../assets/images/gifs/starsLottie.json')}
                    autoPlay
                    loop
                  />
                  <Image source={viewData?.imageSource} />
                </LinearGradient>
                <View style={{height: scale(81), justifyContent: 'center'}}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.title,
                      alignSelf: 'center',
                      //s  marginTop: scale(27),
                    }}>
                    {viewData?.text}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    onButtonPress(item._id);
                  }}
                  style={styles.viewButton}>
                  <Text style={styles.textButton}>{viewData?.buttonText}</Text>
                </Pressable>

                {items.length > 1 && (
                  <View
                    style={{
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: scale(8),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        borderRadius: scale(12),
                        alignSelf: 'baseline',
                        padding: scale(4),
                      }}>
                      <PaginationDot
                        activeDotColor={colors.blue1}
                        curPage={visibleIndex}
                        maxPage={items.length}
                        sizeRatio={1}
                      />
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.viewEmojiStyle}>
                <ProfileAvatar
                  type="partner"
                  style={{
                    ...styles.profileImg,
                    borderWidth: scale(2),
                    backgroundColor: 'grey',
                  }}
                />

                <LinearGradient
                  colors={viewData?.gradientColors}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={styles.linearStyle}>
                  <View style={{alignItems: 'center', marginTop: scale(40)}}>
                    {viewData?.emoji !== undefined && (
                      <Text style={{fontSize: scale(64)}}>
                        {viewData?.emoji}
                      </Text>
                    )}
                  </View>
                </LinearGradient>
                <View style={{height: scale(81), justifyContent: 'center'}}>
                  <Text
                    style={{
                      ...styles.title,
                    }}>
                    {viewData?.text}
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    onButtonPress(item._id);
                  }}
                  style={styles.viewButton}>
                  <Text style={styles.textButton}>{viewData?.buttonText}</Text>
                </Pressable>

                {items.length > 1 && (
                  <View
                    style={{
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: scale(8),
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        borderRadius: scale(12),
                        alignSelf: 'baseline',
                        padding: scale(4),
                      }}>
                      <PaginationDot
                        activeDotColor={colors.blue1}
                        curPage={visibleIndex}
                        maxPage={items.length}
                        sizeRatio={1}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <Modal
      backdropTransitionOutTiming={20}
      backdropOpacity={0.7}
      isVisible={modalVisible}
      // avoidKeyboard={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationOutTiming={10}
      animationInTiming={10}
      onBackButtonPress={() => {
        //   setModalVisible(false);
      }}
      onBackdropPress={() => {
        ///  setModalVisible(false);
      }}
      style={{
        margin: 0,

        justifyContent: 'center',
        flex: 1,
      }}>
      <View style={{}}>
        <OverlayLoader visible={loading} />

        <Carousel
          ref={carouselRef}
          slideStyle={{
            alignItems: 'center',
            //    flex: 1,
            //  marginBottom: -scale(120),
          }}
          layout={'default'}
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
          data={items}
          renderItem={feelingItem}
          sliderWidth={SCREEN_WIDTH - scale(0)}
          itemWidth={SCREEN_WIDTH - scale(0)}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  profileImg: {
    alignSelf: 'center',
    marginTop: -scale(35),
    zIndex: 1,
    position: 'absolute',
    borderColor: colors.blue1,
    width: scale(64),
    height: scale(64),
    borderRadius: scale(100),
  },
  linearStyle: {
    height: scale(243),
    padding: scale(20),
    width: scale(362),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.black,
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
    // marginTop: scale(32),
    // marginBottom: 0,

    marginHorizontal: scale(32),
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: colors.blue1,
    height: scale(50),
    width: scale(293),
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  textButton: {
    color: colors.white,
    fontFamily: fonts.semiBoldFont,
    fontSize: scale(16),
  },
  viewCross: {
    alignSelf: 'flex-end',
    marginEnd: scale(4),
    marginBottom: scale(8),
    width: scale(35),
    height: scale(35),
  },
  viewNudge: {
    backgroundColor: '#F5F1F0',
    borderRadius: scale(20),
    height: scale(413),
    width: scale(362),
  },
  viewLottie: {
    width: scale(500),
    height: scale(200),
    marginBottom: -scale(170),
    zIndex: 10,
    transform: [{rotate: '30deg'}],
  },
  viewEmojiStyle: {
    backgroundColor: '#F5F1F0',
    borderRadius: scale(20),
    height: scale(413),
    width: scale(362),
  },
});
