/* eslint-disable react-native/no-inline-styles */
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AppView from '../../components/AppView';
import {colors} from '../../styles/colors';
import {APP_IMAGE} from '../../utils/constants';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  globalStyles,
} from '../../styles/globalStyles';
import ArrowRightIconSvg from '../../assets/svgs/arrowRightIconSvg';
import {scale} from '../../utils/metrics';
import PagerView from 'react-native-pager-view';
import Carousel from 'react-native-snap-carousel';

export default function Onboarding(props) {
  const snapRef = useRef(null);

  const [step, setStep] = useState(1);
  const [startAnimate, setStartAnimate] = useState(false);
  const [getStarted, setgetStarted] = useState(true);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const pageRef = useRef(null);

  const stepHandler = () => {
    if (step === 7) {
      EventRegister.emit('alreadyLaunched');
      AsyncStorage.setItem('alreadyLaunched', 'true'); // No need to wait for `setItem` to finish, although you might want to handle errors
      props.navigation.replace('login');
    } else {
      console.log(pageRef.current.setPage);
      Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
        useNativeDriver: false,
      });
      pageRef.current.setPage(step);
      setStep(step + 1);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setStartAnimate(false);
    }, 5000);
  }, []);

  return (
    <AppView
      customContainerStyle={styles.container}
      scrollContainerRequired={false}
      isScrollEnabled={false}>
      {startAnimate ? (
        <Image source={APP_IMAGE.splashGif} style={{flex: 1}} />
      ) : getStarted ? (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.backgroundColor,
          }}>
          <View
            style={{
              alignItems: 'center',
              flex: 0.25,
              justifyContent: 'flex-end',
            }}>
            <Image
              source={APP_IMAGE.onboardingProgress1}
              style={{
                width: 60,
                height: 40,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                ...globalStyles.titleLabel,
                marginVertical: scale(20),
              }}>
              Welcome to Closer
            </Text>
          </View>
          <View
            style={{
              flex: 0.75,
            }}>
            <Image
              source={APP_IMAGE.onboardingBaseImage}
              style={{
                height: SCREEN_HEIGHT * 0.45,
                width: SCREEN_WIDTH,
                resizeMode: 'contain',
              }}
            />
            <View
              style={{
                padding: scale(16),
                paddingVertical: 0,
              }}>
              <Text
                style={{
                  fontFamily: fonts.semiBoldFont,
                  fontSize: scale(18),
                  color: colors.text,
                  textAlign: 'center',
                }}
                numberOfLines={2}
                adjustsFontSizeToFit>
                {`A cozy corner on the internet with your partner, no matter the distance or time!`}
              </Text>
            </View>
          </View>
          <View
            style={{
              ...styles.bottomContainer,
              justifyContent: 'center',
            }}>
            <Pressable
              style={[
                {flexDirection: 'row', alignItems: 'center'},
                {
                  paddingHorizontal: 36,
                  paddingVertical: 12,
                  backgroundColor: colors.blue1,
                  borderRadius: 10,
                },
              ]}
              onPress={() => {
                setgetStarted(false);
              }}>
              <Text
                style={[
                  styles.button,
                  {
                    color: colors.white,
                    textTransform: 'uppercase',
                  },
                ]}>
                {'Get Started'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <PagerView
            ref={pageRef}
            style={{flex: 1, justifyContent: 'center'}}
            onPageScroll={() => {
              Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver: false,
              });
            }}
            onPageSelected={e => {
              console.log('indexx', e.nativeEvent.position);
              setStep(e.nativeEvent.position + 1);
            }}>
            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress2}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  {`You can chat with your partner here,
 just like anywhere else`}
                </Text>
                <Image
                  style={{
                    width: SCREEN_WIDTH,
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.onboardingOne}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress3}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  {`You can build a new home for all your Insta-perfect and blurry memories!`}
                </Text>
                <Image
                  style={{
                    width: SCREEN_WIDTH,
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.onboardingTwo}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress4}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  {`Share everything with complete peace of mind; Closer is a privacy-first safe space with end-to-end encryption`}
                </Text>
                <Image
                  style={{
                    width: SCREEN_WIDTH,
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={APP_IMAGE.onboardingThree}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress6}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={{...styles.title}}>
                  {`Express yourself & your love in new ways`}
                </Text>
                <View>
                  <Carousel
                    ref={snapRef}
                    onSnapToItem={async props => {
                      if (props === 2) {
                        await delay(1000);
                        if (snapRef.current.snapToItem(0) !== null) {
                          snapRef.current.snapToItem(0);
                        }
                      }
                    }}
                    data={[
                      'Leave thoughtful notes',
                      'Express your moods',
                      'Mark & celebrate special events!',
                    ]}
                    renderItem={item => {
                      let color;
                      switch (item.index) {
                        case 0:
                          color = '#F5788C';
                          break;
                        case 1:
                          color = '#1A2BBB';

                          break;
                        case 2:
                          color = '#CCB808';

                          break;

                        default:
                          break;
                      }
                      return (
                        <View>
                          <Text
                            style={{
                              ...styles.title,
                              color,
                            }}>
                            {item.item}
                          </Text>
                        </View>
                      );
                    }}
                    sliderHeight={50}
                    itemHeight={50}
                    vertical
                    autoplay
                    autoplayInterval={2000}
                  />
                </View>
                {/* <Text style={styles.title}>
                {`And you can do a lot more! 
Leave thoughtful notes
Express your moods
Mark & celebrate special events!`}
                </Text> */}
                <Image
                  style={{width: null, height: null, flex: 1}}
                  resizeMode="contain"
                  source={APP_IMAGE.onboardingFour}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress9}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  {`You can also keep shared notes & 
tasks, to store everything from 
dreamy goals to movie wishlists!`}
                </Text>
                <Image
                  style={{width: undefined, height: undefined, flex: 1}}
                  resizeMode="contain"
                  source={APP_IMAGE.onboardingFive}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress8}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  {`Need some quick attention!? 
Poke your partner with your mood and see how they respond 👀`}
                </Text>
                <Image
                  style={{width: undefined, height: undefined, flex: 1}}
                  resizeMode="contain"
                  source={APP_IMAGE.onboardingSeven}
                />
              </View>
            </View>

            <View
              style={{
                flex: 1,
              }}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={APP_IMAGE.onboardingProgress7}
                  style={{
                    // width: 80,
                    // height: 44,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.8,
                }}>
                <Text style={styles.title}>
                  Finally, a new way to react,{`\n`}with Stickers. And lots of
                  them! :)
                </Text>
                <Image
                  style={{
                    width: SCREEN_WIDTH * 0.8,
                    height: '100%',
                    resizeMode: 'contain',
                    marginHorizontal: SCREEN_WIDTH * 0.1,
                  }}
                  source={APP_IMAGE.onboardingSix}
                />
              </View>
            </View>
          </PagerView>
          <View
            style={{
              ...styles.bottomContainer,
              paddingBottom: 0,
              justifyContent: 'space-between',
            }}>
            {(() => {
              switch (step) {
                case 1:
                  return <PageOne />;
                case 2:
                  return <PageTwo />;
                case 3:
                  return <PageThree />;
                case 4:
                  return <PageFour />;
                case 5:
                  return <PageFive />;
                case 6:
                  return <PageSix />;
                case 7:
                  return <PageSeven />;
                default:
                  break;
              }
            })()}
            <Pressable
              style={[{flexDirection: 'row', alignItems: 'center'}]}
              onPress={stepHandler}>
              <Text style={[styles.button]}>
                {step === 7 ? 'Get Started' : 'Next'}
              </Text>
              <ArrowRightIconSvg />
            </Pressable>
          </View>
        </>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    // flex: 1
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: scale(80),
    marginHorizontal: scale(26),
    flex: 0.2,
  },
  title: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(18),
    marginHorizontal: scale(26),
    textAlign: 'center',
  },
  button: {
    ...globalStyles.semiBoldLargeText,
    color: colors.blue1,
    fontSize: scale(18),
    lineHeight: 24,
    textAlignVertical: 'center',
  },
});

import Svg, {Rect} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fonts} from '../../styles/fonts';
import {EventRegister} from 'react-native-event-listeners';
import {delay} from '../../utils/helpers';

const PageOne = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={25} height={5} fill="#7DB0E9" rx={2.5} />
    <Rect
      width={10}
      x={30}
      height={5}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={75}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={90}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);

const PageFive = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={15}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={30}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect width={25} x={60} height={5} fill="#7DB0E9" rx={2.5} />

    <Rect
      width={10}
      height={5}
      x={90}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);

const PageSix = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={15}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={30}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect width={25} x={75} height={5} fill="#7DB0E9" rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);

const PageSeven = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={15}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={30}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={75}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect width={25} x={90} height={5} fill="#7DB0E9" rx={2.5} />
  </Svg>
);

const PageFour = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={15}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={30}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect width={25} x={45} height={5} fill="#7DB0E9" rx={2.5} />

    <Rect
      width={10}
      height={5}
      x={75}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={90}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);

const PageThree = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={15}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect width={25} x={30} height={5} fill="#7DB0E9" rx={2.5} />

    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={75}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={90}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);

const PageTwo = ({activeindex, total}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={150} height={5} fill="none">
    <Rect width={10} height={5} fill="#fff" fillOpacity={0.67} rx={2.5} />
    <Rect width={25} x={15} height={5} fill="#7DB0E9" rx={2.5} />
    <Rect
      width={10}
      height={5}
      x={45}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={60}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={75}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={90}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
    <Rect
      width={10}
      height={5}
      x={105}
      fill="#fff"
      fillOpacity={0.67}
      rx={2.5}
    />
  </Svg>
);
