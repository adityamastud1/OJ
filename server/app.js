require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session'); 
const cors = require('cors');
require('./config/passport');       // your Google strategy, serialize/deserialize
const authRoutes       = require('./routes/auth');
const problemRoutes    = require('./routes/problem');
const leaderboardRoutes= require('./routes/leaderboard');
const aireviewRoutes    = require('./routes/aireview');
const app = express();
app.use(express.json());


console.log("CLIENT_URL:", process.env.CLIENT_URL); // ✅ Add this line

const allowedOrigins = [
  'http://localhost:3000',             // dev
  'https://algou-oj.vercel.app'       // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: process.env.SESSION_SECRET, // single secret string instead of keys array
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/problems', problemRoutes);
app.use('/leaderboard',leaderboardRoutes);
app.use('/api/aireview', aireviewRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
.catch(err => console.error(err));


const compileRoute = require("./routes/compile");
app.use("/api/compile", compileRoute);


const submitRoutes = require('./routes/submit');
app.use('/api/submit', submitRoutes);

