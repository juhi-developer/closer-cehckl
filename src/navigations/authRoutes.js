import React from 'react';
import VerifyOtp from '../screens/auth/login/verifyOtp';
import Onboarding from '../screens/auth/onboarding';
import AddProfilePic from '../screens/auth/register/addProfilePic';
import PairingCode from '../screens/auth/register/pairingCode';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PersonaliseOnboard from '../screens/auth/personalise/personaliseOnboard';
import Personalise from '../screens/auth/personalise/personalise';

import restoreBackup from '../screens/auth/restoreBackup';
import RestoreScreen from '../screens/auth/restoreScreen';
import GetStarted from '../screens/auth/GetStarted';
import Onboarding1 from '../screens/auth/Onboarding1';
import Onboarding2 from '../screens/auth/Onboarding2';
import PersonliseQuestions from '../screens/auth/PersonliseQuestions';
import Signup from '../screens/auth/Signup';
import WelcomeToCloser from '../screens/auth/WelcomeToCloser';
import HearAboutUs from '../screens/auth/HearAboutUs';
import Login from '../screens/auth/Login';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName={'Onboarding1'}
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="GetStarted"
        component={GetStarted}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Onboarding1"
        component={Onboarding1}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Onboarding2"
        component={Onboarding2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PersonliseQuestions"
        component={PersonliseQuestions}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HearAboutUs"
        component={HearAboutUs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="WelcomeToCloser"
        component={WelcomeToCloser}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="pairingCode"
        component={PairingCode}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="addProfilePic"
        component={AddProfilePic}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="verifyOtp"
        component={VerifyOtp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="personaliseOnboard"
        component={PersonaliseOnboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="personalise"
        component={Personalise}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="restoreBackup"
        component={restoreBackup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RestoreScreen"
        component={RestoreScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
