/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TextInput,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CornerHeader from '../../../components/cornerHeader';
import GoBackIconSvg from '../../../assets/svgs/goBackIconSvg';
import AppView from '../../../components/AppView';
import {globalStyles} from '../../../styles/globalStyles';
import {APP_IMAGE} from '../../../utils/constants';
import SizeTogglerIconSvg from '../../../assets/svgs/sizeTogglerIconSvg';
import {colors} from '../../../styles/colors';
import AppButton from '../../../components/appButton';
import {scale, verticalScale} from '../../../utils/metrics';
import {generateID, uploadEncryptedToS3} from '../../../utils/helpers';
import * as actions from '../../../redux/actionTypes';
import {useSelector, useDispatch} from 'react-redux';
import {ClearAction} from '../../../redux/actions';
import OverlayLoader from '../../../components/overlayLoader';
import RNFS from 'react-native-fs';
import {EventRegister} from 'react-native-event-listeners';
import {VARIABLES} from '../../../utils/variables';
import {Image as CompressedImage} from 'react-native-compressor';
import {addImagePost} from '../../../redux/saga/handlers';
import * as Sentry from '@sentry/react-native';
import {scaleNew} from '../../../utils/metrics2';
import ImagePicker from 'react-native-image-crop-picker';
import {fonts} from '../../../styles/fonts';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AddFeedGoBackModal from '../../../components/Modals/AddFeedGoBackModal';
import FastImage from 'react-native-fast-image';
import {ToastMessage} from '../../../components/toastMessage';
import {
  checkContextualTooltip,
  updateContextualTooltipState,
} from '../../../utils/contextualTooltips';

const CleverTap = require('clevertap-react-native');

export default function AddFeed(props) {
  const dispatch = useDispatch();

  const {imageURI, imageObject1} = props.route.params;

  const [loading, setLoading] = useState(false);
  const [imageHeight, setImageHeight] = useState(verticalScale(488));
  const [photoEnlarge, setPhotoEnlarge] = useState(true);
  const [caption, setCaption] = useState('');
  const [captionLength, setCaptionLength] = useState(0);
  const [imagesArray, setImagesArray] = useState(imageURI);

  const [addFeedBackModalVisible, setAddFeedBackModalVisible] = useState(false);

  async function StoreLocalImage(imageUri, fileName) {
    // Request necessary permissions if needed (e.g., for Android)
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }

    const picturesPath = RNFS.DocumentDirectoryPath; // Get the default pictures directory path
    console.log('picturesPath', picturesPath);

    //const directoryPath = `${picturesPath}/${directoryName}`; // Specify the name of your directory
    const directoryPath = picturesPath;
    // Check if the directory exists, and create it if it doesn't
    const directoryExists = await RNFS.exists(directoryPath);
    if (!directoryExists) {
      await RNFS.mkdir(directoryPath);
      console.log('Directory created:', directoryPath);
    }

    const destinationPath = `${directoryPath}/${fileName}`;

    try {
      // Copy the image to the destination directory
      await RNFS.copyFile(imageUri, destinationPath);
      console.log('Image uploaded Locally:', destinationPath);
    } catch (error) {
      console.log('Error uploading image:', error);
    }
  }

  const addImageAPI = async params => {
    try {
      await dispatch(addImagePost(params));

      setLoading(false);
      CleverTap.recordEvent('Posts added in Feed');
      props.navigation.navigate('Moments');

      const checkInAppReview = await checkContextualTooltip('inAppReviewShown');

      if (checkInAppReview === '0') {
        await updateContextualTooltipState('inAppReviewShown', '1');
      } else if (checkInAppReview === '1') {
        EventRegister.emit('inAppReviewShown');
        await updateContextualTooltipState('inAppReviewShown', '2');
      }

      dispatch(ClearAction());
    } catch (error) {
      dispatch(ClearAction());
    } finally {
      setLoading(false);
    }
  };

  const onPressAddImages = async imageURIs => {
    const responses = [];
    try {
      for (const imageURI of imageURIs) {
        let id = generateID();
        const filename = `${id}${Date.now()}.jpg`;

        const path = await CompressedImage.compress(imageURI.path);

        const s3response = await uploadEncryptedToS3(
          path,
          filename,
          'image/jpeg',
          'profiles',
        );

        await StoreLocalImage(path, filename); // storing locally by creating directory

        if (s3response) {
          responses.push({
            url: filename,
            nonce: s3response.nonce,
            renderType: imageURI.renderType,
          });
        } else {
          throw new Error('Error uploading image', s3response);
        }
      }
    } catch (error) {
      console.log('error while uploading', error);
      throw new Error('Error uploading image', error);
    } finally {
    }
    return responses;
  };

  const onPressAddImage = async () => {
    if (imagesArray.length === 0) {
      ToastMessage('Please add at least one image');
      return;
    }
    try {
      setLoading(true);

      const imageArray = await onPressAddImages(imagesArray);

      if (caption.trim().length !== 0) {
        CleverTap.recordEvent('Memories caption added');
      }
      if (imageArray.length === 1) {
        CleverTap.recordEvent('Memories single photo');
      } else {
        CleverTap.recordEvent('Memories multiple photos');
      }

      CleverTap.recordEvent('Memories posts added');
      // Loop through imageArray and record event for each photo
      for (let i = 0; i < imageArray.length; i++) {
        CleverTap.recordEvent('Memories photos added');
      }

      let params = {
        images: imageArray,
        url: imageArray[0].url,
        nonce: imageArray[0].nonce,
        title: caption.trim(),
        type: 'photo',
      };
      await addImageAPI(params);
    } catch (error) {
      console.log('error 123', error);
    } finally {
      setLoading(false);
    }
  };

  const AppHeader = () => {
    return (
      <CornerHeader
        leftIcon={<GoBackIconSvg />}
        leftPress={() => {
          setAddFeedBackModalVisible(true);
        }}
        rightIcon={
          <Pressable onPress={() => onPressAddImage()}>
            <Text
              style={{
                fontFamily: fonts.semiBoldFont,
                fontSize: scale(18),
                color: colors.blue1,
                includeFontPadding: false,
                //   marginTop: scale(4),
              }}>
              Post
            </Text>
          </Pressable>
        }
        titleBox={
          <Text
            style={{
              fontFamily: fonts.standardFont,
              fontSize: scale(18),
              color: '#2F3A4E',
              marginTop: Platform.OS === 'ios' ? 0 : scale(2),
            }}>
            Add Image
          </Text>
        }
      />
    );
  };
  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        // isLoading={loading}
        header={AppHeader}>
        <OverlayLoader visible={loading} />
        <View>
          <View style={{}}>
            <ScrollView
              contentContainerStyle={{
                alignItems: 'center',
                height: scaleNew(297),
                marginStart: scale(16),
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              {imagesArray.map((image, index) => (
                <View
                  style={
                    {
                      //  marginStart: scale(16),
                    }
                  }>
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: scale(10),
                      right: scale(10),
                      zIndex: 10,

                      borderRadius: 100,
                    }}
                    onPress={() => {
                      setImagesArray(prevImages =>
                        prevImages.filter((item, i) => i !== index),
                      );
                    }}>
                    <Image
                      style={{
                        width: scaleNew(20),
                        height: scaleNew(20),
                      }}
                      source={require('../../../assets/images/closeWhiteBg.png')}
                    />
                  </Pressable>
                  <FastImage
                    source={{uri: image.path}}
                    resizeMode={image.renderType}
                    style={{
                      width: scaleNew(241),
                      height: scaleNew(297),
                      borderRadius: scaleNew(18),
                      marginEnd: scaleNew(4),
                    }}
                    // resizeMode='cover'
                    defaultSource={APP_IMAGE.placeholderImage}
                  />
                  <Pressable
                    style={{
                      position: 'absolute',
                      bottom: scale(14),
                      left: scale(14),
                    }}
                    onPress={() => {
                      const newImagesArray = imagesArray.map((image, i) => {
                        if (i === index) {
                          return {
                            ...image,
                            renderType:
                              image.renderType === 'cover'
                                ? 'contain'
                                : 'cover',
                          };
                        }
                        return image;
                      });
                      setImagesArray(newImagesArray); // Assuming setImagesArray is a state setter
                    }}>
                    <SizeTogglerIconSvg />
                  </Pressable>
                </View>
              ))}
              <View
                style={{
                  marginEnd: scaleNew(20),
                  marginStart: scaleNew(20),
                }}>
                {imagesArray.length < 8 && (
                  <Pressable
                    onPress={async () => {
                      try {
                        const options = {
                          mediaType: 'photo',
                          selectionLimit: 8 - imagesArray.length,
                        };

                        const res = await launchImageLibrary(options);
                        console.log('Response from image library:', res);

                        if (res.didCancel) {
                          console.log('User cancelled image picker');
                        } else if (res.errorCode) {
                          console.log('ImagePicker Error: ', res.errorMessage);
                        } else {
                          // Assume the response structure has an array of assets
                          setImagesArray(prevImages => [
                            ...prevImages,
                            ...res.assets.map(asset => ({
                              path: asset.uri, // Typically 'uri' is used with react-native-image-picker
                              renderType: 'cover',
                              nonce: '', // If nonce needs to be used or generated
                            })),
                          ]);
                        }
                      } catch (error) {
                        console.error('Failed to pick images:', error);
                        // Optionally handle specific error scenarios, like permission issues
                      }
                    }}>
                    <Image
                      source={require('../../../assets/images/appIcons/plusBgIcon.png')}
                    />
                  </Pressable>
                )}
              </View>
            </ScrollView>
          </View>

          <View
            style={{
              backgroundColor: colors.red2,
              borderRadius: scale(10),
              padding: scale(12),
              marginTop: scale(30),
              marginHorizontal: scale(16),
            }}>
            <TextInput
              testID="add-post-input"
              placeholder="Add your caption here"
              placeholderTextColor={'gray'}
              value={caption}
              onChangeText={text => {
                setCaption(text);
                setCaptionLength(text.length);
              }}
              style={{
                height: scale(110),
                ...globalStyles.regularLargeText,
                color: '#2F3A4E',
                margin: 0,
                padding: 0,
              }}
              textAlignVertical="top"
              multiline={true}
              maxLength={140}
            />
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              marginVertical: scale(8),
              marginHorizontal: scale(16),
            }}>
            <Text
              style={{
                fontFamily: fonts.lightFont,
                fontSize: scale(14),
                color: '#2F3A4E',
              }}>
              {captionLength}/140
            </Text>
          </View>
        </View>

        <AddFeedGoBackModal
          modalVisible={addFeedBackModalVisible}
          setModalVisible={setAddFeedBackModalVisible}
          onPress={() => {
            props.navigation.navigate('Moments');
            if (VARIABLES.momentsToolTipKey) {
              EventRegister.emit('momentsToltipFeedStatus', '6');
            }
          }}
        />
      </AppView>
      {/* <AppButton
        testID="add-post-save-button"
        text="Post"
        style={{margin: scale(16), marginBottom: scale(26)}}
        onPress={() => {
          onPressAddImage();
        }}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({});
