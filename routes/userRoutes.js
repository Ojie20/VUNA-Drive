const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register as student
router.post('/register/student', async (req, res) => {
  try {
    const { firstName,Department, lastName, email, phoneNo, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      Department,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      role: 'student'
    });
    const newuser = await user.save();
    const token =  newuser._id 
    res.cookie('Vunatoken', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'Strict'
    });
    return res.redirect('/shome');
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Register as driver
router.post('/register/driver', async (req, res) => {
  try {
    const { firstName,LicensePlate, lastName, email, phoneNo, password, accNo, bank } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      LicensePlate,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      role: 'driver',
      accNo,
      bank
    });
    const newuser = await user.save();
    const token =  newuser._id 
    res.cookie('Vunatoken', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'Strict'
    });
    return res.redirect('/dhome'); 
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token =  user._id 
    res.cookie('Vunatoken', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'Strict'
    });
    if (user.role === "student") {
      return res.redirect('/shome');  
    } else {
      return res.redirect('/dhome');  
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add this new route
router.get('/driver/:id', async (req, res) => {
    try {
        const driver = await User.findById(req.params.id).select('-password');
        if (!driver || driver.role !== 'driver') {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching driver details' });
    }
});

module.exports = router;
