import moment from 'moment';
import navigationServices from '../navigations/navigationServices';
import {MOMENT_KEY, NOTIFICATION_TYPES} from '../utils/constants';
import {
  getQnaDetails,
  getStories,
  navigateToFeed,
  navigateToOrganize,
} from './notificationActions';
import {ToastMessage} from '../components/toastMessage';
import {EventRegister} from 'react-native-event-listeners';
import {VARIABLES} from '../utils/variables';

export const notificationHandler = async (
  notif,
  updateMomentsKeyData = () => {},
  setloading = () => {},
) => {
  console.log('notif reaction', notif);
  switch (notif?.type) {
    case NOTIFICATION_TYPES.story:
    case NOTIFICATION_TYPES.story_reaction:
      navigationServices.navigate('Moments');
      return getStories(notif.image, setloading);
    case NOTIFICATION_TYPES.feed:
    case NOTIFICATION_TYPES.comment:
    case NOTIFICATION_TYPES.comment_reaction:
    case NOTIFICATION_TYPES.post_reaction:
      navigationServices.navigate('Moments');
      setTimeout(() => {
        navigateToFeed(notif.id, setloading);
      }, 1000);
      break;
    case NOTIFICATION_TYPES.note:
      console.log(moment(notif.createdAt).diff(moment.now(), 'hours'));
      setloading(false);
      EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.notes);

      navigationServices.navigate('Moments');

      EventRegister.on('bottomTabReady', () => {
        setTimeout(() => {
          navigationServices.navigate('Moments');
        }, 1000);
      });
      break;
    case NOTIFICATION_TYPES.mood:
      EventRegister.emit('refreshMomemts');
      if (moment().diff(moment(notif.createdAt), 'hours') > 47) {
        setloading(false);
        ToastMessage(
          'It’s been 2+ days since this wellbeing update, so it’s no longer available',
        );
      } else {
        setloading(false);
        EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.feelings);
        navigationServices.navigate('Moments');
      }
      break;
    case NOTIFICATION_TYPES.highlight:
      EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.highlight);
      navigationServices.navigate('Moments');
      setloading(false);

      break;
    case NOTIFICATION_TYPES.imageCard:
      console.log('image card swich notification handler');
      EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.imageCard);
      EventRegister.emit('refreshMomemts');
      navigationServices.navigate('Moments');
      setloading(false);
      break;
    case NOTIFICATION_TYPES.quotedCard:
      console.log('quote card swich notification handler');
      EventRegister.emit('notificationScrollToEvent', MOMENT_KEY.quotedCard);
      EventRegister.emit('refreshMomemts');
      navigationServices.navigate('Moments');
      setloading(false);
      break;
    case NOTIFICATION_TYPES.quiz:
    case NOTIFICATION_TYPES.qna:
      EventRegister.emit('refreshMomemts');
      setTimeout(() => {
        getQnaDetails(setloading, notif.id, notif?.QnAType);
      }, 1000);

      break;
    case NOTIFICATION_TYPES.organize_to_do:
    case NOTIFICATION_TYPES.organize_note:
    case NOTIFICATION_TYPES.organize_template:
      VARIABLES.defaultTab = 'Organise';
      navigationServices.navigate('Organise');

      navigateToOrganize(
        {
          id: notif.id,
          type: notif.type,
        },
        setloading,
      );
      break;
    case NOTIFICATION_TYPES.chat:
      VARIABLES.defaultTab = 'Chat';
      setloading(false);
      setTimeout(() => {
        navigationServices.navigate('Chat');
      }, 1000);
      break;
    case NOTIFICATION_TYPES.nudge:
      navigationServices.navigate('Moments');

    default:
      break;
  }
};
