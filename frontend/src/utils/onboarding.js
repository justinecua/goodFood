import AsyncStorage from '@react-native-async-storage/async-storage';

// Set the first time the onboarding carousel is finished (or skipped) so the
// slides only ever show on a fresh install.
const ONBOARDING_KEY = 'hasSeenOnboarding';

export async function hasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
  } catch (e) {
    // A storage failure shouldn't block the app — just show the slides again.
    return false;
  }
}

export async function markOnboardingSeen() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {}
}

export async function resetOnboarding() {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (e) {}
}
