import RNFS from 'react-native-fs';
import {AWS_URL_S3} from '../utils/urls';
import API from '../redux/saga/request';
import {ToastMessage} from '../components/toastMessage';
import {delay, downloadAndDecryptFromS3} from '../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {VARIABLES} from '../utils/variables';
import navigationServices from '../navigations/navigationServices';
import {MOMENT_KEY, NOTIFICATION_TYPES} from '../utils/constants';
import {EventRegister} from 'react-native-event-listeners';
import naclUtil from 'tweetnacl-util';
import {useDispatch} from 'react-redux';
import * as actions from '../redux/actionTypes';
import store from '../redux/store';
import {addPostSuccess} from '../redux/actions';

const loadFile = async item => {
  const path = RNFS.DocumentDirectoryPath + `/${item.media}`;

  return RNFS.exists(path)
    .then(async exists => {
      console.log('path story image', exists, path);
      if (exists) {
        // setImage('file://'+path);
        return `file://${path}`;
      } else {
        console.log('path story image not exists', exists, path);
        try {
          const nonce = naclUtil.decodeBase64(item.nonce);
          let data = await downloadAndDecryptFromS3(
            item.media,
            'stories',
            nonce,
            progress => {
              // Optionally handle progress updates
              // updateProgressInDB(newData.posts[0]._id, progress);
            },
          );
          const data2 = 'file://' + RNFS.DocumentDirectoryPath + `/${data}`;
          console.log('image decrypted in image comp', data);
          return data2;
          // Assuming `data` is the decrypted file content
        } catch (error) {
          console.error('Error downloading and decrypting file:', error);
          // Handle error or set a default image
        }
      }
    })
    .catch(err => {
      console.log('eroor', err);
    });
};

export const getStories = (img, setloading) => {
  console.log(img, 'vuybinompo');
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API('user/moments/stories', 'GET');
      console.log(JSON.stringify(resp.body), 'fcygvuhibjknlkm;');
      if (resp.body.statusCode === 200) {
        setloading(false);
        const {partnerData, stories: userStories} = resp.body.data;
        const partnerStories = partnerData?.partner?.stories || [];
        const formattedPartnerStories = await Promise.all(
          partnerStories.map(async item => {
            if (item.media === img) {
              return {
                story_id: item._id,
                story_image: await loadFile(item),
                storyImgPath: `${item.media}`,
                reactions: item.reactions,
                createdAt: item.createdAt,
                isSeen: item.isSeen,
              };
            }
          }),
        );
        const formattedUserStories = await Promise.all(
          userStories.map(async item => {
            if (item.media === img) {
              return {
                story_id: item._id,
                story_image: await loadFile(item),
                storyImgPath: `${item.media}`,
                reactions: item.reactions,
                createdAt: item.createdAt,
                isSeen: item.isSeen,
              };
            }
          }),
        );
        let isUserStory = false;
        let isPartnerStory = false;
        formattedUserStories.forEach(s => {
          if (s) {
            isUserStory = s;
          }
        });
        formattedPartnerStories.forEach(s => {
          if (s) {
            isPartnerStory = s;
          }
        });
        console.log({isUserStory, isPartnerStory}, 'yrftvgubino');
        if (isUserStory) {
          resolve();
          //  await delay(2000);
          navigationServices.navigate('story', {
            story: {title: 'You'},
            storyBundle: [
              {
                user_id: VARIABLES.user?._id,
                user_name: VARIABLES.user?.name,
                user_image: VARIABLES.user?.profilePic,
                stories: [isUserStory],
              },
            ],
            singleStory: true,
            storyPressIndex: 0,
            type: 'story',
          });
        } else if (isPartnerStory) {
          console.log('is partner storyyyyyyyyyyyy');
          navigationServices.navigate('story', {
            story: {title: VARIABLES.user?.partnerData?.partner?.name},
            storyBundle: [
              {
                user_id: VARIABLES.user?.partnerData?.partner?._id,
                user_name: VARIABLES.user?.partnerData?.partner?.name,
                user_image: VARIABLES.user?.partnerData?.partner?.profilePic,
                stories: [isPartnerStory],
              },
            ],
            singleStory: true,
            type: 'story',
            storyPressIndex: 0,
          });
        } else {
          setloading(false);
          ToastMessage('Story not found');
        }
        resolve(false);
      } else {
        setloading(false);
        ToastMessage('Something went wrong');
      }
    } catch (error) {
      setloading(false);
      ToastMessage('Something went wrong');
    }
  });
};

export const navigateToFeed = async (id, setloading) => {
  try {
    const resp = await API(`user/moments/post/detail?postId=${id}`, 'GET');

    if (resp.body.data._id) {
      setloading(false);
      setTimeout(() => {
        const post = {
          post: resp.body.data,
        };
        store.dispatch(addPostSuccess(post)).then(() => {
          navigationServices.navigate('comments', {
            item: resp.body.data,
            dispatchHandle: true,
          });
        });
      }, 200);
    } else {
      setloading(false);
      ToastMessage('Post not found');
    }
  } catch (error) {
    setloading(false);
    ToastMessage('Post not found');
  }
};

export const navigateToOrganize = async (data, setloading) => {
  const apiReq = {
    id: data.id,
  };
  switch (data.type) {
    case NOTIFICATION_TYPES.organize_to_do:
      apiReq.type = 'toDoList';
      break;
    case NOTIFICATION_TYPES.organize_note:
      apiReq.type = 'note';
      break;
    case NOTIFICATION_TYPES.organize_template:
      apiReq.type = 'template';
      break;
    default:
      break;
  }
  try {
    const resp = await API(
      `user/organize/detail?id=${apiReq.id}&type=${apiReq.type}`,
      'GET',
      apiReq,
    );
    if (resp.body) {
      setloading(false);
      let item;
      switch (data.type) {
        case NOTIFICATION_TYPES.organize_to_do:
          item = resp.body.data.toDoList[0];
          navigationServices.navigate('todos', {
            data: item.list,
            title: item?.title,
            id: item?._id,
          });
          break;
        case NOTIFICATION_TYPES.organize_note:
          item = resp.body.data.notes[0];
          navigationServices.navigate('notes', {
            data: item?.item,
            title: item?.title,
            id: item?._id,
            text: item.item,
            prevImages: item?.images,
            createdBy: item.createdBy,
          });
          break;
        case NOTIFICATION_TYPES.organize_template:
          item = resp.body.data.templates[0];
          navigationServices.navigate('template', {
            id: item._id,
            data: item?.items,
            headerName: item.name,
          });
          break;
        default:
          break;
      }
    } else {
      setloading(false);
      ToastMessage('Not found');
    }
  } catch (error) {
    setloading(false);
    ToastMessage('Not found');
  }
};

export const getNotes = async setloading => {
  try {
    const resp = await API('user/moments/notes', 'GET');
    if (resp.body.statusCode === 200) {
      if (resp.body.data.length) {
        setloading(false);
        setTimeout(() => {
          navigationServices.navigate('allNotes', resp.body.data);
        }, 200);
      }
    } else {
      setloading(false);
    }
  } catch (error) {
    setloading(false);
    ToastMessage('Something went wrong');
  }
};

export const getQnaDetails = async (setloading, notifId, QnAType) => {
  try {
    const resp = await API('user/moments/QnA', 'GET');
    EventRegister.emit('QnARefresh');
    if (resp.body.statusCode === 200) {
      console.log('res body qn detail', resp.body.data);
      if (QnAType === 'Horny') {
        if (resp.body.data?.hornyCard?._id === notifId) {
          EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.quiz);

          navigationServices.navigate('Moments');
          setloading(false);
        } else if (notifId === undefined) {
          EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.quiz);

          VARIABLES.momentsNavigationKey = MOMENT_KEY.quiz;
          //   delay(1000)
          navigationServices.navigate('Moments');
          setloading(false);
        } else {
          ToastMessage('This quiz is no longer available');
          setloading(false);
        }
      } else {
        if (resp.body.data?.QnA?._id === notifId) {
          EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.quiz);

          navigationServices.navigate('Moments');
          setloading(false);
        } else if (notifId === undefined) {
          EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.quiz);

          VARIABLES.momentsNavigationKey = MOMENT_KEY.quiz;
          //   delay(1000)
          navigationServices.navigate('Moments');
          setloading(false);
        } else {
          ToastMessage('This quiz is no longer available');
          setloading(false);
        }
      }
    } else {
      setloading(false);
    }
  } catch (error) {
    setloading(false);
    console.log(error);
    ToastMessage('Something went wrong');
  }
};
