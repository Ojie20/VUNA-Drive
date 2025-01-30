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
  accNo: {
    type: String,
    required: function() { return this.role === 'driver'; }
  },
  bank: {
    type: String,
    required: function() { return this.role === 'driver'; }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
