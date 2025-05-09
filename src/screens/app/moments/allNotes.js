/* eslint-disable react-native/no-inline-styles */
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  TextInput,
  Image,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  EventEmitter,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppView from '../../../components/AppView';
import CornerHeader from '../../../components/cornerHeader';
import {globalStyles, SCREEN_WIDTH} from '../../../styles/globalStyles';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import {APP_IMAGE, STICKERS} from '../../../utils/constants';
import AppButton from '../../../components/appButton';
import {scale} from '../../../utils/metrics';
import {AWS_URL_S3} from '../../../utils/urls';
import moment from 'moment';
import {colors} from 'react-native-swiper-flatlist/src/themes';
import RNFS from 'react-native-fs';
import AudioPlayer from '../../../components/AudioPlayer';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import API from '../../../redux/saga/request';
import {ToastMessage} from '../../../components/toastMessage';
import {ProfileAvatar} from '../../../components/ProfileAvatar';
import {VARIABLES} from '../../../utils/variables';

export default function AllNotes(props) {
  const CARD_WIDTH = SCREEN_WIDTH / 2 - 20;
  const CARD_HEIGHT = scale(340);

  const [notes, setNotes] = useState([]);
  const [currentAudioPlayingIndex, setcurrentAudioPlayingIndex] = useState(-1);

  const [refreshing, setRefreshing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [endLimit, setEndLimit] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);

  const refreshDataHandler = () => {
    getNotesApi(0);
  };

  useEffect(() => {
    getNotesApi(0);
  }, []);

  const LoadMoreData = () => {
    if (!endLimit && !footerLoader) {
      console.log('load ,more dataaaaa');
      setFooterLoader(true);
      getNotesApi(page);
    } else {
      //   setFooterLoader(false);
      console.log('no more loads');
    }
  };

  function _renderFooter() {
    if (footerLoader) {
      return (
        <View style={{height: 20, marginBottom: 20}}>
          <ActivityIndicator size={30} />
        </View>
      );
    }
  }
  console.log('footer laoder', footerLoader, endLimit);
  const getNotesApi = async page => {
    try {
      const resp = await API(
        `user/moments/notes?page=${page}&limit=${limit}`,
        'GET',
      );
      if (resp.body.statusCode === 200) {
        console.log('resp.body.data notes', resp.body.data);

        setLoading(false);

        setRefreshing(false);

        if (resp.body.data.length < limit) {
          setEndLimit(true);
        } else {
          setEndLimit(false);
        }
        if (page !== 0) {
          setNotes(prev => [...prev, ...resp.body.data]);
        } else {
          setNotes(resp.body.data);
        }
        setPage(page + 1);
        setFooterLoader(false);
      } else {
        setFooterLoader(false);
        setLoading(false);
      }
    } catch (error) {
      setFooterLoader(false);
      setLoading(false);
      ToastMessage('Something went wrong');
    }
  };

  const AppHeader = () => {
    return (
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => {
          EventRegister.emit('pauseSoundAllNotes');
          setTimeout(() => {
            props.navigation.goBack();
          }, 100);
        }}
        titleBox={
          <Text style={{...globalStyles.cornerHeaderTitle}}>All Notes</Text>
        }
        // rightIcon={
        //   <Image
        //     source={APP_IMAGE.addCircularBorder}
        //     style={globalStyles.icon}
        //   />
        // }
        // titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const RemoveNoteHandler = noteIndex => {
    const updateNoteList = notes.filter((item, index) => index !== noteIndex);
    setNotes(updateNoteList);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      setcurrentAudioPlayingIndex(-1);
    });

    return () => {
      unsubscribe();
      setcurrentAudioPlayingIndex(-1);
      EventRegister.emit('pauseSoundAllNotes');
    };
  }, []);

  const noteItem = ({item, index}) => {
    let imageSrc = APP_IMAGE.stickerFour;

    switch (item.color) {
      case '#FFFFFF':
        imageSrc = APP_IMAGE.whiteExpanded;
        break;
      case '#F4EEE0':
        imageSrc = APP_IMAGE.yellowExpanded;
        break;
      case '#E9F1F7':
        imageSrc = APP_IMAGE.blueExpanded;
        break;
      case '#D4F1DE':
        imageSrc = APP_IMAGE.greenExpanded;

        break;
      default:
        break;
    }

    let dateStr = '';
    if (item.timeStamps) {
      const createdDate = moment(item.timeStamps);
      dateStr = createdDate.format('DD.MM.YY');
    }

    if (item.type === 'message') {
      return (
        <ImageBackground
          source={imageSrc}
          style={{
            ...styles.notePlaceholder,
            paddingTop: scale(22),
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            flexShrink: 1,
          }}>
          <View style={{flex: 1, flexShrink: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ProfileAvatar
                type={
                  item?.createdBy?._id === VARIABLES.user?._id
                    ? 'user'
                    : 'partner'
                }
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 20,
                }}
              />

              <Text
                style={{
                  ...globalStyles.lightLargeText,
                  fontSize: scale(10),
                  marginStart: scale(6),
                  color: '#2F3A4E',
                }}>
                {dateStr}
              </Text>
            </View>

            <Text
              style={{
                ...globalStyles.regularLargeText,
                marginTop: 6,
                marginEnd: 4,
                flexShrink: 1,
              }}>
              {item?.text}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              padding: 4,
              borderRadius: 100,
              alignSelf: 'flex-start',
            }}>
            {item?.reactions.map(r => {
              return (
                <FastImage
                  source={
                    r?.reactionNew !== undefined && r?.reactionNew !== null
                      ? STICKERS[Number(r.reactionNew)]?.sticker
                      : {
                          uri:
                            Platform.OS === 'android'
                              ? r.reaction
                              : `${r.reaction}.png`,
                          priority: FastImage.priority.high,
                        }
                  }
                  style={{
                    width: scale(20),
                    height: scale(20),
                    resizeMode: 'contain',
                    marginRight: 4,
                  }}
                  resizeMode="contain"
                />
              );
            })}
          </View>
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={imageSrc}
          style={{
            ...styles.notePlaceholder,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                paddingEnd: 12,
                alignItems: 'center',
              }}>
              <ProfileAvatar
                type={
                  item?.createdBy?._id === VARIABLES.user?._id
                    ? 'user'
                    : 'partner'
                }
                style={{width: 24, height: 24, borderRadius: 12}}
              />

              <Text
                style={{
                  ...globalStyles.lightSmallText,
                  marginStart: 6,
                  flex: 1,
                  fontSize: 8,
                }}>
                {dateStr}
              </Text>
            </View>
          </View>
          <View style={{flex: 1}}>
            <AudioPlayer
              currentIndex={currentAudioPlayingIndex}
              setCurrentIndex={setcurrentAudioPlayingIndex}
              url={item.text}
              messageIndex={item._id}
              color={item.color}
              imageStyle={{
                width: scale(50),
                height: scale(50),
              }}
              seekerStyles={{
                marginTop: 5,
              }}
              containerStyle={{
                flex: 1,
                marginTop: scale(10),
                alignItems: 'center',
                marginRight: scale(0),
                justifyContent: 'center',
              }}
            />
          </View>
          <View style={styles.noteButtonContainer}>
            {/* <Pressable>
                            <EmojiPlaceholderIconSvg/>
                        </Pressable> */}
            <View style={{flexDirection: 'row'}}>
              {item?.reactions.map(r => {
                return (
                  <Image
                    source={STICKERS[Number(r.reactionNew)]?.sticker}
                    // source={{
                    //   uri:
                    //     Platform.OS === 'android'
                    //       ? r.reaction
                    //       : `${r.reaction}.png`,
                    //   priority: FastImage.priority.high,
                    // }}
                    style={{
                      ...globalStyles.emojiIcon,
                      resizeMode: 'contain',
                      marginRight: 4,
                    }}
                  />
                );
              })}
            </View>

            {/* <Pressable onPress={() => RemoveNoteHandler(index)} hitSlop={10}>
              <DeleteIconSvg />
            </Pressable> */}
          </View>
        </ImageBackground>
      );
    }
  };

  return (
    <AppView
      scrollContainerRequired={false}
      isScrollEnabled={false}
      isLoading={Platform.OS === 'ios' ? loading : false}
      header={AppHeader}>
      <FlatList
        refreshing={refreshing}
        onRefresh={() => {
          if (!loading) {
            setRefreshing(true);
            setEndLimit(false);
            setPage(0);
            refreshDataHandler();
          }
        }}
        showsVerticalScrollIndicator={false}
        data={notes}
        renderItem={noteItem}
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        style={{marginHorizontal: scale(16)}}
        onEndReached={LoadMoreData}
        ListFooterComponent={_renderFooter}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  notePlaceholder: {
    width: scale(166),
    height: scale(216),
    paddingHorizontal: scale(22),
    paddingTop: scale(26),
    paddingBottom: scale(20),
    // paddingTop:30,
    marginBottom: scale(12),
    // marginHorizontal:8
  },
  noteInput: {
    flex: 1,
    maxHeight: scale(180),
    marginEnd: scale(12),
    ...globalStyles.regularSmallText,
    padding: 0,
    marginTop: scale(6),
  },
  noteButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom:4
  },
  feelingSticker: {
    width: scale(16),
    height: scale(14),
    marginEnd: 2,
  },
});
