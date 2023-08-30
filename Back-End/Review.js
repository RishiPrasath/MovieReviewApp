const express = require('express');

const router = express.Router();

const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://MovieReviewApp:review@cluster0.evmmugl.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
      id: movieData.id,
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

  // Get the review data JSON object
  const reviewData = req.body;

  console.log(reviewData);

  // Access the "MovieReviewApp" database
  const db = client.db('MovieReviewApp');

  // Access the "Reviews" collection
  const reviewsCollection = db.collection('Reviews');

  // Insert the review data into the collection
  reviewsCollection.insertOne(reviewData)
    .then(() => {
      console.log('Review data inserted successfully');
      res.json({ success: true });
    })
    .catch(error => {
      console.error('Error inserting review data:', error);
      res.status(500).json({ success: false, error: 'An error occurred' });
    });
});


// Route to check if a user has reviewed a movie
router.post('/reviewExists', (req, res) => {
  console.log("/reviewExists");
  console.log(req.body);
  
  const movie_Id = req.body.movieId;
  const user_ID = req.body.userid;


  console.log("Movie ID: " + movie_Id);
  console.log("User ID: " + user_ID);

  // Access the "MovieReviewApp" database
  const db = client.db('MovieReviewApp');

  // Access the "Reviews" collection
  const reviewsCollection = db.collection('Reviews');

  // Check if a review exists for the given user ID and movie ID
  reviewsCollection.findOne({ userID: user_ID, movieid : movie_Id })
    .then(review => {
      if (review) {
        console.log('Review exists');
        res.json({ exists: true, review }); // Return the review document
      } else {
        console.log('Review does not exist');
        res.json({ exists: false });
      }
    })
    .catch(error => {
      console.error('Error checking if review exists:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});




// Route to get all reviews for a movie (by movie ID)

router.get('/getReviews/:movieID', (req, res) => {
  console.log("/getReviews");

  console.log(req.params)

  //get the key movieID from params

  const movieID = parseInt( req.params.movieID);


  // Access the "MovieReviewApp" database
  const db = client.db('MovieReviewApp');

  // Access the "Reviews" collection
  const reviewsCollection = db.collection('Reviews');

  // Get all reviews for the movie
  // movieid (Field from mongoDb document) = movieID (variable from params)

  reviewsCollection.find({ movieid: movieID }).toArray()
    .then(reviews => {
      console.log(reviews);
      res.json({ reviews });
    }
    )
    .catch(error => {
      console.error('Error getting reviews:', error);
      res.status(500).json({ error: 'An error occurred' });
    });


});





// Route to update a review
router.post('/updateReview', async (req, res) => {
  try {
    const updatedReviewData = req.body;

    // Access the "MovieReviewApp" database
    const db = client.db('MovieReviewApp');

    // Access the "Reviews" collection
    const reviewsCollection = db.collection('Reviews');

    // Update the review data in the collection
    await reviewsCollection.updateOne(
      { userID: updatedReviewData.userID, movieid: updatedReviewData.movieid },
      { $set: updatedReviewData }
    );

    console.log('Review data updated successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating review data:', error);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});





module.exports = router;
