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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import AppView from '../../../components/AppView';
import {
  BOTTOM_SPACE,
  globalStyles,
  SCREEN_WIDTH,
} from '../../../styles/globalStyles';
import CornerHeader from '../../../components/cornerHeader';
import MoreVerticleIconSvg from '../../../assets/svgs/moreVerticleIconSvg';
import AppButton from '../../../components/appButton';

import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';
import DeleteIconSvg from '../../../assets/svgs/deleteIconSvg';
import {colors} from '../../../styles/colors';
import AddMediaIconSvg from '../../../assets/svgs/addMediaIconSvg';

import ImagePicker from 'react-native-image-crop-picker';
import {useKeyboard} from '@react-native-community/hooks';

import ImagePickerModal from '../../../components/Modals/imagePickerModal';
import UncheckedOneSvg from '../../../assets/svgs/uncheckedOneSvg';
import RedCrossIconSvg from '../../../assets/svgs/redCrossIconSvg';
import CheckedOneSvg from '../../../assets/svgs/checkedOneSvg';
import {scale} from '../../../utils/metrics';

import {useNetInfo} from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import {
  AddTodoList,
  ClearAction,
  DeleteTodoList,
  EditTodoList,
} from '../../../redux/actions';
import {VARIABLES} from '../../../utils/variables';
import * as actions from '../../../redux/actionTypes';
import {EventRegister} from 'react-native-event-listeners';
import {Menu, MenuItem} from 'react-native-material-menu';
import {
  generateID,
  getStateDataAsync,
  uploadToS3BUCKET,
} from '../../../utils/helpers';
import {AWS_URL_S3} from '../../../utils/urls';
import CheckedTwoSvg from '../../../assets/svgs/checkedTwoSvg';
import UncheckedTwoSvg from '../../../assets/svgs/uncheckedTwoSvg';
import moment from 'moment';
import {APP_IMAGE} from '../../../utils/constants';
import AddNameTagSvg from '../../../assets/svgs/addNameTagSvg';
import ImageView from 'react-native-image-viewing';
import {ToastMessage} from '../../../components/toastMessage';

import RNFS from 'react-native-fs';
import FastImage from 'react-native-fast-image';
// import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import {cloneDeep} from 'lodash';
import OverlayLoader from '../../../components/overlayLoader';
import {Image as CompressedImage} from 'react-native-compressor';
import {fonts} from '../../../styles/fonts';
import {scaleNew} from '../../../utils/metrics2';

const CleverTap = require('clevertap-react-native');

const CONTENT = [
  {
    id: 1,
    key: 'Media',
    label: 'Add photo',
    icon: <AddMediaIconSvg />,
  },
  {
    id: 2,
    key: 'Tags',
    label: 'Add name tag',
    icon: <AddNameTagSvg />,
  },
  {
    id: 2,
    key: 'Delete',
    label: 'Delete List',
    icon: <DeleteIconSvg />,
  },
];

export default function Todos(props) {
  const id = props?.route?.params?.id;
  const listData = cloneDeep(props?.route?.params?.data);
  const title = props?.route?.params?.title;

  const inputRef = useRef(null);
  const lastInoutRef = useRef(null);
  const isBackClicked = useRef(null);

  // console.log('DTA RECVD',data,title,id);

  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [isEdited, setisEdited] = useState(id ? false : true);
  const [sheetEnabled, setSheetEnabled] = useState(false);
  const [galleryAndCameraModal, setGalleryAndCameraModal] = useState(false);
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const [headerTitleFocused, setHeaderTitleFocused] = useState(false);
  // const [headerTitle, setHeaderTitle] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [isMultiline, setIsMultiline] = useState(false);
  const [addTag, setAddTag] = useState(false);
  const [deleteEnable, setDeleteEnable] = useState(false);

  const [visibleImage, setVisibleImage] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [editingContentIndex, seteditingContentIndex] = useState(-1);
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(
    () => [
      SCREEN_WIDTH / 2.4 + BOTTOM_SPACE,
      SCREEN_WIDTH / 2.4 + BOTTOM_SPACE,
    ],
    [],
  );

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current.present();
    setSheetEnabled(true);
  }, []);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
    if (index == -1) {
      console.log('close modal');
      setSheetEnabled(false);
      bottomSheetModalRef.current.dismiss?.();
    }
  }, []);

  const handleGalleryPicker = () => {
    // setGalleryAndCameraModal(false)
    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      mediaType: 'photo',
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
        const id = generateID();
        const path = await CompressedImage.compress(image.path, {
          compressionMethod: 'manual',
          maxWidth: 1000,
          quality: 0.8,
        });
        const filename =
          id + image.path.substring(image.path.lastIndexOf('/') + 1);
        setGalleryAndCameraModal(false);
        setisEdited(true);
        let listObj = {
          item: null,
          isChecked: false,
          tags: '',
          text_type: 'image',
          createdBy: VARIABLES.user?._id,
          lcoalImage: true,
          localImageData: {
            path: path,
            filename,
            mime: image.mime,
          },
        };
        if (
          editingContentIndex === list.length - 1 ||
          editingContentIndex === -1
        ) {
          if (!!input.length) {
            AddListHandler(list.length - 1, listObj);
          } else {
            const newNumbers = [
              ...list.slice(0, list.length - 1),
              listObj,
              ...list.slice(list.length - 1),
            ];
            setList(newNumbers);
          }
        } else {
          const newNumbers = [
            ...list.slice(0, editingContentIndex + 1),
            listObj,
            ...list.slice(editingContentIndex + 1),
          ];
          setList(newNumbers);
          seteditingContentIndex(list.length - 1);
        }
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const handleCameraPicker = () => {
    ImagePicker.openCamera({})
      .then(async image => {
        VARIABLES.isMediaOpen = false;
        const path = await CompressedImage.compress(image.path, {
          compressionMethod: 'manual',
          maxWidth: 1000,
          quality: 0.8,
        });
        const id = generateID();
        const filename = id + path.substring(path.lastIndexOf('/') + 1);
        setGalleryAndCameraModal(false);
        let listObj = {
          item: null,
          isChecked: false,
          tags: '',
          text_type: 'image',
          createdBy: VARIABLES.user?._id,
          lcoalImage: true,
          localImageData: {
            path: path,
            filename,
            mime: image.mime,
          },
        };
        setisEdited(true);
        if (!!input.length) {
          AddListHandler(list.length - 1, listObj);
        } else {
          const newNumbers = [
            ...list.slice(0, list.length - 1),
            listObj,
            ...list.slice(list.length - 1),
          ];
          setList(newNumbers);
        }
      })
      .catch(err => {
        VARIABLES.isMediaOpen = false;
        console.log('error', err);
      });
  };

  const addContentItem = ({item, index}) => {
    console.log(list);
    let disable = true;
    list.map(t => {
      if (t.item?.length) {
        disable = false;
      }
    });
    return (
      <Pressable
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          setSheetEnabled(false);
          bottomSheetModalRef.current.dismiss?.();
          if (item.key === 'Media') {
            if (list.length === 0) {
              ToastMessage('Please add at least one todo');
              return;
            }
            if (list.length === 1 && !list[0]?.item?.length && !input.length) {
              ToastMessage('Please add at least one todo');
              return;
            }
            setGalleryAndCameraModal(true);
          } else if (item.key === 'Tags') {
            setDeleteEnable(false);

            setAddTag(!addTag);
          } else if (item.key === 'Delete') {
            setAddTag(false);
            // confirmDeletion()
            setDeleteEnable(!deleteEnable);
          }
        }}>
        {/* <Image source={item.image}/> */}
        <View
          style={{
            opacity: disable ? 0.5 : 1,
          }}>
          {item.icon}
        </View>
        <Text
          style={{
            ...globalStyles.regularLargeText,
            marginStart: scale(16),
            color: disable ? '#929292' : colors.text,
          }}>
          {item.key === 'Tags'
            ? addTag
              ? 'Remove name tag'
              : 'Add name tag'
            : item.key === 'Delete'
            ? deleteEnable
              ? 'Remove Delete'
              : 'Delete'
            : item.label}
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
          marginVertical: scale(10),
          marginHorizontal: 16,
        }}
      />
    );
  };
  // const TitleHeader = () => {
  //     return (
  //         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //             <Text style={{
  //                 ...globalStyles.regularLargeText,
  //                 ...styles.headerTitleStyle,
  //                 marginHorizontal: scale(12)
  //             }}>{'To do list'}</Text>
  //             <LargeEditIconSvg />
  //         </View>
  //     )
  // }

  const TitleHeader = () => {
    return (
      <View style={{flex: 1, height: scale(50), justifyContent: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            //  borderWidth: 1.5,
            //  borderColor: colors.red4,
            borderRadius: scale(10),
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
              paddingHorizontal: scale(10),
              paddingVertical: 0,
              flex: 1,
              fontFamily: fonts.standardFont,
              fontSize: scale(24),
              color: colors.text,

              includeFontPadding: false,
            }}
            //  autoFocus
            returnKeyType="done"
            onBlur={() => {
              if (title !== headerTitle) {
                setisEdited(true);
              }
            }}
            onSubmitEditing={e => {
              console.log('inpuuuuttt', e);
              setHeaderTitleFocused(!headerTitleFocused);
              setisEdited(true);
              // if (headerTitle?.trim?.().length !== 0) {
              //   setHeaderTitle(headerTitle);
              // }
            }}
          />
          {/* <Pressable
            hitSlop={15}
            onPress={() => {
              setHeaderTitleFocused(!headerTitleFocused);
            }}>
            <BlueCloseCircleIconSvg />
          </Pressable> */}
        </View>
      </View>
    );
  };

  const confirmDeletion = () => {
    // setVisible(false)
    Alert.alert('Delete to-do list', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => deleteListHandler()},
    ]);
  };

  const deleteListHandler = () => {
    let params = {
      id: id,
    };

    console.log('info-delete', params);

    if (netInfo.isConnected === false) {
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    setLoading(true), dispatch(DeleteTodoList(params));
  };

  const AppHeader = () => {
    const confirmGoBack = async () => {
      console.log('tap on back');
      if (isBackClicked.current) {
        console.log('Back button click ignored');
        return;
      }
      isBackClicked.current = true;
      setLoading(true);
      Keyboard.dismiss();

      if (deleteEnable || addTag) {
        setLoading(false);
        Alert.alert('Leave', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Cancel Pressed');
              isBackClicked.current = false;
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: () => props.navigation.goBack()},
        ]);
        return;
      }

      const isEdited = await getStateDataAsync(setisEdited);
      if (id) {
        if (isEdited) {
          editListHandler();
        } else {
          setLoading(false);
          props.navigation.goBack();
        }
      } else {
        submitListHandler();
      }
    };

    const menuHandler = () => {
      if (VARIABLES.disableTouch) {
        ToastMessage(
          'You can’t edit todos as you are not connected to any partner yet',
        );
        return;
      }
      Keyboard.dismiss();
      handlePresentModalPress();
    };

    return (
      <CornerHeader
        container={{
          height: scaleNew(50),
          paddingTop: 0,
        }}
        leftIcon={
          <Image
            source={APP_IMAGE.backImage}
            style={{
              width: 24,
              height: 24,
            }}
          />
        }
        hitSlop={10}
        leftPress={() => {
          confirmGoBack();
        }}
        titleBox={TitleHeader()}
        rightIcon={<MoreVerticleIconSvg fill={'rgb(125,129,140)'} />}
        rightPress={menuHandler}
      />
    );
  };

  const AddListHandler = (
    index,
    dataToPush = false,
    updateEditingContent = true,
  ) => {
    if (input === '') {
      return;
    }
    setisEdited(true);
    const newList = JSON.parse(JSON.stringify(list));
    newList[index].item = input;
    // newList.pop()
    // newList.push(listObj)
    if (dataToPush) {
      newList.push(dataToPush);
    }
    newList.push({
      item: '',
      isChecked: false,
      tags: '',
      text_type: 'message',
      tagMenuVisible: false,
      createdBy: VARIABLES.user?._id,
    });
    setList(newList);
    setInput('');
    updateEditingContent && seteditingContentIndex(newList.length - 1);
    setTimeout(() => {
      updateEditingContent && lastInoutRef.current?.focus?.();
    }, 100);
    // inputRef.current.focus()
  };

  const checkedHandler = (item, listIndex) => {
    if (VARIABLES.disableTouch) {
      ToastMessage(
        'You can’t edit todos as you are not connected to any partner yet',
      );
      return;
    }
    const listObj = {
      ...item,
      isChecked: !item.isChecked,
      markedBy: VARIABLES.user._id,
    };

    const updateList = [...list];
    updateList[listIndex] = listObj;
    setisEdited(true);
    setList(updateList);
  };

  const RemoveListHandler = listIndex => {
    const updatedList = list.filter((item, index) => index !== listIndex);

    setList(updatedList);
  };

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

  const hideMenu = (listIndex, user) => {
    const prevList = [...list];
    prevList[listIndex].tagMenuVisible = false;

    console.log('prevList', prevList);
    setList(prevList);
    setisEdited(true);
    if (user && user !== '') {
      const prevList = [...list];
      prevList[listIndex].tags = user;
      prevList[listIndex].createdBy = user;

      console.log('prevList', prevList);
      setList(prevList);
    }
  };

  const submitListHandler = async () => {
    setLoading(true);
    console.log('submitListHandler');
    const list = await getStateDataAsync(setList);

    if (list.length === 0) {
      setLoading(false);
      props.navigation.goBack();
      return;
    }
    if (list[0]?.item !== '' && headerTitle.trim() === '') {
      setLoading(false);
      ToastMessage('Please add title');
      isBackClicked.current = false;
      return;
    }

    const backendData = [];

    await Promise.all(
      list.map(async (l, index) => {
        console.log(l);
        if (l.text_type === 'image' && l?.localImageData?.path) {
          console.log(l.localImageData);
          const multipleDetails = await uploadToS3BUCKET(
            l.localImageData.path,
            `${moment().format('x')}${l.localImageData.filename}`,
            l.localImageData.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(l.localImageData.path, filename);
          list[index].item = multipleDetails.response;
        }
      }),
    );
    console.log(list, 'bjhknlm');
    list.map(l => {
      if (l.item.trim().length !== 0) {
        backendData.push(l);
      }
    });
    let params = {
      list: backendData.map(item => {
        const obj = {
          item: item.item,
          text_type: item.text_type,
          tags: item.tags,
          isChecked: item.isChecked,
        };
        if (item.isChecked) {
          obj.markedBy = item?.markedBy || VARIABLES.user._id;
        }
        return obj;
      }),
      title: headerTitle,
    };

    console.log('info-list', JSON.stringify(params));
    if (params.list.length === 0) {
      setLoading(false);
      props.navigation.goBack();
      // ToastMessage('Empty list can not be created.');
      return;
    }

    if (netInfo.isConnected === false) {
      isBackClicked.current = false;
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    // EventRegister.emit('addNewTodos', {
    //   setList,
    // });

    dispatch(AddTodoList(params));
  };

  const editListHandler = async () => {
    setLoading(true);

    const list = await getStateDataAsync(setList);
    setLoading(true);
    if (list.length === 0) {
      setLoading(false);
      ToastMessage('Empty list can not be saved.');
      return;
    }
    await Promise.all(
      list.map(async (l, index) => {
        console.log(l);
        if (l.text_type === 'image' && l?.localImageData?.path) {
          console.log(l.localImageData);
          const multipleDetails = await uploadToS3BUCKET(
            l.localImageData.path,
            `${moment().format('x')}${l.localImageData.filename}`,
            l.localImageData.mime,
            'organise',
          );
          const filename = multipleDetails.response.substring(
            multipleDetails.response.lastIndexOf('/') + 1,
          );
          StoreLocalImage(l.localImageData.path, filename);
          list[index].item = multipleDetails.response;
        }
      }),
    );

    let params = {
      listId: id,
      list: [],
      title: headerTitle,
    };

    list.map(item => {
      if (item.item) {
        const obj = {
          item: item.item,
          text_type: item.text_type,
          tags: item.tags,
          isChecked: item.isChecked,
          createdBy: item.createdBy,
        };
        if (item.isChecked) {
          obj.markedBy = item?.markedBy || VARIABLES.user._id;
        }
        params.list.push(obj);
      }
    });
    if (params.list.length === 0) {
      setLoading(false);
      ToastMessage('Empty list can not be saved.');
      return;
    }
    console.log('info-template', params);

    if (netInfo.isConnected === false) {
      isBackClicked.current = false;
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (params.list.length === 0) {
      isBackClicked.current = false;
      setLoading(false);
      ToastMessage('Empty list can not be saved.');
      return;
    }
    // alert('edit');
    // EventRegister.emit('addNewTodos', {
    //   setList,
    // });
    // props.navigation.goBack();
    dispatch(EditTodoList(params));
  };

  useEffect(() => {
    if (state.reducer.case === actions.ADD_TODO_LIST_SUCCESS) {
      CleverTap.recordEvent('To dos added');

      setLoading(false);
      ToastMessage('To-do list added successfully');
      EventRegister.emit('changeList');
      props.navigation.goBack();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.ADD_TODO_LIST_FAILURE) {
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      isBackClicked.current = false;
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_TODO_LIST_SUCCESS) {
      setLoading(false);
      // alert('To-do list updated successfully');
      EventRegister.emit('changeList');
      props.navigation.goBack();
      // alert('Registered Successfully');
      ToastMessage('To-do list updated successfully');
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.EDIT_TODO_LIST_FAILURE) {
      console.log('ERROR-FAILURE', state);
      isBackClicked.current = false;
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TODO_LIST_SUCCESS) {
      setLoading(false);
      // alert('Deleted Successfully');
      EventRegister.emit('changeList');
      props.navigation.goBack();
      dispatch(ClearAction());
    } else if (state.reducer.case === actions.DELETE_TODO_LIST_FAILURE) {
      isBackClicked.current = false;
      console.log('ERROR-FAILURE', state);
      setLoading(false);
      ToastMessage(state.reducer.message);
      dispatch(ClearAction());
    }
  }, [state]);

  useEffect(() => {
    setTimeout(() => {
      if (id === undefined) {
        lastInoutRef?.current?.focus?.();
      }
    }, 500);
    if (id) {
      setHeaderTitle(title);
      setList([
        ...listData,
        {
          item: '',
          isChecked: false,
          tags: '',
          text_type: 'message',
          tagMenuVisible: false,
          createdBy: VARIABLES.user?._id,
        },
      ]);
    } else {
      lastInoutRef?.current?.focus?.();
      setList([
        {
          item: '',
          isChecked: false,
          tags: '',
          text_type: 'message',
          tagMenuVisible: false,
          createdBy: VARIABLES.user?._id,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    props.navigation.addListener('beforeRemove', e => {
      if (isBackClicked.current) {
        return;
      }

      EventRegister.emit('addNewTodos', {
        setList,
      });
    });
    return () => {};
  }, []);

  const removeListItem = (listIndex, type) => {
    setisEdited(true);
    const newList = cloneDeep(list);
    if (type === 'image') {
      const updatedList = list.filter((item, index) => index !== listIndex);
      setList(updatedList);
      return;
    }
    if (newList[listIndex + 1].text_type === 'message') {
      const updatedList = list.filter((item, index) => index !== listIndex);
      setList(updatedList);
      return;
    }
    if (listIndex === list.length - 1) {
      newList.pop();
      setList(newList);
      return;
    }
    const prevList = newList.splice(0, listIndex + 1);
    const nextList = newList.splice(listIndex + 1);
    console.log({prevList, nextList});
    const toSetList = prevList.splice(0, prevList.length - 1);
    let ifNextElement = false;
    nextList.map(n => {
      if (ifNextElement) {
        toSetList.push(n);
      } else if (n.text_type !== 'image') {
        toSetList.push(n);
        ifNextElement = true;
      }
    });
    console.log(toSetList, 'yfgjhknlk');
    setList(toSetList);
  };

  useEffect(() => {
    console.log(isEdited, 'dxtcfyvubihnjo');
    VARIABLES.toddosInfo = {
      ...VARIABLES.toddosInfo,
      list,
      id,
      headerTitle,
      isEdited,
    };

    return () => {};
  }, [list, headerTitle, isEdited]);

  return (
    <>
      <AppView
        scrollContainerRequired={true}
        isScrollEnabled={true}
        extraScrollHeight={50}
        header={AppHeader}>
        <OverlayLoader visible={loading} />
        <View style={{paddingTop: 10, paddingBottom: 100}}>
          {list.map((item, listIndex) => {
            let currentLastIndex = list.length - 1;
            list.map((l, index) => {
              if (l.text_type !== 'image') {
                currentLastIndex = index;
              }
            });
            if (item.text_type === 'message') {
              const cretaedByUser = item?.createdBy === VARIABLES.user?._id;
              let image;
              if (cretaedByUser) {
                image = VARIABLES.user.iconColor;
              } else {
                image = VARIABLES?.user?.partnerData?.partner?.iconColor;
              }

              const markedByUser = item?.markedBy === VARIABLES.user?._id;
              let markedImage;
              if (markedByUser) {
                markedImage = VARIABLES.user.iconColor;
              } else {
                markedImage = VARIABLES?.user?.partnerData?.partner?.iconColor;
              }
              console.log({cretaedByUser, markedByUser}, 'cfvghbjknlm');
              return (
                <Pressable>
                  <View
                    style={{
                      ...styles.inputContainer,
                      padding: scale(6),
                      paddingVertical: 4,
                      paddingBottom: 6,
                      borderWidth:
                        (addTag || item?.tags) && listIndex !== currentLastIndex
                          ? 0.8
                          : 0,
                      borderRadius: scale(4),
                      borderColor: colors.red4,
                      marginHorizontal: scale(10),
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: addTag || item?.tags ? 5 : 0,
                    }}>
                    <Pressable
                      onPress={() => checkedHandler(item, listIndex)}
                      hitSlop={{
                        top: 10,
                        left: 10,
                        right: 10,
                        bottom: 10,
                      }}
                      disabled={listIndex === currentLastIndex}>
                      {item?.isChecked ? (
                        markedImage === 1 ? (
                          <CheckedTwoSvg style={{marginTop: scale(2)}} />
                        ) : (
                          <CheckedOneSvg style={{marginTop: scale(2)}} />
                        )
                      ) : image === 1 ? (
                        <UncheckedTwoSvg style={{marginTop: scale(2)}} />
                      ) : (
                        <UncheckedOneSvg style={{marginTop: scale(2)}} />
                      )}
                      {/* {image === 1 ? (
                        <>
                          {item?.isChecked ? (
                            <CheckedTwoSvg style={{marginTop: scale(2)}} />
                          ) : (
                            <UncheckedTwoSvg style={{marginTop: scale(2)}} />
                          )}
                        </>
                      ) : (
                        <>
                          {item?.isChecked ? (
                            <CheckedOneSvg style={{marginTop: scale(2)}} />
                          ) : (
                            <UncheckedOneSvg style={{marginTop: scale(2)}} />
                          )}
                        </>
                      )} */}
                    </Pressable>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <TextInput
                        ref={
                          listIndex === currentLastIndex
                            ? lastInoutRef
                            : inputRef
                        }
                        placeholder={
                          listIndex === currentLastIndex
                            ? 'Add your list here'
                            : ''
                        }
                        numberOfLines={1}
                        blurOnSubmit={true}
                        multiline
                        placeholderTextColor={'#929292'}
                        value={
                          listIndex === currentLastIndex
                            ? input
                            : list[listIndex].item
                        }
                        onChangeText={text => {
                          if (text.includes('\n')) {
                            if (listIndex === currentLastIndex) {
                              AddListHandler(listIndex);
                            } else {
                              seteditingContentIndex(list.length - 1);
                              Keyboard.dismiss();
                            }
                            return;
                          }
                          if (listIndex === currentLastIndex) {
                            setInput(text);
                            return;
                          }
                          if (text !== list[listIndex].item) {
                            setisEdited(true);
                          }
                          const newInputs = [...list];
                          newInputs[listIndex].item = text;
                          setList(newInputs);
                        }}
                        returnKeyType="go"
                        editable={
                          VARIABLES.disableTouch
                            ? false
                            : VARIABLES.user?._id === item?.createdBy
                            ? true
                            : false
                        }
                        style={{
                          ...globalStyles.regularLargeText,
                          fontSize: scale(18),
                          marginStart: scale(8),
                          flex: 1,
                          margin: 0,
                          padding: 0,
                          lineHeight: 22,
                          marginTop: Platform.OS === 'android' ? 2 : 2,
                        }}
                        onSubmitEditing={() => {
                          if (listIndex === currentLastIndex) {
                            AddListHandler(listIndex);
                          }
                          seteditingContentIndex(list.length - 1);
                          Keyboard.dismiss();
                        }}
                        onBlur={() => {
                          if (listIndex === currentLastIndex) {
                            AddListHandler(listIndex, false, false);
                          }
                        }}
                        onFocus={() => {
                          if (listIndex === currentLastIndex) {
                            setIsMultiline(true);
                          }
                          seteditingContentIndex(listIndex);
                        }}
                      />
                      {deleteEnable && listIndex !== currentLastIndex && (
                        <Pressable
                          hitSlop={10}
                          onPress={() =>
                            removeListItem(listIndex, item.text_type)
                          }>
                          <Image
                            source={APP_IMAGE.trashBlue}
                            style={{
                              width: scale(24),
                              height: scale(24),
                              marginVertical: 4,
                              marginStart: 8,
                            }}
                          />
                        </Pressable>
                      )}
                    </View>
                  </View>
                  {(addTag || item?.tags) && listIndex !== currentLastIndex && (
                    <View style={styles.editByUser}>
                      <Pressable
                        onPress={() => {
                          const prevList = [...list];
                          prevList[listIndex].tagMenuVisible = true;
                          console.log('prevList', prevList);
                          setList(prevList);
                        }}>
                        <Text style={styles.user}>
                          {item?.tags === ''
                            ? 'Add Tag'
                            : item.tags === VARIABLES.user._id
                            ? 'You'
                            : VARIABLES.user.partnerData.partner.name}
                        </Text>
                        <Menu
                          visible={item.tagMenuVisible}
                          onRequestClose={() => hideMenu(listIndex)}
                          style={{margin: 20, marginTop: 0}}>
                          <MenuItem
                            textStyle={{color: '#000'}}
                            onPress={() => {
                              hideMenu(
                                listIndex,
                                VARIABLES.user?.partnerData?.partner?._id,
                                // VARIABLES.user?.partnerData?.partner?.name
                                //   ? VARIABLES.user?.partnerData?.partner?.name
                                //   : 'Partner',
                              );
                            }}>
                            {VARIABLES.user?.partnerData?.partner?.name
                              ? VARIABLES.user?.partnerData?.partner?.name
                              : 'Partner'}
                          </MenuItem>
                          <MenuItem
                            textStyle={{color: '#000'}}
                            onPress={() => {
                              hideMenu(listIndex, VARIABLES.user._id);
                              //   hideMenu(listIndex, 'You');
                            }}>
                            You
                          </MenuItem>
                        </Menu>
                      </Pressable>
                      {item?.tags !== '' && (
                        <>
                          <View style={styles.sepratorLine} />
                          <Pressable
                            hitSlop={10}
                            onPress={() => {
                              // RemoveListHandler(listIndex)
                              console.log('hfjdhgj');
                              const prevList = [...list];
                              prevList[listIndex].tags = '';
                              console.log('prevTEMPL', prevList);
                              setList(prevList);
                              setisEdited(true);
                            }}>
                            <RedCrossIconSvg />
                          </Pressable>
                        </>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            } else if (item.text_type === 'image') {
              return (
                <View
                  style={{marginVertical: 0, marginBottom: 12, marginTop: 4}}>
                  {item?.item !== '' && (
                    <Pressable
                      onPress={() => {
                        setViewImage(AWS_URL_S3 + item?.item);
                        setVisibleImage(true);
                      }}
                      style={{marginHorizontal: scale(16)}}>
                      <FastImage
                        source={{
                          uri: item?.lcoalImage
                            ? item.localImageData.path
                            : AWS_URL_S3 + item?.item,
                        }}
                        style={styles.noteImage}
                      />
                    </Pressable>
                  )}
                  {true && (
                    <Pressable
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 19,
                      }}
                      onPress={() => {
                        const newList = list.filter(
                          (item, index) => index !== listIndex,
                        );
                        setList(newList);
                        setisEdited(true);
                      }}>
                      <Image
                        source={APP_IMAGE.trashBlue}
                        style={{
                          width: scale(24),
                          height: scale(24),
                          marginVertical: 4,
                          marginStart: 8,
                        }}
                      />
                      {/* <CloseListIconSvg /> */}
                    </Pressable>
                  )}
                </View>
              );
            }
          })}

          {/* <View
            style={{
              ...styles.inputContainer,
              padding: scale(6),
              paddingVertical: 4,
              borderWidth: 0,
              borderRadius: scale(4),
              borderColor: colors.red4,
              marginHorizontal: scale(10),
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginVertical:addTag ? 5 : 3,
              // marginTop: addTag ? 8.5 : 3.5,
              marginTop: Platform.OS === "android" ?  addTag ? -5 : -12 : addTag ? 8.5 : 4,

            }}>
            <UncheckedTwoSvg />
            <TextInput
              // ref={inputRef}
              placeholder="Add your list here!"
              placeholderTextColor={'#929292'}
              style={[{...styles.input}, Platform.OS === "android" && {marginTop: 2}]}
              value={input}
              onChangeText={text => setInput(text)}
              onSubmitEditing={() => {
                // setIsMultiline(true)
                AddListHandler();
              }}
              blurOnSubmit={false}
              // multiline={true}
              // autoFocus
              returnKeyType="go"
              onFocus={() => {
                // setFocusedIndex(index)
                setIsMultiline(true);
                setisEdited(true)
              }}
            />
          </View> */}

          {/* <Pressable>
                  <View
                    style={{
                      ...styles.inputContainer,
                      padding: scale(6),
                      paddingVertical: 4,
                      paddingBottom: 6,
                      borderWidth: (addTag) ? 0.8 : 0,
                      borderRadius: scale(4),
                      borderColor: colors.red4,
                      marginHorizontal: scale(10),
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: (addTag) ? 5 : 3,
                    }}>
                    <Pressable 
                    hitSlop={{
                      top: 10,
                      left: 10,
                      right: 10,
                      bottom: 10
                    }}
                    >
                            <UncheckedTwoSvg />
                    </Pressable>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: "center"}}>
                      <TextInput
              value={input}
              placeholder="Add your list here!"
              placeholderTextColor={'#929292'}

              onChangeText={text => setInput(text)}

                        style={{
                          ...globalStyles.regularLargeText,
                          fontSize: scale(18),
                          marginStart: scale(8),
                          flex: 1,
                          margin: 0,
                          padding: 0,
                          lineHeight: 22,
                          marginTop: -1
                        }}
                        blurOnSubmit={false}
                            onFocus={() => {
                setIsMultiline(true);
                setisEdited(true)
              }}
                            onSubmitEditing={() => {
                AddListHandler();
              }}
              blurOnSubmit={false}
              returnKeyType="go"

                      />
                    </View>
                  </View>
                </Pressable> */}
        </View>
        <View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={{
              backgroundColor: '#F5F1F0',
            }}>
            <BottomSheetFlatList
              data={CONTENT}
              keyExtractor={(i, index) => index}
              renderItem={addContentItem}
              contentContainerStyle={{...styles.contentContainer}}
              ItemSeparatorComponent={itemContentSeparatorComponent}
              style={{
                marginTop: 12,
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
      {sheetEnabled && (
        <Pressable
          style={styles.backgroundShadowContainer}
          onPress={() => {
            setSheetEnabled(false);
            bottomSheetModalRef.current.dismiss?.();
          }}
        />
      )}
      {(addTag || deleteEnable) && (
        <AppButton
          text="Done"
          style={{margin: scale(16), marginBottom: 24}}
          onPress={() => {
            setAddTag(false);
            setDeleteEnable(false);
          }}
        />
      )}
      <ImageView
        images={[{uri: viewImage}]}
        imageIndex={0}
        visible={visibleImage}
        onRequestClose={() => setVisibleImage(false)}
        doubleTapToZoomEnabled={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleStyle: {
    ...globalStyles.semiBoldLargeText,
    fontSize: scale(26),
    fontWeight: 500,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: scale(16),
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
    flex: 1,
    paddingBottom: scale(40),
    margin: 0,
    padding: 0,
  },
  noteImage: {
    width: '100%',
    height: scale(360),
    backgroundColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  editByUser: {
    backgroundColor: colors.red4,
    borderRadius: scale(20),
    padding: 2,
    paddingHorizontal: scale(6),
    position: 'absolute',
    top: -2,
    right: scale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  user: {
    ...globalStyles.regularSmallText,
    fontSize: scale(10),
    color: colors.red3,
  },
  sepratorLine: {
    height: scale(10),
    marginHorizontal: scale(4),
    width: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
  },
  input: {
    flex: 1,
    marginStart: scale(8),
    ...globalStyles.regularMediumText,
    fontSize: scale(18),
  },
});
