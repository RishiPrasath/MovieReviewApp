// types.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type TabNavigationParamList = {
  Home: undefined;
  Search: undefined;
  Account: undefined;
  Register: undefined; 
  Review: undefined;
  WriteReview: undefined;
};

export type RegisterProps = {
  navigation: StackNavigationProp<TabNavigationParamList, 'Register'>;
  onClose: () => void;
};

export type WriteReviewProps = {
  navigation: StackNavigationProp<TabNavigationParamList, 'WriteReview'>;
  onClose: () => void;
};



export type RootStackParamList = {
  MainTabs: undefined;
  Review: { movieId: number }; // Adjust this as per your route
  // Add other routes if needed
};