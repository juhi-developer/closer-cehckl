import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key1, key2) => {
  try {
    await AsyncStorage.setItem(key1, key2);
  } catch (e) {
    // saving error
    console.log(e);
  }
};

export const getData = async key1 => {
  try {
    const value = await AsyncStorage.getItem(key1);
    if (value !== null) {
      return value;
      // value previously stored
    }
  } catch (e) {
    console.log(e);
  }
};

export const removeData = async key1 => {
  try {
    await AsyncStorage.removeItem(key1);
  } catch (e) {
    console.log(e);
  }
};

export const ASYNC_STORAGE_KEYS = {
  themeInfo: 'themeInfo',
  showDemo: 'showDemo',
  recentEmoji: 'recentEmoji',
  recentSmily: 'recentSmily',
};
