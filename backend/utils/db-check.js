const mongoose = require('mongoose');
const config = require('./config');

console.log('Checking MongoDB connection...');
console.log('MongoDB URI:', config.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 