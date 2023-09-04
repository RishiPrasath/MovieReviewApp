import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Picker } from '@react-native-picker/picker';
import { WriteReviewProps, BasicAspectRatings, ReviewData } from './types';
import { useUser } from '../UserContext/UserContext';

const WriteReview: React.FC<WriteReviewProps> = ({ onClose, movieId, refreshReviews ,isUpdate ,ExistingReview }) => {
  const { username, userID } = useUser();

  const [reviewText, setReviewText] = useState('');
  const [basicAspectRatings, setBasicAspectRatings] = useState<BasicAspectRatings>({
    Story: 3,
    Characters: 3,
    Screenplay: 3,
    Casting: 3,
  });
  const [additionalAspects, setAdditionalAspects] = useState<{ aspect: string; rating: number }[]>([]);
  const [selectedAspect, setSelectedAspect] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewData | null>(null);

  useEffect(() => {
    if (isUpdate) {
      setIsUpdateMode(true);
    }

    if (ExistingReview) {
      setExistingReview(ExistingReview);
      setReviewText(ExistingReview.review);
      setBasicAspectRatings(ExistingReview.ratings);
      setAdditionalAspects(
        Object.keys(ExistingReview.additionalAspectRatings).map((aspect) => ({
          aspect,
          rating: ExistingReview.additionalAspectRatings[aspect],
        }))
      );
    }


    
  }, [movieId, userID,isUpdate]);

  

  const handleBasicAspectRatingChange = (aspect: keyof BasicAspectRatings, rating: number) => {
    setBasicAspectRatings({ ...basicAspectRatings, [aspect]: rating });
  }

  const handleAddAspect = () => {
    if (selectedAspect && !additionalAspects.some((aspect) => aspect.aspect === selectedAspect)) {
      setAdditionalAspects([...additionalAspects, { aspect: selectedAspect, rating: 0 }]);
      setSelectedAspect('');
    }
  };

  const handleRemoveAspect = (aspect: string) => {
    const updatedAspects = additionalAspects.filter((item) => item.aspect !== aspect);
    setAdditionalAspects(updatedAspects);
  };

  const handleAdditionalAspectRatingChange = (aspectIndex: number, rating: number) => {
    const updatedAdditionalAspects = additionalAspects.map((aspect, index) =>
      index === aspectIndex ? { ...aspect, rating } : aspect
    );
    setAdditionalAspects(updatedAdditionalAspects);
  };

  const handleCancel = () => {
    onClose();
  };
  
  

  const handleSaveReview = () => {
    if (username !== null) {
      const reviewData: ReviewData = {
        userID : userID,
        Username: username,
        movieid: movieId,
        review: reviewText,
        ratings: basicAspectRatings,
        additionalAspectRatings: {
          ...additionalAspects.reduce((acc, aspect) => ({ ...acc, [aspect.aspect]: aspect.rating }), {}),
        },
      };
  
      // Print review details to console
      console.log('Movie ID:', reviewData.movieid);
      console.log('Username:', reviewData.Username);
      console.log('Review:', reviewData.review);
      console.log('Ratings:', reviewData.ratings);
      console.log('Additional Aspect Ratings:', reviewData.additionalAspectRatings);
  
      // Send review to backend
      fetch('http://movie-review-app-ruby.vercel.app/review/submitReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success === true) {
          console.log('Review added successfully');
          onClose(); // Close the WriteReview modal
          refreshReviews(); // Refresh the reviews
        } else {
          console.log('Error adding review');
          setErrorMessage('Error adding review'); 
        }
      });
    }
  }





  const handleUpdateReview = () => {
    
    //Do POST request to update review
    

    

    fetch('http://movie-review-app-ruby.vercel.app/review/updateReview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID: existingReview?.userID,
        movieid: existingReview?.movieid,
        review: reviewText,
        ratings: basicAspectRatings,
        additionalAspectRatings: {
          ...additionalAspects.reduce((acc, aspect) => ({ ...acc, [aspect.aspect]: aspect.rating }), {}),
        },  
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === true) {
        console.log('Review updated successfully');
        onClose(); // Close the WriteReview modal
        refreshReviews(); // Refresh the reviews
      } else {
        console.log('Error updating review');
        setErrorMessage('Error updating review'); 
      }
    });


      
  };










  

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isUpdateMode ? 'Update Your Review' : 'Write Your Review'}</Text>

      <TextInput
        style={styles.reviewInput}
        placeholder="Write your review here..."
        multiline
        value={reviewText}
        onChangeText={setReviewText}
      />

      <Text style={styles.aspectTitle}>Rate the Basic Aspects (1-5 stars):</Text>
      <View style={styles.aspectContainer}>
        {/* Basic Aspect Ratings */}
        {Object.keys(basicAspectRatings).map((aspect) => (
          <View key={aspect} style={styles.singleAspect}>
            <Text>{aspect}:</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={basicAspectRatings[aspect as keyof BasicAspectRatings]}
              selectedStar={(rating) => handleBasicAspectRatingChange(aspect as keyof BasicAspectRatings, rating)}
              fullStarColor="gold"
            />
          </View>
        ))}
      </View>

      <Text style={styles.aspectTitle}>Rate Additional Aspects (1-5 stars):</Text>
      <View style={styles.additionalAspectContainer}>
        {/* Additional Aspect Ratings */}
        {additionalAspects.map((aspect, index) => (
          <View key={aspect.aspect} style={styles.additionalAspect}>
          <View>
            <Text style={styles.aspectText}>{aspect.aspect}:</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={aspect.rating}
              selectedStar={(rating) => handleAdditionalAspectRatingChange(index, rating)}
              fullStarColor="gold"
            />
          </View>
          <TouchableOpacity onPress={() => handleRemoveAspect(aspect.aspect)}>
            <Text style={styles.removeAspectButton}>Remove</Text>
          </TouchableOpacity>
        </View>
        ))}
                <View style={styles.addAspectContainer}>
          <Picker
            style={styles.aspectPicker}
            selectedValue={selectedAspect}
            onValueChange={(itemValue) => setSelectedAspect(itemValue)}
          >
            <Picker.Item label="Select an aspect" value="" />
            <Picker.Item label="Editing" value="Editing" />
            <Picker.Item label="Cinematography" value="Cinematography" />
            <Picker.Item label="Lighting" value="Lighting" />
            <Picker.Item label="Dialogues" value="Dialogues" />
            <Picker.Item label="Production Design" value="Production Design" />
            <Picker.Item label="Costume Design" value="Costume Design" />
          </Picker>
          <TouchableOpacity onPress={handleAddAspect}>
            <Text style={styles.addAspectButton}>Add Aspect</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveReviewButton}
        onPress={isUpdateMode ? handleUpdateReview : handleSaveReview}
      >
        <Text style={styles.buttonText}>{isUpdateMode ? 'Update Review' : 'Save Review'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelbuttonText}>Cancel</Text>
      </TouchableOpacity>


      {/* Display error message */}

      <Text style={styles.errorMessage}>{errorMessage}</Text>


    </View>
  );
};

const styles = StyleSheet.create({

  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },


  aspectDescription:{
    marginBottom: 8,
    fontStyle: 'italic',
    color: 'gray',
  },

  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },

  cancelbuttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },

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
  reviewInput: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  aspectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aspectContainer: {
    marginBottom: 16,
  },
  singleAspect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  additionalAspectContainer: {
    marginBottom: 16,
  },
  additionalAspect: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeAspectButton: {
    marginLeft: 8,
    color: 'red',
    marginTop: 25,
  },
  addAspectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aspectPicker: {
    flex: 1,
    height: 40,
  },
  addAspectButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },

  aspectText: {
    marginRight: 5,
    fontWeight: 'bold',
    marginBottom: 8,
    
  },

 
  saveReviewButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WriteReview;
