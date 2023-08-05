import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating'; // Import the star rating component
import { Picker } from '@react-native-picker/picker'; // Import the new Picker component
import { ViewPropTypes } from 'deprecated-react-native-prop-types';


const WriteReview = ({ onClose }) => {
  const [reviewText, setReviewText] = useState('');
  const [basicAspectRatings, setBasicAspectRatings] = useState({
    story: 3,
    characters: 3,
    screenplay: 3,
    casting: 3,
  });
  const [additionalAspects, setAdditionalAspects] = useState([]);
  const [selectedAspect, setSelectedAspect] = useState('');

  const handleBasicAspectRatingChange = (aspect, rating) => {
    setBasicAspectRatings({ ...basicAspectRatings, [aspect]: rating });
  };

  const handleAddAspect = () => {
    if (selectedAspect && !additionalAspects.includes(selectedAspect)) {
      setAdditionalAspects([...additionalAspects, selectedAspect]);
      setSelectedAspect('');
    }
  };

  const handleRemoveAspect = (aspect) => {
    const updatedAspects = additionalAspects.filter((item) => item !== aspect);
    setAdditionalAspects(updatedAspects);
  };

  const handleSaveReview = () => {
    // Here, you can handle saving the review data to your backend or store it locally
    // For now, we'll just log the data
    const reviewData = {
      reviewText,
      basicAspectRatings,
      additionalAspectRatings: {}, // You can implement this as needed
    };
    console.log(reviewData);

    // Close the WriteReview modal
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write Your Review</Text>

      {/* Review Text */}
      <TextInput
        style={styles.reviewInput}
        placeholder="Write your review here..."
        multiline
        value={reviewText}
        onChangeText={setReviewText}
      />

      {/* Basic Aspects Rating */}
      <Text style={styles.aspectTitle}>Rate the Basic Aspects (1-5 stars):</Text>
      <View style={styles.aspectContainer}>
        <Text>Story:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={basicAspectRatings.story}
          selectedStar={(rating) => handleBasicAspectRatingChange('story', rating)}
          fullStarColor="gold"
        />
      </View>
      <View style={styles.aspectContainer}>
        <Text>Characters:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={basicAspectRatings.characters}
          selectedStar={(rating) => handleBasicAspectRatingChange('characters', rating)}
          fullStarColor="gold"
        />
      </View>
      <View style={styles.aspectContainer}>
        <Text>Screenplay:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={basicAspectRatings.screenplay}
          selectedStar={(rating) => handleBasicAspectRatingChange('screenplay', rating)}
          fullStarColor="gold"
        />
      </View>
      <View style={styles.aspectContainer}>
        <Text>Casting:</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          rating={basicAspectRatings.casting}
          selectedStar={(rating) => handleBasicAspectRatingChange('casting', rating)}
          fullStarColor="gold"
        />
      </View>

      {/* Additional Aspects Rating */}
      <Text style={styles.aspectTitle}>Rate Additional Aspects (1-5 stars):</Text>
      <View style={styles.additionalAspectContainer}>
        {additionalAspects.map((aspect) => (
          <View key={aspect} style={styles.additionalAspect}>
            <Text>{aspect}:</Text>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={0} // You can handle additional aspect ratings here if needed
              selectedStar={(rating) => {}}
              fullStarColor="gold"
            />
            <TouchableOpacity onPress={() => handleRemoveAspect(aspect)}>
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

      {/* Save Review Button */}
      <TouchableOpacity style={styles.saveReviewButton} onPress={handleSaveReview}>
        <Text style={styles.buttonText}>Save Review</Text>
      </TouchableOpacity>
    </View>
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
