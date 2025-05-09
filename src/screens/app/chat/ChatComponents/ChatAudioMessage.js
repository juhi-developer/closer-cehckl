/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import Sound from 'react-native-sound';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import {AWS_URL_S3} from '../../../../utils/urls';
import {getStateDataAsync} from '../../../../utils/helpers';
import {scale} from '../../../../utils/metrics';
import {APP_IMAGE} from '../../../../utils/constants';
import {SCREEN_WIDTH, globalStyles} from '../../../../styles/globalStyles';
import {fonts} from '../../../../styles/fonts';
import {VARIABLES} from '../../../../utils/variables';
import RNFS from 'react-native-fs';
import {colors} from '../../../../styles/colors';
import {downloadAndDecryptFromS3} from '../../../../utils/helpers';
import naclUtil from 'tweetnacl-util';

const ChatAudioMessage = ({
  audioName,
  setCurrentIndex,
  messageIndex,
  sentByUser,
  item,
}) => {
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [isSoundLoading, setisSoundLoading] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const getTimeLabel = time => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min}:${sec > 9 ? sec : `0${sec}`}`;
  };

  useEffect(() => {
    if (sound) {
      const interval = setInterval(() => {
        sound.getCurrentTime(async seconds => {
          let currentPlayVal = await getStateDataAsync(setisPlaying);
          if (
            (seconds === 0 && currentPlayVal) ||
            (seconds.toFixed(1) === duration.toFixed(1) && currentPlayVal)
          ) {
            setisPlaying(false);
            setCurrentIndex(val => {
              if (val !== messageIndex) {
                return val;
              }
              return -1;
            });
          }
          if (!currentPlayVal) {
            clearInterval(interval);
          }
          setCurrentTime(seconds);
          console.log(seconds, currentPlayVal);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sound, isPlaying]);

  const playSound = async () => {
    const s3Key = item.message;
    console.log('s3Key audio', s3Key, Platform.OS);
    setisSoundLoading(true);
    let localPath;

    if (s3Key.startsWith('/') || s3Key.startsWith('file://')) {
      localPath = `file://${s3Key}`;
    } else {
      const path = RNFS.DocumentDirectoryPath + `/${s3Key}`;

      const exists = await RNFS.exists(path);

      if (exists) {
        localPath = `file://${path}`;
      } else if (!sentByUser) {
        try {
          const nonce = naclUtil.decodeBase64(item.nonce);
          let data = await downloadAndDecryptFromS3(
            s3Key,
            'chat',
            nonce,
            progress => {
              setProgress(progress);
              console.log('progresss', progress);
            },
          );
          setLoading(false);
          localPath = `file://${RNFS.DocumentDirectoryPath}/${data}`;
        } catch (error) {
          setLoading(false);
        }
      }
    }

    const sound = new Sound(localPath, '', error => {
      setisSoundLoading(false);
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      } else {
        setSound(sound);
        setDuration(sound.getDuration());
      }

      VARIABLES.currentSound?.stop?.();
      VARIABLES.currentSound = sound;

      setisPlaying(true);
      setCurrentTime(0);

      sound.setCurrentTime(pausedTime);

      sound.play(success => {
        if (!success) {
          console.log('Playback failed');
        } else {
          console.log('sucess');
        }
      });
      setPausedTime(0);
    });
  };

  const pauseSound = (changeIndex = true) => {
    setisPlaying(false);
    sound.getCurrentTime(seconds => {
      setPausedTime(seconds);
    });

    changeIndex && setCurrentIndex(messageIndex);
    sound?.pause?.();
  };

  return (
    <View
      style={[
        styles.baseStyles,
        sentByUser ? styles.sentByUser : styles.sentByPartner,
        {
          backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            marginRight: scale(18),
          }}>
          {isPlaying ? (
            <Pressable
              onPress={() => {
                if (isPlaying) {
                  pauseSound();
                } else {
                  playSound();
                }
              }}>
              <CircularProgressBase
                // initialValue={
                //   pausedTime.toFixed(0) === 0 ? 100 : pausedTime.toFixed(0)
                // }
                //  initialValue={100}
                // initialValue={pausedTime.toFixed(0)}
                value={
                  ((duration?.toFixed?.(0) - currentTime) /
                    duration?.toFixed?.(0)) *
                  100
                }
                radius={24}
                activeStrokeColor={'#124698'}
                activeStrokeSecondaryColor={'#124698'}
                duration={0}
                inActiveStrokeOpacity={0}>
                <Image
                  source={APP_IMAGE.chatPauseAudio}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
              </CircularProgressBase>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                playSound();
              }}>
              {!sound && !isSoundLoading ? (
                <View
                  style={{
                    width: 45,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={APP_IMAGE.chatPlayAudio}
                    style={{
                      width: 45,
                      height: 45,
                    }}
                  />
                </View>
              ) : isSoundLoading ? (
                <View
                  style={{
                    width: 45,
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator />
                </View>
              ) : (
                <CircularProgressBase
                  initialValue={100}
                  value={100}
                  radius={24}
                  activeStrokeColor={'white'}
                  activeStrokeSecondaryColor={'white'}
                  duration={1}
                  inActiveStrokeOpacity={0}>
                  <Image
                    source={APP_IMAGE.chatPlayAudio}
                    style={{
                      width: 45,
                      height: 45,
                    }}
                  />
                </CircularProgressBase>
              )}
            </Pressable>
          )}
        </View>
        <View>
          <Text
            style={{
              ...globalStyles.lightMediumText,
              fontFamily: fonts.italicFont,
              color: colors.black,
              width: SCREEN_WIDTH * 0.48,
              opacity: 0.6,
            }}>
            {sentByUser
              ? 'You have sent a voice note!'
              : `${VARIABLES.user?.partnerData?.partner?.name} has sent a voice note!`}
          </Text>
          <Text
            style={{
              ...globalStyles.regularMediumText,
              color: '#7B7B86',
            }}>
            {isPlaying
              ? getTimeLabel(duration?.toFixed?.(0) - currentTime?.toFixed?.(0))
              : item.recordTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseStyles: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: 'red',
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
});

export default ChatAudioMessage;
