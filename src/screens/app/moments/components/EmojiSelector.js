/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {scaleNew} from '../../../../utils/metrics2';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {VARIABLES} from '../../../../utils/variables';
import {AWS_URL_S3} from '../../../../utils/urls';
import {colors} from '../../../../styles/colors';
import FastImage from 'react-native-fast-image';
import {getStateDataAsync} from '../../../../utils/helpers';
import {useAppContext} from '../../../../utils/VariablesContext';
import {
  HapticFeedback,
  HapticFeedbackHeavy,
} from '../../../../utils/HapticFeedback';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const EmojiSelector = ({
  toolTipCurrentState,
  onEmojiSelect,
  isVisible,
  setIsVisible,
  viewStyle,
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const [emojis, setEmojis] = useState([
    '🥳',
    '🤬',
    '🥱',
    '💩',
    '🩷',
    '🥹',
    '🫶🏼',
    '‍❤️‍🔥',
    '☃️',
    '❄️',
  ]);

  const pickerRef = useRef(null);
  const longPressTimer = useRef(null);
  const touchStartTime = useRef(null);
  const selectedEmojiRef = useRef('');
  const [flipped, setFlipped] = useState(
    !VARIABLES.disableTouch ? false : true,
  );
  const rotateX = useSharedValue(0);

  const numRows = 2;
  const numCols = emojis.length / numRows;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        touchStartTime.current = Date.now();
        longPressTimer.current = setTimeout(() => {
          setIsVisible(true);
        }, 500); // Typically 500ms is used to recognize a long press
        //    setIsVisible(true); // Show the emoji picker when touch starts
      },
      onPanResponderMove: evt => {
        const touch = evt.nativeEvent.touches[0];
        if (pickerRef.current) {
          pickerRef.current.measure((fx, fy, width, height, px, py) => {
            const relativeY = touch.pageY - py;
            const relativeX = touch.pageX - px;
            const emojiWidth = width / numCols;
            const emojiHeight = height / numRows;

            if (
              relativeX >= 0 &&
              relativeX <= width &&
              relativeY >= 0 &&
              relativeY <= height
            ) {
              const colIndex = Math.floor(relativeX / emojiWidth);
              const rowIndex = Math.floor(relativeY / emojiHeight);
              const index = rowIndex * numCols + colIndex;
              if (index >= 0 && index < emojis.length) {
                const newEmoji = emojis[index];

                if (newEmoji !== selectedEmojiRef.current) {
                  HapticFeedbackHeavy();
                  setSelectedEmoji(newEmoji);
                  selectedEmojiRef.current = newEmoji;
                }
              } else {
                setSelectedEmoji('');
                selectedEmojiRef.current = '';
              }
            } else {
              setSelectedEmoji('');
              selectedEmojiRef.current = '';
            }
          });
        } else {
          setSelectedEmoji('');
          selectedEmojiRef.current = '';
        }
      },

      onPanResponderRelease: () => {
        const touchDuration = Date.now() - touchStartTime.current;
        clearTimeout(longPressTimer.current); // Always clear the timeout on release
        if (touchDuration < 500) {
          if (toolTipCurrentState !== 4) {
            handlePressCoin();
          }
          // If the touch duration is less than 500ms, it's a tap
        } else {
          if (selectedEmojiRef.current !== '') {
            HapticFeedbackHeavy();
            onEmojiSelect(selectedEmojiRef.current);
          }

          setIsVisible(false); // Hide the picker when touch ends
        }

        setSelectedEmoji('');
        selectedEmojiRef.current = '';

        clearTimeout(longPressTimer.current);
      },
      onPanResponderTerminate: () => {
        clearTimeout(longPressTimer.current);
        setIsVisible(false); // Hide the picker if touch is interrupted
      },
    }),
  ).current;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${rotateX.value}deg`,
        },
      ],
    };
  });

  //const [hook, setHook] = useState(false);

  const handlePressCoin = async () => {
    const newFlipped = await getStateDataAsync(setFlipped);

    rotateX.value = withSpring(newFlipped ? 0 : 180, {
      damping: 10,
      stiffness: 100,
    });

    setFlipped(!newFlipped);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {isVisible && (
        <View ref={pickerRef} style={[styles.emojiPicker]}>
          {emojis.map((emoji, index) => (
            <View
              key={emoji}
              style={[
                styles.viewEmoji,
                {
                  ...viewStyle,
                  backgroundColor:
                    selectedEmoji === emoji ? '#9BC2FF' : '#EDF4FF',
                },
              ]}>
              <Text
                key={index}
                style={{
                  fontSize:
                    selectedEmoji === emoji
                      ? Platform.OS === 'ios'
                        ? scaleNew(44)
                        : scaleNew(34)
                      : Platform.OS === 'ios'
                      ? scaleNew(34)
                      : scaleNew(28),
                  color: 'black', // Ensure this is visible against all backgrounds
                }}>
                {emoji}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Animated.View style={[styles.fab, animatedStyle]}>
        {flipped ? (
          <Image
            resizeMode="contain"
            style={{
              width: scaleNew(60),
              height: scaleNew(60),
              resizeMode: 'contain',
            }}
            source={require('../../../../assets/images/pokeSendEmoji.png')}
          />
        ) : (
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#5698FF', '#9BC2FF']}
            style={{
              width: scaleNew(60),
              height: scaleNew(60),
              borderRadius: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ProfileAvatar
              type="partner"
              style={{
                width: scaleNew(54),
                height: scaleNew(54),
                borderRadius: 60,
              }}
            />
          </LinearGradient>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {},
  fabIcon: {
    fontSize: scaleNew(24),
    color: 'white',
    zIndex: 100,
  },
  emojiPicker: {
    position: 'absolute',
    bottom: scaleNew(40),
    start: -scaleNew(300),
    backgroundColor: 'white',
    paddingTop: scaleNew(10),
    paddingBottom: scaleNew(4),
    paddingEnd: scaleNew(6),
    paddingStart: scaleNew(10),
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping of emojis into multiple rows
    width: scaleNew(350), // You may adjust this based on your screen size
    justifyContent: 'center',
    borderRadius: 33,
    elevation: 2,
    //borderWidth: 0.5,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: scaleNew(4)},
    shadowOpacity: 1,
    shadowRadius: scaleNew(4),
    zIndex: 0,
  },
  emojiText: {
    fontSize: scaleNew(34),
    color: 'black',
  },
  viewEmoji: {
    width: scaleNew(60),
    height: scaleNew(60),
    borderRadius: scaleNew(40),
    backgroundColor: '#EDF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: scaleNew(6),
    marginBottom: scaleNew(6),
  },
});

export default EmojiSelector;
