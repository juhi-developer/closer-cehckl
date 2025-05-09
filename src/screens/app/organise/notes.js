/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
  Keyboard,
  PermissionsAndroid,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AppView from '../../../components/AppView';
import ArrowLeftIconSvg from '../../../assets/svgs/arrowLeftIconSvg';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import CenteredHeader from '../../../components/centeredHeader';
import CornerHeader from '../../../components/cornerHeader';
import LargeEditIconSvg from '../../../assets/svgs/largeEditIconSvg';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import AppButton from '../../../components/appButton';
import {Image as CompressedImage} from 'react-native-compressor';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import {colors} from '../../../styles/colors';
import AddMediaIconSvg from '../../../assets/svgs/addMediaIconSvg';

import ImagePicker from 'react-native-image-crop-picker';
import {useKeyboard} from '@react-native-community/hooks';
import ImagePickerModal from '../../../components/Modals/imagePickerModal';
import DarkCrossIconSvg from '../../../assets/svgs/darkCrossIconSvg';
import BlueCloseCircleIconSvg from '../../../assets/svgs/blueCloseCircleIconSvg';
import {scale} from '../../../utils/metrics';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  AddNote,
  ClearAction,
  DeleteNote,
  EditNote,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import {getData, setData} from '../../../utils/storage';
import * as actions from '../../../redux/actionTypes';
import {EventRegister} from 'react-native-event-listeners';
import {AWS_URL_S3} from '../../../utils/urls';
import {generateID, uploadToS3BUCKET} from '../../../utils/helpers';
import ImageView from 'react-native-image-viewing';
import {APP_IMAGE} from '../../../utils/constants';
import RNFS from 'react-native-fs';

import FastImage from 'react-native-fast-image';
import {ToastMessage} from '../../../components/toastMessage';
import moment from 'moment';
import Loader from '../../../components/loader';
import OverlayLoader from '../../../components/overlayLoader';
import {fonts} from '../../../styles/fonts';
import {scaleNew} from '../../../utils/metrics2';

const CONTENT1 = [
  {
    id: 1,
    key: 'Media',
    label: 'Add photo',
    icon: <AddMediaIconSvg />,
  },
  {
    id: 2,
    key: 'Delete',
    label: 'Delete note',
    icon: <DeleteIconSvg />,
  },
];

const CONTENT2 = [
  {
    id: 1,
    key: 'Media',
    label: 'Add photo',
    icon: <AddMediaIconSvg />,
  },
];

const CleverTap = require('clevertap-react-native');

export default function Notes(props) {
  const keyboardRef = useKeyboard();
  const id = props?.route?.params?.id;
  const {addNewNotes} = props?.route?.params;
  const isBackClicked = useRef(null);
  const data = props?.route?.params?.data;
  const text = props?.route?.params?.text;
  const prevImages = props?.route?.params?.prevImages;
  const title = props?.route?.params?.title;
  const createdBy = props?.route?.params?.createdBy || VARIABLES.user._id;
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);

  const noteRef = useRef(null);

  const [note, setNote] = useState('');
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);
  const [noteImage, setNoteImage] = useState('');

  const [headerTitleFocused, setHeaderTitleFocused] = useState(false);
  //const [headerTitle, setHeaderTitle] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef();
  const [visibleImage, setVisibleImage] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [noteText, setNoteText] = useState('');
  const [isEdited, setisEdited] = useState(false);
  const [images, setImages] = useState([]);
  const [filenames, setFilenames] = useState([]);
  const [isInitialRender, setIsInitialRender] = useState(true);

  const [gallerySet, setGallerySet] = useState([]);

  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 3.4 + BOTTOM_SPACE,
      SCREEN_WIDTH / 3.4 + BOTTOM_SPACE,
    ],
    [],
  );

  const snapPoints2 = useMemo(
    () => [SCREEN_WIDTH / 6 + BOTTOM_SPACE, SCREEN_WIDTH / 6 + BOTTOM_SPACE],
    [],
  );

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current.present();
    setSheetEnabled(true);
  }, []);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      console.log('close modal');
      // bottomSheetModalRef.current.dismiss()
      setSheetEnabled(false);
    }
  }, []);

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

    const directoryPath = `${picturesPath}/CloserImages`; // Specify the name of your directory
    // const fileName = `image_${new Date().getTime()}.jpg`; // Generate a unique filename for each image

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

  const handleGalleryPicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      maxFiles: 3, // This should limit the picker, but let's ensure in the code as well
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
      .then(async imageSet => {
        VARIABLES.isMediaOpen = false;
        console.log('path', imageSet);

        // Ensure that no more than 5 images are processed
        const validImageSet =
          imageSet.length > 3 ? imageSet.slice(0, 3) : imageSet;
        setGallerySet(validImageSet);

        validImageSet.map(async img => {
          const id = generateID();
          const path = await CompressedImage.compress(img.path);

          const filename = id + path.substring(path.lastIndexOf('/') + 1);
          setImages(prev => [...prev, {...img, filename}]);
          setisEdited(true);
          setFilenames(prev => [...prev, filename]);
          StoreLocalImage(path, filename);
        });
        setGalleryAndCameraModal(false);
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  console.log('is edited notess', isEdited);

  const handleCameraPicker = () => {
    ImagePicker.openCamera({})
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        console.log('path', image.filename);

        const id = generateID();
        const path = await CompressedImage.compress(image.path);

        const filename = id + path.substring(path.lastIndexOf('/') + 1);

        setGallerySet(prev => [
          ...prev,
          {
            path: path,
            filename: filename,
            mime: image.mime,
          },
        ]);
        setImages(prev => [...prev, {...image, filename}]);
        setisEdited(true);
        setFilenames(prev => [...prev, filename]);
        StoreLocalImage(path, filename);

        setGalleryAndCameraModal(false);
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const addContentItem = ({item, index}) => {
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          setSheetEnabled(false);
          bottomSheetModalRef.current.dismiss?.();
          if (item.key === 'Media') {
            setGalleryAndCameraModal(true);
          } else if (item.key === 'Delete') {
            // if(createdBy===VARIABLES.user._id){
            confirmDeletion();
            // }
          }
        }}>
        {/* <Image source={item.image}/> */}
        <View>{item.icon}</View>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            marginStart: scale(16),
          }}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const itemContentSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 1.5,
          backgroundColor: colors.red4,
          width: '100%',
          marginVertical: scale(10),
        }}
      />
    );
  };
  const TitleHeader = () => {
    console.log('header titel focuseed', headerTitleFocused);
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            //  alignItems: 'center',
            //   borderWidth: 1.5,
            //  borderColor: colors.red4,
            borderRadius: scale(10),
            // marginHorizontal: scale(12),
            //  marginEnd: scale(40),
            paddingEnd: scale(10),

            flex: 1,
          }}>
          <TextInput
            placeholder="Title"
            maxLength={25}
            placeholderTextColor={'#929292'}
            value={headerTitle}
            onChangeText={text => setHeaderTitle(text)}
            style={{
              //  paddingVertical: scale(7),
              paddingVertical: 0,
              paddingHorizontal: scale(10),
              flex: 1,
              fontFamily: fonts.standardFont,
              fontSize: scale(24),
              color: colors.text,
              height: scale(40),

              includeFontPadding: false,
            }}
            onBlur={() => {
              if (title !== headerTitle) {
                setisEdited(true);
              }
            }}
            //   autoFocus
            returnKeyType="done"
            onSubmitEditing={e => {
              console.log('inpuuuuttt', e);
              setisEdited(true);
              setHeaderTitleFocused(!headerTitleFocused);
              // if (headerTitle.trim?.().length !== 0) {
              //   setHeaderTitle(headerTitle);

              // }
            }}
          />
          {/* <Pressable
            hitSlop={15}
            onPress={() => setHeaderTitleFocused(!headerTitleFocused)}>
            <BlueCloseCircleIconSvg />
          </Pressable> */}
        </View>

        {/* {headerTitleFocused ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: colors.red4,
              borderRadius: scale(10),
              marginHorizontal: scale(12),
              marginEnd: scale(40),
              paddingEnd: scale(10),
              flex: 1,
            }}>
            <TextInput
              placeholder="Add Title"
              maxLength={19}
              placeholderTextColor={'#929292'}
              value={headerTitle}
              onChangeText={text => setHeaderTitle(text)}
              style={{
                paddingVertical: scale(7),
                paddingHorizontal: scale(10),
                flex: 1,
              }}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={e => {
                console.log('inpuuuuttt', e);
                setHeaderTitleFocused(!headerTitleFocused);
                if (headerTitle.trim?.().length !== 0) {
                  setHeaderTitle(headerTitle);
                  setisEdited(true);
                }
              }}
            />
            <Pressable
              hitSlop={15}
              onPress={() => setHeaderTitleFocused(!headerTitleFocused)}>
              <BlueCloseCircleIconSvg />
            </Pressable>
          </View>
          
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              marginRight: 30,
            }}>
            <Text
              numberOfLines={1}
              style={{
                ...globalStyles.regularLargeText,
                ...styles.headerTitleStyle,
                fontSize: scale(26),
                fontWeight: 500,
                // fontSize:20,
                marginHorizontal: scale(12),
              }}>
              {headerTitle}
            </Text>
            <Pressable
              hitSlop={15}
              style={{marginEnd: scale(12)}}
              onPress={() => {
                if (VARIABLES.disableTouch) {
                  ToastMessage(
                    'You can’t edit notes as you are not connected to any partner yet',
                  );
                  return;
                }
                setHeaderTitleFocused(!headerTitleFocused);
                setHeaderTitle(headerTitle);
              }}>
              <LargeEditIconSvg />
            </Pressable>
          </View>
        )} */}
      </>
    );
  };
  const AppHeader = () => {
    const menuHandler = () => {
      if (VARIABLES.disableTouch) {
        ToastMessage(
          'You can’t edit notes as you are not connected to any partner yet',
        );
        return;
      }
      Keyboard.dismiss();
      // editorRef.current.dismissKeyboard()
      handlePresentModalPress();
    };
    createdBy === VARIABLES.user._id ? CONTENT1 : CONTENT2;
    return (
      <CornerHeader
        leftIcon={
          <Image
            source={APP_IMAGE.backImage}
            style={{
              width: 24,
              height: 24,
            }}
          />
        }
        leftPress={() => confirmGoBack()}
        titleBox={TitleHeader()}
        rightIcon={<MoreVerticleIconSvg fill={'rgb(125,129,140)'} />}
        rightPress={menuHandler}
        hitSlop={0}
        createdBy={createdBy}
        titleStyle={styles.headerTitleStyle}
        container={{
          height: scaleNew(50),
          paddinTop: 0,
        }}
      />
    );
  };

  const submitNoteHandler = async () => {
    if (noteText.trim() === '' && images.length === 0) {
      ToastMessage('Please add something into your note first');
      return;
    }

    setLoading(true);
    if (gallerySet.length !== 0) {
      let params = {
        item: noteText,
        title: headerTitle,
      };

      const additionalDetails = await Promise.all(
        images.map(async item => {
          const multipleDetails = await uploadToS3BUCKET(
            item.path,
            `${moment().format('x')}${item.filename}`,
            item.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(item.path, filename);
          return filename;
        }),
      );
      params.images = additionalDetails;
      console.log(params);

      setLoading(true), dispatch(AddNote(params));
    } else {
      let params = {
        // id:id,
        images: filenames,
        title: headerTitle,
        item: noteText,
      };

      console.log('info-NOTE', params);

      if (netInfo.isConnected === false) {
        alert('Network issue :(', 'Please Check Your Network !');
        return;
      }

      setLoading(true), dispatch(AddNote(params));
    }
  };

  const editNoteHandler = async () => {
    let params = {
      noteId: id,
      item: noteText,
      title: headerTitle,
    };
    console.log('paramsssssss', params);
    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
    setLoading(true);
    console.log(images);
    const additionalDetails = await Promise.all(
      images.map(async (item, index) => {
        if (item.path && item.filename && item.mime) {
          const multipleDetails = await uploadToS3BUCKET(
            item.path,
            `${moment().format('x')}${item.filename}`,
            item.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(item.path, filename);
          return filename;
        } else {
          return item;
        }
      }),
    );
    params.images = additionalDetails;
    console.log(params);
    setLoading(true);
    dispatch(EditNote(params));
  };

  const confirmDeletion = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteNoteHandler()},
    ]);
  };

  const deleteNoteHandler = () => {
    let params = {
      id: id,
    };

    console.log('info-delete', params);

    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteNote(params));
  };

  const confirmGoBack = () => {
    if (noteText.trim() === '' && !images?.length) {
      //  ToastMessage('Cannot save an empty note');
      props.navigation.goBack();
      return;
    }
    if (
      (noteText.trim() !== '' || images?.length) &&
      headerTitle.trim() === ''
    ) {
      ToastMessage('Please add title');
      return;
    }
    if (isBackClicked.current) {
      return;
    }
    isBackClicked.current = true;
    if (id && isEdited) {
      editNoteHandler();
      return;
    }
    if (!id) {
      submitNoteHandler();
      return;
    }
    props.navigation.goBack();
  };

  useEffect(() => {
    setTimeout(() => {
      noteRef?.current?.focus?.();
    }, 1000);
    props.navigation.addListener('beforeRemove', e => {
      if (isBackClicked.current) {
        return;
      }
      EventRegister.emit('addNewNotes', {
        setNoteText,
        setImages,
        setGallerySet,
        setFilenames,
        setHeaderTitle,
        setisEdited,
        id,
        createdBy,
      });
    });
    return () => {};
  }, []);

  useEffect(() => {
    console.log('loggs templates', state);
    if (state.reducer.case === actions.ADD_NOTE_SUCCESS) {
      CleverTap.recordEvent('Notes added');
      setLoading(false);
      ToastMessage('Note added successfully');
      EventRegister.emit('changeList');
      props.navigation.goBack();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_NOTE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_NOTE_SUCCESS) {
      setLoading(false);
      ToastMessage('Note updated successfully');
      EventRegister.emit('changeList');
      props.navigation.goBack();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_NOTE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_NOTE_SUCCESS) {
      setLoading(false);
      EventRegister.emit('changeList');
      props.navigation.goBack();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_NOTE_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    }
  }, [state]);

  useEffect(() => {
    if (id) {
      setHeaderTitle(title);
      setNoteText(text);
      setImages(prevImages);
      console.log('OREVVVV==IMAGES', prevImages);
      // setEditorContent(data)
    }
  }, []);

  const removeImage = listIndex => {
    const updatedList = images.filter((item, index) => index !== listIndex);
    setImages(updatedList);
    setisEdited(true);
    const updateFilenames = filenames.filter(
      (item, index) => index !== listIndex,
    );
    setFilenames(updateFilenames);

    const updateGallery = gallerySet.filter(
      (item, index) => index !== listIndex,
    );
    setGallerySet(updateGallery);
  };

  const Item = ({item, index}) => {
    const [image, setImage] = useState('');
    const [imageLoading, setImageLoading] = useState(false);

    const loadFile = async uri => {
      if (typeof uri !== 'string') {
        setImage(uri.path);
        return;
      }
      const path = RNFS.DocumentDirectoryPath + `/CloserImages/${uri}`;
      console.log('BIG PATHHHHHH', path);

      const exists = await RNFS.exists(path);

      if (exists) {
        console.log('YES EXISTS', path);
        setImage('file://' + path);
        // return `file://${path}`;
      } else {
        //   // Return the original URL if the file doesn't exist
        setImage(AWS_URL_S3 + `production/organise/` + item);
        //   // return AWS_URL_S3 + `production/chat/` + item.message;
      }
    };

    const loadImage = async () => {
      await loadFile(item);
    };
    useEffect(() => {
      loadImage();
    }, []);
    return (
      <View style={{margin: 6}}>
        <Pressable
          onPress={() => {
            // setViewImage(AWS_URL_S3 + `production/organise/` + item.message)
            setViewImage(image);
            setVisibleImage(true);
          }}>
          {imageLoading && (
            <ActivityIndicator size={20} style={styles.loader} />
          )}
          <FastImage
            source={{
              uri: image,
              // priority: FastImage.priority.high,
            }}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            style={{
              height: scale(180),
              width: SCREEN_WIDTH / 2 - 6 * 2 - 10,
              borderRadius: 10,
              backgroundColor: 'lightgrey',
            }} //4*2 =>margin around each item * 2, 10=> container horizontalMargin - margin around each item
            // indicator={Progress.Pie}
          />
        </Pressable>
        <View style={{position: 'absolute', top: scale(8), right: scale(8)}}>
          <Pressable
            onPress={() => {
              removeImage(index);
            }}>
            <Image
              source={APP_IMAGE.trashBlue}
              style={{
                width: scale(24),
                height: scale(24),
              }}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderImage = ({item, index}) => {
    return <Item item={item} index={index} />;
  };

  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        header={AppHeader}>
        <OverlayLoader visible={loading} />
        <TextInput
          ref={noteRef}
          placeholder="Add your note here"
          placeholderTextColor={'#808491'}
          multiline={true}
          textAlignVertical={'top'}
          value={noteText}
          selection={
            Platform.OS === 'android' && isInitialRender
              ? {start: noteText.length, end: noteText.length}
              : undefined
          }
          onFocus={() => {
            setIsInitialRender(false);
          }}
          onChangeText={inp => {
            setNoteText(inp);
            if (text === inp) {
              setisEdited(false);
            } else {
              setisEdited(true);
            }
          }}
          style={{
            ...globalStyles.regularLargeText,
            marginHorizontal: scaleNew(16),
            maxHeight: SCREEN_HEIGHT * 0.5,
            minHeight: 100,
            marginTop: scaleNew(10),
            //  backgroundColor: 'red',
            flex: 1,
          }}
        />
        <FlatList
          data={images}
          renderItem={renderImage}
          keyExtractor={(item, index) => index}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginHorizontal: 10, marginTop: 6}}
        />

        {/* <RichEditor
                    ref={editorRef}
                    androidLayerType='software'
                    // style={{flex:1,backgroundColor:colors.primary}}
                    placeholder="Add your note here"
                    initialContentHTML={editorContent}
                    onChange={setEditorContent}
                    editorStyle={{backgroundColor:colors.primary,marginVertical:4}}
                    androidHardwareAccelerationDisabled={true}
                    
                /> */}

        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={
              createdBy === VARIABLES.user._id && id ? snapPoints : snapPoints2
            }
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: '#F5F1F0',
            }}
            // style={{ backgroundColor: themeColor }}
          >
            <BottomSheetFlatList
              data={
                createdBy === VARIABLES.user._id && id ? CONTENT1 : CONTENT2
              }
              keyExtractor={(i, index) => index}
              renderItem={addContentItem}
              contentContainerStyle={{...styles.contentContainer}}
              ItemSeparatorComponent={itemContentSeparatorComponent}
              style={{
                marginTop: 10,
              }}
            />
          </BottomSheetModal>
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
      <ImageView
        images={[{uri: viewImage}]}
        imageIndex={0}
        visible={visibleImage}
        onRequestClose={() => setVisibleImage(false)}
        doubleTapToZoomEnabled={true}
      />
      {sheetEnabled && (
        <Pressable
          style={styles.backgroundShadowContainer}
          onPress={() => {
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss?.();
          }}
        />
      )}
      {/* {!loading && createdBy === VARIABLES.user._id && (
        <AppButton
          text="Save"
          style={{
            margin: scale(16),
            marginBottom: 24,
            opacity: noteText === '' && images.length === 0 ? 0.5 : 1,
          }}
          onPress={() => {
            if (loading) {
              return
            }
            if (id) {
              editNoteHandler();
            } else {
              submitNoteHandler();
            }
          }}
        />
      )} */}
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scaleNew(24),
    color: '#808491',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
    // backgroundColor: 'red'
    // alignItems: 'center',
  },
  backgroundShadowContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  noteInput: {
    // backgroundColor: 'red',
    ...globalStyles.regularLargeText,
    flex: 1,
    paddingBottom: scale(40),
    margin: 0,
    padding: 0,
    lineHeight: 25,
    fontSize: scale(18),
  },
  noteImage: {
    width: '100%',
    height: scale(360),
    backgroundColor: 'gray',
    borderRadius: scale(6),
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
});
