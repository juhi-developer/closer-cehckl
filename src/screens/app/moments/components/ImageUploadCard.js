/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import {
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {scaleNew} from '../../../../utils/metrics2';
import {colors} from '../../../../styles/colors';
import {scale} from '../../../../utils/metrics';
import {fonts} from '../../../../styles/fonts';
import ImagePicker from 'react-native-image-crop-picker';
import {generateID, uploadEncryptedToS3} from '../../../../utils/helpers';
import {Image as CompressedImage} from 'react-native-compressor';
import * as Sentry from '@sentry/react-native';
import RNFS from 'react-native-fs';
import API from '../../../../redux/saga/requestAuth';
import ImageUploadCardSingleImage from './ImageUploadCardSingleImage';
import {useAppContext} from '../../../../utils/VariablesContext';
import ImageView from 'react-native-image-viewing';
import {ToastMessage} from '../../../../components/toastMessage';
import {VARIABLES} from '../../../../utils/variables';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageCardTooltip from '../../../../components/contextualTooltips/ImageCardTooltip';

const CleverTap = require('clevertap-react-native');

export default function ImageUploadCard({
  text,
  images,
  refreshCardData,
  disabled,
}) {
  const [selectedImages, setselectedImages] = useState([]);

  const {hornyMode} = useAppContext();
  const [visibleImage, setVisibleImage] = useState(false);
  const [pressedImg, setpressedImg] = useState(0);

  async function StoreLocalImage(imageUri, fileName) {
    // Request necessary permissions if needed (e.g., for Android)
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path

    //const directoryPath = `${picturesPath}/${directoryName}`; // Specify the name of your directory
    const directoryPath = picturesPath;
    // Check if the directory exists, and create it if it doesn't
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
    }

    const destinationPath = `${directoryPath}/${fileName}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(imageUri, destinationPath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  }

  const onPressAddImages = async imageURIs => {
    const responses = [];
    try {
      for (const imageURI of imageURIs) {
        let id = generateID();
        const filename = `${id}${Date.now()}.jpg`;

        const path = await CompressedImage.compress(imageURI);

        const s3response = await uploadEncryptedToS3(
          path,
          filename,
          'image/jpeg',
          'profiles',
        );

        await StoreLocalImage(path, filename); // storing locally by creating directory

        if (s3response) {
          responses.push({...s3response, Key: filename});
        } else {
        }
      }
    } catch (error) {
    } finally {
    }
    return responses;
  };

  useEffect(() => {
    if (images?.length > 0) {
      const data = images.map(im => {
        return {
          ...im,
          isPrev: true,
        };
      });

      setselectedImages(data);
    } else {
      setselectedImages([]);
    }
    return () => {};
  }, [images, text]);

  const userImages = selectedImages.filter(
    image => image.user === VARIABLES.user._id,
  );

  return (
    <View
      style={{
        zIndex: 10,
      }}>
      <ImageBackground
        resizeMode="stretch"
        source={
          selectedImages.length > 0
            ? hornyMode
              ? require('../../../../assets/images/imageCardBgHorny2.png')
              : require('../../../../assets/images/imageCardBg2.png')
            : hornyMode
            ? require('../../../../assets/images/imageCardBgHorny.png')
            : require('../../../../assets/images/imageCardBg.png')
        }
        style={[
          styles.container,
          hornyMode ? {backgroundColor: '#331A4F', borderColor: '#4D2777'} : {},
        ]}>
        <Text
          style={{
            fontFamily: fonts.regularSerif,
            fontSize: scaleNew(18),
            color: colors.textSecondary2,
            marginHorizontal: scaleNew(15),
          }}>
          #throwback
        </Text>
        <View style={styles.viewRowSpace}>
          <Text style={[styles.textHeader, hornyMode ? {color: '#ccc'} : {}]}>
            {text}
          </Text>

          <Pressable
            style={styles.viewPlus}
            onPress={async () => {
              if (disabled || VARIABLES.disableTouch) {
                return;
              }

              if (userImages?.length >= 4) {
                ToastMessage('You can only add up to 4 images');
                return;
              }

              try {
                const options = {
                  mediaType: 'photo',
                  selectionLimit: 4 - userImages.length, // limit the number of selectable images
                };

                const res = await launchImageLibrary(options);

                refreshCardData(true); // Assuming you are setting a loading state here

                const imageArray = await onPressAddImages(
                  res.assets.map(image => image.uri),
                );

                CleverTap.recordEvent('#throwback answered');
                CleverTap.recordEvent('#throwback photos added');
                const resp = await API('user/moments/nudgeCardPhotos', 'PUT', {
                  photos: imageArray.map(im => ({
                    url: im.Key,
                    nonce: im.nonce,
                  })),
                });

                refreshCardData(false); // Reset the loading state
                refreshCardData(resp.body.data); // Update the card data

                setselectedImages([]); // Clear the previously selected images
                setselectedImages(
                  resp.body.data?.images?.map(im => ({...im, isPrev: true})),
                );
              } catch (error) {
                refreshCardData(false);
                if (error.code === 'E_NO_LIBRARY_PERMISSION') {
                  alert('Please give media permissions from settings');
                } else {
                  console.log('Error during image selection or upload:', error);
                }
              } finally {
                refreshCardData(false);
              }
            }}>
            <Image
              style={{
                tintColor: userImages?.length >= 4 ? '#CDCDCD' : colors.blue1,
              }}
              source={require('../../../../assets/images/plusIconGrey.png')}
            />
          </Pressable>
        </View>
        {selectedImages.length > 0 && (
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{paddingRight: 40}}
            style={styles.viewRowCenter}>
            {selectedImages.map((selectedImage, index) => {
              if (selectedImage?.isPrev) {
                return (
                  <Pressable
                    onPress={() => {
                      setpressedImg(index);
                      setVisibleImage(true);
                    }}>
                    <ImageUploadCardSingleImage url={selectedImage} />
                  </Pressable>
                );
              }
              return (
                <Image style={styles.img} source={{uri: selectedImage?.path}} />
              );
            })}
          </ScrollView>
        )}
        <ImageView
          images={selectedImages?.map(img => {
            return {
              uri: 'file://' + RNFS.DocumentDirectoryPath + `/${img.url}`,
            };
          })}
          imageIndex={pressedImg}
          visible={visibleImage}
          onRequestClose={() => setVisibleImage(false)}
          doubleTapToZoomEnabled={true}
        />
      </ImageBackground>
      <ImageCardTooltip />
    </View>
  );
}

const styles = StyleSheet.create({
  viewRowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginStart: scaleNew(15),
    marginTop: scaleNew(15),
    marginEnd: scaleNew(15),
  },
  viewRowCenter: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingStart: scaleNew(15),
    marginTop: scaleNew(18),
  },
  img: {
    width: scaleNew(50),
    height: scaleNew(64),
    borderRadius: scaleNew(8),
    marginEnd: scaleNew(6),
    resizeMode: 'cover',
    backgroundColor: colors.borderColor,
  },
  container: {
    paddingVertical: scaleNew(15),
    borderRadius: scaleNew(12),
    backgroundColor: '#FBFBFB',

    //  borderWidth: 1,
    //  borderStyle: 'dashed',
    //   borderColor: colors.borderColor,
    marginTop: scaleNew(23),
    marginHorizontal: scaleNew(16),
    paddingEnd: 2,
  },
  textHeader: {
    fontFamily: fonts.regularFont,
    fontSize: scaleNew(16),
    color: colors.textSecondary2,

    flexShrink: 1,
    marginEnd: scaleNew(25),
    lineHeight: scaleNew(24),
    // marginTop: scaleNew(6),
  },
  viewPlus: {
    width: scaleNew(46),
    height: scaleNew(63),
    backgroundColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scaleNew(8),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.07)',
  },
});
