const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const User = require("../models/user");
const axios = require("axios");
const Submission = require("../models/submission");
const { ensureAuthenticated } = require("../middleware/auth");

router.post("/", async (req, res) => {
  const { problemId, code, language } = req.body;

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const testcases = problem.testcases;
  return res.json({ ok: true, testcases });
});

router.post("/:problemId", ensureAuthenticated, async (req, res) => {
  console.log("Received submission for problem:", req.params.problemId);
  try {
    const { problemId } = req.params;
    const { code, language } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const testcases = problem.testcases;
    const verdicts = [];
    console.log("testcases size is:", testcases.length);

    for (let i = 0; i < testcases.length; i++) {
      const testcase = testcases[i];
      try {
        const response = await axios.post(
          `${process.env.COMPILER_URL}/compile`,
          {
            code,
            language,
            input: testcase.input,
          },
          {
            timeout: 7000,
          }
        );

        const output = response.data.output ?? "";
        const trimmedOutput = output.trim();

        // handle errors properly
        if (trimmedOutput.startsWith("Compilation Error")) {
          return res.json({
            message: "Compilation Error",
            passed: false,
            verdicts: ["Compilation Error"],
          });
        }

        if (trimmedOutput.startsWith("Runtime Error")) {
          verdicts.push("Runtime Error");
          continue;
        }

        if (trimmedOutput === "Time Limit Exceeded") {
          verdicts.push("TLE");
          continue;
        }

        const expectedOutput = testcase.output.trim();
        const passed = trimmedOutput === expectedOutput;
        verdicts.push(passed ? "Passed" : "Failed");
      } catch (error) {
        console.error(`Error on testcase ${i + 1}:`, error.message);
        verdicts.push("Error");
      }
    }

    const allPassed = verdicts.every((v) => v === "Passed");

    const submission = await Submission.create({
      user: req.user._id,
      problem: problemId,
      language,
      code,
      verdicts,
      passed: allPassed,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalsubmissions: 1 },
    });
    const updated = await User.findById(req.user._id);
    console.log("Updated user:", updated);

    if (allPassed) {
      // Check if this is the user's first correct submission for this problem
      const alreadyPassed = await Submission.findOne({
        user: req.user._id,
        problem: problemId,
        passed: true,
        _id: { $ne: submission._id },
      });

      if (!alreadyPassed) {
        // Increment score and totalSolved
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { score: problem.score, totalSolved: 1, totalSubmissions: 1 },
        });
        const updated = await User.findById(req.user._id);
        console.log("Updated imli:", updated);
      } else {
        // Only increment totalSubmissions
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { totalSubmissions: 1 },
        });
        const updated = await User.findById(req.user._id);
        console.log("Updated omli:", updated);
      }
    } else {
      // For failed submissions, only increment totalSubmissions
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalSubmissions: 1 },
      });
    }

    res.json({
      message: "Submission evaluated",
      passed: allPassed,
      verdicts,
    });
  } catch (err) {
    console.error("Error during submission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
