import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import moment from 'moment';
import {globalStyles} from '../../../../styles/globalStyles';
import {scale} from '../../../../utils/metrics';

const TimeStamp = ({time, align}) => {
  return (
    <View style={{marginEnd: scale(6)}}>
      <Text style={styles.timestampText}>{moment(time).format('hh:mm A')}</Text>
    </View>
  );
};

export default TimeStamp;

const styles = StyleSheet.create({
  timestampText: {
    ...globalStyles.regularSmallText,
    fontSize: scale(12),
    textAlign: 'right',
    color: '#2F3A4E',
    opacity: 0.6,
    // marginRight: scale(12),
  },
});
