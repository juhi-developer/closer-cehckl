import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
import RNFS from 'react-native-fs';
import naclUtil from 'tweetnacl-util';

import {scale} from '../utils/metrics';
import {colors} from '../styles/colors';
import {fonts} from '../styles/fonts';
import {VARIABLES} from '../utils/variables';
import {downloadAndDecryptFromS3} from '../utils/helpers';
import {enqueueDownload} from '../utils/DownloadManager';
import {scaleNew} from '../utils/metrics2';
const {width} = Dimensions.get('window');
const numColumns = 3;
const itemWidth = (width - (numColumns + 1) * scale(1)) / numColumns;

const styles = StyleSheet.create({
  container: index => ({
    flex: 1,
    marginHorizontal: index % 3 === 1 ? scale(2) : 0,
  }),
  postImage: {
    flex: 1,
    width: itemWidth,
    height: itemWidth,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryIcon: {
    width: scale(24),
    height: scale(24),
  },
  retryText: {
    fontFamily: fonts.regularFont,
    fontSize: scale(14),
    color: colors.black,
    marginTop: scale(5),
  },
  multipleImagesIcon: {
    position: 'absolute',
    top: scaleNew(8),
    right: scaleNew(7),
    width: scale(14),
    height: scale(14),
    zIndex: 10,
  },
});

export const FeedCardGrid = React.memo(({index, onPressCard, item}) => {
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertClicked, setAlertClicked] = useState(false);

  const containerStyle = useMemo(() => styles.container(index), [index]);

  const alertDownloadFailed = useCallback(() => {
    Alert.alert(
      'Download failed',
      "Can't download. Please ask that it be resent to you.",
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );
  }, []);

  const loadFile = useCallback(async () => {
    const downloadTask = async () => {
      const sentByUser = item?.user?._id === VARIABLES?.user?._id;
      const path = `${RNFS.DocumentDirectoryPath}/${item.url}`;

      const exists = await RNFS.exists(path);
      if (exists) {
        setImage(`file://${path}`);
      } else if (!sentByUser) {
        setProgress(0);
        setLoading(true);
        try {
          const nonce = naclUtil.decodeBase64(item.nonce);
          const data = await downloadAndDecryptFromS3(
            item.url,
            'profiles',
            nonce,
            progress => {
              setProgress(progress);
              console.log('progresss', progress);
            },
          );
          setImage(`file://${RNFS.DocumentDirectoryPath}/${data}`);
          setLoading(false);
        } catch (error) {
          console.error('Error downloading and decrypting file:', index, error);
          setLoading(false);
          setRetry(true);
          if (alertClicked) {
            setAlertClicked(false);
            alertDownloadFailed();
          }
        }
      }
    };
    enqueueDownload(downloadTask);
  }, [item.url, item.nonce, alertClicked]);

  useEffect(() => {
    loadFile();
    return () => {
      // Cleanup if needed
    };
  }, [loadFile]);

  return (
    <Pressable style={{flex: 1}} onPress={onPressCard}>
      <View style={containerStyle} key={item._id}>
        {retry ? (
          <RetryComponent
            setRetry={setRetry}
            setAlertClicked={setAlertClicked}
            loadFile={loadFile}
          />
        ) : (
          <ContentComponent
            loading={loading}
            progress={progress}
            image={image}
            item={item}
          />
        )}
      </View>
    </Pressable>
  );
});

const RetryComponent = ({setRetry, setAlertClicked, loadFile}) => (
  <View style={styles.postImage}>
    <Pressable
      style={{alignItems: 'center'}}
      onPress={() => {
        setAlertClicked(true);
        setRetry(false);
        setTimeout(() => {
          loadFile();
        }, 200);
      }}>
      <Image
        style={styles.retryIcon}
        source={require('../assets/images/retry_icon.png')}
      />
      <Text style={styles.retryText}>Download</Text>
    </Pressable>
  </View>
);

const ContentComponent = ({loading, progress, image, item}) =>
  loading ? (
    <View style={styles.postImage}>
      <ActivityIndicator size="large" />
      {/* <Progress.Circle showsText size={70} progress={progress} /> */}
    </View>
  ) : (
    <>
      {item?.images?.length > 1 && (
        <Image
          style={styles.multipleImagesIcon}
          source={require('../assets/images/multipleImagesIcon.png')}
        />
      )}
      <FastImage
        onError={e => console.log(`Error loading image${image}`)}
        source={{uri: image}}
        style={styles.postImage}
        resizeMode={item.renderType || 'cover'}
      />
    </>
  );
