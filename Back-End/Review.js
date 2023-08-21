const express = require('express');

const router = express.Router();

router.get('/:movieID', async (req, res) => {
  try {
    const { movieID } = req.params;
    console.log(movieID);
    const base_url = 'https://api.themoviedb.org/3';
    const api_key = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMDk2YTk2NTZmYTQwZDViNTNiOWI4MGRkZDBhNmRhNiIsInN1YiI6IjY0ZDgyZjMwZjE0ZGFkMDEwMDRjMWE5ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8uPe7Ei7vb184v6OWjaQRY-TPUXPXFenxEcKLg0HuMk";


    const movieUrl = `${base_url}/movie/${movieID}?language=en-US`;
    const creditsUrl = `${base_url}/movie/${movieID}/credits`;

    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${api_key}`,
    };

    // Fetch movie details
    const movieResponse = await fetch(movieUrl, { headers });
    const movieData = await movieResponse.json();

    // Fetch credits data
    const creditsResponse = await fetch(creditsUrl, { headers });
    const creditsData = await creditsResponse.json();

    console.log(10*"-");
    console.log(creditsUrl);
    // console.log(creditsData);
    console.log(10*"-");

    // Process cast members
    const castMembers = creditsData.cast
      ? creditsData.cast.slice(0, 5).map(member => member.name)
      : [];

    // Process directors
    const directors = creditsData.crew
      ? creditsData.crew
          .filter(member => member.job === 'Director')
          .map(member => member.name)
      : [];

    // Construct movie details object
    const movieDetails = {
      title: movieData.title,
      release_date: movieData.release_date,
      poster_path: `https://image.tmdb.org/t/p/original/${movieData.poster_path}`,
      genres: movieData.genres ? movieData.genres.map(genre => genre.name) : [],
      cast: castMembers,
      directors,
    };

    // Send movie details as JSON response
    console.log(movieDetails);
    res.json(movieDetails);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Route to submit a review
router.post('/submitReview', (req, res) => {
    console.log("/submitReview");
    const { userID, movieID, reviewData } = req.body;

  // Save the review data to your database
  // ...

  // Send a success response
  // res.json({ success: true });
  res.json({ success: false });
});

// Route to check if a user has reviewed a movie
router.post('/reviewExists', (req, res) => {
    console.log("/reviewExists");
    const { userID, movieID } = req.body;

  // Check if a review exists in your database for the given userID and movieID
  // ...

  // Send the result as a response
  // res.json({ reviewExists: review !== null });
  res.json({ reviewExists: false });
});

// Route to update a review
router.put('/updateReview', (req, res) => {
    const { userID, movieID, updatedReviewData } = req.body;
    console.log("/updateReview");
  // Update the review data in your database based on userID and movieID
  // ...

  // Send a success response
  // res.json({ success: true });
  res.json({ success: false });
});



module.exports = router;
