const mongoose = require('mongoose');

const globalFoodSchema = new mongoose.Schema({
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
    enum: ['kg', 'lb', 'g', 'oz'],
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add verification status for global mode
  verified: {
    type: Boolean,
    default: false,
  },
  // Add contributor information
  contributor: {
    type: String,
    required: true,
    default: 'anonymous'
  },
  // Reference to the user who created this food item
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

globalFoodSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('GlobalFood', globalFoodSchema); 