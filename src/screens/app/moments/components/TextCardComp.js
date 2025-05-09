/* eslint-disable react-native/no-inline-styles */
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import React from 'react';
import {scaleNew} from '../../../../utils/metrics2';
import {colors} from '../../../../styles/colors';
import {scale} from '../../../../utils/metrics';
import {fonts} from '../../../../styles/fonts';
import LinearGradient from 'react-native-linear-gradient';
import {useAppContext} from '../../../../utils/VariablesContext';
import TextCardTooltip from '../../../../components/contextualTooltips/TextCardTooltip';

const CleverTap = require('clevertap-react-native');

const getCategoryImage = category => {
  switch (category) {
    case 'appNudge':
      return require('../../../../assets/images/appNudgeIcon.png');
    case 'dateNights':
      return require('../../../../assets/images/textStars.png');
    case 'cornersideChats':
      return require('../../../../assets/images/textConversation.png');
    case 'loveTips':
      return require('../../../../assets/images/textLove.png');
    default:
      return require('../../../../assets/images/textLove.png');
  }
};

const getTitle = category => {
  switch (category) {
    case 'appNudge':
      return 'Did you know?';
    case 'dateNights':
      return 'It’s a date!';
    case 'cornersideChats':
      return 'Corner side chats';
    case 'loveTips':
      return 'Starting from love!';
    default:
      return 'Starting from love!';
  }
};

export default function TextCardComp({textData, onRemoveCard, disabled}) {
  const {hornyMode} = useAppContext();
  const translateX = useSharedValue(0);

  let type = textData?.category === 'appNudge' ? 'app' : 'quote';

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: (event, ctx) => {
      if (Math.abs(translateX.value) > 200) {
        // Swipe threshold
        const direction = translateX.value > 0 ? 1 : -1; // Determine the swipe direction

        runOnJS(onRemoveCard)();
        // Continue moving in the same direction
        translateX.value = withSpring(direction * 500, {
          velocity: event.velocityX,
        });
      } else {
        // If the swipe does not exceed the threshold, return to original position
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <>
      {!disabled ? (
        <View
          style={{
            flex: 1,
            marginTop: scaleNew(23),
            marginHorizontal: scale(20),
            borderRadius: scaleNew(12),
          }}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={animatedStyle}>
              <Pressable
                onPress={() => {
                  CleverTap.recordEvent('Nudge cards tapped');
                }}
                style={{flexDirection: 'row', alignItems: 'stretch'}}>
                <View style={{flex: 1}}>
                  <LinearGradient
                    colors={
                      hornyMode
                        ? ['rgb(86, 48, 138)', '#4D2777']
                        : ['#FFDFC76B', '#B4C8FE6B']
                    }
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    locations={[0.4, 0.9]}
                    useAngle={true}
                    angle={60}
                    style={styles.container}>
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            maxWidth: type !== 'app' ? '87%' : '100%',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',

                              alignItems: 'center',
                            }}>
                            {type === 'app' && (
                              <Image
                                source={require('../../../../assets/images/appIcon.png')}
                                style={{
                                  width: scaleNew(24),
                                  height: scaleNew(24),
                                  marginEnd: scaleNew(8),
                                }}
                              />
                            )}
                            <Text
                              style={{
                                ...styles.title,
                                color:
                                  type === 'app'
                                    ? colors.textSecondary2
                                    : hornyMode
                                    ? colors.white
                                    : colors.textSecondary2,
                              }}>
                              {getTitle(textData?.category)}
                            </Text>
                          </View>

                          <Text
                            style={[
                              styles.textHeader,
                              type === 'app' && {
                                marginEnd: scaleNew(0),
                              },

                              hornyMode && type !== 'app'
                                ? {
                                    color: 'rgba(189, 189, 189, 1)',
                                  }
                                : {
                                    color:
                                      type === 'app'
                                        ? colors.textSecondary2
                                        : colors.textSecondary2,
                                  },
                            ]}>
                            {textData?.text}
                          </Text>
                        </View>
                        {type !== 'app' && (
                          <Image
                            style={{
                              tintColor: hornyMode
                                ? colors.white
                                : colors.textSecondary2,
                              opacity: 1,
                            }}
                            source={getCategoryImage(textData?.category)}
                          />
                        )}
                      </View>
                    </View>
                    {/* {type === 'app' && (
                      <View
                        style={{
                          position: 'absolute',
                          right: scaleNew(10),
                          marginStart: scaleNew(10),
                          alignItems: 'center',
                          justifyContent: 'center',
                          top: 0,
                          bottom: 0,
                        }}>
                        <Image
                          source={getCategoryImage(textData?.category)}
                          style={{
                            alignSelf: 'center',
                            height: '95%',
                          }}
                        />
                      </View>
                    )} */}
                  </LinearGradient>
                </View>
                {type !== 'app' && (
                  <Image
                    source={require('../../../../assets/images/textCardRightBg.png')}
                    style={styles.imageBgRight}
                  />
                )}
              </Pressable>
            </Animated.View>
          </PanGestureHandler>
          <TextCardTooltip />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: scaleNew(23),
            marginHorizontal: scale(20),
            borderRadius: scaleNew(12),
            overflow: 'hidden',
          }}>
          <View>
            <Pressable style={{flexDirection: 'row', alignItems: 'stretch'}}>
              <View style={{flex: 1}}>
                <LinearGradient
                  colors={
                    hornyMode
                      ? ['rgb(86, 48, 138)', '#4D2777']
                      : ['#FFDFC76B', '#B4C8FE6B']
                  }
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  locations={[0.4, 0.9]}
                  useAngle={true}
                  angle={60}
                  style={styles.container}>
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          maxWidth: type !== 'app' ? '87%' : '100%',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',

                            alignItems: 'center',
                          }}>
                          {type === 'app' && (
                            <Image
                              source={require('../../../../assets/images/appIcon.png')}
                              style={{
                                width: scaleNew(24),
                                height: scaleNew(24),
                                marginEnd: scaleNew(8),
                              }}
                            />
                          )}
                          <Text
                            style={{
                              ...styles.title,
                              color:
                                type === 'app'
                                  ? colors.textSecondary2
                                  : hornyMode
                                  ? colors.white
                                  : colors.textSecondary2,
                            }}>
                            {getTitle(textData?.category)}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.textHeader,
                            type === 'app' && {
                              marginEnd: scaleNew(0),
                            },
                            hornyMode && type !== 'app'
                              ? {
                                  color: 'rgba(189, 189, 189, 1)',
                                }
                              : {
                                  color:
                                    type === 'app'
                                      ? colors.textSecondary2
                                      : colors.textSecondary2,
                                },
                          ]}>
                          {textData?.text}
                        </Text>
                      </View>
                      {type !== 'app' && (
                        <Image
                          style={{
                            tintColor: hornyMode
                              ? colors.white
                              : colors.textSecondary2,
                            opacity: 1,
                          }}
                          source={getCategoryImage(textData?.category)}
                        />
                      )}
                    </View>
                  </View>
                  {/* {type === 'app' && (
                    <View
                      style={{
                        position: 'absolute',
                        right: scaleNew(10),
                        marginStart: scaleNew(10),
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0,
                        bottom: 0,
                      }}>
                      <Image
                        source={getCategoryImage(textData?.category)}
                        style={{
                          alignSelf: 'center',
                          height: '95%',
                        }}
                      />
                    </View>
                  )} */}
                </LinearGradient>
              </View>
              {type !== 'app' && (
                <Image
                  source={require('../../../../assets/images/textCardRightBg.png')}
                  style={styles.imageBgRight}
                />
              )}
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  viewRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleNew(24),
  },

  img: {
    width: scaleNew(50),
    height: scaleNew(64),
    borderRadius: scaleNew(8),
    marginEnd: scaleNew(6),
    resizeMode: 'stretch',
    backgroundColor: colors.borderColor,
  },
  container: {
    paddingVertical: scaleNew(21),
    paddingHorizontal: scaleNew(15),
    borderRadius: scaleNew(12),
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: fonts.regularSerif,
    fontSize: scaleNew(18),
    color: colors.textSecondary2,
    marginEnd: scaleNew(50),
    lineHeight: scaleNew(26),
  },
  textHeader: {
    fontFamily: fonts.regularFont,
    fontSize: scale(16),
    color: colors.textSecondary2,
    lineHeight: 22,
    flexShrink: 1,
    marginTop: scaleNew(14),
    marginEnd: scaleNew(50),
    minHeight: scaleNew(48),
  },
  imageBgRight: {
    height: '100%',
    resizeMode: 'stretch',
    position: 'absolute',
    right: 0,
  },
});
