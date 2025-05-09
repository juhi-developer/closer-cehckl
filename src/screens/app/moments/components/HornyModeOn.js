/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import moment from 'moment';
import {useAppContext} from '../../../../utils/VariablesContext';
import {fonts} from '../../../../styles/fonts';
import {colors} from '../../../../styles/colors';
import {scaleNew} from '../../../../utils/metrics2';

const HornyModeOn = ({onPressHornyExit}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const {hornyModeTime: givenTimestamp, sethornyMode} = useAppContext();
  useEffect(() => {
    const givenTime = moment(givenTimestamp);

    const endTime = givenTime.add(30, 'minutes');
    const updateTimer = () => {
      const now = moment();
      const duration = moment.duration(endTime.diff(now));

      if (duration.asSeconds() <= 0) {
        setTimeLeft('00:00');

        sethornyMode(false);
        return;
      }

      const minutes = Math.floor(duration.minutes())
        .toString()
        .padStart(2, '0');
      const seconds = Math.floor(duration.seconds())
        .toString()
        .padStart(2, '0');

      setTimeLeft(`${minutes}:${seconds}`);
    };

    updateTimer(); // Update immediately
    const interval = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [givenTimestamp]);

  return (
    <View
      style={{
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',

        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        height: scaleNew(38),
        marginTop: scaleNew(12),
        marginBottom: scaleNew(12),
        marginHorizontal: scaleNew(28),
        paddingHorizontal: scaleNew(14),
        //  paddingVertical: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontFamily: fonts.semiBoldFont,
          color: '#E0E0E0',
          lineHeight: scaleNew(18),
          fontSize: scaleNew(12),
        }}>
        Horny mode on 😈
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text
          style={{
            fontFamily: fonts.standardFont,
            color: '#E0E0E0',
            //   lineHeight: scaleNew(18),
            fontSize: scaleNew(12),
            marginBottom: -scaleNew(2),
          }}>
          {timeLeft}
        </Text>
        <Pressable onPress={onPressHornyExit}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontFamily: fonts.standardFont,
              color: '#C52828',
              // lineHeight: scaleNew(18),
              fontSize: scaleNew(12),
              marginStart: scaleNew(10),
            }}>
            Turn Off
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default HornyModeOn;
