

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session'); 
const cors = require('cors');
const problemRoutes = require('./routes/problem');

require('./config/passport');

const authRoutes = require('./routes/auth');
const app = express();
app.use(express.json());
// Enable CORS for frontend
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET, // single secret string instead of keys array
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/problems', problemRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => app.listen(5000, () => console.log("Server running on http://localhost:5000")))
.catch(err => console.error(err));
