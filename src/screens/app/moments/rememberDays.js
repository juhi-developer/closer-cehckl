import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import CornerHeader from '../../../components/cornerHeader';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import AppView from '../../../components/AppView';
import DropDownBlueIconSvg from '../../../assets/svgs/dropDownBlueIconSvg';
import {colors} from '../../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import {APP_IMAGE} from '../../../utils/constants';

import Timeline from 'react-native-timeline-flatlist';
import NotesIconSvg from '../../../assets/svgs/notesIconSvg';
import SquareBoxCheckedSvg from '../../../assets/svgs/squareBoxCheckedSvg';
import SquareBoxUncheckedSvg from '../../../assets/svgs/squareBoxUncheckedSvg';
import RadioCheckedSvg from '../../../assets/svgs/radioCheckedSvg';
import RadioUncheckedSvg from '../../../assets/svgs/radioUncheckedSvg';
import AppButton from '../../../components/appButton';
import {scale, verticalScale} from '../../../utils/metrics';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import MonthPicker from 'react-native-month-year-picker';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  ClearAction,
  Logout,
  EditProfile,
  Backup,
  AddEvent,
  EditEvent,
  GetEvents,
  DeleteEvent,
  GetSpecialEvent,
} from '../../../redux/actions';
import {VARIABLES, regEmail} from '../../../utils/variables';
import {removeData, setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';

import {useKeyboard} from '@react-native-community/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {ToastMessage} from '../../../components/toastMessage';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import DropUpBlueIconSvg from '../../../assets/svgs/dropUpBlueIconSvg';
import SelectDropdown from 'react-native-select-dropdown';
import {fonts} from '../../../styles/fonts';
import TooltipModal from '../../../components/Modals/TooltipModal';

const CleverTap = require('clevertap-react-native');

export default function RememberDays(props) {
  const {navigation} = props;
  const insets = useSafeAreaInsets();
  const currentYear = new Date().getFullYear();

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  // const [selectedYear, setSelectedYear] = useState('')
  const inputRef = useRef(null);
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const [yearOpen, setYearOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [items, setItems] = useState([
    {label: 'All', value: 'All'},
    {label: 'January', value: 'january'},
    {label: 'February', value: 'february'},
    {label: 'March', value: 'march'},
    {label: 'April', value: 'april'},
    {label: 'May', value: 'may'},
    {label: 'June', value: 'june'},
    {label: 'July', value: 'july'},
    {label: 'August', value: 'august'},
    {label: 'September', value: 'september'},
    {label: 'October', value: 'october'},
    {label: 'November', value: 'november'},
    {label: 'December', value: 'december'},
  ]);

  const [eventId, setEventId] = useState('');
  const [eventIndex, setEventIndex] = useState(false);
  const [eventItem, setEventItem] = useState(null);

  const [toolTipModalVisible, setToolTipModalVisible] = useState(false);

  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSpecialEvent, setIsSpecialEvent] = useState(false);
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [filterDate, setFilterDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [eventTime, setEventTime] = useState([
    {id: 1, label: 'Daily', value: 'Daily', selected: true},
    {id: 2, label: 'Weekly', value: 'Weekly on Monday', selected: false},
    {id: 3, label: 'Monthly', value: 'Monthly', selected: false},
    {id: 4, label: 'Yearly', value: 'Yearly', selected: false},
  ]);

  const startYear = 2010;
  const endYear = 2100;
  const years = Array.from({length: endYear - startYear + 1}, (_, index) => ({
    label: (startYear + index).toString(),
    value: (startYear + index).toString(),
  }));
  // const years = Array.from({length: 2100 - currentYear + 1}, (_, index) => ({
  //   label: (currentYear + index).toString(),
  //   value: (currentYear + index).toString(),
  // }));

  const onYearOpen = useCallback(() => {
    setYearOpen(false);
  }, []);

  const onMonthOpen = useCallback(() => {
    setMonthOpen(false);
  }, []);

  const [yearsBuffer, setYearsBuffer] = useState(years);

  const [eventData, setEventData] = useState([]);

  // const DATA =[
  //     {day:'22',month:'Nov',message:'It’s Jane’s bday!!',type:'1',dotColor:colors.blue1},
  //     {day:'25',month:'Nov',message:'Our Anniversary',type:'1',dotColor:colors.blue1},
  //     {day:'01',month:'Nov',message:'Joe’s BDAY!!',type:'1',dotColor:colors.blue1},
  //     {day:'22',month:'Nov',message:'It’s Jane’s bday!!',type:'2',dotColor:'#79C09F'},
  //     {day:'25',month:'Nov',message:'It’s Jane’s bday!!',type:'3',dotColor:'#D7899F'},
  //     {day:'01',month:'Nov',message:'It’s Jane’s bday!!',type:'4',dotColor:'#C9AE62'}
  // ]

  // const style1=['#CBF2E0', '#F9E4AB','#E4B8C5','#96B6E4']
  // const style2=['#EDFAF4', '#EDFAF4','#EDFAF4','#EDFAF4']
  // const style3=['#FAE5EB', '#FAE5EB','#FAE5EB','#FAE5EB']
  // const style4=['#FFEAAF', '#FFEAAF','#FFEAAF','#FFEAAF']

  const showPicker = useCallback(value => setShow(value), []);

  const onValueChange = (event, newDate) => {
    const selectedDate = newDate || filterDate;

    showPicker(false);
    setFilterDate(selectedDate);
    // setDateInfo(moment(selectedDate).format('YYYY-MM-DD'));
    // getOrganiseListHandler(moment(selectedDate).format('YYYY-MM-DD'))

    let params = {
      month: moment(selectedDate).format('MMMM'),
      year: moment(selectedDate).format('YYYY'),
    };
    console.log(netInfo.isConnected, 'ycftvubhiunjo');
    if (!netInfo.isConnected) {
      alert(
        `Network issue :( 1 ${netInfo.isConnected}`,
        'Please Check Your Network !',
      );
      return;
    }

    setLoading(true), dispatch(GetEvents(params));

    setYear(moment(selectedDate).format('YYYY'));
    setMonth(moment(selectedDate).format('MMMM'));
  };

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  // const snapPoints = useMemo(() => [`70%`, `56%`,], []);
  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(180),
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(180),
    ],
    [],
  ); // + 70 when recurring event & - 20 when special
  const snapPointsSpecial = useMemo(
    () => [
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(40),
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(40),
    ],
    [],
  );
  const snapPointsChecks = useMemo(
    () => [
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(70),
      SCREEN_WIDTH + BOTTOM_SPACE + insets.bottom + scale(70),
    ],
    [],
  );

  const largeSnapPoints = useMemo(
    () => [
      SCREEN_WIDTH > 375 ? SCREEN_HEIGHT / 1.1 : SCREEN_HEIGHT / 1.07,
      SCREEN_WIDTH > 375 ? SCREEN_HEIGHT / 1.1 : SCREEN_HEIGHT / 1.07,
    ],
    [],
  );

  const [isInputFocused, setisInputFocused] = useState(false);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current.present();
    setSheetEnabled(true);
  }, []);
  const handleSheetChanges = useCallback(index => {
    // console.log('handleSheetChanges', index);
    if (index === -1) {
      setDate('');
      setTitle('');
      setIsVisiblePicker(false);
      setisInputFocused(false);
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

  const timeHandler = (item, index) => {
    const newTime = eventTime.map((item, idx) => {
      return index === idx
        ? {...item, selected: true}
        : {...item, selected: false};
    });

    setEventTime(newTime);
  };

  const onDateChange = date => {
    setisInputFocused(false);
    setIsVisiblePicker(false);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setDate(formattedDate);
    setIsVisiblePicker(false);
    console.log(formattedDate);
    // this.setState({
    //   selectedStartDate: date,
    // });
  };

  // Function to check if there are already two events on the same date in the array
  const hasTwoEventsOnSameDate = (array, newEvent) => {
    const count = array.reduce((acc, event) => {
      if (
        event.item.date === newEvent.date &&
        event.item.isSpecialEvent &&
        newEvent.specialEvent
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return count >= 2;
  };

  // Function to add a new event to the array if it doesn't violate the rule
  const addEventToArray = (array, newEvent) => {
    console.log('array to send', JSON.stringify(array), 'new event', newEvent);
    if (hasTwoEventsOnSameDate(array, newEvent)) {
      alert('Two special events already exist on the same date.');
    } else {
      bottomSheetModalRef.current.dismiss();
      // array.push(newEvent);
      console.log('Event added successfully.', newEvent);
      // if (!netInfo.isConnected) {
      //   alert('Network issue :( 2', 'Please Check Your Network !');
      //   return;
      // }

      setLoading(true), dispatch(AddEvent(newEvent)); // api calling through redux-saga
    }
  };

  const AppHeader = () => {
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
            }}>
            Days to remember
          </Text>
        }
        rightIcon={
          <Image source={APP_IMAGE.addCircularBorder} style={styles.icon} />
        }
        rightPress={() => {
          if (VARIABLES.disableTouch) {
            ToastMessage('Please add a partner to continue');
            return;
          }
          handlePresentModalPress();
          setTimeout(() => {
            inputRef.current.focus();
            setisInputFocused(true);
          }, 800);
        }}
        // titleStyle={styles.headerTitleStyle}
      />
    );
  };

  const renderItem = (rowData, sectionId, rowId) => {
    // console.log('itemmmm,,',rowData);

    const editEvent = () => {
      console.log('ITEMM--', rowData, sectionId);
      setEventId(rowData.item._id);
      setEventIndex(sectionId);

      setTitle(rowData.item?.title);
      let formattedDate = rowData.item?.date;
      // Check if the date is in the format YYYY-MM-DD
      const isYearFirst = /^\d{4}-\d{2}-\d{2}$/.test(formattedDate);

      if (isYearFirst) {
        // If the date is in the format YYYY-MM-DD, convert it to DD-MM-YYYY
        formattedDate = formattedDate.split('-').reverse().join('-');
      }

      setDate(formattedDate);
      setIsRecurring(rowData.item?.recurring?.isReccuring);
      setIsSpecialEvent(rowData.item?.isSpecialEvent);
      if (rowData.item?.recurring?.isRecurring) {
        handleSelect(rowData.item?.recurring?.type);
      }

      // const updateEventObj={  // locally updated when edit action is performed
      //     day:moment(rowData.item?.date).format('DD'),
      //     month:moment(rowData.item?.date).format('MMM'),
      //     title:rowData.item?.title,
      //     type:rowData.item?.isSpecialEvent ? 'special' : 'normal',
      //     dotColor:rowData.item.isSpecialEvent ? colors.blue1 : '#79C09F',
      //     colors:rowData?.item.isSpecialEvent ? ['#CBF2E0', '#F9E4AB','#E4B8C5','#96B6E4'] : ['#EDFAF4', '#EDFAF4','#EDFAF4','#EDFAF4'],
      //     item:rowData.item
      // }

      setEventItem(rowData.item);

      setSheetEnabled(true);
      bottomSheetModalRef.current.present();
    };

    const handleSelect = label => {
      const updatedEventTime = eventTime.map(time => ({
        ...time,
        selected: time.label === label,
      }));

      setEventTime(updatedEventTime);
    };
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center', marginVertical: 8}}
        onPress={() => {
          if (rowData.item?.createdBy === VARIABLES.user._id) {
            editEvent();
          }
        }}>
        {/* <View style={{
                    // position:'absolute',
                    alignItems:'center',
                    justifyContent:'center',
                    flexDirection:'row',
                    // marginEnd:8
                    // left:-20
                }}>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.headerTitleStyle}>02</Text>
                        <Text style={{...globalStyles.regularSmallText,fontSize:10}}>Nov</Text>
                    </View>
                    <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.blue1,
                        marginHorizontal:8
                    }} />
                </View> */}
        {rowData.type === 'special' ? (
          <ImageBackground
            source={APP_IMAGE.gradientEventBg}
            style={styles.itemContainer}
            borderRadius={10}>
            <Text
              style={{...globalStyles.regularMediumText, fontSize: scale(18)}}>
              {rowData?.title}
            </Text>
            {rowData.item?.createdBy === VARIABLES.user._id && (
              <Pressable
                onPress={() => {
                  setEventId(rowData.item._id);
                  confirmDeleteEvent(rowData.item._id);
                }}>
                <Image
                  source={APP_IMAGE.trashBlue}
                  style={{
                    width: scale(24),
                    height: scale(24),
                    marginEnd: scale(10),
                  }}
                />
              </Pressable>
            )}
          </ImageBackground>
        ) : (
          <View
            style={{
              ...styles.itemContainer,
              backgroundColor: rowData?.item?.color,
            }}
            // colors={rowData?.colors[0]}
            // colors={rowData.type==='spacial' ? style1 : rowData.type==='2' ? style2 : rowData.type==='3' ? style3 : style4 }
            // start={{ x: 0, y: 1 }}
            // end={{ x: 1, y: 0 }}
          >
            <Text
              style={{...globalStyles.regularMediumText, fontSize: scale(18)}}>
              {rowData?.title}
            </Text>
            {/* {rowData.type==='special' ? 
                    <Image
                        source={{ uri: APP_IMAGE.userImage }}
                        style={styles.otherUserImage}
                    />
                    :
                    <Image
                        source={APP_IMAGE.trashBlue}
                        style={{width:scale(24),height:scale(24),marginVertical:4}}
                    />
                    } */}
            {rowData.item?.createdBy === VARIABLES.user._id && (
              <Pressable
                onPress={() => {
                  setEventId(rowData.item._id);
                  confirmDeleteEvent(rowData.item._id);
                }}>
                <Image
                  source={APP_IMAGE.trashBlue}
                  style={{
                    width: scale(24),
                    height: scale(24),
                    marginEnd: scale(10),
                  }}
                />
              </Pressable>
            )}
          </View>
        )}
      </Pressable>
    );
  };

  const itemSeparatorComponent = () => {
    return (
      <View
        style={{
          // height: 1.5,
          // backgroundColor: strokeColor,
          // width: '100%',
          marginVertical: 16,
        }}
      />
    );
  };

  const renderTime = (rowData, sectionId, rowId) => {
    return (
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Text
          style={styles.headerTitleStyle}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {rowData?.day}
        </Text>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            includeFontPadding: false,
            marginTop:
              Platform.OS === 'ios' ? -verticalScale(10) : -verticalScale(18),
          }}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {rowData?.month}
        </Text>
      </View>
    );
  };

  const renderCircleItem = (rowData, sectionId, rowId) => {
    const dotColor = generateNextColor();
    return (
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: rowData.item?.color,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'absolute',
          left: SCREEN_WIDTH > 375 ? scale(52) : scale(53),
          // marginTop:38
          // alignSelf:'baseline'
        }}
      />
    );
  };

  const AddEventHandler = () => {
    if (title === '') {
      alert('Please enter title');
      return;
    } else if (date === '') {
      alert('Please enter event date');
      return;
    }

    const [day, month, year] = date.split('-').map(Number);

    // Check if the year is between 2010 and 2100
    if (year < 2010 || year > 2100) {
      alert('Year must be between 2010 and 2100');
      setDate('');
      return;
    }

    // Check if the month is between 1 and 12
    if (month < 1 || month > 12) {
      alert('Month must be between 1 and 12');
      setDate('');
      return;
    }

    // Check if the day is between 1 and 31
    if (day < 1 || day > 31) {
      alert('Day must be between 1 and 31');
      setDate('');
      return;
    }

    // Additional check for months with less than 31 days
    if (month === 2 && day > 29) {
      alert('February cannot have more than 29 days');
      setDate('');
      return;
    } else if ([4, 6, 9, 11].includes(month) && day > 30) {
      alert('This month cannot have more than 30 days');
      setDate('');
      return;
    }
    let formattedDate = date.split('-').reverse().join('-');

    let params = {
      title: title,
      date: formattedDate,
      recurring: isRecurring,
      specialEvent: isSpecialEvent,
      type: eventTime.filter(item => item.selected)[0].label.toLowerCase(),
    };

    if (!isRecurring) {
      delete params.type;
    }

    console.log('dateeeeeeee', formattedDate, date);
    addEventToArray(eventData, params);
  };

  const updateEventHandler = () => {
    if (title === '') {
      alert('Please enter title');
      return;
    } else if (date === '') {
      alert('Please enter event date');
      return;
    }

    const [day, month, year] = date.split('-').map(Number);

    // Check if the year is between 2010 and 2100
    if (year < 2010 || year > 2100) {
      alert('Year must be between 2010 and 2100');
      setDate('');
      return;
    }

    // Check if the month is between 1 and 12
    if (month < 1 || month > 12) {
      alert('Month must be between 1 and 12');
      setDate('');
      return;
    }

    // Check if the day is between 1 and 31
    if (day < 1 || day > 31) {
      alert('Day must be between 1 and 31');
      setDate('');
      return;
    }

    // Additional check for months with less than 31 days
    if (month === 2 && day > 29) {
      alert('February cannot have more than 29 days');
      setDate('');
      return;
    } else if ([4, 6, 9, 11].includes(month) && day > 30) {
      alert('This month cannot have more than 30 days');
      setDate('');
      return;
    }

    bottomSheetModalRef.current.dismiss();
    let params = {
      eventId: eventId,
      title: title,
      date: date,
      recurring: isRecurring,
      specialEvent: isSpecialEvent,
      type: eventTime.filter(item => item.selected)[0].label.toLowerCase(),
    };

    if (!isRecurring) {
      delete params.type;
    }
    // Check if the date is in the format YYYY-MM-DD
    const isYearFirst = /^\d{4}-\d{2}-\d{2}$/.test(date);

    // Parse the date with the correct format
    const parsedDate = moment(date, isYearFirst ? 'YYYY-MM-DD' : 'DD-MM-YYYY');

    setYear(parsedDate.format('YYYY'));
    setMonth(parsedDate.format('MMMM'));
    setSelectedMonth(parsedDate.format('MMMM'));

    const monthIndex = items.findIndex(
      m => m === moment(new Date()).format('MMMM'),
    );
    const yearIndex = yearsBuffer.findIndex(
      m => m === moment(new Date()).format('YYYY'),
    );
    yearRef.current.selectIndex(yearIndex);
    monthRef.current.selectIndex(monthIndex);
    setLoading(true), dispatch(EditEvent(params)); // api calling through redux-saga
  };

  const deleteEventHandler = eventId => {
    let params = {
      id: eventId,
    };

    if (!netInfo.isConnected) {
      alert('Network issue :( 5', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteEvent(params)); // api calling through redux-saga
  };

  const confirmDeleteEvent = id => {
    Alert.alert('Delete Event', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteEventHandler(id)},
    ]);
  };

  const baseColors = ['#EDFAF4', '#FAE5EB', '#FFEAAF'];

  let currentIndex = 0;

  // Function to generate the next color in the cyclic series
  const generateNextColor = () => {
    const currentColor = baseColors[currentIndex];
    currentIndex = (currentIndex + 1) % baseColors.length;
    return currentColor;
  };

  const stateHandler = async () => {
    if (state.reducer.case === actions.ADD_EVENT_SUCCESS) {
      if (VARIABLES.momentsToolTipKey) {
        setTimeout(() => {
          setToolTipModalVisible(true);
        }, 2000);
      }
      CleverTap.recordEvent('Total events added');
      setLoading(false);
      setTitle('');
      setData('');
      setIsRecurring(false);

      // alert('Event added successfully')
      if (moment(new Date()).format('MMMM') === month) {
        ToastMessage('Event added successfully');
      }
      let params = {
        month: month,
        year: year,
      };

      setLoading(true), dispatch(GetEvents(params));
      if (isSpecialEvent) {
        CleverTap.recordEvent('Special events added');
        dispatch(GetSpecialEvent());
      }
      setIsSpecialEvent(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_EVENT_FAILURE) {
      alert(state.reducer.message);
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_EVENT_SUCCESS) {
      setEventId('');
      setEventIndex(0);

      setTitle('');
      setData('');
      setIsRecurring(false);
      setIsSpecialEvent(false);

      let params = {
        month: month,
        year: year,
      };

      setLoading(true), dispatch(GetEvents(params));

      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_EVENT_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_EVENT_SUCCESS) {
      // const prevEvents = [...eventData]
      const updateEvents = eventData.filter(
        item => item?.item?._id !== eventId,
      );
      console.log('AFTER DELETE', updateEvents);

      setEventData(updateEvents);
      setEventId('');
      setLoading(false);
      dispatch(GetSpecialEvent());
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_EVENT_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_EVENT_SUCCESS) {
      console.log('state eventsss', JSON.stringify(state.reducer.events));
      const formattedEvents = state.reducer.events?.map(item => {
        const nextColor = generateNextColor();

        // Check if the date is in the format YYYY-MM-DD
        const isYearFirst = /^\d{4}-\d{2}-\d{2}$/.test(item.date);

        // Parse the date with the correct format
        const date = moment(
          item.date,
          isYearFirst ? 'YYYY-MM-DD' : 'DD-MM-YYYY',
        );

        return {
          day: date.format('DD'),
          month: date.format('MMM'),
          title: item.title,
          type: item.isSpecialEvent ? 'special' : 'normal',
          dotColor: item.isSpecialEvent ? colors.blue1 : '#79C09F',
          colors: item.isSpecialEvent
            ? ['#CBF2E0', '#F9E4AB', '#E4B8C5', '#96B6E4']
            : [nextColor, nextColor, nextColor, nextColor],
          item: item,
        };
      });
      console.log('state formattedEvents', JSON.stringify(formattedEvents));
      setEventData(formattedEvents);

      setLoading(false);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.GET_EVENT_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      dispatch(ClearAction());
    }
  };

  useEffect(() => {
    stateHandler();
  }, [state]);

  useEffect(() => {
    setMonth('All');
    setYear(moment(new Date()).format('YYYY'));

    setSelectedMonth('All');

    let params = {
      month: 'All',
      year: moment(new Date()).format('YYYY'),
    };

    console.log('PARAMS DATEEE-', params);

    // if (!netInfo.isConnected) {
    //     alert('Network issue :(', 'Please Check Your Network !');
    //     return;
    // }

    setLoading(true), dispatch(GetEvents(params));
  }, []);

  let focusedStyle = {
    height: scale(50),
    flex: 1,
    padding: 0,
    margin: 0,

    ...globalStyles.semiBoldMediumText,
  };
  let unFocusedStyle = {
    // paddingVertical: scale(14),
    flex: 1,
    padding: 0,
    margin: 0,
    height: scale(50),
    ...globalStyles.regularLargeText,
    fontFamily: fonts.standardFont,
  };

  let placeholderStyle = {
    fontFamily: fonts.regularFont,
  };

  // console.log('height',Platform.OS,SCREEN_HEIGHT);

  const handleDateChange = text => {
    // Remove all non-digits and extra dashes
    let newText = text.replace(/[^\d-]/g, '');

    // Split the text by dashes and remove empty parts
    let parts = newText.split('-').filter(part => part !== '');

    // Reconstruct the text with proper dashes
    newText = parts.join('-');
    if (parts.length === 1 && parts[0].length > 2) {
      newText = parts[0].slice(0, 2) + '-' + parts[0].slice(2);
    } else if (parts.length === 2 && parts[1].length > 2) {
      newText = parts[0] + '-' + parts[1].slice(0, 2) + '-' + parts[1].slice(2);
    }

    // Limit the length to 10 characters (DD-MM-YYYY)
    newText = newText.slice(0, 10);

    // Update state
    setDate(newText);
  };

  return (
    <View // if input container stays at bottom
      style={{flex: 1}}
      // behavior={Platform.OS === 'ios' ? 'padding' : null}
      // keyboardVerticalOffset={keyboardHeight}
    >
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        isLoading={loading}
        header={AppHeader}>
        <View style={styles.dateContainer}>
          <SelectDropdown
            ref={yearRef}
            dropdownOverlayColor={'transparent'}
            data={yearsBuffer}
            onSelect={(selectedItem, index) => {
              console.log(month, selectedItem);
              let params = {
                month: selectedMonth,
                year: selectedItem.value,
              };
              setSelectedYear(selectedItem.value);

              setLoading(true);
              dispatch(GetEvents(params));
              // onValueChange(
              //     null,
              //     moment(`${month}/${selectedItem.value}`, 'MMMM/YYYY'),
              // );
            }}
            defaultButtonText={year}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.label;
            }}
            rowTextForSelection={(item, index) => {
              return item.label;
            }}
            renderDropdownIcon={isOpened => {
              return isOpened ? <DropUpBlueIconSvg /> : <DropDownBlueIconSvg />;
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
              console.log(month, selectedItem);
              let params = {
                month: selectedItem.value,
                year: selectedYear,
              };
              setSelectedMonth(selectedItem.value);

              setLoading(true);
              dispatch(GetEvents(params));
              // onValueChange(
              //     null,
              //     moment(`${selectedItem.value}/${year}`, 'MMMM/YYYY'),
              // );
            }}
            defaultButtonText={month}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.label;
            }}
            rowTextForSelection={(item, index) => {
              return item.label;
            }}
            renderDropdownIcon={isOpened => {
              return isOpened ? <DropUpBlueIconSvg /> : <DropDownBlueIconSvg />;
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
          {/* <DropDownPicker
                        showTickIcon={false}
                        open={yearOpen}
                        value={selectedYear}
                        items={yearsBuffer}
                        setOpen={setYearOpen}
                        setValue={setSelectedYear}
                        onChangeValue={(e)=>{
                            console.log('ACTIONN',e)
                            let params={
                                month:selectedMonth,
                                year:e
                            }

                            console.log('PARSMSS',e);
                            
                        }}
                        setItems={setYearsBuffer}
                        style={{
                            width:90,
                            zIndex:2,
                            minHeight:36,
                            borderColor:'#fff'
                        }}
                        containerStyle={{
                            zIndex:99,
                            width:90,
                            marginHorizontal:16,
                            marginEnd:10
                        }}
                        dropDownContainerStyle={{
                            width:90,
                            zIndex:1,
                            borderColor:'#fff',
                        }}
                        placeholder='2023'
                        ArrowDownIconComponent={()=>{
                            return(
                                <DropDownBlueIconSvg />
                            )
                        }}
                        ArrowUpIconComponent={()=>{
                            return(
                                <DropUpBlueIconSvg />
                            )
                        }}
                    /> */}
          {/* <Pressable 
                        style={{ ...styles.dateSelectContainer, marginEnd: scale(12) }}
                        onPress={()=>showPicker(true)}
                        >
                        <Text style={styles.date}>{year}</Text>
                        <DropDownBlueIconSvg />
                    </Pressable> */}
          {/* <Pressable 
                        style={styles.dateSelectContainer}
                        onPress={()=>showPicker(true)} 
                        >
                        <Text style={styles.date}>{month}</Text>
                        <DropDownBlueIconSvg />
                    </Pressable> */}
          {/* <DropDownPicker
                        listMode='SCROLLVIEW'
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                        open={monthOpen}
                        setOpen={setMonthOpen}
                        value={selectedMonth}
                        items={items}
                        setValue={setSelectedMonth}
                        setItems={setItems}
                        showTickIcon={false}
                        style={{
                            width:126,
                            zIndex:2,
                            minHeight:36,
                            borderColor:'#fff'
                        }}
                        containerStyle={{
                            zIndex:99,
                            width:112
                        }}
                        dropDownContainerStyle={{
                            width:126,
                            zIndex:1,
                            borderColor:'#fff',
                        }}
                        placeholder={month}
                        ArrowDownIconComponent={()=>{
                            return(
                                <DropDownBlueIconSvg />
                            )
                        }}
                        ArrowUpIconComponent={()=>{
                            return(
                                <DropUpBlueIconSvg />
                            )
                        }}
                        onChangeValue={(e)=>{
                            console.log('ACTIONN',e)
                            let params={
                                month:e,
                                year:selectedYear
                            }

                            console.log('PARSMSS',e);
                            
                        }}
                    /> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: scale(16),
            marginTop: scale(26),
            flex: 1,
            zIndex: -1,
          }}>
          {eventData.length > 0 ? (
            <Timeline
              data={eventData}
              renderDetail={renderItem}
              renderCircle={renderCircleItem}
              lineWidth={1}
              lineColor={colors.red4}
              renderTime={renderTime}
              timeContainerStyle={{minWidth: 50}}
              renderFullLine={true}
              eventContainerStyle={{zIndex: -1}}
              style={{zIndex: -1}}
            />
          ) : (
            <>
              {!loading && (
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      ...globalStyles.semiBoldLargeText,
                      textAlign: 'center',
                    }}>
                    Create a special day for{' '}
                    {VARIABLES.user?.partnerData?.partner?.name}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={
            isInputFocused
              ? largeSnapPoints
              : isRecurring
              ? snapPoints
              : snapPointsSpecial
          }
          onChange={handleSheetChanges}
          backgroundStyle={{
            backgroundColor: colors.primary,
          }}
          style={{paddingHorizontal: scale(16)}}
          keyboardBehavior="interactive">
          <BottomSheetScrollView scrollEnabled={false}>
            <Text
              style={{
                ...globalStyles.semiBoldMediumText,
                textAlign: 'center',
                fontSize: scale(20),
                marginTop: scale(8),
                fontFamily: fonts.standardFont,
              }}>
              Add a special day
            </Text>
            <View
              style={{...styles.inputContainer, backgroundColor: colors.red2}}>
              <TextInput
                ref={inputRef}
                onFocus={() => {
                  setIsVisiblePicker(false);
                  setisInputFocused(true);
                }}
                onBlur={() => {
                  setisInputFocused(false);
                }}
                placeholder="Add Title"
                placeholderTextColor={colors.grey9}
                style={
                  !title ? [unFocusedStyle, placeholderStyle] : unFocusedStyle
                }
                //   style={unFocusedStyle}
                value={title}
                onChangeText={text => {
                  setTitle(text);
                }}
                maxLength={20}
                // autoFocus
              />
            </View>

            {isInputFocused ? (
              <View style={{alignItems: 'flex-end', marginTop: scale(12)}}>
                <Text style={{...globalStyles.regularSmallText}}>
                  {title.length}/20
                </Text>
              </View>
            ) : (
              <View style={{marginVertical: 6}} />
            )}
            <TextInput
              placeholder="DD-MM-YYYY"
              placeholderTextColor={'#929292'}
              keyboardType="numeric"
              onChangeText={handleDateChange}
              value={date}
              style={styles.textInputView}
              onFocus={() => {
                setisInputFocused(true);
              }}
              onBlur={() => {
                setisInputFocused(false);

                // Extract the day, month, and year from the date
                const [day, month, year] = date.split('-').map(Number);

                // Check if the year is between 2010 and 2100
                if (year < 2010 || year > 2100) {
                  alert('Year must be between 2010 and 2100');
                  setDate('');
                  return;
                }

                // Check if the month is between 1 and 12
                if (month < 1 || month > 12) {
                  alert('Month must be between 1 and 12');
                  setDate('');
                  return;
                }

                // Check if the day is between 1 and 31
                if (day < 1 || day > 31) {
                  alert('Day must be between 1 and 31');
                  setDate('');
                  return;
                }

                // Additional check for months with less than 31 days
                if (month === 2 && day > 29) {
                  alert('February cannot have more than 29 days');
                  setDate('');
                  return;
                } else if ([4, 6, 9, 11].includes(month) && day > 30) {
                  alert('This month cannot have more than 30 days');
                  setDate('');
                  return;
                }
              }}
            />

            {/* <View
              style={{
                backgroundColor: colors.red2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: scale(10),
                paddingHorizontal: scale(16),
                borderRadius: scale(10),
                marginTop: scale(8),
              }}>
              {date === '' ? (
                <Text
                  style={{
                    ...globalStyles.regularLargeText,
                    color: colors.grey9,
                  }}>
                  Add Date
                </Text>
              ) : (
                <Text
                  style={{
                    ...globalStyles.semiBoldMediumText,
                    // color: colors.grey9,
                  }}>
                  {moment(date).format('DD-MM-YYYY')}
                </Text>
              )}
              <Pressable
                hitSlop={30}
                onPress={() => {
                  setIsVisiblePicker(!isVisiblePicker);
                }}>
                <NotesIconSvg />
              </Pressable>
            </View> */}
            <View
              style={{
                marginTop: scale(32),
                zIndex: -1,
              }}>
              <View style={{flexDirection: 'row', alignContent: 'center'}}>
                <Pressable onPress={() => setIsRecurring(!isRecurring)}>
                  {isRecurring ? (
                    <SquareBoxCheckedSvg />
                  ) : (
                    <SquareBoxUncheckedSvg />
                  )}
                </Pressable>
                <View style={{marginStart: scale(21)}}>
                  <Text
                    style={{
                      ...globalStyles.regularLargeText,
                      fontSize: scale(18),
                      includeFontPadding: false,
                    }}>
                    Recurring Event
                  </Text>
                  {isRecurring && (
                    <View>
                      <Text
                        style={{
                          ...globalStyles.regularMediumText,
                          includeFontPadding: false,
                          marginVertical: scale(4),
                        }}>
                        We will notify you & your partner :)
                      </Text>
                      {eventTime.map((item, index) => (
                        <Pressable
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: scale(10),
                          }}
                          onPress={() => timeHandler(item, index)}>
                          {item.selected ? (
                            <RadioCheckedSvg />
                          ) : (
                            <RadioUncheckedSvg />
                          )}
                          <Text
                            style={{
                              ...globalStyles.regularMediumText,
                              marginStart: scale(12),
                            }}>
                            {item.value}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  marginTop: scale(24),
                  flex: 1,
                }}>
                <Pressable onPress={() => setIsSpecialEvent(!isSpecialEvent)}>
                  {isSpecialEvent ? (
                    <SquareBoxCheckedSvg />
                  ) : (
                    <SquareBoxUncheckedSvg />
                  )}
                </Pressable>
                <View style={{flex: 1, marginStart: scale(21)}}>
                  <Text
                    style={{
                      ...globalStyles.regularLargeText,
                      fontSize: scale(18),
                    }}>
                    Mark as a Special Event
                  </Text>
                  {isSpecialEvent && (
                    <Text
                      style={{
                        ...globalStyles.regularMediumText,
                        flex: 1,
                        marginVertical: scale(4),
                      }}>
                      (This will show up as a fun banner in moments on this
                      day!)
                    </Text>
                  )}
                </View>
              </View>

              <AppButton
                text="Save"
                style={{
                  marginTop: scale(14),
                  backgroundColor: title === '' ? colors.red2 : colors.blue1,
                }}
                textStyle={{color: title === '' ? colors.grey9 : '#fff'}}
                onPress={eventId === '' ? AddEventHandler : updateEventHandler}
              />
            </View>
          </BottomSheetScrollView>

          {isVisiblePicker && (
            <View
              style={{
                position: 'absolute',
                top: scale(200),
                right: -10,
                backgroundColor: '#fff',
                zIndex: 100,
              }}>
              <CalendarPicker
                onDateChange={onDateChange}
                width={280}
                previousTitle="<"
                nextTitle=">"
              />
            </View>
          )}
        </BottomSheetModal>
      </AppView>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={filterDate}
          // minimumDate={new Date()}
          // maximumDate={new Date(2025, 5)}
          // locale="ko"
        />
      )}
      {sheetEnabled && (
        <Pressable
          style={globalStyles.backgroundShadowContainer}
          onPress={() => {
            setSheetEnabled(false);
            setTitle('');
            setDate('');
            bottomSheetModalRef.current.dismiss();
          }}
        />
      )}

      <TooltipModal
        stepCount={5}
        title="You just added your first special date!"
        modalVisible={toolTipModalVisible}
        setModalVisible={setToolTipModalVisible}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    // backgroundColor:'red',
    // width:300
    alignItems: 'center',
    marginHorizontal: scale(16),
    marginTop: scale(16),
    // position:'absolute',
    // // top:60
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
  otherUserImage: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
  },
  itemContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(24),
    color: colors.blue1,
    width: scale(34),
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(20),
    marginTop: scale(30),
  },
  icon: {
    width: scale(28),
    height: scale(28),
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
    marginTop: Platform.OS === 'android' ? -scale(36) : 0,
  },
  textInputView: {
    backgroundColor: colors.red2,
    color: colors.text,
    height: scale(47),
    borderRadius: scale(10),
    paddingHorizontal: scale(16),
    fontFamily: fonts.standardFont,
    fontSize: scale(16),
    includeFontPadding: false,
    marginTop: scale(16),
  },
});
