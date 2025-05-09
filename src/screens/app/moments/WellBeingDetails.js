/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Pressable,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RadialGradient from 'react-native-radial-gradient';

import TextArea from '../../../components/TextArea';
import {APP_IMAGE} from '../../../utils/constants';
import {
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import {fonts} from '../../../styles/fonts';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import AppView from '../../../components/AppView';
import {useDispatch, useSelector} from 'react-redux';
import {AddFeelingsCheck} from '../../../redux/actions';
import {ToastMessage} from '../../../components/toastMessage';
import * as actions from '../../../redux/actionTypes';
import {scaleNew} from '../../../utils/metrics2';
import WellbeingEmotionTooltip from '../../../components/contextualTooltips/WellbeingEmotionTooltip';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../../utils/contextualTooltips';
import {EventRegister} from 'react-native-event-listeners';

const CleverTap = require('clevertap-react-native');

const IMAGE_SET = {
  '😡': APP_IMAGE.veryUnpleasent,
  '😵‍💫': APP_IMAGE.unpleasent,
  '😐': APP_IMAGE.neutral,
  '😊': APP_IMAGE.pleasent,
  '😇': APP_IMAGE.veryPleasent,
};

const COLOR_SET = {
  '😡': {
    background: '#FFECE4',
    textColor: '#F37948',
  },
  '😵‍💫': {
    background: '#FFF8F5',
    textColor: '#F79269',
  },
  '😐': {
    background: '#FFF9E9',
    textColor: '#E0C11E',
  },
  '😊': {
    background: '#F1F4FF',
    textColor: '#87A1FF',
  },
  '😇': {
    background: '#E4EBFF',
    textColor: '#5E80FA',
  },
};

const WellBeingDetails = ({route, navigation}) => {
  let {text, gradientColor, moodArr} = route.params;
  const dispatch = useDispatch();
  const state = useSelector(state => state);

  const [selectionArr, setselectionArr] = useState([]);
  const [loading, setLoading] = useState(false);

  const [shareText, setShareText] = useState('');
  const [captionLength, setCaptionLength] = useState(0);

  const changeSelection = selectedMood => {
    const index = selectionArr.findIndex(m => m === selectedMood);
    console.log(index);

    if (index !== -1) {
      // Item already selected, so remove it
      setselectionArr(selectionArr.filter(s => s !== selectedMood));
    } else {
      // Item not selected, check if we can add it
      if (selectionArr.length >= 2) {
        // Already 2 items selected, show an alert
        ToastMessage('You can only select up to 2 items.');
      } else {
        // Less than 2 items selected, add the new item
        setselectionArr(selected => [...selected, selectedMood]);
      }
    }
  };

  useEffect(() => {
    if (state.reducer.case === actions.ADD_FEELINGS_CHECK_SUCCESS) {
      console.log('state case moods wellbeing', state);
      navigation.popToTop();
      //  setMoodsDataSocket(state.reducer.feelingsCheck);
      setLoading(false);
      // dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_FEELINGS_CHECK_FAILURE) {
      setLoading(false);
      console.log('ERROR-FAILURE feelings', state);

      ToastMessage(state.reducer.message);

      //  dispatch(ClearAction());
    }
  }, [state]);

  const onSubmit = async () => {
    console.log('IMAGE_SET[text]', IMAGE_SET[text]);
    let data = {
      answer: shareText.trim(),
      text: text,
      mood: JSON.stringify(IMAGE_SET[text]),
      tags: selectionArr,
    };

    if (selectionArr.length > 0) {
      const tagsCommaSeparated = selectionArr.join(', ');
      CleverTap.recordEvent(`Emotion: ${tagsCommaSeparated}`);
    }

    CleverTap.recordEvent('Well-being card added');
    if (shareText.trim() !== '') {
      CleverTap.recordEvent('Well-being caption added');
    }

    const checkInAppReview = await checkContextualTooltip('inAppReviewShown');

    if (checkInAppReview === '0') {
      await updateContextualTooltipState('inAppReviewShown', '1');
    } else if (checkInAppReview === '1') {
      EventRegister.emit('inAppReviewShown');
      await updateContextualTooltipState('inAppReviewShown', '2');
    }
    setLoading(true);
    dispatch(AddFeelingsCheck(data));
  };

  return (
    <RadialGradient
      style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}
      colors={gradientColor}
      center={[SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2]}
      radius={SCREEN_WIDTH}>
      <AppView
        extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
        isLoading={loading}
        scrollContainerRequired={true}
        isScrollEnabled={true}
        customContainerStyle={{backgroundColor: 'transparent'}}>
        <View style={{flex: 1}}>
          <View style={{...styles.container}}>
            <View
              style={{
                marginTop: scaleNew(8),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Pressable onPress={() => navigation.goBack()}>
                <Image source={require('../../../assets/images/backNew.png')} />
              </Pressable>
            </View>
            <View style={{marginTop: scaleNew(24)}}>
              <Image
                source={IMAGE_SET[text]}
                style={{
                  alignSelf: 'center',
                  width: scaleNew(120),
                  height: scaleNew(120),
                }}
              />
              <Text
                style={{
                  marginTop: scaleNew(20),
                  textAlign: 'center',
                  fontSize: scaleNew(24),
                  fontFamily: fonts.semiBoldFont,
                  color: '#000',
                }}>
                {text}
              </Text>
            </View>
            <View
              style={{
                marginTop: scaleNew(16),
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                zIndex: 100,
              }}>
              {moodArr.map(m => (
                <MoodElement
                  text={m}
                  onPressSelection={changeSelection}
                  isSelected={!!selectionArr.find(s => s === m)}
                  bgc={COLOR_SET[text].textColor}
                />
              ))}
              <WellbeingEmotionTooltip />
            </View>
            <View
              style={{
                marginTop: scaleNew(16),
                marginBottom: scaleNew(24),
                height: 1,
                backgroundColor: '#0000000A',
              }}
            />
            <View
              style={{
                borderRadius: 6,
                backgroundColor: '#0000000A',
              }}>
              <TextArea
                label=""
                placeholderText="Share what might be causing you to feel this way..."
                placeholderTextColor={'#848A96'}
                setVal={val => {
                  setShareText(val);
                  setCaptionLength(val.length);
                }}
                val={shareText}
                maxLength={140}
                inputHeight={scaleNew(94)}
                textInputStyles={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  fontSize: scaleNew(16),
                  fontFamily: fonts.standardFont,
                  color: '#595959',
                  //   paddingBottom: scaleNew(22),
                  maxHeight: scaleNew(132),
                  marginTop: 0,
                }}
              />

              <View
                style={{
                  alignItems: 'flex-end',
                  //   marginTop: -scaleNew(20),
                  marginEnd: scaleNew(16),
                  marginBottom: scaleNew(10),
                }}>
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: scaleNew(10),
                    color: '#848996',
                  }}>
                  {captionLength}/140
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              marginHorizontal: scaleNew(18),
              marginBottom: scaleNew(60),
            }}>
            <Pressable
              onPress={() => {
                onSubmit();
              }}>
              <Image
                source={APP_IMAGE.next}
                style={{
                  width: scaleNew(40),
                  height: scaleNew(40),
                }}
              />
            </Pressable>
          </View>
        </View>
      </AppView>
    </RadialGradient>
  );
};

export default WellBeingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: scaleNew(12),
    paddingHorizontal: scaleNew(20),
    // zIndex: -1
  },
});

const MoodElement = ({text, onPressSelection, isSelected, bgc}) => {
  return (
    <Pressable
      onPress={() => onPressSelection(text)}
      style={{
        paddingHorizontal: scaleNew(12),
        paddingVertical: scaleNew(8),
        backgroundColor: isSelected ? bgc : '#0000000A',
        marginBottom: scaleNew(12),
        borderRadius: 100,
        marginHorizontal: scaleNew(4),
      }}>
      <Text
        style={{
          fontSize: scaleNew(16),
          fontFamily: fonts.standardFont,
          color: isSelected ? '#fff' : '#595959',
          includeFontPadding: false,
        }}>
        {text}
      </Text>
    </Pressable>
  );
};
