/* eslint-disable react-native/no-inline-styles */
import {View, Text, Pressable, Platform} from 'react-native';
import React from 'react';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {scaleNew} from '../../../../utils/metrics2';
import {fonts} from '../../../../styles/fonts';
import {useAppContext} from '../../../../utils/VariablesContext';

const BeginJourney = ({setJourneyModalVisible, closerJourney, eveningMode}) => {
  const {hornyMode} = useAppContext();

  const closerJourney2 = closerJourney || {};

  const count = Object.values(closerJourney2).filter(val => val).length;

  if (Object.values(closerJourney2)?.length === 0) {
    return <View />;
  }
  if (count === 5) {
    return <View />;
  }
  return (
    <Pressable
      onPress={() => {
        setJourneyModalVisible(true);
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scaleNew(12),
        paddingVertical: scaleNew(10),
        marginHorizontal: scaleNew(20),
        marginTop: scaleNew(25),

        backgroundColor: hornyMode
          ? '#331A4F'
          : eveningMode
          ? '#FFFFFF35'
          : '#FFFFFF66',
        borderRadius: 12,
      }}>
      <CircularProgressBase
        value={(count / 5) * 100}
        radius={scaleNew(17)}
        activeStrokeColor={hornyMode ? '#fff' : '#124698'}
        activeStrokeSecondaryColor={hornyMode ? '#fff' : '#124698'}
        duration={1000}
        activeStrokeWidth={scaleNew(4)}
        inActiveStrokeWidth={scaleNew(4)}
        inActiveStrokeColor="#B3B5BA3B"
      />
      <View style={{marginLeft: 15}}>
        <Text
          style={{
            fontFamily: fonts.semiBoldFont,
            fontSize: scaleNew(12),
            color: hornyMode || eveningMode ? '#ffffff' : '#808491',
          }}>
          Begin your Closer journey
        </Text>
        <Text
          style={{
            fontFamily: fonts.standardFont,
            fontSize: scaleNew(12),
            color: hornyMode || eveningMode ? '#ffffff' : '#808491',
            opacity: 0.58,
            marginTop: Platform.OS === 'ios' ? scaleNew(3) : 0,
          }}>
          {count}/5 Completed
        </Text>
      </View>
    </Pressable>
  );
};

export default BeginJourney;
