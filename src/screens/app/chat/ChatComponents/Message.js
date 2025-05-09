/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {SCREEN_WIDTH, globalStyles} from '../../../../styles/globalStyles';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import QuotedMessage from './QoutedMessages/QuotedMessage';
//import HighlightText from '@sanar/react-native-highlight-text';
import {colors} from '../../../../styles/colors';

const Message = ({
  message,
  sentByUser,
  quoteMessage,
  wordMatch,
  index,
  itemId,
}) => {
  return (
    <View
      style={[
        styles.baseStyles,
        sentByUser ? styles.sentByUser : styles.sentByPartner,
        {
          backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
          // backgroundColor: sentByUser
          //   ? VARIABLES.themeData.strokeColor
          //   : VARIABLES.themeData.themeColor,
        },
        quoteMessage && {
          //  backgroundColor: VARIABLES.themeData.strokeColor,
          backgroundColor: '#FFFFFF',
          paddingHorizontal: scale(10),
        },
      ]}>
      {quoteMessage && <QuotedMessage item={quoteMessage} />}
      <View>
        <Text
          // highlightStyle={{
          //   backgroundColor: '#619FFF',
          // }}
          // searchWords={wordMatch}
          // textToHighlight={`${message}         `}
          style={{
            ...globalStyles.regularMediumText,
            ///flex: 1,
            padding: scale(12),
            paddingTop: !quoteMessage ? scale(10) : scale(4),
            paddingStart: quoteMessage ? 0 : 12,
          }}>
          {`${message}`}
          <Text
            style={{
              color: 'transparent',
              fontSize: scale(8),
            }}>
            cck ksss dkd dk
          </Text>
        </Text>
      </View>
      {/* <Highlight
        highlightColor={
          !sentByUser
            ? VARIABLES.themeData.strokeColor
            : VARIABLES.themeData.themeColor
        }
        highlightTextColor={colors.black}
        wordMatch={["Lorem oo"]}>
        {message}
      </Highlight> */}
      {/* <Highlight
  highlightColor="blue"
  highlightTextColor="white"
  wordMatch={['matchig']}
>
  Highlight matching words in a sentence!
</Highlight> */}
      {/* <Text
        style={[
          globalStyles.regularMediumText,
          quoteMessage && {paddingLeft: scale(10)},
        ]}>
        {message}
      </Text> */}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  baseStyles: {
    //  maxWidth: SCREEN_WIDTH * 0.6,
    paddingEnd: scale(12),

    // minWidth: scale(110)
  },
  sentByUser: {
    backgroundColor: VARIABLES.themeData.strokeColor,
    // alignSelf: 'flex-end',
    borderRadius: scale(15),
    borderBottomRightRadius: 0,
  },
  sentByPartner: {
    backgroundColor: VARIABLES.themeData.themeColor,
    // alignSelf: 'flex-start',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
  },
});
