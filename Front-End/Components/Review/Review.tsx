import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import WriteReview from './WriteReview';
import { ReviewData } from './types'; // Import the type
import { MovieDetails } from './types'; // Import the type


import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';

type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;
type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;

type Props = {
  route: ReviewScreenRouteProp;
  navigation: ReviewScreenNavigationProp;
};

const Review: React.FC<Props> = ({ route }) => {
  const [showReviewModal, setShowReviewModal] = useState(true);

  
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);


  const [errorText, setErrorText] = useState(''); // Add errorText state variable
  
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  useEffect(() => {
      // Extract the movieId from the route params
    const movieId = route.params.movieId;

    console.log("Movie ID: ", movieId);
    

    // Construct the API endpoint using the movieId
    const movieEndpoint = `http://192.168.0.152:4000/review/${movieId}`;

    // Make the API request
    fetch(movieEndpoint)
      .then(response => response.json())
      .then(data => {
        // Update your state/variable with the retrieved movie details
        console.log('Movie details:', data);
        
        setMovieDetails(data);
      })
      .catch(error => {
        // Handle API request error
        console.error('Error fetching movie details:', error);
        setErrorText('An error occurred while fetching movie details.');
      });

      // Clean up any resources when the component unmounts
      return () => {
        // Cancel any pending API requests or perform other cleanup tasks
      };




  }, []);


  const handleWriteReview = () => {
    setShowWriteReviewModal(true);
  };

  const handleWriteReviewClose = () => {
    setShowWriteReviewModal(false);
  };

  

  const calculateAverageScore = (ratings: ReviewData['ratings']) => {
    const aspectCount = Object.keys(ratings).length;
    const totalScore = Object.values(ratings).reduce((acc, cur) => acc + cur, 0);
    return totalScore / aspectCount;
  };

  const otherUsersReviews: ReviewData[] = [
    {
      username: 'User1',
      review: 'This movie was fantastic! I loved the action scenes and the thrilling plot.',
      ratings: {
        story: 5,
        characters: 5,
        screenplay: 5,
        casting: 5,
      },
      additionalAspectRatings: {},
    },
    {
      username: 'User2',
      review: 'I enjoyed the movie, but I wish the characters had more depth.',
      ratings: {
        story: 4,
        characters: 3,
        screenplay: 4,
        casting: 4,
      },
      additionalAspectRatings: {},
    },
    // Add more sample reviews as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {movieDetails ? (
        <>
          <Image source={{ uri: movieDetails.poster_path }} style={styles.moviePoster} />

          <View style={styles.detailsContainer}>
  <Text style={styles.title}>{movieDetails.title}</Text>
  
  <View style={styles.detailSection}>
    <Text style={styles.detailHeading}>Directors:</Text>
    <Text style={styles.detailText}>
      {movieDetails.directors.length > 0
        ? movieDetails.directors.join(', ')
        : 'N/A'}
    </Text>
  </View>
  
  <View style={styles.detailSection}>
    <Text style={styles.detailHeading}>Cast:</Text>
    <Text style={styles.detailText}>
      {movieDetails.cast.length > 0
        ? movieDetails.cast.join(', ')
        : 'N/A'}
    </Text>
  </View>
  
  <Text style={styles.releaseDate}>
    Release Date: {movieDetails.release_date}
  </Text>
</View>
        </>
      ) : (
        <Text style={styles.errorText}>Movie details not available.</Text>
      )}

      <TouchableOpacity style={styles.writeReviewButton} onPress={handleWriteReview}>
        <Text style={styles.buttonText}>Write Review</Text>
      </TouchableOpacity>

      <Modal visible={showWriteReviewModal} animationType="slide" onRequestClose={handleWriteReviewClose}>
        <WriteReview onClose={handleWriteReviewClose} />
      </Modal>

      {otherUsersReviews.map((review, index) => (
        <View key={index} style={styles.userReview}>
          <View style={styles.userReviewHeader}>
            <Text style={styles.username}>{review.username}</Text>
          </View>
          <Text style={styles.reviewText}>{review.review}</Text>

          <Text>Story: {review.ratings.story}</Text>
          <Text>Characters: {review.ratings.characters}</Text>
          <Text>Screenplay: {review.ratings.screenplay}</Text>
          <Text>Casting: {review.ratings.casting}</Text>

          <View style={styles.finalScoreContainer}>
            <Text style={styles.finalScoreText}>{calculateAverageScore(review.ratings)}/5</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailSection: {
    marginBottom: 8,
  },
  detailHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 16,
    textAlign: 'center',
  },
  releaseDate: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  moviePoster: {
    alignSelf: 'center',
    width: 300,
    height: 500,
    marginVertical: 16,
    resizeMode: 'cover',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  writeReviewButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userReview: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  userReviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewText: {
    marginBottom: 8,
  },
  finalScoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  finalScoreText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default Review;
