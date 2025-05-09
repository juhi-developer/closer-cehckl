/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import {VARIABLES} from '../../../../utils/variables';
import {scale} from '../../../../utils/metrics';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import QuotedMessage from './QoutedMessages/QuotedMessage';
import {colors} from '../../../../styles/colors';

const Emoji = ({quoteMessage, emoji, sentByUser}) => {
  return (
    <View
      style={[
        {
          backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
          borderBottomRightRadius: sentByUser ? 0 : scale(12),
          borderBottomStartRadius: sentByUser ? scale(12) : 0,
          paddingHorizontal: scale(16),
          paddingBottom: scale(18),
          paddingTop: scale(4),
          borderRadius: scale(15),
          maxWidth: SCREEN_WIDTH * 0.6,
        },
      ]}>
      {quoteMessage && <QuotedMessage item={quoteMessage} />}
      <Text style={{fontSize: scale(56), textAlign: 'center', color: '#000'}}>
        {emoji}
      </Text>
    </View>
  );
};

export default Emoji;
