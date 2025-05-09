/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  ImageBackground,
  Platform,
  Pressable,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {scale} from '../../../../utils/metrics';
import {colors} from '../../../../styles/colors';
import {VARIABLES} from '../../../../utils/variables';
import {scaleNew} from '../../../../utils/metrics2';
import {globalStyles} from '../../../../styles/globalStyles';
import {AWS_URL_S3} from '../../../../utils/urls';
import {ProfileAvatar} from '../../../../components/ProfileAvatar';

const StoryThumbnail = ({item, index, array, navigation, user, title}) => {
  return (
    <Pressable
      onPress={() => {
        const newArray = [...array];
        newArray.reverse();
        navigation.navigate('story', {
          story: {title: title},
          storyBundle: [
            {
              user_id: user?._id,
              user_name: user?.name,
              user_image: user?.profilePic,
              stories: newArray,
            },
          ],
          singleStory: true,
          type: 'story',
          storyPressIndex: array.length - index - 1,
        });
      }}
      style={{
        marginEnd: scaleNew(8),
        zIndex: 10,
        paddingStart: scaleNew(5),
      }}>
      <FastImage
        style={{
          width: scaleNew(62.7),
          height: scaleNew(81),
          borderRadius: scaleNew(26),
          overflow: 'hidden',
          backgroundColor: 'black',
          resizeMode: 'cover',
          borderWidth: !item.isSeen ? 2 : 0.5,
          borderColor: !item.isSeen ? colors.blue1 : colors.grey10,
        }}
        source={{uri: `file://${item.story_image}`}}
        resizeMode={'cover'}
      />
      {index === 0 && (
        <ProfileAvatar
          type={user?._id === VARIABLES.user?._id ? 'user' : 'partner'}
          style={{
            width: scaleNew(21),
            height: scaleNew(21),
            borderRadius: scaleNew(26),

            resizeMode: 'cover',
            position: 'absolute',
            top: scaleNew(0),
            left: -scaleNew(0),
            zIndex: 10,
          }}
        />
      )}
    </Pressable>
  );
};

const StoriesComp = React.memo(({userStory, partnerStory, navigation}) => {
  return (
    <>
      {userStory.length !== 0 || partnerStory.length !== 0 ? (
        <View style={{marginStart: scaleNew(16), marginTop: scale(23)}}>
          <Text
            style={{
              ...globalStyles.semiBoldLargeText,
              color: colors.textSecondary,
              fontSize: scaleNew(18),
              includeFontPadding: false,
              marginBottom: -6,
            }}>
            Stories
          </Text>

          {partnerStory.length !== 0 && (
            <FlatList
              data={partnerStory}
              horizontal
              contentContainerStyle={{marginTop: scaleNew(17)}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <StoryThumbnail
                  item={item}
                  index={index}
                  array={partnerStory}
                  navigation={navigation}
                  user={VARIABLES.user?.partnerData?.partner}
                  title={VARIABLES.user?.partnerData?.partner?.name}
                />
              )}
              keyExtractor={item => item.story_id.toString()}
            />
          )}

          {userStory.length !== 0 && (
            <FlatList
              contentContainerStyle={{marginTop: scaleNew(17)}}
              data={userStory}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <StoryThumbnail
                  item={item}
                  index={index}
                  array={userStory}
                  navigation={navigation}
                  user={VARIABLES.user}
                  title="You"
                />
              )}
              keyExtractor={item => item.story_id.toString()}
            />
          )}
        </View>
      ) : null}
    </>
  );
});

export default StoriesComp;
