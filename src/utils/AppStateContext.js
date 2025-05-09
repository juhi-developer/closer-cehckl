import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {NativeModules, Platform, NativeEventEmitter} from 'react-native';

// Create a context
const AppStateContext = createContext(null);

// Provider component
export const AppStateProvider = ({children}) => {
  const [appState, setAppState] = useState(null);
  const appStateRef = useRef(appState);
  const {AppStateListener} = NativeModules;
  const appStateEmitter = AppStateListener
    ? new NativeEventEmitter(AppStateListener)
    : null; // Ensure compatibility when AppStateListener is unavailable

  useEffect(() => {
    appStateRef.current = appState;
  }, [appState]);

  useEffect(() => {
    if (!appStateEmitter) {
      console.warn("AppStateListener is not available on this platform.");
      return;
    }

    const eventListener = appStateEmitter.addListener(
      'AppStateChanged',
      ({appState: newAppState}) => {
        if (newAppState !== appStateRef.current) {
          setAppState(newAppState);
        }
      },
    );

    return () => {
      eventListener.remove();
    };
  }, []);

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};

// Hook to use the app state
export const useAppState = () => useContext(AppStateContext);
