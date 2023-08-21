const express = require('express');
const router = express.Router();

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk";


//Root route for search (this is for testing purposes) 
router.get('/', async (req, res) => {
  res.send('Welcome to the search page!');
});




// Route for searching movies based on a query parameter
router.get('/searchResults/:query', async (req, res) => {
  try {
    const searchTerm = req.params.query;
    console.log('Received search query:', searchTerm);

    const finalSearchResults = [];


    // Results by movie title
    const resultsByTitle = await searchMoviesByTitle(searchTerm);
    
    // Results by person name
    const resultsByPerson = await searchPeopleByName(searchTerm);

    // Combine the results
    // There must be no duplicates
    //MovieIDs is a unique identifier for each movie
    //rest of the fields should remain in each object

    const combinedResults = resultsByTitle.concat(resultsByPerson);

    //remove duplicates from the combined credits and print afterwards
    //other fields should remain in each object

    const uniqueResults = [...new Map(combinedResults.map(item => [item['movieID'], item])).values()];

    // Loop through each element in uniqueCredits and add it to the finalSearchResults array

    for (const movie of uniqueResults) {
      finalSearchResults.push(movie);
    }

    // Sort the results by release date descending order

    finalSearchResults.sort((a, b) => (a.releaseDate < b.releaseDate) ? 1 : -1);

    // Return the results

    

    


    res.json(finalSearchResults);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }

});



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
    try {
      const movie_url = `${base_url}/movie/${movieID}`;
      const response = await fetch(movie_url, options);
      const movieData = await response.json();

      // Extract required details
      const movieDetails = {
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
    } catch (error) {
      console.error(`Error fetching movie details for movie ID ${movieID}:`, error);
      // Handle the error, e.g., push a placeholder object to moviesData
    }
  }

  return moviesData;
};



async function searchMoviesByTitle(query) {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    };

    const searchResponse = await fetch(url, options);
    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      return [];
    }

    const formattedResults = searchData.results.map(movie => ({
      movieID: movie.id,
      releaseDate: movie.release_date,
      posterPath: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    return formattedResults;

  } catch (error) {
    console.error('Error:', error);
    throw new Error('An error occurred while fetching search results.');
  }
}


async function searchPeopleByName(query) {
  console.log('Searching for people with name: ', query);
  const finalSearchResults = [];
  // The Route: https://api.themoviedb.org/3/search/person

  //Connect to the API
  const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk'
    }
  };

  const response = await fetch(url, options);
  const data = await response.json();
  

  //People results
  const peopleResults = data.results;
  
  //Filter result to contain only id
  const peopleIDs = peopleResults.map(person => person.id);

  console.log('Data: ', peopleIDs);


  //Get the movie credits for each person

  //The Route: https://api.themoviedb.org/3/person/{person_id}/movie_credits

  // Loop through each person ID and retieve their movie credits
  // credits are split by fields: cast, crew

  for (const personID of peopleIDs) {
    //Connect to the API
    const url = `https://api.themoviedb.org/3/person/${personID}/movie_credits`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization : 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk'
      }
    };

    const response = await fetch(url, options);
    const data = await response.json();

    //cast credits

    const castCredits = data.cast;

    // CREW CREDITS

    const crewCredits = data.crew;


    //Format the results to contain only the movie ID , poster path and release date

    const castCreditsFormatted = castCredits.map(movie => ({
      movieID: movie.id,
      releaseDate: movie.release_date,
      posterPath: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    const crewCreditsFormatted = crewCredits.map(movie => ({
      movieID: movie.id,
      releaseDate: movie.release_date,
      posterPath: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
    }));

    //Combine the cast and crew credits

    const combinedCredits = castCreditsFormatted.concat(crewCreditsFormatted);

    //Movie IDs is a unqiue identifier for each movie

    //remove duplicates from the combined credits and print afterwards
    //other fields should remain in each object

    const uniqueCredits = [...new Map(combinedCredits.map(item => [item['movieID'], item])).values()];
    

    // Loop through each element in uniqueCredits and add it to the finalSearchResults array
    for (const movie of uniqueCredits) {
      finalSearchResults.push(movie);
    }

    console.log('Final Search Results: ', finalSearchResults);
    
    return finalSearchResults;
    
  }


}





module.exports = router;



