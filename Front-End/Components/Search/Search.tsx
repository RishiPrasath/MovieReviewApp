import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Define your RootStackParamList type
type RootStackParamList = {
  Home: undefined;
  Review: undefined;
  Search: undefined;
  // ... other screen definitions ...
};

// Define the ScreenNavigationProp type using NavigationProp
type ScreenNavigationProp<RouteName extends keyof RootStackParamList> = NavigationProp<
  RootStackParamList,
  RouteName
>;

const Search: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Search'>>();

  const handleOpenReviewScreen = () => {
    navigation.navigate('Review');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Page in tsx</Text>
      <TouchableOpacity style={styles.reviewButton} onPress={handleOpenReviewScreen}>
        <Text style={styles.buttonText}>Open Review Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Search;
