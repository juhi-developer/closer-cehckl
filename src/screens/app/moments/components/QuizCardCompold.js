/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {APP_IMAGE, MOMENT_KEY} from '../../../../utils/constants';
import {scale} from '../../../../utils/metrics';
import {fonts} from '../../../../styles/fonts';
import MomentComment from '../../../../components/MomentComment';
import {AWS_URL_S3} from '../../../../utils/urls';
import {globalStyles} from '../../../../styles/globalStyles';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {ToastMessage} from '../../../../components/toastMessage';
import {VARIABLES} from '../../../../utils/variables';
import {colors} from '../../../../styles/colors';
import {useNetInfo} from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {AddAnswerQa} from '../../../../redux/actions';
import ProfileImageGradient from './ProfileImageGradient';

import ViewShot from 'react-native-view-shot';
import {shareUrlImageStory} from '../../../../utils/helpers';
import ChoiceGradientButton from './ChoiceGradientButton';
import {useAppContext} from '../../../../utils/VariablesContext';
import {scaleNew} from '../../../../utils/metrics2';
const CleverTap = require('clevertap-react-native');

export default function QuizCardComp({
  addComment,
  askPartnerInput,
  setAskPartnerInput,
  navigation,
  dataSourceCords,
  disabled,
  loading,
  setLoading,
  QnAData,
  hornyMode,
}) {
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  // const {hornyMode} = useAppContext();
  const ref = useRef();

  const [takeScreenshot, setTakeScreenshot] = useState(false);

  const quesType = QnAData?.type;

  const cardColor = QnAData?.colorcode;
  let titleColor,
    descriptionColor,
    buttonColor,
    bottomBg,
    bgColor,
    archiveColor;

  switch (cardColor) {
    case 'green':
      titleColor = colors.golden;
      descriptionColor = colors.warmWhite;
      buttonColor = colors.quizTextGreen;
      bottomBg = colors.commentBgQuiz;
      bgColor = colors.greenBgQuiz;
      archiveColor = colors.quizTextGreen;
      break;
    case 'golden':
      titleColor = colors.greenBgQuiz;
      descriptionColor = colors.lightBlack;
      buttonColor = '#E1AE5C';
      bottomBg = '#FCD18A';
      archiveColor = '#E1AE5C';
      bgColor = '#FDC56B';
      break;
    case 'orange':
      titleColor = colors.warmWhite;
      descriptionColor = colors.lightBlack;
      buttonColor = '#CD875F';
      archiveColor = '#CD875F';
      bottomBg = '#F8B88F';

      bgColor = '#F8A271';
      break;
    case 'pink':
      titleColor = colors.greenBgQuiz;
      descriptionColor = colors.lightBlack;
      buttonColor = '#DAB7AF';
      archiveColor = '#DAB7AF';
      bottomBg = '#FCDFD4';

      bgColor = '#FDD8D0';
      break;
    default:
      titleColor = colors.golden;
      descriptionColor = colors.warmWhite;
      buttonColor = colors.quizTextGreen;
      archiveColor = colors.quizTextGreen;
      bottomBg = colors.commentBgQuiz;

      bgColor = colors.greenBgQuiz;
  }

  if (hornyMode) {
    bgColor = '#3C1859';
    descriptionColor = 'rgba(189, 189, 189, 1)';
    buttonColor = '#4D2777';
    bottomBg = 'rgb(86, 48, 138)';
    titleColor = 'rgba(224, 224, 224, 1)';
    archiveColor = 'rgba(224, 224, 224, 1)';
  }

  const questypeComment = QnAData?.type === 'comment';
  let hasBothAnswered;
  if (quesType === 'choice') {
    hasBothAnswered =
      QnAData?.user2?.choice !== undefined &&
      QnAData?.user1?.choice !== undefined;
  } else {
    hasBothAnswered =
      QnAData?.user2?.answer !== undefined &&
      QnAData?.user1?.answer !== undefined;
  }

  let quiz = QnAData;
  let isAnswered = false;
  let isPartnerAnswered = false;
  let isBothAnswered = false;

  useEffect(() => {
    // on mount
    if (takeScreenshot === true) {
      ref.current.capture().then(uri => {
        shareUrlImageStory({
          image: uri,
        }).finally(res => {
          CleverTap.recordEvent('Quiz cards shared');

          setTakeScreenshot(false);
        });
      });
    }
    setTimeout(() => {
      setTakeScreenshot(false);
    }, 1000);
  }, [takeScreenshot]);

  if (quiz?.user1?.id) {
    if (quiz?.user1?.id === VARIABLES.user?._id) {
      isAnswered =
        quiz?.user1?.answer === VARIABLES.user?._id ? 'user' : 'partner';
    } else {
      isPartnerAnswered =
        quiz?.user1?.answer === VARIABLES.user?._id ? 'user' : 'partner';
    }
  }

  if (quiz?.user2?.id) {
    if (quiz?.user2?.id === VARIABLES.user?._id) {
      isAnswered =
        quiz?.user2?.answer === VARIABLES.user?._id ? 'user' : 'partner';
    } else {
      isPartnerAnswered =
        quiz?.user2?.answer === VARIABLES.user?._id ? 'user' : 'partner';
    }
  }
  if (isAnswered && isPartnerAnswered) {
    isBothAnswered = true;
  }

  let answer = '';

  const userAnswer =
    QnAData?.type === 'option'
      ? QnAData?.user1?.answer
      : QnAData?.user1?.choice;
  const partnerAnswer =
    QnAData?.type === 'option'
      ? QnAData?.user2?.answer
      : QnAData?.user2?.choice;

  if (userAnswer !== undefined && partnerAnswer !== undefined) {
    if (userAnswer === partnerAnswer) {
      answer = 'Amazing! You both think alike!';
    } else {
      answer = 'Oops, both of you think differently!';
    }
  } else {
    if (partnerAnswer !== undefined) {
      answer = `${VARIABLES.user?.partnerData?.partner?.name} has answered!`;
    } else if (userAnswer !== undefined) {
      answer = 'You have answered!';
    }
  }

  const handlePressChoice = choice => {
    if (disabled) {
      return;
    }
    if (VARIABLES.disableTouch) {
      ToastMessage('Please add a partner to continue');
      return;
    }
    if (QnAData?.user1?.choice === undefined) {
      let data = {choice: choice, type: hornyMode ? 'Horny' : 'QnA'};
      if (!netInfo.isConnected) {
        ToastMessage('Network issue :(', 'Please Check Your Network !');
        return;
      }
      setLoading(true);
      if (hornyMode) {
        CleverTap.recordEvent('Hm Quiz answered: Yes No');
        CleverTap.recordEvent('Hm quiz cards answered');
        CleverTap.recordEvent('Quiz cards answered');
        CleverTap.recordEvent('Quiz answered: Yes No');
      }
      dispatch(AddAnswerQa(data));
    }
  };

  return (
    <Pressable
      onLayout={event => {
        dataSourceCords[MOMENT_KEY.quiz] = event.nativeEvent.target;
      }}
      key={MOMENT_KEY.quiz}
      onPress={() => {
        if (questypeComment) {
          navigation.navigate('commentsQnA', {
            item: QnAData,
            disabled: disabled,
            input: askPartnerInput,
          });
        }
      }}
      style={styles.pressableContainer}>
      <ViewShot
        ref={ref}
        options={{
          fileName: `Archieve ${Date.now()}`,
          format: 'jpg',
          quality: 0.9,
        }}>
        <View style={{...styles.cardContainer, backgroundColor: bgColor}}>
          {quesType === 'choice' && (
            <Image
              style={{
                position: 'absolute',
                end: -4,
                top: -4,
                tintColor: buttonColor,
                opacity: 0.4,
              }}
              source={require('../../../../assets/images/questionMark.png')}
            />
          )}

          {quesType !== 'comment' && (
            <Image
              style={{
                position: 'absolute',
                start: 0,
                top: 0,
                tintColor: buttonColor,
                opacity: 0.4,
              }}
              source={require('../../../../assets/images/questionMark3.png')}
            />
          )}

          {quesType === 'option' && (
            <Image
              style={{
                position: 'absolute',
                end: -4,
                top: -4,
                tintColor: buttonColor,
                opacity: 0.4,
              }}
              source={require('../../../../assets/images/commentQuizShape4.png')}
            />
          )}

          {quesType === 'comment' && (
            <Image
              style={{
                position: 'absolute',
                start: 0,
                top: scale(30),
                tintColor: buttonColor,
                opacity: 0.4,
              }}
              source={require('../../../../assets/images/commentQuizShape.png')}
            />
          )}

          {quesType === 'option' && (
            <Image
              style={{
                position: 'absolute',
                start: scale(28),
                bottom: scale(0),
                tintColor: buttonColor,
                opacity: 0.4,
              }}
              source={require('../../../../assets/images/commentQuizShape3.png')}
            />
          )}

          {hasBothAnswered && quesType !== 'comment' && !takeScreenshot && (
            <Pressable
              onPress={() => {
                setTakeScreenshot(true);
              }}
              hitSlop={30}
              style={styles.viewScreenshot}>
              <Image
                source={require('../../../../assets/images/screenshotQuiz.png')}
              />
            </Pressable>
          )}
          {quesType === 'comment' ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.titleText, {color: titleColor}]}>
                Couch Conversations
              </Text>
              <Text
                style={{
                  ...styles.titleText,
                  marginTop:
                    Platform.OS === 'ios' ? -scaleNew(1) : -scaleNew(2),
                }}>
                {' '}
                🛋️
              </Text>
            </View>
          ) : (
            <Text style={[styles.titleText, {color: titleColor}]}>
              Quiz Time!
            </Text>
          )}
          <Text
            style={{
              ...styles.questionText,
              color: descriptionColor,
              // minHeight: scaleNew(24),
              //     marginBottom: scaleNew(24),
            }}>
            {QnAData?.question}
          </Text>

          {quesType === 'comment' ? (
            <View
              style={{
                marginTop: scaleNew(30),
              }}>
              {QnAData?.comments
                .slice(0, 2)
                .map(
                  (comment, index) =>
                    comment?._id && (
                      <MomentComment
                        descriptionColor={descriptionColor}
                        bottomBg={bottomBg}
                        styles={styles}
                        profileData={comment}
                      />
                    ),
                )}
              {QnAData.comments.length > 1 && (
                <Text
                  style={{...styles.viewMoreComments, color: descriptionColor}}>
                  View more comments
                </Text>
              )}
              {QnAData.comments?.length <= 1 && (
                <View
                  style={{
                    ...styles.inputContainer,
                    backgroundColor: bottomBg,
                    height: scaleNew(44),
                  }}>
                  <TextInput
                    editable={!disabled}
                    style={{...styles.input, color: descriptionColor}}
                    placeholder={
                      QnAData.comments?.length === 0
                        ? 'Start sharing here...'
                        : 'Add a comment'
                    }
                    placeholderTextColor={descriptionColor}
                    value={askPartnerInput}
                    onChangeText={setAskPartnerInput}
                    multiline
                  />
                  {askPartnerInput.length > 0 && (
                    <Pressable
                      style={styles.sendButton}
                      onPress={() => {
                        if (!disabled) {
                          if (askPartnerInput.trim().length > 0) {
                            Keyboard.dismiss();
                            setTimeout(() => {
                              addComment({});
                            }, 600);
                          }
                        }
                      }}>
                      <Image
                        source={
                          askPartnerInput.length === 0
                            ? APP_IMAGE.bluesend
                            : APP_IMAGE.sendMessageActive
                        }
                        style={{
                          ...styles.sendIcon,
                          tintColor: descriptionColor,
                        }}
                      />
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          ) : (
            <>
              {quesType === 'option' ? (
                <>
                  <View style={styles.viewMainQuiz}>
                    <Pressable
                      onPress={() => {
                        if (disabled) {
                          return;
                        }
                        if (VARIABLES.disableTouch) {
                          ToastMessage('Please add a partner to continue');
                          return;
                        }
                        if (QnAData?.user1?.answer === undefined) {
                          let data = {
                            answer: VARIABLES.user?.partnerData?.partner?._id,
                            type: hornyMode ? 'Horny' : 'QnA',
                          };
                          if (netInfo.isConnected === false) {
                            ToastMessage(
                              'Network issue :(',
                              'Please Check Your Network !',
                            );
                            return;
                          }
                          if (hornyMode) {
                            CleverTap.recordEvent(
                              'Hm Quiz answered: partner dp',
                            );
                            CleverTap.recordEvent('Hm quiz cards answered');
                          } else {
                            CleverTap.recordEvent('Quiz answered: partner dp');
                            CleverTap.recordEvent('Quiz cards answered');
                          }
                          setLoading(true);
                          dispatch(AddAnswerQa(data));
                        }
                      }}>
                      <ProfileImageGradient
                        QnAData={QnAData}
                        userCard="partner"
                        isAnswered={isAnswered}
                        isPartnerAnswered={isPartnerAnswered}
                        isBothAnswered={isBothAnswered}
                        imageUri={`${AWS_URL_S3}${VARIABLES.user?.partnerData?.partner?.profilePic}`}
                        hasBothAnswered={hasBothAnswered}
                      />
                    </Pressable>

                    <Pressable
                      style={{marginStart: scaleNew(16)}}
                      onPress={() => {
                        if (disabled) {
                          return;
                        }
                        if (VARIABLES.disableTouch) {
                          ToastMessage('Please add a partner to continue');
                          return;
                        }
                        if (QnAData?.user1?.answer === undefined) {
                          let data = {
                            answer: VARIABLES.user?._id,
                            type: hornyMode ? 'Horny' : 'QnA',
                          };
                          if (netInfo.isConnected === false) {
                            ToastMessage(
                              'Network issue :(',
                              'Please Check Your Network !',
                            );
                            return;
                          }
                          setLoading(true);
                          CleverTap.recordEvent('Quiz cards answered');

                          dispatch(AddAnswerQa(data));
                        }
                      }}>
                      <ProfileImageGradient
                        QnAData={QnAData}
                        userCard="user"
                        isAnswered={isAnswered}
                        isPartnerAnswered={isPartnerAnswered}
                        isBothAnswered={isBothAnswered}
                        imageUri={`${AWS_URL_S3}${VARIABLES.user?.profilePic}`}
                        hasBothAnswered={hasBothAnswered}
                      />
                    </Pressable>
                  </View>

                  {answer !== '' && (
                    <>
                      {answer === 'Amazing! You both think alike!' ? (
                        <ImageBackground
                          style={styles.viewBothSame}
                          source={APP_IMAGE.qaCardBottomBg}
                          imageStyle={
                            {
                              //  borderBottomRightRadius: scale(20),
                              //   borderBottomLeftRadius: scale(20),
                            }
                          }>
                          <Image
                            source={require('../../../../assets/images/confettii.gif')}
                            style={styles.imgConfetti}
                          />
                          <Text style={styles.textBothSame}>
                            Amazing! You both think alike
                          </Text>
                        </ImageBackground>
                      ) : (
                        <View
                          style={{
                            ...styles.viewBottomOther,
                            backgroundColor: bottomBg,
                          }}>
                          <Text
                            style={{
                              ...styles.textBottomOther,
                              color: descriptionColor,
                            }}>
                            {answer}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.viewMainTypeChoice}>
                    <ChoiceGradientButton
                      choice="Yes"
                      onPress={handlePressChoice}
                      disabled={disabled}
                      userChoice={QnAData?.user1?.choice}
                      partnerChoice={QnAData?.user2?.choice}
                      titleColor={titleColor}
                      descriptionColor={descriptionColor}
                      buttonColor={buttonColor}
                      bottomBg={bottomBg}
                      bgColor={bgColor}
                    />
                    <ChoiceGradientButton
                      choice="No"
                      onPress={handlePressChoice}
                      disabled={disabled}
                      userChoice={QnAData?.user1?.choice}
                      partnerChoice={QnAData?.user2?.choice}
                      titleColor={titleColor}
                      descriptionColor={descriptionColor}
                      buttonColor={buttonColor}
                      bottomBg={bottomBg}
                      bgColor={bgColor}
                    />
                    <ChoiceGradientButton
                      choice="Maybe"
                      onPress={handlePressChoice}
                      disabled={disabled}
                      userChoice={QnAData?.user1?.choice}
                      partnerChoice={QnAData?.user2?.choice}
                      titleColor={titleColor}
                      descriptionColor={descriptionColor}
                      buttonColor={buttonColor}
                      bottomBg={bottomBg}
                      bgColor={bgColor}
                    />
                  </View>

                  {answer !== '' && (
                    <>
                      {answer === 'Amazing! You both think alike!' ? (
                        <ImageBackground
                          style={{
                            ...styles.viewBothSame,
                            backgroundColor: bgColor,
                          }}
                          source={APP_IMAGE.qaCardBottomBg}
                          imageStyle={
                            {
                              //  borderBottomRightRadius: scale(20),
                              //  borderBottomLeftRadius: scale(20),
                            }
                          }>
                          <Image
                            source={require('../../../../assets/images/confettii.gif')}
                            style={styles.imgConfetti}
                          />
                          <Text style={styles.textBothSame}>
                            Amazing! You both think alike!
                          </Text>
                        </ImageBackground>
                      ) : (
                        <View
                          style={{
                            ...styles.viewBottomOther,
                            backgroundColor: bottomBg,
                          }}>
                          <Text
                            style={{
                              ...styles.textBottomOther,
                              color: descriptionColor,
                            }}>
                            {answer}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ViewShot>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    //   height: scale(268),
    width: scale(396),
    marginHorizontal: scale(16),
    marginTop: scale(24),
    paddingHorizontal: scale(25),
    justifyContent: 'space-evenly',
    paddingBottom: scale(140),
    paddingTop: scale(10),
    backgroundColor: colors.greenBgQuiz,
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  knowBetterLabel: {
    ...globalStyles.regularLargeText,
    color: colors.blue9,
    marginTop: scale(8),
    fontSize: scale(18),
  },
  whoAnswered: {
    padding: scale(4),
    paddingHorizontal: scale(6),
    backgroundColor: 'rgba(255,255,255,0.24)',
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    borderRadius: scale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.commentBgQuiz,
    marginTop: scale(16),
    borderRadius: scale(12),
    paddingStart: scale(12),
  },
  callsMoreLabel: {
    ...globalStyles.regularLargeText,
    color: colors.white,
    marginTop: scale(8),
    marginBottom: scale(24),
    fontSize: scale(18),
    //  width: scale(230),
    lineHeight: scale(31),
    // marginEnd:40
  },
  userProfileImage: {
    width: scale(82),
    height: scale(82),
    borderRadius: scale(41),
  },

  commentUserContainer: {
    flexDirection: 'row',
    backgroundColor: colors.red2,
    padding: scale(12),
    borderRadius: scale(10),
    alignItems: 'center',
    marginVertical: scale(10),
  },
  commentUserImage: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: colors.grey10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginStart: 10,
    flex: 1,
  },
  comment: {
    ...globalStyles.regularMediumText,
    marginTop: scale(16),
    marginEnd: scale(6),
  },
  commentTimeStamp: {
    ...globalStyles.regularSmallText,
    opacity: 0.5,
  },

  viewMoreCommment: {
    ...globalStyles.regularMediumText,
    textDecorationLine: 'underline',
  },

  pressableContainer: {
    overflow: 'hidden',
    marginTop: scale(23),
    marginHorizontal: scaleNew(16),
    borderRadius: 16,

    // height: scale(276),
  },
  cardContainer: {
    backgroundColor: colors.greenBgQuiz,
    overflow: 'hidden',
    paddingHorizontal: scale(16),
    paddingBottom: scale(24),
    paddingTop: scale(16),
    borderRadius: 16,
  },
  archiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    end: scale(22),
    top: scale(14),
    zIndex: 10,
  },
  archiveText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: '#3F6339',
    marginStart: scale(4),
    includeFontPadding: false,
  },
  titleText: {
    fontFamily: fonts.regularSerif,
    fontSize: scaleNew(18),
  },
  questionText: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.white,
    marginTop: scaleNew(8),
    lineHeight: scaleNew(24),
  },
  viewMoreComments: {
    fontFamily: fonts.regularFont,
    fontSize: scale(12),
    color: colors.white,
    marginTop: scale(10),
    textDecorationLine: 'underline',
  },
  input: {
    //  paddingVertical: scale(16),
    color: colors.white,
    flex: 1,
    fontFamily: Platform.OS === 'android' ? fonts.lightFont : fonts.regularFont,
    paddingTop: Platform.OS === 'ios' ? scale(2) : scale(4),
    paddingBottom: -scale(8),
    fontSize: scaleNew(14),
    //   marginTop: 16,
  },
  sendButton: {
    padding: 10,
  },
  sendIcon: {
    width: scale(22),
    height: scale(22),
    tintColor: colors.white,
  },
  viewScreenshot: {
    position: 'absolute',
    end: scale(20),
    top: scale(20),
    zIndex: 20,
  },
  viewMainQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: scale(4),
    zIndex: 10,
    marginTop: scaleNew(14),
    marginBottom: scaleNew(16),
  },
  viewBothSame: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    // backgroundColor: 'rgb(217, 235, 226)',
    flexDirection: 'row',
    alignItems: 'center',
    height: scaleNew(45),
    paddingStart: scale(15),
  },
  textBothSame: {
    ...globalStyles.standardLargeText,
    fontSize: scaleNew(13),
    fontFamily: fonts.standardFont,
    includeFontPadding: false,
  },
  imgConfetti: {width: 30, height: 30, marginRight: 3},
  viewArchive: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    end: scale(22),
    bottom: scale(10),
    zIndex: 10,
  },
  viewBottomOther: {
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH - scale(32),
    backgroundColor: colors.commentBgQuiz,
    height: scaleNew(45),
    justifyContent: 'center',
  },
  textBottomOther: {
    ...globalStyles.regularLargeText,
    //   textAlign: 'center',
    //  padding: scaleNew(12),
    fontSize: scaleNew(13),
    marginStart: scaleNew(15),
    color: colors.white,
  },
  viewMainTypeChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(14),
    marginBottom: scale(50),
    paddingEnd: scaleNew(20),
  },
  textTypeChoice: {
    fontFamily: fonts.italicCaveat,
    fontSize: scale(21),
    color: colors.white,
  },
  viewTypeChoice: {
    paddingHorizontal: scale(26),
    height: scale(38),
    borderRadius: scale(16),
    backgroundColor: '#6E8F68',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
