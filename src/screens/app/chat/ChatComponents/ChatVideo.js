import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  StyleSheet,
  NativeModules,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {APP_IMAGE} from '../../../../utils/constants';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import RNFS from 'react-native-fs';
import {AWS_URL_S3} from '../../../../utils/urls';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../../../styles/globalStyles';
import VideoPlayer from 'react-native-video-controls';
import {downloadAndDecryptFromS3, generateID} from '../../../../utils/helpers';
import naclUtil from 'tweetnacl-util';
import * as Progress from 'react-native-progress';
import {createVideoThumbnail, clearCache} from 'react-native-compressor';
import {createThumbnail} from 'react-native-create-thumbnail';
import {useRealm} from '@realm/react';

import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../../styles/colors';

const imageWidth = 200;
const imageHeight = 250;

const ChatVideo = ({item, sentByUser, onLongPress}) => {
  const realm = useRealm();

  const videoRef = useRef(null);
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');

  const [fullscreen, setfullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [retry, setRetry] = useState(false);

  const loadFile = useCallback(
    async uri => {
      if (uri.startsWith('/') || uri.startsWith('file://')) {
        console.log('chat video uri if', uri, Platform.OS);
        setVideo(`file://${uri}`);
        setImage(item.thumbnailImage);
      } else {
        const path = RNFS.DocumentDirectoryPath + `/${uri}`;

        const exists = await RNFS.exists(path);
        if (exists) {
          setVideo('file://' + path);
          setImage(
            `file://${RNFS.DocumentDirectoryPath}/${item.thumbnailImage}`,
          );
        } else if (!sentByUser) {
          console.log('chat video uri elseeeeee', uri, Platform.OS);
          setProgress(0);
          setLoading(true);
          try {
            const nonce = naclUtil.decodeBase64(item.nonce);
            let data = await downloadAndDecryptFromS3(
              uri,
              'chat',
              nonce,
              progress => {
                setProgress(progress);
              },
            );
            setLoading(false);

            const thumbnail = await createThumbnail({
              url: 'file://' + RNFS.DocumentDirectoryPath + '/' + uri,
              timeStamp: 1000,
            });
            setImage(thumbnail.path);
            setVideo('file://' + RNFS.DocumentDirectoryPath + '/' + data);

            const thumbnailFilename = generateID();
            const newThumbnailPath = `${RNFS.DocumentDirectoryPath}/${thumbnailFilename}.jpg`;
            await RNFS.copyFile(thumbnail.path, newThumbnailPath);

            // Begin write transaction
            realm.write(() => {
              // Find the object with the matching _id
              let chatVideo = realm
                .objects('Message')
                .filtered(`_id = "${item._id}"`)[0];
              // Update the thumbnailImage property
              if (chatVideo) {
                chatVideo.thumbnailImage = `${thumbnailFilename}.jpg`;
              }
            });
          } catch (error) {
            setRetry(true);
            setLoading(false);
          }
        }
      }
    },
    [item.message],
  );

  useEffect(() => {
    loadFile(item.message);
    return () => {};
  }, [item.message, loadFile]);

  return (
    <View>
      {loading ? (
        <View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              width: imageWidth,
              height: imageHeight,
              backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
              ...styles.container,
            },
            !sentByUser
              ? {
                  borderBottomLeftRadius: 0,
                }
              : {
                  borderBottomRightRadius: 0,
                },
          ]}>
          <ActivityIndicator size="large" />
          {/* <Progress.Circle showsText size={50} progress={progress} /> */}
        </View>
      ) : (
        <Pressable
          style={[
            {
              backgroundColor: !sentByUser
                ? VARIABLES.themeData.strokeColor
                : VARIABLES.themeData.themeColor,
              ...styles.container,
            },
            !sentByUser
              ? {
                  borderBottomLeftRadius: 0,
                }
              : {
                  borderBottomRightRadius: 0,
                },
          ]}
          onPress={() => {
            setfullscreen(true);
          }}
          onLongPress={() => {
            onLongPress(item);
          }}>
          <>
            <FastImage
              source={{
                uri: image,
              }}
              style={[
                {...styles.videoStyle},
                !sentByUser
                  ? {
                      borderBottomLeftRadius: 0,
                    }
                  : {
                      borderBottomRightRadius: 0,
                    },
              ]}
            />
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.1)']}
              style={{
                position: 'absolute',
                borderTopStartRadius: 100,
                right: 6,
                bottom: scale(3),
                width: scale(69),
                height: 20,
              }}
            />
          </>

          <View style={styles.videoOverlay}>
            {!loading && (
              <View
                style={{
                  width: scale(36),
                  height: scale(36),
                  borderRadius: scale(25),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={APP_IMAGE.playIcon}
                  style={{
                    width: scale(18),
                    height: scale(18),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
          </View>

          {fullscreen && (
            <Modal
              visible={fullscreen}
              onRequestClose={() => setfullscreen(false)}
              transparent>
              <View
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT,
                }}>
                <VideoPlayer
                  disablePlayPause
                  disableFullscreen={false}
                  toggleResizeModeOnFullscreen={false}
                  ref={videoRef}
                  source={{
                    uri: video,
                  }}
                  style={[
                    {
                      width: SCREEN_WIDTH,
                      height: SCREEN_HEIGHT,
                      backgroundColor: '#000',
                    },
                    !sentByUser
                      ? {
                          borderBottomLeftRadius: 0,
                        }
                      : {
                          borderBottomRightRadius: 0,
                        },
                  ]}
                  onBack={() => {
                    setfullscreen(false);
                  }}
                />
              </View>
            </Modal>
          )}
        </Pressable>
      )}
    </View>
  );
};

export default ChatVideo;

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(10),
    padding: scale(3),
  },
  videoStyle: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#000',
    borderRadius: scale(10),
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
