import React, {useState, useEffect} from 'react';
import Splash from '../screens/auth/splash';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStack from './authRoutes';
import AppStack from './appRoutes';
import messaging from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';
import {VARIABLES} from '../utils/variables';
import {getStateDataAsync, uploadToS3BUCKET} from '../utils/helpers';
import {notificationHandler} from '../notificationHandler/notificationHandler';
import {NOTIFICATION_TYPES} from '../utils/constants';
import {useNetInfo} from '@react-native-community/netinfo';
import moment from 'moment';
import API from '../redux/saga/request';
import {PermissionsAndroid, Platform, StatusBar} from 'react-native';
import RNFS from 'react-native-fs';
import {ToastMessage} from '../components/toastMessage';
import Loader from '../components/loader';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {getCurrentTab} from '../utils/appstate';
import {useAppContext} from '../utils/VariablesContext';
import {colors} from '../styles/colors';

const Stack = createNativeStackNavigator();

export default function RootStackScreen({navigation}) {
  const {updateNotifData, updateMomentsKeyData} = useAppContext();
  const [activestate, setactivestate] = useState(false);
  const netInfo = useNetInfo();
  const [loading, setLoading] = useState(false);
  const [hornyMode, setHornyMode] = useState(false);

  useEffect(() => {
    /// when app is in foreground and notification is clicked notifee
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail?.notification);
          break;
        case EventType.PRESS:
          VARIABLES.notificationId = detail?.messageId;
          console.log(
            'when app is in foreground and notification is clicked notifee',
            Platform.OS,
            detail,
          );
          if (detail?.notification?.data?.body !== undefined) {
            notificationHandler(
              JSON.parse(detail?.notification?.data?.body),
              updateMomentsKeyData,
            );
          }

          break;
      }
    });
  }, []);

  /// when app is in background and notification is clicked notifee
  useEffect(() => {
    return notifee.onBackgroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        console.log(
          'when app is in background and notification is clicked. notifee',
          Platform.OS,
          detail,
        );

        if (detail?.notification?.data?.body !== undefined) {
          notificationHandler(
            JSON.parse(detail?.notification?.data?.body),
            updateMomentsKeyData,
          );
        }
      }
    });
  }, []);

  //// when app is in terminated and notification is clicked
  useEffect(() => {
    notifee.getInitialNotification().then(async remoteMessage => {
      console.log(
        'when app is in terminated and notification is clicked notifee',
        Platform.OS,
        remoteMessage,
      );
      if (remoteMessage !== null) {
        try {
          if (remoteMessage?.notification?.data?.body !== undefined) {
            notificationHandler(
              JSON.parse(remoteMessage?.notification?.data?.body),
              updateMomentsKeyData,
            );
          }
        } catch (error) {
          console.error('Error in getInitialNotification:', error);
        }
      }
      //  await delay(5000);
    });
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log(
          'when app is in terminated and notification is clicked',
          Platform.OS,
          remoteMessage,
        );
        //  await delay(5000);
        if (remoteMessage !== null) {
          try {
            if (remoteMessage?.data?.body !== undefined) {
              notificationHandler(
                JSON.parse(remoteMessage?.data?.body),
                updateMomentsKeyData,
              );
            }
          } catch (error) {
            console.error('Error in getInitialNotification:', error);
          }
        }
      });

    ///if app is in background and notification is clicked
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'if app is in background and notification is clicked',
        Platform.OS,
        remoteMessage,
      );
      if (remoteMessage?.notification?.data?.body !== undefined) {
        notificationHandler(
          JSON.parse(remoteMessage?.notification?.data?.body),
          updateMomentsKeyData,
        );
      } else if (remoteMessage?.data?.body !== undefined) {
        notificationHandler(
          JSON.parse(remoteMessage?.data?.body),
          updateMomentsKeyData,
        );
      }

      // navigation.navigate(remoteMessage.data.type);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const remoteMessageBody = JSON.parse(remoteMessage.data.body);

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: '123',
        name: 'closer',
        vibration: true,
        importance: AndroidImportance.HIGH,
      });

      // Display a notification
      if (remoteMessage?.data?.nt !== undefined) {
        await notifee.displayNotification({
          title: remoteMessage.data.nt,
          body: remoteMessage.data.nm,
          data: remoteMessage.data,
          android: {
            channelId,
            smallIcon: 'ic_notification_icon', // optional, defaults to 'ic_launcher'.
            color: colors.notificationColor,
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            attachments:
              remoteMessage?.data?.fcm_options?.image !== undefined
                ? [
                    {
                      // Remote image
                      url: remoteMessage?.data?.fcm_options?.image,
                    },
                  ]
                : [],
          },
        });
      } else if (remoteMessageBody?.type !== 'message') {
        if (remoteMessage?.notification?.title === undefined) {
          return;
        }
        await notifee.displayNotification({
          title: remoteMessage?.notification?.title,
          body: remoteMessage?.notification?.body,
          data: remoteMessage?.data,
          android: {
            channelId,
            smallIcon: 'ic_notification_icon', // optional, defaults to 'ic_launcher'.
            color: colors.notificationColor,
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            attachments:
              remoteMessage?.data?.fcm_options?.image !== undefined
                ? [
                    {
                      // Remote image
                      url: remoteMessage?.data?.fcm_options?.image,
                    },
                  ]
                : [],
          },
        });
      } else {
        if (getCurrentTab() !== 'ChatTab') {
          if (remoteMessage?.notification?.title === undefined) {
            return;
          }
          await notifee.displayNotification({
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
            data: remoteMessage?.data,
            android: {
              channelId,
              smallIcon: 'ic_notification_icon', // optional, defaults to 'ic_launcher'.
              color: colors.notificationColor,
              pressAction: {
                id: 'default',
              },
            },
            ios: {
              attachments:
                remoteMessage?.data?.fcm_options?.image !== undefined
                  ? [
                      {
                        // Remote image
                        url: remoteMessage?.data?.fcm_options?.image,
                      },
                    ]
                  : [],
            },
          });
        }
      }
      if (remoteMessageBody?.type === 'Deactivate') {
        EventRegister.emitEvent('deactivated', 'deactivated-account');
      }

      switch (remoteMessageBody?.type) {
        case NOTIFICATION_TYPES.organize_to_do:
        case NOTIFICATION_TYPES.organize_note:
        case NOTIFICATION_TYPES.organize_template:
          updateNotifData({...VARIABLES.appNotifData, organise: true});
          //  VARIABLES.appNotifData.organise = true;
          break;
        case NOTIFICATION_TYPES.chat:
          ///   Instead of modifying VARIABLES.appNotifData directly, use updateNotifData
          const newChatCount = VARIABLES.appNotifData.chat + 1;
          updateNotifData({...VARIABLES.appNotifData, chat: newChatCount});
          break;
        case NOTIFICATION_TYPES.nudge:
          const newNudgeCount = VARIABLES.appNotifData.nudgeCount + 1;
          updateNotifData({
            ...VARIABLES.appNotifData,
            nudgeCount: newNudgeCount,
          });
          break;

        case NOTIFICATION_TYPES.event:
        case NOTIFICATION_TYPES.story:
        case NOTIFICATION_TYPES.feed:
        case NOTIFICATION_TYPES.comment:
        case NOTIFICATION_TYPES.post_reaction:
        case NOTIFICATION_TYPES.story_reaction:
        case NOTIFICATION_TYPES.highlight:
        case NOTIFICATION_TYPES.note:
        case NOTIFICATION_TYPES.quiz:
        case NOTIFICATION_TYPES.mood:
        case NOTIFICATION_TYPES.imageCard:
        case NOTIFICATION_TYPES.quotedCard:
          EventRegister.emit('refreshMomemts');

          updateNotifData({...VARIABLES.appNotifData, notification: true});
          break;
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const splashCompleteListener = EventRegister.addEventListener(
      'splashComplete',
      data => {
        setactivestate(true);
      },
    );
    const addNewNotesListener = EventRegister.addEventListener(
      'addNewNotes',
      data => {
        addNewNotes(data);
      },
    );
    const addNewTemplateListener = EventRegister.addEventListener(
      'addNewTemplate',
      data => {
        addNewTemplate(data);
      },
    );
    const addNewTodosListener = EventRegister.addEventListener(
      'addNewTodos',
      data => {
        addNewTodos(data);
      },
    );
    const changeListListener = EventRegister.addEventListener(
      'changeList',
      data => {
        setLoading(false);
      },
    );

    const hornyModeEnable = EventRegister.addEventListener(
      'hornyMode',
      data => {
        setHornyMode(val => !val);
      },
    );

    return () => {
      EventRegister.removeEventListener(splashCompleteListener);
      EventRegister.removeEventListener(addNewNotesListener);
      EventRegister.removeEventListener(addNewTemplateListener);
      EventRegister.removeEventListener(addNewTodosListener);
      EventRegister.removeEventListener(changeListListener);
      EventRegister.removeEventListener(hornyModeEnable);
    };
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

  const addNewNotes = async ({
    id,
    createdBy,
    setisEdited,
    setFilenames,
    setGallerySet,
    setHeaderTitle,
    setImages,
    setNoteText,
  }) => {
    const filenames = await getStateDataAsync(setFilenames);
    const gallerySet = await getStateDataAsync(setGallerySet);
    const headerTitle1 = await getStateDataAsync(setHeaderTitle);
    const images = await getStateDataAsync(setImages);
    const noteText = await getStateDataAsync(setNoteText);
    const isEdited = await getStateDataAsync(setisEdited);

    const headerTitle = headerTitle1.trim() === '' ? 'Title' : headerTitle1;

    if (id && isEdited) {
      editNewNoteApi({
        id,
        noteText,
        headerTitle,
        images,
      });
      return;
    }
    if (!id) {
      addNewNoteApi({
        filenames,
        gallerySet,
        headerTitle,
        images,
        noteText,
      });
      return;
    }
  };

  const editNewNoteApi = async ({id, noteText, headerTitle, images}) => {
    let params = {
      noteId: id,
      item: noteText,
      title: headerTitle,
    };

    if (netInfo.isConnected === false) {
      alert('Network issue :(', 'Please Check Your Network !');
      return;
    }
    setLoading(true);
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

    try {
      const resp = await API('user/notes', 'PUT', params);
      if (resp.body.statusCode === 200) {
        ToastMessage('Note updated successfully');
        EventRegister.emit('changeList');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
    // setLoading(true);
    // dispatch(EditNote(params));
  };

  const addNewNoteApi = async ({
    gallerySet,
    noteText,
    headerTitle,
    images,
    filenames,
  }) => {
    if (noteText.trim() === '' && images.length === 0) {
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
      try {
        const resp = await API('user/notes', 'POST', params);
        if (resp.body.statusCode === 200) {
          ToastMessage('Note added successfully');
          EventRegister.emit('changeList');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    } else {
      let params = {
        // id:id,
        images: filenames,
        title: headerTitle,
        item: noteText,
      };

      console.log('info-NOTE elseeeee', params);

      if (netInfo.isConnected === false) {
        alert('Network issue :(', 'Please Check Your Network !');
        return;
      }
      console.log(params, 'yvgubhinjomkl');
      try {
        const resp = await API('user/notes', 'POST', params);
        if (resp.body.statusCode === 200) {
          ToastMessage('Note added successfully');
          EventRegister.emit('changeList');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  const addNewTemplate = async ({
    setTemplates,
    setHeaderTitle,
    id,
    setisEdited,
    newTemplate,
  }) => {
    const newTemplateData = await getStateDataAsync(setTemplates);
    const headerTitle1 = await getStateDataAsync(setHeaderTitle);
    const headerTitle = headerTitle1.trim() === '' ? 'Title' : headerTitle1;
    console.log(newTemplateData);
    let isListPResent = false;
    const currentTemplateState = await getStateDataAsync(setTemplates);
    const currentEditedState = await getStateDataAsync(setisEdited);
    currentTemplateState.map(t => {
      if (t.notes.length) {
        isListPResent = true;
      }
    });
    if (!isListPResent) {
      return;
    }
    if (newTemplate) {
      addNewTemplateApi({
        id,
        newTemplateData,
        headerTitle,
      });
    } else if (currentEditedState) {
      editTemplateHandler({
        id,
        newTemplateData,
        headerTitle,
      });
    }
  };

  const addNewTemplateApi = async ({id, newTemplateData, headerTitle}) => {
    setLoading(true);
    let params = {
      id: id,
      items: newTemplateData.map(item => {
        return {
          ...item,
          notes: item.notes.map(element => {
            const obj = {
              note: element.note,
              tag: element.tag,
              isMarked: element.isMarked,
              createdBy: element?.createdBy || VARIABLES.user._id,
            };
            if (element.isMarked) {
              obj.markedBy = element?.markedBy || VARIABLES.user._id;
            }
            return obj;
          }),
          templateIcon: item.templateIcon,
        };
      }),
      name: headerTitle,
    };
    try {
      const resp = await API('user/templates1', 'POST', {
        ...params,
      });
      if (resp.body.statusCode === 200) {
        ToastMessage('Template added successfully');
        EventRegister.emit('changeList');
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const editTemplateHandler = async ({id, newTemplateData, headerTitle}) => {
    setLoading(true);
    let params = {
      templateId: id,
      items: newTemplateData.map(item => {
        return {
          ...item,
          notes: item.notes.map(element => {
            const obj = {
              note: element.note,
              tag: element.tag,
              isMarked: element.isMarked,
              createdBy: element?.createdBy || VARIABLES.user._id,
            };
            if (element.isMarked) {
              obj.markedBy = element?.markedBy || VARIABLES.user._id;
            }
            return obj;
            // return {
            //   note: element.note,
            //   tag: element.tag,
            //   isMarked: element.isMarked,
            //   createdBy: element.createdBy || VARIABLES.user._id,
            // };
          }),
          templateIcon: item.templateIcon,
        };
      }),
      name: headerTitle,
    };
    try {
      const resp = await API('user/templates1', 'PUT', {
        ...params,
      });
      if (resp.body.statusCode === 200) {
        ToastMessage('Template updated successfully');
        EventRegister.emit('changeList');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addNewTodos = async ({setList}) => {
    if (!VARIABLES.toddosInfo?.isEdited) {
      return;
    }
    if (!VARIABLES.toddosInfo.id) {
      submitListHandler({
        list: VARIABLES.toddosInfo.list,
        headerTitle: VARIABLES.toddosInfo.headerTitle,
      });
    } else {
      editListHandler({
        list: VARIABLES.toddosInfo.list,
        headerTitle: VARIABLES.toddosInfo.headerTitle,
        id: VARIABLES.toddosInfo.id,
      });
    }
  };

  const submitListHandler = async ({list, headerTitle}) => {
    if (list.length === 0) {
      return;
    }
    const backendData = [];
    setLoading(true);
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
      title: headerTitle.trim() === '' ? 'Title' : headerTitle,
    };

    console.log('info-list', JSON.stringify(params));
    if (params.list.length === 0) {
      setLoading(false);
      // ToastMessage('Empty list can not be created.');
      return;
    }

    if (netInfo.isConnected === false) {
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }

    try {
      const resp = await API('user/ToDoList', 'POST', params);
      if (resp.body.statusCode === 200) {
        ToastMessage('To-do list added successfully');
        EventRegister.emit('changeList');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const editListHandler = async ({list, id, headerTitle}) => {
    setLoading(true);
    if (list.length === 0) {
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
      title: headerTitle.trim() === '' ? 'Title' : headerTitle,
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
      ToastMessage('Empty list can not be saved.');
      return;
    }
    console.log('info-template', params);

    if (netInfo.isConnected === false) {
      setLoading(false);
      ToastMessage('Network issue :(', 'Please Check Your Network !');
      return;
    }
    if (params.list.length === 0) {
      setLoading(false);
      ToastMessage('Empty list can not be saved.');
      return;
    }

    try {
      const resp = await API('user/ToDoList', 'PUT', params);
      if (resp.body.statusCode === 200) {
        if (resp.body.statusCode === 200) {
          ToastMessage('To-do list updated successfully');
          EventRegister.emit('changeList');
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent={true}
        backgroundColor="transparent"
      />
      <Stack.Navigator
        // screenOptions={{
        //   statusBarTranslucent: true,
        //   headerShown: false,
        //   statusBarStyle :'dark'
        // }}
        initialRouteName="splash">
        <Stack.Screen
          name="splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: activestate ? 'default' : 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="App"
          component={AppStack}
          options={{
            headerShown: false,
            animationTypeForReplace: 'push',
            animation: activestate ? 'default' : 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
      {loading && (
        <Loader
          container={{
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        />
      )}
    </>
  );
}
