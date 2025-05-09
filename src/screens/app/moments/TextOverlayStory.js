/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {EventRegister} from 'react-native-event-listeners';

import {fonts} from '../../../styles/fonts';
import {scale} from '../../../utils/metrics';
import AppView from '../../../components/AppView';
import {colors} from '../../../styles/colors';
import VerticalSlider from 'rn-vertical-slider';
import Animated from 'react-native-reanimated';
import {APP_IMAGE} from '../../../utils/constants';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import {VARIABLES} from '../../../utils/variables';

const path = `${RNFS.DocumentDirectoryPath}/your_file_name.jpg`;

const TextOverlayStory = props => {
  const {imageUri, photoAdded} = props.route.params;
  const ref = useRef();
  const inputRef = useRef(null);
  const tapRef = React.useRef(null);
  const panRef = React.useRef(null);

  const [editingMode, setEditingMode] = useState(false);
  const [takeScreenshot, setTakeScreenshot] = useState(false);
  const [isTextInputVisible, setIsTextInputVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isInDeleteZone, setIsInDeleteZone] = useState(false);

  const [textColor, setTextColor] = useState('#000');
  const [bgColor, setBgColor] = useState('#fff');
  const colorOptions = [
    {
      color: 'black',
      bgColor: 'rgba(255,255,255,0.6)',
    },
    {
      color: '#124698',
      bgColor: 'rgba(255,255,255,0.6)',
    },
    {
      color: '#FBDBD3',
      bgColor: 'rgba(0,0,0,0.6)',
    },
    {
      color: '#D4F1DE',
      bgColor: 'rgba(0,0,0,0.6)',
    },
    {
      color: '#2F3A4E',
      bgColor: 'rgba(255,255,255,0.6)',
    },
    {
      color: '#7DB0E9',
      bgColor: 'rgba(0,0,0,0.6)',
    },
    {
      color: '#E58DA6',
      bgColor: 'rgba(0,0,0,0.6)',
    },
  ]; // Predefined colors

  const selectColor = color => {
    setTextColor(color.color); // Set text color
    setBgColor(color.bgColor); // Set background color
  };

  const [translateX, setTranslateX] = useState(scale(100));
  const [translateY, setTranslateY] = useState(scale(20));
  const [fontSize, setFontSize] = useState(20);
  const [text, setText] = useState(''); // new state variable for text

  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardVisible(true); // or put any code you want to handle keyboard show event
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or put any code you want to handle keyboard hide event
        setKeyboardHeight(0);
      },
    );

    // cleanup function
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onTextChange = newText => {
    setText(newText);
  };

  useEffect(() => {
    // on mount
    if (takeScreenshot === true) {
      ref.current.capture().then(uri => {
        props.navigation.goBack();
        const captionAdded = text.trim() !== '' ? true : false;
        props.route.params.onGoBack(uri, photoAdded, captionAdded);
      });
    }
  }, [takeScreenshot]);

  const onGestureEvent = event => {
    const {translationX, translationY, state} = event.nativeEvent;
    if (state === State.ACTIVE) {
      setIsDragging(true); // User is dragging
      setTranslateX(lastTranslateX.current + translationX);
      setTranslateY(lastTranslateY.current + translationY);
      if (Platform.OS === 'android') {
        setIsInDeleteZone(lastTranslateY.current + translationY > scale(650)); // Adjust 600 as needed
      } else {
        setIsInDeleteZone(lastTranslateY.current + translationY > scale(500)); // Adjust 600 as needed
      }
    } else if (state === State.END) {
      setIsDragging(false);
      lastTranslateX.current += translationX;
      lastTranslateY.current += translationY;

      if (isInDeleteZone) {
        setIsTextInputVisible(false);
      }

      // Check if TextInput is in the delete zone
      if (lastTranslateY.current > scale(600)) {
        // Adjust 600 to the appropriate value
        setIsTextInputVisible(false);
      }
    }
  };

  const renderIcon = newVal => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          width: scale(30),
          height: scale(30),
          //   marginBottom: scale(20),
          borderRadius: 30,
        }}
      />
    );
  };

  const handleFocus = () => {
    setEditingMode(true);
  };

  const handleBlur = () => {
    setTranslateX(translateX - 1);
    setTranslateY(translateY - 1);
  };

  useEffect(() => {
    if (editingMode) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 500);
    }
  }, [editingMode]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black, zIndex: 100}}>
      <TouchableWithoutFeedback
        style={{zIndex: 100}}
        onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, zIndex: 100}}>
          <View
            style={{height: scale(120), justifyContent: 'center', zIndex: 100}}>
            {editingMode ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginHorizontal: scale(20),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setText('');
                    setEditingMode(false);
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(14),
                      color: colors.white,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setEditingMode(false);
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.regularFont,
                      fontSize: scale(14),
                      color: colors.white,
                    }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (VARIABLES.momentsToolTipKey) {
                    EventRegister.emit('momentsToltipFeedStatus', '7');
                  }
                  props.navigation.goBack();
                }}
                style={{
                  alignSelf: 'flex-end',
                  marginEnd: scale(20),
                }}>
                <Image
                  source={require('../../../assets/images/crossBlueBg.png')}
                />
              </TouchableOpacity>
            )}
          </View>
          <ViewShot
            style={{
              flex: 1,
              backgroundColor: colors.black,
              zIndex: 1,
              overflow: 'hidden',
            }}
            ref={ref}
            options={{fileName: 'Closer-Story', format: 'jpg', quality: 0.9}}>
            <ImageBackground
              resizeMode="contain"
              source={{uri: imageUri.path}}
              style={styles.container}>
              {editingMode && (
                <View
                  style={{
                    position: 'absolute',
                    start: scale(20),
                    top: scale(20),
                    zIndex: 1,
                  }}>
                  <Image
                    style={{
                      position: 'absolute',
                      start: -scale(4),
                      bottom: -scale(4),
                      width: scale(37),
                      height: scale(285),
                      resizeMode: 'contain',
                    }}
                    source={require('../../../assets/images/sliderHeight.png')}
                  />

                  <VerticalSlider
                    value={fontSize}
                    onChange={value => setFontSize(value)}
                    height={scale(300)}
                    width={scale(30)}
                    maximumTrackTintColor={'transparent'}
                    minimumTrackTintColor={'transparent'}
                    // step={1}
                    // min={0}
                    // ballIndicatorPosition={-30}
                    // max={100}
                    // borderRadius={5}
                    // minimumTrackTintColor="transparent"
                    // maximumTrackTintColor="transparent"
                    // showBallIndicator={true}
                    // ballIndicatorColor="transparent"
                    // ballIndicatorTextColor="transparent"
                    // ballIndicatorWidth={80}
                    // ballIndicatorHeight={40}
                    renderIndicator={renderIcon}
                    showIndicator
                    containerStyle={{
                      borderRadius: scale(20),
                      overflow: 'hidden',
                    }}
                  />
                </View>
              )}
              {isTextInputVisible && (
                <GestureHandlerRootView>
                  <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onGestureEvent}>
                    <View
                      style={[
                        {
                          transform: [
                            {translateX: translateX},
                            {translateY: translateY},
                          ],
                          alignSelf: 'baseline',
                          zIndex: 10,
                        },
                      ]}>
                      <>
                        {!editingMode && text.trim() === '' ? null : (
                          <Pressable onPress={() => inputRef.current.focus()}>
                            <View
                              pointerEvents={
                                isKeyboardVisible ? 'auto' : 'none'
                              }>
                              <TextInput
                                ref={inputRef}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                scrollEnabled={false}
                                multiline={true}
                                style={[
                                  styles.textInput,
                                  {
                                    fontSize: fontSize,
                                    color: textColor,
                                    zIndex: 0,

                                    backgroundColor:
                                      text.trim() !== ''
                                        ? bgColor
                                        : 'transparent',
                                  },
                                ]}
                                placeholder=""
                                value={text}
                                onChangeText={onTextChange} // new handler for text change
                              />
                            </View>
                          </Pressable>
                        )}
                      </>
                    </View>
                  </PanGestureHandler>
                </GestureHandlerRootView>
              )}
            </ImageBackground>
          </ViewShot>
          <View
            style={{
              height: scale(120),
              marginBottom: Platform.OS === 'ios' ? scale(40) : scale(20),
              zIndex: 100,
            }}>
            {editingMode && !isDragging && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  position: 'absolute',
                  bottom: isKeyboardVisible
                    ? keyboardHeight
                    : keyboardHeight + scale(60),
                  start: 0,
                  end: 0,
                  zIndex: 10,
                }}>
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, {backgroundColor: color.color}]}
                    onPress={() => selectColor(color)}
                  />
                ))}
              </View>
            )}

            {isDragging && (
              <View
                style={[
                  styles.deleteZone,
                  isInDeleteZone ? styles.deleteZoneActive : {},
                ]}>
                <Image
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: colors.blue1,
                    marginBottom: 10,
                  }}
                  source={APP_IMAGE.templateTrash}
                />
                <Text
                  style={{
                    fontFamily: fonts.regularFont,
                    fontSize: 12,
                    color: colors.blue1,
                  }}>
                  Drag here to remove
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: scale(20),
                height: scale(170),
              }}>
              {!editingMode && !isDragging && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingMode(true);
                      setIsTextInputVisible(true);
                      setTranslateX(scale(100));
                      setTranslateY(scale(20));

                      lastTranslateX.current = 100;
                      lastTranslateY.current = 20;
                    }}
                    style={{}}>
                    <Image
                      style={{
                        resizeMode: 'contain',
                      }}
                      source={require('../../../assets/images/AaIcon.png')}
                    />
                  </TouchableOpacity>

                  <Pressable
                    onPress={() => {
                      setTakeScreenshot(true);
                    }}
                    style={{
                      height: scale(43),
                      paddingHorizontal: scale(30),
                      backgroundColor: colors.white,
                      borderRadius: scale(6),
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: scale(18),
                        fontFamily: fonts.semiBoldFont,
                        color: colors.blue1,
                      }}>
                      Post
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// ... rest of your code

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: colors.black,
  },
  deleteZoneActive: {
    backgroundColor: '#F6CFDA', // Change to your desired active color
  },

  deleteZone: {
    position: 'absolute',
    bottom: 0,
    left: scale(120),
    right: scale(120),

    height: scale(100), // Adjust as needed
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },

  textInput: {
    color: 'white',
    // borderWidth: 1,
    // borderColor: 'grey',
    backgroundColor: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'baseline',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: scale(50),
    left: scale(50),
    right: scale(50),
  },

  colorContainer: {},
  colorOption: {
    width: scale(24),
    height: scale(24),
    borderColor: colors.white,
    borderWidth: 2,
    borderRadius: 20, // Optional: for circular color options
    marginHorizontal: scale(10), // Space between color options
  },
});

export default TextOverlayStory;
