import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import {AWS_URL_S3} from '../../utils/urls';
import {getStateDataAsync} from '../../utils/helpers';
import {APP_IMAGE} from '../../utils/constants';
import {SCREEN_WIDTH, globalStyles} from '../../styles/globalStyles';
import {fonts} from '../../styles/fonts';
import {scale} from '../../utils/metrics';
import {colors} from '../../styles/colors';
import {VARIABLES} from '../../utils/variables';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const App = ({audioName, setCurrentIndex, messageIndex, sentByUser}) => {
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);

  useEffect(() => {
    const newSound = new Sound(
      AWS_URL_S3 + `production/chat/` + audioName,
      null,
      error => {
        if (error) {
          console.log('Error loading sound:11', error);
          return;
        }
        setSound(newSound);
        setDuration(newSound.getDuration());
      },
    );
    return () => {
      newSound.release();
    };
  }, []);

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
              if (val != messageIndex) {
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

  const playSound = () => {
    setisPlaying(true);
    setCurrentTime(0);
    sound?.play?.(success => {
      if (!success) {
        console.log('Playback failed');
        return;
      }
    });
  };

  const pauseSound = (changeIndex = true) => {
    setisPlaying(false);
    changeIndex && setCurrentIndex(messageIndex);
    sound?.stop?.();
  };

  return (
    <View
      style={[
        styles.baseStyles,
        sentByUser ? styles.sentByUser : styles.sentByPartner,
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
                value={
                  ((duration?.toFixed?.(0) - currentTime) /
                    duration?.toFixed?.(0)) *
                  100
                }
                radius={24}
                activeStrokeColor={'#124698'}
                activeStrokeSecondaryColor={'#124698'}
                duration={1000}
                inActiveStrokeOpacity={0}>
                <Image
                  source={
                    // !isAudioPaused
                    APP_IMAGE.chatPauseAudio
                    //   : APP_IMAGE.chatPlayAudio
                  }
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
              {!sound ? (
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
                <Image
                  source={APP_IMAGE.chatPlayAudio}
                  style={{
                    width: 45,
                    height: 45,
                  }}
                />
              )}
            </Pressable>
          )}
        </View>
        <View>
          <Text
            style={{
              ...globalStyles.lightSmallText,
              fontFamily: fonts.italicFont,
              fontSize: scale(12),
              color: colors.text,
            }}>
            {VARIABLES.user?.partnerData?.partner?.name} has sent a voice note
            for you
          </Text>
          <Text>
            {isPlaying
              ? getTimeLabel(duration?.toFixed?.(0) - currentTime?.toFixed?.(0))
              : getTimeLabel(duration?.toFixed?.(0))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseStyles: {
    paddingHorizontal: scale(17),
    paddingVertical: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.6,
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

export default App;
