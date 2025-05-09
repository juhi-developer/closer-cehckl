import React, {createContext, useState, useContext} from 'react';
import {VARIABLES} from './variables';
import {removeData, setData} from './storage';
import moment from 'moment';

const VariablesContext = createContext();

export const useAppContext = () => useContext(VariablesContext);

export const VariableProvider = ({children}) => {
  const [notifData, setNotifData] = useState(VARIABLES.appNotifData);
  const [user, setUser] = useState(VARIABLES.user);
  const [nudgeArray, setNudgeArray] = useState(VARIABLES.nudgeArray);
  const [momentsNavigationKey, setMomentsNavigationKey] = useState(
    VARIABLES.momentsNavigationKey,
  );
  const [hornyMode, sethornyMode] = useState(false);
  const [activeTab, setActiveTab] = useState(VARIABLES.activeTab);
  const [hornyModeTime, sethornyModeTime] = useState(null);

  // Define a method to update the notification data
  const updateNotifData = newData => {
    setNotifData(newData);
    // Also update the VARIABLES object if necessary
    VARIABLES.appNotifData = newData;
  };

  // Define a method to update the notification data
  const updateMomentsKeyData = newData => {
    setMomentsNavigationKey(newData);
    // Also update the VARIABLES object if necessary
    VARIABLES.momentsNavigationKey = newData;
  };

  // Method to update nudgeArray
  const updateNudgeArray = newData => {
    setNudgeArray(prevNudgeArray => {
      // Check if newData is an array
      if (Array.isArray(newData)) {
        // Append the entire array
        return [...prevNudgeArray, ...newData];
      } else if (typeof newData === 'string') {
        // Append the string directly
        return [...prevNudgeArray, newData];
      }
      return prevNudgeArray; // In case newData is neither array nor string
    });
  };

  const addNudgeArray = newDataArray => {
    setNudgeArray(prevNudgeArray => {
      // Check if newDataArray is an array
      if (Array.isArray(newDataArray)) {
        // Append the entire array
        return [...prevNudgeArray, ...newDataArray];
      } else if (typeof newDataArray === 'string') {
        // Append the string directly
        return [...prevNudgeArray, newDataArray];
      }
      return prevNudgeArray; // In case newDataArray is neither array nor string
    });
  };

  // Method to remove an item from nudgeArray
  const removeNudgeItem = () => {
    setNudgeArray([]);
    VARIABLES.nudgeArray = [];
  };

  const updateHornyMode = async (val, timestamp = null) => {
    if (!hornyMode) {
      setData('HORNY_MODE', timestamp || moment().toISOString());
      if (!timestamp) {
        // API('user/moments/hornyMode', 'POST', {type: 'normal'});
      }
    } else {
      removeData('HORNY_MODE');
    }
    // sethornyMode(false);
    sethornyMode(val);
    sethornyModeTime(timestamp || moment().toISOString());
  };

  return (
    <VariablesContext.Provider
      value={{
        user,
        setUser,
        notifData,
        updateNotifData,
        nudgeArray,
        addNudgeArray,
        updateNudgeArray,
        removeNudgeItem,
        updateMomentsKeyData,
        momentsNavigationKey,
        hornyMode,
        sethornyMode: updateHornyMode,
        hornyModeTime,
        activeTab,
        setActiveTab,
      }}>
      {children}
    </VariablesContext.Provider>
  );
};
