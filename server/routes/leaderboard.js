// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const Userr = require('../models/user');

router.get('/', async (req, res) => {
  try {
    const Users = await Userr.find();
    console.log(Users);  // ✅ check score is present
    res.status(200).json(Users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Users' });
  }
});


module.exports = router; // ✅ Don't forget this line
