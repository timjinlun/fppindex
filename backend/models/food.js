// backend/models/Food.js

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    minlength: [3, 'Food name must be at least 3 characters long'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'], 
    min: [0, 'Price cannot be negative'],
  },
  portion: {
    type: String,
    required: [true, 'Portion is required'],
    enum: ['kg', 'lb', 'g', 'oz'], // Example units
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

foodSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Food', foodSchema);