import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {APP_IMAGE} from '../utils/constants';
import RNFS from 'react-native-fs';
import {AWS_URL_S3} from '../utils/urls';
const Highlightcomponent = ({uri, name, styles}) => {
  const [image, setimage] = useState('');
  const loadFile = uri1 => {
    const path = RNFS.DocumentDirectoryPath + `/${name}`;

    // const path = RNFS.DocumentDirectoryPath + `/CloserStories/${name}`;
    RNFS.exists(path)
      .then(async exists => {
        if (exists) {
          setimage(`file://${path}`);
          //   return `file://${path}`;
        } else {
          setimage(`file://${path}`);
        }
      })
      .catch(err => {
        console.log('eroor', err);
      });
  };

  useEffect(() => {
    loadFile();
  }, [name]);

  return (
    <>
      {image?.length == 0 ? (
        <View style={styles.userPic} />
      ) : (
        <FastImage
          source={{
            uri: image,
          }}
          style={styles.userPic}
          defaultSource={APP_IMAGE.profileAvatar}
        />
      )}
    </>
  );
};

export default Highlightcomponent;
