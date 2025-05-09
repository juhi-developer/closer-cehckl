import {
  View,
  ImageBackground,
  StyleSheet,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import React from 'react';
import LocationPinMapSvg from '../../../../assets/svgs/locationPinMapSvg';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import {colors} from '../../../../styles/colors';

const Location = ({lat, long, sentByUser}) => {
  const prepareStaticMapUrl = (latitude, longitude) => {
    let baseURL = 'https://maps.googleapis.com/maps/api/staticmap?';
    let url = new URL(baseURL);
    let params = url.searchParams;
    params.append('center', `${latitude},${longitude}`);
    params.append('zoom', '18');
    params.append('size', '300x300');
    params.append('maptype', 'roadmap');
    params.append('key', 'AIzaSyC9GvyjT81OMWatHLczAlDI1B7ICtG_pEg');
    return url.toString();
  };
  const mapApi = prepareStaticMapUrl?.(lat, long);

  const openMaps = () => {
    const daddr = `${lat},${long}`;
    const company = Platform.OS === 'ios' ? 'apple' : 'google';
    Linking.openURL(`http://maps.${company}.com/maps?daddr=${daddr}`);
  };

  return (
    <View
      style={[
        styles.baseStyles,
        sentByUser ? styles.sentByUser : styles.sentByPartner,
        {
          backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
        },
      ]}
      // onPress={() => {
      //   openMaps();
      // }}
    >
      <ImageBackground
        source={{uri: mapApi}}
        style={styles.locationImage}
        borderRadius={scale(10)}>
        <LocationPinMapSvg />
      </ImageBackground>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  baseStyles: {
    padding: 4,
  },
  sentByUser: {
    backgroundColor: VARIABLES.themeData.strokeColor,
    alignSelf: 'flex-end',
    borderRadius: scale(15),
    borderBottomRightRadius: 0,
  },
  sentByPartner: {
    backgroundColor: VARIABLES.themeData.themeColor,
    alignSelf: 'flex-start',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
  },
  locationImage: {
    width: 200,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
