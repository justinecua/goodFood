// The light palette is the default export, so every screen that already does
// `import colors from '../constants/colors'` keeps working unchanged.
// `lightColors` / `darkColors` are for screens wired to ThemeContext.
export const lightColors = {
  button: '#3CB57C',
  bg_black: '#020F1F',
  button_green_light: '#EFFFF7',
  gray: '#999999',
  food_bg: '#999999',
  background: '#F6F8FA',
  container_bg: '#F8F8F8',
  container_bg2: '#FFFFFF',
  subtext: '#909294',
  subtextInput: '#c4c5c6',
  maintext: '#2A2A2A',
  button_text: '#fff',
  background1: '#218355',
  background2: '#FFFFFF',
  underlineColor: '#3cb57c',
};

export const darkColors = {
  button: '#3CB57C',
  bg_black: '#F6F8FA',
  button_green_light: '#12352A',
  gray: '#8A8D91',
  food_bg: '#8A8D91',
  background: '#0F1419',
  container_bg: '#1A2027',
  container_bg2: '#1E262E',
  subtext: '#8A8D91',
  subtextInput: '#5A6069',
  maintext: '#ECEFF3',
  button_text: '#fff',
  background1: '#218355',
  background2: '#1E262E',
  underlineColor: '#3cb57c',
};

const colors = lightColors;

export default colors;
