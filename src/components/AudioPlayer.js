import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import {APP_IMAGE} from '../utils/constants';
import {scale} from '../utils/metrics';
import {delay, getStateDataAsync} from '../utils/helpers';
import {globalStyles} from '../styles/globalStyles';
import RNFS from 'react-native-fs';
import {AWS_URL_S3} from '../utils/urls';
import {ToastMessage} from './toastMessage';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {VARIABLES} from '../utils/variables';
import {useFocusEffect} from '@react-navigation/native';

Sound.setCategory('Playback'); // This is required for iOS

const audioRecorderPlayer = new AudioRecorderPlayer();

const App = ({
  item,
  url,
  currentIndex,
  setCurrentIndex,
  messageIndex,
  containerStyle = {},
  imageStyle = {},
  seekerStyles = {},
  color,
}) => {
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [audiofile, setaudiofile] = useState('');
  const [isSoundLoading, setisSoundLoading] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  let playIcon;
  let pauseIcon;
  let seekIcon;
  let thumbIcon;

  switch (color) {
    case '#FFFFFF':
      playIcon = APP_IMAGE.whiteMediaPlayIcon;
      pauseIcon = APP_IMAGE.whiteMediaPauseIcon;
      seekIcon = APP_IMAGE.whiteMediaSeekIcon;
      thumbIcon = APP_IMAGE.whiteMediaTrackIcon;
      break;
    case '#F4EEE0':
      playIcon = APP_IMAGE.yellowMediaPlayIcon;
      pauseIcon = APP_IMAGE.yellowMediaPauseIcon;
      seekIcon = APP_IMAGE.yellowMediaSeekIcon;
      thumbIcon = APP_IMAGE.yellowMediaTrackIcon;
      break;
    case '#E9F1F7':
      playIcon = APP_IMAGE.blueMediaPlayIcon;
      pauseIcon = APP_IMAGE.blueMediaPauseIcon;
      seekIcon = APP_IMAGE.blueMediaSeekIcon;
      thumbIcon = APP_IMAGE.blueMediaTrackIcon;
      break;
    case '#D4F1DE':
      playIcon = APP_IMAGE.greenMediaPlayIcon;
      pauseIcon = APP_IMAGE.greenMediaPauseIcon;
      seekIcon = APP_IMAGE.greenMediaSeekIcon;
      thumbIcon = APP_IMAGE.greenMediaTrackIcon;
      break;
    default:
      break;
  }

  let newSound;

  useFocusEffect(
    React.useCallback(() => {
      // This is called when the screen is focused

      return () => {
        // This is called when the screen is unfocused
        // Stop the sound playback here
        if (sound) {
          sound.stop();
          setisPlaying(false);
        }
      };
    }, [sound]),
  );

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

  // useEffect(() => {
  //   console.log(currentIndex);
  //   if (currentIndex != messageIndex) {
  //     pauseSound(false);
  //   }
  //   return () => {};
  // }, [currentIndex]);

  let timer = null;

  const playSound = async () => {
    const s3Key = url;
    setisPlaying(true);
    setisSoundLoading(true);

    setCurrentIndex(messageIndex);

    const localPath = `${RNFS.DocumentDirectoryPath}/${s3Key}`;

    // Check if the file exists locally
    const fileExists = await RNFS.exists(localPath);

    if (!fileExists) {
      // If not, download it
      const s3URL = `${AWS_URL_S3}production`;
      const s3Url = `${s3URL}/notes/${s3Key}`;
      console.log('if statemtne', s3Url);
      try {
        await RNFS.downloadFile({
          fromUrl: s3Url,
          toFile: localPath,
        }).promise;
      } catch (error) {
        console.log('Download failed:', error);
        return;
      }
    }

    const sound = new Sound(`file://${localPath}`, '', error => {
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

      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }

      sound.setCurrentTime(pausedTime);
      sound.play(success => {
        if (!success) {
          console.log('Playback failed');
          setisPlaying(false);
        } else {
          console.log('success');
          // Calculate remaining time based on the pausedTime and total duration
          const remainingTime = (sound.getDuration() - pausedTime) * 1000;

          // Set a new timer for the remaining time
          timer = setTimeout(() => {
            setisPlaying(false);
            setPausedTime(0);
            setCurrentTime(0);
            sound.setCurrentTime(0);
          }, remainingTime);
        }
      });
    });
  };

  const pauseSound = (changeIndex = true) => {
    setisPlaying(false);

    if (sound?.getCurrentTime !== null && sound?.getCurrentTime !== undefined) {
      sound.getCurrentTime(seconds => {
        setPausedTime(seconds);
      });
    }
    if (timer) {
      clearTimeout(timer);
    }

    changeIndex && setCurrentIndex(messageIndex);
    sound?.pause?.();
  };

  const seekTime = value => {
    setCurrentTime(value);
    sound.setCurrentTime(value);
  };

  const getTimeLabel = time => {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min}:${sec > 9 ? sec : `0${sec}`}`;
  };

  return (
    <View style={{...styles.container, ...containerStyle}}>
      {isPlaying ? (
        <Pressable
          onPress={() => {
            if (isPlaying) {
              pauseSound();
            } else {
              playSound();
            }
          }}
          //  disabled={!sound}
          style={{
            width: scale(35),
            height: scale(35),
            ...imageStyle,
          }}>
          {/* {!sound ? (
            <Pressable
              style={{
                width: scale(35),
                height: scale(35),
              }}
              onPress={() => {
                playSound();
              }}>
              <ActivityIndicator />
            </Pressable>
          ) : ( */}
          <Image
            style={{
              width: scale(35),
              height: scale(35),
              resizeMode: 'contain',
              ...imageStyle,
            }}
            source={pauseIcon}
          />
          {/* )} */}
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            playSound();
          }}>
          {!sound && !isSoundLoading ? (
            <View
              style={{
                //  width: 45,
                //  height: 45,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={playIcon}
                style={{
                  width: scale(35),
                  height: scale(35),
                  resizeMode: 'contain',
                  ...imageStyle,
                }}
              />
            </View>
          ) : isSoundLoading ? (
            <View
              style={{
                width: scale(35),
                height: scale(35),
              }}>
              <ActivityIndicator />
            </View>
          ) : (
            <Image
              source={playIcon}
              style={{
                width: scale(35),
                height: scale(35),
                resizeMode: 'contain',
                ...imageStyle,
              }}
            />
          )}
        </Pressable>
      )}
      <View
        style={{
          marginTop: Platform.OS === 'android' ? 5 : -5,
          // marginVertical: Platform.OS === "android" ? 0 : 0,
          // backgroundColor: "red",
          ...seekerStyles,
        }}>
        <Slider
          disabled
          style={{width: scale(90)}}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={seekTime}
          thumbImage={thumbIcon}
          trackImage={seekIcon}
        />
        <Text
          style={{
            position: 'absolute',
            bottom: Platform.OS === 'android' ? -10 : 5,
            right: 0,
            ...globalStyles.lightLargeText,
            fontSize: scale(10),
          }}>
          {item?.recordTime}
          {/* {getTimeLabel(duration?.toFixed?.(0))} */}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: scale(15),
    alignItems: 'center',
    marginRight: scale(5),
  },
});

export default App;
