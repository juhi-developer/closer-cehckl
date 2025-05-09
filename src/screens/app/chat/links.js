/* eslint-disable react-native/no-inline-styles */
import {View, Text, ImageBackground, Pressable, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinkPreview from '@lowkey/react-native-link-preview';
import {globalStyles} from '../../../styles/globalStyles';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import {scale} from '../../../utils/metrics';

const Links = ({item, setData, handlePresentReplyModalPress, strokeColor}) => {
    console.log(item, "vgubhjknl")
  const [metaInfo, setmetaInfo] = useState(false);

  const getLinks = () => {
    LinkPreview.generate(item.message).then(data => {
      setmetaInfo(data.imageURL);
    });
  };
  useEffect(() => {
    getLinks();
  });
  return (
    <View style={{}}>
      <ImageBackground
        source={{uri: metaInfo}}
        style={{
          width: '100%',
          height: scale(100),
          backgroundColor: strokeColor,
        }}
      />

      <Pressable
        style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        }}
        onPress={() => {
          Linking.openURL(item.message);
        }}>
        <View style={{position: 'absolute', top: scale(10), right: scale(6)}}>
          <Pressable
            onPress={() => {
              setData(item);
              handlePresentReplyModalPress();
            }}>
            <MoreVerticleIconSvg fill={'#fff'} />
          </Pressable>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: scale(6),
            left: scale(6),
            right: scale(6),
          }}>
          <Text
            style={{...globalStyles.regularMediumText, color: '#fff'}}
            numberOfLines={1}>
            {item?.message}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Links;
