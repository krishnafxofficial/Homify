const mongoose = require('mongoose');


const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL)

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB server");
 })
 db.on('error', (err) => {
     console.log("MongoDB connection error:",err);
  })
  db.on('disconnected', () => {
     console.log(" MongoDB server Disconnected");
  })
 
  // Export the Database connection
module.exports = db;