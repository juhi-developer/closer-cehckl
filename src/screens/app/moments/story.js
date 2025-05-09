/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import AppView from '../../../components/AppView';
import CornerHeader from '../../../components/cornerHeader';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import {APP_IMAGE} from '../../../utils/constants';

import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {colors} from '../../../styles/colors';
import {scale} from '../../../utils/metrics';
import StoryListItem from '../../../components/stories/storyListItem';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import AppButton from '../../../components/appButton';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';
import {useDispatch, useSelector} from 'react-redux';
import {
  AddHighlight,
  ClearAction,
  GetHighlights,
  RemoveHighlight,
  RemoveSingleHighlight,
  createNewHighlight,
} from '../../../redux/actions';
import * as actions from '../../../redux/actionTypes';
import {API_BASE_URL, AWS_URL_S3} from '../../../utils/urls';
import {io} from 'socket.io-client';
import {VARIABLES} from '../../../utils/variables';
import SendMessageIconSvg from '../../../assets/svgs/sendMessageIconSvg';
import {ToastMessage} from '../../../components/toastMessage';
import {
  generateID,
  shareUrlImage,
  shareUrlImageStory,
} from '../../../utils/helpers';
import Highlightcomponent from '../../../components/Highlightcomponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import nacl from 'tweetnacl';
import naclUtil, {decodeBase64, encodeBase64} from 'tweetnacl-util';
import {onSendMessage} from '../../../backend/DatabaseOperations';
import {encryptAndSignMessage} from '../../../e2e/encryptionMethods';
import {useSocket} from '../../../utils/socketContext';
import {useRealm} from '@realm/react';

const CleverTap = require('clevertap-react-native');

const CONTENT = [
  // {
  //   id: 1,
  //   key: 'Chat',
  //   label: 'Reply in chat',
  //   icon: APP_IMAGE.reply,
  // },
  {
    id: 2,
    key: 'Highlights',
    label: 'Add to Highlights',
    icon: APP_IMAGE.gallery,
  },
  {
    id: 3,
    key: 'Story',
    label: 'Share Story',
    icon: APP_IMAGE.storyShare,
  },
];

const DATA = [
  {
    user_id: 1,
    user_image:
      'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Ahmet Çağlar Durmuş',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        swipeText:
          'Select stickers from our library and drag-drop them on photos, videos, comments, notes and much more!',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://cdn.pixabay.com/photo/2013/04/04/12/34/mountains-100367__480.jpg',
        swipeText:
          'Leave cute-notes for your partner! Remember both of you can add only upto 4 notes that stay for 24 hrs!',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 3,
        story_image:
          'https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736875__480.jpg',
        swipeText:
          'Let your partner know your moods throughout the day! Remember they will refresh every 24 hrs',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 4,
        story_image:
          'https://cdn.pixabay.com/photo/2015/10/30/20/13/sunrise-1014712__480.jpg',
        swipeText:
          'Get to know your partner better with these questions! It changes every weekend',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 5,
        story_image:
          'https://cdn.pixabay.com/photo/2017/03/27/16/50/beach-2179624__480.jpg',
        swipeText:
          'Add your special dates and events to the calendar and get reminders on the moments page!',
        onPress: () => console.log('story 1 swiped'),
      },
    ],
  },
  {
    user_id: 2,
    user_image:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    user_name: 'Test User',
    stories: [
      {
        story_id: 1,
        story_image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image:
          'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

export default function Story(props) {
  const {socket, isSocketConnected} = useSocket();

  const realm = useRealm();
  const state = useSelector(state => state);
  const {story, singleStory, storyPressIndex} = props.route?.params;

  const {storyBundle} = props.route?.params;
  const {demo = false} = props.route?.params;
  const type = props.route?.params?.type;
  const highlightTitle = props.route?.params?.highlightTitle;

  const dispatch = useDispatch();
  console.log('TYPEEEE888', JSON.stringify(storyBundle), dataState);

  const [highlights, setHighlights] = useState([]);

  const [dataState, setDataState] = useState(DATA);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedData, setSelectedData] = useState([]);
  const [highlightEnabled, setHighlightEnabled] = useState(false);
  const [isNewHighlight, setIsNewHighlight] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const textInputRef = useRef(null);
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [newHighlight, setnewHighlight] = useState('');
  const [loading, setloading] = useState(false);
  const cube = useRef();
  const duration = 5;
  const [selectedStoryIndex, setselectedStoryIndex] = useState(0);
  const [replyText, setreplyText] = useState('');
  const [showReply, setshowReply] = useState(false);
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  // const snapPointsNote = useMemo(() => ["20%", "20%",], []);
  const smallSnapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 2.6 + BOTTOM_SPACE,
      SCREEN_WIDTH / 2.6 + BOTTOM_SPACE,
    ],
    [],
  );
  const mediumSnapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 2.2 + BOTTOM_SPACE,
      SCREEN_WIDTH / 2.2 + BOTTOM_SPACE,
    ],
    [],
  );
  const largeSnapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 1.6 + BOTTOM_SPACE,
      SCREEN_WIDTH / 1.6 + BOTTOM_SPACE,
    ],
    [],
  );
  const extraLargeSnapPoints = useMemo(
    () => [SCREEN_HEIGHT / 1.1, SCREEN_HEIGHT / 1.1],
    [],
  );
  const continueAnimationFunc = useRef(false);
  const handlePresentModalPress = useCallback(
    (continueAnimationFunction = () => {}, currentStoryIndex) => {
      bottomSheetModalRef.current.present();
      setSheetEnabled(true);
      setshowReply(false);
      setHighlightEnabled(false);
      setInputFocused(false);
      //   setselectedStoryIndex(currentStoryIndex);
      continueAnimationFunc.current = continueAnimationFunction;
      setnewHighlight('');
    },
    [],
  );
  const handleSheetChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  // // ref
  // const bottomSheetHighlightModalRef = useRef(null);

  // // variables
  // // const snapPointsNote = useMemo(() => ["20%", "20%",], []);
  // const highlightSnapPoints = useMemo(() => [SCREEN_WIDTH/2.6 + BOTTOM_SPACE, SCREEN_WIDTH/2.6 + BOTTOM_SPACE,], []);

  // // callbacks
  // const handlePresentHighlightModalPress = useCallback(() => {
  //   bottomSheetHighlightModalRef.current.present()
  //     setSheetEnabled(true)
  // }, []);
  // const handleHighlightSheetChanges = useCallback((index) => {
  //     // console.log('handleSheetChanges', index);
  //     if (index === -1) {
  //         console.log('close modal');
  //         // bottomSheetModalRef.current.dismiss()
  //         setSheetEnabled(false)
  //     }
  // }, []);

  useEffect(() => {
    dispatch(GetHighlights());
    connectSocket();
    return () => {
      if (isSocketConnected && socket) {
        socket.off('storyReply');
      }
    };
  }, []);

  const connectSocket = () => {
    if (isSocketConnected && socket) {
      socket.on('storyReply', () => {
        ToastMessage('Reply sent');
      });
    }
  };

  const AppHeader = () => {
    if (singleStory) {
      return <></>;
    }
    return (
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => props.navigation.goBack()}
        titleBox={
          <Text
            style={{
              ...globalStyles.semiBoldLargeText,
              marginStart: scale(6),
              fontSize: scale(18),
              fontWeight: 500,
            }}>
            {story.title}
          </Text>
        }
        // titleStyle={styles.headerTitleStyle}
      />
    );
  };

  // Component Functions
  // const _handleStoryItemPress = (item, index) => {
  //     const newData = dataState.slice(index);
  //     if (onStart) {
  //         onStart(item)
  //     }

  //     setCurrentPage(0);
  //     setSelectedData(newData);
  //     setIsModalOpen(true);
  // };

  useEffect(() => {
    handleSeen();
  }, [currentPage]);

  useEffect(() => {
    // customised by vikas
    const newData = dataState.slice(0);

    if (storyBundle) {
      // Find the index of the first object with isSeen = false
      // const index = storyBundle[0].stories.findIndex(
      //   item => item.isSeen === false,
      // );
      // console.log('customiizeex', index, storyBundle);
      // if (index !== -1) {
      //   // Set the 'selectedStoryIndex' to the found index
      //   setselectedStoryIndex(storyPressIndex);
      // } else {
      setselectedStoryIndex(storyPressIndex);
      // Handle the case when no object with isSeen = false is found
      //   console.log('No unviewed stories found');
      //    }

      setSelectedData(storyBundle);
    } else {
      setSelectedData(story);

      ///mohit
    }
    setIsModalOpen(true);
    //   setSelectedData(newData)
  }, []);

  useEffect(() => {
    if (state.reducer.case === actions.GET_HIGHLIGHTS_SUCCESS) {
      console.log('vhgbjknlm', JSON.stringify(state));
      setHighlights(state.reducer.highlights);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.CREATE_NEW_HIGHLIGHTS) {
      setloading(true);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.CREATE_NEW_HIGHLIGHTS_SUCCESS) {
      setloading(false);
      setHighlights(state.reducer.status);
      setSheetEnabled(false);
      setIsNewHighlight(false);
      ToastMessage('New highlight added');
      if (typeof continueAnimationFunc?.current === 'function') {
        continueAnimationFunc?.current?.();
      }
      dispatch(ClearAction()); // console.log(highlights, )
    } else if (state.reducer.case === actions.ADD_HIGHLIGHT) {
      setloading(true);
      setSheetEnabled(false);
      bottomSheetModalRef.current.dismiss();
      console.log(newHighlight);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_HIGHLIGHT_SUCCESS) {
      setloading(false);
      setSheetEnabled(false);
      bottomSheetModalRef.current.dismiss();
      if (typeof continueAnimationFunc?.current === 'function') {
        continueAnimationFunc?.current?.();
      }
    }
  }, [state.reducer.case]);

  const handleSeen = () => {
    console.log('sleected dataaaaaa', selectedData, currentPage);
    const seen = selectedData[currentPage];
    const seenIndex = dataState.indexOf(seen);
    if (seenIndex > 0) {
      if (!dataState[seenIndex]?.seen) {
        let tempData = dataState;
        dataState[seenIndex] = {
          ...dataState[seenIndex],
          seen: true,
        };
        setDataState(tempData);
      }
    }
  };

  function isNullOrWhitespace(input) {
    if (typeof input === 'undefined' || input == null) {
      return true;
    }

    return input.toString().replace(/\s/g, '').length < 1;
  }

  function onStoryFinish(state) {
    props.navigation.goBack();

    // if (!isNullOrWhitespace(state)) {
    //     if (state == "next") {
    //         const newPage = currentPage + 1;
    //         if (newPage < selectedData.length) {
    //             setCurrentPage(newPage);
    //             cube?.current?.scrollTo(newPage);
    //         } else {
    //             setIsModalOpen(false);
    //             setCurrentPage(0);
    //             if (onClose) {
    //                 onClose(selectedData[selectedData.length - 1]);
    //             }
    //         }
    //     } else if (state == "previous") {
    //         const newPage = currentPage - 1;
    //         if (newPage < 0) {
    //             setIsModalOpen(false);
    //             setCurrentPage(0);
    //         } else {
    //             setCurrentPage(newPage);
    //             cube?.current?.scrollTo(newPage);
    //         }
    //     }
    // }
  }

  const renderStoryList = () =>
    selectedData.map((x, i) => {
      return (
        <StoryListItem
          selectedData={selectedData}
          selectedStoryIndex={selectedStoryIndex}
          duration={duration * 1000}
          key={i}
          profileName={x.user_name}
          user_id={x.user_id}
          profileImage={x.user_image}
          stories={x.stories}
          currentPage={currentPage}
          onFinish={onStoryFinish}
          onPressMore={handlePresentModalPress}
          socket={socket}
          setshowReply={setshowReply}
          bottomSheetModalRef={bottomSheetModalRef}
          textInputRef={textInputRef}
          swipeText={x.swipeText}
          //    customSwipeUpComponent={customSwipeUpComponent}
          //    customCloseComponent={customCloseComponent}
          onClosePress={() => {
            //    setIsModalOpen(false);
            //    if (onClose) {
            //        onClose(x);
            //    }
          }}
          index={i}
          demo={demo}
          singleStory={singleStory}
          setselectedStoryIndex={setselectedStoryIndex}
        />
      );
    });

  const onNextItem = i => {
    setCurrentPage(i);
  };

  const renderCube = () => {
    return renderStoryList();
    // if (Platform.OS == 'ios') {
    //   return (
    //     <CubeNavigationHorizontal
    //       ref={cube}
    //       callBackAfterSwipe={x => {
    //         if (x != currentPage) {
    //           setCurrentPage(parseInt(x));
    //         }
    //       }}>
    //       {renderStoryList()}
    //     </CubeNavigationHorizontal>
    //   );
    // } else {
    //   return (
    //     <AndroidCubeEffect
    //       ref={cube}
    //       callBackAfterSwipe={x => {
    //         if (x != currentPage) {
    //           setCurrentPage(parseInt(x));
    //         }
    //       }}>
    //       {renderStoryList()}
    //      </AndroidCubeEffect>
    //   );
    // }
  };

  const addContentItem = ({item, index}) => {
    return (
      <Pressable
        onPress={() => {
          if (item.key === 'Highlights') {
            setHighlightEnabled(true);
          } else if (item.key === 'Chat') {
            setshowReply(true);
            setTimeout(() => {
              textInputRef?.current?.focus?.();
            }, 1000);
          } else if (item.key === 'Remove') {
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss();
            props.navigation.goBack();
            removeSingleHighlightHandler();

            // continueAnimationFunc?.current?.();
          } else {
            console.log(JSON.stringify(selectedData));
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss();
            setshowReply(false);
            setloading(true);

            console.log(
              'url path to be shared',
              selectedData[0].stories[currentPage].story_image,
            );
            shareUrlImageStory({
              image:
                Platform.OS === 'android'
                  ? selectedData[0].stories[currentPage].story_image
                  : selectedData[0].stories[currentPage].story_image,
            }).finally(res => {
              setloading(false);
              continueAnimationFunc?.current?.();
            });
            return;

            // Share.share()
          }
        }}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={item.icon}
          style={{...globalStyles.mediumIcon, marginEnd: 12}}
        />
        <Text style={{...globalStyles.regularLargeText}}>{item.label}</Text>
      </Pressable>
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
  console.log('selected story index', selectedStoryIndex);
  const addStoryToHighlight = hightlight => {
    CleverTap.recordEvent('Stories added to highlights');
    dispatch(
      AddHighlight({
        highlightId: hightlight._id,
        storyId: selectedData[0].stories[selectedStoryIndex].story_id,
      }),
    );
  };

  const removeSingleHighlightHandler = () => {
    console.log(
      JSON.stringify({
        highlightId: selectedData[0].stories[selectedStoryIndex].highlight_id,
        storyId: selectedData[0].stories[selectedStoryIndex].story_id,
        selectedStoryIndex,
      }),
    );
    dispatch(
      RemoveSingleHighlight({
        highlightId: selectedData[0].stories[selectedStoryIndex].highlight_id,
        storyId: selectedData[0].stories[selectedStoryIndex].story_id,
      }),
    );
  };

  const highlightItem = ({item, index}) => {
    return (
      <Pressable
        style={{alignItems: 'center', marginHorizontal: scale(8)}}
        onPress={() => {
          addStoryToHighlight(item);
        }}>
        <CircularProgressBase
          value={100}
          radius={scale(32)}
          activeStrokeColor={'#124698'}
          activeStrokeSecondaryColor={'#F3BACA'}
          // inActiveStrokeColor={colors.grey11}
          duration={1000}
          activeStrokeWidth={scale(2)}
          inActiveStrokeWidth={scale(2)}>
          {item?.stories ? (
            <Highlightcomponent
              name={item?.stories[item?.stories?.length - 1]?.media}
              styles={styles}
              uri={`${AWS_URL_S3}production/stories/${
                item?.stories[item?.stories?.length - 1]?.media
              }`}
            />
          ) : (
            <Image source={APP_IMAGE.profileAvatar} style={styles.userPic} />
          )}
          {/* <FastImage
            source={
              item.stories?.length
                ? {
                    uri: `${AWS_URL_S3}production/stories/${item.stories[0].media}`,
                  }
                : APP_IMAGE.profileAvatar
            }
            style={styles.userPic}
            defaultSource={APP_IMAGE.profileAvatar}
          /> */}
        </CircularProgressBase>
        <Text style={{...globalStyles.regularMediumText, marginTop: scale(6)}}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  // const HighlightHeader = useCallback(() => {
  //   return (

  //   );
  // }, [isNewHighlight, newHighlight]);

  const addNewStory = () => {
    if (newHighlight === '') {
      alert('Enter highlight name');
      return;
    }
    setSheetEnabled(false);
    bottomSheetModalRef.current.dismiss();
    console.log(newHighlight);
    CleverTap.recordEvent('Stories New highlights');
    CleverTap.recordEvent('Stories added to highlights');

    dispatch(
      createNewHighlight({
        title: newHighlight,
        storyId: selectedData[0].stories[selectedStoryIndex].story_id,
      }),
    );
  };

  const onSendMessageStory = async () => {
    const id = generateID();

    const messageDetails = {
      _id: id,
      id: id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageTime: new Date(),
      receiver: VARIABLES.user?.partnerData?.partner?._id,
      message: replyText,
      sender: VARIABLES.user?._id,
      type: 'story',
      storyImage:
        selectedData[0].stories[selectedStoryIndex].storyImgPath ||
        selectedData[0].stories[selectedStoryIndex].story_image,
    };

    console.log('message send objectttt', messageDetails, new Date());
    // sendMessage(messageDetails);

    onSendMessage(messageDetails, realm);

    try {
      const {encryptedMessage, nonce} = await encryptAndSignMessage(replyText);

      socket.emit('sendMessage', {
        receiver: VARIABLES.user?.partnerData?.partner?._id,
        message: encryptedMessage,
        nonce: nonce,
        sender: VARIABLES.user?._id,
        type: 'story',
        storyImage:
          selectedData[0].stories[selectedStoryIndex].storyImgPath ||
          selectedData[0].stories[selectedStoryIndex].story_image,
      });
    } catch (error) {
      console.log('erorr unable to encrypt message', error);
    }
  };

  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={false}
        isLoading={loading}
        header={AppHeader}>
        <View style={{flex: 1}}>{renderCube()}</View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          // snapPoints={(highlightEnabled && !inputFocused) ?  mediumSnapPoints :  (isNewHighlight && inputFocused) ? extraLargeSnapPoints : (isNewHighlight && !inputFocused) ? largeSnapPoints : smallSnapPoints}
          snapPoints={
            !highlightEnabled && !inputFocused && !isNewHighlight
              ? smallSnapPoints
              : highlightEnabled && !inputFocused && !isNewHighlight
              ? mediumSnapPoints
              : highlightEnabled && inputFocused && isNewHighlight
              ? extraLargeSnapPoints
              : showReply && inputFocused
              ? extraLargeSnapPoints
              : largeSnapPoints
          }
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
            // flex:1
          }}
          style={{flex: 1}}>
          {!highlightEnabled && !showReply ? (
            <BottomSheetFlatList
              data={
                type === 'story'
                  ? CONTENT
                  : [
                      // {
                      //   id: 1,
                      //   key: 'Chat',
                      //   label: 'Reply in chat',
                      //   icon: APP_IMAGE.reply,
                      // },
                      {
                        id: 2,
                        key: 'Remove',
                        label: `Remove from ‘${highlightTitle}’`,
                        icon: APP_IMAGE.gallery,
                      },
                      {
                        id: 3,
                        key: 'Story',
                        label: 'Share Story',
                        icon: APP_IMAGE.storyShare,
                      },
                    ]
              }
              keyExtractor={(i, index) => index}
              renderItem={addContentItem}
              contentContainerStyle={{...styles.contentContainer, zIndex: 1}}
              ItemSeparatorComponent={itemContentSeparatorComponent}
              style={{zIndex: 1, marginTop: 12}}
            />
          ) : showReply ? (
            <View
              style={{
                flexDirection: 'row',
                // borderWidth:1,
                borderRadius: 10,
                // borderColor:colors.blue1,
                padding: 6,
                paddingHorizontal: 12,
                marginHorizontal: 16,
                backgroundColor: '#EFE8E6',
                alignItems: 'center',
              }}>
              <TextInput
                ref={textInputRef}
                placeholder="reply in chat"
                placeholderTextColor={colors.blue1}
                style={{
                  marginEnd: 10,
                  flex: 1,
                  ...globalStyles.regularLargeText,
                }}
                // maxLength={10}
                onChangeText={val => {
                  setreplyText(val);
                }}
                onBlur={() => {
                  setInputFocused(false);
                }}
                onFocus={() => {
                  setInputFocused(true);
                }}
                value={'dldl'}
              />
              <Pressable
                hitSlop={10}
                onPress={() => {
                  setSheetEnabled(false);
                  bottomSheetModalRef.current.dismiss();
                  setshowReply(false);
                  continueAnimationFunc?.current?.();

                  onSendMessageStory();
                }}>
                <SendMessageIconSvg />
              </Pressable>
            </View>
          ) : (
            <>
              <Text
                style={{
                  ...globalStyles.semiBoldLargeText,
                  textAlign: 'center',
                  fontSize: scale(18),
                  marginVertical: scale(16),
                }}>
                Move to existing highlights or add new
              </Text>
              {highlights && highlights.length > 0 && (
                <BottomSheetFlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal // due to this space takes up all over the screen, not adjutsable automatically
                  data={highlights}
                  keyboardShouldPersistTaps="handled"
                  renderItem={highlightItem}
                  keyExtractor={(item, index) => index}
                  contentContainerStyle={{
                    paddingHorizontal: scale(8),
                    marginTop: scale(24),
                    marginBottom: 0,
                    // height:100,
                    // backgroundColor: 'red',
                    // alignSelf:'baseline'
                  }}
                  ListHeaderComponent={() => {
                    return (
                      <View style={{marginStart: scale(16)}}>
                        <Pressable
                          onPress={() => {
                            setIsNewHighlight(true);
                            setInputFocused(true);
                            setTimeout(() => {
                              textInputRef.current.focus();
                            }, 500);
                          }}>
                          <Image
                            source={APP_IMAGE.shadowPlusIcon}
                            style={{width: scale(80), height: scale(80)}}
                            // defaultSource={APP_IMAGE.profileAvatar}
                          />
                        </Pressable>
                      </View>
                    );
                  }}
                />
              )}
              <View>
                <View style={{marginStart: scale(16)}}>
                  {!highlights.length && (
                    <Pressable
                      onPress={() => {
                        setIsNewHighlight(true);
                        setInputFocused(true);
                        setTimeout(() => {
                          textInputRef.current.focus();
                        }, 500);
                      }}>
                      <Image
                        source={APP_IMAGE.shadowPlusIcon}
                        style={{width: scale(80), height: scale(80)}}
                        // defaultSource={APP_IMAGE.profileAvatar}
                      />
                    </Pressable>
                  )}
                  {isNewHighlight && (
                    <View
                      style={{
                        flexDirection: 'row',
                        // borderWidth:1,
                        borderRadius: 10,
                        // borderColor:colors.blue1,
                        padding: 6,
                        paddingHorizontal: 12,
                        backgroundColor: '#EFE8E6',
                        alignItems: 'center',
                        alignSelf: 'baseline',
                        marginBottom: scale(8),
                      }}>
                      <TextInput
                        ref={textInputRef}
                        placeholder="add a title"
                        placeholderTextColor={colors.blue1}
                        style={{
                          marginEnd: 10,
                          width: scale(100),
                          maxWidth: scale(200),
                          ...globalStyles.regularLargeText,
                          color: colors.blue1,
                        }}
                        maxLength={10}
                        onBlur={() => {
                          setInputFocused(false);
                        }}
                        onFocus={() => {
                          setIsNewHighlight(true);
                          setInputFocused(true);
                          // Keyboard.open()
                        }}
                        onChangeText={val => {
                          setnewHighlight(val);
                        }}
                        value={newHighlight}
                      />
                      <Pressable
                        hitSlop={10}
                        onPress={() => {
                          setIsNewHighlight(false);
                          setnewHighlight('');
                          setInputFocused(false);
                          // getConversation(0)
                        }}
                        // style={{ marginEnd: 16 }}
                      >
                        <BlueCloseCircleIconSvg />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
              {isNewHighlight && (
                <View style={{flex: inputFocused ? 2.4 : 0}}>
                  <AppButton
                    text="Save"
                    style={{marginHorizontal: 16, marginVertical: 16}}
                    textStyle={{fontSize: 14}}
                    onPress={addNewStory}
                  />
                </View>
              )}
            </>
          )}
        </BottomSheetModal>

        {sheetEnabled && (
          <Pressable
            style={globalStyles.backgroundShadowContainer}
            onPress={() => {
              setSheetEnabled(false);
              bottomSheetModalRef.current.dismiss();
              continueAnimationFunc?.current?.();
            }}
          />
        )}
      </AppView>
    </>
  );
}

const styles = StyleSheet.create({
  moreIcon: {
    position: 'absolute',
    right: scale(10),
    top: scale(50),
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  userPic: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    // borderWidth: 4,
    // borderColor: '#fff'
  },
});
