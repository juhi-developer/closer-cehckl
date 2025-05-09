import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import naclUtil from 'tweetnacl-util';
import {downloadAndDecryptFromS3} from '../../../../utils/helpers';
import {enqueueDownload} from '../../../../utils/DownloadManager';
import {scaleNew} from '../../../../utils/metrics2';
import {colors} from '../../../../styles/colors';
import FastImage from 'react-native-fast-image';

const ImageUploadCardSingleImage = ({url}) => {
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadFile = useCallback(async item => {
    const downloadTask = async () => {
      setImage(null);
      const path = RNFS.DocumentDirectoryPath + `/${item.url}`;

      const exists = await RNFS.exists(path);
      if (exists) {
        setImage('file://' + path);
      } else {
        setLoading(true);

        try {
          const nonce = naclUtil.decodeBase64(item.nonce);
          let data = await downloadAndDecryptFromS3(
            item.url,
            'profiles',
            nonce,
            progress => {
              // setProgress(progress);
            },
          );
          setLoading(false);
          setImage('file://' + RNFS.DocumentDirectoryPath + '/' + data);
        } catch (error) {
          console.log(error, 'cnjkewdncw');
        }
      }
    };
    enqueueDownload(downloadTask);
  }, []);

  useEffect(() => {
    loadFile(url);
    return () => {};
  }, [url]);
  return (
    <View>
      <FastImage
        style={styles.img}
        source={{
          uri: image,
        }}
      />
    </View>
  );
};

export default ImageUploadCardSingleImage;

const styles = StyleSheet.create({
  img: {
    width: scaleNew(50),
    height: scaleNew(64),
    borderRadius: scaleNew(8),
    marginEnd: scaleNew(6),
    resizeMode: 'cover',
    backgroundColor: colors.borderColor,
    // opacity: 0.48,
  },
});
