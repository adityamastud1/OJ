const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  }
});


const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  sampleInput: String,
  sampleOutput: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  testcases: [TestCaseSchema],
  tags: {
    type: [String],
    default: [],
    validate: [arr => arr.length <= 5, "You can specify up to 5 tags"]
  }
});

module.exports = mongoose.model('Problem', ProblemSchema);
