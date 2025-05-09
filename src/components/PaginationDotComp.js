/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {scale} from '../utils/metrics';

export default function PaginationDotComp({
  currentIndex,
  totalDots,
  activeColor = '#434549',
  inactiveColor = '#D9D9D9',
  size = 6,
  viewStyle,
}) {
  return (
    <View style={{...styles.paginationContainer, ...viewStyle}}>
      {Array.from({length: totalDots}).map((_, index) => (
        <View
          key={index}
          style={{
            // width: size,
            // height: size,
            width: index === currentIndex ? size * 1.2 : size,
            height: index === currentIndex ? size * 1.2 : size,
            borderRadius: size,
            marginHorizontal: 3,
            backgroundColor:
              index === currentIndex ? activeColor : inactiveColor,
            // marginTop: scale(-24),
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
