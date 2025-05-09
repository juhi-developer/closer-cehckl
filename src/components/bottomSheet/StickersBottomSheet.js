/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, View, Pressable, Image, Platform} from 'react-native';
import React, {useRef, useState, useEffect, useMemo, useCallback} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {STICKERS} from '../../utils/constants';
import {updateRecentlyUsedEmoji} from '../../utils/helpers';
import {SCREEN_WIDTH, globalStyles} from '../../styles/globalStyles';
import FastImage from 'react-native-fast-image';
import {VARIABLES} from '../../utils/variables';
import {scale} from '../../utils/metrics';

const StickersBottomSheet = props => {
  const {bottomSheetVisible, setBottomSheetVisible, SendReactionHandler} =
    props;
  const bottomSheetEmojiModalRef = useRef(null);
  const [themeColor, setThemeColor] = useState('#EFE8E6');
  const snapPointsEmoji = useMemo(() => ['1%', '80%', '80%'], []);

  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [icontabs, setIconTabs] = useState([
    {tab: 'Sticker', selected: true},
    {tab: 'Emoji', selected: false},
  ]);

  useEffect(() => {
    bottomSheetEmojiModalRef.current.present();
  }, [bottomSheetEmojiModalRef]);

  const stickerItem = ({item, index, containerStyle = {}}) => {
    return (
      <Pressable
        onPress={() => {
          updateRecentlyUsedEmoji(item);

          //  setHook(!hook);
          //  bottomSheetEmojiModalRef.current.dismiss();

          SendReactionHandler(item.name, 'sticker', item.id);
        }}
        style={{width: SCREEN_WIDTH / 5, ...containerStyle}}>
        <FastImage
          source={item.sticker}
          style={{width: 48, height: 44}}
          resizeMode="contain"
        />
      </Pressable>
    );
  };

  return (
    <BottomSheetModal
      index={bottomSheetVisible === false ? -1 : 2}
      visible={bottomSheetVisible}
      ref={bottomSheetEmojiModalRef}
      snapPoints={snapPointsEmoji}
      keyboardBehavior="extend"
      onChange={index => {
        if (index === -1 || index === 0) {
          setBottomSheetVisible(false);
        }
      }}
      backgroundStyle={{
        backgroundColor: themeColor,
      }}
      backdropComponent={({animatedIndex, style}) => (
        <BottomSheetBackdrop
          animatedIndex={animatedIndex}
          style={style}
          onPress={() => {
            setBottomSheetVisible(false);
          }}
        />
      )}>
      {icontabs[0].selected && (
        <BottomSheetFlatList
          data={STICKERS}
          renderItem={stickerItem}
          keyExtractor={(item, index) => index}
          numColumns={5}
          columnWrapperStyle={{
            margin: 16,
          }}
          ListHeaderComponent={() => {
            if (VARIABLES.recentReactions.length > 0) {
              return (
                <View
                  style={{
                    margin: 16,
                  }}>
                  <Text
                    style={{
                      ...globalStyles.standardMediumText,
                      fontSize: scale(18),
                    }}>
                    Recently used
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: scale(16),
                    }}>
                    {VARIABLES.recentReactions.map(item => {
                      return stickerItem({
                        item,
                        containerStyle: {width: SCREEN_WIDTH / 5 - 2},
                      });
                    })}
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: '#EBC9C0',
                      marginTop: scale(24),
                    }}
                  />
                </View>
              );
            }
            return <View />;
          }}
        />
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({});

export default StickersBottomSheet;
