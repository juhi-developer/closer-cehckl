/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppView from '../../../components/AppView';
import {globalStyles} from '../../../styles/globalStyles';
import ProfileUploadIconSvg from '../../../assets/svgs/profileUploadIconSvg';
import AppButton from '../../../components/appButton';
import ImagePickerModal from '../../../components/Modals/imagePickerModal';

import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';

import {colors} from '../../../styles/colors';
import PlusWhiteBackIcon2Svg from '../../../assets/svgs/plusWhiteBackIcon2Svg';
import {scale} from '../../../utils/metrics';
import {generateID, uploadToS3BUCKET} from '../../../utils/helpers';
import {useNetInfo} from '@react-native-community/netinfo';
import {useDispatch, useSelector} from 'react-redux';
import {ClearAction, EditProfile} from '../../../redux/actions';
import * as actions from '../../../redux/actionTypes';
import {VARIABLES} from '../../../utils/variables';
import {CommonActions, StackActions} from '@react-navigation/native';
import OverlayLoader from '../../../components/overlayLoader';
import {Image as CompressedImage} from 'react-native-compressor';

export default function AddProfilePic(props) {
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [media, setMedia] = useState('');
  const [loading, setLoading] = useState(false);

  const netInfo = useNetInfo();

  const state = useSelector(redusState => redusState);
  const dispatch = useDispatch();

  const UpdatePersonalise = () => {
    let params = {
      profilePic: media,
    };

    console.log('info', params);

    if (!netInfo.isConnected) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(EditProfile(params)); // api calling through redux-saga
  };

  useEffect(() => {
    console.log('user-profile=data', state);
    if (state.reducer.case === actions.EDIT_PROFILE_SUCCESS) {
      setLoading(false);
      setTimeout(() => {
        props.navigation.replace('App');
      }, 200);
      VARIABLES.user = state.reducer.userData;
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_PROFILE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      // alert(state.message)
      dispatch(ClearAction());
    }
  }, [state]);

  const handleGalleryPicker = () => {
    // setGalleryAndCameraModal(false)
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      smartAlbums: [
        'PhotoStream',
        'Generic',
        'Panoramas',
        'Favorites',
        'AllHidden',
        'RecentlyAdded',
        'UserLibrary',
        'SelfPortraits',
        'Screenshots',
      ],
    })
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        // console.log('path', image.path);
        const id = generateID();
        const path = await CompressedImage.compress(image.path);

        setProfileImage(path);

        const filename = id + path.substring(path.lastIndexOf('/') + 1);
        setGalleryAndCameraModal(false);
        console.log('filename===', filename);
        // uploadToS3(image.path, filename, image.mime)
        setLoading(true);
        const s3response = await uploadToS3BUCKET(
          path,
          filename,
          image.mime,
          'profiles',
        );
        console.log('s3response====>>', s3response);
        if (s3response.statusCode === 201) {
          setLoading(false);
          setMedia(s3response.response);
        } else if (s3response.statusCode === 500) {
          setLoading(false);
          alert(
            "Sorry profile pic couldn't upload to server due to some error.",
          );
          console.log(s3response.response);
          setProfileImage('');
        } else {
          console.log(s3response);
        }
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const handleCameraPicker = () => {
    // setModalVisible(false)
    // setGalleryAndCameraModal(false)
    ImagePicker.openCamera({
      // width: 300,
      // height: 400,
      cropping: true,
    })
      .then(async image => {
        VARIABLES.isMediaOpen = false;

        const id = generateID();
        const path = await CompressedImage.compress(image.path);

        setProfileImage(path);

        const filename = id + path.substring(path.lastIndexOf('/') + 1);
        setGalleryAndCameraModal(false);

        setLoading(true);
        const s3response = await uploadToS3BUCKET(
          path,
          filename,
          image.mime,
          'profiles',
        );

        if (s3response.statusCode === 201) {
          setLoading(false);
          setMedia(s3response.response);
        } else if (s3response.statusCode === 500) {
          setLoading(false);
          alert(
            "Sorry profile pic couldn't upload to server due to some error.",
          );

          setProfileImage('');
        } else {
          console.log(s3response);
        }
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };
  return (
    <AppView scrollContainerRequired={true} isScrollEnabled={false}>
      <OverlayLoader visible={loading} />
      <View style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.message}>
            Make yourself more visible! Add your profile pic
          </Text>
        </View>
        <View style={{...styles.profileImageContainer}}>
          {profileImage === '' ? (
            <Pressable
              style={{
                marginTop: 30,
              }}
              onPress={() => setGalleryAndCameraModal(true)}>
              <ProfileUploadIconSvg />
            </Pressable>
          ) : (
            <Pressable onPress={() => setGalleryAndCameraModal(true)}>
              <LinearGradient
                style={styles.imageBorderContainer}
                colors={[colors.blue6, colors.blue7]}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 0}}>
                <View style={styles.imageContainer}>
                  <Image
                    source={{uri: profileImage}}
                    style={{width: 220, height: 220, borderRadius: 110}}
                  />
                </View>
              </LinearGradient>
              <View style={{position: 'absolute', bottom: 28, right: 28}}>
                <PlusWhiteBackIcon2Svg />
              </View>
            </Pressable>
          )}
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            // opacity: profileImage === '' ? 0.6 : 1
            opacity: 1,
          }}>
          <AppButton
            text={'Continue'}
            onPress={() => {
              // if (media === '') {
              //   alert('Please add your profile pic');
              // } else {
              UpdatePersonalise();
              // }
              // props.navigation.navigate('App')
            }}
          />
        </View>
      </View>

      {galleryAndCameraModal && (
        <ImagePickerModal
          modalVisible={galleryAndCameraModal}
          setModalVisible={setGalleryAndCameraModal}
          imageHandler={handleGalleryPicker}
          cameraHandler={handleCameraPicker}
          onDismissCard={() => {}}
        />
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  imageBorderContainer: {
    // borderWidth: 3,
    // borderColor: colors.blue1,
    padding: 4,
    borderRadius: 200,
    // zIndex: -1
  },
  buttonContainer: {
    marginHorizontal: scale(16),
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: scale(30),
  },
  message: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(24),
    textAlign: 'center',
    marginHorizontal: scale(40),
  },
  imageContainer: {
    backgroundColor: colors.primary,
    borderRadius: scale(200),
    padding: 8,
  },
});
