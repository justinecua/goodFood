import AsyncStorage from '@react-native-async-storage/async-storage';

// Which home screen the diner picked on DinerHomeMode. Remembered so the
// chooser only interrupts once, and so the Home tab knows where to go.
const HOME_MODE_KEY = 'dinerHomeMode';

export const HOME_MODES = {
  default: 'DinerHome',
  assisted: 'DinerAssistedHome',
};

export async function getHomeMode() {
  try {
    const stored = await AsyncStorage.getItem(HOME_MODE_KEY);
    return stored === 'default' || stored === 'assisted' ? stored : null;
  } catch (e) {
    return null;
  }
}

export async function setHomeMode(mode) {
  try {
    await AsyncStorage.setItem(HOME_MODE_KEY, mode);
  } catch (e) {}
}

// Route name for a stored mode, falling back to the default home screen.
export function routeForMode(mode) {
  return HOME_MODES[mode] || HOME_MODES.default;
}
