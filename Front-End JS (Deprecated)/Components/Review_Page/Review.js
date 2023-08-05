import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import WriteReview from './WriteReview'; // Import the WriteReview component
import ViewPropTypes from 'deprecated-react-native-prop-types';
const Review = () => {
  const [showReviewModal, setShowReviewModal] = useState(true); // Set it to true initially

  // Placeholder data for movie details
  const movieDetails = {
    title: 'Top Gun Maverick',
    director: 'Director Name',
    cast: 'Cast Members',
    releaseDate: 'Release Date',
    poster: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSu_HQf7Sgkij6NptUWlEKf6V9n5bC5cL1JfGFNylGC8VnfN_-N',
  };

  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);

  const handleWriteReview = () => {
    // Show the WriteReview modal
    setShowWriteReviewModal(true);
  };

  const handleWriteReviewClose = () => {
    // Close the WriteReview modal
    setShowWriteReviewModal(false);
  };

  const handleBackGesture = () => {
    if (showWriteReviewModal) {
      // Close the WriteReview modal if it's open
      handleWriteReviewClose();
    } else {
      // If the WriteReview modal is not open, close the Review modal
      setShowReviewModal(false);
    }
  };

  // Function to calculate the average score
  const calculateAverageScore = (ratings) => {
    const aspectCount = Object.keys(ratings).length;
    const totalScore = Object.values(ratings).reduce((acc, cur) => acc + cur, 0);
    return totalScore / aspectCount;
  };

  // Sample reviews from other users
  const otherUsersReviews = [
    {
      username: 'User1',
      review: 'This movie was fantastic! I loved the action scenes and the thrilling plot.',
      ratings: {
        story: 5,
        characters: 5,
        screenplay: 5,
        casting: 5,
      },
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
    },
    // Add more sample reviews as needed
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Movie Poster */}
      <Image source={{ uri: movieDetails.poster }} style={styles.moviePoster} />

      {/* Basic Movie Details */}
      <View style={styles.basicDetails}>
        <Text style={styles.title}>{movieDetails.title}</Text>
        <Text>Director: {movieDetails.director}</Text>
        <Text>Cast: {movieDetails.cast}</Text>
        <Text>Release Date: {movieDetails.releaseDate}</Text>
      </View>

      {/* Write Review Button */}
      <TouchableOpacity style={styles.writeReviewButton} onPress={handleWriteReview}>
        <Text style={styles.buttonText}>Write Review</Text>
      </TouchableOpacity>

      {/* WriteReview Modal */}
      <Modal
        visible={showWriteReviewModal}
        animationType="slide"
        onRequestClose={handleWriteReviewClose}
      >
        {/* Render the WriteReview component inside the modal */}
        <WriteReview onClose={handleWriteReviewClose} />
      </Modal>

      {/* List of reviews from other users */}
      {otherUsersReviews.map((review, index) => (
        <View key={index} style={styles.userReview}>
          <View style={styles.userReviewHeader}>
            <Text style={styles.username}>{review.username}</Text>
            {/* You can add the user avatar here */}
          </View>
          <Text style={styles.reviewText}>{review.review}</Text>

          {/* Render the aspect ratings */}
          <Text>Story: {review.ratings.story}</Text>
          <Text>Characters: {review.ratings.characters}</Text>
          <Text>Screenplay: {review.ratings.screenplay}</Text>
          <Text>Casting: {review.ratings.casting}</Text>

          {/* Calculate and display the final score */}
          <View style={styles.finalScoreContainer}>
            <Text style={styles.finalScoreText}>{calculateAverageScore(review.ratings)}/5</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... Rest of the styles ...

  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },

  moviePoster: {
    alignSelf: 'center',
    width: 400, // Set the width to fill the container
    height: 600, // Adjust the height to your desired value
    marginVertical: 30,
    resizeMode: 'cover', // Maintain aspect ratio and cover the container
  },

  basicDetails: {
    marginBottom: 20,
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
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
