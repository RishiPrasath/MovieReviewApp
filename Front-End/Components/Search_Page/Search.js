import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // Perform search logic and set search results in the state
    // For now, let's use placeholder data as an example
    if (text === '') {
      setSearchResults([]);
    } else {
      const results = [
        { title: 'Movie 1', releaseDate: '2023-07-15', poster: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSu_HQf7Sgkij6NptUWlEKf6V9n5bC5cL1JfGFNylGC8VnfN_-N' },
        { title: 'Movie 2', releaseDate: '2023-07-20', poster: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSu_HQf7Sgkij6NptUWlEKf6V9n5bC5cL1JfGFNylGC8VnfN_-N' },
        // Add more search results as needed
      ];
      setSearchResults(results);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a movie..."
        value={searchQuery}
        onChangeText={handleSearchChange}
        style={styles.searchInput}
      />
      {/* Display search results */}
      {searchResults.map((movie, index) => (
        <TouchableOpacity key={index} style={styles.movieItem}>
          {/* Movie Poster (You can use an Image component to display the poster image) */}
          {/* Placeholder: Replace 'poster_url' with the actual URL of the movie poster */}
          <Image
            source={{ uri: movie.poster }}
            style={styles.moviePoster}
          />
          <View style={styles.movieDetails}>
            {/* Movie Title */}
            <Text style={styles.movieTitle}>{movie.title}</Text>
            {/* Release Date */}
            <Text>{movie.releaseDate}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moviePoster: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  movieDetails: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default Search;
