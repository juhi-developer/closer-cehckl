import React from 'react';
import {View, Text, Image, StyleSheet, Platform} from 'react-native';
import {scaleNew} from '../../../../utils/metrics2';
import {fonts} from '../../../../styles/fonts';
import AppButton from '../../../../components/appButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    padding: scaleNew(10),
    borderRadius: scaleNew(16),
    alignSelf: 'center',
    marginTop: scaleNew(10),
  },
  image: {
    width: scaleNew(329),
    height: scaleNew(329),
  },
  description: {
    fontSize: scaleNew(16),
    color: '#808491',
    marginTop: scaleNew(20),
    fontFamily: fonts.standardFont,
    textAlign: 'center',
  },
  button: {
    marginTop: scaleNew(22),
    marginHorizontal: scaleNew(64),
    borderRadius: scaleNew(100),
    height: scaleNew(44),
    paddingVertical: 0,
  },
  buttonText: {
    fontSize: scaleNew(14),
  },
  cameraIcon: {
    fontSize: scaleNew(12),
    color: '#595959',
    fontFamily: fonts.standardFont,
    marginTop: Platform.OS === 'ios' ? -scaleNew(5) : -scaleNew(3),
    includeFontPadding: false,
    textAlignVertical: 'bottom',
  },
  suggestionText: {
    fontSize: scaleNew(14),
    color: '#595959',
    marginVertical: scaleNew(24),
    fontFamily: fonts.standardFont,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'bottom',
  },
  suggestionContainer: {
    marginVertical: scaleNew(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const FeedEmptyState = React.memo(onSelectImages => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../../assets/images/feedEmpty.png')}
      />
      <Text style={styles.description}>
        A new home for photos from blurry nights and sunset drives! ✨
      </Text>
      <AppButton
        onPress={() => onSelectImages()} // Ensure onSelectImages is defined or passed correctly
        textStyle={styles.buttonText}
        style={styles.button}
        text="Add your first memory"
      />
      <View style={styles.suggestionContainer}>
        <Text style={styles.cameraIcon}>📸</Text>
        <Text style={styles.suggestionText}>
          {'  '}
          Start with pics from your last date?
        </Text>
      </View>
    </View>
  );
});

export default FeedEmptyState;
