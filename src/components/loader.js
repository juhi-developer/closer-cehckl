import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../styles/globalStyles';
import {colors} from '../styles/colors';

// top: SCREEN_HEIGHT / 2.5, left: SCREEN_WIDTH / 3

const Loader = ({container = {}}) => {
  return (
    <View
      style={{
        position: 'absolute',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        ...container,
      }}>
      <Image
        style={{height: 70, width: 70}}
        source={require('../assets/images/logo_animaton_gif.gif')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    backgroundColor: '#rgba(0,0,0,0.2)',
    top: 200,
    position: 'absolute',
    // marginTop:SCREEN_HEIGHT / 8
  },
});

export default Loader;
