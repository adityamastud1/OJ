const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  fullName: String,
  email: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user' // 👈 All users are normal by default
  }
});

module.exports = mongoose.model('User', UserSchema);
