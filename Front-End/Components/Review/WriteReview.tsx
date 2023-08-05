import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import { Picker } from '@react-native-picker/picker';
import { WriteReviewProps, BasicAspectRatings, ReviewData } from './types'; // Import the types

const WriteReview: React.FC<WriteReviewProps> = ({ onClose }) => {
  const [reviewText, setReviewText] = useState('');
  const [basicAspectRatings, setBasicAspectRatings] = useState<BasicAspectRatings>({
    story: 3,
    characters: 3,
    screenplay: 3,
    casting: 3,
  });
  const [additionalAspects, setAdditionalAspects] = useState<string[]>([]);
  const [selectedAspect, setSelectedAspect] = useState<string>('');

  const handleBasicAspectRatingChange = (aspect: keyof BasicAspectRatings, rating: number) => {
    setBasicAspectRatings({ ...basicAspectRatings, [aspect]: rating });
  };

  const handleAddAspect = () => {
    if (selectedAspect && !additionalAspects.includes(selectedAspect)) {
      setAdditionalAspects([...additionalAspects, selectedAspect]);
      setSelectedAspect('');
    }
  };

  const handleRemoveAspect = (aspect: string) => {
    const updatedAspects = additionalAspects.filter((item) => item !== aspect);
    setAdditionalAspects(updatedAspects);
  };

  const handleSaveReview = () => {
    const reviewData: ReviewData = {
      username: 'John Doe', // You can get the username from user input
      review: reviewText,
      ratings: basicAspectRatings,
      additionalAspectRatings: {}, // You can implement this as needed
    };
    console.log(reviewData);

    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write Your Review</Text>

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

      <TouchableOpacity style={styles.saveReviewButton} onPress={handleSaveReview}>
        <Text style={styles.buttonText}>Save Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
