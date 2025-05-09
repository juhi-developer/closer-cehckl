import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOOLTIPS_KEY = 'appTooltips';
export const initialTooltipStates = {
  firstStickyNoteAdded: false,
  firstMoodCardAdded: false,
  thirdMoodCardAdded: false,
  moodCardAddedWithContext: false,
  firstStoryAdded: false,
  secondStoryAdded: false,
  biometricShown: false,
  firstMemoryAdded: false,
  firstImageCardAdded: false,
  firstNudgeCardAdded: false,
  firstWellbeingOpenEmotion: false,

  hornyModeDialogShown: false,
  hornyModeFirstTime: false,
  eveningModeDialogShown: false,
  eveningModeSwitch: false,
  backupNowScreenVisited: false,
  shareCloser: false,
  shareFeedback: false,
  unpairPartnerModalShown: false,
  deleteAccountPartnerModalShown: false,
  inAppReviewShown: '0',
};

export const initialTooltipStatesToTrue = {
  firstStickyNoteAdded: true,
  firstMoodCardAdded: true,
  thirdMoodCardAdded: true,
  moodCardAddedWithContext: true,
  firstStoryAdded: true,
  secondStoryAdded: true,
  biometricShown: true,
  firstMemoryAdded: true,
  firstImageCardAdded: true,
  firstNudgeCardAdded: true,
  firstWellbeingOpenEmotion: true,

  hornyModeDialogShown: true,
  hornyModeFirstTime: true,
  eveningModeDialogShown: true,
  backupNowScreenVisited: true,
  shareCloser: true,
  shareFeedback: true,

  unpairPartnerModalShown: false,
  deleteAccountPartnerModalShown: false,
  inAppReviewShown: '3',
};

export async function ensureTooltipsInitialized() {
  try {
    let tooltips = await AsyncStorage.getItem(TOOLTIPS_KEY);
    if (!tooltips) {
      console.log('No tooltip settings found, initializing...');
      await initializeTooltipStates();
    } else {
      const tooltipStates = JSON.parse(tooltips);
      if (typeof tooltipStates !== 'object' || tooltipStates === null) {
        console.log('Malformed tooltip settings detected, reinitializing...');
        await initializeTooltipStates();
      }
    }
  } catch (error) {
    console.error('Error ensuring tooltip settings:', error);
  }
}

export async function initializeTooltipStatesOnLogin() {
  try {
    const tooltipStates = JSON.stringify(initialTooltipStatesToTrue);
    await AsyncStorage.setItem(TOOLTIPS_KEY, tooltipStates);
  } catch (error) {
    console.error('Failed to initialize tooltip states:', error);
  }
}

export async function initializeTooltipStates() {
  try {
    const tooltipStates = JSON.stringify(initialTooltipStates);
    await AsyncStorage.setItem(TOOLTIPS_KEY, tooltipStates);
  } catch (error) {
    console.error('Failed to initialize tooltip states:', error);
  }
}

export async function checkContextualTooltip(feature) {
  try {
    const tooltips = await AsyncStorage.getItem(TOOLTIPS_KEY);
    const tooltipStates = JSON.parse(tooltips);

    return tooltipStates[feature];
  } catch (error) {
    console.error('Error checking tooltip state:', error);
  }
}

export async function updateContextualTooltipState(feature, shown) {
  try {
    const tooltips = await AsyncStorage.getItem(TOOLTIPS_KEY);
    let tooltipStates = JSON.parse(tooltips);

    tooltipStates[feature] = shown;

    await AsyncStorage.setItem(TOOLTIPS_KEY, JSON.stringify(tooltipStates));
  } catch (error) {
    console.error('Failed to update tooltip state:', error);
  }
}
