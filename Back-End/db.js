const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://MovieReviewApp:review@cluster0.evmmugl.mongodb.net/';
const dbName = 'MovieReviewApp'; // Replace with your actual database name

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports = { client, connectDB };
