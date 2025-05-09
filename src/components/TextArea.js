import {StyleSheet, TextInput, View, ViewStyle} from 'react-native';
import React from 'react';
import {getColorCodeWithOpactiyNumber} from '../utils/helpers';
import {colors} from '../styles/colors';
import {scale} from '../utils/metrics';
import {fonts} from '../styles/fonts';

const TextArea = props => {
  const {
    placeholderText,
    placeholderTextColor,
    textInputStyles = {},
    inputHeight = 100,
    val,
    setVal,
    onFocus,
    onBlur,
  } = props;
  return (
    <View>
      <TextInput
        placeholder={placeholderText}
        style={{
          ...styles.textInputStyles,
          ...textInputStyles,
          minHeight: inputHeight,
          maxHeight: inputHeight + 100,
          //   height: inputHeight,
        }}
        multiline
        placeholderTextColor={
          placeholderTextColor !== undefined
            ? placeholderTextColor
            : getColorCodeWithOpactiyNumber(colors.black, '60')
        }
        value={val}
        onChangeText={text => setVal?.(text)}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        maxLength={props.maxLength}
      />
    </View>
  );
};

export default TextArea;

const styles = StyleSheet.create({
  textInputStyles: {
    padding: 14,
    fontSize: scale(14),
    fontFamily: fonts.regular,
    color: colors.black,
    borderWidth: 1.2,
    borderColor: colors.white,
    borderRadius: 4,
    marginTop: 15,
    textAlignVertical: 'top',
    paddingTop: 10,
    backgroundColor: colors.white,
  },
});
