import {View, Image, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {scale} from '../../../../utils/metrics';
import {removeExtension} from '../../../../utils/helpers';
import QuotedMessage from './QoutedMessages/QuotedMessage';
import {VARIABLES} from '../../../../utils/variables';
import {SCREEN_WIDTH} from '../../../../styles/globalStyles';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-animatable';
import {colors} from '../../../../styles/colors';

const Gif = ({sticker, quoteMessage, item, openImage, onLongPress}) => {
  return (
    <View
      style={[
        quoteMessage && {
          backgroundColor: VARIABLES.themeData.strokeColor,
          paddingHorizontal: scale(10),
          paddingVertical: scale(12),
          borderRadius: scale(15),
          maxWidth: SCREEN_WIDTH * 0.6,
        },
      ]}>
      {quoteMessage && <QuotedMessage item={quoteMessage} />}
      <Pressable
        onLongPress={() => {
          onLongPress(item);
        }}
        onPress={() => openImage(sticker)}>
        <Image
          source={{
            uri: sticker,
          }}
          style={{
            ...styles.emojiIconStyles,
            //  backgroundColor: colors.gray,
            height:
              item?.imageWidth > item?.imageHeight ? scale(200) : scale(280),
          }}
          resizeMode="cover"
        />
      </Pressable>
    </View>
  );
};

export default Gif;

const styles = StyleSheet.create({
  emojiIconStyles: {
    width: scale(240),
    height: scale(190),
    borderRadius: scale(10),
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: VARIABLES.themeData.themeColor,
  },
});
