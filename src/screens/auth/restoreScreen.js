/* eslint-disable react-native/no-inline-styles */
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AppView from '../../components/AppView';
import {colors} from '../../styles/colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  globalStyles,
} from '../../styles/globalStyles';

import {scale} from '../../utils/metrics';
import {fonts} from '../../styles/fonts';
import RestoreModal from '../../components/Modals/RestoreModal';

export default function RestoreScreen(props) {
  const [restoreModal, setRestoreModal] = useState(false);

  return (
    <AppView
      customContainerStyle={styles.container}
      scrollContainerRequired={true}
      isScrollEnabled={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backgroundColor,
        }}>
        <Text
          style={{
            fontSize: scale(24),
            color: colors.text,
            marginTop: scale(30),
            fontFamily: fonts.semiBoldFont,
            alignSelf: 'center',
          }}>
          Restore Backup
        </Text>
      </View>
      <RestoreModal
        modalVisible={restoreModal}
        setModalVisible={setRestoreModal}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundColor,
    // flex: 1
  },
  progressBar: {
    height: 12,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.grey1,
    overflow: 'hidden',
    borderRadius: 40,
    marginTop: 12,
    marginBottom: 14,
  },
});
