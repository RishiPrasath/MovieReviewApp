const express = require('express');
const router = express.Router();




// Helper function to fetch movie details
const fetchMovieDetails = async (movieIDs) => {
  const base_url = 'https://api.themoviedb.org/3';
  const api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk"; 

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${api_key}`,
    },
  };

  const moviesData = [];

  for (const movieID of movieIDs) {
    const movie_url = `${base_url}/movie/${movieID}`;
    const response = await fetch(movie_url, options);
    const movieData = await response.json();

    // Extract required details
    const movieDetails = {
      movieID: movieID,
      title: movieData.title,
      poster_path: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
      cast: [],
    };

    // Fetch cast members
    const credits_url = `${base_url}/movie/${movieID}/credits`;
    const creditsResponse = await fetch(credits_url, options);
    const creditsData = await creditsResponse.json();

    for (let i = 0; i < 3 && i < creditsData.cast.length; i++) {
      movieDetails.cast.push(creditsData.cast[i].name);
    }

    moviesData.push(movieDetails);
  }

  return moviesData;
};








// Route for the top 5 movies
router.get('/top5', (req, res) => {
    res.json("yourTop5Movies");
    //Requires database to get this done
});
  
// Route for newly released movies
router.get('/new-releases', async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  const api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk";

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${api_key}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Extract movie IDs
    const movieIDs = data.results.map(movie => movie.id);

    // Fetch movie details using the helper function
    const moviesData = await fetchMovieDetails(movieIDs);

    // Send the response
    res.json(moviesData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route for bookmarked movies
router.get('/bookmarked', (req, res) => {
  res.json("bookmarkedMovies");
  //Requires database to get this done 
});

// Route for top rated movies
router.get('/top-rated', (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk' 
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      // Process the data and fetch additional movie details using the helper function
      const movieIDs = data.results.map(movie => movie.id);
      return fetchMovieDetails(movieIDs);
    })
    .then(movieDetails => {
      res.json(movieDetails);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});

module.exports = router;
