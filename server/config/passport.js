const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

// Dynamically set callback URL based on environment
const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://algou-oj-backend.onrender.com/auth/google/callback"
    : "http://localhost:5000/auth/google/callback";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);

    const newUser = await User.create({
      googleId: profile.id,
      fullName: profile.displayName,
      email: profile.emails[0].value
    });

    done(null, newUser);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});
