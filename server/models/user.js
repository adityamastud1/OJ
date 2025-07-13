const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: String,
  fullName: String,
  email: String,
  role: { type: String, default: "user" }
});

module.exports = mongoose.model('User', UserSchema);
