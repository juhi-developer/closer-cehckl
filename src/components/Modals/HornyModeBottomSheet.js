/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {colors} from '../../styles/colors';
import {getColorCodeWithOpactiyNumber} from '../../utils/helpers';
import {APP_IMAGE} from '../../utils/constants';
import {SCREEN_WIDTH} from '../../styles/globalStyles';
import {fonts} from '../../styles/fonts';
import {scaleNew} from '../../utils/metrics2';
import PagerView from 'react-native-pager-view';
import PaginationDot from 'react-native-animated-pagination-dot';
import PaginationDotComp from '../PaginationDotComp';
import {useAppContext} from '../../utils/VariablesContext';
import {Modal} from 'react-native-js-only-modal';
import {updateContextualTooltipState} from '../../utils/contextualTooltips';
import LottieView from 'lottie-react-native';

const HornyModeBottomSheet = ({visible, setVisible}) => {
  const {sethornyMode} = useAppContext();
  const pageRef = useRef(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(val => {
        pageRef.current?.setPage(val % 3);
        return val % 3;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      visible={visible}
      onCloseRequest={async () => {
        await updateContextualTooltipState('hornyModeDialogShown', true);
        setVisible(false);
      }}
      style={{
        margin: 0,
        flex: 1,
        justifyContent: 'flex-end',

        width: '100%',
      }}>
      <View
        activeOpacity={1}
        onPress={() => {
          setVisible(false);
        }}>
        <View
          style={{
            backgroundColor: '#311A4D',
            borderTopLeftRadius: 27,
            borderTopRightRadius: 27,
            paddingHorizontal: scaleNew(25),
            paddingVertical: scaleNew(18),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View />
            <Pressable
              onPress={async () => {
                await updateContextualTooltipState(
                  'hornyModeDialogShown',
                  true,
                );
                setVisible(false);
              }}>
              <Image
                style={{width: 27, height: 27}}
                source={APP_IMAGE.close_light_horny}
              />
            </Pressable>
          </View>
          <PagerView
            ref={pageRef}
            initialPage={0}
            style={{height: scaleNew(381)}}
            onPageScroll={() => {
              Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                useNativeDriver: false,
              });
            }}
            onPageSelected={e => {
              console.log('indexx', e.nativeEvent.position);
              setStep(e.nativeEvent.position + 1);
            }}>
            <PagerCompoennt
              descp={`Shake your phone to activate the horny${'\n'}mode, and we’ll let your partner know${'\n'}you’re ‘in the mood’! 😈`}
              title={`SHAKE IT UP FOR${'\n'}HORNY MODE`}
              image={'gif'}
              setVisible={setVisible}
            />
            <PagerCompoennt
              setVisible={setVisible}
              descp={`Your Moments experience changes for${'\n'}30 mins (long enough?) 👀 `}
              title={'stays ON FOR 30 mins'}
              image={APP_IMAGE.hornyTwo}
            />
            <PagerCompoennt
              setVisible={setVisible}
              descp={`You’ll find steamy emoji in Poke and an${'\n'}intimacy quiz card in Moments!`}
              title={'Spice it up!'}
              image={APP_IMAGE.hornyThree}
            />
          </PagerView>
          <PaginationDotComp
            currentIndex={step - 1}
            totalDots={3}
            activeColor="#ffffff"
            inactiveColor="#190D27"
            size={8}
          />
          <Pressable
            style={{
              backgroundColor: 'rgb(67,41,109)',

              borderRadius: 8,
              marginBottom: 40,
              marginTop: 27,
              height: scaleNew(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={async () => {
              if (step === 3) {
                await updateContextualTooltipState(
                  'hornyModeDialogShown',
                  true,
                );
                setVisible(false);
              }
              pageRef.current?.setPage(step);
            }}>
            <Text
              style={{
                fontFamily: fonts.semiBoldFont,
                fontSize: scaleNew(18),
                color: '#FFFFFF',
              }}>
              {step === 3 ? 'Got it' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default HornyModeBottomSheet;

const PagerCompoennt = ({image, descp, title, setVisible}) => {
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginTop: scaleNew(14),
          marginBottom: scaleNew(30),
          alignItems: 'center',
        }}>
        <View style={{borderRadius: 8, overflow: 'hidden'}}>
          {image === 'gif' ? (
            <ImageBackground
              source={require('../../assets/images/hornyFirstBg.png')}
              style={{
                height: scaleNew(192),
                width: scaleNew(311),
              }}>
              <LottieView
                style={{
                  height: scaleNew(192),
                  width: scaleNew(311),
                  resizeMode: 'contain',
                }}
                source={require('../../assets/json/hornyModeShakeJson.json')}
                autoPlay
                loop
              />
            </ImageBackground>
          ) : (
            <Image
              source={image}
              style={{
                height: scaleNew(192),
                width: scaleNew(311),
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
      </View>
      <Text
        style={{
          fontFamily: fonts.semiBoldFont,
          fontSize: scaleNew(26),
          color: '#F2F2F2',
          textAlign: 'center',
          textTransform: 'lowercase',
          lineHeight: scaleNew(30),
        }}>
        {title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.regularFont,
          fontSize: scaleNew(16),
          color: '#E0E0E0',
          textAlign: 'center',
          lineHeight: scaleNew(20),
          marginTop: scaleNew(8),
        }}
        // numberOfLines={2}
        adjustsFontSizeToFit>
        {descp}
      </Text>
    </View>
  );
};
