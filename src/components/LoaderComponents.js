import React from 'react';
import {Skeleton} from 'moti/skeleton';
import {View, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const MotiLoaderDetail = props => {
  return (
    <View
      style={{marginTop: 24, justifyContent: 'center', marginHorizontal: 24}}>
      <Skeleton colorMode={'light'} width={'100%'} height={130} />
    </View>
  );
};

export default function MotiLoader(props) {
  return (
    <View
      style={{marginTop: 24, justifyContent: 'center', marginHorizontal: 24}}>
      <Skeleton colorMode={'light'} width={props.width} height={props.height} />
    </View>
  );
}

export const MotiLoaderRowMultiple = props => {
  return (
    <View
      style={{
        marginTop: 16,
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <Skeleton colorMode={'light'} width={windowWidth / 2.35} height={150} />
      <Skeleton colorMode={'light'} width={windowWidth / 2.35} height={150} />
    </View>
  );
};

const styles = StyleSheet.create({});