import React from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale} from '../../../../utils/metrics';
import {fonts} from '../../../../styles/fonts';
import {colors} from '../../../../styles/colors';
import {scaleNew} from '../../../../utils/metrics2';

const ChoiceGradientButton = ({
  choice,
  onPress,
  disabled,
  userChoice,
  partnerChoice,
  titleColor,
  descriptionColor,
  buttonColor,
  bottomBg,
  bgColor,
}) => {
  let outerGradientColors = ['transparent', 'transparent'];
  let innerGradientColors = ['transparent', 'transparent'];

  if (userChoice === partnerChoice && choice === userChoice) {
    outerGradientColors = ['#5E9CFF', '#B5D2FF'];
    innerGradientColors = ['#3759A1', '#F4BACB'];
  } else {
    if (choice === userChoice) {
      innerGradientColors = ['#5E9CFF', '#B5D2FF'];
    }
    if (choice === partnerChoice && userChoice !== undefined) {
      innerGradientColors = ['#3759A1', '#F4BACB'];
    }
  }

  return (
    <Pressable
      onPress={() => onPress(choice)}
      disabled={disabled}
      style={styles.pressableStyle}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        locations={[0.2, 0.9]}
        useAngle
        angle={100}
        colors={outerGradientColors}
        style={{
          ...styles.outerGradient,
          padding:
            outerGradientColors[0] !== 'transparent' ? scaleNew(2.2) : scale(0),
        }}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          locations={[0.2, 0.9]}
          useAngle
          angle={100}
          colors={
            innerGradientColors.length > 1
              ? innerGradientColors
              : outerGradientColors
          }
          style={{
            ...styles.innerGradient,
            padding:
              innerGradientColors[0] !== 'transparent'
                ? scaleNew(2.2)
                : scale(0),
          }}>
          <View style={{...styles.viewTypeChoice, backgroundColor: bottomBg}}>
            <Text
              style={{
                ...styles.textTypeChoice,
                color: descriptionColor,
              }}>
              {choice}{' '}
            </Text>
          </View>
        </LinearGradient>
      </LinearGradient>
    </Pressable>
  );
};

export default ChoiceGradientButton;

const styles = StyleSheet.create({
  viewMainTypeChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(20),
    marginBottom: scale(50),
  },
  textTypeChoice: {
    fontFamily:
      Platform.OS === 'ios' ? fonts.italicCaveat : fonts.italicCaveatAndroid,
    fontSize: scaleNew(18.77),
    color: colors.white,
    paddingHorizontal: 2,
  },
  viewTypeChoice: {
    paddingHorizontal: scaleNew(24),
    height: scaleNew(34),
    borderRadius: scaleNew(14.69),

    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGradient: {
    padding: scaleNew(2.2),
    borderRadius: scale(16),
  },
  outerGradient: {
    padding: scaleNew(2.2),
    borderRadius: scaleNew(14.69),
  },
});
