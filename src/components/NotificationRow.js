/* eslint-disable react-native/no-inline-styles */
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {APP_IMAGE, NOTIFICATION_TYPES} from '../utils/constants';
import {globalStyles} from '../styles/globalStyles';
import {scale} from '../utils/metrics';

import {colors} from '../styles/colors';
import {VARIABLES} from '../utils/variables';
import {AWS_URL_S3} from '../utils/urls';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import {getTimeAgo} from '../utils/utils';
import {InitialsAvatar} from '../screens/app/moments/components/InitialsAvatar';
import {ProfileAvatar} from './ProfileAvatar';

const CleverTap = require('clevertap-react-native');

const NotificationRow = ({item, index, notifHandler}) => {
  let rightImage = null;
  let rightImageStyles = {
    width: 33,
    height: 33,
    marginTop: scale(8),
    marginLeft: 12,
  };
  switch (item.type) {
    case NOTIFICATION_TYPES.nudge:
      rightImage = APP_IMAGE.nudge;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
    case NOTIFICATION_TYPES.event:
      rightImage = APP_IMAGE.notificationDates;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
    case NOTIFICATION_TYPES.note:
      rightImage = APP_IMAGE.stickyNotes;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
    case NOTIFICATION_TYPES.mood:
      rightImage = APP_IMAGE.mood;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
    case NOTIFICATION_TYPES.organize_note:
    case NOTIFICATION_TYPES.organize_to_do:
    case NOTIFICATION_TYPES.organize_template:
      rightImage = APP_IMAGE.notesNotif;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
    case NOTIFICATION_TYPES.story:
    case NOTIFICATION_TYPES.story_reaction:
    case NOTIFICATION_TYPES.highlight:
      rightImage = {uri: `file://${RNFS.DocumentDirectoryPath}/${item.image}`};
      // rightImage = {
      //   uri: `${AWS_URL_S3}production/stories/${item.image}`,
      // };
      rightImageStyles.width = 45;
      rightImageStyles.height = 45;
      rightImageStyles.marginLeft = 5;
      rightImageStyles.borderRadius = 5;
      rightImageStyles.backgroundColor = '#eee';
      break;
    case NOTIFICATION_TYPES.feed:
    case NOTIFICATION_TYPES.comment:
    case NOTIFICATION_TYPES.post_reaction:
      rightImage = {uri: `file://${RNFS.DocumentDirectoryPath}/${item.image}`};
      rightImageStyles.width = 45;
      rightImageStyles.height = 45;
      rightImageStyles.marginLeft = 5;
      rightImageStyles.borderRadius = 5;
      rightImageStyles.backgroundColor = '#eee';
      break;
    default:
      rightImage = APP_IMAGE.quizNotif;
      rightImageStyles.width = scale(35);
      rightImageStyles.height = scale(35);
      rightImageStyles.marginLeft = scale(12);
      rightImageStyles.borderRadius = scale(5);
      break;
  }
  let imgSource = '';
  if (!item?.user) {
    imgSource = rightImage;
  } else {
    if (item.user === VARIABLES.user._id) {
      imgSource = VARIABLES.user?.profilePic
        ? {
            uri: AWS_URL_S3 + VARIABLES.user?.profilePic,
          }
        : undefined;
    } else {
      imgSource = VARIABLES.user?.partnerData?.partner?.profilePic
        ? {
            uri: AWS_URL_S3 + VARIABLES.user?.partnerData?.partner?.profilePic,
          }
        : undefined;
    }
  }

  return (
    <Pressable
      style={{
        ...styles.container,
        backgroundColor: item.isChecked ? colors.white : colors.blue10,
      }}
      onPress={() => {
        // console.log('notification item item', item);
        // if (item.type === 'nudge') {
        //   return;
        // }
        notifHandler(item);
        CleverTap.recordEvent('Activity tapped');
      }}>
      <View style={{paddingHorizontal: 6}}>
        {item?.type === 'nudge_card' ? (
          <FastImage
            source={APP_IMAGE.appIcon}
            style={{
              marginTop: scale(8),
              width: 33,
              height: 33,
              borderRadius: 33,
              backgroundColor: 'transparent',
            }}
            resizeMode="contain"
          />
        ) : (
          <ProfileAvatar
            type={item.user === VARIABLES.user._id ? 'user' : 'partner'}
            style={{
              marginTop: scale(8),
              width: 33,
              height: 33,
              borderRadius: 33,
            }}
          />
        )}
      </View>
      <View style={{flex: 1, marginStart: 12}}>
        <Text style={{...globalStyles.standardMediumText}}>{item.message}</Text>
        <Text
          style={{
            ...globalStyles.regularSmallText,
            opacity: 0.6,
            marginTop: scale(8),
          }}>
          {getTimeAgo(item.createdAt)}
          {/* {moment(item.createdAt).fromNow()}{' '} */}
        </Text>
      </View>
      {!!item.user && (
        <FastImage source={rightImage} style={rightImageStyles} />
      )}
    </Pressable>
  );
};

export default NotificationRow;

const styles = StyleSheet.create({
  container: {
    padding: scale(16),
    flexDirection: 'row',
    borderRadius: 10,
  },
});
