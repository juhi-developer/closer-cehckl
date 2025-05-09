import {APP_IMAGE} from './constants';

export const VARIABLES = {
  // API_URL: API_URL,
  activeTab: 'moments',
  isMediaOpen: false,
  token: '',
  user: null,
  notification: false,
  defaultTab: 'Moments',
  isDarkMode: false,
  deviceToken: null,
  entryType: '',
  shareContent: [],
  themeData: {
    id: 1,
    themeColor: '#EFE8E6',
    strokeColor: '#ECDDD9',
    label: 'Default theme',
  },
  showDemo: false,
  recentReactions: [
    {id: 35, name: 'sticker81', sticker: 283},
    {id: 36, name: 'sticker82', sticker: 284},
    {id: 37, name: 'sticker83', sticker: 285},
    {id: 38, name: 'sticker84', sticker: 286},
    {id: 39, name: 'sticker85', sticker: 287},
  ],
  recentEmojis: [],
  appNotifData: {
    organise: false,
    notification: false,
    chat: 0,
    nudgeCount: 0,
  },
  nudgeArray: [],
  disableTouch: true,
  currentSound: {},
  momentsNavigationKey: '',
  toddosInfo: {},
  momentsToolTipKey: false,
  notificationId: '',
  demoStoriesData: [
    {
      story_image: APP_IMAGE.demo2,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo3,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo4,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo7,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo6,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo5,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo8,
      isSeen: false,
    },
    {
      story_image: APP_IMAGE.demo1,
      isSeen: false,
    },
  ],
};

export const regEmail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
