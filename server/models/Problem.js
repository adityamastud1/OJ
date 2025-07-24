const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  hidden: { type: Boolean, default: false },
  timeLimit: { type: Number, default: 1000 },
  memoryLimit: { type: Number, default: 256 }
});

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  score: { type: Number },
  testcases: [TestCaseSchema],
  tags: {
    type: [String],
    default: [],
    validate: [arr => arr.length <= 5, "You can specify up to 5 tags"]
  }
});

module.exports = mongoose.models.Problem || mongoose.model("Problem", ProblemSchema);
