// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Use the body-parser middleware
app.use(express.json());

// Use the cors middleware
app.use(cors());


//Import Home.js router
const homeRouter = require('./Home');

// Use Home.js router for requests to the api
app.use('/home', homeRouter);


// Import Search.js router
const searchRouter = require('./Search');
// Use Search.js router for requests to the api
app.use('/search', searchRouter);

// Import Review.js router
const reviewRouter = require('./Review');
// Use Review.js router for requests to the api
app.use('/review', reviewRouter);

// Import Account.js router
const accountRouter = require('./Account');
// Use Account.js router for requests to the api
app.use('/account', accountRouter);



// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to your Express.js app!');
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
