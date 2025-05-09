/* eslint-disable react/no-unstable-nested-components */
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  SectionList,
  Alert,
  useWindowDimensions,
  Platform,
  PermissionsAndroid,
  Button,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
  memo,
  useMemo,
} from 'react';
import {globalStyles, SCREEN_WIDTH} from '../../../styles/globalStyles';
import AppView from '../../../components/AppView';
import {
  APP_IMAGE,
  APP_STRING,
  ORGANISER_NOTES_CONTSTANTS,
  templateImages,
} from '../../../utils/constants';
import {colors} from '../../../styles/colors';
import DropDownBlueIconSvg from '../../../assets/svgs/dropDownBlueIconSvg';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import {moderateScale, scale, verticalScale} from '../../../utils/metrics';
import {Menu, MenuItem} from 'react-native-material-menu';
import {FloatingAction} from 'react-native-floating-action';
import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  ClearAction,
  DeleteNote,
  DeleteTodoList,
  GetOrganiseList,
  GetTemplates,
  PinUnpin,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import * as actions from '../../../redux/actionTypes';
import {EventRegister} from 'react-native-event-listeners';
import moment from 'moment';
import MonthPicker from 'react-native-month-year-picker';
import {fonts} from '../../../styles/fonts';
import {ToastMessage} from '../../../components/toastMessage';
import API from '../../../redux/saga/request';
import {cloneDeep} from 'lodash';
import DropDownPicker from 'react-native-dropdown-picker';
import DropUpBlueIconSvg from '../../../assets/svgs/dropUpBlueIconSvg';
import SelectDropdown from 'react-native-select-dropdown';
import OverlayLoader from '../../../components/overlayLoader';
import {getStateDataAsync, uploadToS3BUCKET} from '../../../utils/helpers';
import RNFS from 'react-native-fs';
import OrganiseLoader from './OrganiseLoader';
import {NetworkContext} from '../../../components/NetworkContext';
import {API_BASE_URL} from '../../../utils/urls';
import CustomToolTip from '../../../components/CustomToolTip';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext} from '../../../utils/VariablesContext';
import {useSocket} from '../../../utils/socketContext';
import {useAppState} from '../../../utils/AppStateContext';
import * as Sentry from '@sentry/react-native';
import ExploreTemplatesTooltip from '../../../components/contextualTooltips/ExploreTemplatesTooltip';
import OrganiseCreateNotesTooltip from '../../../components/contextualTooltips/OrganiseCreateNotesTooltip';
import {scaleNew} from '../../../utils/metrics2';
import {useFocusEffect} from '@react-navigation/native';

const CleverTap = require('clevertap-react-native');

const TEMPLATES = [
  {
    id: 1,
    title: 'Plan a trip',
    template: APP_IMAGE.templateOne,
    button: APP_IMAGE.templateButtonOne,
    items: [
      {
        // id: 1,
        title: 'Things to pack',
        notes: [],
        templateIcon: 'template1Note1',
        // icon:<StayIconSvg/>
      },
      {
        // id: 2,
        title: 'Stays',
        notes: [],
        templateIcon: 'template1Note2',
        // icon:<StayIconSvg/>
      },
      {
        // id: 3,
        title: 'Travel',
        notes: [],
        templateIcon: 'template1Note3',
        // icon:<TravelIconSvg/>
      },
      {
        // id: 4,
        title: 'Food & Experiences',
        notes: [],
        templateIcon: 'template1Note4',
        // icon:<ExperienceIconSvg/>
      },
    ],
  },
  {
    id: 2,
    title: 'Weekends',
    button: APP_IMAGE.templateButtonTwo,
    template: APP_IMAGE.templateTwo,
    items: [
      {
        // id: 1,
        title: 'Eat out ',
        notes: [],
        templateIcon: 'template2Note1',
        // icon:<StayIconSvg/>
      },
      {
        // id: 2,
        title: 'Netflix & chill :) ',
        notes: [],
        templateIcon: 'template2Note2',
        // icon:<StayIconSvg/>
      },
      {
        // id: 3,
        title: 'Personal time',
        notes: [],
        templateIcon: 'template2Note3',
        // icon:<TravelIconSvg/>
      },
      {
        // id: 4,
        title: 'Experiences',
        notes: [],
        templateIcon: 'template2Note4',
        // icon:<ExperienceIconSvg/>
      },
      {
        // id: 4,
        title: 'Workout',
        notes: [],
        templateIcon: 'template2Note5',
        // icon:<ExperienceIconSvg/>
      },
      {
        // id: 4,
        title: 'Sports or games',
        notes: [],
        templateIcon: 'template2Note6',
        // icon:<ExperienceIconSvg/>
      },
    ],
  },
  {
    id: 3,
    title: 'Watchlist',
    template: APP_IMAGE.templateThree,
    button: APP_IMAGE.templateButtonThree,
    items: [
      {
        // id: 1,
        title: 'Movies',
        notes: [],
        templateIcon: 'template3Note1',
        // icon:<StayIconSvg/>
      },
      {
        // id: 2,
        title: 'Shows',
        notes: [],
        templateIcon: 'template3Note2',
        // icon:<StayIconSvg/>
      },
      {
        // id: 3,
        title: 'Podcasts',
        notes: [],
        templateIcon: 'template3Note3',
        // icon:<TravelIconSvg/>
      },
      {
        // id: 4,
        title: 'Videos',
        notes: [],
        templateIcon: 'template3Note4',
        // icon:<ExperienceIconSvg/>
      },
      {
        // id: 4,
        title: 'Songs',
        notes: [],
        templateIcon: 'template3Note5',
        // icon:<ExperienceIconSvg/>
      },
      {
        // id: 4,
        title: 'Books',
        notes: [],
        templateIcon: 'template3Note6',
        // icon:<ExperienceIconSvg/>
      },
      {
        // id: 4,
        title: 'Articles',
        notes: [],
        templateIcon: 'template3Note7',
        // icon:<ExperienceIconSvg/>
      },
    ],
  },
  {
    id: 4,
    title: 'Dineout',
    template: APP_IMAGE.templateFour,
    button: APP_IMAGE.templateButtonFour,
    items: [
      {
        // id: 1,
        title: 'Restaurants',
        notes: [],
        templateIcon: 'template4Note1',
        // icon:<StayIconSvg/>
      },
      {
        // id: 2,
        title: 'Cafes',
        notes: [],
        templateIcon: 'template4Note2',
        // icon:<StayIconSvg/>
      },
      {
        // id: 3,
        title: 'Bars & Clubs',
        notes: [],
        templateIcon: 'template4Note3',
        // icon:<TravelIconSvg/>
      },
    ],
  },
];

const action = [
  {
    text: 'To-do List',
    // icon: require("../../../assets/images/appIcons/list.png"),
    icon: (
      <Image
        source={require('../../../assets/images/appIcons/list.png')}
        style={{width: 56, height: 56, resizeMode: 'contain'}}
      />
    ),
    name: 'list',
    position: 2,
    textContainerStyle: {
      backgroundColor: 'transparent',
    },

    // buttonSize:20,
    textStyle: {
      fontFamily: fonts.regularFont,
      fontSize: 16,
      color: '#fff',
      marginRight: -10,
    },
    buttonSize: 56,
    margin: 0,
  },
  {
    text: 'Notes',
    icon: (
      <Image
        source={require('../../../assets/images/appIcons/notes.png')}
        style={{width: 56, height: 56, resizeMode: 'contain'}}
      />
    ),
    name: 'notes',
    position: 1,
    textContainerStyle: {backgroundColor: 'transparent'},
    // buttonSize:20,
    textStyle: {
      fontFamily: fonts.regularFont,
      fontSize: 16,
      color: '#fff',
      marginRight: -10,
    },
    buttonSize: 56,
    margin: 0,
  },
];

export default function Organise(props) {
  const {socket, isSocketConnected} = useSocket();
  const appStateGlobal = useAppState();
  const {notifData, updateNotifData, setActiveTab} = useAppContext();
  const {isConnected} = useContext(NetworkContext);

  const yearRef = useRef(null);
  const monthRef = useRef(null);

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [refreshingLoading, setRefreshingLoading] = useState(false);

  const [tooltipState, setTooltipState] = useState('');

  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [organiseList, setOrganiseList] = useState([]);
  // const [organiseId, setOrganiseId] = useState('')
  const [organiseIndex, setOrganiseIndex] = useState(null);
  const [count, setCount] = useState(0); // organised data count

  const [date, setDate] = useState(new Date());
  const [dateInfo, setDateInfo] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [show, setShow] = useState(false);
  const currentYear = Number(moment().subtract(5, 'years').format('YYYY'));
  const years = Array.from({length: 11}, (_, index) => ({
    label: (currentYear + index).toString(),
    value: (currentYear + index).toString(),
  }));
  const [items, setItems] = useState([
    {label: 'All', value: 'All'},
    {label: 'January', value: 'January'},
    {label: 'February', value: 'February'},
    {label: 'March', value: 'March'},
    {label: 'April', value: 'April'},
    {label: 'May', value: 'May'},
    {label: 'June', value: 'June'},
    {label: 'July', value: 'July'},
    {label: 'August', value: 'August'},
    {label: 'September', value: 'September'},
    {label: 'October', value: 'October'},
    {label: 'November', value: 'November'},
    {label: 'December', value: 'December'},
  ]);

  const [yearsBuffer, setYearsBuffer] = useState(years);
  const [initialApiCall, setinitialApiCall] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [endLimit, setEndLimit] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);

  const showPicker = useCallback(value => setShow(value), []);

  const checkToolTipStatus = async () => {
    let tooltipState1 = await AsyncStorage.getItem('toolTipOrganise');
    setTooltipState(tooltipState1);
  };

  useEffect(() => {
    checkToolTipStatus();
  }, []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || moment();
      console.log(selectedDate, 'tcfyvgubhinjokm');
      showPicker(false);
      setDate(selectedDate);
      setDateInfo(selectedDate.format('YYYY-MM-DD'));
      getOrganiseListHandler(0, moment(selectedDate).format('YYYY-MM-DD'));
    },
    [date, showPicker],
  );

  const templateItem = ({item, index}) => {
    return (
      <Pressable
        style={{
          backgroundColor: 'rgb(219, 230, 245)',
          alignSelf: 'baseline',
          borderRadius: scale(10),
          marginEnd: scale(20),
          height: scale(189),
          width: scale(150),
        }}
        onPress={() => {
          if (VARIABLES.disableTouch) {
            ToastMessage('Please add a partner to continue');
            return;
          }
          const newTemplate = cloneDeep(item);
          newTemplate.items.map((item, index) => {
            newTemplate.items[index].notes = [];
          });
          console.log(JSON.stringify(newTemplate));
          props.navigation.navigate('template', {
            id: newTemplate.id,
            data: newTemplate?.items ? newTemplate.items : [],
            headerName: newTemplate.title,
            newTemplate: true,
            addNewTemplate: addNewTemplate,
          });
        }}>
        <Image
          source={item.template}
          style={{width: scale(150), height: scale(189), position: 'absolute'}}
          resizeMode="cover"
        />
        <View style={{flex: 1}} />
        <View style={{alignItems: 'center'}}>
          <Image source={item.button} style={styles.templateGradientIcon} />
          <ImageBackground
            source={APP_IMAGE.bottomTitleHolder}
            resizeMode="cover"
            style={styles.bottomHolderContainer}
            imageStyle={{width: scale(150)}}>
            <Text
              style={{
                ...globalStyles.standardMediumText,
                color: colors.white,
                marginTop: scale(9),
              }}>
              {item.title}
            </Text>
          </ImageBackground>
        </View>
      </Pressable>
    );
  };

  const Item = ({item, index}) => {
    const [visible, setVisible] = useState(false);
    const hideMenu = index => {
      setVisible(false);
    };
    const showMenu = () => {
      setVisible(true);
    };

    const menuButton = type => {
      return (
        <Menu
          visible={visible}
          anchor={
            <Pressable onPress={showMenu} hitSlop={20}>
              <MoreVerticleIconSvg fill={'rgb(128, 126, 138)'} />
            </Pressable>
          }
          onRequestClose={hideMenu}
          // style={{marginRight:12}}
        >
          {item?.createdBy == VARIABLES.user?._id && (
            <MenuItem
              textStyle={{color: '#000'}}
              onPress={() => {
                hideMenu();
                console.log(type);
                // setOrganiseId(item?._id)
                if (type === 'todo') {
                  setOrganiseIndex(index);
                  confirmDeletion(item?._id);
                } else if (type === 'notes') {
                  confirmNoteDeletion(item?._id);
                } else {
                  confirmTemplateDeletion(item?._id);
                }
              }}>
              Delete
            </MenuItem>
          )}
          <MenuItem
            textStyle={{color: '#000'}}
            onPress={() => {
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              hideMenu();
              if (type === 'todo') {
                CleverTap.recordEvent('Notes or to dos viewed');
                props.navigation.navigate('todos', {
                  data: item?.list,
                  title: item?.title,
                  id: item?._id,
                  addNewTodos: addNewTodos,
                });
              } else if (type === 'notes') {
                CleverTap.recordEvent('Notes or to dos viewed');
                props.navigation.navigate('notes', {
                  data: item?.item,
                  title: item?.title,
                  id: item?._id,
                  text: item.item,
                  prevImages: item?.images,
                  addNewNotes: addNewNotes,
                });
              } else {
                props.navigation.navigate('template', {
                  id: item._id,
                  data: item?.list ? item.list : [],
                  headerName: item.title,
                  pinned: item.isPinned,
                  addNewTemplate: addNewTemplate,
                });
              }
            }}>
            Edit
          </MenuItem>
          <MenuItem
            textStyle={{color: '#000'}}
            onPress={() => {
              hideMenu();
              // setOrganiseId(item?._id)
              // setOrganiseIndex(index)
              pinUnpinHandler(
                item?._id,
                !item?.isPinned,
                item.type === 'template' ? 'templates' : item.type,
              );
            }}>
            {item?.isPinned ? 'Unpin' : 'Pin'}
          </MenuItem>
        </Menu>
      );
    };

    // const firstThreeMessageItems = item?.list.filter((item) => item.text_type === 'message').slice(0, 3);
    let noteData = [];
    const ITEM_WIDTH = SCREEN_WIDTH / 2 - scale(28); // 24 ===> HORIZONTAL MARGIN(16) + 8
    if (item.type === 'template') {
      item.list.map(l => {
        noteData = [...noteData, ...l.notes];
      });
    }

    return (
      <View
        style={{
          backgroundColor: item.colorCode,
          borderRadius: 12,
          marginVertical: 7,
          width: ITEM_WIDTH,
          paddingTop: scale(12),
          paddingLeft: scale(15),
          paddingRight: scale(7),
          paddingBottom: scale(6),
          marginEnd: index % 2 === 0 ? scale(8) : scale(0),
          marginStart: index % 2 === 0 ? scale(0) : scale(8),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: scale(8),
          }}>
          <Text
            style={{
              color: '#2F3A4E',
              fontFamily: fonts.standardFont,
              fontSize: scale(12),
              flex: 1,
            }}
            numberOfLines={1}>
            {item?.title}
          </Text>
          {menuButton(item.type)}
          {/* {item?.type === 'notes' &&
            item.createdBy === VARIABLES.user._id &&
            menuButton(item.type)}
          {item?.type !== 'notes' && menuButton(item.type)} */}
        </View>
        {item.type === 'notes' ? (
          <Pressable
            style={{
              height: scale(105),
            }}
            onPress={() => {
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              CleverTap.recordEvent('Notes or to dos viewed');
              props.navigation.navigate('notes', {
                data: item?.item,
                title: item?.title,
                id: item?._id,
                text: item.item,
                prevImages: item?.images,
                createdBy: item.createdBy,
                addNewNotes: addNewNotes,
              });
            }}>
            <View style={{paddingRight: scale(16)}}>
              {item?.item == '' && item.images.length > 0 ? (
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    color: colors.text,
                    fontSize: 14,
                    fontFamily: fonts.italicFont,
                  }}>
                  A note containing images inside
                </Text>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    color: colors.text,
                    fontSize: scale(14),
                    lineHeight: scale(20),
                  }}>
                  {item?.item}
                </Text>
              )}
            </View>
          </Pressable>
        ) : item.type === 'todo' ? (
          <Pressable
            onPress={() => {
              if (VARIABLES.disableTouch) {
                ToastMessage('Please add a partner to continue');
                return;
              }
              CleverTap.recordEvent('Notes or to dos viewed');
              const listData = [...item?.list];
              props.navigation.navigate('todos', {
                data: listData,
                title: item?.title,
                id: item?._id,
                addNewTodos: addNewTodos,
              });
            }}
            style={{
              height: scale(105),
            }}>
            {item?.list
              .filter(item => item.text_type === 'message')
              .slice(0, 3)
              .map(item => {
                const cretaedByUser = item?.markedBy === VARIABLES.user?._id;

                let image;
                if (cretaedByUser) {
                  image = VARIABLES.user.iconColor;
                } else {
                  image = VARIABLES?.user?.partnerData?.partner?.iconColor;
                }
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: scale(6),
                      alignItems: 'center',
                    }}>
                    {item?.isChecked ? (
                      <Image
                        source={
                          image === 1 ? APP_IMAGE.fadeMark2 : APP_IMAGE.fadeMark
                        }
                        style={{
                          width: scale(16),
                          height: scale(16),
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <Image
                        source={APP_IMAGE.notSelected}
                        style={{
                          width: scale(16),
                          height: scale(16),
                          resizeMode: 'contain',
                        }}
                      />
                    )}
                    <Text
                      style={{
                        ...globalStyles.regularMediumText,
                        marginStart: 5,
                        //     flex: 1,
                        lineHeight: scale(21),
                        flex: 1,
                        marginRight: 24,
                      }}
                      numberOfLines={1}>
                      {item?.item}
                    </Text>
                  </View>
                );
              })}

            {item?.list &&
              item?.list.filter(item => item.text_type === 'message').length >
                3 && (
                <View style={{marginTop: 4}}>
                  <Text
                    style={{...globalStyles.regularSmallText, opacity: 0.6}}>
                    +
                    {item?.list.filter(item => item.text_type === 'message')
                      .length - 3}{' '}
                    items
                  </Text>
                </View>
              )}
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              const listData = [...item?.list];
              props.navigation.navigate('template', {
                id: item._id,
                data: item?.list ? item.list : [],
                headerName: item.title,
                pinned: item.isPinned,
                addNewTemplate: addNewTemplate,
              });
            }}
            style={{
              height: scale(105),
            }}>
            {noteData.slice(0, 3).map(item => {
              const cretaedByUser = item?.markedBy === VARIABLES.user?._id;

              let image;
              if (cretaedByUser) {
                image = VARIABLES.user.iconColor;
              } else {
                image = VARIABLES?.user?.partnerData?.partner?.iconColor;
              }
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: scale(6),
                    alignItems: 'center',
                  }}>
                  {item?.isMarked ? (
                    <Image
                      source={
                        image === 1 ? APP_IMAGE.fadeMark2 : APP_IMAGE.fadeMark
                      }
                      style={{
                        width: scale(16),
                        height: scale(16),
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Image
                      source={APP_IMAGE.notSelected}
                      style={{
                        width: scale(16),
                        height: scale(16),
                        resizeMode: 'contain',
                      }}
                    />
                  )}
                  <Text
                    style={{
                      ...globalStyles.regularMediumText,
                      marginStart: 5,
                      flex: 0.8,
                      lineHeight: scale(21),
                    }}
                    numberOfLines={1}>
                    {item?.note}
                  </Text>
                </View>
              );
            })}

            {noteData.length > 3 && (
              <View style={{marginTop: 4}}>
                <Text style={{...globalStyles.regularSmallText, opacity: 0.6}}>
                  +{noteData.length - 3} items
                </Text>
              </View>
            )}
          </Pressable>
        )}

        <View style={{alignItems: 'flex-end', marginRight: 5}}>
          <Text style={{...globalStyles.regularSmallText, opacity: 0.6}}>
            {/* {moment(item?.timestamp).utc().format('DD MMM, HH:mm')} */}
            {moment(item?.timestamp).format('DD MMM, HH:mm')}
          </Text>
        </View>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  const renderFloatIcon = ({item, index}) => {
    return (
      <View style={{flex: 1}}>
        <Text>Hello</Text>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Set the current tab when ChatTab is focused
      setActiveTab('organise');
      return () => {
        // Reset the current tab when ChatTab is blurred (not focused)
        ///    setActiveTab('');
      };
    }, []),
  );

  ////////////////// SOCKET LISTENERS
  useEffect(() => {
    if (isSocketConnected && socket) {
      socket.on('organize', data => {
        getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'), true);
      });
    }

    return () => {
      if (isSocketConnected && socket) {
        socket.off('organize');
      }
    };
  }, [isSocketConnected, socket]);

  useEffect(() => {
    if (appStateGlobal === 'active' && !VARIABLES.isMediaOpen) {
      setIsRefreshing(true);
      onRefreshOrganise();
    }
  }, [appStateGlobal]);

  const getOrganiseListHandler = async (page, date, refreshing) => {
    console.log('dateee to send', date);
    const prevMonth = await getStateDataAsync(setMonth);

    if (date === 'Invalid date') {
      return;
    }
    let params = {
      date: date,
      type: prevMonth === 'All' ? 'All' : 'none',
    };

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    //dispatch(GetOrganiseList(params));

    try {
      const resp = await API(
        `user/newOrganizeList?page=${page}&limit=${limit}&type=${params.type}&date=${params.date}`,
        'GET',
      );

      console.log(
        'respppp newwww',
        params.type,
        params.date,
        JSON.stringify(resp.body?.data),
      );

      setRefreshingLoading(false);
      setinitialApiCall(false);
      setLoading(false);
      setIsRefreshing(false);
      setFooterLoader(false);
      setRefreshing(false);

      if (resp?.body?.statusCode === 200) {
        let newData = resp?.body?.data;
        console.log(
          'transformedList get api triggered',
          page,
          newData?.data.length,
        );
        if (newData.data.length < limit) {
          setEndLimit(true);
        } else {
          setEndLimit(false);
        }

        if (page !== 0) {
          setOrganiseList(prev => [...prev, ...newData?.data]);
        } else {
          setCount(newData?.count);
          setOrganiseList(newData?.data);
        }

        setPage(page + 1);
      } else {
        setRefreshingLoading(false);
        setinitialApiCall(false);
        setLoading(false);
        setIsRefreshing(false);
        setFooterLoader(false);
        setRefreshing(false);
        //  alert(resp?.body?.Message);
        console.log('res body', resp?.body);
      }
    } catch (error) {
      setRefreshingLoading(false);
      setinitialApiCall(false);
      setLoading(false);
      setIsRefreshing(false);
      setFooterLoader(false);
      setRefreshing(false);

      //  alert(error.message);
      console.log('error organise', JSON.stringify(error));
    }
  };

  const confirmDeletion = id => {
    // setVisible(false)
    Alert.alert('Delete List', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteListHandler(id)},
    ]);
  };

  const deleteListHandler = organiseId => {
    let params = {
      id: organiseId,
    };

    console.log('info-list deletion', params);

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteTodoList(params));
  };

  const confirmNoteDeletion = id => {
    // setVisible(false)
    Alert.alert('Delete Note', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteNoteHandler(id)},
    ]);
  };

  const confirmTemplateDeletion = id => {
    // setVisible(false)
    Alert.alert('Delete template', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deketeTemplateHandler(id)},
    ]);
  };

  const deketeTemplateHandler = async id => {
    setLoading(true);
    try {
      const resp = await API(`user/templates1?templateId=${id}`, 'DELETE');
      if (resp.body.statusCode === 200) {
        ToastMessage('Template deleted successfully');
        getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'), true);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const deleteNoteHandler = id => {
    let params = {
      id: id,
    };

    console.log('info-delete', params);

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteNote(params));
  };

  const pinUnpinHandler = (id, pin, type) => {
    let params = {
      type: type,
      id: id,
      pin: pin,
    };

    console.log('info-list deletion', params);
    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(PinUnpin(params));
  };

  const getLabelForDate = title => {
    let date = moment(title).utc();
    // let date = new Date(title);

    // const today = new Date();
    // const yesterday = new Date(today);
    // yesterday.setDate(yesterday.getDate() - 1);
    if (title === 'Pinned') {
      return title;
    }
    if (moment().isSame(date, 'date')) {
      return 'Today';
    } else if (moment().subtract(1, 'day').isSame(date, 'date')) {
      return 'Yesterday';
    } else {
      return date.format('ddd, Do MMM ');
    }

    // Return the date in any desired format for other sections
    // For example: return formatDate(date);
  };

  const onRefreshOrganise = () => {
    getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'), true);
  };

  const addNewNotes = async ({
    id,
    createdBy,
    setisEdited,
    setFilenames,
    setGallerySet,
    setHeaderTitle,
    setImages,
    setNoteText,
  }) => {
    const filenames = await getStateDataAsync(setFilenames);
    const gallerySet = await getStateDataAsync(setGallerySet);
    const headerTitle = await getStateDataAsync(setHeaderTitle);
    const images = await getStateDataAsync(setImages);
    const noteText = await getStateDataAsync(setNoteText);
    const isEdited = await getStateDataAsync(setisEdited);
    if (id && isEdited) {
      editNewNoteApi({
        id,
        noteText,
        headerTitle,
        images,
      });
      return;
    }
    if (!id) {
      addNewNoteApi({
        filenames,
        gallerySet,
        headerTitle,
        images,
        noteText,
      });
      return;
    }
    const newText = await getStateDataAsync(setNoteText);
    // console.log(newText)
  };

  const editNewNoteApi = async ({id, noteText, headerTitle, images}) => {
    let params = {
      noteId: id,
      item: noteText,
      title: headerTitle === '' ? 'Title' : headerTitle,
    };

    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true);
    const additionalDetails = await Promise.all(
      images.map(async (item, index) => {
        if (item.path && item.filename && item.mime) {
          const multipleDetails = await uploadToS3BUCKET(
            item.path,
            `${moment().format('x')}${item.filename}`,
            item.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(item.path, filename);
          return filename;
        } else {
          return item;
        }
      }),
    );
    params.images = additionalDetails;
    console.log(params);

    try {
      const resp = await API('user/notes', 'PUT', params);
      if (resp.body.statusCode === 200) {
        ToastMessage('Note updated successfully');
        EventRegister.emit('changeList');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
    // setLoading(true);
    // dispatch(EditNote(params));
  };

  const addNewNoteApi = async ({
    gallerySet,
    noteText,
    headerTitle,
    images,
    filenames,
  }) => {
    if (noteText.trim() === '' && images.length === 0) {
      return;
    }
    setLoading(true);
    if (gallerySet.length !== 0) {
      let params = {
        item: noteText,
        title: headerTitle === '' ? 'Title' : headerTitle,
      };
      const additionalDetails = await Promise.all(
        images.map(async item => {
          const multipleDetails = await uploadToS3BUCKET(
            item.path,
            `${moment().format('x')}${item.filename}`,
            item.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(item.path, filename);
          return filename;
        }),
      );
      params.images = additionalDetails;
      console.log('llllllllllllllllllll', params);
      try {
        const resp = await API('user/notes', 'POST', params);
        if (resp.body.statusCode === 200) {
          ToastMessage('Note added successfully');
          EventRegister.emit('changeList');
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      let params = {
        // id:id,
        images: filenames,
        title: headerTitle === '' ? 'Title' : headerTitle,
        item: noteText,
      };

      console.log('info-NOTlllllE', params);

      if (netInfo.isConnected === false) {
        alert('Network issue :(', 'Please Check Your Network !');
        return;
      }
      console.log(params, 'yvgubhinjomkl');
      try {
        const resp = await API('user/notes', 'POST', params);
        if (resp.body.statusCode === 200) {
          ToastMessage('Note added successfully');
          EventRegister.emit('changeList');
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // console.log('loggs get templates',state);
    if (state.reducer.case === actions.GET_TEMPLATES_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TEMPLATE_SUCCESS) {
      setLoading(false);

      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TEMPLATE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_ORGANISE_LIST_SUCCESS) {
      setRefreshingLoading(false);
      // console.log()
      setinitialApiCall(false);
      setLoading(false);
      setIsRefreshing(false);

      setOrganiseList(state.reducer.organiseList.data);
      setCount(state.reducer.organiseList.count);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_ORGANISE_LIST_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setinitialApiCall(false);
      setRefreshingLoading(false);
      setIsRefreshing(false);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TODO_LIST_SUCCESS) {
      setLoading(false);
      ToastMessage('To-do list deleted successfully');
      getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'));
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TODO_LIST_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_NOTE_SUCCESS) {
      setLoading(false);
      ToastMessage('Note Deleted Successfully');
      getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'));
      // props.navigation.goBack()
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_NOTE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.PIN_UNPIN_SUCCESS) {
      setLoading(false);
      //ToastMessage('Deleted Successfully');
      getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'));
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.PIN_UNPIN_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    }
  }, [state]);

  useEffect(() => {
    setMonth('All');
    setYear(moment(new Date()).format('YYYY'));
    getOrganiseListHandler(0, moment(date).format('YYYY-MM-DD'));
    setinitialApiCall(true);

    const deleteEvent = EventRegister.addEventListener(
      'deleteTemplate',
      data => {
        console.log('delete data', data);
        setLoading(true);
        dispatch(GetTemplates());
      },
    );

    const deleteList = EventRegister.addEventListener('changeList', data => {
      console.log('chnage list data EVENT===?>', data);
      setLoading(true);

      setYear(moment(new Date()).format('YYYY'));

      const eyarIndev = yearsBuffer.findIndex(
        m => m === moment(new Date()).format('YYYY'),
      );
      yearRef.current.selectIndex(eyarIndev);

      setTimeout(async () => {
        const prevMonth = await getStateDataAsync(setMonth);

        if (prevMonth !== 'All') {
          setMonth(moment(new Date()).format('MMMM'));
          const monthIndex = items.findIndex(
            m => m === moment(new Date()).format('MMMM'),
          );

          monthRef.current.selectIndex(monthIndex);
        }
      }, 10);

      getOrganiseListHandler(0, moment(new Date()).format('YYYY-MM-DD'));
    });

    return () => {
      EventRegister.removeEventListener(deleteEvent);
      EventRegister.removeEventListener(deleteList);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      updateNotifData({...VARIABLES.appNotifData, organise: false});
      ///   VARIABLES.appNotifData.organise = false;
      ///  EventRegister.emit('APP_NOTIF_CHANGE');
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const addNewTemplate = async ({
    setTemplates,
    setHeaderTitle,
    id,
    setisEdited,
    newTemplate,
  }) => {
    const newTemplateData = await getStateDataAsync(setTemplates);
    const headerTitle = await getStateDataAsync(setHeaderTitle);
    console.log(newTemplateData);
    let isListPResent = false;
    const currentTemplateState = await getStateDataAsync(setTemplates);
    const currentEditedState = await getStateDataAsync(setisEdited);
    currentTemplateState.map(t => {
      if (t.notes.length) {
        isListPResent = true;
      }
    });
    if (!isListPResent) {
      return;
    }
    setLoading(true);
    if (newTemplate) {
      // addNewTemplateApi({
      //   id,
      //   newTemplateData,
      //   headerTitle,
      // });
    } else if (currentEditedState) {
      editTemplateHandler({
        id,
        newTemplateData,
        headerTitle,
      });
    }
  };

  const editTemplateHandler = async ({id, newTemplateData, headerTitle}) => {
    let params = {
      templateId: id,
      items: newTemplateData.map(item => {
        return {
          ...item,
          notes: item.notes.map(element => {
            const obj = {
              note: element.note,
              tag: element.tag,
              isMarked: element.isMarked,
              createdBy: element?.createdBy || VARIABLES.user._id,
            };
            if (element.isMarked) {
              obj.markedBy = element?.markedBy || VARIABLES.user._id;
            }
            return obj;
            // return {
            //   note: element.note,
            //   tag: element.tag,
            //   isMarked: element.isMarked,
            //   createdBy: element.createdBy || VARIABLES.user._id,
            // };
          }),
          templateIcon: item.templateIcon,
        };
      }),
      name: headerTitle === '' ? 'Title' : headerTitle,
    };
    try {
      const resp = await API('user/templates1', 'PUT', {
        ...params,
      });
      if (resp.body.statusCode === 200) {
        EventRegister.emit('changeList');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  async function StoreLocalImage(imageUri, fileName) {
    // Request necessary permissions if needed (e.g., for Android)
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path
    console.log('picturesPath', picturesPath);

    const directoryPath = `${picturesPath}/CloserImages`; // Specify the name of your directory
    // const fileName = `image_${new Date().getTime()}.jpg`; // Generate a unique filename for each image

    // Check if the directory exists, and create it if it doesn't
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
      console.log('Directory created:', directoryPath);
    }

    const destinationPath = `${directoryPath}/${fileName}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(imageUri, destinationPath);
      console.log('Image uploaded Locally:', destinationPath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  }

  const addNewTodos = async ({setList}) => {
    if (!VARIABLES.toddosInfo?.isEdited) {
      return;
    }
    if (!VARIABLES.toddosInfo.id) {
      submitListHandler({
        list: VARIABLES.toddosInfo.list,
        headerTitle: VARIABLES.toddosInfo.headerTitle,
      });
    } else {
      editListHandler({
        list: VARIABLES.toddosInfo.list,
        headerTitle: VARIABLES.toddosInfo.headerTitle,
        id: VARIABLES.toddosInfo.id,
      });
    }
  };

  const submitListHandler = async ({list, headerTitle}) => {
    if (list.length === 0) {
      props.navigation.goBack();
      return;
    }
    const backendData = [];
    setLoading(true);
    await Promise.all(
      list.map(async (l, index) => {
        console.log(l);
        if (l.text_type === 'image' && l?.localImageData?.path) {
          console.log(l.localImageData);
          const multipleDetails = await uploadToS3BUCKET(
            l.localImageData.path,
            `${moment().format('x')}${l.localImageData.filename}`,
            l.localImageData.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(l.localImageData.path, filename);
          list[index].item = multipleDetails.response;
        }
      }),
    );
    list.map(l => {
      if (l.item.trim().length !== 0) {
        backendData.push(l);
      }
    });
    let params = {
      list: backendData.map(item => {
        const obj = {
          item: item.item,
          text_type: item.text_type,
          tags: item.tags,
          isChecked: item.isChecked,
        };
        if (item.isChecked) {
          obj.markedBy = item?.markedBy || VARIABLES.user._id;
        }
        return obj;
      }),
      title: headerTitle,
    };

    console.log('info-list', JSON.stringify(params));
    if (params.list.length === 0) {
      setLoading(false);
      // ToastMessage('Empty list can not be created.');
      return;
    }

    if (netInfo.isConnected === false) {
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    try {
      const resp = await API('user/ToDoList', 'POST', params);

      if (resp.body.statusCode === 200) {
        EventRegister.emit('changeList');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const editListHandler = async ({list, id, headerTitle}) => {
    setLoading(true);
    if (list.length === 0) {
      ToastMessage('Empty list can not be saved.');
      return;
    }
    await Promise.all(
      list.map(async (l, index) => {
        console.log(l);
        if (l.text_type === 'image' && l?.localImageData?.path) {
          console.log(l.localImageData);
          const multipleDetails = await uploadToS3BUCKET(
            l.localImageData.path,
            `${moment().format('x')}${l.localImageData.filename}`,
            l.localImageData.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(l.localImageData.path, filename);
          list[index].item = multipleDetails.response;
        }
      }),
    );

    let params = {
      listId: id,
      list: [],
      title: headerTitle === '' ? 'Title' : headerTitle,
    };

    list.map(item => {
      if (item.item) {
        const obj = {
          item: item.item,
          text_type: item.text_type,
          tags: item.tags,
          isChecked: item.isChecked,
          createdBy: item.createdBy,
        };
        if (item.isChecked) {
          obj.markedBy = item?.markedBy || VARIABLES.user._id;
        }
        params.list.push(obj);
      }
    });
    if (params.list.length === 0) {
      ToastMessage('Empty list can not be saved.');
      return;
    }
    console.log('info-template', params);

    if (netInfo.isConnected === false) {
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (params.list.length === 0) {
      setLoading(false);
      ToastMessage('Empty list can not be saved.');
      return;
    }

    try {
      const resp = await API('user/ToDoList', 'PUT', params);

      if (resp.body.statusCode === 200) {
        EventRegister.emit('changeList');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const Header = useMemo(() => {
    console.log('month inside usemoemo', month);
    return (
      <View style={{zIndex: 100}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={TEMPLATES}
          renderItem={templateItem}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{}}
          style={{
            height: scale(189),
          }}
        />
        {tooltipState === null && !VARIABLES.disableTouch && (
          <ExploreTemplatesTooltip
            onPress={() => {
              AsyncStorage.setItem('toolTipOrganise', '2');
              setTooltipState('2');
            }}
          />
        )}

        <View
          style={
            {
              //    marginHorizontal: scale(16),
            }
          }>
          <View style={styles.dateContainer}>
            <SelectDropdown
              dropdownOverlayColor={'transparent'}
              data={yearsBuffer}
              onSelect={(selectedItem, index) => {
                setYear(selectedItem?.value);
                if (month === 'All') {
                  onValueChange(
                    null,
                    moment(`January/${selectedItem.value}`, 'MMMM/YYYY'),
                  );
                } else {
                  onValueChange(
                    null,
                    moment(`${month}/${selectedItem.value}`, 'MMMM/YYYY'),
                  );
                }
              }}
              ref={yearRef}
              defaultButtonText={year}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              renderDropdownIcon={isOpened => {
                return !isOpened ? (
                  <DropDownBlueIconSvg />
                ) : (
                  <DropUpBlueIconSvg />
                );
              }}
              // dropdownOverlayColor='transparent'
              buttonStyle={styles.dropdown1BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              showsVerticalScrollIndicator={false}
            />
            <View style={{width: scale(12)}} />
            <SelectDropdown
              ref={monthRef}
              dropdownOverlayColor={'transparent'}
              data={items}
              onSelect={(selectedItem, index) => {
                setTimeout(async () => {
                  console.log(month, selectedItem);
                  let val;
                  setMonth(selectedItem.value);
                  if (selectedItem.value !== 'All') {
                    val = selectedItem.value;
                  } else {
                    val = moment(new Date()).format('YYYY');
                  }

                  const updatedYear = await getStateDataAsync(setYear);

                  onValueChange(
                    null,
                    moment(`${val}/${updatedYear}`, 'MMMM/YYYY'),
                  );
                }, 1);
              }}
              defaultButtonText={month}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                return item.label;
              }}
              renderDropdownIcon={isOpened => {
                return !isOpened ? (
                  <DropDownBlueIconSvg />
                ) : (
                  <DropUpBlueIconSvg />
                );
              }}
              // dropdownOverlayColor='transparent'
              buttonStyle={styles.dropdown2BtnStyle}
              buttonTextStyle={styles.dropdown1BtnTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdown1DropdownStyle}
              rowStyle={styles.dropdown1RowStyle}
              rowTextStyle={styles.dropdown1RowTxtStyle}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </View>
    );
  }, [month, year]);

  const EmptyData = () => {
    if (!loading) {
      return (
        <View
          style={{
            alignItems: 'center',
            marginVertical: 0,
            // marginVertical: loading ? 0 : scale(30),
            zIndex: -1,
          }}>
          {initialApiCall ? (
            <View style={{}}>
              <OrganiseLoader />
            </View>
          ) : (
            <View>
              <Image
                source={require('../../../assets/images/templates/emptyData.png')}
                style={{
                  width: SCREEN_WIDTH,
                  height: 226,
                  resizeMode: 'contain',
                }}
              />
              <Text style={styles.organiseListLabel}>
                {APP_STRING.organiseListLabel}
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  const LoadMoreData = () => {
    if (!endLimit && !footerLoader) {
      setFooterLoader(true);

      getOrganiseListHandler(page, moment(new Date()).format('YYYY-MM-DD'));
    } else {
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

  const refreshDataHandler = () => {
    // const selectedDate = moment();
    // console.log(selectedDate, 'tcfyvgubhinjokm');

    // setDate(selectedDate);
    // setDateInfo(selectedDate.format('YYYY-MM-DD'));

    setMonth('All');
    setYear(moment(new Date()).format('YYYY'));

    const eyarIndev = yearsBuffer.findIndex(
      m => m === moment(new Date()).format('YYYY'),
    );
    yearRef.current.selectIndex(eyarIndev);

    monthRef.current.selectIndex(0);
    // }

    getOrganiseListHandler(0, moment(new Date()).format('YYYY-MM-DD'));
  };

  return (
    <>
      <AppView
        scrollContainerRequired={false}
        refreshing={isRefreshing}
        handleRefresh={() => {
          onRefreshOrganise();
        }}
        shouldRefresh={true}>
        <OverlayLoader visible={loading && !initialApiCall} />

        <View>
          <Text
            style={{
              ...globalStyles.semiBoldLargeText,
              fontSize: scale(26),
              margin: scale(20),
              fontFamily: fonts.standardFont,

              lineHeight: 39,
            }}>
            Organise
          </Text>
        </View>
        {!isConnected ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LottieView
              style={{width: scale(400), height: scale(400)}}
              source={require('../../../assets/images/gifs/no_net.json')}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={{marginHorizontal: scale(16), flex: 1}}>
              <FlatList
                ListHeaderComponent={Header}
                ListHeaderComponentStyle={{zIndex: 100}}
                refreshing={refreshing}
                onRefresh={() => {
                  if (!loading) {
                    setEndLimit(false);
                    setPage(0);
                    refreshDataHandler();
                  }
                }}
                numColumns={2}
                onEndReached={LoadMoreData}
                ListFooterComponent={_renderFooter}
                //   onEndReachedThreshold={0.1}
                showsVerticalScrollIndicator={false}
                data={organiseList}
                keyExtractor={(item, index) => index}
                renderItem={renderItem}
                renderSectionHeader={({section: {title}}) => {
                  return (
                    <View style={{marginStart: 0, zIndex: 1, marginBottom: 4}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingLeft: 8,
                        }}>
                        <View
                          style={{
                            width: scale(8),
                            height: scale(8),
                            borderRadius: scale(4),
                            backgroundColor: colors.blue1,
                            zIndex: 100,
                            marginStart: -4,
                          }}
                        />
                        <View style={{marginLeft: 2}}>
                          <Text
                            style={{
                              ...globalStyles.semiBoldLargeText,
                              marginStart: scale(8),
                              fontWeight: '500',
                              marginTop: 2,
                            }}>
                            {getLabelForDate(title)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                contentContainerStyle={{
                  marginStart: 4,
                  zIndex: 1000,
                }}
                ListEmptyComponent={EmptyData}
              />
            </View>
          </View>
        )}
      </AppView>

      <>
        <View
          style={{
            position: 'absolute',
            end: scaleNew(16),
            bottom: scaleNew(16),
          }}>
          {tooltipState === '2' && (
            <OrganiseCreateNotesTooltip
              onPress={() => {
                AsyncStorage.setItem('toolTipOrganise', '3');
                setTooltipState('3');
              }}
            />
          )}
        </View>
      </>
      <FloatingAction
        showBackground={true}
        shadeColor={colors.white}
        shadow={{
          shadowOpacity: 0.2,
          elevation: 0,
        }}
        actions={action}
        onPressItem={name => {
          console.log(VARIABLES.disableTouch, 'gvjhbknlm');
          if (VARIABLES.disableTouch) {
            ToastMessage('Please add a partner to continue');
            return;
          }

          if (name === 'notes') {
            props.navigation.navigate('notes', {
              addNewNotes: addNewNotes,
            });
            setButtonEnabled(!buttonEnabled);
          } else {
            setButtonEnabled(!buttonEnabled);
            props.navigation.navigate('todos', {
              addNewTodos: addNewTodos,
            });
          }
        }}
        // tintColor="#ffffff"
        overlayColor={'rgba(0,0,0,0.8)'}
        color={'#fff'}
        iconColor={'#000'}
        //  render={renderFloatIcon}
        buttonSize={56}
        distanceToEdge={{
          horizontal: 15,
          vertical: 12,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  templateItemContainer: {
    backgroundColor: 'rgb(219, 230, 245)',
    alignSelf: 'baseline',
    borderRadius: scale(10),
    marginHorizontal: scale(10),
  },
  templateGradientIcon: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomHolderContainer: {
    width: scale(150),
    height: scale(45),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    marginTop: -8,
    zIndex: -1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scale(20),
  },
  dateSelectContainer: {
    backgroundColor: '#fff',
    borderRadius: scale(10),
    paddingHorizontal: scale(18),
    paddingVertical: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    ...globalStyles.regularLargeText,
    marginEnd: scale(8),
  },
  organiseListLabel: {
    ...globalStyles.regularLargeText,
    marginTop: scale(8),
    textAlign: 'center',
    marginHorizontal: scale(30),
    lineHeight: 26,
  },
  button: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.34,
    shadowRadius: 4.32,
    elevation: 3,
  },
  backgroundShadowContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    right: scale(20),
  },
  buttonWithLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'flex-end',
    marginBottom: scale(20),
  },
  buttonLabel: {
    ...globalStyles.regularMediumText,
    marginEnd: scale(12),
    color: '#fff',
  },
  dropdown1BtnStyle: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: scale(113),
    height: scale(36),
    justifyContent: 'center',
  },
  dropdown2BtnStyle: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    width: scale(160),
    height: scale(36),
    justifyContent: 'center',
  },
  dropdown1BtnTxtStyle: {
    ...globalStyles.regularLargeText,
    textAlignVertical: 'center',
    textAlign: 'left',
    marginTop: Platform.OS === 'android' ? 3 : 0,
    marginLeft: 5,
  },
  dropdown1RowStyle: {
    backgroundColor: colors.white,
    borderBottomColor: '#C5C5C5',
    height: scale(42),
  },
  dropdown1RowTxtStyle: {...globalStyles.regularLargeText},
  dropdown1DropdownStyle: {
    borderRadius: 8,
    marginTop: Platform.OS === 'android' ? -30 : 0,
  },

  tooltipViewMain: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.32,
    elevation: 3,
    zIndex: 100,
  },
  tooltipView: {
    backgroundColor: colors.white,
    width: scale(324),
    height: scale(108),
    borderRadius: scale(8),
    padding: scale(12),
    justifyContent: 'space-between',
    zIndex: 100,
  },
  titleTooltip: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.black,
    lineHeight: scale(19),
  },
  viewSpaceTooltip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textNumberTooltip: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: '#7C808B',
  },
  viewButtonTooltip: {
    backgroundColor: colors.blue1,
    borderRadius: 50,
    width: scale(108),
    height: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButtonTooltip: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.white,
  },
});
