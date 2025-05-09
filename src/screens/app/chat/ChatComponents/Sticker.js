/* eslint-disable react-native/no-inline-styles */
import {View, Image, StyleSheet, Platform} from 'react-native';
import React from 'react';
import {scale} from '../../../../utils/metrics';
import {removeExtension} from '../../../../utils/helpers';
import QuotedMessage from './QoutedMessages/QuotedMessage';
import {VARIABLES} from '../../../../utils/variables';
import {SCREEN_WIDTH} from '../../../../styles/globalStyles';
import FastImage from 'react-native-fast-image';
import {STICKERS} from '../../../../utils/constants';

const Sticker = ({sticker, quoteMessage, sentByUser}) => {
  return (
    <View
      style={[
        {
          //  backgroundColor: VARIABLES.themeData.strokeColor,
          paddingStart: sentByUser ? scale(10) : 0,
          paddingEnd: sentByUser ? 0 : scale(10),
          //  paddingVertical: scale(12),
          borderRadius: scale(15),
          maxWidth: SCREEN_WIDTH * 0.6,
        },
      ]}>
      {quoteMessage && <QuotedMessage item={quoteMessage} />}
      <FastImage
        source={STICKERS[Number(sticker)]?.sticker}
        //  source={{uri: Platform.OS === 'android' ? sticker : `${sticker}.png`}}
        style={styles.emojiIconStyles}
        resizeMode="contain"
      />
    </View>
  );
};

export default Sticker;

const styles = StyleSheet.create({
  emojiIconStyles: {
    width: scale(106),
    height: scale(95),
    borderRadius: scale(10),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: scale(18),
  },
});
