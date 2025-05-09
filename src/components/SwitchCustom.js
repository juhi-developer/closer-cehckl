import {Switch} from 'react-native-switch';
import {View} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../styles/colors';

export default function SwitchCustom(props) {
  return (
    <View
      style={{
        borderRadius: 32,
        backgroundColor: props.value ? colors.blue1 : '#C0C0C0',
        padding: 1.5,
      }}>
      <Switch
        value={props.value}
        onValueChange={props.onValueChange}
        disabled={props.disabled}
        activeText={''}
        inActiveText={''}
        circleSize={18}
        barHeight={24}
        circleBorderWidth={2}
        backgroundActive={'#F1F4F9'}
        backgroundInactive={colors.white}
        circleActiveColor={colors.blue1}
        circleInActiveColor={'#C0C0C0'}
        //  renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0,
        }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2.2} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
    </View>
  );
}
