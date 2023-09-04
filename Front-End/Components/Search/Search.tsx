import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';
import { useEffect } from 'react';

type RootStackParamList = {
  Home: undefined;
  Review: { movieId: number }; // Make sure you have the correct type here
  Search: undefined;
  // ... other screen definitions ...
};

type ScreenNavigationProp<RouteName extends keyof RootStackParamList> = NavigationProp<
  RootStackParamList,
  RouteName
>;

type Movie = {
  movieID: number;
  posterPath: string;
};



const Search: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Search'>>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);

  const handleOpenReviewScreen = (movieID: number) => {
    navigation.navigate('Review', { movieId: movieID });
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieCard} onPress={() => handleOpenReviewScreen(item.movieID)}>
      <Image source={{ uri: item.posterPath }} style={styles.posterImage} />
    </TouchableOpacity>
  );


  const fetchSearchResults = async (query: string) => {
    try {
      const response = await fetch(`http://movie-review-app-ruby.vercel.app/search/searchResults/${encodeURIComponent(query)}`);
      const data = await response.json();
      console.log('Search results:', data[0]);
      // Print the fields you need from the data you get back

      console.log('Search results:', data[0].movieID);
      console.log('Search results:', data[0].posterPath);
      console.log('Search results:', data[0].releaseDate);

      setSearchResults(data); 
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };


  useEffect(() => {
    if (searchText) {
      fetchSearchResults(searchText);
    } else {
      setSearchResults([]);
    }
  }, [searchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Page</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies..."
        value={searchText}
        onChangeText={text => setSearchText(text)}
      />
  
      {searchResults.length === 0 && (
        <Text style={styles.noResultsText}>No results found.</Text>
      )}
  
      {searchText === '' && (
        <Text style={styles.emptySearchText}>Please enter a search query.</Text>
      )}
  
      {searchResults.length > 0 && searchText !== '' && (
        <FlatList
          data={searchResults}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.movieID.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
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
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  movieCard: {
    width: '48%',
    aspectRatio: 2 / 3,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  posterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  emptySearchText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
});


export default Search;