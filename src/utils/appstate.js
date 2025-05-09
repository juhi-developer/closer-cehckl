// AppState.js
let currentTab = '';

export const setCurrentTab = tab => {
  currentTab = tab;
};

export const getCurrentTab = () => {
  return currentTab;
};
