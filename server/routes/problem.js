const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { ensureAdmin } = require('../middleware/auth');

// GET /problems - list all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// GET /problems/:id - fetch single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problem' });
  }
});

// POST /problems - Admin only
router.post('/', ensureAdmin, async (req, res) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ message: 'Problem created', problem: newProblem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create problem' });
  }
});


module.exports = router;
