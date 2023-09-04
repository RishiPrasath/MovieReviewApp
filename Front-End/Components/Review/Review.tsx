import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from 'react-native';
import WriteReview from './WriteReview';
import { ReviewData, MovieDetails } from './types'; // Import the necessary types
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { useUser } from '../UserContext/UserContext';

export type ReviewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Review'>;
export type ReviewScreenRouteProp = RouteProp<RootStackParamList, 'Review'>;

type Props = {
  route: ReviewScreenRouteProp;
  navigation: ReviewScreenNavigationProp;
};

const Review: React.FC<Props> = ({ route, navigation }) => {
  const { loggedIn, userID ,username } = useUser(); 
  const [isWriteReviewModalVisible, setIsWriteReviewModalVisible] = useState(false);
  
  const [isUpdate, setIsUpdate] = useState(false);
  
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const isMovieReleased = movieDetails && new Date(movieDetails.release_date) <= new Date();

  //Review posted by the user
  
  const [userReview, setUserReview] = useState<ReviewData | null>(null);


  //Function to check if the movie has been released or not
  //returns true if the movie has been released, false otherwise
  const checkMovieReleased = (releaseDate: string | undefined) => {
    if (!releaseDate) {
      return false; // If releaseDate is not available, consider it as not released
    }
    
    const today = new Date();
    const release = new Date(releaseDate);
    return release <= today;
  };
  
  


  const refreshReviews = () => {
    const movieid = route.params.movieId;
    // Fetch reviews from the server
    const reviewsEndpoint = `http://movie-review-app-ruby.vercel.app/review/getReviews/${movieid}`
    console.log('Refreshing reviews...', reviewsEndpoint);
    fetch(reviewsEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Refreshed reviews:', data.reviews);
        
        // FInd the Review that matches the username
        const userReview = data.reviews.find((review: ReviewData) => review.Username === username);

        if (userReview) {
          setIsUpdate(true);
        }


        console.log('User Review:', userReview);

        // If user is logged in, and has reviewed this movie, set the userReview state variable
        //Also, filter out the user's data.reviews again for reviews that are not the user's
        // If the user is not logged in, set the userReview state variable to null
        // Also in this case , add all the reviews to the reviews state variable

        if (loggedIn && userReview) {
          setUserReview(userReview);
          setReviews(data.reviews.filter((review: ReviewData) => review.Username !== username));
        } else {
          setUserReview(null);
          setReviews(data.reviews);
        }
        
        

      })
      .catch(error => {
        console.error('Error refreshing reviews:', error);
      });
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await fetch(`http://movie-review-app-ruby.vercel.app/review/${movieId}`);
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };


  useEffect(() => {
    console.log('LOADING REVIEW SCREEN');

    // Load movie details

    fetchMovieDetails(route.params.movieId);

    // Load reviews

    refreshReviews();

    
  
  }, [route.params.movieId, loggedIn, userID]);




  const handleWriteReview = () => {
    setIsWriteReviewModalVisible(true);
  };

  const handleWriteReviewClose = () => {
    setIsWriteReviewModalVisible(false);
  };


  // When the user clicks the "Update Review" button
  const handleUpdateReview = () => {
    if (userReview) {
      // Open the Write Review modal, and pass the user's review data to it
      setIsWriteReviewModalVisible(true);
    }
  };
 

  return (
    <ScrollView style={styles.container}>
      {movieDetails ? (
        <>
          <Image
            style={styles.moviePoster}
            source={{ uri: movieDetails.poster_path }}
          />
  
          <View style={styles.detailsContainer}>
            <View style={styles.detailSection}>
              <Text style={styles.movieTitleHeading}>{movieDetails.title}</Text>
              {/* ... Other movie details ... */}
              <Text style={styles.detailHeading}>Release Date:</Text>
              <Text style={styles.releaseDate}>{movieDetails.release_date}</Text>
  
              <Text style={styles.detailHeading}>Director:</Text>
              {movieDetails.directors.map((director, index) => (
                <Text style={styles.detailText} key={index}>{director}</Text>
              ))}
  
              <Text style={styles.detailHeading}>Cast:</Text>
              {movieDetails.cast.map((castMember, index) => (
                <Text style={styles.detailText} key={index}>{castMember}</Text>
              ))}
  
              <Text style={styles.detailHeading}>Genre:</Text>
              {movieDetails.genres.map((genre, index) => (
                <Text style={styles.detailText} key={index}>{genre}</Text>
              ))}
            </View>
  
            {!isMovieReleased && (
              <Text style={styles.notReleasedText}>
                This movie will be open for review when released on {movieDetails.release_date}.
              </Text>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Movie details not available.</Text>
      )}
  
      {loggedIn ? (
        <>
          {userReview && (
            <View style={styles.userReview}>
              
              {/* Display details from userReview */}
              
              <Text style={styles.username}>{userReview.Username}</Text>
              <Text style={styles.reviewText}>{userReview.review}</Text>
              <View style={styles.ratingsContainer}>
                <Text style={styles.aspect}>Story: {userReview.ratings.Story}</Text>
                <Text style={styles.aspect}>Characters: {userReview.ratings.Characters}</Text>
                <Text style={styles.aspect}>Screenplay: {userReview.ratings.Screenplay}</Text>
                <Text style={styles.aspect}>Casting: {userReview.ratings.Casting}</Text>
                {/* Render additional aspect ratings */}
                {Object.entries(userReview.additionalAspectRatings).map(([aspect, rating]) => (
                  <Text style={styles.aspect} key={aspect}>{aspect}: {rating}</Text>
                ))}

                <View style={styles.finalScoreContainer}>
                  {/* Calculate final score by average of aspects */}
                  <Text style={styles.finalScoreText}>
                    {parseInt(((Object.values(userReview.ratings).reduce((sum, score) => sum + score, 0) +
                    Object.values(userReview.additionalAspectRatings).reduce((sum, score) => sum + score, 0)) /
                    (Object.values(userReview.ratings).length + Object.values(userReview.additionalAspectRatings).length)).toFixed(1))} / 5
                  </Text>

                </View>


            </View>              



            </View>
          )}
  
            {userReview ? (
            <TouchableOpacity
              style={styles.updateReviewButton}
              onPress={handleUpdateReview}
              disabled={!checkMovieReleased(movieDetails?.release_date)} // Disable the button if movie is not released
            >
              <Text style={styles.buttonText}>
                {checkMovieReleased(movieDetails?.release_date)
                  ? 'Update Review'
                  : 'Movie Not Released'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.writeReviewButton}
              onPress={handleWriteReview}
              disabled={!checkMovieReleased(movieDetails?.release_date)} // Disable the button if movie is not released
            >
              <Text style={styles.buttonText}>
                {checkMovieReleased(movieDetails?.release_date)
                  ? 'Write Review'
                  : 'Movie Not Released'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.loginMessage}>
          Log in to provide a review for this movie.
        </Text>
      )}
  
      <Modal
        animationType="slide"
        transparent={false}
        visible={isWriteReviewModalVisible}
      >
        <WriteReview movieId={route.params.movieId} onClose={handleWriteReviewClose} isUpdate={isUpdate} refreshReviews={refreshReviews} ExistingReview={userReview} />
      </Modal>
  
      <Text style={styles.userReviewsHeading}>User Reviews</Text>

      <View style={styles.userReviewsContainer}>
          
          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              const basicAspectScores = Object.values(review.ratings);
              const additionalAspectScores = Object.values(review.additionalAspectRatings);
              const sumOfScores = basicAspectScores.reduce((sum, score) => sum + score, 0) +
                additionalAspectScores.reduce((sum, score) => sum + score, 0);
              const totalAspects = basicAspectScores.length + additionalAspectScores.length;

              const finalScore = parseInt((sumOfScores / totalAspects).toFixed(1));

              return (
                
                <View key={index} style={styles.userReview}>
                  
                  <Text style={styles.username}>{review.Username}</Text>
                  <Text style={styles.reviewText}>{review.review}</Text>
                  <View style={styles.ratingsContainer}>
                    <Text style={styles.aspect}>Story: {review.ratings.Story}</Text>
                    <Text style={styles.aspect}>Characters: {review.ratings.Characters}</Text>
                    <Text style={styles.aspect}>Screenplay: {review.ratings.Screenplay}</Text>
                    <Text style={styles.aspect}>Casting: {review.ratings.Casting}</Text>
                    {/* Render additional aspect ratings */}
                    {Object.entries(review.additionalAspectRatings).map(([aspect, rating]) => (
                      <Text style={styles.aspect} key={aspect}>{aspect}: {rating}</Text>
                    ))}
                  </View>
                  {/* Display the final score */}
                  <View style={styles.finalScoreContainer}>
                    <Text style={styles.finalScoreText}>{finalScore} / 5</Text>
                  </View>
                </View>
              );
            })
            // If user has reviewed, but no other reviews are available
          ) : userReview ? (
            <Text style={styles.noReviewsText}>You are the first person to review this movie!</Text>
            // If user has not reviewed, and no other reviews are available
          ) : (
            <Text style={styles.noReviewsText}>No reviews available.</Text>
          )}
      </View>

            </ScrollView>
          );

        };

        const styles = StyleSheet.create({
          yourReviewHeading: {
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 8,
            textAlign: 'center',
            color: 'white',
          },
          updateReviewButton:{
            backgroundColor: 'rgb(59, 72, 171)', // Lighter Blue
            padding: 16,
            borderRadius: 8,
            alignSelf: 'center',
            marginBottom: 16,
          },
          noReviewsText:{
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'black',
            marginTop: 16,
            marginBottom: 16,
          },
          moviePoster: {
            alignSelf: 'center',
            width: 300,
            height: 500,
            marginVertical: 16,
            resizeMode: 'cover',
          },
          detailSection: {
            marginBottom: 8,
          },
          detailHeading: {
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
            color: 'rgb(120, 122, 145)',
          },
          detailText: {
            fontSize: 16,
            textAlign: 'center',
            color: 'white',
          },
          releaseDate: {
            fontSize: 16,
            textAlign: 'center',
            color: 'white',
          },
          userReview: {
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 15,
            backgroundColor: 'rgb(15, 4, 76)',
          },

          notReleasedText: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'rgb(241, 246, 249)',
            marginTop: 16,
          },

          username: {
            fontWeight: 'bold',
            fontSize: 30,
            marginBottom: 8,
            color: 'white',
            textAlign: 'center',
          },
          reviewText: {
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 8,
            color: 'white',
          },
          ratingsContainer: {
            alignItems: 'center',
            marginTop: 8,
            marginLeft: 0,
            textAlign: 'center',
          },
          aspect: {
            fontSize: 25,
            marginBottom: 8,
            color: 'rgb(120, 122, 145)',
          },
          userReviewsContainer: {
            marginBottom: 16,
          },
          userReviewsHeading: {
            marginTop: 16,
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 8,
            textAlign: 'center',
          },
          finalScoreContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          },
          finalScoreText: {
            fontWeight: 'bold',
            fontSize: 30,
            color: 'white',
          },
          loginMessage: {
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 20,
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

          movieTitleHeading: {
            fontSize: 40,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'white',
            marginBottom: 8,
          },

          detailsContainer: {
            marginBottom: 16,
            backgroundColor: 'rgb(20, 30, 97)',
            borderRadius: 15,
            padding: 16,
          },
          title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center',
          },
          writeReviewButton: {
            backgroundColor: 'rgb(59, 72, 171)', // Lighter Blue
            padding: 16,
            borderRadius: 8,
            alignSelf: 'center',
            marginBottom: 16,
          },
          buttonText: {
            color: 'white',
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
          },
          userReviewHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          },
        });

export default Review;
