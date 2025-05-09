/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import Slider from 'rn-range-slider';

import RadialGradient from 'react-native-radial-gradient';
import {colors} from '../../../styles/colors';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helpers';
import {fonts} from '../../../styles/fonts';
import {
  WellbeingNeutral,
  wellbeingPleasant,
  wellbeingUnpleasant,
  wellbeingVeryPleasant,
  wellbeingVeryUnPleasant,
} from '../../../utils/constants';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../styles/globalStyles';
import {scaleNew} from '../../../utils/metrics2';
import WellbeingEmotionTooltip from '../../../components/contextualTooltips/WellbeingEmotionTooltip';
import {
  ToastMessage,
  ToastMessageBottom,
} from '../../../components/toastMessage';
import TextArea from '../../../components/TextArea';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../../utils/contextualTooltips';
import {EventRegister} from 'react-native-event-listeners';
import {AddFeelingsCheck} from '../../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../../redux/actionTypes';
import OverlayLoader from '../../../components/overlayLoader';
import {
  HapticFeedback,
  HapticFeedbackHeavy,
} from '../../../utils/HapticFeedback';

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

export default function WellBeing(props) {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  const {showSafeView = true} = props;
  const [loading, setLoading] = useState(false);

  const [shareText, setShareText] = useState('');
  const [captionLength, setCaptionLength] = useState(0);

  const [low, setLow] = useState(50);
  const [emoji, setEmoji] = useState(thirdEmoji);
  const [slideToShowVisible, setSlideToShowVisible] = useState(true);

  const [moodArray, setMoodArray] = useState([]);
  const [selectionArr, setselectionArr] = useState([]);

  const renderThumb = () => {
    return (
      <View>
        <View style={styles.thumbContainer}>
          <Text style={{fontSize: scaleNew(28), color: '#000'}}>{emoji}</Text>
        </View>
      </View>
    );
  };

  const renderRail = useCallback(() => <View style={styles.rail} />, []);

  const renderRailSelected = useCallback(
    () => <View style={styles.railSelected} />,
    [],
  );

  const handleValueChange = useCallback(
    low => {
      setLow(low);
      if (low >= 0 && low < 12.5) {
        setEmoji(firstEmoji);
        if (emoji !== firstEmoji) {
          setselectionArr([]);
        }
        // animateFunc(0, 2, 116, -180);
      } else if (low >= 12.5 && low < 37.5) {
        setEmoji(secondEmoji);
        if (emoji !== secondEmoji) {
          setselectionArr([]);
        }
        //  animateFunc(25, 4, 156, -90);
      } else if (low >= 37.5 && low < 62.5) {
        setEmoji(thirdEmoji);
        if (emoji !== thirdEmoji) {
          setselectionArr([]);
        }
        //   animateFunc(50, 8, SCREEN_WIDTH - 200, 0);
      } else if (low >= 62.5 && low < 87.5) {
        setEmoji(fourthEmoji);
        if (emoji !== fourthEmoji) {
          setselectionArr([]);
        }
        //  animateFunc(75, 4, SCREEN_WIDTH - 160, 90);
      } else {
        setEmoji(fifthEmoji);
        if (emoji !== fifthEmoji) {
          setselectionArr([]);
        }
        //  animateFunc(100, 4, SCREEN_WIDTH - 80, 180);
      }
    },
    [emoji],
  );

  const getBackgroundColor = () => {
    if (low >= 0 && low < 12.5) {
      return [colors.wellBeingGradientBase, colors.wellBeingGradientOne];
    } else if (low >= 12.5 && low < 37.5) {
      return [colors.wellBeingGradientBase, colors.wellBeingGradientTwo];
    } else if (low >= 37.5 && low < 62.5) {
      return [colors.wellBeingGradientBase, colors.wellBeingGradientThree];
    } else if (low >= 62.5 && low < 87.5) {
      return [colors.wellBeingGradientBase, colors.wellBeingGradientFour];
    } else {
      return [colors.wellBeingGradientBase, colors.wellBeingGradientFive];
    }
  };

  useEffect(() => {
    if (emoji === firstEmoji) {
      setMoodArray(wellbeingVeryUnPleasant);
    } else if (emoji === secondEmoji) {
      setMoodArray(wellbeingUnpleasant);
    } else if (emoji === thirdEmoji) {
      setMoodArray(WellbeingNeutral);
    } else if (emoji === fourthEmoji) {
      setMoodArray(wellbeingPleasant);
    } else {
      setMoodArray(wellbeingVeryPleasant);
    }
  }, [emoji]);

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

  const onSubmit = async () => {
    if (selectionArr.length === 0) {
      ToastMessageBottom('Please select at least 1 emotion');
      return;
    }
    let data = {
      answer: shareText.trim(),
      text: emoji,
      mood: emoji,
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

  useEffect(() => {
    if (state.reducer.case === actions.ADD_FEELINGS_CHECK_SUCCESS) {
      console.log('state case moods wellbeing', state);
      props.navigation.popToTop();
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

  return (
    <>
      <OverlayLoader visible={loading} />

      <RadialGradient
        style={styles.radialGradient}
        colors={getBackgroundColor()}
        center={[SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2]}
        radius={SCREEN_WIDTH}>
        <View style={styles.flex}>
          <View style={styles.container}>
            {showSafeView && <SafeAreaView style={styles.safeArea} />}
            <View style={styles.backButtonContainer}>
              <Pressable onPress={() => props.navigation.goBack()}>
                <Image source={require('../../../assets/images/backNew.png')} />
              </Pressable>
              <Text style={styles.headerText}>I’m feeling..</Text>
              <Pressable
                style={{
                  opacity: 0,
                }}>
                <Image source={require('../../../assets/images/backNew.png')} />
              </Pressable>
            </View>

            <KeyboardAwareScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              disableScrollOnKeyboardHide
              style={styles.flex}>
              <Text style={styles.moodText}>{emoji}</Text>
              <View>
                <View style={styles.moodContainer}>
                  {moodArray.map(m => (
                    <MoodElement
                      text={m}
                      onPressSelection={changeSelection}
                      isSelected={!!selectionArr.find(s => s === m)}
                      bgc={COLOR_SET[emoji].textColor}
                    />
                  ))}
                  <WellbeingEmotionTooltip />
                </View>

                <View style={styles.viewTextInput}>
                  <TextArea
                    label=""
                    placeholderText="Share what might be causing you to feel this way..."
                    placeholderTextColor={'rgba(59, 59, 59, 0.35)'}
                    setVal={val => {
                      setShareText(val);
                      setCaptionLength(val.length);
                    }}
                    val={shareText}
                    maxLength={140}
                    inputHeight={scaleNew(89)}
                    textInputStyles={styles.textInput}
                  />
                </View>
                <View style={styles.captionView}>
                  <Text style={styles.captionText}>{captionLength}/140</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </KeyboardAwareScrollView>

            <View style={styles.bottomContainer}>
              <View style={styles.emojiContainer}>
                {[
                  firstEmoji,
                  secondEmoji,
                  thirdEmoji,
                  fourthEmoji,
                  fifthEmoji,
                ].map((e, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.emojiText,
                      index < 2 && styles.darkEmojiText,
                    ]}>
                    {e}
                  </Text>
                ))}
              </View>
              <View style={styles.sliderContainer}>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  low={low}
                  renderThumb={renderThumb}
                  renderRail={renderRail}
                  renderRailSelected={renderRailSelected}
                  onValueChanged={handleValueChange}
                  disableRange
                  onTouchStart={() => {}}
                  onTouchEnd={() => {
                    HapticFeedbackHeavy();
                    if (emoji !== thirdEmoji) {
                      setSlideToShowVisible(false);
                    }
                    const newLow =
                      low < 12.5
                        ? 0
                        : low < 37.5
                        ? 25
                        : low < 62.5
                        ? 50
                        : low < 87.5
                        ? 75
                        : 100;
                    setLow(newLow);
                  }}
                />
              </View>

              <View
                style={{
                  height: scaleNew(28),
                }}>
                {slideToShowVisible && (
                  <Text style={styles.swipeText}>
                    Swipe to select your mood!
                  </Text>
                )}
              </View>
            </View>
            <Pressable
              style={{
                ...styles.doneButton,
                backgroundColor:
                  selectionArr.length > 0
                    ? colors.blue1
                    : 'background: rgba(18, 70, 152, 0.2);',
              }}
              onPress={onSubmit}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </RadialGradient>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 0,
  },
  radialGradient: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingHorizontal: scaleNew(20),
  },
  backButtonContainer: {
    marginTop: scaleNew(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomContainer: {
    marginTop: scaleNew(20),
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleNew(16),
  },
  emojiText: {
    fontSize: scaleNew(28),
    opacity: 0.5,
    color: '#000',
  },
  darkEmojiText: {
    color: '#000',
  },
  sliderContainer: {
    backgroundColor: getColorCodeWithOpactiyNumber(colors.black, '10'),
    height: scaleNew(56),
    borderRadius: 100,
    marginTop: scaleNew(-46),
  },
  swipeText: {
    fontSize: scaleNew(12),
    color: 'rgba(59, 59, 59, 0.52)',
    textAlign: 'center',
    fontFamily: fonts.italicFont,
    marginTop: scaleNew(12),
  },
  doneButton: {
    alignSelf: 'center',
    marginTop: scaleNew(37),
    marginBottom: scaleNew(55),
    width: scaleNew(131),
    height: scaleNew(46),
    borderRadius: scaleNew(10),
    backgroundColor: colors.blue1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontFamily: fonts.semiBoldFont,
    fontSize: scaleNew(16),
    color: colors.white,
  },
  headerText: {
    fontSize: scaleNew(24),
    fontFamily: fonts.semiBoldFont,
    color: '#737373',
    textAlign: 'center',
  },
  moodText: {
    fontSize: scaleNew(31.3),
    fontFamily: fonts.semiBoldFont,
    color: '#000',
    textAlign: 'center',

    marginTop: scaleNew(16),
    marginBottom: scaleNew(28),
  },
  thumbContainer: {
    width: scaleNew(56),
    height: scaleNew(56),
    borderRadius: scaleNew(56),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: {
    borderRadius: 100,
    flex: 1,
    height: scaleNew(56),
    width: scaleNew(100),
  },
  railSelected: {
    borderRadius: 100,
    flex: 1,
    height: scaleNew(56),
  },
  divider: {
    marginTop: scaleNew(2),

    height: 1,
    backgroundColor: '#0000000A',
  },
  captionText: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(10),
    color: '#848996',
  },
  captionView: {
    alignItems: 'flex-end',
    //  marginEnd: scaleNew(16),
    marginBottom: scaleNew(10),
    marginTop: scaleNew(5),
  },
  textInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: scaleNew(16),
    fontFamily: fonts.regularFont,
    color: '#595959',
    //   paddingBottom: scaleNew(22),
    maxHeight: scaleNew(132),
    marginTop: 0,
  },
  viewTextInput: {
    borderRadius: scaleNew(6),
    backgroundColor: '#0000000A',
    marginTop: scaleNew(24),
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    zIndex: 100,
  },
});

const MoodElement = ({text, onPressSelection, isSelected, bgc}) => (
  <Pressable
    onPress={() => onPressSelection(text)}
    style={[
      styles.moodElement,
      {backgroundColor: isSelected ? bgc : '#0000000A'},
    ]}>
    <Text
      style={[
        styles.moodElementText,
        {color: isSelected ? '#fff' : '#595959'},
      ]}>
      {text}
    </Text>
  </Pressable>
);

const moodElementStyles = {
  moodElement: {
    paddingHorizontal: scaleNew(12),
    paddingVertical: scaleNew(8),
    marginBottom: scaleNew(12),
    borderRadius: 100,
    marginHorizontal: scaleNew(4),
  },
  moodElementText: {
    fontSize: scaleNew(16),
    fontFamily: fonts.standardFont,
    includeFontPadding: false,
  },
};

Object.assign(styles, moodElementStyles);
