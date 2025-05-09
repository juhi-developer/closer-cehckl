import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyles';
import {scale} from '../utils/metrics';

export default function CenteredHeader(props) {
  const {leftPress, title, rightIcon, leftIcon, rightPress, titleStyle, style} =
    props;
  return (
    <View style={{...styles.container, ...style}}>
      {leftIcon ? (
        <Pressable hitSlop={30} onPress={leftPress}>
          {leftIcon}
        </Pressable>
      ) : (
        <View style={{width: scale(22)}} />
      )}
      {title ? (
        <Text style={{...globalStyles.regularLargeText, ...titleStyle}}>
          {title}
        </Text>
      ) : (
        <View />
      )}
      {rightIcon ? (
        <Pressable onPress={rightPress} hitSlop={30}>
          {rightIcon}
        </Pressable>
      ) : (
        <View style={{width: scale(22)}} />
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
    // backgroundColor: 'red',
    paddingVertical: scale(20),
    paddingBottom: scale(10),
  },
});
