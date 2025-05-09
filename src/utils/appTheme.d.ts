import {Theme} from '@react-navigation/native';

export type AppTheme = Theme & {
  dark: boolean;
  colors: Theme.colors;
};
