/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, Platform} from 'react-native';
import React, {useCallback, useState} from 'react';
import {scale} from '../utils/metrics';
import FastImage from 'react-native-fast-image';
import {AWS_URL_S3} from '../utils/urls';
import {APP_IMAGE} from '../utils/constants';
import {fonts} from '../styles/fonts';
import moment from 'moment';
import {colors} from '../styles/colors';
import {getTimeAgo} from '../utils/utils';
import {scaleNew} from '../utils/metrics2';
import {ProfileAvatar} from './ProfileAvatar';
import {VARIABLES} from '../utils/variables';

const MomentComment = ({profileData, styles, bottomBg, descriptionColor}) => {
  const [lines, setlines] = useState(0);
  const onTextLayout = useCallback(e => {
    setlines(e.nativeEvent.lines.length);
  }, []);
  return (
    <View
      style={{
        backgroundColor: bottomBg,
        borderRadius: scale(8),
        paddingHorizontal: scaleNew(9),
        //    paddingVertical: scaleNew(10),
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: scale(12),
        minHeight: scaleNew(68),
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
        <ProfileAvatar
          type={
            profileData?.user?._id === VARIABLES.user?._id ? 'user' : 'partner'
          }
          style={{width: 38, height: 38, borderRadius: 19}}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',

            marginEnd: scaleNew(20),
          }}>
          <Text
            style={{
              fontFamily:
                Platform.OS === 'android' ? fonts.lightFont : fonts.regularFont,
              fontSize: scaleNew(14),
              lineHeight: scaleNew(21),
              color: descriptionColor,
              marginStart: scaleNew(7),
              //  marginTop: scale(18),

              //   flex: 1,
            }}
            onTextLayout={onTextLayout}
            numberOfLines={2}>
            {profileData?.comment}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.regularFont,
            fontSize: scaleNew(12),

            color: descriptionColor,
            position: 'absolute',
            bottom: 0,
            end: 0,
            textAlign: 'right',
          }}>
          {getTimeAgo(profileData?.createdAt)}
          {/* {moment(profileData?.createdAt).fromNow()} */}
        </Text>
      </View>
    </View>
  );
};

export default MomentComment;
