import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {LinkPreview} from '@flyerhq/react-native-link-preview';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import {globalStyles} from '../../../../styles/globalStyles';
import {useRealm} from '@realm/react';

import {generateID} from '../../../../utils/helpers';
import RNFS from 'react-native-fs';
import {colors} from '../../../../styles/colors';

const ChatLinkPreview = React.memo(({sentByUser, url, item}) => {
  const realm = useRealm();

  return (
    <>
      {item.thumbnailImage !== '' &&
      item.thumbnailImage !== null &&
      item.thumbnailImage !== undefined ? (
        <>
          <View
            style={[
              styles.baseStyles,
              sentByUser ? styles.sentByUser : styles.sentByPartner,
              {
                backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
              },
            ]}>
            {console.log('thumbnailImage link', item.thumbnailImage)}
            <Image
              style={styles.imageStyles}
              source={{
                uri: `file://${RNFS.DocumentDirectoryPath}/${item.thumbnailImage}`,
              }}
            />

            {item?.docName !== undefined && item.docName !== null && (
              <Text style={styles.titleText} numberOfLines={1}>
                {item?.docName}
              </Text>
            )}

            {item?.orientation !== undefined && item?.orientation !== null && (
              <Text style={styles.descpText} numberOfLines={2}>
                {item?.orientation}
              </Text>
            )}

            {item?.mime !== undefined && item?.mime !== null && (
              <Text style={styles.linkText} numberOfLines={1}>
                {item?.mime}
              </Text>
            )}

            <Text style={styles.descpText} numberOfLines={2}>
              {url}
            </Text>
          </View>
        </>
      ) : (
        <>
          <LinkPreview
            enableAnimation
            text={url}
            touchableWithoutFeedbackProps={{
              disabled: true,
            }}
            renderLinkPreview={({previewData}) => {
              if (Platform.OS === 'ios') {
                console.log('preview dataa ios', previewData);
              } else {
                console.log('preview dataa android', previewData);
              }

              if (previewData?.image !== undefined) {
                setTimeout(async () => {
                  console.log('preview dataa image', previewData.image.url);
                  // Download the image from the URL
                  const thumbnailFilename = generateID();
                  const newThumbnailPath = `${RNFS.DocumentDirectoryPath}/${thumbnailFilename}.jpg`;
                  await RNFS.downloadFile({
                    fromUrl: previewData.image.url, // Assuming the first image is the one you want
                    toFile: newThumbnailPath,
                  }).promise;

                  // Begin write transaction
                  realm.write(() => {
                    // Find the object with the matching _id
                    let chatMessage = realm
                      .objects('Message')
                      .filtered(`_id = "${item._id}"`)[0];
                    // Update the thumbnailImage and title properties
                    if (chatMessage) {
                      chatMessage.thumbnailImage = `${thumbnailFilename}.jpg`;
                      chatMessage.docName = previewData.title;
                      chatMessage.orientation = previewData.description;
                      chatMessage.mime = previewData.link;
                    }
                  });
                }, 10);
              }
              return (
                <>
                  <View
                    style={[
                      styles.baseStyles,
                      sentByUser ? styles.sentByUser : styles.sentByPartner,
                      {
                        backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
                      },
                    ]}>
                    <Image
                      style={styles.imageStyles}
                      source={{uri: previewData?.image?.url}}
                    />

                    <Text style={styles.titleText} numberOfLines={1}>
                      {previewData?.title}
                    </Text>

                    <Text style={styles.descpText} numberOfLines={2}>
                      {previewData?.description}
                    </Text>

                    <Text style={styles.linkText} numberOfLines={1}>
                      {previewData?.link}
                    </Text>

                    <Text style={styles.descpText} numberOfLines={2}>
                      {url}
                    </Text>
                  </View>
                </>
              );
            }}
          />
        </>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  baseStyles: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(9),
    width: scale(321),
    height: scale(322),
  },
  sentByUser: {
    backgroundColor: VARIABLES.themeData.strokeColor,
    borderRadius: scale(15),
    borderBottomRightRadius: 0,
    alignSelf: 'flex-end',
  },
  sentByPartner: {
    backgroundColor: VARIABLES.themeData.themeColor,
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
    alignSelf: 'flex-start',
  },
  imageStyles: {
    height: scale(150),
    width: scale(305),
    borderRadius: scale(10),
  },
  titleText: {
    ...globalStyles.semiBoldLargeText,
    marginTop: scale(12),
  },
  descpText: {
    ...globalStyles.regularMediumText,
    fontSize: scale(12),
    marginTop: scale(4),
  },
  linkText: {
    ...globalStyles.regularMediumText,
    marginTop: scale(4),
    color: '#127FFE',
    textDecorationLine: 'underline',
    marginBottom: scale(5),
  },
});

export default ChatLinkPreview;
