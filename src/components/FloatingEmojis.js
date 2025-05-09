import React, {useEffect, useState} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {useAppContext} from '../utils/VariablesContext';
import API from '../redux/saga/request';
import {VARIABLES} from '../utils/variables';
import {HapticFeedbackHeavy} from '../utils/HapticFeedback';

const {width, height} = Dimensions.get('window');

const FloatingEmojis = React.memo(({emojis, setNudgeModalVisible}) => {
  const [emojiAnimations, setEmojiAnimations] = useState([]);
  const numberOfEmojis = 40; // Adjust based on performance testing
  const waveSize = 10; // Find a balance between visual density and performance

  const {updateNotifData, removeNudgeItem} = useAppContext();

  useEffect(() => {
    // Show modal and handle emojis only when the modal becomes visible
    if (emojis && emojis.length > 0) {
      HapticFeedbackHeavy();

      // Start the modal hide timer once
      const timer = setTimeout(() => {
        onPressCross();
      }, 5000);

      // Cleanup the timeout when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [emojis]); // Re-run only when emojis change

  // useEffect(() => {
  //   HapticFeedbackHeavy();
  //   setTimeout(() => {
  //     onPressCross();
  //   }, 5000);
  // }, []);

  const onPressCross = async () => {
    updateNotifData({...VARIABLES.appNotifData, nudgeCount: 0});
    setNudgeModalVisible(false);
    removeNudgeItem();
    try {
      const resp = await API(`user/moments/nudge`, 'GET');

      if (resp.body.statusCode === 200) {
        // console.log('response poke modal', resp);
      } else {
        console.log('error on poke', resp);
      }
    } catch (error) {
      console.log('error on poke', error.response);
    }
  };

  useEffect(() => {
    const animations = Array.from({length: numberOfEmojis}, () => {
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; // Select a random emoji from the array
      return {
        position: new Animated.ValueXY({
          x: Math.random() * width, // Random horizontal start
          y: height, // Start at the bottom of the screen
        }),
        opacity: new Animated.Value(1),
        scale: 0.8 + Math.random() * 1, // Random scale between 0.5 and 1.5
        emoji: randomEmoji, // Assign the random emoji
      };
    });

    setEmojiAnimations(animations);

    const animationInstances = animations.map(({position, opacity}) => {
      return Animated.sequence([
        Animated.delay(Math.floor(Math.random() * waveSize) * 200), // Random delay
        Animated.parallel([
          Animated.timing(position.y, {
            toValue: height / 6, // Move to the middle of the screen
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1500), // Delay for opacity change
            Animated.timing(opacity, {
              toValue: 0, // Fade out
              duration: 1500, // Adjusted duration since it starts later
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    Animated.stagger(50, animationInstances).start();
  }, [emojis]); // Dependency array includes emojis to reinitialize animations if emojis change

  return (
    <View style={styles.container}>
      {emojiAnimations.map(({position, opacity, scale, emoji}, index) => (
        <Animated.Text
          key={index}
          style={[
            styles.emoji,
            {
              transform: [
                {translateX: position.x},
                {translateY: position.y},
                {scale: scale},
              ],
              opacity: opacity,
            },
          ]}>
          {emoji}
        </Animated.Text>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  emoji: {
    position: 'absolute',
    color: 'black',
    fontSize: 30, // Adjust the font size as needed
  },
});

export default FloatingEmojis;
