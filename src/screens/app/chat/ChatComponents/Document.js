import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {scale} from '../../../../utils/metrics';
import {VARIABLES} from '../../../../utils/variables';
import {globalStyles} from '../../../../styles/globalStyles';
import {APP_IMAGE} from '../../../../utils/constants';
import {SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {downloadAndDecryptFromS3} from '../../../../utils/helpers';
import naclUtil from 'tweetnacl-util';
import RNFS from 'react-native-fs';
import {colors} from '../../../../styles/colors';

const Document = ({sentByUser, docName, docLink, item}) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');
  const [progress, setProgress] = useState(0);

  const loadFile = useCallback(
    async uri => {
      setFile('');
      console.log('uriiiii', uri, Platform.OS);
      const path = RNFS.DocumentDirectoryPath + `/${uri}`;
      console.log('full path', path, Platform.OS);
      const exists = await RNFS.exists(path);
      if (exists) {
        console.log('if doc exists', path, Platform.OS);
        setFile('file://' + path);
      } else if (!sentByUser) {
        setProgress(0);
        setLoading(true);
        try {
          const nonce = naclUtil.decodeBase64(item.nonce);
          let data = await downloadAndDecryptFromS3(
            uri,
            'chat',
            nonce,
            progress => {
              setProgress(progress);
              console.log('progresss', progress);
            },
          );
          setLoading(false);
          setFile('file://' + RNFS.DocumentDirectoryPath + '/' + data);
        } catch (error) {
          setLoading(false);
        }
      }
    },
    [docLink],
  );
  useEffect(() => {
    loadFile(docLink);
    return () => {};
  }, [docLink, loadFile]);

  return (
    <View
      style={[
        styles.baseStyles,
        sentByUser ? styles.sentByUser : styles.sentByPartner,
        {
          backgroundColor: sentByUser ? colors.blue3 : '#FAFBF8',
        },
      ]}>
      <Image style={styles.docImg} source={APP_IMAGE.pdfImage} />
      <Text
        style={{
          ...globalStyles.semiBoldLargeText,
          width: SCREEN_WIDTH * 0.6 - scale(100),
        }}
        numberOfLines={2}>
        {docName}
      </Text>
    </View>
  );
};

export default Document;

const styles = StyleSheet.create({
  baseStyles: {
    paddingHorizontal: scale(17),
    paddingVertical: scale(14),
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.75,
  },
  sentByUser: {
    backgroundColor: VARIABLES.themeData.strokeColor,
    alignSelf: 'flex-end',
    borderRadius: scale(15),
    borderBottomRightRadius: 0,
  },
  sentByPartner: {
    backgroundColor: VARIABLES.themeData.themeColor,
    alignSelf: 'flex-start',
    borderRadius: scale(15),
    borderBottomLeftRadius: 0,
  },
  docImg: {
    width: scale(52),
    height: scale(52),
  },
});
