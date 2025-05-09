import {View, Text, Image} from 'react-native';
import React from 'react';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import FastImage from 'react-native-fast-image';
import {ProfileAvatar} from './ProfileAvatar';

const GreyScaleImage = ({source, type, defaultSource, style}) => {
  return (
    <Grayscale>
      <ProfileAvatar type={type} style={style} />
      {/* <Image source={source} style={style} /> */}
    </Grayscale>
  );
};

export default GreyScaleImage;
