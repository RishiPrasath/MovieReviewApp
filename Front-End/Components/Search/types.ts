import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types';

type RootStackParamList = {
  Home: undefined;
  Review: undefined;
  Search: undefined;
  
};

export type ScreenNavigationProp<RouteName extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  RouteName
>;



export type MovieData = {
    title: string;
    director: string;
    cast: string;
    releaseDate: string;
    poster: string;
  };
  