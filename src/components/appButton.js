import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {colors} from '../styles/colors';
import {fonts} from '../styles/fonts';
import {scale} from '../utils/metrics';

export default function AppButton(props) {
  const {text, onPress, disabled = false} = props;
  return (
    <Pressable
      testID={props.testID}
      disabled={disabled}
      onPress={onPress}
      style={{...styles.button, ...props.style}}>
      <Text style={{...styles.buttonText, ...props.textStyle}}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue1,
    // height:50,
    paddingVertical: scale(12),
    borderRadius: scale(10),
  },
  buttonText: {
    // color:'#fff',
    color: colors.white,
    // fontWeight:'bold',
    fontFamily: fonts.standardFont,
    includeFontPadding: false,
    fontSize: scale(20),
  },
});
