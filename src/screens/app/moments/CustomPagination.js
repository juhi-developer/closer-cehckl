import React from 'react';
import {StyleSheet} from 'react-native';
import {Pagination} from 'react-native-swiper-flatlist';

const styles = StyleSheet.create({
  paginationContainer: {
    // top: 0,
  },
  pagination: {
    borderRadius: 20,
    width: 6,
    height: 6,
    marginHorizontal: 2,
  },
});

export const CustomPagination = props => {
  return (
    <Pagination
      {...props}
      paginationStyle={styles.paginationContainer}
      paginationStyleItem={styles.pagination}
      paginationDefaultColor="#D9D9D9"
      paginationActiveColor="#434549"
    />
  );
};
