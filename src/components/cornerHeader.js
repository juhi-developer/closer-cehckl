import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyles';
import {scale} from '../utils/metrics';
import {scaleNew} from '../utils/metrics2';

export default function CornerHeader(props) {
  const {
    leftPress,
    titleBox,
    rightIcon,
    leftIcon,
    rightPress,
    titleStyle,
    hitSlop = {},
    container = {},
  } = props;
  return (
    <View style={{...styles.container, ...container}}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        {leftIcon ? (
          <Pressable
            hitSlop={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
            onPress={leftPress}>
            {leftIcon}
          </Pressable>
        ) : (
          <View />
        )}
        {titleBox}
      </View>
      {rightIcon ? (
        <Pressable
          onPress={rightPress}
          hitSlop={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}>
          {rightIcon}
        </Pressable>
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    // backgroundColor: 'blue',
    paddingTop: scaleNew(20),
    paddingBottom: scaleNew(8),
    // width: '100%'
    //  backgroundColor: 'yellow',
  },
});
