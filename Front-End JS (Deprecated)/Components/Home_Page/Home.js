import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ViewPropTypes from 'deprecated-react-native-prop-types';
const Home = () => {
  const navigation = useNavigation();

  const handleOpenReviewScreen = () => {
    navigation.navigate('Review');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <TouchableOpacity style={styles.reviewButton} onPress={handleOpenReviewScreen}>
        <Text style={styles.buttonText}>Review Page</Text>
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
