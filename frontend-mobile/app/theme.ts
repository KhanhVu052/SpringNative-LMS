import { DefaultTheme } from '@react-navigation/native';

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#5D5FEF',
    background: '#F8F9FF',
    card: '#FFFFFF',
    text: '#101828',
    border: '#E0E4FF',
    notification: '#5D5FEF',
  },
};
