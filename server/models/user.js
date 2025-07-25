const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    default: null // 👈 for local (JWT) users, this will be null
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null // 👈 only used for JWT login
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  score: {
    type: Number,
    default: 0
  }
});

// module.exports = mongoose.model('User', UserSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;