/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Organise from '../screens/app/organise/organise';
import Moments from '../screens/app/moments/moments';
import Chat from '../screens/app/chat/chat';
import { APP_IMAGE } from '../utils/constants';
import Profile from '../screens/app/moments/profile';
import Notification from '../screens/app/moments/notification';
import Personalise from '../screens/auth/personalise/personalise';
import Deactivation from '../screens/app/moments/deactivation';
import Backup from '../screens/app/moments/backup';
import ProfileInfo from '../screens/app/chat/profileInfo';
import Template from '../screens/app/organise/template';
import Notes from '../screens/app/organise/notes';
import Todos from '../screens/app/organise/todos';
import AddFeed from '../screens/app/moments/addFeed';
import Comments from '../screens/app/moments/comments';
import Story from '../screens/app/moments/story';

import * as Animatable from 'react-native-animatable';
import { globalStyles, SCREEN_WIDTH } from '../styles/globalStyles';
import RememberDays from '../screens/app/moments/rememberDays';
import AllNotes from '../screens/app/moments/allNotes';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboard } from '@react-native-community/hooks';
import { useRoute } from '@react-navigation/native';
import { scale } from '../utils/metrics';

import NotificationActiveIconSvg from '../assets/svgs/notificationActiveIconSvg';
import NotificationInactiveIconSvg from '../assets/svgs/notificationInactiveIconSvg';
import Notifications from '../screens/app/notifications/notifications';
import BackupScreen from '../screens/app/moments/backup';
import PersonaliseOnboard from '../screens/auth/personalise/personaliseOnboard';
import PairingCode from '../screens/auth/register/pairingCode';
import CommentsQnA from '../screens/app/moments/commentsQnA';
import { VARIABLES } from '../utils/variables';
import { EventRegister } from 'react-native-event-listeners';
import TextOverlayStory from '../screens/app/moments/TextOverlayStory';
import { useAppContext } from '../utils/VariablesContext';
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';
import WebviewScreen from '../screens/app/chat/WebviewScreen';
import backupNow from '../screens/app/moments/backupNow';
import BackupNowScreen from '../screens/app/moments/backupNowScreen';
import AutoBackup from '../screens/app/moments/autoBackup';
import { Realm, RealmProvider, useRealm, useQuery } from '@realm/react';
import { appConfig, schema, schemaVersion } from '../backend/realm';
import YourFeed from '../screens/app/moments/YourFeed';
import QuizArchieve from '../screens/app/moments/QuizArchieve';
import DemoScreen from '../screens/app/moments/DemoScreen';
import WellBeing from '../screens/app/moments/WellBeing';
import WellBeingDetails from '../screens/app/moments/WellBeingDetails';
import ImageCardArchieve from '../screens/app/moments/ImageCardArchieve';
import { getCurrentTab } from '../utils/appstate';
import { scaleNew } from '../utils/metrics2';
import PersonaliseEdit from '../screens/app/moments/PersonaliseEdit';



import Play from '../screens/app/play/play';
import QuizOpen from '../screens/app/play/quizOpen';
import SummaryScreen from '../screens/app/play/summary';

import QuizList from '../screens/app/play/quizList';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ChatStack() {
  return (
    <Stack.Navigator initialRouteName="chat">
      <Stack.Screen
        name="chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MomentsStack() {
  return (
    <Stack.Navigator initialRouteName="moments">
      <Stack.Screen
        name="moments"
        component={Moments}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function OrganiseStack() {
  return (
    <Stack.Navigator initialRouteName="organise">
      <Stack.Screen
        name="organise"
        component={Organise}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function PlayStack() {
  return (
    <Stack.Navigator initialRouteName="play">
      <Stack.Screen
        name="play"
        component={Play}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="profile">
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const TabButton = ({
  item,
  onPress,
  accessibilityState,
  navigation,
  width,
  height,
}) => {
  const focused = accessibilityState.selected;
  // Use the appropriate icon depending on whether the tab is focused
  const icon = focused ? item.iconActive : item.iconInactive;
  const { hornyMode } = useAppContext();

  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      style={{
        flex: 1,
        justifyContent: Platform.OS === 'android' ? 'center' : 'flex-end',

        alignItems: 'center',
        //   height: Platform.OS === 'android' ? scale(83) : scale(65),
        //  paddingBottom: Platform.OS === 'android' ? scale(10) : scale(0),
      }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Image
          style={[
            { resizeMode: 'contain', width: width, height: width },
            hornyMode && item.label === 'Moments'
              ? {
                tintColor: focused ? '#fff' : '#737373',
              }
              : {},
          ]}
          source={icon}
        />
        {item.chatCount > 0 && !focused && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -10,
              width: 20,
              height: 20,
              borderRadius: 20,
              backgroundColor: '#E58D8D',
              borderWidth: 1,
              borderColor: '#828282',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={[
                {
                  ...globalStyles.boldSmallText,
                  fontSize: scale(12),
                },
                {
                  color: focused ? 'rgba(242, 242, 242, 1)' : '#fff',
                },
              ]}>
              {item.chatCount}
            </Text>
          </View>
        )}

        {item.nudgeCount !== undefined && item.nudgeCount !== 0 && (
          <View
            style={{
              position: 'absolute',
              top: scale(2),
              right: scale(-4),
              width: 10,
              height: 10,
              borderRadius: 20,
              backgroundColor: '#E58DA6',
              borderWidth: 1,
              borderColor: '#828282',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}

        {item.organiseCount && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: scale(-2),
              width: 10,
              height: 10,
              borderRadius: 20,
              backgroundColor: '#E58DA6',
              borderWidth: 1,
              borderColor: '#828282',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        )}
      </View>

      <Text
        style={[
          focused
            ? {
              color: colors.blue1,
              fontFamily: fonts.semiBoldFont,
              fontSize: scaleNew(14),
            }
            : {
              color: '#737373',
              fontFamily: fonts.standardFont,
              fontSize: scaleNew(14),
            },
          hornyMode && item.label === 'Moments'
            ? {
              color: focused ? '#fff' : '#737373',
            }
            : {},
        ]}>
        {item.label.toLowerCase()}
      </Text>
      {/* {focused && <View style={styles.activeTabIndicator} />} */}
    </Pressable>
  );
};

function TabStack({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { notifData, hornyMode, activeTab } = useAppContext();

  const chatItem = {
    label: 'Chat',
    iconActive: APP_IMAGE.tabChatActive,
    iconInactive: APP_IMAGE.tabChatInActive,
    chatCount: notifData?.chat,
  };

  const momentsItem = {
    label: 'Moments',
    iconActive: APP_IMAGE.tabMomentsActive,
    iconInactive: APP_IMAGE.tabMomentsInActive,
    nudgeCount: notifData.nudgeCount,
  };

  const organiseItem = {
    label: 'Organise',
    iconActive: APP_IMAGE.tabOrganiseActive,
    iconInactive: APP_IMAGE.tabOrganiseInActive,
    organiseCount: notifData?.organise,
  };

  const profileItem = {
    label: 'Profile',
    iconActive: APP_IMAGE.userActive,
    iconInactive: APP_IMAGE.userInactive,
    notificationCount: notifData?.notification,
  };
  const playItem = {
    label: 'Play',
    iconActive: APP_IMAGE.tabOrganiseActive,
    iconInactive: APP_IMAGE.tabOrganiseInActive,
    organiseCount: notifData?.play,
  };
  return (
    <SafeAreaView edges={['right', 'left']} style={{ flex: 1 }}>
      <Tab.Navigator
        backBehavior="history"
        initialRouteName={VARIABLES.defaultTab}
        screenOptions={{
          tabBarTestID: '',
          lazy: true,
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor:
              hornyMode && activeTab === 'moments'
                ? 'rgba(33, 17, 52, 1)'
                : '#fff',
            height:
              Platform.OS === 'android'
                ? scale(70)
                : scaleNew(50) + scaleNew(insets.bottom),
            // height:
            //   SCREEN_WIDTH > 375 || insets.bottom
            //     ? scaleNew(60) + insets.bottom
            //     : scaleNew(58),
          },
        }}>
        <Tab.Screen
          name="Chat"
          component={ChatStack}
          options={{
            tabBarTestID: 'bottomTabBarChat',
            tabBarButton: props => (
              <TabButton
                {...props}
                item={chatItem}
                width={scaleNew(25)}
                height={scaleNew(23)}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Moments"
          component={MomentsStack}
          options={{
            tabBarButton: props => (
              <TabButton
                {...props}
                item={momentsItem}
                width={scaleNew(25)}
                height={scaleNew(25)}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Play"
          component={PlayStack}
          options={{
            tabBarButton: props => (
              <TabButton
                {...props}
                item={playItem}
                width={scaleNew(25)}
                height={scaleNew(25)}
              />
            ),
          }}
        />

        {/* <Tab.Screen
          name="Organise"
          component={OrganiseStack}
          options={{
            tabBarButton: props => (
              <TabButton
                {...props}
                item={organiseItem}
                width={scaleNew(25)}
                height={scaleNew(25)}
              />
            ),
          }}
        /> */}

        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarButton: props => (
              <TabButton
                {...props}
                item={profileItem}
                width={scaleNew(25)}
                height={scaleNew(25)}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function AppStack() {
  return (
    <RealmProvider schema={schema} schemaVersion={schemaVersion}>
      <Stack.Navigator initialRouteName="tabStack">
        <Stack.Screen
          name="tabStack"
          component={TabStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DemoScreen"
          component={DemoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizArchieve"
          component={QuizArchieve}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageCardArchieve"
          component={ImageCardArchieve}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="YourFeed"
          component={YourFeed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="notifications"
          component={Notifications}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="personalise"
          component={Personalise}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PersonaliseEdit"
          component={PersonaliseEdit}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="personaliseOnboard"
          component={PersonaliseOnboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="pairingCode"
          component={PairingCode}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WellBeing"
          component={WellBeing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WellBeingDetails"
          component={WellBeingDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="deactivation"
          component={Deactivation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="backup"
          component={BackupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profileInfo"
          component={ProfileInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="template"
          component={Template}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="notes"
          component={Notes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="todos"
          component={Todos}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addFeed"
          component={AddFeed}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="comments"
          component={Comments}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="commentsQnA"
          component={CommentsQnA}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="story"
          component={Story}
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />

        <Stack.Screen
          name="rememberDays"
          component={RememberDays}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="allNotes"
          component={AllNotes}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TextOverlayStory"
          component={TextOverlayStory}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="WebviewScreen"
          component={WebviewScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="backupNow"
          component={backupNow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="backupNowScreen"
          component={BackupNowScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AutoBackup"
          component={AutoBackup}
          options={{ headerShown: false }}
        />



        <Stack.Screen
          name="quizOpen"
          component={QuizOpen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="summary"
          component={SummaryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="quizList"
          component={QuizList}
          options={{ headerShown: false }}
        />


      </Stack.Navigator>
    </RealmProvider>
  );
}

export default AppStack;

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Other styling if necessary
  },
  tabButtonContainer: focused => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: focused ? -28 : 0,
  }),
  label: focused => ({
    color: focused ? '#124698' : 'gray',
    // other styles for your label
  }),

  activeTabIndicator: {
    position: 'absolute',
    top: 0, // Adjust this to place the indicator at the top of the tab
    alignSelf: 'center',
    width: scale(80), // The indicator spans the full width of the tab
    height: scale(2.67), // Height of the indicator
    borderBottomRightRadius: 20, // Optional: if you want rounded edges
    borderBottomLeftRadius: 20,
    backgroundColor: '#124698', // Color of the active tab indicator
    marginHorizontal: 10, // 10px margin on each side
  },
});
