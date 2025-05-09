/* eslint-disable react-native/no-inline-styles */
import {Image, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyles';
import {APP_IMAGE, STICKERS} from '../utils/constants';
import FastImage from 'react-native-fast-image';
import {colors} from '../styles/colors';
import {scaleNew} from '../utils/metrics2';

export default function ReactionComp({
  item,
  type,
  setReactionData,
  handlePresentEmojiModalPress,
  hornyMode,
  setStickersBottomSheetVisible,
}) {
  return (
    <View>
      {item?.reactions?.length ? (
        <Pressable
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: colors.white,
            paddingHorizontal: scaleNew(4),
            borderRadius: 100,
            height: scaleNew(30),
            alignItems: 'center',
            // marginBottom: -scaleNew(4),
            backgroundColor: 'rgba(0,0,0,0.05)',
            alignSelf: 'baseline',
          }}
          onPress={() => {
            handlePresentEmojiModalPress();
          }}>
          {item?.reactions.map(r => {
            if (r.type === 'emoji') {
              return (
                <View
                  style={{
                    ...globalStyles.emojiIcon,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text>{r.reaction}</Text>
                </View>
              );
            }
            return (
              <>
                <FastImage
                  resizeMode="contain"
                  style={{
                    width: scaleNew(20),
                    height: scaleNew(20),
                    resizeMode: 'contain',
                    marginRight: 6,
                  }}
                  source={
                    r?.reactionNew !== undefined && r?.reactionNew !== null
                      ? STICKERS[Number(r.reactionNew)]?.sticker
                      : {
                          uri:
                            Platform.OS === 'android'
                              ? r.reaction
                              : `${r.reaction}.png`,
                          priority: FastImage.priority.high,
                        }
                  }
                />
              </>
            );
          })}
          <Pressable
            style={{flexDirection: 'row'}}
            hitSlop={40}
            onPress={() => {
              handlePresentEmojiModalPress();
            }}>
            <View
              style={{
                width: 1,
                backgroundColor: colors.seperator,
                marginVertical: scaleNew(4),
                marginStart: scaleNew(2),
                marginRight: scaleNew(5),
              }}
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={APP_IMAGE.plusWithoutBack}
                style={{
                  width: scaleNew(8),
                  height: scaleNew(8),
                  resizeMode: 'contain',
                  marginRight: scaleNew(4),
                  marginTop: scaleNew(-0.5),
                  tintColor: hornyMode ? '#E0E0E0' : '#2F3A4E',
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            height: scaleNew(30),
          }}>
          <Pressable
            onPress={() => {
              handlePresentEmojiModalPress();
              //   setStickersBottomSheetVisible(true);
            }}
            style={
              {
                // marginBottom: 5,
                //   marginTop: scaleNew(6),
              }
            }
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}>
            {/* <EmojiPlaceholderIconSvg/> */}
            <Image
              resizeMode="contain"
              source={APP_IMAGE.emojiPlaceholder}
              style={{
                width: scaleNew(20),
                height: scaleNew(20),
                resizeMode: 'contain',

                tintColor: hornyMode
                  ? 'rgba(224, 224, 224, 1)'
                  : 'rgba(33, 33, 33, 1)',
              }}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
