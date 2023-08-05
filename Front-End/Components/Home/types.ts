import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your screens and their respective params here
export type RootStackParamList = {
  Home: undefined;
  Review: undefined;
};

// Create individual route prop and navigation prop types for each screen
export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
export type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;
