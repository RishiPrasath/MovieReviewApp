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
