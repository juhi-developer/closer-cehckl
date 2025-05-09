import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {scale} from '../../../../utils/metrics';
import {colors} from '../../../../styles/colors';
import {VARIABLES} from '../../../../utils/variables';
import GreyScaleImage from '../../../../components/GreyScaleImage';
import {id} from '../../../../../e2e/jest.config';
import {scaleNew} from '../../../../utils/metrics2';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const ProfileImageGradient = ({
  imageUri,
  userCard,
  QnAData,
  hasBothAnswered,
}) => {
  const userGradientColors = ['#386DC9', '#D3E4FF'];
  const partnerGradientColors = ['#124698', '#F3BACA'];

  // const QnAData = {
  //   user1: {
  //
  //     id: VARIABLES.user?._id,
  //   },
  //   user2: {
  //

  //     id: VARIABLES.user?.partnerData?.partner?._id,
  //   },
  // };

  let outerGradientColors = ['transparent', 'transparent'];
  let innerGradientColors = ['transparent', 'transparent'];

  // const userAnswer =
  //   Platform.OS === 'android'
  //     ? VARIABLES.user?.partnerData?.partner?._id
  //     : VARIABLES.user?.partnerData?.partner?._id;

  // const partnerAnswer =
  //   Platform.OS === 'android' ? VARIABLES.user?._id : VARIABLES.user?._id;

  const userAnswer = QnAData?.user1?.answer;
  const partnerAnswer = QnAData?.user2?.answer;

  if (
    userAnswer &&
    partnerAnswer &&
    userAnswer === partnerAnswer &&
    QnAData?.user1.id === userAnswer &&
    userCard === 'user'
  ) {
    outerGradientColors = userGradientColors;
    innerGradientColors = partnerGradientColors;
  } else if (
    userAnswer &&
    partnerAnswer &&
    userAnswer !== partnerAnswer &&
    QnAData?.user1.id === userAnswer &&
    userCard === 'user'
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = userGradientColors;
  } else if (
    userAnswer &&
    partnerAnswer &&
    userAnswer !== partnerAnswer &&
    QnAData?.user2.id === userAnswer &&
    userCard === 'user'
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = userGradientColors;
  } else if (
    userAnswer &&
    partnerAnswer &&
    userAnswer !== partnerAnswer &&
    QnAData?.user2.id === userAnswer &&
    userCard === 'partner'
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = userGradientColors;
  }

  if (
    userAnswer &&
    partnerAnswer &&
    userAnswer === partnerAnswer &&
    QnAData?.user1.id !== userAnswer &&
    userCard === 'partner'
  ) {
    outerGradientColors = partnerGradientColors;
    innerGradientColors = userGradientColors;
  } else if (
    userAnswer &&
    partnerAnswer &&
    userAnswer !== partnerAnswer &&
    QnAData?.user2.id === partnerAnswer &&
    userCard === 'partner'
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = partnerGradientColors;
  } else if (
    userAnswer &&
    partnerAnswer &&
    userAnswer !== partnerAnswer &&
    QnAData?.user1.id === partnerAnswer &&
    userCard === 'user'
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = partnerGradientColors;
  }

  if (
    userAnswer &&
    !partnerAnswer &&
    userCard === 'user' &&
    userAnswer === VARIABLES.user._id
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = userGradientColors;
  } else if (
    userAnswer &&
    !partnerAnswer &&
    userCard === 'partner' &&
    userAnswer === VARIABLES?.user?.partnerData?.partner?._id
  ) {
    outerGradientColors = outerGradientColors;
    innerGradientColors = userGradientColors;
  }

  // if (
  //   partnerAnswer &&
  //   !userAnswer &&
  //   userCard === 'partner' &&
  //   partnerAnswer === VARIABLES.user?.partnerData?.partner?._id
  // ) {
  //   console.log('line number 140', userCard);
  //   outerGradientColors = outerGradientColors;
  //   innerGradientColors = partnerGradientColors;
  // } else if (
  //   !userAnswer &&
  //   partnerAnswer &&
  //   userCard === 'user' &&
  //   partnerAnswer === VARIABLES?.user?._id
  // ) {
  //   console.log('line number 149');
  //   outerGradientColors = outerGradientColors;
  //   innerGradientColors = partnerGradientColors;
  // }

  return (
    <View style={styles.imageContainer}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={outerGradientColors}
        style={{
          ...styles.outerGradient,
          height:
            outerGradientColors[0] !== 'transparent'
              ? scaleNew(90)
              : innerGradientColors[0] !== 'transparent'
              ? scaleNew(80)
              : scaleNew(70),
          width:
            outerGradientColors[0] !== 'transparent'
              ? scaleNew(90)
              : innerGradientColors[0] !== 'transparent'
              ? scaleNew(80)
              : scaleNew(70),
        }}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={innerGradientColors}
          style={{
            ...styles.innerGradient,
            height:
              innerGradientColors[0] !== 'transparent'
                ? scaleNew(80)
                : scaleNew(70),
            width:
              innerGradientColors[0] !== 'transparent'
                ? scaleNew(80)
                : scaleNew(70),
          }}>
          {innerGradientColors[0] === 'transparent' ? (
            <GreyScaleImage
              //  source={{uri: imageUri}}
              style={styles.profileImage}
              type={userCard}
            />
          ) : (
            <ProfileAvatar
              type={userCard}
              style={styles.profileImage}
              //   imageUri={imageUri}
            />
          )}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleNew(28),
  },
  outerGradient: {
    width: scaleNew(90),
    height: scaleNew(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleNew(52),
  },
  innerGradient: {
    width: scaleNew(80),
    height: scaleNew(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleNew(50),
  },
  profileImage: {
    width: scaleNew(70),
    height: scaleNew(70),
    borderRadius: scaleNew(50),
    backgroundColor: colors.gray,
  },
});

export default ProfileImageGradient;
