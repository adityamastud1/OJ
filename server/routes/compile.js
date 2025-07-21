const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const router = express.Router();
const path = require("path");

router.post("/", async (req, res) => {
  const { code } = req.body;

  const filename = `code_${Date.now()}.cpp`;
  const filepath = path.join(__dirname, "..", "temp", filename);

  // 1. Save code to a .cpp file
  fs.writeFile(filepath, code, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to save file" });
    }

    // 2. Compile using g++
    const outputExe = filepath.replace(".cpp", ".out");
    const compileCommand = `g++ "${filepath}" -o "${outputExe}"`;

    exec(compileCommand, (compileErr, _, stderr) => {
      if (compileErr) {
        return res.json({ output: `Compilation Error:\n${stderr}` });
      }

      // 3. Run the compiled binary (FIX: wrap outputExe in quotes)
      exec(`"${outputExe}"`, (runErr, stdout, stderrRun) => {
        if (runErr) {
          return res.json({ output: `Runtime Error:\n${stderrRun}` });
        }

        res.json({ output: stdout });

        // Optional: clean up files
        fs.unlinkSync(filepath);
        fs.unlinkSync(outputExe);
      });
    });
  });
});

module.exports = router;
