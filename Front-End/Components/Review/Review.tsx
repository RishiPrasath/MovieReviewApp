import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import WriteReview from './WriteReview';
import { ReviewData } from './types'; // Import the type

const Review: React.FC = () => {
  const [showReviewModal, setShowReviewModal] = useState(true);

  const movieDetails = {
    title: 'Top Gun Maverick',
    director: 'Director Name',
    cast: 'Cast Members',
    releaseDate: 'Release Date',
    poster: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSu_HQf7Sgkij6NptUWlEKf6V9n5bC5cL1JfGFNylGC8VnfN_-N',
  };

  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);

  const handleWriteReview = () => {
    setShowWriteReviewModal(true);
  };

  const handleWriteReviewClose = () => {
    setShowWriteReviewModal(false);
  };

  const handleBackGesture = () => {
    if (showWriteReviewModal) {
      handleWriteReviewClose();
    } else {
      setShowReviewModal(false);
    }
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
      <Image source={{ uri: movieDetails.poster }} style={styles.moviePoster} />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movieDetails.title}</Text>
        <Text>Director: {movieDetails.director}</Text>
        <Text>Cast: {movieDetails.cast}</Text>
        <Text>Release Date: {movieDetails.releaseDate}</Text>
      </View>

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
  container: {
    flex: 1,
    padding: 16,
  },
  moviePoster: {
    alignSelf: 'center',
    width: 200,
    height: 300,
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
