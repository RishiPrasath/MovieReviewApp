const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB connection string
const uri = 'mongodb+srv://MovieReviewApp:review@cluster0.evmmugl.mongodb.net/';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
});

// Listen for the 'exit' event on the process
process.on('exit', () => {
  console.log('Closing MongoDB connection...');
  // Close the MongoDB client connection
  client.close()
    .then(() => {
      console.log('MongoDB connection closed.');
    })
    .catch(err => {
      console.error('Error closing MongoDB connection:', err);
    });
});




// Test the root

router.get('/', (req, res) => {
  res.send('Welcome to your account route!');
});







// Route for user registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Access the "MovieReviewApp" database
    const db = client.db('MovieReviewApp');

    // Access the "Users" collection
    const usersCollection = db.collection('Users');

    // Check if a user with the same username already exists
    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert the new user into the collection
    const newUser = { username, password };
    const result = await usersCollection.insertOne(newUser);

    console.log(`Inserted user with id: ${result.insertedId}`);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'An error occurred somewhere' });
  }
});


// Route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log(`User ${username} is attempting to log in...`);

  try {
    // Access the "MovieReviewApp" database
    const db = client.db('MovieReviewApp');

    // Access the "Users" collection
    const usersCollection = db.collection('Users');

    // Check if a user with the same username exists
    const existingUser = await usersCollection.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided plaintext password with the stored password
    if (existingUser.password === password) {
      // Password matches, so user is successfully logged in
      res.json({
        id: existingUser._id, // Assuming your user document has an "_id" field
        username: existingUser.username,
        // Add other user data here
      });
    } else {
      // Password doesn't match
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

module.exports = router;
