import React, {useEffect} from 'react';
import {Modal, View, Image, Keyboard, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const OverlayLoader = ({visible}) => {
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={() => {}}>
      <View style={styles.fullScreenOverlay}>
        <Image
          style={styles.logo}
          source={require('../assets/images/logo_animaton_gif.gif')}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: width,
    height: height,
  },
  logo: {
    height: 70,
    width: 70,
  },
});

export default OverlayLoader;
