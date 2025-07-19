const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwtUtils = require('../utils/jwt');
const User = require('../models/user');



// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed'
  })
);

// Login success
router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not Authenticated" });
  }
});

//logout 
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid'); // This is usually the session cookie
    res.status(200).json({ message: 'Logged out' });
  });
});


// Get current authenticated user
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});







// JWT based

//register(email+password)
router.post('/register', async(req, res) =>{
  const {email, password, fullName}= req.body;
  try{
    const existing = await User.findOne({email});
    if(existing){return res.status(400).json({message: "User already exists"});}
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed, fullName});
    await user.save();
    const token = jwtUtils.generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});


// LOGIN (email + password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwtUtils.generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});


module.exports = router;
