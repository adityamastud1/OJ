const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const axios = require("axios");
const Submission = require("../models/submission"); // ✅ added
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
  console.log("Received submission for problem:", req.params.problemId); // ✅
  try {
    const { problemId } = req.params;
    const { code, language } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    const testcases = problem.testcases;
    const verdicts = [];
    console.log("testcases size is:", testcases.length); // ✅

    for (let i = 0; i < testcases.length; i++) {
      const testcase = testcases[i];
      console.log("Sending to compiler:", {
        code,
        language,
        input: testcase.input,
      });

      try {
        const response = await axios.post(
          `${process.env.COMPILER_URL}/compile`,
          {
            code,
            language,
            input: testcase.input,
          },
          {
            timeout: 5000,
          }
        );

        const userOutput = response.data.output.trim();
        const expectedOutput = testcase.output.trim();

        console.log(
          `Testcase #${i + 1} Passed?`,
          userOutput === expectedOutput
        );
        verdicts.push(userOutput === expectedOutput);
      } catch (error) {
        console.error(`Error on testcase ${i + 1}:`, error.message);
        verdicts.push(false); // Treat as failed testcase
      }
    }

    const allPassed = verdicts.every((v) => v);

    // ✅ Save the submission
    await Submission.create({
      user: req.user._id, // must be available via auth middleware
      problem: problemId,
      language,
      code,
      verdicts,
      passed: allPassed,
    });

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
