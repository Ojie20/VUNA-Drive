const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'driver'],
    required: true
  },
  Department: {
    type: String,
    required: function() { return this.role === 'student'; }
  },
  accNo: {
    type: String,
    required: function() { return this.role === 'driver'; }
  },
  bank: {
    type: String,
    required: function() { return this.role === 'driver'; }
  },
  LicensePlate: {
    type: String,
    required: function() { return this.role === 'driver'; },
    set: (value) => value.toUpperCase()

  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
