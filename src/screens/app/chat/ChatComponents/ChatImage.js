/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import RNFS from 'react-native-fs';
import * as Sentry from '@sentry/react-native';
import {downloadAndDecryptFromS3} from '../../../../utils/helpers';
import naclUtil from 'tweetnacl-util';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '../../../../styles/fonts';
import {colors} from '../../../../styles/colors';
import {useRealm} from '@realm/react';

const imageWidth = 200;
const imageHeight = 250;

const ChatImage = ({item, sentByUser, openImage, onLongPress, index}) => {
  const realm = useRealm();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [progress, setProgress] = useState(0);
  const [retry, setRetry] = useState(false);
  const [alertClicked, setAlertClicked] = useState(false);

  const alertDownloadFailed = () =>
    Alert.alert(
      'Download failed',
      `Can't download. Please ask that it be resent to you.`,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );

  const loadFile = useCallback(
    async uri => {
      setImage('');
      if (uri.startsWith('/') || uri.startsWith('file://')) {
        setImage('file://' + uri);
      } else {
        const path = RNFS.DocumentDirectoryPath + `/${uri}`;
        const exists = await RNFS.exists(path);

        if (exists) {
          setImage('file://' + path);
          if (item?.downloadFailed) {
            realm.write(() => {
              // Find the object with the matching _id
              let message = realm
                .objects('Message')
                .filtered(`_id = "${item._id}"`)[0];
              if (message) {
                console.log('message found', message);
                message.downloadFailed = false;
              }
            });
          }
        } else if (!sentByUser) {
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
            setImage('file://' + RNFS.DocumentDirectoryPath + '/' + data);
            //   setImage(data);
          } catch (error) {
            if (item?.downloadFailed) {
              if (alertClicked) {
                setAlertClicked(false);
                alertDownloadFailed();
              }
            } else {
              realm.write(() => {
                // Find the object with the matching _id
                let message = realm
                  .objects('Message')
                  .filtered(`_id = "${item._id}"`)[0];
                if (message) {
                  console.log('message found', message);
                  message.downloadFailed = true;
                }
              });
            }

            console.log('error in chat iamge', error);
            setRetry(true);
            setLoading(false);
          }
        } else {
          if (item?.downloadFailed) {
            if (alertClicked) {
              setAlertClicked(false);
              alertDownloadFailed();
            }
          } else {
            realm.write(() => {
              // Find the object with the matching _id
              let message = realm
                .objects('Message')
                .filtered(`_id = "${item._id}"`)[0];
              if (message) {
                message.downloadFailed = true;
              }
            });
          }

          setRetry(true);
        }
      }
    },

    [item.message],
  );

  useEffect(() => {
    setRetry(item.downloadFailed);
    if (!item.downloadFailed) {
      loadFile(item.message);
    }
    return () => {};
  }, [item.message, loadFile]);

  return (
    <Pressable
      style={[
        {
          ...styles.baseStyle,
          backgroundColor: !sentByUser ? '#FAFBF8' : colors.blue3,
        },
        !sentByUser
          ? {
              borderBottomLeftRadius: 0,
            }
          : {
              borderBottomRightRadius: 0,
            },
      ]}
      onLongPress={() => {
        onLongPress(item);
      }}
      onPress={() => {
        !retry && !loading && openImage(image);
      }}>
      <>
        {retry ? (
          <View
            style={[
              {
                width:
                  item.orientation === 'HORIZONTAL' ? imageWidth : imageHeight,
                height:
                  item.orientation === 'HORIZONTAL' ? imageHeight : imageWidth,
                borderRadius: scale(10),
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <Pressable
              style={{alignItems: 'center'}}
              onPress={() => {
                setAlertClicked(true);
                setRetry(false);
                loadFile(item.message);
              }}>
              <Image
                style={{width: scale(24), height: scale(24)}}
                source={require('../../../../assets/images/retry_icon.png')}
              />
              <Text
                style={{
                  fontFamily: fonts.regularFont,
                  fontSize: scale(14),
                  color: colors.black,
                  marginTop: scale(5),
                }}>
                Download
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {loading ? (
              <View
                style={[
                  {
                    width:
                      item.orientation === 'HORIZONTAL'
                        ? imageWidth
                        : imageHeight,
                    height:
                      item.orientation === 'HORIZONTAL'
                        ? imageHeight
                        : imageWidth,
                    borderRadius: scale(10),
                    alignItems: 'center',
                    justifyContent: 'center',
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
                {/* <Progress.Circle
                  showsText
                  size={50}
                  progress={progress}
                  // indeterminate={true}
                /> */}
              </View>
            ) : (
              <>
                <FastImage
                  source={{
                    uri: image,
                  }}
                  style={[
                    {
                      width:
                        item.orientation === 'HORIZONTAL'
                          ? imageWidth
                          : imageHeight,
                      height:
                        item.orientation === 'HORIZONTAL'
                          ? imageHeight
                          : imageWidth,
                      borderRadius: scale(10),
                    },
                    !sentByUser
                      ? {
                          borderBottomLeftRadius: 0,
                        }
                      : {
                          borderBottomRightRadius: 0,
                        },
                  ]}
                  onError={() => {
                    console.log(`Error loading image |${item.message}`);
                  }}
                  resizeMode="cover"
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
            )}
          </View>
        )}
      </>
    </Pressable>
  );
};

export default ChatImage;

const styles = StyleSheet.create({
  baseStyle: {
    padding: scale(3),
    backgroundColor: VARIABLES.themeData.themeColor,
    borderRadius: scale(10),
  },
  loaderStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(10),
  },
});
