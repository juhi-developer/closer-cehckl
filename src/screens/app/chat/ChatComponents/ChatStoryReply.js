import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {globalStyles} from '../../../../styles/globalStyles';
import {colors} from '../../../../styles/colors';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import RNFS from 'react-native-fs';

const imageWidth = 200;
const imageHeight = 250;

const ChatStoryReply = ({item, onLongPress, openImage, sentByUser}) => {
  const [imageLoading, setimageLoading] = useState(false);

  return (
    <Pressable
      onPress={() => {
        openImage(`file://${RNFS.DocumentDirectoryPath}/${item.storyImage}`);
        // openImage(item.storyImage);
        // setViewImage(AWS_URL_S3+`production/chat/` + item.message)
        // setViewImage(item?.status ? item.message : image);
        // setVisibleImage(true);
      }}
      onLongPress={() => {
        onLongPress(item);
        // setHook(!hook);
        // setIsReactionEnabled(true);
        // setChatId(item?._id);
        // ReactNativeHapticFeedback.trigger('impactHeavy', options);
        // handlePresentEmojiModalPress();
      }}
      style={[
        {
          backgroundColor: VARIABLES.themeData.strokeColor,
          padding: 5,
          borderRadius: 10,
        },
        sentByUser
          ? {
              borderBottomRightRadius: 0,
            }
          : {
              borderBottomLeftRadius: 0,
            },
      ]}>
      {/* {item?.quotedMessage && (
        <QuotedMessage
          quoted={item?.quotedMessage}
          messageUserId={item?.senderId}
        />
      )} */}

      <FastImage
        source={{
          uri: `file://${RNFS.DocumentDirectoryPath}/${item.storyImage}`,
        }}
        style={[
          {
            width: imageWidth,
            height: imageHeight,
            borderRadius: 10,
          },
          sentByUser
            ? {
                borderBottomRightRadius: 0,
              }
            : {
                borderBottomLeftRadius: 0,
              },
        ]}
        resizeMode="cover"
        onLoadStart={() => setimageLoading(true)}
        onLoadEnd={() => setimageLoading(false)}
      />
      <View
        style={{
          paddingVertical: scale(7),
        }}>
        <Text
          style={{
            ...globalStyles.italicMediumText,
            width: imageWidth,
          }}>
          {item.message}
        </Text>
      </View>
    </Pressable>
  );
};

export default ChatStoryReply;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomStartRadius: scale(30),
    borderBottomEndRadius: scale(30),
    backgroundColor: "'#EFE8E6'",
  },
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(16),
    backgroundColor: '#fff',
    paddingHorizontal: scale(12),
    borderRadius: scale(20),
  },
  userImage: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
  },
  inputContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: "space-between",
    backgroundColor: '#EFE8E6',
    borderRadius: scale(12),
    paddingHorizontal: scale(16),
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  replyInputContainer: {
    marginHorizontal: scale(16),

    borderRadius: scale(12),
    // backgroundColor: 'red'
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  messageStatusContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  messageStatusClockImg: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
});
