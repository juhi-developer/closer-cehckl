import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import io from 'socket.io-client';
import {API_BASE_URL} from './urls';
import {VARIABLES} from './variables';
import {setData} from './storage';
import {useAppContext} from './VariablesContext';
import * as Sentry from '@sentry/react-native';
import {AppState} from 'react-native';
import {useAppState} from './AppStateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EventRegister} from 'react-native-event-listeners';
import moment from 'moment';
import {optionsBothLive, optionsRelationship} from './constants';

const CleverTap = require('clevertap-react-native');
const SocketContext = createContext();

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
const SocketProvider = ({children}) => {
  const socketRef = useRef(null);
  // const appState = useRef(AppState.currentState);

  const appStateGlobal = useAppState();

  const {updateNudgeArray, addNudgeArray, sethornyMode} = useAppContext();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Function to initialize the socket connection
  const connectSocket = newToken => {
    if (newToken && appStateGlobal !== 'background' && !isSocketConnected) {
      if (newToken) {
        // Disconnect the current socket if it exists
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        // Initialize the new socket connection
        socketRef.current = io(API_BASE_URL, {
          query: {token: newToken},
        });

        socketRef.current.on('connect', () => {
          console.log('socket connected');
          setIsSocketConnected(true);
        });

        socketRef.current.on('error', error => {
          console.log('socket error', error);
          // Construct an Error object with a custom message and the original error
          const errorObj = new Error(`Socket error: ${error}`);
          errorObj.originalError = error;

          // Log the constructed error object to Sentry
          Sentry.captureException(errorObj);

          console.log('Socket Error:', error);
          // Handle the error as needed
        });

        socketRef.current.on('connect_timeout', timeout => {
          // Create a custom error for the timeout
          const timeoutError = new Error(
            `Socket connection timeout: ${timeout}`,
          );

          // Log the timeout error to Sentry
          Sentry.captureException(timeoutError);

          console.log('Connection Timeout:', timeout);
          // Handle timeout scenario
        });

        socketRef.current.on('firstConnection', async data => {
          const params2 = {
            Name: data.name,

            Email: data.email,

            Gender: data.gender,
            age: data.age,

            partnerName: data?.partnerData?.partner?.name,
            userName: data.name,
            dateOfMeet: data?.personalise?.dateOfMeet,
            children: data.personalise?.children,
            relationshipDistance:
              optionsBothLive[Number(data.personalise?.relationshipDistance)]
                ?.label,
            relationshipStatus:
              optionsRelationship[Number(data.personalise?.relationshipStatus)]
                ?.label,
          };
          // Remove keys with empty values
          Object.keys(params2).forEach(key => {
            if (
              params2[key] === '' ||
              params2[key] === null ||
              params2[key] === undefined ||
              (Array.isArray(params2[key]) && params2[key].length === 0)
            ) {
              delete params2[key];
            }
          });

          CleverTap.profileSet(params2);

          // addNudgeArray(data.nudges);
          //   addNudgeArray(data.nudges);

          VARIABLES.disableTouch = !data?.partnerCodeVerified;

          VARIABLES.user = data;
          setData('USER', JSON.stringify(data));

          //// need to uncomment this
          if (data?.hornyModeActive) {
            const currentTime = moment.utc(); // using UTC to ensure consistency
            const givenTime = moment
              .unix(data.hornyModeExpiresAt)
              .local()
              .subtract(30, 'minutes');
            const differenceInMinutes = currentTime.diff(givenTime, 'minutes');

            if (differenceInMinutes < 30) {
              sethornyMode(true, givenTime.toISOString());
            } else {
              sethornyMode(false);
            }
          }
        });

        socketRef.current.on('loginEmit', data => {
          VARIABLES.disableTouch = !data?.partnerCodeVerified;
          VARIABLES.user = data;
          setData('USER', JSON.stringify(data));
        });

        socketRef.current.on('paired', data => {
          VARIABLES.disableTouch = false;
          VARIABLES.user = data;
          EventRegister.emit('pairingSuccessAnimation');
          EventRegister.emit('pairingSuccess');

          setData('USER', JSON.stringify(data));
        });
        socketRef.current.on('nudge', data => {
          updateNudgeArray(data);

          ///  getUserProfileHandler();
        });
      }
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      console.log('socket ref disconnected');
      setIsSocketConnected(false);
    }
  };

  useEffect(() => {
    if (appStateGlobal === 'active') {
      // Only attempt to reconnect if there's a token available, assuming you store it somewhere accessible
      const token = VARIABLES.token;
      if (token && !isSocketConnected) {
        console.log('connected socket');
        connectSocket(token);
      }
    } else if (appStateGlobal === 'background' && !VARIABLES.isMediaOpen) {
      disconnectSocket();
    }

    return () => {};
  }, [appStateGlobal, isSocketConnected, VARIABLES.isMediaOpen]);

  // Cleanup effect for unmounting
  useEffect(() => {
    const token = VARIABLES.token;
    if (token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  const contextValue = {
    socket: socketRef.current,
    isSocketConnected,
    connectSocket,
    disconnectSocket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
