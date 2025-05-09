/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppView from '../../../components/AppView';
import CenteredHeader from '../../../components/centeredHeader';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import {globalStyles, SCREEN_WIDTH} from '../../../styles/globalStyles';
import {fonts} from '../../../styles/fonts';
import {colors} from '../../../styles/colors';
import ArrowRightIconSvg from '../../../assets/svgs/arrowRightIconSvg';
import CalendarIconSvg from '../../../assets/svgs/calendarIconSvg';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import RedCrossIconSvg from '../../../assets/svgs/redCrossIconSvg';
import {scale} from '../../../utils/metrics';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {ClearAction, EditProfile, GetUserProfile} from '../../../redux/actions';
import * as actions from '../../../redux/actionTypes';
import moment from 'moment';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AppButton from '../../../components/appButton';
import {APP_IMAGE, APP_STRING} from '../../../utils/constants';
import FirstPaginatorSvg from '../../../assets/svgs/onboarding/firstPaginatorSvg';
import SecondPaginatorSvg from '../../../assets/svgs/onboarding/secondPaginatorSvg';
import ThirdPaginatorSvg from '../../../assets/svgs/onboarding/thirdPaginatorSvg';
import FourthPaginatorSvg from '../../../assets/svgs/onboarding/fourthPaginatorSvg';

import CalendarPicker from 'react-native-calendar-picker';
import {VARIABLES} from '../../../utils/variables';
import {ToastMessage} from '../../../components/toastMessage';
import OverlayLoader from '../../../components/overlayLoader';

const CleverTap = require('clevertap-react-native');

export default function Personalise(props) {
  const {
    prevNavigatingScreen,
    editPersonalisation,
    topicsData = [],
    dateOfMeetData = [],
    relationTypeProp = '',
    relationshipDistProp = '',
  } = props?.route?.params;
  const {media} = props?.route?.params;

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [isVisiblePicker, setIsVisiblePicker] = useState(false);

  const [step, setStep] = useState(1);

  const [topics, setTopics] = useState([
    {
      id: 1,
      topic: 'Food',
      icon: APP_IMAGE.topicFood,
      selected: false,
    },
    {
      id: 2,
      topic: 'Travel',
      icon: APP_IMAGE.topicTravel,
      selected: false,
    },
    {
      id: 3,
      topic: 'Books',
      icon: APP_IMAGE.topicBooks,
      selected: false,
    },
    {
      id: 4,
      topic: 'Games',
      icon: APP_IMAGE.topicGames,
      selected: false,
    },
    {
      id: 5,
      topic: 'Pets',
      icon: APP_IMAGE.topicPets,
      selected: false,
    },
    {
      id: 6,
      topic: 'Content',
      icon: APP_IMAGE.topicContent,
      selected: false,
    },
    {
      id: 7,
      topic: 'Work',
      icon: APP_IMAGE.topicWork,
      selected: false,
    },
    {
      id: 8,
      topic: 'Shopping',
      icon: APP_IMAGE.topicShopping,
      selected: false,
    },
  ]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [stickerBucket, setStickerBucket] = useState([]);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [isEdited, setisEdited] = useState(false);
  const [relationshipType, setrelationshipType] = useState('');
  const [distanceType, setdistanceType] = useState('');

  const hideDatePicker = () => {
    setIsDatePickerVisible(false);
  };

  const handleConfirm = value => {
    const date = moment(value).format('YYYY-MM-DD');
    console.log('date--MOMENT', date);
    setDate(date);
    hideDatePicker();
    setisEdited(true);
  };

  const stepHandler = () => {
    if (step === 4) {
      // props.navigation.replace('App')
      UpdatePersonalise();
      // setStep(1)
    } else {
      console.log('steepp', step, date.length);
      if (step === 1) {
        if (date.length !== 10) {
          ToastMessage('Please enter a date');
          return;
        }
      }

      if (step === 2) {
        if (selectedTopics.length == 0) {
          ToastMessage('Please select atleast one topic');
          return;
        }
      }

      if (step === 3) {
        if (relationshipType?.length == 0) {
          ToastMessage('Please select a type');
          return;
        }
      }

      if (step === 4) {
        if (distanceType?.length == 0) {
          ToastMessage('Please select a type');
          return;
        }
      }

      setStep(step + 1);
    }
  };

  const goBackHandler = () => {
    if (prevNavigatingScreen === 'profile') {
      props.navigation.goBack();
      return;
    }
    if (step === 1) {
      props.navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const addFav = (item, index) => {
    if (selectedTopics.includes(item.topic)) {
      ToastMessage(`${item.topic} already added`);
      return;
    }
    setSelectedTopics(prev => [...prev, item.topic]);

    const updatedTopics = topics.map((item, idx) => {
      // return { ...item, selected: index === idx ? true : false }
      return index === idx
        ? {...item, selected: item.selected ? false : true}
        : {...item};
    });
    console.log('updatedTopics', updatedTopics);
    setTopics(updatedTopics);
    setisEdited(true);
  };

  const removeFav = (topic, index) => {
    console.log('topic', topic);
    const newTopicList = selectedTopics.filter(element => element !== topic);
    console.log('newTopicList', newTopicList);
    setSelectedTopics(newTopicList);

    const updatedTopics = topics.map((item, idx) => {
      // return { ...item, selected: index === idx ? true : false }
      return topic === item.topic
        ? {...item, selected: item.selected ? false : true}
        : {...item};
    });
    console.log('updatedTopics', updatedTopics);
    setTopics(updatedTopics);
    setisEdited(true);
  };

  const topicItem = ({item, index}) => {
    console.log('SELECTYED', item.selected);
    return (
      <Pressable
        style={{
          ...styles.itemContainer,
          backgroundColor: item.selected ? colors.red1 : '#fff',
        }}
        onPress={() => addFav(item, index)}>
        <Image
          source={item.icon}
          style={{width: scale(56), height: scale(56)}}
          resizeMode="center"
        />
        <Text
          style={{
            ...globalStyles.regularSmallText,
            marginTop: scale(4),
            // fontSize: scale(12)
          }}>
          {item.topic}
        </Text>
      </Pressable>
    );
  };

  const FooterInput = () => {
    return (
      <>
        <View style={{backgroundColor: colors.white, borderRadius: scale(10)}}>
          <View
            style={{
              ...styles.footerInputContainer,
              paddingTop: selectedTopics.length === 0 ? 0 : scale(8),
            }}>
            {selectedTopics &&
              selectedTopics.map((item, index) => (
                <View style={styles.selectedTopicContainer}>
                  <View
                    style={{
                      maxWidth: SCREEN_WIDTH - 100,
                    }}>
                    <Text
                      style={{
                        ...globalStyles.regularMediumText,
                        color: colors.red3,
                      }}
                      numberOfLines={1}>
                      {item}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 0.5,
                      height: scale(14),
                      marginLeft: 5,
                      marginRight: 2,
                      backgroundColor: 'rgba(0, 0, 0, 0.11)',
                    }}
                  />
                  <Pressable
                    hitSlop={15}
                    onPress={() => removeFav(item, index)}>
                    <RedCrossIconSvg />
                  </Pressable>
                </View>
              ))}

            {/* <TextInput
          placeholder="Add more here"
          placeholderTextColor={colors.grey9}
          // keyboardType='numeric'
          style={{...styles.textInput, minWidth: 100}}
          value={topic}
          onChangeText={text => setTopic(text)}
          // onBlur={onBlurEmail}
          autoCapitalize="none"
          onSubmitEditing={() => {
            if (topic.trim() === '') {
              ToastMessage('Please type something before adding.');
              return;
            }
            setSelectedTopics(prev => [...prev, topic]);
            setTopic('');
            setisEdited(true);
          }}
          returnKeyType="done"
          blurOnSubmit={false}
        /> */}
            {/* <Text style={{paddingVertical:scale(16),...globalStyles.regularMediumText,color:colors.grey9}}>Add more here</Text> */}
          </View>
          <TextInput
            placeholder="Type here to add more"
            placeholderTextColor={'#929292'}
            autoCapitalize="none"
            onSubmitEditing={() => {
              if (topic.trim() === '') {
                ToastMessage('Please type something before adding.');
                return;
              }
              setSelectedTopics(prev => [...prev, topic]);
              setTopic('');
              setisEdited(true);
            }}
            returnKeyType="done"
            blurOnSubmit={false}
            onChangeText={text => setTopic(text)}
            value={topic}
            style={styles.textInputView}
          />
        </View>
      </>
    );
  };

  const ITEM_WIDTH = SCREEN_WIDTH / 4 - scale(28); // 24 ===> HORIZONTAL MARGIN(16) + 8

  const selectionElement = ({item, setFunction, selectedVal}) => {
    console.log({selectedVal, item}, 'gvjhbknlm');
    return (
      <Pressable
        style={{
          //  paddingVertical: scale(24),
          paddingHorizontal: scale(16),
          backgroundColor: selectedVal === item ? colors.blue1 : colors.white,
          marginBottom: scale(22),
          borderRadius: scale(16),
          height: scale(75),
          justifyContent: 'center',
        }}
        onPress={() => {
          setisEdited(true);
          setFunction(item);
        }}>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scale(16),
            color: selectedVal === item ? colors.white : colors.text,
          }}>
          {item}
        </Text>
      </Pressable>
    );
  };

  const confirmLeave = () => {
    Alert.alert('Leave', 'Are you sure you want to leave?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => props.navigation.goBack()},
    ]);
  };

  const AppHeader = () => {
    if (prevNavigatingScreen === 'profile') {
      return (
        <CenteredHeader
          style={{
            paddingHorizontal: 0,
            paddingVertical: 0,
            paddingBottom: 0,
          }}
          leftIcon={<ArrowLeftIconSvg />}
          leftPress={goBackHandler}
        />
      );
    }
    return (
      <CenteredHeader
        style={{
          paddingHorizontal: 0,
          paddingVertical: 0,
          paddingBottom: 0,
        }}
        leftIcon={step === 1 ? null : <ArrowLeftIconSvg />}
        leftPress={goBackHandler}
        rightIcon={<DarkCrossIconSvg />}
        rightPress={() => {
          confirmLeave();
        }}
      />
    );
  };

  const BackMonthIcon = () => {
    return (
      <View>
        <Image source={APP_IMAGE.backMonth} style={{width: 100, height: 100}} />
      </View>
    );
  };

  const NextMonthIcon = () => {
    return (
      <Image source={APP_IMAGE.nextMonth} style={{width: 100, height: 100}} />
    );
  };

  const renderCustomArrowIcon = direction => {
    const iconName =
      direction === 'previous' ? 'chevron-back' : 'chevron-forward';
    return (
      <Image
        source={
          direction === 'previous' ? APP_IMAGE.backMonth : APP_IMAGE.nextMonth
        }
        style={{width: 20, height: 20}}
      />
    );
  };

  const onDateChange = date => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setDate(formattedDate);
    setIsVisiblePicker(false);
    console.log(formattedDate);
    setisEdited(true);
    // this.setState({
    //   selectedStartDate: date,
    // });
  };

  useEffect(() => {
    if (editPersonalisation === 1) {
      setStep(1);
      setDate(dateOfMeetData);
      topics.forEach(topic => {
        if (topicsData.includes(topic.topic)) {
          topic.selected = true;
        }
      });
      setTopics(topics);
      setSelectedTopics(topicsData);
      setrelationshipType(relationTypeProp);
      setdistanceType(relationshipDistProp);
    }
  }, []);

  // useEffect(() => {
  //   if (editPersonalisation === 1) {
  //     setStep(1);
  //     setDate(dateOfMeetData);
  //   } else if (editPersonalisation === 2) {
  //     console.log('topicsData', topicsData);

  //     topics.forEach(topic => {
  //       if (topicsData.includes(topic.topic)) {
  //         topic.selected = true;
  //       }
  //     });
  //     setTopics(topics);
  //     setSelectedTopics(topicsData);
  //     setStep(2);
  //   } else if (editPersonalisation === 3) {
  //     setrelationshipType(relationTypeProp);
  //     setStep(3);
  //   } else if (editPersonalisation === 4) {
  //     setdistanceType(relationshipDistProp);
  //     setStep(4);
  //   }
  // }, []);

  const UpdatePersonalise = () => {
    let params = {
      profilePic: media,
      dateOfMeet: date,
      favTopics: selectedTopics,
      relationshipDistance: distanceType,
      relationshipStatus: relationshipType,
    };

    const params2 = {
      dateOfMeet: date,
      favTopics: selectedTopics,
      relationshipDistance: distanceType,
      relationshipStatus: relationshipType,
      partnerName: VARIABLES.user?.partnerData?.partner?.name,
    };

    // Remove keys with empty values
    Object.keys(params2).forEach(key => {
      if (
        params2[key] === '' ||
        params2[key] === null ||
        params2[key] === undefined ||
        (Array.isArray(params2[key]) && params2[key].length === 0)
      ) {
        delete params2[key];
      }
    });

    CleverTap.profileSet(params2);

    console.log('info params2', params2);

    if (prevNavigatingScreen === 'profile') {
      switch (step) {
        case 1:
          if (date.length == 0 && date.length !== 10) {
            ToastMessage('Please select a date');
            return;
          }
          break;
        case 2:
          if (selectedTopics.length == 0) {
            ToastMessage('Please select atleast one topic');
            return;
          }
          break;
        case 3:
          if (relationshipType?.length == 0) {
            ToastMessage('Please select a type');
            return;
          }
          break;
        case 4:
          if (distanceType?.length == 0) {
            ToastMessage('Please select a type');
            return;
          }
          break;
        default:
          break;
      }
    }

    if (!netInfo.isConnected) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
    setLoading(true), dispatch(EditProfile(params)); // api calling through redux-saga
  };

  useEffect(() => {
    console.log('user-profile=data', state);
    if (state.reducer.case === actions.EDIT_PROFILE_SUCCESS) {
      dispatch(GetUserProfile());
      setLoading(false);
      // alert('Registered Successfully');
      if (prevNavigatingScreen === 'personaliseOnboard') {
        props.navigation.replace('App');
      } else {
        props.navigation.goBack();
      }
      // VARIABLES.user = state.userData
      // props.navigation.navigate('addProfilePic')
      VARIABLES.user = state.reducer.userData;
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_PROFILE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      // alert(state.message)
      dispatch(ClearAction());
    }
  }, [state]);

  const prevProfileSaveButton = () => {
    return (
      <AppButton
        disabled={!isEdited}
        text={'Save Changes'}
        style={{
          marginVertical: 32,
          zIndex: -1,
          backgroundColor: isEdited ? colors.blue1 : colors.blueInactive,
        }}
        onPress={UpdatePersonalise}
      />
    );
  };

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

    setisEdited(true);
  };

  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        //     header={AppHeader}
      >
        <OverlayLoader visible={loading} />
        <View
          style={{
            flex: 1,
            ...globalStyles.apphorizontalSpacing,
            zIndex: -1,
            marginTop: scale(10),
          }}>
          <View
            style={{
              backgroundColor: colors.red2,
              borderRadius: scale(27),
              flex: 1,
              paddingHorizontal: scale(12),
              paddingVertical: scale(16),
            }}>
            <AppHeader />
            <View
              style={{
                height: scale(140),
                justifyContent: 'center',
                paddingBottom: scale(16),
              }}>
              <Text
                style={{
                  ...globalStyles.titleLabel,
                  // marginHorizontal: scale(40),
                  // marginBottom: scale(30),
                  marginTop: step === 1 ? scale(52) : scale(24),
                }}>
                {step === 1
                  ? `When did you both first meet?`
                  : step === 2
                  ? APP_STRING.personaliseLabelFour
                  : step === 3
                  ? 'What is the status of\nyour relationship?'
                  : 'Where do you both live?'}
              </Text>
            </View>
            {step === 1 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  //   marginBottom: SCREEN_WIDTH / 2.5,
                  zIndex: -1,
                }}>
                <Image
                  style={{alignSelf: 'center'}}
                  source={require('../../../assets/images/firstMeetIcon.png')}
                />
                <View style={{marginTop: scale(90)}}>
                  <TextInput
                    placeholder="DD-MM-YYYY"
                    placeholderTextColor={'#929292'}
                    keyboardType="numeric"
                    onChangeText={handleDateChange}
                    value={date}
                    style={styles.textInputView}
                    onBlur={() => {
                      // Extract the day, month, and year from the date
                      const [day, month, year] = date.split('-').map(Number);

                      // Check if the year is between 2000 and the current year
                      const currentYear = new Date().getFullYear();
                      if (year < 2000 || year > currentYear) {
                        alert(`Year must be between 2000 and ${currentYear}`);
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
                </View>

                {prevNavigatingScreen === 'profile' && prevProfileSaveButton()}
              </View>
            ) : step === 2 ? (
              <>
                <View>
                  <FlatList
                    data={topics}
                    renderItem={topicItem}
                    keyExtractor={(item, index) => item.id}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    numColumns={4}
                    style={{...styles.itemList, marginTop: 0}}
                    // ListFooterComponent={FooterInput}
                    // keyboardShouldPersistTaps='handled'
                  />
                </View>
                {FooterInput()}
                {prevNavigatingScreen === 'profile' && prevProfileSaveButton()}
              </>
            ) : step === 3 ? (
              <>
                <FlatList
                  data={['Not sure', 'Dating', 'Engaged', 'Married']}
                  renderItem={({item}) => {
                    return selectionElement({
                      item,
                      setFunction: setrelationshipType,
                      selectedVal: relationshipType,
                    });
                  }}
                  showsVerticalScrollIndicator={false}
                  style={{...styles.itemList, marginTop: 0}}
                  ListFooterComponent={() => {
                    if (prevNavigatingScreen === 'profile') {
                      return prevProfileSaveButton();
                    } else {
                      <View />;
                    }
                  }}
                />
              </>
            ) : step === 4 ? (
              <FlatList
                data={[
                  'Same house',
                  'Same city',
                  'Different cities, in India',
                  'Different cities, outside India',
                  'Different countries',
                ]}
                renderItem={({item}) => {
                  return selectionElement({
                    item,
                    setFunction: setdistanceType,
                    selectedVal: distanceType,
                  });
                }}
                showsVerticalScrollIndicator={false}
                style={{...styles.itemList, marginTop: 0}}
                ListFooterComponent={() => {
                  if (prevNavigatingScreen === 'profile') {
                    return prevProfileSaveButton();
                  } else {
                    <View />;
                  }
                }}
              />
            ) : (
              <View />
            )}
          </View>
          <View style={{height: scale(150), marginTop: scale(12)}}>
            {(prevNavigatingScreen === 'personaliseOnboard' ||
              prevNavigatingScreen === 'moments') && (
              <View style={styles.bottomContainer}>
                {step === 1 ? (
                  <FirstPaginatorSvg />
                ) : step === 2 ? (
                  <SecondPaginatorSvg />
                ) : step === 3 ? (
                  <ThirdPaginatorSvg />
                ) : (
                  <FourthPaginatorSvg />
                )}

                <Pressable
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: scale(-4),
                  }}
                  onPress={stepHandler}>
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      color: colors.blue1,
                      fontSize: scale(18),
                      includeFontPadding: false,
                      marginEnd: 2,
                    }}>
                    {step === 4 ? 'Get Started' : 'Next'}
                  </Text>
                  <ArrowRightIconSvg />
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </AppView>
    </>
  );
}

const styles = StyleSheet.create({
  contactLabel: {
    ...globalStyles.regularMediumText,
    marginStart: scale(16),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: scale(30),
    /// position: 'absolute',
    //  bottom: scale(108),
    width: '100%',

    // zIndex: 100,
    paddingStart: scale(20),
    // backgroundColor: 'red'
    // marginTop: 12,
    // marginVertical: 30,
    // marginHorizontal: 26
  },
  itemList: {
    marginTop: scale(18),
    // flex: 1,
    zIndex: -1,
  },
  itemContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: scale(10),
    marginBottom: scale(22),
    // borderWidth:1,
  },
  footerInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    // paddingVertical: 16,
    paddingHorizontal: scale(16),
    // backgroundColor: colors.red2,
    borderRadius: scale(10),
  },
  textInput: {
    flex: 1,
    // marginHorizontal: 16,
    paddingVertical: scale(16),
    // paddingHorizontal: 0,
    // height: 16,
    // fontSize: 16,
    // fontFamily: fonts.regularFont,
    // fontWeight: '500',
    ...globalStyles.regularMediumText,
    // color: colors.text,
    // backgroundColor: 'red',
    padding: 0,
    margin: 0,
  },
  selectedTopicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(20),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    backgroundColor: colors.red4,
    marginEnd: scale(12),
    marginTop: scale(12),
  },
  textInputView: {
    backgroundColor: colors.white,
    height: scale(55),
    borderRadius: scale(10),
    paddingHorizontal: scale(16),
    fontFamily: fonts.lightFont,
    fontSize: scale(16),
    includeFontPadding: false,
  },
});
