import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { MovieData } from './types';
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import axios from 'axios'; 



const screenWidth = Dimensions.get('window').width;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}



const Home: React.FC<Props> = ({ navigation }) => {
  
  const [newlyReleasedMovies, setNewlyReleasedMovies] = useState<MovieData[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MovieData[]>([]);

  useEffect(() => {
    console.log('Fetching data...');
    
    axios.get('http://192.168.0.152:4000/home/new-releases') // Update hostname here
      .then(response => {
        console.log('Newly released movies:', response.data);
        setNewlyReleasedMovies(response.data);
      })
      .catch(error => console.error('Error fetching newly released movies:', error));

    axios.get('http://192.168.0.152:4000/home/top-rated') // Update hostname here
      .then(response => setTopRatedMovies(response.data))
      .catch(error => console.error('Error fetching top-rated movies:', error));
  }, []);
  
  const renderMovieSection = (movies: MovieData[], title: string) => {
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {movies.map((movie, index) => (
            <TouchableOpacity
              key={index}
              style={styles.movieCard}
              onPress={() => 
                navigation.navigate('Review', { movieId: movie.movieID }
              )}
            >
              {movie.poster_path ? ( // Check if poster URL is available
                <Image source={{ uri: movie.poster_path }} style={styles.moviePoster} />
              ) : (
                <Text>No Poster Available</Text>
              )}
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieDirector}>{movie.director}</Text>
              <Text style={styles.movieCast}>{movie.cast.map(cast => cast).join('\n ')}</Text>
            </TouchableOpacity>
        ))}

        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* {renderMovieSection(yourTop5Movies, 'Your Top 5 Movies')} */}
      {renderMovieSection(newlyReleasedMovies, 'Newly Released Films')}
      {/* {renderMovieSection(bookmarkedMovies, 'Bookmarked Films')} */}
      {renderMovieSection(topRatedMovies, 'All Time Hits')}
    </ScrollView>
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
  movieCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  moviePoster: {
    width: screenWidth * 0.6,
    height: 450,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  movieDirector: {
    fontSize: 12,
    color: 'gray',
  },
  movieCast: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Home;
