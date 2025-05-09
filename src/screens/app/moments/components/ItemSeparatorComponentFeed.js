import React from 'react';
import {View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  separator: {
    marginVertical: 1,
  },
});

const ItemSeparatorComponentFeed = React.memo(() => {
  return <View style={styles.separator} />;
});

export default ItemSeparatorComponentFeed;
