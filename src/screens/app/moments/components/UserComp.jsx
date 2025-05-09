import {StyleSheet, Image, Text, View, Platform, Pressable} from 'react-native';
import {fonts} from '../../../../styles/fonts';
import {VARIABLES} from '../../../../utils/variables';
import {APP_IMAGE} from '../../../../utils/constants';
import {AWS_URL_S3} from '../../../../utils/urls';
import {scaleNew} from '../../../../utils/metrics2';

import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles} from '../../../../styles/globalStyles';
import {formatRelativeTime} from '../../../../utils/utils';
import {useAppContext} from '../../../../utils/VariablesContext';
import {colors} from '../../../../styles/colors';
import {InitialsAvatar} from './InitialsAvatar';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';
import CustomToolTipNew from '../../../../components/CustomToolTipNew';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState, useEffect} from 'react';
import {
  handleTooltipPressUserComp,
  shouldShowTooltipUserComp,
} from '../../../../utils/helpers';

const getImageAndGradientForTimeOfDay = (partOfDay, hornyMode) => {
  switch (partOfDay) {
    case 'morning':
      return {
        image: APP_IMAGE.sun,
        gradientColors: hornyMode
          ? ['#282C5D', '#243163', '#262F60']
          : ['#F6EACE', '#F2EADE'],
      };
    case 'evening':
      return {
        image: APP_IMAGE.evening,
        gradientColors: hornyMode
          ? ['#282C5D', '#243163', '#262F60']
          : ['#F3E2D8', '#F4E1D6', '#F4E1D6'],
      };
    case 'night':
      return {
        image: APP_IMAGE.moon,
        gradientColors: hornyMode
          ? ['#282C5D', '#243163', '#262F60']
          : ['#ECECED', '#E2E5E8', '#E3E5E9'],
      };
    default:
      return {
        image: APP_IMAGE.sun,
        gradientColors: hornyMode
          ? ['#282C5D', '#243163', '#262F60']
          : ['#F5EAD2', '#F4EAD3', '#F4ECD9'],
      };
  }
};

const TimeZone = (
  closerPartnerPartOfDay,
  closerCurrentTime,
  closerPartnerCurrentTime,
  isPartnerPaired,
  hornyMode,
) => {
  // const userTimeData = getImageAndGradientForTimeOfDay(closerPartOfDay);
  const partnerTimeData = getImageAndGradientForTimeOfDay(
    closerPartnerPartOfDay,
    hornyMode,
  );
  const combinedColors = [
    //  '#FFFFFF',
    //  ...userTimeData.gradientColors,
    ...partnerTimeData.gradientColors,
  ];

  if (closerCurrentTime === closerPartnerCurrentTime) {
    return <View />;
  }
  if (
    closerCurrentTime?.length === 0 ||
    closerPartnerCurrentTime?.length === 0
  ) {
    return <View />;
  }
  return (
    <View
      style={{
        alignItems: 'flex-start',
        position: 'absolute',

        start: -scaleNew(10),

        //  top: scaleNew(32),
        ///  marginVertical: scaleNew(10),
        marginTop: scaleNew(18),
        //     marginStart: -scaleNew(10),
        // marginBottom: 8,
        height: scaleNew(42),
        maxHeight: scaleNew(42),
        marginBottom: isPartnerPaired ? 24 : 0,
      }}>
      <LinearGradient
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: hornyMode ? '#34529B' : '#fff',
          padding: scaleNew(8),
          borderTopEndRadius: scaleNew(24),
          borderBottomEndRadius: scaleNew(24),
          //    borderRadius: scaleNew(24),
          paddingHorizontal: scaleNew(12),
          overflow: 'hidden',
        }}
        colors={combinedColors}
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}>
        <Image source={partnerTimeData.image} style={styles.timezoneImg} />
        <Text
          style={{
            ...globalStyles.regularMediumText,
            includeFontPadding: false,
            marginTop: Platform.OS === 'android' ? scaleNew(2) : 0,
            marginStart: scaleNew(4),
            color: hornyMode ? colors.white : colors.text,
          }}>
          {closerPartnerCurrentTime}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default function UserComp({
  profileData,
  weeksTogether,
  otherUserOnline,
  otherUserLastActive,
  timezone,
  closerPartnerPartOfDay,
  closerCurrentTime,
  closerPartnerCurrentTime,
  isPartnerPaired,
  onPressWeeks,
  eveningMode,
  toolTipCurrentState,
}) {
  const {hornyMode} = useAppContext();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    checkPairingTimeAndTooltip();
  }, [toolTipCurrentState, profileData.partnerData?.pairingTime]);

  const checkPairingTimeAndTooltip = async () => {
    if (toolTipCurrentState === 5 && profileData.partnerData?.pairingTime) {
      const pairingTime = new Date(profileData.partnerData.pairingTime);
      const currentTime = new Date();

      const hoursDifference = (currentTime - pairingTime) / (1000 * 60 * 60);

      if (hoursDifference >= 1) {
        const shouldShow = await shouldShowTooltipUserComp();
        setShowTooltip(shouldShow);
      }
    }
  };

  return (
    <>
      <View style={{alignItems: 'center', marginTop: -scaleNew(10)}}>
        {profileData?.partnerCodeVerified &&
          timezone &&
          TimeZone(
            closerPartnerPartOfDay,
            closerCurrentTime,
            closerPartnerCurrentTime,
            isPartnerPaired,
            hornyMode,
          )}
        <View
          style={{
            flexDirection: 'row',
            marginTop: hornyMode ? scaleNew(18) : scaleNew(8),
            zIndex: 1000000,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <ProfileAvatar
              type="partner"
              style={{
                width: scaleNew(51),
                height: scaleNew(51),
                borderRadius: scaleNew(120),
                backgroundColor: colors.borderColor,
                borderWidth: otherUserOnline ? 3 : 1,
                borderColor: otherUserOnline ? '#95D033' : '#DADADA',
              }}
            />

            {otherUserOnline === false &&
              otherUserLastActive !== '' &&
              otherUserLastActive !== undefined &&
              otherUserLastActive !== null && (
                <View
                  style={{
                    paddingHorizontal: scaleNew(7),
                    height: scaleNew(18),
                    backgroundColor: colors.white,
                    borderRadius: 10,
                    paddingTop: scaleNew(1),
                    zIndex: 100,
                    marginTop: -scaleNew(14),
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.semiBoldFont,
                      color: '#95D033',
                      fontSize: scaleNew(12),
                      includeFontPadding: false,

                      marginBottom: Platform.OS === 'android' ? scaleNew(1) : 0,
                    }}>
                    {formatRelativeTime(otherUserLastActive) === '0s'
                      ? '1s'
                      : `${formatRelativeTime(otherUserLastActive)}`}
                  </Text>
                </View>
              )}
          </View>
          <View>
            <ProfileAvatar
              type="user"
              style={{
                width: scaleNew(51),
                height: scaleNew(51),
                borderRadius: scaleNew(120),
                backgroundColor: colors.grey10,
                marginStart: -scaleNew(10),
                borderWidth: 1,
                borderColor: '#DADADA',
              }}
            />
            {showTooltip && (
              <CustomToolTipNew
                hornyMode={hornyMode}
                viewNumberTooltipStyle={{
                  //   paddingBottom: scaleNew(10),
                  paddingTop: scaleNew(16),
                }}
                topToolkit
                onPresLeft={() => {}}
                onPress={() => {
                  handleTooltipPressUserComp();
                  checkPairingTimeAndTooltip();
                  //  updateStatus();
                }}
                title={'Let your partner see your pretty face!'}
                subTitle={'Please add your dp from Profile :)'}
                buttonText={'Okay'}
                viewToolTip={{
                  height: scaleNew(89),
                  maxHeight: scaleNew(89),
                  width: scaleNew(260),
                }}
                viewButtonTooltip={{
                  marginTop:
                    Platform.OS === 'ios' ? -scaleNew(-10) : -scaleNew(0),
                }}
                viewStyle={{
                  alignSelf: 'center',

                  position: 'absolute',
                  bottom: scaleNew(-88),

                  zIndex: 1000000,
                }}
                styleTooltip={{
                  alignSelf: 'center',
                }}
              />
            )}
          </View>
        </View>

        {!VARIABLES.disableTouch && (
          <Pressable
            onPress={onPressWeeks}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // justifyContent: 'flex-end',
              marginTop: scaleNew(12),
              zIndex: 1,
            }}>
            <Text
              style={{
                fontFamily: fonts.standardFont,
                fontSize: scaleNew(16),
                color: hornyMode
                  ? '#E0E0E0'
                  : eveningMode
                  ? colors.white
                  : '#737373',
                marginEnd: scaleNew(2),
              }}>
              {weeksTogether} weeks
            </Text>
            <Image
              resizeMode="contain"
              style={{resizeMode: 'contain', marginTop: -scaleNew(4)}}
              source={require('../../../../assets/images/heartMoments.png')}
            />
          </Pressable>
        )}

        {/* } */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
