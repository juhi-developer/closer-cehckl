/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SectionList,
  FlatList,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Linking,
  Alert,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import AppView from '../../../components/AppView';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import ProfileHeaderSvg from '../../../assets/svgs/profileHeaderSvg';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import {APP_IMAGE} from '../../../utils/constants';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import BlueTickIconSvg from '../../../assets/svgs/blueTickIconSvg';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import {scale, verticalScale} from '../../../utils/metrics';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import ReplyChatIconSvg from '../../../assets/svgs/replyChatIconSvg';
import {colors} from '../../../styles/colors';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  ClearAction,
  DeleteChat,
  GetChat,
  GetLinks,
  GetMedia,
  GetProfile,
  GetUserProfile,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import * as utils from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import {AWS_URL_S3} from '../../../utils/urls';
import ImageView from 'react-native-image-viewing';
import RNFS from 'react-native-fs';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import ChatLinkPreview from './ChatComponents/ChatLinkPreview';
import FastImage from 'react-native-fast-image';
import {useRealm} from '@realm/react';

import {getLinkPreview, getPreviewFromContent} from 'link-preview-js';
import {EventRegister} from 'react-native-event-listeners';
import {getStateDataAsync} from '../../../utils/helpers';
import {ProfileAvatar} from '../../../components/ProfileAvatar';

export default function ProfileInfo(props) {
  const {
    setTheme,
    setStroke,
    setRepliedText,
    setQuotedMessage,
    setChatId,
    setIsReply,
  } = props.route.params;

  const realm = useRealm();

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const [hook, setHook] = useState(false);

  const [themeColor, setThemeColor] = useState(
    VARIABLES.themeData?.themeColor || '#EFE8E6',
  );
  const [strokeColor, setStrokeColor] = useState(
    VARIABLES.themeData?.strokeColor || '#ECDDD9',
  );
  const [selectedPallete, setSelectedPallete] = useState(
    VARIABLES.themeData?.index || 0,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mediaData, setMediaData] = useState([]);
  const [linksData, setLinksData] = useState([]);
  const [visibleImage, setVisibleImage] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [data, setData] = useState(null);
  const [itemId, setItemId] = useState('');

  const [sheetEnabled, setSheetEnabled] = useState(false);

  const CONTENT = [
    {
      id: 1,
      key: 'Reply',
      label: 'Reply in chat',
      icon: <ReplyChatIconSvg />,
    },
    {
      id: 2,
      key: 'Delete',
      label: 'Delete',
      icon: <DeleteIconSvg />,
    },
  ];

  const [colorPallets, setColorPallets] = useState([
    {
      id: 1,
      themeColor: '#EFE8E6',
      strokeColor: '#ECDDD9',
      label: 'Default theme',
    },
    {
      id: 2,
      themeColor: '#EDFAF4',
      strokeColor: '#C2E3D5',
      label: 'Mint',
    },
    {
      id: 3,
      themeColor: '#FAE5EB',
      strokeColor: '#F0D3DB',
      label: 'Blush',
    },
    {
      id: 4,
      themeColor: '#CCE7FF',
      strokeColor: '#ADD6FC',
      label: 'Calm',
    },
    {
      id: 5,
      themeColor: '#E4E4E4',
      strokeColor: '#FFFFFF',
      label: 'Peace',
    },
    {
      id: 6,
      themeColor: '#FFEAAF',
      strokeColor: '#EBD086',
      label: 'Shine',
    },
  ]);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 1.25 + BOTTOM_SPACE,
      SCREEN_WIDTH / 1.25 + BOTTOM_SPACE,
    ],
    [],
  );

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current.present();
    setSheetEnabled(true);
  }, []);
  const handleSheetChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  // ref
  const bottomSheetReplyModalRef = useRef(null);

  // variables
  const snapPointsReply = useMemo(
    () => [
      SCREEN_WIDTH / 3.4 + BOTTOM_SPACE,
      SCREEN_WIDTH / 3.4 + BOTTOM_SPACE,
    ],
    [],
  );

  // callbacks
  const handlePresentReplyModalPress = useCallback(() => {
    bottomSheetReplyModalRef.current.present();
    setSheetEnabled(true);
  }, []);
  const handleSheetReplyChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  const [tabs, setTabs] = useState([
    {tab: 'Media', selected: true},
    {tab: 'Links', selected: false},
  ]);

  const Item = ({item, index}) => {
    let imageUrl;
    if (item.message.startsWith('/') || item.message.startsWith('file://')) {
      imageUrl = 'file://' + item.message;
    } else {
      imageUrl = `file://${RNFS.DocumentDirectoryPath}/${item.message}`;
    }

    return (
      <View style={{margin: 4}}>
        <Pressable
          onPress={() => {
            setViewImage(imageUrl);
            setVisibleImage(true);
          }}>
          <FastImage
            source={{
              uri: imageUrl,
            }}
            resizeMode="cover"
            style={{
              backgroundColor: 'lightgrey',
              height: scale(180),
              width: SCREEN_WIDTH / 3 - 4 * 2 - scale(10),
            }}
          />
        </Pressable>
        <View style={{position: 'absolute', top: scale(10), right: scale(6)}}>
          <Pressable
            onPress={() => {
              setData(item);
              handlePresentReplyModalPress();
            }}>
            <MoreVerticleIconSvg fill={'#fff'} />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  const itemSepratorComponent = () => {
    return <View style={{height: scale(16)}} />;
  };

  const ProfileHeader = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scale(12),
          }}>
          <Pressable
            // hitSlop={{
            //   top: 10,
            //   bottom: 10,
            //   left: 10,
            //   right: 10,
            // }}
            onPress={() => {
              if (
                VARIABLES?.user?.partnerData?.partner?.profilePic !== undefined
              ) {
                setViewImage(
                  AWS_URL_S3 +
                    VARIABLES?.user?.partnerData?.partner?.profilePic,
                );
                setVisibleImage(true);
              }
            }}>
            <ProfileAvatar type="partner" style={styles.userImage} />
          </Pressable>
          <Text
            style={{
              ...globalStyles.semiBoldLargeText,
              marginTop: scale(6),
              fontSize: scale(20),
              fontWeight: 500,
            }}>
            {VARIABLES?.user?.partnerData?.partner?.name}
          </Text>
          {/* <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: scale(20),
              marginBottom: 24,
            }}
            onPress={handlePresentModalPress}>
            <View
              style={{
                backgroundColor: strokeColor,
                width: scale(28),
                height: scale(28),
                borderRadius: scale(14),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#EBC9C0',
              }}
            />
            <Text
              style={{
                ...globalStyles.regularLargeText,
                marginStart: scale(8),
                marginTop: 2,
              }}>
              Chat Theme
            </Text>
          </Pressable> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: scale(20),
          }}>
          <Pressable
            onPress={() => {
              const prevTabs = [...tabs];
              prevTabs[0].selected = true;
              prevTabs[1].selected = false;
              setTabs(prevTabs);
            }}>
            <Text
              style={{
                ...globalStyles.regularLargeText,
                fontSize: scale(18),
                fontWeight: tabs[0].selected ? 500 : 400,
                textDecorationLine: tabs[0].selected ? 'underline' : 'none',
              }}>
              Media
            </Text>
          </Pressable>
          <Pressable
            style={{marginStart: 26}}
            onPress={() => {
              const prevTabs = [...tabs];
              prevTabs[0].selected = false;
              prevTabs[1].selected = true;
              setTabs(prevTabs);
            }}>
            <Text
              style={{
                ...globalStyles.regularLargeText,
                fontSize: scale(18),
                fontWeight: tabs[1].selected ? 500 : 400,
                textDecorationLine: tabs[1].selected ? 'underline' : 'none',
              }}>
              Links
            </Text>
          </Pressable>
        </View>
      </>
    );
  };

  const Footer = () => {
    return <View style={{height: scale(30)}} />;
  };

  const renderSection = ({item}) => {
    return (
      <FlatList
        data={item.list}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
    );
  };

  const LinkSection = ({item}) => {
    const [linkData, setLinkData] = useState('');

    return (
      <>
        <Pressable
          onPress={() => {
            Linking.openURL(item.message);
          }}
          style={[
            styles.baseStyles,
            true ? styles.sentByUser : styles.sentByPartner,
            {
              backgroundColor: true
                ? VARIABLES.themeData.strokeColor
                : VARIABLES.themeData.themeColor,
            },
          ]}>
          <Image
            style={styles.imageStyles}
            source={{
              uri: `file://${RNFS.DocumentDirectoryPath}/${item.thumbnailImage}`,
            }}
          />

          {item?.docName !== undefined && item.docName !== null && (
            <Text style={styles.titleText} numberOfLines={1}>
              {item?.docName}
            </Text>
          )}

          {item?.orientation !== undefined && item?.orientation !== null && (
            <Text style={styles.descpText} numberOfLines={2}>
              {item?.orientation}
            </Text>
          )}

          {item?.mime !== undefined && item?.mime !== null && (
            <Text style={styles.linkText} numberOfLines={1}>
              {item?.mime}
            </Text>
          )}

          <Text style={styles.descpText} numberOfLines={2}>
            {item.message}
          </Text>

          <View style={{position: 'absolute', top: scale(10), right: scale(6)}}>
            <Pressable
              onPress={() => {
                setData(item);
                handlePresentReplyModalPress();
              }}>
              <MoreVerticleIconSvg fill={'#fff'} />
            </Pressable>
          </View>
        </Pressable>
      </>
    );
  };

  const renderLinkSection = ({item, index}) => {
    return <LinkSection item={item} />;
  };

  const colorPalletItem = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          setThemeColor(item.themeColor);
          setStrokeColor(item.strokeColor);
          setTheme(item.themeColor);
          setStroke(item.strokeColor);
          setSelectedPallete(index);
          bottomSheetModalRef.current.dismiss();
          VARIABLES.themeData = {
            ...item,
            index,
          };
          utils.setData(
            utils.ASYNC_STORAGE_KEYS.themeInfo,
            JSON.stringify({...item, index}),
          );
        }}>
        <View
          style={{
            backgroundColor: item.strokeColor,
            width: scale(28),
            height: scale(28),
            borderRadius: scale(14),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: index === selectedPallete ? colors.blue1 : strokeColor,
          }}>
          {index === selectedPallete && <BlueTickIconSvg />}
        </View>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            marginStart: scale(16),
            fontSize: scale(18),
            fontWeight: index === selectedPallete ? 500 : 400,
          }}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const itemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: strokeColor,
          width: '100%',
          marginVertical: scale(10),
        }}
      />
    );
  };

  const AppHeader = () => {
    return (
      <View style={{...styles.headerContainer, backgroundColor: '#EDFBF7'}}>
        <View
          style={{
            marginTop: Platform.OS === 'android' ? -StatusBar.currentHeight : 0,
            width: '100%',
            borderRadius: 30,
            alignSelf: 'baseline',
            overflow: 'hidden',
          }}>
          <ProfileHeaderSvg themeColor={'#FCEEE0'} strokeColor={'#F4E5D6'} />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: scale(20),
            // backgroundColor: 'red',
            width: '100%',
            // marginHorizontal: 16
          }}>
          <View style={{...styles.userProfileContainer}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -2,
              }}>
              <Pressable
                hitSlop={20}
                onPress={() => {
                  bottomSheetModalRef.current.dismiss();
                  props.navigation.goBack();
                }}>
                <GoBackIconSvg />
              </Pressable>
              <Text
                style={{
                  ...globalStyles.semiBoldLargeText,
                  marginStart: scale(2),
                  fontSize: scale(18),
                  fontWeight: 500,
                }}>
                Profile info
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const addContentItem = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          setSheetEnabled(false);
          bottomSheetReplyModalRef.current.dismiss();
          if (item.key === 'Reply') {
            // setData()
            setRepliedText(data.message);
            setQuotedMessage(data);
            setChatId(data._id);
            setIsReply(true);
            props.navigation.goBack();
          } else if (item.key === 'Delete') {
            confirmDeletion();
          }
        }}>
        {/* <Image source={item.image}/> */}
        <View>{item.icon}</View>
        <Text
          style={{...globalStyles.regularLargeText, marginStart: scale(16)}}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const itemContentSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: strokeColor,
          width: '100%',
          marginVertical: 10,
        }}
      />
    );
  };

  const getMediaRealm = async () => {
    // Fetch all messages with type 'image'
    let allImageMessages = realm
      .objects('Message')
      .filtered(
        'type == "image" AND (isDeleted == false OR isDeleted == null)',
      );

    console.log('allImageMessages', allImageMessages);

    // Group messages by month
    let groupedMessages = {};
    allImageMessages.forEach(message => {
      const month = message.createdAt
        .toLocaleString('default', {month: 'long'})
        .toUpperCase();
      if (!groupedMessages[month]) {
        groupedMessages[month] = [];
      }
      groupedMessages[month].push(message);
    });

    // Format data to match your required structure
    let formattedData = Object.keys(groupedMessages).map(month => {
      return {
        title: month,
        data: [
          {
            key: 'image',
            list: groupedMessages[month].map(message => message),
          },
        ],
      };
    });
    return formattedData;
    // 'formattedData' now contains your data in the required format
  };

  const getLinksRealm = async () => {
    // Fetch all messages with type 'image'
    let allImageMessages = realm
      .objects('Message')
      .filtered('type == "link" AND isDeleted != true');

    // Group messages by month
    let groupedMessages = {};
    allImageMessages.forEach(message => {
      const month = message.createdAt
        .toLocaleString('default', {month: 'long'})
        .toUpperCase();
      if (!groupedMessages[month]) {
        groupedMessages[month] = [];
      }
      groupedMessages[month].push(message);
    });

    // Format data to match your required structure
    let formattedData = Object.keys(groupedMessages).map(month => {
      return {
        title: month,
        data: groupedMessages[month].map(message => message),
      };
    });
    return formattedData;
    // 'formattedData' now contains your data in the required format
  };

  const getMedia = async () => {
    const fetchData = await getMediaRealm();
    const latestMessages = JSON.parse(JSON.stringify(fetchData));
    setMediaData(latestMessages);

    /// setMediaData(fetchData);
    // let params = {
    //   type: 'image',
    // };

    // console.log('info-media-params', params);

    // if (netInfo.isConnected === false) {
    //   alert('Network issue :(', 'Please Check Your Network !');
    //   return;
    // }

    // setLoading(true), dispatch(GetMedia(params));
  };

  const getLinks = async () => {
    const fetchData = await getLinksRealm();
    console.log('links dataaaa', JSON.stringify(fetchData));
    setLinksData(fetchData);

    // if (netInfo.isConnected === false) {
    //   alert('Network issue :(', 'Please Check Your Network !');
    //   return;
    // }

    ///  setLoading(true),
    /// dispatch(GetLinks());
  };

  const confirmDeletion = () => {
    // setVisible(false)
    Alert.alert('Delete', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteChatHandler()},
    ]);
  };

  console.log('media data', JSON.stringify(mediaData));

  const deleteMessageById = async idToDelete => {
    const updatedChatData = await getStateDataAsync(setMediaData); // Fetch the latest state

    const filteredData = updatedChatData.map(month => ({
      ...month, // Copy all properties of the month object
      data: month.data.map(item => ({
        ...item, // Copy all properties of the data item
        list: item.list.filter(message => message._id !== idToDelete), // Filter out the message by _id
      })),
    }));

    setMediaData(filteredData); // Update the state with the filtered data
  };

  const deleteMessageByIdLinks = async idToDelete => {
    const updatedLinkData = await getStateDataAsync(setLinksData); // Fetch the latest state

    const filteredData = updatedLinkData.map(month => ({
      ...month, // Copy all properties of the month object
      data: month.data.filter(link => link._id !== idToDelete), // Filter out the link by _id directly in the data array
    }));

    setLinksData(filteredData); // Update the state with the filtered data
  };

  const deleteChatHandler = async () => {
    let params = {
      id: data._id,
    };

    if (data.type === 'link') {
      deleteMessageByIdLinks(data._id);
    } else {
      console.log('media here');
      deleteMessageById(data._id);
    }
    setHook(!hook);
    EventRegister.emit('deletePress', data._id);
    return;
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteChat(params));
  };

  // const getUserProfileHandler = () => {
  //   if (netInfo.isConnected === false) {
  //     alert('Network issue :(', 'Please Check Your Network !');
  //     return;
  //   }

  //   setLoading(true), dispatch(GetProfile());
  // };

  useEffect(() => {
    // console.log('loggs media',state);
    if (state.reducer.case === actions.GET_MEDIA_SUCCESS) {
      setLoading(false);
      console.log('state mediaaaaa', state.reducer.media);
      //   setMediaData(state?.media);
      // setChatData(state.chat)
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_MEDIA_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_LINKS_SUCCESS) {
      console.log('get link success', JSON.stringify(state.reducer.links));
      setLoading(false);
      /// setLinksData(state.links);
      // setChatData(state.chat)
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_LINKS_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_CHAT_SUCCESS) {
      setLoading(false);
      getMedia();
      getLinks();
      // alert('Deleted Successfully');
      // EventRegister.emit("changeList")
      // props.navigation.goBack()
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_CHAT_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      alert(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_PROFILE_SUCCESS) {
      setLoading(false);
      setIsRefreshing(false);
      // alert('Registered Successfully');
      VARIABLES.user = state.reducer.profileData;
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_PROFILE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      setIsRefreshing(false);
      // alert(state.message)
      dispatch(ClearAction());
    }
  }, [state]);

  useEffect(() => {
    getMedia();
    getLinks();
  }, []);

  const NoMediaFound = () => {
    return (
      <View style={{marginTop: SCREEN_HEIGHT / 5, alignItems: 'center'}}>
        <Text style={{...globalStyles.boldLargeText}}>No Media Found</Text>
      </View>
    );
  };

  const NoLinkFound = () => {
    return (
      <View style={{marginTop: SCREEN_HEIGHT / 5, alignItems: 'center'}}>
        <Text style={{...globalStyles.boldLargeText}}>No Link Found</Text>
      </View>
    );
  };

  return (
    <>
      <AppView
        showSafeView={false}
        scrollContainerRequired={false}
        isScrollEnabled={false}
        isLoading={loading}
        header={AppHeader}>
        {tabs[0].selected ? (
          <SectionList
            extraData={hook}
            showsVerticalScrollIndicator={false}
            sections={mediaData}
            keyExtractor={(item, index) => index}
            renderItem={renderSection}
            renderSectionHeader={({section: {title}}) => (
              <View
                style={{
                  // backgroundColor: 'red',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    padding: scale(10),
                    borderRadius: scale(20),
                    borderColor: '#fff',
                    borderWidth: 1,
                    backgroundColor: '#EFE8E6',
                    marginBottom: scale(20),
                    marginTop: scale(30),
                    paddingHorizontal: scale(36),
                  }}>
                  <Text style={styles.sectionHeaderTitle}>{title}</Text>
                </View>
              </View>
            )}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={isRefreshing}
            //     //  onRefresh={getUserProfileHandler}
            //   />
            // }
            // numColumns={3}
            // columnWrapperStyle={{
            //     flex: 1,
            // }}
            style={{marginHorizontal: scale(14)}}
            ItemSeparatorComponent={itemSepratorComponent}
            ListHeaderComponent={ProfileHeader}
            // ListHeaderComponent={Header}
            ListFooterComponent={Footer}
            ListEmptyComponent={NoMediaFound}
          />
        ) : (
          <SectionList
            showsVerticalScrollIndicator={false}
            sections={linksData}
            extraData={hook}
            keyExtractor={(item, index) => index}
            renderItem={renderLinkSection}
            renderSectionHeader={({section: {title}}) => (
              <View
                style={{
                  // backgroundColor: 'red',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    padding: scale(10),
                    borderRadius: scale(20),
                    borderColor: '#fff',
                    borderWidth: 1,
                    backgroundColor: '#EFE8E6',
                    marginBottom: scale(20),
                    marginTop: scale(30),
                    paddingHorizontal: scale(36),
                  }}>
                  <Text style={styles.sectionHeaderTitle}>{title}</Text>
                </View>
              </View>
            )}
            // numColumns={3}
            // columnWrapperStyle={{
            //     flex: 1,
            // }}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={isRefreshing}
            //     //  onRefresh={getUserProfileHandler}
            //   />
            // }
            style={{marginHorizontal: scale(14)}}
            ItemSeparatorComponent={itemSepratorComponent}
            ListHeaderComponent={ProfileHeader}
            // ListHeaderComponent={Header}
            ListFooterComponent={Footer}
            ListEmptyComponent={NoLinkFound}
          />
        )}
        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: themeColor,
            }}
            // style={{ backgroundColor: themeColor }}
          >
            <BottomSheetFlatList
              data={colorPallets}
              keyExtractor={(i, index) => index}
              renderItem={colorPalletItem}
              contentContainerStyle={{...styles.contentContainer}}
              ItemSeparatorComponent={itemSeparatorComponent}
              style={{
                marginTop: 25,
              }}
            />
          </BottomSheetModal>

          <BottomSheetModal
            ref={bottomSheetReplyModalRef}
            index={0}
            snapPoints={snapPointsReply}
            onChange={handleSheetReplyChanges}
            backgroundStyle={{
              backgroundColor: themeColor,
            }}
            // style={{ backgroundColor: themeColor }}
          >
            <BottomSheetFlatList
              data={CONTENT}
              keyExtractor={(i, index) => index}
              renderItem={addContentItem}
              contentContainerStyle={{...styles.contentContainer}}
              ItemSeparatorComponent={itemContentSeparatorComponent}
              style={{
                marginTop: 12,
              }}
            />
          </BottomSheetModal>
        </View>
      </AppView>
      <ImageView
        images={[{uri: viewImage}]}
        imageIndex={0}
        visible={visibleImage}
        onRequestClose={() => setVisibleImage(false)}
        doubleTapToZoomEnabled={true}
      />
      {sheetEnabled && (
        <Pressable
          style={globalStyles.backgroundShadowContainer}
          onPress={() => {
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss();
            bottomSheetReplyModalRef.current.dismiss();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomStartRadius: scale(30),
    borderBottomEndRadius: scale(30),
    backgroundColor: '#EFE8E6',
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
  },
  userImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
  },
  sectionHeaderTitle: {
    ...globalStyles.regularMediumText,
    fontWeight: 400,
    // marginBottom: 20,
    // marginTop: 30,
    // backgroundColor: 'red',
    // alignItems: 'center',
    // justifyContent: 'center',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  baseStyles: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(9),
    width: '100%',
  },
  sentByUser: {
    backgroundColor: VARIABLES.themeData.strokeColor,
    borderRadius: scale(15),
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
  },
  sentByPartner: {
    backgroundColor: VARIABLES.themeData.themeColor,
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
    alignSelf: 'flex-start',
  },
  imageStyles: {
    height: scale(150),
    borderRadius: scale(10),
  },
  titleText: {
    ...globalStyles.standardMediumText,
    marginTop: scale(12),
  },
  descpText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(12),
  },
  linkText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(12),
    color: '#127FFE',
    textDecorationLine: 'underline',
    marginBottom: scale(5),
  },
});
